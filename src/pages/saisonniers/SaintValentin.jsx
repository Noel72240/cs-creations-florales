import SeasonPage from '../../components/SeasonPage'
import { P, w1200 } from '../../data/flowerPhotos'

export default function SaintValentin() {
  return (
    <SeasonPage
      title="Saint-Valentin"
      subtitle="Créations saisonnières"
      coverImg={w1200(P.rosesBouquet)}
      articlePageKey="saintValentin"
      pagePath="/creations-saisonnieres/saint-valentin"
    />
  )
}
