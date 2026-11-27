import { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import type { Movie, MovieType } from '../../../types/movie'
import './TopPickerModal.css'

interface TopPickerModalProps {
  movies: Movie[]
  type: MovieType
  currentCount: number
  limit: number
  onClose: () => void
  onAdd: (movie: Movie) => void
}

export default function TopPickerModal({
  movies,
  type,
  currentCount,
  limit,
  onClose,
  onAdd,
}: TopPickerModalProps) {
  const [search, setSearch] = useState('')

  const term = search.trim().toLowerCase()
  const filtered = movies.filter((movie) =>
    movie.name.toLowerCase().includes(term),
  )
  const full = currentCount >= limit
  const label = type === 'serie' ? 'serie' : 'película'

  return (
    <Modal
      show
      onHide={onClose}
      centered
      size="lg"
      fullscreen="sm-down"
      scrollable
      contentClassName="top-picker__content"
    >
      <Modal.Header closeButton closeVariant="white" className="top-picker__header">
        <Modal.Title className="top-picker__title">
          Agregar {label} al top
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="top-picker__search-box">
          <i className="bi bi-search" aria-hidden="true" />
          <input
            type="search"
            className="top-picker__search-input"
            placeholder={`Buscar ${label}…`}
            aria-label={`Buscar ${label}`}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {full && (
          <p className="top-picker__message">
            El top está completo ({currentCount}/{limit}). Quitá un título para
            agregar otro.
          </p>
        )}

        {!full && filtered.length === 0 && (
          <p className="top-picker__message">
            {type === 'serie'
              ? 'No hay series cargadas. Creá una desde la pestaña “Títulos” eligiendo el tipo “Serie”.'
              : 'No hay películas disponibles para agregar al top.'}
          </p>
        )}

        <ul className="top-picker__list">
          {filtered.map((movie) => (
            <li key={movie.id} className="top-picker__row">
              <img
                src={movie.imageUrl}
                alt={movie.name}
                className="top-picker__thumb"
              />
              <div className="top-picker__info">
                <span className="top-picker__name">{movie.name}</span>
                <span className="top-picker__category">
                  {movie.type === 'serie' ? 'Serie' : 'Película'} ·{' '}
                  {movie.category}
                </span>
              </div>
              <button
                type="button"
                className="btn btn-sm top-picker__add-row-btn"
                disabled={full}
                aria-label={`Agregar ${movie.name} al top`}
                onClick={() => onAdd(movie)}
              >
                <i className="bi bi-plus-lg" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      </Modal.Body>

      <Modal.Footer className="top-picker__footer">
        <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
          Cerrar
        </button>
      </Modal.Footer>
    </Modal>
  )
}
