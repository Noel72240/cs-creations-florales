import EventPage from '../../components/EventPage'
import { P, w1200 } from '../../data/flowerPhotos'

export default function Mariage() {
  return (
    <EventPage
      title="Mariage"
      subtitle="Événements floraux"
      coverImg={w1200(P.weddingBouquet)}
      intro="Le mariage est le plus beau jour de votre vie, et les fleurs en sont l'âme. Je vous accompagne de la première consultation jusqu'au jour J pour créer un univers floral unique, romantique et élégant qui vous ressemble. Chaque bouquet, chaque centre de table, chaque décoration est réalisé avec une attention absolue aux détails et à votre vision de ce grand jour."
      articlePageKey="mariage"
      pagePath="/evenements-floraux/mariage"
    />
  )
}
