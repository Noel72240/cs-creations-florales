import SeasonPage from '../../components/SeasonPage'
import { P, w1200 } from '../../data/flowerPhotos'

export default function Noel() {
  return (
    <SeasonPage
      title="Noël"
      subtitle="Créations saisonnières"
      icon="🎄"
      coverImg={w1200(P.weddingBouquet)}
      intro="La magie de Noël commence par la décoration florale ! Je crée pour vous des compositions hivernales enchanteresses, mêlant sapins, branches givrées, baies rouges, ruban doré et fleurs de saison. Que ce soit pour décorer votre intérieur, votre porte d'entrée, ou pour offrir un cadeau mémorable, chaque création est réalisée avec le soin et l'amour qui rendent les fêtes inoubliables."
      articlePageKey="noel"
      pagePath="/creations-saisonnieres/noel"
    />
  )
}
