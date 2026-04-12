import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CookieBanner from './components/CookieBanner'

import Home from './pages/Home'
import EvenementsFloraux from './pages/EvenementsFloraux'
import Anniversaire from './pages/evenements/Anniversaire'
import Mariage from './pages/evenements/Mariage'
import BaptemeCommunion from './pages/evenements/BaptemeCommunion'
import CreationsDecoratives from './pages/CreationsDecoratives'
import CreationsFuneraires from './pages/CreationsFuneraires'
import CreationsSaisonnieres from './pages/CreationsSaisonnieres'
import Paques from './pages/saisonniers/Paques'
import Noel from './pages/saisonniers/Noel'
import FeteDesMeres from './pages/saisonniers/FeteDesMeres'
import Personnalisation from './pages/Personnalisation'
import Contact from './pages/Contact'
import MentionsLegales from './pages/MentionsLegales'
import PolitiqueConfidentialite from './pages/PolitiqueConfidentialite'
import CGV from './pages/CGV'
import Paiement from './pages/Paiement'
import Panier from './pages/Panier'
import Admin from './pages/Admin'
import Inscription from './pages/compte/Inscription'
import Connexion from './pages/compte/Connexion'
import MonCompte from './pages/compte/MonCompte'
import ScrollReveal from './components/ScrollReveal'
import ScrollToTop from './components/ScrollToTop'

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ScrollReveal />
      <Navbar />
      <main className="site-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/evenements-floraux" element={<EvenementsFloraux />} />
          <Route path="/evenements-floraux/anniversaire" element={<Anniversaire />} />
          <Route path="/evenements-floraux/mariage" element={<Mariage />} />
          <Route path="/evenements-floraux/bapteme-communion" element={<BaptemeCommunion />} />
          <Route path="/creations-florales" element={<CreationsDecoratives />} />
          <Route path="/creations-funeraires" element={<CreationsFuneraires />} />
          <Route path="/creations-saisonnieres" element={<CreationsSaisonnieres />} />
          <Route path="/creations-saisonnieres/paques" element={<Paques />} />
          <Route path="/creations-saisonnieres/noel" element={<Noel />} />
          <Route path="/creations-saisonnieres/fete-des-meres" element={<FeteDesMeres />} />
          <Route path="/personnalisation" element={<Personnalisation />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/compte/inscription" element={<Inscription />} />
          <Route path="/compte/connexion" element={<Connexion />} />
          <Route path="/compte" element={<MonCompte />} />
          <Route path="/panier" element={<Panier />} />
          <Route path="/paiement" element={<Paiement />} />
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/politique-de-confidentialite" element={<PolitiqueConfidentialite />} />
          <Route path="/cgv" element={<CGV />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <Footer />
      <CookieBanner />
    </BrowserRouter>
  )
}

export default App
