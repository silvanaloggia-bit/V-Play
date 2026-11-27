import { useState } from 'react'
import Carousel from 'react-bootstrap/Carousel'
import { useMovies } from '../../hooks/useMovies'
import { formatTitleMeta } from '../../utils/movieMeta'
import { slugify } from '../../utils/slugify'
import './Hero.css'

const BADGE = 'Destacadas en VPlay'

export default function HeroBanner() {
  const { movies } = useMovies()
  const [index, setIndex] = useState(0)

  const slides = movies
    .filter((movie) => movie.isFeatured && movie.published)
    .map((movie) => ({
      id: movie.id,
      image: movie.bannerUrl || movie.imageUrl,
      posterOnly: !movie.bannerUrl,
      title: movie.name,
      description: movie.description,
      meta: formatTitleMeta(movie),
    }))

  const handleSelect = (selectedIndex: number) => {
    setIndex(selectedIndex)
  }

  if (slides.length === 0) return null

  const activeIndex = Math.min(index, slides.length - 1)

  return (
    <Carousel
      className="hero-carousel"
      activeIndex={activeIndex}
      onSelect={handleSelect}
      interval={null}
      controls={slides.length > 1}
    >
      {slides.map((slide) => (
        <Carousel.Item key={slide.id}>
          {slide.posterOnly ? (
            <>
              <img
                className="hero-image hero-image--poster-bg"
                src={slide.image}
                alt=""
                aria-hidden="true"
              />
              <div className="hero-overlay" />
              <img className="hero-poster" src={slide.image} alt={slide.title} />
            </>
          ) : (
            <>
              <img className={`hero-image hero-image--${slugify(slide.title)}`} src={slide.image} alt={slide.title} />
              <div className="hero-overlay" />
            </>
          )}
          <Carousel.Caption className="hero-caption">
            <div className="hero-content">
              <span className="hero-badge">{BADGE}</span>
              <h2 className={`hero-title hero-title--${slugify(slide.title)}`}>{slide.title}</h2>
              {slide.meta && <span className="hero-meta">{slide.meta}</span>}
              <p className="hero-description">{slide.description}</p>
            </div>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  )
}
