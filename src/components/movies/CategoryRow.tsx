import { useCallback, useEffect, useRef, useState } from 'react'
import type { Movie } from '../../types/movie'
import { slugify } from '../../utils/slugify'
import MovieCard from './MovieCard'
import './CategoryRow.css'

type CategoryRowProps = {
  title: string
  movies: Movie[]
}

export default function CategoryRow({ title, movies }: CategoryRowProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)
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
  }, [updateScrollState, movies.length])

  const scrollByPage = (direction: 1 | -1) => {
    const scroller = scrollerRef.current
    if (!scroller) return

    scroller.scrollBy({
      left: direction * scroller.clientWidth * 0.85,
      behavior: 'smooth',
    })
  }

  if (movies.length === 0) return null

  return (
    <section
      id={`categoria-${slugify(title)}`}
      className="category-row"
      aria-labelledby={`categoria-${slugify(title)}-titulo`}
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
        className="category-row__viewport"
        onScroll={updateScrollState}
      >
        <div className="category-row__track">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </section>
  )
}
