-- Types de médias
INSERT INTO types_medias (id, type_) VALUES
    (1, 'image'),
    (2, 'video'),
    (3, 'audio'),
    (4, 'pdf');

-- Users
-- Utilisateurs avec UUID valides
INSERT INTO users (id, name, email, password) VALUES
('a1111111-1111-4f11-8111-111111111111', 'Alice', 'alice@example.com', 'hashed_pass1'),
('b2222222-2222-4f22-8222-222222222222', 'Bob', 'bob@example.com', 'hashed_pass2'),
('c3333333-3333-4f33-8333-333333333333', 'Charlie', 'charlie@example.com', 'hashed_pass3'),
('d4444444-4444-4f44-8444-444444444444', 'Diana', 'diana@example.com', 'hashed_pass4'),
('e5555555-5555-4f55-8555-555555555555', 'Eve', 'eve@example.com', 'hashed_pass5'),
('f6666666-6666-4f66-8666-666666666666', 'Frank', 'frank@example.com', 'hashed_pass6'),
('a7777777-7777-4777-8777-777777777777', 'Grace', 'grace@example.com', 'hashed_pass7'),
('b8888888-8888-4888-8888-888888888888', 'Heidi', 'heidi@example.com', 'hashed_pass8'),
('c9999999-9999-4999-8999-999999999999', 'Ivan', 'ivan@example.com', 'hashed_pass9'),
('d1010101-1010-4101-8101-101010101010', 'Judy', 'judy@example.com', 'hashed_pass10');

-- Posts
-- Posts liés aux utilisateurs
INSERT INTO posts (id, title, content, user_id) VALUES
-- Alice (a111...)
(1, 'LIA bouleverse le monde du travail', 'Une recente etude revele que lintelligence artificielle pourrait automatiser pres de 40% des taches administratives dici 2030.', 'a1111111-1111-4f11-8111-111111111111'),
(2, 'La mission vers Mars repoussee', 'La NASA annonce un nouveau retard pour son projet denvoyer une mission habitee sur Mars, initialement prevue pour 2033.', 'a1111111-1111-4f11-8111-111111111111'),
(3, 'Record de chaleur en Europe', 'Plusieurs pays europeens enregistrent des temperatures historiques, depassant les 45C en Espagne et en Italie.', 'a1111111-1111-4f11-8111-111111111111'),
(4, 'Un vaccin contre le cancer teste', 'Des chercheurs americains annoncent les premiers resultats positifs dun vaccin experimental contre certains types de cancers.', 'a1111111-1111-4f11-8111-111111111111'),
(5, 'La 5G couvre 90% du territoire', 'Selon le ministere du numerique, le reseau 5G est desormais disponible pour plus de 90% de la population.', 'a1111111-1111-4f11-8111-111111111111'),

-- Bob (b222...)
(6, 'Decouverte dune exoplanete habitable', 'Les astronomes detectent une planete situee a 120 annees-lumiere, avec des conditions proches de celles de la Terre.', 'b2222222-2222-4f22-8222-222222222222'),
(7, 'Les cryptomonnaies repartent a la hausse', 'Apres une chute prolongee, le Bitcoin et lEthereum connaissent une remontee spectaculaire.', 'b2222222-2222-4f22-8222-222222222222'),
(8, 'Nouvelle reforme de leducation', 'Le gouvernement propose une refonte des programmes scolaires pour integrer davantage de numerique.', 'b2222222-2222-4f22-8222-222222222222'),
(9, 'La biodiversite en danger', 'Un rapport alarmant indique que 1 million despeces animales et vegetales sont menacees dextinction.', 'b2222222-2222-4f22-8222-222222222222'),
(10, 'Lancement dun train a hydrogene', 'La France inaugure son premier train commercial fonctionnant uniquement a lhydrogene.', 'b2222222-2222-4f22-8222-222222222222'),

-- Charlie (c333...)
(11, 'Une IA bat les champions dechecs', 'Un nouvel algorithme developpe par une startup surpasse les meilleurs joueurs humains et machines existants.', 'c3333333-3333-4f33-8333-333333333333'),
(12, 'Nouvelle avancee en fusion nucleaire', 'Un laboratoire europeen annonce avoir maintenu une reaction de fusion stable pendant plusieurs secondes.', 'c3333333-3333-4f33-8333-333333333333'),
(13, 'Des lunettes traduisent en temps reel', 'Une startup japonaise presente des lunettes capables de traduire instantanement une conversation.', 'c3333333-3333-4f33-8333-333333333333'),
(14, 'Le retour du teletravail', 'Face a une nouvelle epidemie, plusieurs entreprises rappellent massivement leurs employes en teletravail.', 'c3333333-3333-4f33-8333-333333333333'),
(15, 'Decouverte dun manuscrit perdu', 'Un texte inedit attribue a Aristote a ete retrouve dans une bibliotheque grecque.', 'c3333333-3333-4f33-8333-333333333333'),

-- Diana (d444...)
(16, 'Tesla devoile une voiture volante', 'Elon Musk annonce un prototype fonctionnel de vehicule electrique capable de decoller verticalement.', 'd4444444-4444-4f44-8444-444444444444'),
(17, 'Une eclipse solaire totale spectaculaire', 'Des millions de personnes en Amerique du Sud assistent a une eclipse solaire totale inoubliable.', 'd4444444-4444-4f44-8444-444444444444'),
(18, 'Les oceans se rechauffent plus vite', 'De nouvelles donnees montrent que les oceans absorbent plus de chaleur que prevu.', 'd4444444-4444-4f44-8444-444444444444'),
(19, 'Le premier robot policier en service', 'Dubai met en circulation son premier robot policier autonome.', 'd4444444-4444-4f44-8444-444444444444'),
(20, 'La fin des mots de passe ?', 'Microsoft experimente lauthentification 100% sans mot de passe grace aux cles biometrques.', 'd4444444-4444-4f44-8444-444444444444'),

-- Eve (e555...)
(21, 'Une nouvelle molecule contre Alzheimer', 'Un essai clinique revele des resultats prometteurs pour ralentir la progression de la maladie.', 'e5555555-5555-4f55-8555-555555555555'),
(22, 'Le cinema 3D sans lunettes arrive', 'Un studio coreen devoile une technologie permettant de regarder des films en 3D sans equipement special.', 'e5555555-5555-4f55-8555-555555555555'),
(23, 'Explosion du e-sport', 'Le marche mondial de le-sport devrait depasser les 3 milliards de dollars dici 2027.', 'e5555555-5555-4f55-8555-555555555555'),
(24, 'Les coraux reprennent vie', 'Une initiative de replantation marine reussit a restaurer un recif endommage en Indonesie.', 'e5555555-5555-4f55-8555-555555555555'),
(25, 'Le streaming bat tous les records', 'Les plateformes de streaming enregistrent une audience jamais vue, depassant la television traditionnelle.', 'e5555555-5555-4f55-8555-555555555555'),

-- Frank (f666...)
(26, 'Nouvel accord sur le climat', '200 pays signent un accord pour limiter le rechauffement climatique a 1,5C.', 'f6666666-6666-4f66-8666-666666666666'),
(27, 'Un robot chirurgien sauve une vie', 'Un hopital experimente avec succes une operation realisee entierement par un robot.', 'f6666666-6666-4f66-8666-666666666666'),
(28, 'Decouverte dune pyramide sous-marine', 'Des archeologues annoncent la decouverte dune structure monumentale engloutie pres du Japon.', 'f6666666-6666-4f66-8666-666666666666'),
(29, 'La penurie de semi-conducteurs continue', 'Les industriels annoncent que la crise des composants electroniques pourrait durer encore deux ans.', 'f6666666-6666-4f66-8666-666666666666'),
(30, 'Une IA compose une symphonie', 'Un orchestre joue une piece musicale generee entierement par une intelligence artificielle.', 'f6666666-6666-4f66-8666-666666666666'),

-- Grace (a777...)
(31, 'Le retour des vols supersoniques', 'Une compagnie aerienne presente un prototype davion capable de relier Paris a New York en 3 heures.', 'a7777777-7777-4777-8777-777777777777'),
(32, 'Une decouverte medicale historique', 'Des chercheurs reussissent a reparer des tissus cardiaques avec des cellules souches.', 'a7777777-7777-4777-8777-777777777777'),
(33, 'Le plastique biodegradable devient realite', 'Une entreprise lance un plastique 100% biodegradable et recyclable.', 'a7777777-7777-4777-8777-777777777777'),
(34, 'Cyberattaque massive', 'Un piratage mondial affecte des millions de serveurs et entreprises strategiques.', 'a7777777-7777-4777-8777-777777777777'),
(35, 'Le tourisme spatial explose', 'Plusieurs compagnies privees annoncent des vols suborbitaux ouverts au grand public.', 'a7777777-7777-4777-8777-777777777777'),

-- Heidi (b888...)
(36, 'Une IA predit les tremblements de terre', 'Un systeme experimental permet de detecter les seismes avec quelques heures davance.', 'b8888888-8888-4888-8888-888888888888'),
(37, 'Decouverte dun nouvel organe humain', 'Des chercheurs identifient une structure anatomique inconnue jusquici.', 'b8888888-8888-4888-8888-888888888888'),
(38, 'La realite augmentee dans les ecoles', 'Des etablissements pilotes integrent la realite augmentee dans leurs cours de sciences.', 'b8888888-8888-4888-8888-888888888888'),
(39, 'Un record du monde de marathon battu', 'Un athlete kenyan etablit un nouveau record mondial du marathon en 1h59.', 'b8888888-8888-4888-8888-888888888888'),
(40, 'LAntarctique perd sa glace', 'Une etude recente revele une fonte acceleree des glaciers.', 'b8888888-8888-4888-8888-888888888888'),

-- Ivan (c999...)
(41, 'Des drones livreurs deployes', 'Amazon lance officiellement ses drones livreurs dans plusieurs grandes villes.', 'c9999999-9999-4999-8999-999999999999'),
(42, 'Le plus grand telescope spatial lance', 'LAgence spatiale europeenne envoie un telescope revolutionnaire dans lespace.', 'c9999999-9999-4999-8999-999999999999'),
(43, 'Un medicament reduit le cholesterol', 'Des essais montrent quune nouvelle molecule reduit efficacement le taux de cholesterol.', 'c9999999-9999-4999-8999-999999999999'),
(44, 'Les voitures autonomes se generalisent', 'Plusieurs pays autorisent la circulation libre des voitures 100% autonomes.', 'c9999999-9999-4999-8999-999999999999'),
(45, 'Une IA devient artiste peintre', 'Une galerie expose des toiles creees entierement par un algorithme.', 'c9999999-9999-4999-8999-999999999999'),

-- Judy (d1010...)
(46, 'Des implants neuronaux pour marcher', 'Des patients paraplegiques retrouvent une mobilite grace a une puce cerebrale.', 'd1010101-1010-4101-8101-101010101010'),
(47, 'La plus longue greve de lhistoire', 'Un mouvement social paralyse le pays pendant plus de 60 jours.', 'd1010101-1010-4101-8101-101010101010'),
(48, 'Decouverte dun lac sous la glace martienne', 'Des chercheurs italiens detectent un lac liquide sous la calotte polaire de Mars.', 'd1010101-1010-4101-8101-101010101010'),
(49, 'Une montre mesure la glycemie sans piqure', 'Apple presente une montre capable de mesurer le taux de sucre dans le sang sans aiguille.', 'd1010101-1010-4101-8101-101010101010'),
(50, 'Internet quantique en test', 'Des scientifiques connectent deux ordinateurs via une liaison quantique ultra-securisee.', 'd1010101-1010-4101-8101-101010101010');

-- Tags
INSERT INTO tags (id, tag) VALUES
    (1, 'Technologie'),
    (2, 'Economie'),
    (3, 'Education'),
    (4, 'Politique'),
    (5, 'Sante'),
    (6, 'Sport'),
    (7, 'Culture'),
    (8, 'Climat'),
    (9, 'Innovation'),
    (10, 'Cybersecurite');


-- Posts_Tags
INSERT INTO posts_tags (id, post_id, tag_id) VALUES
(1, 1, 1), (2, 1, 9),
(3, 2, 1), (4, 2, 4),
(5, 3, 6),
(6, 4, 9), (7, 4, 10),
(8, 5, 5), (9, 5, 1),
(10, 6, 3),
(11, 7, 8),
(12, 8, 1), (13, 8, 7),
(14, 9, 2),
(15, 10, 7),
(16, 11, 1), (17, 11, 9),
(18, 12, 9), (19, 12, 8),
(20, 13, 3),
(21, 14, 6),
(22, 15, 7),
(23, 16, 1), (24, 16, 9),
(25, 17, 8),
(26, 18, 8), (27, 18, 2),
(28, 19, 1), (29, 19, 10),
(30, 20, 5),
(31, 21, 5), (32, 21, 9),
(33, 22, 7),
(34, 23, 6),
(35, 24, 8), (36, 24, 5),
(37, 25, 1), (38, 25, 7),
(39, 26, 2), (40, 26, 8),
(41, 27, 1), (42, 27, 10),
(43, 28, 8),
(44, 29, 2), (45, 29, 9),
(46, 30, 1),
(47, 31, 1), (48, 31, 9),
(49, 32, 5),
(50, 33, 1),
(51, 34, 10),
(52, 35, 7), (53, 35, 1),
(54, 36, 1), (55, 36, 9),
(56, 37, 5),
(57, 38, 3), (58, 38, 7),
(59, 39, 6),
(60, 40, 8),
(61, 41, 1), (62, 41, 9),
(63, 42, 1),
(64, 43, 5),
(65, 44, 1), (66, 44, 6),
(67, 45, 7), (68, 45, 9),
(69, 46, 1),
(70, 47, 4), (71, 47, 6),
(72, 48, 8),
(73, 49, 5),
(74, 50, 1), (75, 50, 8);

-- medias
INSERT INTO medias (id, path_name, post_id, type_id) VALUES
(1, 'https://thenationalrobotarium.com/wp-content/uploads/Ben-38-1030x685.jpg', 1, 1),
(2, 'https://img.freepik.com/photos-gratuite/outils-sport_53876-138077.jpg?semt=ais_incoming&w=740&q=80', 2, 1),
(3, 'https://f.maformation.fr/edito/sites/3/2022/04/apprendre-economie.jpeg', 3, 1),
(4, 'https://s.rfi.fr/media/display/09e4427c-0c5f-11eb-abb5-005056a964fe/w:1280/p:4x3/cardiaque_1_0.jpg', 4, 1),
(5, 'https://thenationalrobotarium.com/wp-content/uploads/Ben-38-1030x685.jpg', 5, 1),
(6, 'https://media.lesechos.com/api/v1/images/view/5db17d378fe56f4863249277/1280x720/0602114154910-web-tete.jpg', 6, 1),
(7, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR2sxJHN4v2nC0qoQW9z1H52T0BxxOZExF1Q&s', 7, 1),
(8, 'https://m1.quebecormedia.com/emp/emp/65756058_4063574d8befaf-d610-4444-aab4-4e9ebbdc89cf_ORIGINAL.jpg?impolicy=crop-resize&x=0&y=0&w=5616&h=3745&width=400', 8, 1),
(9, 'https://img.freepik.com/photos-gratuite/outils-sport_53876-138077.jpg?semt=ais_incoming&w=740&q=80', 9, 1),
(10, 'https://f.maformation.fr/edito/sites/3/2022/04/apprendre-economie.jpeg', 10, 1),
(11, 'https://s.rfi.fr/media/display/09e4427c-0c5f-11eb-abb5-005056a964fe/w:1280/p:4x3/cardiaque_1_0.jpg', 11, 1),
(12, 'https://thenationalrobotarium.com/wp-content/uploads/Ben-38-1030x685.jpg', 12, 1),
(13, 'https://media.lesechos.com/api/v1/images/view/5db17d378fe56f4863249277/1280x720/0602114154910-web-tete.jpg', 13, 1),
(14, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR2sxJHN4v2nC0qoQW9z1H52T0BxxOZExF1Q&s', 14, 1),
(15, 'https://m1.quebecormedia.com/emp/emp/65756058_4063574d8befaf-d610-4444-aab4-4e9ebbdc89cf_ORIGINAL.jpg?impolicy=crop-resize&x=0&y=0&w=5616&h=3745&width=400', 15, 1),
(16, 'https://f.maformation.fr/edito/sites/3/2022/04/apprendre-economie.jpeg', 16, 1),
(17, 'https://thenationalrobotarium.com/wp-content/uploads/Ben-38-1030x685.jpg', 17, 1),
(18, 'https://s.rfi.fr/media/display/09e4427c-0c5f-11eb-abb5-005056a964fe/w:1280/p:4x3/cardiaque_1_0.jpg', 18, 1),
(19, 'https://img.freepik.com/photos-gratuite/outils-sport_53876-138077.jpg?semt=ais_incoming&w=740&q=80', 19, 1),
(20, 'https://media.lesechos.com/api/v1/images/view/5db17d378fe56f4863249277/1280x720/0602114154910-web-tete.jpg', 20, 1),
(21, 'https://m1.quebecormedia.com/emp/emp/65756058_4063574d8befaf-d610-4444-aab4-4e9ebbdc89cf_ORIGINAL.jpg?impolicy=crop-resize&x=0&y=0&w=5616&h=3745&width=400', 21, 1),
(22, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR2sxJHN4v2nC0qoQW9z1H52T0BxxOZExF1Q&s', 22, 1),
(23, 'https://thenationalrobotarium.com/wp-content/uploads/Ben-38-1030x685.jpg', 23, 1),
(24, 'https://f.maformation.fr/edito/sites/3/2022/04/apprendre-economie.jpeg', 24, 1),
(25, 'https://s.rfi.fr/media/display/09e4427c-0c5f-11eb-abb5-005056a964fe/w:1280/p:4x3/cardiaque_1_0.jpg', 25, 1),
(26, 'https://img.freepik.com/photos-gratuite/outils-sport_53876-138077.jpg?semt=ais_incoming&w=740&q=80', 26, 1),
(27, 'https://media.lesechos.com/api/v1/images/view/5db17d378fe56f4863249277/1280x720/0602114154910-web-tete.jpg', 27, 1),
(28, 'https://thenationalrobotarium.com/wp-content/uploads/Ben-38-1030x685.jpg', 28, 1),
(29, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR2sxJHN4v2nC0qoQW9z1H52T0BxxOZExF1Q&s', 29, 1),
(30, 'https://m1.quebecormedia.com/emp/emp/65756058_4063574d8befaf-d610-4444-aab4-4e9ebbdc89cf_ORIGINAL.jpg?impolicy=crop-resize&x=0&y=0&w=5616&h=3745&width=400', 30, 1),
(31, 'https://f.maformation.fr/edito/sites/3/2022/04/apprendre-economie.jpeg', 31, 1),
(32, 'https://s.rfi.fr/media/display/09e4427c-0c5f-11eb-abb5-005056a964fe/w:1280/p:4x3/cardiaque_1_0.jpg', 32, 1),
(33, 'https://thenationalrobotarium.com/wp-content/uploads/Ben-38-1030x685.jpg', 33, 1),
(34, 'https://media.lesechos.com/api/v1/images/view/5db17d378fe56f4863249277/1280x720/0602114154910-web-tete.jpg', 34, 1),
(35, 'https://img.freepik.com/photos-gratuite/outils-sport_53876-138077.jpg?semt=ais_incoming&w=740&q=80', 35, 1),
(36, 'https://m1.quebecormedia.com/emp/emp/65756058_4063574d8befaf-d610-4444-aab4-4e9ebbdc89cf_ORIGINAL.jpg?impolicy=crop-resize&x=0&y=0&w=5616&h=3745&width=400', 36, 1),
(37, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR2sxJHN4v2nC0qoQW9z1H52T0BxxOZExF1Q&s', 37, 1),
(38, 'https://thenationalrobotarium.com/wp-content/uploads/Ben-38-1030x685.jpg', 38, 1),
(39, 'https://f.maformation.fr/edito/sites/3/2022/04/apprendre-economie.jpeg', 39, 1),
(40, 'https://s.rfi.fr/media/display/09e4427c-0c5f-11eb-abb5-005056a964fe/w:1280/p:4x3/cardiaque_1_0.jpg', 40, 1),
(41, 'https://media.lesechos.com/api/v1/images/view/5db17d378fe56f4863249277/1280x720/0602114154910-web-tete.jpg', 41, 1),
(42, 'https://img.freepik.com/photos-gratuite/outils-sport_53876-138077.jpg?semt=ais_incoming&w=740&q=80', 42, 1),
(43, 'https://thenationalrobotarium.com/wp-content/uploads/Ben-38-1030x685.jpg', 43, 1),
(44, 'https://m1.quebecormedia.com/emp/emp/65756058_4063574d8befaf-d610-4444-aab4-4e9ebbdc89cf_ORIGINAL.jpg?impolicy=crop-resize&x=0&y=0&w=5616&h=3745&width=400', 44, 1),
(45, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR2sxJHN4v2nC0qoQW9z1H52T0BxxOZExF1Q&s', 45, 1),
(46, 'https://f.maformation.fr/edito/sites/3/2022/04/apprendre-economie.jpeg', 46, 1),
(47, 'https://s.rfi.fr/media/display/09e4427c-0c5f-11eb-abb5-005056a964fe/w:1280/p:4x3/cardiaque_1_0.jpg', 47, 1),
(48, 'https://img.freepik.com/photos-gratuite/outils-sport_53876-138077.jpg?semt=ais_incoming&w=740&q=80', 48, 1),
(49, 'https://media.lesechos.com/api/v1/images/view/5db17d378fe56f4863249277/1280x720/0602114154910-web-tete.jpg', 49, 1),
(50, 'https://thenationalrobotarium.com/wp-content/uploads/Ben-38-1030x685.jpg', 50, 1);

-- Commentaires
INSERT INTO comments (content, post_id, user_id) VALUES
('Incroyable ! LIA change vraiment le monde.', 1, 'b2222222-2222-4f22-8222-222222222222'),
('Jesper que la mission Mars ne sera pas trop retardee.', 2, 'c3333333-3333-4f33-8333-333333333333'),
('Cest effrayant ces temperatures en Europe.', 3, 'd4444444-4444-4f44-8444-444444444444'),
('Un grand pas pour la medecine.', 4, 'e5555555-5555-4f55-8555-555555555555'),
('Enfin, la 5G se deploie correctement.', 5, 'f6666666-6666-4f66-8666-666666666666'),

('Je reve de cette exoplanete !', 6, 'a1111111-1111-4f11-8111-111111111111'),
('Les cryptos remontent, il faut investir.', 7, 'd4444444-4444-4f44-8444-444444444444'),
('Il faut moderniser nos ecoles.', 8, 'e5555555-5555-4f55-8555-555555555555'),
('Urgent de proteger notre biodiversite.', 9, 'f6666666-6666-4f66-8666-666666666666'),
('Hydrogene, lavenir du train.', 10, 'a7777777-7777-4777-8777-777777777777'),

('LIA progresse a une vitesse folle.', 11, 'b8888888-8888-4888-8888-888888888888'),
('Fusion nucleaire stable ? Impressionnant.', 12, 'c9999999-9999-4999-8999-999999999999'),
('Ces lunettes vont faciliter les voyages.', 13, 'd1010101-1010-4101-8101-101010101010'),
('Le teletravail revient, quelle surprise...', 14, 'a1111111-1111-4f11-8111-111111111111'),
('Un manuscrit perdu retrouve, fascinant !', 15, 'b2222222-2222-4f22-8222-222222222222'),

('Une voiture volante, le futur est la.', 16, 'c3333333-3333-4f33-8333-333333333333'),
('Jetais la pour leclipse, magique !', 17, 'd4444444-4444-4f44-8444-444444444444'),
('Les oceans chauffent trop vite.', 18, 'e5555555-5555-4f55-8555-555555555555'),
('Premier robot policier a Dubai, impressionnant.', 19, 'f6666666-6666-4f66-8666-666666666666'),
('Plus besoin de mots de passe bientot.', 20, 'a7777777-7777-4777-8777-777777777777'),

('Une avancee medicale majeure.', 21, 'b8888888-8888-4888-8888-888888888888'),
('Enfin le 3D sans lunettes !', 22, 'c9999999-9999-4999-8999-999999999999'),
('Le e-sport devient un vrai business.', 23, 'd1010101-1010-4101-8101-101010101010'),
('Bravo pour la restauration des coraux.', 24, 'a1111111-1111-4f11-8111-111111111111'),
('Le streaming domine desormais.', 25, 'b2222222-2222-4f22-8222-222222222222'),

('Accord sur le climat crucial.', 26, 'c3333333-3333-4f33-8333-333333333333'),
('Le robot chirurgien est impressionnant.', 27, 'd4444444-4444-4f44-8444-444444444444'),
('Sous-marin et pyramide ? Fascinant.', 28, 'e5555555-5555-4f55-8555-555555555555'),
('Encore des penuries de semi-conducteurs.', 29, 'f6666666-6666-4f66-8666-666666666666'),
('Une symphonie IA, incroyable !', 30, 'a7777777-7777-4777-8777-777777777777'),

('Vivement les vols supersoniques.', 31, 'b8888888-8888-4888-8888-888888888888'),
('Reparation cardiaque par cellules souches, wow !', 32, 'c9999999-9999-4999-8999-999999999999'),
('Le plastique biodegradable devient realite.', 33, 'd1010101-1010-4101-8101-101010101010'),
('Cyberattaque massive, attention aux donnees.', 34, 'a1111111-1111-4f11-8111-111111111111'),
('Le tourisme spatial attire le public.', 35, 'b2222222-2222-4f22-8222-222222222222'),

('Detection des seismes en avance, top !', 36, 'c3333333-3333-4f33-8333-333333333333'),
('Nouvel organe humain decouvert.', 37, 'd4444444-4444-4f44-8444-444444444444'),
('AR dans les ecoles, tres utile.', 38, 'e5555555-5555-4f55-8555-555555555555'),
('Record marathon incroyable !', 39, 'f6666666-6666-4f66-8666-666666666666'),
('LAntarctique fond vite.', 40, 'a7777777-7777-4777-8777-777777777777'),

('Les drones livreurs changent la logistique.', 41, 'b8888888-8888-4888-8888-888888888888'),
('Telescope spatial, incroyable avancee.', 42, 'c9999999-9999-4999-8999-999999999999'),
('Le cholesterol enfin controle.', 43, 'd1010101-1010-4101-8101-101010101010'),
('Voitures autonomes generalisees.', 44, 'a1111111-1111-4f11-8111-111111111111'),
('Une IA artiste, fascinant.', 45, 'b2222222-2222-4f22-8222-222222222222'),

('Implants neuronaux pour marcher, miraculeux.', 46, 'c3333333-3333-4f33-8333-333333333333'),
('Greve historique !', 47, 'd4444444-4444-4f44-8444-444444444444'),
('Lac sous glace martienne decouvert.', 48, 'e5555555-5555-4f55-8555-555555555555'),
('Montre sans piquee tres pratique.', 49, 'f6666666-6666-4f66-8666-666666666666'),
('Internet quantique teste, futur prometteur.', 50, 'a7777777-7777-4777-8777-777777777777');

-- Likes
INSERT INTO likes_posts (user_id, post_id) VALUES
('a1111111-1111-4f11-8111-111111111111', 1),
('a1111111-1111-4f11-8111-111111111111', 2),
('a1111111-1111-4f11-8111-111111111111', 3),
('b2222222-2222-4f22-8222-222222222222', 1),
('b2222222-2222-4f22-8222-222222222222', 5),
('b2222222-2222-4f22-8222-222222222222', 6),
('c3333333-3333-4f33-8333-333333333333', 2),
('c3333333-3333-4f33-8333-333333333333', 7),
('d4444444-4444-4f44-8444-444444444444', 3),
('d4444444-4444-4f44-8444-444444444444', 8),
('e5555555-5555-4f55-8555-555555555555', 4),
('e5555555-5555-4f55-8555-555555555555', 9),
('f6666666-6666-4f66-8666-666666666666', 5),
('f6666666-6666-4f66-8666-666666666666', 10),
('a7777777-7777-4777-8777-777777777777', 10),
('b8888888-8888-4888-8888-888888888888', 11),
('b8888888-8888-4888-8888-888888888888', 12),
('c9999999-9999-4999-8999-999999999999', 15),
('c9999999-9999-4999-8999-999999999999', 16),
('d1010101-1010-4101-8101-101010101010', 20),
('d1010101-1010-4101-8101-101010101010', 21);

-- Views
INSERT INTO views (user_id, post_id) VALUES
('a1111111-1111-4f11-8111-111111111111', 1),
('a1111111-1111-4f11-8111-111111111111', 5),
('a1111111-1111-4f11-8111-111111111111', 9),
('b2222222-2222-4f22-8222-222222222222', 2),
('b2222222-2222-4f22-8222-222222222222', 6),
('b2222222-2222-4f22-8222-222222222222', 10),
('c3333333-3333-4f33-8333-333333333333', 3),
('c3333333-3333-4f33-8333-333333333333', 7),
('c3333333-3333-4f33-8333-333333333333', 11),
('d4444444-4444-4f44-8444-444444444444', 4),
('d4444444-4444-4f44-8444-444444444444', 8),
('d4444444-4444-4f44-8444-444444444444', 12),
('e5555555-5555-4f55-8555-555555555555', 5),
('e5555555-5555-4f55-8555-555555555555', 9),
('f6666666-6666-4f66-8666-666666666666', 6),
('f6666666-6666-4f66-8666-666666666666', 10),
('a7777777-7777-4777-8777-777777777777', 7),
('a7777777-7777-4777-8777-777777777777', 13),
('b8888888-8888-4888-8888-888888888888', 8),
('b8888888-8888-4888-8888-888888888888', 14);


-- Likes Users
INSERT INTO likes_users (user_id, liker_id) VALUES
('a1111111-1111-4f11-8111-111111111111', 'b2222222-2222-4f22-8222-222222222222'),
('a1111111-1111-4f11-8111-111111111111', 'c3333333-3333-4f33-8333-333333333333'),
('b2222222-2222-4f22-8222-222222222222', 'a1111111-1111-4f11-8111-111111111111'),
('b2222222-2222-4f22-8222-222222222222', 'd4444444-4444-4f44-8444-444444444444'),
('c3333333-3333-4f33-8333-333333333333', 'e5555555-5555-4f55-8555-555555555555'),
('d4444444-4444-4f44-8444-444444444444', 'f6666666-6666-4f66-8666-666666666666'),
('e5555555-5555-4f55-8555-555555555555', 'a7777777-7777-4777-8777-777777777777'),
('f6666666-6666-4f66-8666-666666666666', 'b8888888-8888-4888-8888-888888888888'),
('a7777777-7777-4777-8777-777777777777', 'c9999999-9999-4999-8999-999999999999'),
('b8888888-8888-4888-8888-888888888888', 'd1010101-1010-4101-8101-101010101010');

-- Followers
INSERT INTO followers (user_id, follower_id) VALUES
('a1111111-1111-4f11-8111-111111111111', 'b2222222-2222-4f22-8222-222222222222'),
('a1111111-1111-4f11-8111-111111111111', 'c3333333-3333-4f33-8333-333333333333'),
('b2222222-2222-4f22-8222-222222222222', 'a1111111-1111-4f11-8111-111111111111'),
('b2222222-2222-4f22-8222-222222222222', 'd4444444-4444-4f44-8444-444444444444'),
('c3333333-3333-4f33-8333-333333333333', 'e5555555-5555-4f55-8555-555555555555'),
('d4444444-4444-4f44-8444-444444444444', 'f6666666-6666-4f66-8666-666666666666'),
('e5555555-5555-4f55-8555-555555555555', 'a7777777-7777-4777-8777-777777777777'),
('f6666666-6666-4f66-8666-666666666666', 'b8888888-8888-4888-8888-888888888888'),
('a7777777-7777-4777-8777-777777777777', 'c9999999-9999-4999-8999-999999999999'),
('b8888888-8888-4888-8888-888888888888', 'd1010101-1010-4101-8101-101010101010');
