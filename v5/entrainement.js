/* ===================================================================
   ENTRAÎNEMENT v5 : données en clair, chargées avant le moteur.
   ORAL2 : scénarios d'oral en plus de SCEN (data.js), avec grille de 4 critères notés 0 à 2.
   CLASSEUR : exercices « quelle page, quelle formule, en moins de 60 s ».
   GRILLES : grilles génériques (anciens scénarios de l'épreuve 2, études de cas).
   Chaque scénario porte une clé k stable : la progression S.fr en dépend, ne la change jamais.
   Sources : classe-backend/cours-texte (AA01, AA02, AE01, AE06, AE12, AE13) et classeur/gen_examen20.py.
   =================================================================== */
window.ENTR={
GRILLES:{
 /* scénarios de SCEN (épreuve 2) qui n'ont pas de grille propre */
 oral2:['Écoute et reformulation, sans interrompre','Faits concrets, message en « je »','Outils du cours nommés et bien utilisés (DESC, RAVI, autorité)','Solution concrète, suivi et ton assuré'],
 /* études de cas, épreuve 1 */
 cas:['Compréhension du mandat','Méthode et démarche visibles','Chiffrage juste, unités et arrondis','Sécurité et normes citées','Présentation claire et lisible']
},
ORAL2:[
/* ---------- épreuve 3 : planification et réalisation ---------- */
{k:'o3-raccordement',ep:3,d:5,t:'Présenter un projet de raccordement',
 s:'Un client construit une villa avec pompe à chaleur et installation photovoltaïque. Le jury te demande de présenter le projet de raccordement, de la demande jusqu\'à la mise en service.',
 o:'point de raccordement, avis d\'installation, contrôles de calcul',
 tr:['<b>Partir des données</b> : puissance commandée, consommateurs prévus, raccordement existant ou non, injection éventuelle.','<b>Distinguer le point de raccordement</b> (bornes d\'entrée du coupe-surintensité de raccordement, OIBT art. 2) <b>du point de couplage commun</b>, fixé par le gestionnaire de réseau selon la puissance de court-circuit, la puissance, l\'injection et l\'extension future.','<b>La procédure</b> : permis de construire, délai d\'opposition de 30 jours, puis avis d\'installation au gestionnaire de réseau, avec la demande de raccordement technique pour la pompe à chaleur et le photovoltaïque.','<b>Les contrôles de calcul</b> : dimensionnement sur le fusible, chute de tension, mise au neutre, sélectivité.'],
 g:['Démarche dans l\'ordre, de la demande à la mise en service','Point de raccordement et point de couplage bien distingués','Bons formulaires et bons acteurs (gestionnaire de réseau, installateur)','Justification technique et économique'],
 src:'AE01 §5.8 et §6.1 à §6.4'},
{k:'o3-cable',ep:3,d:4,t:'Justifier un choix de câble',
 s:'Pour une nouvelle alimentation en lotissement, ton chef propose un câble et te demande de justifier la section devant le maître d\'ouvrage.',
 o:'courant admissible, températures, coûts du cycle de vie',
 tr:['<b>La section se choisit</b> sur la température maximale du conducteur et sur les coûts du cycle de vie (acquisition, pertes, pose, durée de vie).','<b>Températures du PE réticulé</b> : 90 °C en continu, 110 °C en urgence, 250 °C en court-circuit. Le régime d\'urgence reste limité dans le temps.','<b>Jamais plus de 100 %</b> du courant admissible, en service normal comme en réalimentation. Câbles en parallèle : même type, même longueur.','<b>Câble de raccordement dimensionné sur le fusible</b>, lu dans le tableau du cours ; au delà de 95 mm² Cu ou 150 mm² Al, il part de la station.'],
 g:['Critères complets : thermique, chute de tension, court-circuit, économie','Tableau lu correctement','Cohérence avec le fusible','Argumentation claire pour un non spécialiste'],
 src:'AE01 §4.1, §4.2 et §4.6'},
{k:'o3-manoeuvre',ep:3,d:5,t:'Expliquer une manœuvre',
 s:'Tu dois interconnecter deux stations transformatrices pour libérer un tronçon. Explique au jury la manœuvre, de la commande à la sécurisation du lieu de travail.',
 o:'commande et ordre de manœuvre, conditions de couplage, 5 règles',
 tr:['<b>Une manœuvre est un travail</b> : une erreur peut provoquer un arc. Équipement selon la directive ESTI 407.','<b>Conditions de couplage</b> : concordance des phases, écart de tension faible, même groupe de couplage ; en parallèle, rapport de puissance et tension de court-circuit proches.','<b>Commande puis ordre de manœuvre</b> : lieu, niveau de tension, cellule, appareil, manœuvre. Un ordre oral est répété avant exécution.','<b>Sécurisation par le responsable des travaux</b> selon les 5 règles de sécurité. En BT, mise à terre obligatoire : retour de tension possible par les onduleurs privés.'],
 g:['Rôles clairs (responsable d\'installation, responsable des travaux)','Étapes dans le bon ordre','Vocabulaire exact','Vérifications systématiques avant et après'],
 src:'AE06 §3.3 et §3.4'},
{k:'o3-chantier',ep:3,d:5,t:'Organiser un chantier de fouille',
 s:'Tu pilotes la pose d\'un câble en fouille dans une rue de village. Présente comment tu prépares et organises le chantier avant le premier coup de pelle.',
 o:'préparation en étapes, relevé des conduites, coordination',
 tr:['<b>Préparer dans l\'ordre</b> : offres, choix de l\'entrepreneur et adjudication, information des autres propriétaires de conduites, des autorités et de la presse, relevé des conduites, autorisation de fouille, signalisation.','<b>Relevé des conduites obligatoire</b> avant tout génie civil (OTConst).','<b>Check-list</b> : droit de conduite, plans des autres réseaux, signalisation avec police, commune et canton, réservation des machines.','<b>Coordonner tôt</b> avec les autres réseaux pour des fouilles communes ; informer les riverains.'],
 g:['Planification structurée','Acteurs identifiés','Ressources et délais maîtrisés','Risques anticipés'],
 src:'AE12 §2.2 et §2.3'},
{k:'o3-securite',ep:3,d:4,t:'La sécurité sur une fouille',
 s:'Sur ton chantier, la fouille atteint 1,8 m et un piéton passe à côté. Le jury te demande quelles mesures de sécurité tu imposes.',
 o:'OTConst, étayage, accès, protection des tiers',
 tr:['<b>Au delà de 1,5 m, on étaie</b> (OTConst), selon les règles de hauteur et d\'espacement du cours.','<b>Largeur minimale</b> de fouille selon la profondeur, tableau du cours.','<b>Accès</b> : échelle dès 0,5 m de profondeur, garde-corps en cas de vide.','<b>Tiers</b> : signalisation convenue avec la police et la commune, déblais déposés sans mettre personne en danger. EPI selon la directive ESTI 407.'],
 g:['Bases légales citées (OTConst, CFST, ESTI)','Analyse des risques','Mesures concrètes et chiffrées','Protection des tiers'],
 src:'AE12 §2.2, §2.3 et §3.4 ; AE06 §3.3.1'},
{k:'o3-tirage',ep:3,d:5,t:'Préparer un tirage de câble',
 s:'Un câble unipolaire doit être tiré sur 250 m en tube, avec deux coudes. Explique au jury comment tu vérifies que le tirage est possible et comment tu l\'organises.',
 o:'effort admissible, frottement, rayon de courbure, température',
 tr:['<b>Effort admissible</b> : F = n · A · σ adm, avec σ adm tiré du tableau (unipolaire Cu 60 N/mm², Al 30 N/mm²). En pratique, 20 000 N au maximum.','<b>Effort de tirage</b> : F = M · g · l · µ, multiplié dans chaque coude. On prend le coefficient de frottement le plus défavorable.','<b>Rayon de courbure</b> minimal : K fois le diamètre, selon le tableau (BT unipolaire isolé plastique : 12 fois).','<b>Pose</b> : température minimale de pose, lubrifier dès le début, tirer sans à-coups ni interruption, surveiller la force en continu, coudes au début du sens de traction.'],
 g:['Formules justes, avec unités','Valeurs de tableau correctes','Logistique : touret, sens de tirage, lubrification','Conclusion vérifiée : condition remplie ou non'],
 src:'AE12 §11.2 et §12.1 à §12.9'},
{k:'o3-dimension',ep:3,d:5,t:'Dimensionner une ligne BT',
 s:'Un hameau à 350 m de la station doit être alimenté. Explique au jury comment tu vérifies le dimensionnement de la ligne.',
 o:'chute de tension, court-circuit, mise au neutre',
 tr:['<b>Tension au client</b> : 230 V ± 10 % (EN 50160), viser ± 6 % pour une nouvelle installation. Au delà d\'environ 200 m, la chute de tension limite la charge.','<b>Chute de tension</b> : formule du cours selon le type de ligne (câble à 60 °C, aérien à 80 °C), puis Δu % = ΔU · 100 / U.','<b>Court-circuit unipolaire</b> : Icc = U ph / (Z tr + 2 · Z L), calculé à 20 °C ; il doit faire déclencher le fusible (mise au neutre).','<b>Conclure</b> : comparer aux limites, choisir la section, dire quelle mesure confirmera le calcul.'],
 g:['Bonne formule selon le type de ligne','Hypothèses annoncées (température, cos φ)','Comparaison aux limites','Conclusion et contrôle proposé'],
 src:'AE01 §5.4 à §5.8'},
{k:'o3-reception',ep:3,d:4,t:'Réceptionner l\'ouvrage',
 s:'La pose est terminée. Le jury te demande comment tu réceptionnes l\'ouvrage et mets le raccordement en service.',
 o:'SIA 118, calibrage, mesures, protocoles',
 tr:['<b>Réception des tubes</b> selon la norme SIA 118, procès-verbal signé par les deux parties.','<b>Calibrage des tubes</b> (déformation maximale admise), inspection vidéo en complément.','<b>Mise en service</b> : section, fusibles, serrages, sectionneur de neutre fermé, couvercles, tube étanchéifié ; mesures de tension, champ tournant et Icc.','<b>Documenter</b> : protocole de mesure de terre (lieu, date, nature du sol, valeur, signature), archivage.'],
 g:['Contrôles complets','Valeurs et seuils corrects','Documentation et traçabilité','Décision de mise en service argumentée'],
 src:'AE12 §4.8 ; AE06 §6.3.2 et §6.5'},
/* ---------- épreuve 2 : conduite et formation ---------- */
{k:'o2-recadrage',ep:2,d:4,t:'Entretien de recadrage',
 s:'Un monteur arrive en retard pour la troisième fois ce mois et laisse son matériel en désordre. Tu le reçois en entretien.',
 o:'DESC, style assuré, autorité',
 tr:['<b>Préparer l\'entretien</b> : les faits datés, l\'objectif, un lieu calme.','<b>DESC</b> : décrire les faits, exprimer l\'effet en « je », proposer une solution, énoncer les conséquences.','<b>Style assuré</b> : factuel, en « je », ni agressif ni passif. Expliquer plutôt qu\'imposer : c\'est l\'autorité, pas le pouvoir.','<b>Impliquer</b> : « Que proposes-tu ? ». Fixer un engagement et une date de suivi.'],
 g:['Faits objectifs, pas de jugement','Posture assurée','Écoute et implication du collaborateur','Objectif et suivi fixés'],
 src:'AA02 outil 49 (DESC) ; AA01 jour 3, pouvoir et autorité ; AA01 jour 4'},
{k:'o2-apprenti',ep:2,d:5,t:'Former un apprenti à un geste',
 s:'Tu dois former un apprenti de première année à la confection d\'une boîte de jonction. Présente ta séquence de formation.',
 o:'objectif SMART, RAVI, AFEST, courbe de l\'oubli',
 tr:['<b>Objectif SMART</b>, verbe d\'action observable, niveau de Bloom assumé.','<b>RAVI</b> : rassurer, rendre acteur, valoriser, impliquer.','<b>Formation en situation de travail</b> (AFEST) : droit à l\'erreur, puis séquence réflexive (« Explique-moi ce que tu as fait »).','<b>Réactiver</b> selon la courbe de l\'oubli : après 10 min, le premier jour, la première semaine, le premier mois.'],
 g:['Objectif clair et évaluable','Méthode active adaptée','Vérification des acquis','Posture bienveillante'],
 src:'AA02 outils 3, 8, 16 et 17 ; AA01, courbe de l\'oubli'},
{k:'o2-conflit',ep:2,d:4,t:'Gérer un conflit dans l\'équipe',
 s:'Deux monteurs se disputent sur le partage des tâches et l\'ambiance du chantier se dégrade. Tu interviens.',
 o:'analyse de la situation délicate, DESC',
 tr:['<b>Prendre du recul</b> : analyser la situation délicate et décider d\'intervenir ou non.','<b>Écouter chacun</b>, faire des hypothèses, parler en face à face.','<b>DESC</b> pour exprimer le problème sans attaquer les personnes.','<b>Solution concertée</b>, puis suivi. Adapter l\'approche au profil de chacun.'],
 g:['Analyse de la situation','Neutralité et écoute','Solution concertée','Suivi prévu'],
 src:'AA02 outils 48 et 49 ; AA01 jour 2 et 3'},
{k:'o2-feedback',ep:2,d:3,t:'Donner un feedback',
 s:'Après une manœuvre, tu fais un retour à un jeune monteur : le geste était juste, mais il a oublié de répéter l\'ordre de manœuvre.',
 o:'faits, message en « je », points forts et pistes de progrès',
 tr:['<b>Observations étayées par des faits</b>, en « je », sans vérité sur l\'autre.','<b>Points forts d\'abord, puis une piste de progrès</b> précise.','<b>Faire parler</b> : la fenêtre de Johari s\'ouvre quand on demande.','<b>Engagement</b> : la prochaine fois, ce qui change, et quand on en reparle.'],
 g:['Faits concrets','Équilibre points forts et piste de progrès','Implication de la personne','Plan d\'action'],
 src:'AA02 outils 8 et 55 ; AA01 jour 1 (Johari)'}
],
/* Classeur : réponse attendue = une page du fascicule de l'épreuve 2 (classeur d'examen, 20 pages,
   familles A à G), ou, pour l'épreuve 3, la formule et la section du support. */
CLASSEUR:[
 {ep:2,q:'Un jury te demande de poser l\'objectif de ta formation. Quelle page pour SMART et Bloom ?',r:'Page 4, famille B (objectifs et progression). Outils n° 3 et 71.'},
 {ep:2,q:'Un collaborateur se braque pendant l\'entretien. Quelle page pour le DESC ?',r:'Page 12, famille E (la situation délicate : outil 48 puis 49).'},
 {ep:2,q:'Trier les demandes urgentes du matin : quelle page, quel outil ?',r:'Page 15, famille G (organiser son temps). Matrice d\'Eisenhower, outil n° 8 de la Boîte à outils du management.'},
 {ep:2,q:'Motiver les participants du début à la fin : quelle page, quel outil ?',r:'Page 7, famille C (le socle pédagogique). RAVI, outil n° 17, avec les 7 clefs (outil n° 8 des formateurs).'},
 {ep:2,q:'Adapter ton style de conduite à un collaborateur débutant : quelle page ?',r:'Page 16, famille G (diriger l\'équipe). Styles et maturité M1 à M4.'},
 {ep:2,q:'Former sur le chantier, dans le travail réel : quelle page, quel sigle ?',r:'Page 5, famille B (choisir les modalités). AFEST, outil n° 16.'},
 {ep:3,q:'Tirage d\'un câble unipolaire en cuivre : quelle formule pour l\'effort admissible, et quelle contrainte ?',r:'F adm = n · A · σ adm, σ adm = 60 N/mm² (Cu unipolaire). Support AE12 §12.1.'},
 {ep:3,q:'Rayon de courbure minimal d\'un câble BT unipolaire isolé plastique ?',r:'R min = 12 × diamètre du câble (10 × en multiconducteur). Support AE12 §12.7, tableau des rayons.'},
 {ep:3,q:'Chute de tension en pour cent : quelle formule, et quelle tolérance viser en neuf ?',r:'Δu % = ΔU · 100 / U ; viser ± 6 % (EN 50160 : 230 V ± 10 %). Support AE01 §5.4.'},
 {ep:3,q:'Courant de court-circuit unipolaire en bout de ligne : quelle formule ?',r:'Icc = U ph / (Z tr + 2 · Z L), calculé à 20 °C. Support AE01 §5.5 à §5.7.'}
]};
