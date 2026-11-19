import { useState } from 'react'
import Carousel from 'react-bootstrap/Carousel'
import { banners } from '../../assets/importMovies'
import './Hero.css'

type Slide = {
  image: string
  title: string
  description: string
  badge: string
}

const slides: Slide[] = [
  {
    image: banners.duna2,
    title: 'Duna: Parte Dos',
    description:
      'Paul Atreides se une a los Fremen para vengar la conspiración que destruyó a su familia, mientras enfrenta un destino que solo él puede evitar.',
    badge: 'Tendencia VPlay',
  },
  {
    image: banners.gladiador2,
    title: 'Gladiador II',
    description:
      'Lucio vuelve a la arena para enfrentarse al poder que lo desterró y recuperar el honor de su familia.',
    badge: 'Tendencia VPlay',
  },
  {
    image: banners.pecadores,
    title: 'Pecadores',
    description:
      'Dos hermanos regresan a su ciudad natal para empezar de nuevo, pero descubren un mal aún mayor que los espera.',
    badge: 'Tendencia VPlay',
  },
]

export default function HeroBanner() {
  const [index, setIndex] = useState(0)

  const handleSelect = (selectedIndex: number) => {
    setIndex(selectedIndex)
  }

  return (
    <Carousel
      className="hero-carousel"
      activeIndex={index}
      onSelect={handleSelect}
      interval={null}
    >
      {slides.map((slide) => (
        <Carousel.Item key={slide.title}>
          <img className="hero-image" src={slide.image} alt={slide.title} />
          <div className="hero-overlay" />
          <Carousel.Caption className="hero-caption">
            <div className="hero-content">
              <span className="hero-badge">{slide.badge}</span>
              <h2 className="hero-title">{slide.title}</h2>
              <p className="hero-description">{slide.description}</p>
              <div className="hero-actions">
                <button type="button" className="btn btn-light fw-semibold px-4">
                  ▶ Reproducir
                </button>
                <button type="button" className="btn btn-outline-light fw-semibold px-4">
                  ⓘ Más información
                </button>
              </div>
            </div>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  )
}
