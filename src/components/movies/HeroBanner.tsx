import { useState } from 'react'
import Carousel from 'react-bootstrap/Carousel'
import { terror1, terror2, terror3 } from '../../asset/importMovies'
import './Hero.css'

type Slide = {
  image: string
  title: string
  description: string
}

const slides: Slide[] = [
  {
    image: terror1,
    title: 'Terror',
    description: 'Sumérgete en el género que te mantendrá al borde del asiento.',
  },
  {
    image: terror2,
    title: 'Suspenso',
    description: 'Historias que te acompañarán mucho después de terminar.',
  },
  {
    image: terror3,
    title: 'Escalofríos',
    description: 'El cine de terror que estabas esperando.',
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
    >
      {slides.map((slide) => (
        <Carousel.Item key={slide.image}>
          <img
            className="d-block w-100 hero-image"
            src={slide.image}
            alt={slide.title}
          />
          <Carousel.Caption className="hero-caption">
            <h3 className="hero-title">{slide.title}</h3>
            <p className="hero-description">{slide.description}</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  )
}
