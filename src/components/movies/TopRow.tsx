import { useCallback, useEffect, useRef, useState } from 'react'
import type { Movie } from '../../types/movie'
import { formatTitleMeta } from '../../utils/movieMeta'
import { slugify } from '../../utils/slugify'
import TrailerOverlay from './TrailerOverlay'
import './TopRow.css'

type TopRowProps = {
  title: string
  movies: Movie[]
}

const TOP_LIMIT = 5

export default function TopRow({ title, movies }: TopRowProps) {
  const items = movies.slice(0, TOP_LIMIT)
  const scrollerRef = useRef<HTMLOListElement>(null)
  const [canScroll, setCanScroll] = useState({ left: false, right: false })

  const updateScrollState = useCallback(() => {
    const scroller = scrollerRef.current
    if (!scroller) return

    const maxScroll = scroller.scrollWidth - scroller.clientWidth
    setCanScroll({
      left: scroller.scrollLeft > 8,
      right: scroller.scrollLeft < maxScroll - 8,
    })
  }, [])

  useEffect(() => {
    updateScrollState()
    window.addEventListener('resize', updateScrollState)
    return () => window.removeEventListener('resize', updateScrollState)
  }, [updateScrollState, items.length])

  if (items.length === 0) return null

  const id = `categoria-${slugify(title)}`

  function scrollByPage(direction: 1 | -1) {
    const scroller = scrollerRef.current
    if (!scroller) return

    scroller.scrollBy({
      left: direction * scroller.clientWidth * 0.8,
      behavior: 'smooth',
    })
  }

  return (
    <section id={id} className="top-row" aria-labelledby={`${id}-titulo`}>
      <div className="top-row__header">
        <h2 id={`${id}-titulo`} className="top-row__title">
          <i className="bi bi-trophy-fill" aria-hidden="true" />
          {title}
        </h2>

        <div className="top-row__controls">
          <button
            type="button"
            className="top-row__arrow"
            onClick={() => scrollByPage(-1)}
            disabled={!canScroll.left}
            aria-label={`Ver títulos anteriores de ${title}`}
          >
            <i className="bi bi-chevron-left" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="top-row__arrow"
            onClick={() => scrollByPage(1)}
            disabled={!canScroll.right}
            aria-label={`Ver más títulos de ${title}`}
          >
            <i className="bi bi-chevron-right" aria-hidden="true" />
          </button>
        </div>
      </div>

      <ol
        ref={scrollerRef}
        className="top-row__list"
        onScroll={updateScrollState}
      >
        {items.map((movie, index) => {
          const meta = formatTitleMeta(movie)

          return (
            <li
              key={movie.id}
              className={`top-row__item ${index === 0 ? 'top-row__item--first' : ''}`}
              tabIndex={0}
              aria-label={`${index + 1}. ${movie.name}${meta ? `. ${meta}` : ''}`}
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
                  <TrailerOverlay movie={movie} />
                </div>

                <span className="top-row__name">{movie.name}</span>
                {meta && <span className="top-row__meta">{meta}</span>}
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
