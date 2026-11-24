import CategoryRow from '../components/movies/CategoryRow'
import HeroBanner from '../components/movies/HeroBanner'
import { categories } from '../config/constants'
import { useMovies } from '../hooks/useMovies'
import './HomePage.css'

export default function HomePage() {
  const { movies } = useMovies()
  const publishedMovies = movies.filter((movie) => movie.published)

  const rows = categories
    .map((category) => ({
      category,
      movies: publishedMovies.filter((movie) => movie.category === category),
    }))
    .filter((row) => row.movies.length > 0)

  return (
    <main className="home-page">
      <div className="container">
        <h1 className="home-page__title">Cartelera</h1>
        <p className="home-page__subtitle">
          {publishedMovies.length} título
          {publishedMovies.length === 1 ? '' : 's'} disponibles
        </p>
      </div>

      <HeroBanner />

      <div className="container home-page__rows">
        {rows.length === 0 ? (
          <p className="home-page__empty">
            <i className="bi bi-collection-play" aria-hidden="true" />
            Todavía no hay títulos publicados.
          </p>
        ) : (
          rows.map((row) => (
            <CategoryRow
              key={row.category}
              title={row.category}
              movies={row.movies}
            />
          ))
        )}
      </div>
    </main>
  )
}
