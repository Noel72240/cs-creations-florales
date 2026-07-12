import EventPage from '../../components/EventPage'
import { P, w1200 } from '../../data/flowerPhotos'

export default function Anniversaire() {
  return (
    <EventPage
      title="Anniversaire"
      subtitle="Événements floraux"
      coverImg={w1200(P.dahlias)}
      articlePageKey="anniversaire"
      pagePath="/evenements-floraux/anniversaire"
    />
  )
}
