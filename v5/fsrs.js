/* FSRS pour Brevet Quest v5. Script classique, sans module ES : le moteur est un script inline.
   Exposé sous window.FSRS (et module.exports quand Node charge le fichier, pour les tests).

   Algorithme : FSRS-5 (open-spaced-repetition, fsrs-rs et py-fsrs 5.x, 2024).
   Poids par défaut publiés pour FSRS-5 (19 paramètres) :
     w0..w3   stabilité initiale selon le grade (À revoir, Difficile, Bien, Facile)
     w4, w5   difficulté initiale
     w6       pente de la difficulté selon le grade
     w7       retour vers la difficulté moyenne
     w8..w10  croissance de la stabilité après réussite
     w11..w14 stabilité après oubli
     w15      malus « Difficile », w16 bonus « Facile »
     w17, w18 révision le même jour
   Courbe d'oubli : R(t) = (1 + F * t / S) ^ C avec F = 19/81 et C = -0,5, choisie pour que
   l'intervalle qui ramène R à 0,9 soit exactement S jours.

   Carte, champs courts pour tenir dans la sauvegarde localStorage :
     s    stabilité en jours (réel, deux décimales)
     d    difficulté de 1 à 10 (réel, deux décimales)
     due  jour prévu (dayN, entier)
     last jour de la dernière révision (dayN, entier)
     n    réussites consécutives depuis le dernier échec (comme en SM-2)
     f    nombre total d'échecs (comme en SM-2)

   Grades : 1 À revoir, 2 Difficile, 3 Bien, 4 Facile.
   Les jours sont des entiers dayN = floor(ms / 864e5), comme dans le moteur. */
(function (root) {
  'use strict';

  var W = [0.40255, 1.18385, 3.173, 15.69105, 7.1949, 0.5345, 1.4604, 0.0046, 1.54575,
           0.1192, 1.01925, 1.9395, 0.11, 0.29605, 2.2698, 0.2315, 2.9898, 0.51655, 0.6621];
  var FACTOR = 19 / 81;
  var DECAY = -0.5;
  var RETENTION = 0.9;                 // cible de rétention
  var FUZZ = 0.05;                     // fuzz de ±5 % sur l'intervalle
  var S_MIN = 0.01, S_MAX = 36500;
  /* Plafond : aucune révision prévue après le 8 mars 2027 (dayN calculé en UTC, comme dayN('2027-03-08')). */
  var EXAM_CAP = Math.floor(Date.UTC(2027, 2, 8) / 864e5);
  /* Part de la fenêtre restante réservée avant l'étalement : une carte plafonnée ne peut pas
     retomber avant la moitié du chemin qui reste jusqu'au 8 mars. */
  var ETAL_MIN = 0.5;
  /* Jour de l'examen (22 mars 2027) et rétention visée ce jour là. Une carte qui tiendra au moins
     à 85 % le jour de l'examen sans autre révision n'est plus replacée avant le 8 mars : elle sort
     de la file. Seules les cartes fragiles sont ramenées sous le plafond, sinon toutes les cartes
     mûres convergeaient vers le 8 mars (1 491 cartes ce jour là dans la simulation de l'audit). */
  var EXAM_DAY = Math.floor(Date.UTC(2027, 2, 22) / 864e5);
  var R_EXAM = 0.85;

  /* Empreinte FNV-1a d'un identifiant, ramenée dans [0, 1[ : l'étalement des échéances doit être
     reproductible (même carte, même jour, même résultat) pour rester testable et stable entre appareils. */
  function empreinte(x) {
    var h = 2166136261, str = String(x);
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return (h >>> 0) / 4294967296;
  }

  var clamp = function (x, lo, hi) { return x < lo ? lo : x > hi ? hi : x; };
  var r2 = function (x) { return Math.round(x * 100) / 100; };
  var dayN = function (d) { return Math.floor(new Date(d).getTime() / 864e5); };
  var todayN = function () { return dayN(new Date()); };

  function initStability(g) { return clamp(W[g - 1], S_MIN, S_MAX); }
  function initDifficulty(g) { return clamp(W[4] - Math.exp(W[5] * (g - 1)) + 1, 1, 10); }

  /* Probabilité de rappel après t jours pour une stabilité s. */
  function forgetting(t, s) {
    if (t <= 0) return 1;
    return Math.pow(1 + FACTOR * t / s, DECAY);
  }

  /* Intervalle (jours) qui ramène la rétention à r, sans plafond ni fuzz. */
  function interval(s, r) {
    r = r || RETENTION;
    return s / FACTOR * (Math.pow(r, 1 / DECAY) - 1);
  }

  function nextDifficulty(d, g) {
    var delta = -W[6] * (g - 3);
    var lin = d + delta * (10 - d) / 9;            // amortissement linéaire
    var mean = W[7] * initDifficulty(4) + (1 - W[7]) * lin;   // retour vers la moyenne
    return clamp(mean, 1, 10);
  }

  function stabilityAfterRecall(d, s, r, g) {
    var hard = g === 2 ? W[15] : 1;
    var easy = g === 4 ? W[16] : 1;
    var inc = Math.exp(W[8]) * (11 - d) * Math.pow(s, -W[9]) * (Math.exp(W[10] * (1 - r)) - 1) * hard * easy + 1;
    return clamp(s * inc, S_MIN, S_MAX);
  }

  function stabilityAfterForget(d, s, r) {
    var sf = W[11] * Math.pow(d, -W[12]) * (Math.pow(s + 1, W[13]) - 1) * Math.exp(W[14] * (1 - r));
    return clamp(Math.min(sf, s), S_MIN, S_MAX);
  }

  function stabilitySameDay(s, g) {
    return clamp(s * Math.exp(W[17] * (g - 3 + W[18])), S_MIN, S_MAX);
  }

  /* Fuzz symétrique de ±5 %, uniquement à partir de 3 jours (en dessous, il n'aurait pas de sens en jours entiers). */
  function fuzzed(iv, rng) {
    if (iv < 3) return iv;
    var u = (rng || Math.random)();
    return iv * (1 + FUZZ * (2 * u - 1));
  }

  /* Nouvelle carte : jamais vue, due tout de suite. */
  function init(now) {
    var t = now === undefined ? todayN() : now;
    return { s: 0, d: 0, due: t, last: 0, n: 0, f: 0 };
  }

  function retrievability(card, now) {
    var t = now === undefined ? todayN() : now;
    if (!card || !card.s || !card.last) return 0;
    return forgetting(t - card.last, card.s);
  }

  /* Intervalle prévu (jours entiers, plafonné, sans fuzz) : utile pour les statistiques. */
  function intervalOf(card) {
    if (!card || !card.s) return 0;
    return Math.max(1, Math.round(interval(card.s)));
  }

  /* Révision. opts.fuzz = false désactive le fuzz (tests), opts.rng remplace Math.random,
     opts.id donne l'identifiant de la carte : il sert à étaler les échéances sous le plafond. */
  function review(card, grade, now, opts) {
    opts = opts || {};
    var g = clamp(Math.round(grade), 1, 4);
    var t = now === undefined ? todayN() : now;
    var c = card && card.s ? card : init(t);
    var s, d;
    if (!c.s) {                                   // première révision
      s = initStability(g);
      d = initDifficulty(g);
    } else {
      var elapsed = Math.max(0, t - (c.last || t));
      d = nextDifficulty(c.d, g);
      if (elapsed === 0) {
        s = stabilitySameDay(c.s, g);
      } else {
        var r = forgetting(elapsed, c.s);
        s = g === 1 ? stabilityAfterForget(c.d, c.s, r) : stabilityAfterRecall(c.d, c.s, r, g);
      }
    }
    var iv = interval(s, opts.ret);
    if (opts.fuzz !== false) iv = fuzzed(iv, opts.rng);
    iv = Math.max(1, Math.round(iv));
    if (g === 1) iv = 1;                          // un échec revient demain
    var due = t + iv;
    /* Plafond du 8 mars, étalé. Tout ramener au 8 mars ferait tomber toutes les cartes mûres le
       même jour : on tire l'échéance entre la moitié de la fenêtre restante et le 8 mars, de façon
       déterministe à partir de l'identifiant de la carte et du jour (opts.id), sinon du générateur fourni. */
    if (t < EXAM_CAP && due > EXAM_CAP && forgetting(EXAM_DAY - t, s) < R_EXAM) {
      var bas = t + Math.max(1, Math.round((EXAM_CAP - t) * ETAL_MIN));
      if (bas > EXAM_CAP) bas = EXAM_CAP;
      var u = opts.id !== undefined && opts.id !== null ? empreinte(opts.id + ':' + t) : (opts.rng || Math.random)();
      due = bas + Math.round(u * (EXAM_CAP - bas));
      if (due > EXAM_CAP) due = EXAM_CAP;
      if (due <= t) due = Math.min(EXAM_CAP, t + 1);
    }
    return {
      s: r2(s),
      d: r2(d),
      due: due,
      last: t,
      n: g === 1 ? 0 : (c.n || 0) + 1,
      f: (c.f || 0) + (g === 1 ? 1 : 0)
    };
  }

  var FSRS = {
    VERSION: 'FSRS-5',
    W: W.slice(),
    RETENTION: RETENTION,
    EXAM_CAP: EXAM_CAP,
    EXAM_DAY: EXAM_DAY,
    R_EXAM: R_EXAM,
    forgetting: forgetting,
    ETAL_MIN: ETAL_MIN,
    empreinte: empreinte,
    FUZZ: FUZZ,
    dayN: dayN,
    init: init,
    review: review,
    retrievability: retrievability,
    interval: intervalOf,
    initDifficulty: initDifficulty
  };

  root.FSRS = FSRS;
  if (typeof module !== 'undefined' && module.exports) module.exports = FSRS;
})(typeof window !== 'undefined' ? window : globalThis);
