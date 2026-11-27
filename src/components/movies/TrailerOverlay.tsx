import { useRef, useState } from 'react'
import type { Movie } from '../../types/movie'
import './TrailerOverlay.css'

interface TrailerOverlayProps {
  movie: Movie
  active?: boolean
}

export default function TrailerOverlay({ movie, active = false }: TrailerOverlayProps) {
  const [hovering, setHovering] = useState(active)
  const [muted, setMuted] = useState(true)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  if (!movie.trailerKey) return null

  const embedUrl = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(movie.trailerKey)}?autoplay=1&mute=1&controls=0&playsinline=1&enablejsapi=1`

  function sendCommand(func: 'mute' | 'unMute'): void {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func, args: [] }),
      '*',
    )
  }

  function toggleSound(): void {
    const next = !muted
    setMuted(next)
    sendCommand(next ? 'mute' : 'unMute')
  }

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
            ref={iframeRef}
            className="trailer-overlay__frame"
            src={embedUrl}
            title={`Tráiler de ${movie.name}`}
            allow="autoplay; encrypted-media; picture-in-picture"
            onLoad={() => sendCommand('mute')}
          />
          <button
            type="button"
            className="trailer-overlay__sound"
            aria-label={muted ? 'Activar sonido' : 'Silenciar'}
            aria-pressed={!muted}
            onClick={toggleSound}
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
