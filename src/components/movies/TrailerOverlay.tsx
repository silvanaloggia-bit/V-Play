import { useState } from 'react'
import type { Movie } from '../../types/movie'
import './TrailerOverlay.css'

interface TrailerOverlayProps {
  movie: Movie
}

export default function TrailerOverlay({ movie }: TrailerOverlayProps) {
  const [hovering, setHovering] = useState(false)
  const [muted, setMuted] = useState(true)

  if (!movie.trailerKey) return null

  const embedUrl = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(movie.trailerKey)}?autoplay=1&mute=${muted ? 1 : 0}&controls=0&playsinline=1`

  function hide(): void {
    setHovering(false)
    setMuted(true)
  }

  return (
    <div
      className="trailer-overlay"
      tabIndex={0}
      aria-label={`Tráiler de ${movie.name}`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={hide}
      onFocus={() => setHovering(true)}
      onBlur={hide}
    >
      {hovering && (
        <>
          <iframe
            className="trailer-overlay__frame"
            src={embedUrl}
            title={`Tráiler de ${movie.name}`}
            allow="autoplay; encrypted-media; picture-in-picture"
          />
          <button
            type="button"
            className="trailer-overlay__sound"
            aria-label={muted ? 'Activar sonido' : 'Silenciar'}
            aria-pressed={!muted}
            onClick={() => setMuted((current) => !current)}
          >
            <i
              className={muted ? 'bi bi-volume-mute' : 'bi bi-volume-up'}
              aria-hidden="true"
            />
          </button>
        </>
      )}
    </div>
  )
}
