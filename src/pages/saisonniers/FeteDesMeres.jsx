import SeasonPage from '../../components/SeasonPage'
import { P, w1200 } from '../../data/flowerPhotos'

export default function FeteDesMeres() {
  return (
    <SeasonPage
      title="Fête des Mères"
      subtitle="Créations saisonnières"
      icon="💝"
      coverImg={w1200(P.bouquetSoft)}
      intro="Les mamans méritent le plus beau des cadeaux. Pour la Fête des Mères, je crée des bouquets et compositions florales tendres et délicats, dans des teintes douces et romantiques — roses, pivoines, lisianthus — pour exprimer avec les fleurs tout l'amour que les mots peinent parfois à dire. Chaque bouquet est un hommage à la femme extraordinaire qu'est votre maman."
      articlePageKey="feteDesMeres"
      pagePath="/creations-saisonnieres/fete-des-meres"
    />
  )
}
