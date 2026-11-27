import { Link, useSearchParams } from 'react-router'
import CategoryRow from '../components/movies/CategoryRow'
import HeroBanner from '../components/movies/HeroBanner'
import MovieCard from '../components/movies/MovieCard'
import SearchFeaturedResult from '../components/movies/SearchFeaturedResult'
import TopRow from '../components/movies/TopRow'
import { useCategories } from '../hooks/useCategories'
import { useDebouncedText } from '../hooks/useDebouncedText'
import { useMovies } from '../hooks/useMovies'
import { useTops } from '../hooks/useTops'
import './HomePage.css'

const SEARCH_DELAY_IN_MILLISECONDS = 400
const SUGGESTION_COUNT = 6

function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

export default function HomePage() {
  const { movies } = useMovies()
  const { categories } = useCategories()
  const { topMovies, topSeries } = useTops(movies)
  const publishedMovies = movies.filter((movie) => movie.published)

  const [searchParams] = useSearchParams()
  const searchText = searchParams.get('buscar') ?? ''
  const debouncedSearchText = useDebouncedText(searchText, SEARCH_DELAY_IN_MILLISECONDS)
  const normalizedSearchText = normalizeText(debouncedSearchText)
  const searchResults = publishedMovies.filter((movie) =>
    normalizeText(movie.name).includes(normalizedSearchText),
  )
  const [featuredResult, ...otherResults] = searchResults
  const suggestedMovies = publishedMovies.slice(0, SUGGESTION_COUNT)

  const rows = categories
    .map((category) => ({
      category,
      movies: publishedMovies.filter((movie) => movie.category === category.name),
    }))
    .filter((row) => row.movies.length > 0)

  const publishedTopMovies = topMovies.filter((movie) => movie.published)
  const publishedTopSeries = topSeries.filter((movie) => movie.published)

  return (
    <main className="home-page">
      {normalizedSearchText ? (
        <section className="container home-page__search" aria-live="polite">
          <h2 className="home-page__search-title">
            Resultados para <span>"{debouncedSearchText.trim()}"</span>
          </h2>

          {featuredResult ? (
            <>
              <SearchFeaturedResult key={featuredResult.id} movie={featuredResult} />

              {otherResults.length > 0 && (
                <>
                  <h3 className="home-page__more-title">Más resultados</h3>
                  <div className="home-page__search-results">
                    {otherResults.map((movie) => (
                      <MovieCard key={movie.id} movie={movie} />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <div className="home-page__empty home-page__empty--search">
                <i className="bi bi-search" aria-hidden="true" />
                <span>No encontramos títulos con ese nombre. Probá con otra palabra.</span>
                <Link to="/" className="home-page__back-button">
                  <i className="bi bi-house-door-fill" aria-hidden="true" />
                  Volver al inicio
                </Link>
              </div>

              <h3 className="home-page__more-title">Te puede interesar</h3>
              <div className="home-page__search-results">
                {suggestedMovies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </>
          )}
        </section>
      ) : (
        <>
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
                    key={row.category.id}
                    title={row.category.name}
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
        </>
      )}
    </main>
  )
}
