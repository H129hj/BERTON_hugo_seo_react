# Quête 6 : SEO d'une application React (site de restaurant)

Cas : un restaurant a un site vitrine en SPA React (Vite + React Router, sans
rendu serveur). Le HTML envoyé au navigateur ne contient qu'un `<div id="root">`
vide, et le titre est le même sur toutes les pages. Ce projet montre les deux
corrections par ordre de priorité.

## 1. Avoir du contenu dans le HTML (pré-rendu)

Le script `prerender.mjs` tourne après `vite build`. Il crée un fichier HTML par
page (`dist/index.html`, `dist/plats/<plat>/index.html`) avec le contenu déjà
écrit dans le `div#root`. Un crawler lit donc la page sans exécuter de
JavaScript, et React reprend la main côté navigateur.

Pour un site vitrine qui change rarement, c'est suffisant. Pour un vrai site
avec beaucoup de contenu, je passerais à un framework avec SSG/SSR (Next.js ou
Astro) plutôt que de maintenir ce script à la main.

## 2. Un title et une meta description par page

- côté navigateur : le composant `Page` change `document.title` et la meta
  description à chaque route ;
- côté HTML pré-rendu : le script écrit les mêmes valeurs, plus un
  `<link rel="canonical">`.

Les URLs sont de vraies routes (`/plats/tarte-citron`) et pas du hash routing
(`/#/plats/...`), car la partie après `#` n'est pas traitée comme un chemin par
les crawlers.

## 3. Pour que Google trouve tout

- `public/robots.txt` autorise l'exploration et indique le sitemap ;
- `dist/sitemap.xml` est généré avec une URL par page ; on le soumet ensuite
  dans la Search Console.

Le domaine `chez-marcel.example` est un exemple, le site n'est pas déployé.

## Lancer

```bash
npm install
npm run build
npm run preview
```

Pour vérifier : `curl http://localhost:4173/plats/tarte-citron/` (avec le slash
final) doit déjà afficher le titre et le contenu du plat. Sans le slash,
`vite preview` renvoie la page d'accueil, car il ne sert pas le dossier tout
seul. Sur un hébergeur statique classique (Netlify, GitHub Pages...) les deux
fonctionnent, mais il faut alors choisir une version et rediriger l'autre
(c'est le problème du trailing slash vu dans la quête 4).

## SEA (introduction)

Le SEO est gratuit mais lent (plusieurs semaines). Le SEA (Google Ads) donne des
visites tout de suite mais s'arrête quand on arrête de payer. Le Quality Score
dépend de la pertinence de l'annonce et de la page de destination : les mêmes
pages bien titrées servent aux deux.
