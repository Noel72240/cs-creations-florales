import EventPage from '../../components/EventPage'
import { P, w1200 } from '../../data/flowerPhotos'

export default function Mariage() {
  return (
    <EventPage
      title="Mariage"
      subtitle="Événements floraux"
      coverImg={w1200(P.weddingBouquet)}
      articlePageKey="mariage"
      pagePath="/evenements-floraux/mariage"
    />
  )
}
