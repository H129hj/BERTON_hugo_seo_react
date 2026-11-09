// Après le build, on génère un fichier HTML par page avec le title, la meta
// description et le contenu déjà dedans. Les crawlers n'ont plus besoin
// d'exécuter le JavaScript pour lire la page. React reprend la main ensuite.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const SITE = "https://chez-marcel.example";
const plats = JSON.parse(readFileSync("src/plats.json", "utf-8"));
const modele = readFileSync("dist/index.html", "utf-8");

function page(url, title, description, contenu) {
  let html = modele
    .replace(/<title>.*<\/title>/, `<title>${title}</title>`)
    .replace(
      /<meta name="description" content=".*" \/>/,
      `<meta name="description" content="${description}" />\n    <link rel="canonical" href="${SITE}${url}" />`
    )
    .replace('<div id="root"></div>', `<div id="root">${contenu}</div>`);
  const dossier = url === "/" ? "dist" : `dist${url}`;
  mkdirSync(dossier, { recursive: true });
  writeFileSync(`${dossier}/index.html`, html);
}

const liste = plats
  .map((p) => `<li><a href="/plats/${p.slug}">${p.nom}</a> - ${p.prix} €</li>`)
  .join("");

page(
  "/",
  "Chez Marcel, restaurant de cuisine de saison à Lyon",
  "Chez Marcel propose une cuisine de saison faite maison. Découvrez la carte et réservez votre table.",
  `<h1>Chez Marcel</h1><p>Cuisine de saison, faite maison.</p><ul>${liste}</ul>`
);

for (const p of plats) {
  page(
    `/plats/${p.slug}`,
    `${p.nom} - Chez Marcel`,
    `${p.nom} : ${p.description} ${p.prix} €.`,
    `<h1>${p.nom}</h1><p>${p.description}</p><p>${p.prix} €</p><a href="/">Retour à la carte</a>`
  );
}

const urls = ["/", ...plats.map((p) => `/plats/${p.slug}`)];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${SITE}${u === "/" ? "" : u}</loc></url>`).join("\n")}
</urlset>
`;
writeFileSync("dist/sitemap.xml", sitemap);
console.log(`${urls.length} pages pré-rendues, sitemap.xml écrit`);
