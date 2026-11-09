import { BrowserRouter, Link, Route, Routes, useParams } from "react-router-dom";
import Page from "./Page";
import plats from "./plats.json";

function Accueil() {
  return (
    <Page
      title="Chez Marcel, restaurant de cuisine de saison à Lyon"
      description="Chez Marcel propose une cuisine de saison faite maison. Découvrez la carte et réservez votre table."
    >
      <h1>Chez Marcel</h1>
      <p>Cuisine de saison, faite maison.</p>
      <ul>
        {plats.map((p) => (
          <li key={p.slug}>
            <Link to={`/plats/${p.slug}`}>{p.nom}</Link> - {p.prix} €
          </li>
        ))}
      </ul>
    </Page>
  );
}

function FichePlat() {
  const { slug } = useParams();
  const plat = plats.find((p) => p.slug === slug);

  if (!plat) {
    return (
      <Page title="Plat introuvable - Chez Marcel" description="Ce plat n'existe pas.">
        <p>Plat introuvable.</p>
        <Link to="/">Retour à la carte</Link>
      </Page>
    );
  }

  return (
    <Page
      title={`${plat.nom} - Chez Marcel`}
      description={`${plat.nom} : ${plat.description} ${plat.prix} €.`}
    >
      <h1>{plat.nom}</h1>
      <p>{plat.description}</p>
      <p>{plat.prix} €</p>
      <Link to="/">Retour à la carte</Link>
    </Page>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/plats/:slug" element={<FichePlat />} />
      </Routes>
    </BrowserRouter>
  );
}
