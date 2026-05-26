# Supabase — branchement étape par étape

Ce dossier contient le SQL et le guide pour connecter le site C&S Créations Florales à Supabase.

## Vue d’ensemble

| Étape | Quoi | Fichier SQL |
|-------|------|-------------|
| **1** | Contenu admin (textes, maintenance, avis) | `migrations/20250510000000_site_content.sql` |
| **2** | Photos (Storage) | Bucket dashboard + `migrations/20250510000001_storage_policies.sql` |
| **3** | Commandes SumUp | `migrations/20250514120000_orders_sumup.sql` + promo |
| **Tout d’un coup** | Copier-coller SQL Editor | `setup-complet.sql` |

---

## Étape 0 — Créer le projet Supabase

1. [supabase.com](https://supabase.com) → **New project**
2. Noter :
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** → `VITE_SUPABASE_ANON_KEY`
   - **service_role** (secret) → `SUPABASE_SERVICE_ROLE_KEY` (Vercel uniquement, jamais dans le front)

---

## Étape 1 — Contenu du site (à faire maintenant)

### 1. Exécuter le SQL

**SQL Editor** → New query → ouvrir `setup-complet.sql` (sections 1 uniquement) **ou** tout le fichier.

Vérifier : **Table Editor** → table `site_content` avec colonnes `id`, `payload`, `updated_at`.

### 2. Variables d’environnement (local)

Dans `.env` à la racine :

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_CONTENT_DRIVER=supabase
```

Redémarrer : `npm run dev`

### 3. Variables serveur (enregistrement admin)

Sur **Vercel** (et pour `vercel dev` en local) :

```env
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # secret service_role
ADMIN_PASSWORD=                    # même valeur que VITE_ADMIN_PASSWORD
SUPABASE_URL=https://xxxx.supabase.co
```

Plus besoin de compte **Supabase Auth** dans l’admin : seul le mot de passe du site suffit.

### 4. Tester

1. Ouvrir `/admin` → mot de passe site (`VITE_ADMIN_PASSWORD`)
2. Modifier un texte (ex. bannière promo) → **Enregistrer**
3. Ouvrir le site en navigation privée : le texte doit être à jour

En local avec `npm run dev` seul, l’API admin n’est pas disponible : utilisez `npx vercel dev` ou testez sur Vercel.

### 5. Vercel (quand vous déployez)

Ajouter `VITE_*` + `SUPABASE_SERVICE_ROLE_KEY` + `ADMIN_PASSWORD` → **Redeploy**.

---

## Étape 2 — Photos (Storage)

1. **Storage** → **New bucket** → nom `site-images` → **Public bucket** : ON
2. Exécuter la section 3 de `setup-complet.sql` (ou `migrations/20250510000001_storage_policies.sql`)
3. Dans `.env` :

```env
VITE_SUPABASE_STORAGE_BUCKET=site-images
```

4. Admin (mot de passe site) → upload d’une image dans un article

---

## Étape 3 — Paiement SumUp (plus tard)

Variables **serveur** sur Vercel (sans `VITE_`) :

- `SUMUP_API_KEY`
- `APP_URL` = `https://votre-domaine.vercel.app`
- `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`

Les commandes passent par la table `orders` (déjà dans le SQL).

---

## Dépannage

| Problème | Solution |
|----------|----------|
| Enregistrer dans l’admin ne change pas le site en ligne | `VITE_CONTENT_DRIVER=supabase` + `SUPABASE_SERVICE_ROLE_KEY` + redeploy |
| Erreur serveur / 401 | `ADMIN_PASSWORD` = même mot de passe que `VITE_ADMIN_PASSWORD` sur Vercel |
| Photos ne partent pas | Bucket public + policies Storage + `VITE_SUPABASE_STORAGE_BUCKET` |
| Maintenance pas bloquée côté API | `SUPABASE_SERVICE_ROLE_KEY` sur Vercel + contenu enregistré dans `site_content` |

---

## Prochaine étape

Une fois l’**étape 1** validée chez vous, on enchaîne sur l’**étape 2** (Storage) ou l’**étape 3** (SumUp) selon votre priorité.
