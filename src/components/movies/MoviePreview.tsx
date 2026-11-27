import type { Movie } from '../../types/movie'
import { formatTitleMeta } from '../../utils/movieMeta'
import MyListButton from '../my-list/MyListButton'
import TrailerOverlay from './TrailerOverlay'
import './MoviePreview.css'

type MoviePreviewProps = {
  movie: Movie
  rank?: number
}

export default function MoviePreview({ movie, rank }: MoviePreviewProps) {
  const meta = formatTitleMeta(movie)

  return (
    <div className="movie-preview">
      <div className="movie-preview__poster">
        {movie.imageUrl ? (
          <img
            className="movie-preview__image"
            src={movie.imageUrl}
            alt={movie.name}
          />
        ) : (
          <div className="movie-preview__placeholder">
            <i className="bi bi-film" aria-hidden="true" />
          </div>
        )}

        <TrailerOverlay movie={movie} active />
        <MyListButton movieId={movie.id} movieName={movie.name} />
      </div>

      <div className="movie-preview__info">
        {rank !== undefined && (
          <span className="movie-preview__rank">#{rank}</span>
        )}
        <span className="movie-preview__name">{movie.name}</span>
        <p className="movie-preview__description">{movie.description}</p>
        {meta && <span className="movie-preview__meta">{meta}</span>}
      </div>
    </div>
  )
}
