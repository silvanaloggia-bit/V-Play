import { Link } from 'react-router'
import MovieCard from '../components/movies/MovieCard'
import { useMovies } from '../hooks/useMovies'
import { useMyList } from '../hooks/useMyList'
import './MyListPage.css'

export default function MyListPage() {
  const { movies } = useMovies()
  const { isSubscriber, myListIds } = useMyList()

  const myListMovies = movies.filter((movie) => movie.published && myListIds.includes(movie.id))

  return (
    <main className="container my-list-page">
      <header className="my-list-page__header">
        <i className="bi bi-bookmark-heart-fill my-list-page__icon" aria-hidden="true"></i>
        <div>
          <h1 className="my-list-page__title">
            Mi <span>lista</span>
          </h1>
          <p className="my-list-page__subtitle">
            Lo que guardaste para ver después
            {isSubscriber && myListMovies.length > 0 && ` · ${myListMovies.length} títulos`}
          </p>
        </div>
      </header>

      {!isSubscriber && (
        <p className="my-list-page__message">
          <Link to="/login">Iniciá sesión</Link> con tu cuenta para armar tu lista.
        </p>
      )}

      {isSubscriber && myListMovies.length === 0 && (
        <p className="my-list-page__message">
          Todavía no agregaste títulos. Tocá el <i className="bi bi-bookmark-plus" aria-hidden="true"></i> en
          cualquier película o serie para guardarla acá.
        </p>
      )}

      {isSubscriber && myListMovies.length > 0 && (
        <div className="my-list-page\\\_\\\_grid">
          {myListMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </main>
  )
}
