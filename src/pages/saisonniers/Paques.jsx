import SeasonPage from '../../components/SeasonPage'
import { P, w1200 } from '../../data/flowerPhotos'

export default function Paques() {
  return (
    <SeasonPage
      title="Pâques"
      subtitle="Créations saisonnières"
      icon="🐣"
      coverImg={w1200(P.tulips)}
      intro="Le printemps éclate de mille couleurs à Pâques ! Je crée pour vous des compositions florales joyeuses et légères qui célèbrent le renouveau de la nature. Des compositions printanières aux teintes fraîches — jaune jonquille, vert tendre, rose pâle, lilas doux — pour illuminer votre table, votre maison ou offrir un cadeau original et fleuri."
      articlePageKey="paques"
      pagePath="/creations-saisonnieres/paques"
    />
  )
}
