# Mode d’emploi — Site C&S Créations Florales

**Site public :** [https://www.cscreationsflorales.com](https://www.cscreationsflorales.com)  
**Administration :** [https://www.cscreationsflorales.com/admin](https://www.cscreationsflorales.com/admin)

Ce guide explique comment gérer la boutique au quotidien : articles, personnalisation, prix, photos et commandes.

---

## Sommaire

1. [Se connecter à l’admin](#1-se-connecter-à-ladmin)
2. [Les onglets de l’admin](#2-les-onglets-de-ladmin)
3. [Créer ou modifier un article](#3-créer-ou-modifier-un-article)
4. [L’identifiant technique (très important)](#4-lidentifiant-technique-très-important)
5. [Les options de personnalisation (formulaire client)](#5-les-options-de-personnalisation-formulaire-client)
6. [Liste des 35 modèles de création](#6-liste-des-35-modèles-de-création)
7. [Taille colis & livraison](#7-taille-colis--livraison)
8. [Photos des articles](#8-photos-des-articles)
9. [Ce que voit le client (panier & commande)](#9-ce-que-voit-le-client-panier--commande)
10. [Après un paiement : votre e-mail](#10-après-un-paiement--votre-e-mail)
11. [Livraison : main à main ou Point Relais](#11-livraison--main-à-main-ou-point-relais)
12. [Codes promo](#12-codes-promo)
13. [Mode maintenance](#13-mode-maintenance)
14. [Pages « hub » (Événements floraux, Saisonnières…)](#14-pages-hub-événements-floraux-saisonnières)
15. [Vérifier que vos changements sont en ligne](#15-vérifier-que-vos-changements-sont-en-ligne)
16. [Erreurs fréquentes & solutions](#16-erreurs-fréquentes--solutions)
17. [Récapitulatif rapide (checklist)](#17-récapitulatif-rapide-checklist)

---

## 1. Se connecter à l’admin

1. Ouvrez **https://www.cscreationsflorales.com/admin**
2. Entrez le **mot de passe admin** (fourni séparément — ne le partagez pas)
3. Vous accédez au tableau de bord d’édition

> **Conseil :** utilisez Chrome ou Edge. Après chaque enregistrement important, vérifiez le site en **navigation privée** (Ctrl+Shift+N) pour voir la version « visiteur ».

---

## 2. Les onglets de l’admin

| Onglet | À quoi ça sert |
|--------|----------------|
| **Identité & légal** | Nom, adresse, SIRET, textes légaux (CGV, mentions légales…) |
| **Accueil** | Textes de la page d’accueil, bannière, prestations, coups de cœur |
| **Articles (boutique)** | **C’est ici que vous gérez vos produits** (photos, prix, options) |
| **Nos avis clients** | Avis Google affichés sur le site |
| **Menu & pied de page** | Liens du menu, bannière promo, **mode maintenance** |
| **Contact (page)** | Textes de la page Contact |
| **Import / export** | Sauvegarde ou restauration du contenu (JSON) |

Pour la boutique au quotidien, vous utiliserez surtout **Articles (boutique)**.

---

## 3. Créer ou modifier un article

### Où aller

1. Onglet **Articles (boutique)**
2. En haut : menu déroulant **Page** → choisissez la rubrique :
   - Créations florales, Funéraires, Mariage, Anniversaire, Baptême, Pâques, Personnalisations, etc.
3. Cliquez **Enregistrer cette page** après chaque modification

### Ajouter un nouvel article

1. Descendez en bas de la liste → **Ajouter un article**
2. Remplissez les champs (voir ci-dessous)
3. **Enregistrer cette page** (obligatoire)

### Champs principaux

| Champ | Explication |
|-------|-------------|
| **Identifiant (panier / technique)** | Code unique de l’article — voir section 4 |
| **Titre** | Nom affiché sur le site et dans le panier |
| **Description** | Texte sous le titre. Mots en gras : entourez avec `**comme ceci**` |
| **Prix (€)** | Prix de base affiché (certains modèles recalculent selon quantité : verres, chiffres) |
| **Taille colis (livraison)** | Petit / Moyen / Grand — **vous** choisissez, pas le client (voir section 7) |
| **Image principale (photo 1)** | Photo visible sur la vitrine — bouton **Parcourir…** |
| **Photos 2 et 3** | Optionnel — le client peut faire défiler sur la fiche produit |
| **Message de personnalisation (simple)** | Ancien mode : une seule zone texte. **Désactivé** si le formulaire d’options est activé |
| **Options de personnalisation** | Formulaire complet pour le client — voir section 5 |

---

## 4. L’identifiant technique (très important)

C’est le **premier champ** de chaque article, sous « Article 1 », « Article 2 », etc.

### Règles

- **Un identifiant différent par article** sur la même page  
  Exemples : `personnalisation-001`, `personnalisation-002`, `mariage-003`
- **Ne mettez pas** votre e-mail, un espace ou un texte long
- Utilisez : lettres, chiffres, tirets uniquement
- **Ne changez pas** l’identifiant d’un article déjà commandé par un client (sinon confusion dans les commandes)

### Si deux articles ont le même identifiant

Le client clique sur un produit et arrive sur **l’autre** — c’est une cause fréquente de bug. Corrigez les identifiants puis enregistrez.

---

## 5. Les options de personnalisation (formulaire client)

Section : **« Options de personnalisation (formulaire client) »** (en bas de chaque article).

### Étapes

1. **Activer le formulaire d’options** → choisir **Oui**
2. **Modèle de création** → choisir le type qui correspond (voir liste section 6)  
   Le site peut **suggérer** un modèle selon le titre (ex. « ourson » → Ourson floral)
3. **Champs affichés au client** → cochez ce que vous voulez proposer  
   Vous pouvez décocher un champ si vous ne le proposez pas pour cet article précis
4. Pour les **pastilles couleur** : vous pouvez cocher **« Le client peut choisir plusieurs couleurs »** et indiquer un **nombre maximum**
5. **Enregistrer cette page**

### Ce que le client voit ensuite

Sur la fiche produit : pastilles de couleurs, listes Oui/Non, zones de texte, choix de décoration, etc. — selon le modèle.

Les choix apparaissent dans le **panier**, le **paiement** et votre **e-mail de commande**.

### Verres & gobelets (prix automatique)

Modèles **Verres personnalisés** et **Verre de communion** :

- Le client indique la **quantité de verres**
- Le **prix se recalcule tout seul** selon la quantité :

| Quantité | Prix unitaire |
|----------|----------------|
| 1 à 9 verres | 9,90 € / verre |
| 10 à 29 | 8,90 € |
| 30 à 49 | 7,50 € |
| 50 à 99 | 6,50 € |
| 100 et plus | 3,90 € |

### Chiffres floraux (prix automatique)

Le client saisit le **nombre** (ex. 30) et la **taille** (20 cm, 30 cm…). Le prix = nombre de chiffres × tarif de la taille.

---

## 6. Liste des 35 modèles de création

Quand vous créez un article, choisissez le modèle adapté :

| Modèle admin | Type de création |
|--------------|------------------|
| Centre de table | Centre de table (roses, LED, grosses fleurs, décorations) |
| Fleur sous verre | Rose / fleur sous cloche |
| Porte-alliance floral | Porte-alliances |
| Plateau miroir porte-alliance | Plateau miroir + alliances |
| Création baptême (thème) | Composition baptême avec thème (princesse, jungle…) |
| Panneau de baptême | Panneau baptême + décoration |
| Verre de communion | Gobelet / verre communion (quantité + tarifs dégressifs) |
| Verres personnalisés | Verres à vin / anniversaire (quantité + tarifs dégressifs) |
| Chiffres floraux | Chiffres en roses (taille + nombre) |
| Cœur floral plaque acrylique | Cœur + plaque acrylique |
| Cône floral | Cône noir/blanc, roses multi-couleurs, perles… |
| Cœur floral plaque bois | Cœur + plaque bois, colombe |
| Grande composition florale | Arche / grande composition |
| Ourson floral | Ourson (roses, couleur des yeux, décoration fleur/cœur) |
| Cadre de naissance | Nuage, plaque cœur, taille/poids/heure |
| Cœur floral Love | Petites/grosses roses, inscription Love |
| Petit sac floral | Sac rose pâle/blanc/noir |
| Grand sac floral | Grand sac (+ doré), perso haut du sac |
| Panneau de bienvenue | Plaque bienvenue |
| Papillon floral | Papillon or/argent, fleurs, plaque |
| Boîte à mouchoirs florale | Boîte mouchoirs |
| Camion floral | Camion (hommage, etc.) |
| Moto florale | Moto fleurie |
| Écrin floral | Coffret / écrin cœur |
| Cœur plexiglass | Cœur + plaque cœur plexiglass |
| Miroir floral | Miroir personnalisé |
| Options communes personnalisables | Création générique (perso + roses + demandes) |
| Plaque funéraire | Plaque + bougie |
| Croix florale | Croix |
| Tracteur floral | Tracteur |
| Ourson sur plaque florale | Ourson funéraire / sur plaque |
| Cœur sur plaque florale | Cœur sur plaque |
| Couronne florale de deuil | Couronne + bougie |
| Jardin du Souvenir | Arche jardin du souvenir |
| Lapin de Pâques floral | Lapin de Pâques |

> **Astuce :** un même modèle peut servir pour plusieurs articles différents (ex. plusieurs oursons avec des photos et prix différents).

---

## 7. Taille colis & livraison

Champ **« Taille colis (livraison) »** sur chaque article — **c’est vous qui décidez**, pas le client.

| Taille | Exemples | Frais Point Relais (indicatif) |
|--------|----------|--------------------------------|
| **Petit colis** | Verre, petit cœur, chiffre | 5,90 € |
| **Moyen colis** | Ourson moyen, composition | 8,90 € |
| **Grand colis** | Grand sac, grosse création | 12,90 € |

Si le panier contient **plusieurs articles**, c’est la **plus grande** taille qui compte.

**Retrait main à main** à l’atelier (Écommoy) : **gratuit**.

---

## 8. Photos des articles

1. Bouton **Parcourir…** → choisir la photo sur votre ordinateur
2. La photo est envoyée sur le cloud (Supabase) — attendez la fin de l’envoi
3. Vous pouvez ajouter **jusqu’à 3 photos** par article
4. Sur la fiche produit, le client voit des **points** pour changer de photo

**Conseils photo :** lumière naturelle, fond neutre, vue de face. Format carré ou proche du carré donne le meilleur rendu.

---

## 9. Ce que voit le client (panier & commande)

### Parcours type

1. Parcourir les créations → **Voir la fiche**
2. Remplir les **options** (couleurs, texte, quantité…)
3. **Ajouter au panier**
4. **Panier** : vérifier le détail, code promo éventuel
5. Choisir :
   - **Récupération main à main** (atelier Écommoy, gratuit), ou
   - **Livraison en Point Relais** (carte Mondial Relay + frais selon taille colis)
6. Nom, e-mail, téléphone
7. **Payer en ligne** (SumUp — carte bancaire sécurisée)

### Devis sans paiement

Le client peut aussi cliquer **« Demander un devis avec ce panier »** → formulaire contact pré-rempli.

---

## 10. Après un paiement : votre e-mail

À chaque commande **payée**, vous recevez un e-mail sur **contact@cscreationsflorales.com** (configurable) avec :

- Nom, e-mail et téléphone du client
- Mode de livraison (main à main ou Point Relais + adresse du relais)
- Format colis retenu
- Frais de livraison
- **Détail des articles** et **toutes les personnalisations** choisies
- Montant payé

→ Vous préparez la création selon ces informations.

---

## 11. Livraison : main à main ou Point Relais

| Option client | Vous faites quoi |
|---------------|------------------|
| **Récupération main à main** | Contactez le client pour fixer un rendez-vous à l’atelier (Écommoy 72220) |
| **Livraison Point Relais** | Préparez le colis, créez l’étiquette Mondial Relay (étape en cours côté technique), déposez au relais choisi par le client |

Le client **ne choisit pas** la taille du colis — vous l’avez définie sur chaque article.

---

## 12. Codes promo

- Bannière en haut du site : configurable dans **Menu & pied de page**
- Le client saisit le code dans le **panier**
- Le code de bienvenue est limité à **une utilisation par e-mail client**

---

## 13. Mode maintenance

**Menu & pied de page** → section **Maintenance du site**

- Cochez **Activer le bandeau de maintenance**
- Cliquez **Enregistrer menu & maintenance**

**Effet :** bandeau jaune sur le site + **paiements en ligne suspendus**. Utile en cas de gros souci ou vacances.

N’oubliez pas de **décocher** quand tout est rentré dans l’ordre.

---

## 14. Pages « hub » (Événements floraux, Saisonnières…)

Les pages **Événements floraux** et **Créations saisonnières** affichent **automatiquement** les articles des sous-rubriques (Mariage, Pâques, Fête des mères…).

→ **Créez vos produits dans la sous-rubrique** (ex. Mariage), pas besoin de les recréer sur la page hub.

---

## 15. Vérifier que vos changements sont en ligne

1. Après **Enregistrer**, lisez le message en haut de l’admin :
   - **Vert / « en ligne »** → OK pour les visiteurs
   - **Erreur** → notez le message et contactez le support technique
2. Ouvrez le site en **navigation privée**
3. Allez sur la page modifiée et sur la **fiche produit**

Si l’admin dit « en ligne » mais le site ne change pas : videz le cache (Ctrl+F5) ou attendez 1–2 minutes.

---

## 16. Erreurs fréquentes & solutions

| Problème | Solution |
|----------|----------|
| Clic sur un article → mauvaise fiche | Vérifiez que chaque article a un **identifiant unique** (pas le même, pas un e-mail) |
| Pas de formulaire de personnalisation sur le site | **Activer le formulaire = Oui**, choisir un **modèle**, puis **Enregistrer cette page**. Vérifiez la **bonne rubrique** (ex. baptême ≠ personnalisation) |
| Photos ne s’affichent pas | Ré-uploadez via **Parcourir…** ; vérifiez la connexion internet |
| Paiement indisponible | Mode **maintenance** activé ? Décochez et enregistrez |
| Point Relais : pas de carte | Le code enseigne Mondial Relay doit être configuré sur le site (support technique) |
| Modifications invisibles pour les clients | Vous devez être en mode **Supabase** en production ; enregistrez et vérifiez le message de confirmation |

---

## 17. Récapitulatif rapide (checklist)

### Nouvel article

- [ ] Choisir la **page** (rubrique)
- [ ] **Ajouter un article**
- [ ] **Identifiant unique** (ex. `creations-florales-039`)
- [ ] Titre, description, **prix**
- [ ] **Taille colis** (petit / moyen / grand)
- [ ] **Photo(s)** uploadées
- [ ] **Formulaire d’options = Oui** + bon **modèle**
- [ ] Champs cochés selon ce que vous proposez
- [ ] **Enregistrer cette page**
- [ ] Vérifier sur le site (navigation privée)

### Après une commande payée

- [ ] Lire l’**e-mail** de notification
- [ ] Noter personnalisations + livraison
- [ ] Contacter le client si retrait main à main
- [ ] Préparer la création
- [ ] Expédier en Point Relais si besoin

---

## Besoin d’aide technique ?

Pour les points suivants, contactez la personne qui gère le site (mise à jour, SumUp, Mondial Relay, mot de passe admin, bugs) :

- Mot de passe admin oublié
- Site en panne ou erreur à l’enregistrement
- Configuration Mondial Relay / étiquettes d’expédition
- Nouveau type de création **absent** de la liste des 35 modèles

---

*Document préparé pour C&S Créations Florales — site cscreationsflorales.com*  
*Dernière mise à jour : juillet 2026*
