import EventPage from '../../components/EventPage'
import { P, w1200 } from '../../data/flowerPhotos'

export default function BaptemeCommunion() {
  return (
    <EventPage
      title="Baptême & Communion"
      subtitle="Événements floraux"
      coverImg={w1200(P.peonies)}
      articlePageKey="baptemeCommunion"
      pagePath="/evenements-floraux/bapteme-communion"
    />
  )
}
