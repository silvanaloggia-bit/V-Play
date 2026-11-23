import { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import type { Movie, MovieType } from '../../types/movie'
import styles from './TopPickerModal.module.css'

interface TopPickerModalProps {
  /** Títulos que todavía no están en el top */
  movies: Movie[]
  /** Tipo del top que se está editando */
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
      contentClassName={styles.content}
    >
      <Modal.Header closeButton closeVariant="white" className={styles.header}>
        <Modal.Title className={styles.title}>
          Agregar {label} al top
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className={styles.searchBox}>
          <i className="bi bi-search" aria-hidden="true" />
          <input
            type="search"
            className={styles.searchInput}
            placeholder={`Buscar ${label}…`}
            aria-label={`Buscar ${label}`}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {full && (
          <p className={styles.message}>
            El top está completo ({currentCount}/{limit}). Quitá un título para
            agregar otro.
          </p>
        )}

        {!full && filtered.length === 0 && (
          <p className={styles.message}>
            {type === 'serie'
              ? 'No hay series cargadas. Creá una desde la pestaña “Títulos” eligiendo el tipo “Serie”.'
              : 'No hay películas disponibles para agregar al top.'}
          </p>
        )}

        <ul className={styles.list}>
          {filtered.map((movie) => (
            <li key={movie.id} className={styles.row}>
              <img
                src={movie.imageUrl}
                alt={movie.name}
                className={styles.thumb}
              />
              <div className={styles.info}>
                <span className={styles.name}>{movie.name}</span>
                <span className={styles.category}>
                  {movie.type === 'serie' ? 'Serie' : 'Película'} ·{' '}
                  {movie.category}
                </span>
              </div>
              <button
                type="button"
                className={`btn btn-sm ${styles.addRowBtn}`}
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

      <Modal.Footer className={styles.footer}>
        <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
          Cerrar
        </button>
      </Modal.Footer>
    </Modal>
  )
}
