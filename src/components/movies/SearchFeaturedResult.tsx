import type { Movie } from '../../types/movie'
import { formatTitleMeta } from '../../utils/movieMeta'
import './SearchFeaturedResult.css'

type SearchFeaturedResultProps = {
  movie: Movie
}

export default function SearchFeaturedResult({ movie }: SearchFeaturedResultProps) {
  const typeLabel = movie.type === 'serie' ? 'Serie' : 'Película'
  const movieMeta = formatTitleMeta(movie)

  return (
    <article className="search-featured">
      <img className="search-featured__poster" src={movie.imageUrl} alt={movie.name} />

      <div className="search-featured__info">
        <span className="search-featured__type">{typeLabel}</span>
        <h3 className="search-featured__title">{movie.name}</h3>
        {movieMeta && <p className="search-featured__meta">{movieMeta}</p>}
        <span className="search-featured__category">{movie.category}</span>
        <p className="search-featured__description">{movie.description}</p>

        {movie.trailerKey && (
          <a
            className="search-featured__trailer"
            href={`https://www.youtube.com/watch?v=${movie.trailerKey}`}
            target="_blank"
            rel="noreferrer"
          >
            <i className="bi bi-play-fill" aria-hidden="true"></i>
            Ver tráiler
          </a>
        )}
      </div>
    </article>
  )
}
