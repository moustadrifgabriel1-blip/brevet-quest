/* Migration de la progression vers la v3 (FSRS) et fusion de Mesure Quest dans Brevet Quest.
   Script classique : window.Migration = { migrerV3, fusionnerMesure, convertirCarte, remapId }.
   Ne modifie jamais l'objet reçu : chaque fonction rend une copie.

   État v2 (bq1 ou mq2) : S.v = 2, S.sr[id] = { n, ef, iv, due, f } (SM-2 allégé), id = « chapitre-empreinte ».
   État v3 : S.v = 3, S.sr[id] = { s, d, due, last, n, f } (carte FSRS, voir fsrs.js).

   Conversion d'une mémoire SM-2 :
     s    = max(iv, 1) * (1 + 0,005 * min(n, 4))  la stabilité vaut l'intervalle gagné, avec un
            léger bonus de réussites (2 % au plus) qui ne fait jamais passer un intervalle de 20
            jours au delà de 21 : les comptes « ancrées » restent identiques.
     d    = clamp(11 - 2 * ef, 1, 10)             ef 2,5 (neuf) donne 6, ef 3 donne 5, ef 1,3 donne 8,4
     due  conservé
     last = due - iv                              la v2 ne stocke pas la date de révision, on la déduit
     n, f conservés
   Une carte jamais révisée (iv = 0, n = 0) garde s = 1 et due conservée : elle reste due tout de suite.

   Mesure Quest : ses 14 chapitres deviennent les chapitres 47 à 60 de la v5. Les identifiants
   « chapitre-empreinte » sont remappés en gardant l'empreinte, ainsi que les clés de done et fr. */
(function (root) {
  'use strict';

  var FSRS = root.FSRS || (typeof require === 'function' ? require('./fsrs.js') : null);
  if (!FSRS) throw new Error('fsrs.js doit être chargé avant migrer.js');

  var OFFSET_MESURE = 46;     // chapitres Brevet 1..46, Mesure 1..14 devient 47..60
  var NCH_MESURE = 14;

  var clamp = function (x, lo, hi) { return x < lo ? lo : x > hi ? hi : x; };
  var r2 = function (x) { return Math.round(x * 100) / 100; };
  var copie = function (o) { return JSON.parse(JSON.stringify(o)); };
  var estCarteV3 = function (r) { return r && typeof r === 'object' && typeof r.s === 'number' && typeof r.d === 'number'; };

  function convertirCarte(r) {
    if (estCarteV3(r)) return copie(r);
    var iv = Math.max(0, +r.iv || 0), n = Math.max(0, +r.n || 0), f = Math.max(0, +r.f || 0);
    var ef = typeof r.ef === 'number' ? r.ef : 2.5;
    var due = typeof r.due === 'number' ? r.due : 0;
    var s = Math.max(iv, 1) * (1 + 0.005 * Math.min(n, 4));
    var d = clamp(11 - 2 * ef, 1, 10);
    return { s: r2(s), d: r2(d), due: due, last: due - iv, n: n, f: f };
  }

  /* Un état v2 (Brevet ou Mesure) devient v3. Un état déjà v3 est rendu tel quel (copie). */
  function migrerV3(S) {
    var o = copie(S || {});
    if ((o.v || 0) >= 3) return o;
    var sr = {};
    for (var id in (o.sr || {})) sr[id] = convertirCarte(o.sr[id]);
    o.sr = sr;
    o.v = 3;
    return o;
  }

  /* « 3-k7x2 » devient « 49-k7x2 ». Un id déjà au delà de 14 est laissé tel quel. */
  function remapId(id) {
    var m = /^(\d+)-(.+)$/.exec(id);
    if (!m) return id;
    var ch = +m[1];
    if (ch < 1 || ch > NCH_MESURE) return id;
    return (ch + OFFSET_MESURE) + '-' + m[2];
  }
  /* Clé de rappel libre « 3.2 » devient « 49.2 ». */
  function remapFr(k) {
    var m = /^(\d+)\.(\d+)$/.exec(k);
    if (!m) return k;
    var ch = +m[1];
    if (ch < 1 || ch > NCH_MESURE) return k;
    return (ch + OFFSET_MESURE) + '.' + m[2];
  }
  function remapDone(k) {
    var ch = +k;
    if (!(ch >= 1 && ch <= NCH_MESURE)) return k;
    return String(ch + OFFSET_MESURE);
  }

  /* Fusion : les deux états sont d'abord portés en v3. Une entrée Brevet n'est jamais écrasée
     par une entrée Mesure de même clé (après remappage, une collision serait un bug de données,
     on garde Brevet). Rendue idempotente par le marqueur mesureImporte. */
  function fusionnerMesure(Sbrevet, Smesure) {
    var B = migrerV3(Sbrevet);
    if (!Smesure || B.mesureImporte) return B;
    var M = migrerV3(Smesure);
    var k;

    B.xp = (B.xp || 0) + (M.xp || 0);
    B.coins = (B.coins || 0) + (M.coins || 0);
    B.freeze = (B.freeze || 0) + (M.freeze || 0);

    var sb = B.streak || { last: '', n: 0, best: 0, ms: 0 }, sm = M.streak || {};
    B.streak = {
      last: (sm.last || '') > (sb.last || '') ? sm.last : (sb.last || ''),
      n: Math.max(sb.n || 0, sm.n || 0),
      best: Math.max(sb.best || 0, sm.best || 0, sb.n || 0, sm.n || 0),
      ms: Math.max(sb.ms || 0, sm.ms || 0)
    };

    B.sr = B.sr || {};
    for (k in (M.sr || {})) { var id = remapId(k); if (!(id in B.sr)) B.sr[id] = copie(M.sr[k]); }

    B.done = B.done || {};
    for (k in (M.done || {})) { var dk = remapDone(k); if (!(dk in B.done)) B.done[dk] = copie(M.done[k]); }

    B.fr = B.fr || {};
    for (k in (M.fr || {})) { var fk = remapFr(k); if (!(fk in B.fr)) B.fr[fk] = copie(M.fr[k]); }

    /* hist : par jour, les nombres de réponses s'additionnent ; un gel ne remplace jamais un nombre. */
    B.hist = B.hist || {};
    for (k in (M.hist || {})) {
      var a = B.hist[k], b = M.hist[k];
      if (typeof a === 'number' && typeof b === 'number') B.hist[k] = a + b;
      else if (typeof a === 'number') { /* on garde a */ }
      else if (typeof b === 'number') B.hist[k] = b;
      else if (a === undefined) B.hist[k] = b;
    }

    if ((M.lastOpen || '') > (B.lastOpen || '')) B.lastOpen = M.lastOpen;
    B.ts = Math.max(B.ts || 0, M.ts || 0);
    /* boss : les combats disparaissent en v5, les boss de Mesure ne sont pas repris. */
    B.mesureImporte = true;
    return B;
  }

  var Migration = {
    OFFSET_MESURE: OFFSET_MESURE,
    convertirCarte: convertirCarte,
    migrerV3: migrerV3,
    remapId: remapId,
    remapFr: remapFr,
    fusionnerMesure: fusionnerMesure
  };
  root.Migration = Migration;
  if (typeof module !== 'undefined' && module.exports) module.exports = Migration;
})(typeof window !== 'undefined' ? window : globalThis);
