# 🌸 C&S Créations Florales et Personnalisation

Site vitrine pour Charlène, créatrice florale à Écommoy (72220).

---

## 🚀 Démarrage rapide (VS Code)

### 1. Ouvrir dans VS Code
```bash
code cs-creations-florales
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Lancer le serveur de développement
```bash
npm run dev
```
→ Ouvre http://localhost:5173 dans votre navigateur

### 4. Build pour la production
```bash
npm run build
```

---

## 📁 Structure du projet

```
src/
├── components/
│   ├── Navbar.jsx          → Menu principal avec sous-menus
│   ├── Footer.jsx          → Pied de page avec liens légaux
│   ├── CookieBanner.jsx    → Bandeau RGPD cookies
│   ├── PageHeader.jsx      → En-tête de page réutilisable
│   ├── ContactCTA.jsx      → Section contact réutilisable
│   ├── GalleryGrid.jsx     → Galerie photo réutilisable
│   ├── EventPage.jsx       → Template pour pages événements
│   └── SeasonPage.jsx      → Template pour pages saisonnières
├── pages/
│   ├── Home.jsx            → Page d'accueil complète
│   ├── EvenementsFloraux.jsx
│   ├── CreationsDecoratives.jsx
│   ├── CreationsFuneraires.jsx
│   ├── CreationsSaisonnieres.jsx
│   ├── Personnalisation.jsx
│   ├── Contact.jsx         → Formulaire avec mention RGPD
│   ├── MentionsLegales.jsx
│   ├── PolitiqueConfidentialite.jsx
│   ├── CGV.jsx
│   ├── evenements/
│   │   ├── Anniversaire.jsx
│   │   ├── Mariage.jsx
│   │   └── BaptemeCommunion.jsx
│   └── saisonniers/
│       ├── Paques.jsx
│       ├── Noel.jsx
│       └── FeteDesMeres.jsx
├── App.jsx                 → Routing complet
├── main.jsx
└── index.css               → Styles globaux + variables CSS
```

---

## 🎨 Palette de couleurs

| Nom | Code |
|-----|------|
| Mauve principal | `#A678B4` |
| Lavande doux | `#DCC6E6` |
| Violet soutenu | `#7E5A9B` |
| Blanc cassé | `#F8F5F9` |
| Beige rosé | `#EFE6EA` |

Variables CSS dans `src/index.css` :
```css
--mauve: #A678B4
--lavande: #DCC6E6
--violet: #7E5A9B
--blanc: #F8F5F9
--beige: #EFE6EA
```

---

## 📝 Personnaliser le contenu

### Informations de contact
Cherchez et remplacez dans tous les fichiers :
- `06 XX XX XX XX` → votre numéro de téléphone
- `contact@cs-creations-florales.fr` → votre email
- `[À compléter]` → SIREN/SIRET et infos hébergeur

### Photos
Les photos utilisent des images Unsplash (placeholder). 
Pour les remplacer :
1. Placez vos photos dans `/public/images/`
2. Remplacez les URLs `https://images.unsplash.com/...` par `/images/votre-photo.jpg`

### Formulaire de contact
Le formulaire est prêt mais simule l'envoi. Pour le connecter :
- **Formspree** (gratuit) : ajoutez `action="https://formspree.io/f/VOTRE_ID"` au formulaire
- **EmailJS** : intégrez le SDK EmailJS
- **Backend custom** : adaptez la fonction `handleSubmit` dans `Contact.jsx`

### Paiement SumUp
Dans `CGV.jsx`, la ligne SumUp est déjà mentionnée. Pour intégrer :
```html
<script src="https://gateway.sumupmerchants.com/gateway/v2/sdk/widget.js"></script>
```

---

## 🔧 Technologies

- **React 18** + **Vite**
- **React Router v6**
- **Tailwind CSS v3**
- **Google Fonts** : Cormorant Garamond, Playfair Display, Lato

---

## ✅ Conformité légale

- ✅ Bandeau cookies RGPD (accepter / refuser / personnaliser)
- ✅ Mentions légales complètes
- ✅ Politique de confidentialité RGPD
- ✅ CGV
- ✅ Mention RGPD sous le formulaire de contact
- ✅ Champs personnalisables (SIREN, hébergeur, etc.)

---

## 📞 Contact créatrice

**Charlène**  
C&S Créations Florales et Personnalisation  
72220 Écommoy, Sarthe
