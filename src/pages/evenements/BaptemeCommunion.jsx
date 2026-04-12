import EventPage from '../../components/EventPage'
import { P, w1200 } from '../../data/flowerPhotos'

export default function BaptemeCommunion() {
  return (
    <EventPage
      title="Baptême & Communion"
      subtitle="Événements floraux"
      coverImg={w1200(P.peonies)}
      intro="Le baptême et la communion sont des moments empreints de douceur, de grâce et de spiritualité. Je crée pour ces occasions des compositions florales tendres et délicates, dans des teintes pastel, blanches ou rosées, pour envelopper ces instants de beauté et d'émotion. Chaque arrangement est pensé pour s'harmoniser avec la pureté et la joie de ces cérémonies inoubliables."
      articlePageKey="baptemeCommunion"
      pagePath="/evenements-floraux/bapteme-communion"
    />
  )
}
