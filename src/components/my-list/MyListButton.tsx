import { useMyList } from '../../hooks/useMyList'
import './MyListButton.css'

interface MyListButtonProps {
  movieId: string
  movieName: string
}

export default function MyListButton({ movieId, movieName }: MyListButtonProps) {
  const { isSubscriber, myListIds, toggleMyList } = useMyList()

  if (!isSubscriber) {
    return null
  }

  const isInMyList = myListIds.includes(movieId)
  const buttonLabel = isInMyList ? `Quitar ${movieName} de Mi lista` : `Agregar ${movieName} a Mi lista`

  return (
    <button
      type="button"
      className={`my-list-button ${isInMyList ? 'my-list-button--active' : ''}`}
      aria-label={buttonLabel}
      aria-pressed={isInMyList}
      title={isInMyList ? 'Quitar de Mi lista' : 'Agregar a Mi lista'}
      onClick={() => toggleMyList(movieId)}
    >
      <i className={`bi ${isInMyList ? 'bi-bookmark-check-fill' : 'bi-bookmark-plus'}`} aria-hidden="true"></i>
    </button>
  )
}
