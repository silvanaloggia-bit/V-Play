import { useCallback, useEffect, useRef, useState } from 'react'
import type { Movie } from '../../types/movie'
import { slugify } from '../../utils/slugify'
import MoviePreview from './MoviePreview'
import MovieCard from './MovieCard'
import './CategoryRow.css'

type CategoryRowProps = {
  title: string
  movies: Movie[]
}

type HoveredMovie = {
  movie: Movie
  left: number
}

export default function CategoryRow({ title, movies }: CategoryRowProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const [canScroll, setCanScroll] = useState({ left: false, right: false })
  const [hovered, setHovered] = useState<HoveredMovie | null>(null)

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
  }, [updateScrollState, movies.length])

  if (movies.length === 0) return null

  function showPreview(movie: Movie, target: HTMLElement) {
    const section = sectionRef.current
    if (!section) return

    const sectionRect = section.getBoundingClientRect()
    const cardRect = target.getBoundingClientRect()
    const raw = cardRect.left - sectionRect.left + cardRect.width / 2
    const half = Math.min(280, sectionRect.width / 2)

    setHovered({
      movie,
      left: Math.min(Math.max(raw, half), sectionRect.width - half),
    })
  }

  function scrollByPage(direction: 1 | -1) {
    const scroller = scrollerRef.current
    if (!scroller) return

    scroller.scrollBy({
      left: direction * scroller.clientWidth * 0.85,
      behavior: 'smooth',
    })
  }

  const id = `categoria-${slugify(title)}`

  return (
    <section
      ref={sectionRef}
      id={id}
      className="category-row"
      aria-labelledby={`categoria-${slugify(title)}-titulo`}
      onMouseLeave={() => setHovered(null)}
    >
      <header className="category-row__header">
        <div>
          <h2
            id={`categoria-${slugify(title)}-titulo`}
            className="category-row__title"
          >
            {title}
          </h2>
          <span className="category-row__count">
            {movies.length} título{movies.length === 1 ? '' : 's'}
          </span>
        </div>

        <div className="category-row__controls">
          <button
            type="button"
            className="category-row__arrow"
            onClick={() => scrollByPage(-1)}
            disabled={!canScroll.left}
            aria-label={`Ver títulos anteriores de ${title}`}
          >
            <i className="bi bi-chevron-left" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="category-row__arrow"
            onClick={() => scrollByPage(1)}
            disabled={!canScroll.right}
            aria-label={`Ver más títulos de ${title}`}
          >
            <i className="bi bi-chevron-right" aria-hidden="true" />
          </button>
        </div>
      </header>

      <div
        ref={scrollerRef}
        className={`category-row__viewport ${hovered ? 'category-row__viewport--preview' : ''}`}
        onScroll={updateScrollState}
      >
        <div className="category-row__track">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="category-row__card-wrap"
              onMouseEnter={(event) => showPreview(movie, event.currentTarget)}
              onFocus={(event) => showPreview(movie, event.currentTarget)}
            >
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </div>

      {hovered && (
        <div
          className="category-row__preview"
          style={{ left: hovered.left }}
          role="group"
          aria-label={`Vista previa de ${hovered.movie.name}`}
        >
          <MoviePreview movie={hovered.movie} />
        </div>
      )}
    </section>
  )
}
