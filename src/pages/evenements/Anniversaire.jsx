import EventPage from '../../components/EventPage'
import { P, w1200 } from '../../data/flowerPhotos'

export default function Anniversaire() {
  return (
    <EventPage
      title="Anniversaire"
      subtitle="Événements floraux"
      coverImg={w1200(P.dahlias)}
      intro="Un anniversaire, c'est un moment précieux à célébrer avec éclat et tendresse. Je crée pour vous des compositions florales festives, colorées et personnalisées qui reflètent la personnalité de la personne honorée. Que ce soit pour un enfant, un adulte ou un centenaire, chaque création est pensée avec amour pour rendre ce moment inoubliable."
      articlePageKey="anniversaire"
      pagePath="/evenements-floraux/anniversaire"
    />
  )
}
