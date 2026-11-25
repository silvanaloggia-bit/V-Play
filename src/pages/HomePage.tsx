import CategoryRow from '../components/movies/CategoryRow'
import HeroBanner from '../components/movies/HeroBanner'
import TopRow from '../components/movies/TopRow'
import { categories } from '../config/constants'
import { useMovies } from '../hooks/useMovies'
import { useTops } from '../hooks/useTops'
import './HomePage.css'

export default function HomePage() {
  const { movies } = useMovies()
  const { topMovies, topSeries } = useTops(movies)
  const publishedMovies = movies.filter((movie) => movie.published)

  const rows = categories
    .map((category) => ({
      category,
      movies: publishedMovies.filter((movie) => movie.category === category),
    }))
    .filter((row) => row.movies.length > 0)

  // Los tops van siempre después de todas las categorías y nunca muestran borradores.
  const publishedTopMovies = topMovies.filter((movie) => movie.published)
  const publishedTopSeries = topSeries.filter((movie) => movie.published)

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
        {publishedMovies.length === 0 ? (
          <p className="home-page__empty">
            <i className="bi bi-collection-play" aria-hidden="true" />
            Todavía no hay títulos publicados.
          </p>
        ) : (
          <>
            {rows.map((row) => (
              <CategoryRow
                key={row.category}
                title={row.category}
                movies={row.movies}
              />
            ))}

            {publishedTopMovies.length > 0 && (
              <TopRow title="Top 5 películas" movies={publishedTopMovies} />
            )}

            {publishedTopSeries.length > 0 && (
              <TopRow title="Top 5 series" movies={publishedTopSeries} />
            )}
          </>
        )}
      </div>
    </main>
  )
}
