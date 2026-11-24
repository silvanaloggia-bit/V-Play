import type { Movie } from '../../types/movie'
import { formatTitleMeta } from '../../utils/movieMeta'
import './MovieCard.css'

type MovieCardProps = {
  movie: Movie
}

export default function MovieCard({ movie }: MovieCardProps) {
  const type = movie.type ?? 'pelicula'
  const typeLabel = type === 'serie' ? 'Serie' : 'Película'
  const meta = formatTitleMeta(movie)

  return (
    <article className="movie-card" tabIndex={0} aria-label={`${movie.name} (${typeLabel})`}>
      <div className="movie-card__poster">
        {movie.imageUrl ? (
          <img
            className="movie-card__image"
            src={movie.imageUrl}
            alt={movie.name}
            loading="lazy"
          />
        ) : (
          <div className="movie-card__placeholder" aria-hidden="true">
            <i className="bi bi-film" />
          </div>
        )}

        <span className="movie-card__badge">{typeLabel}</span>

        <div className="movie-card__overlay">
          <h3 className="movie-card__title">{movie.name}</h3>
          <p className="movie-card__description">{movie.description}</p>
          <span className="movie-card__category">{movie.category}</span>
          {meta && <span className="movie-card__meta">{meta}</span>}
        </div>
      </div>
    </article>
  )
}
