import type { Movie } from '../../types/movie'
import { slugify } from '../../utils/slugify'
import './TopRow.css'

type TopRowProps = {
  title: string
  movies: Movie[]
}

const TOP_LIMIT = 5

export default function TopRow({ title, movies }: TopRowProps) {
  const items = movies.slice(0, TOP_LIMIT)
  if (items.length === 0) return null

  const id = `categoria-${slugify(title)}`

  return (
    <section id={id} className="top-row" aria-labelledby={`${id}-titulo`}>
      <h2 id={`${id}-titulo`} className="top-row__title">
        <i className="bi bi-trophy-fill" aria-hidden="true" />
        {title}
      </h2>

      <ol className="top-row__list">
        {items.map((movie, index) => (
          <li
            key={movie.id}
            className="top-row__item"
            tabIndex={0}
            aria-label={`${index + 1}. ${movie.name}`}
          >
            <span className="top-row__rank" aria-hidden="true">
              {index + 1}
            </span>

            <div className="top-row__card">
              <div className="top-row__poster-wrapper">
                {movie.imageUrl ? (
                  <img
                    className="top-row__poster"
                    src={movie.imageUrl}
                    alt={movie.name}
                    loading="lazy"
                  />
                ) : (
                  <div className="top-row__poster top-row__poster--empty">
                    <i className="bi bi-film" aria-hidden="true" />
                    <span>Sin póster</span>
                  </div>
                )}

                <div className="top-row__overlay">
                  <span className="top-row__overlay-title">
                    {movie.name}
                  </span>
                  <p className="top-row__overlay-description">
                    {movie.description}
                  </p>
                </div>
              </div>

              <span className="top-row__name">{movie.name}</span>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
