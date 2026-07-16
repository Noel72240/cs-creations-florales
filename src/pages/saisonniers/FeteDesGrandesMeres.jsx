import SeasonPage from '../../components/SeasonPage'
import { P, w1200 } from '../../data/flowerPhotos'

export default function FeteDesGrandesMeres() {
  return (
    <SeasonPage
      title="Fête des Grandes-Mères"
      subtitle="Créations saisonnières"
      icon="💐"
      coverImg={w1200(P.peonies)}
      intro="Les grands-mères ont une place unique dans nos cœurs. Pour la Fête des Grandes-Mères, je crée des compositions florales tendres et chaleureuses — cœurs gravés, bouquets délicats et créations durables — pour leur dire merci avec poésie et affection."
      articlePageKey="feteDesGrandesMeres"
      pagePath="/creations-saisonnieres/fete-des-grandes-meres"
      headerClassName="page-header--subtitle-lower"
    />
  )
}
