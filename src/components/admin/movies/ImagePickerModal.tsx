import { useEffect, useState, type FormEvent } from 'react'
import Modal from 'react-bootstrap/Modal'
import { useDebouncedText } from '../../../hooks/useDebouncedText'
import {
  getTmdbDetails,
  getTmdbErrorMessage,
  hasTmdbKey,
  searchTmdb,
  TMDB_IMAGE_BASE,
  type TmdbPicked,
  type TmdbResult,
} from '../../../services/tmdbService'
import './ImagePickerModal.css'

interface ImagePickerModalProps {
  defaultQuery?: string
  onClose: () => void
  onSelect: (picked: TmdbPicked) => void
}

export default function ImagePickerModal({
  defaultQuery = '',
  onClose,
  onSelect,
}: ImagePickerModalProps) {
  const [query, setQuery] = useState(defaultQuery)
  const [results, setResults] = useState<TmdbResult[]>([])
  const [loading, setLoading] = useState(Boolean(hasTmdbKey() && defaultQuery.trim()))
  const [error, setError] = useState('')
  const [searchTick, setSearchTick] = useState(0)
  const debouncedQuery = useDebouncedText(query, 400)

  useEffect(() => {
    const term = debouncedQuery.trim()
    if (!hasTmdbKey() || !term) return

    let active = true

    searchTmdb(term)
      .then((found) => {
        if (!active) return
        setResults(found)
      })
      .catch((error: unknown) => {
        if (!active) return
        setError(getTmdbErrorMessage(error))
        setResults([])
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [debouncedQuery, searchTick])

  const runSearch = (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setSearchTick((tick) => tick + 1)
  }

  const handlePick = async (result: TmdbResult) => {
    setLoading(true)
    setError('')

    try {
      onSelect(await getTmdbDetails(result))
    } catch (error) {
      setError(getTmdbErrorMessage(error))
      setLoading(false)
    }
  }

  return (
    <Modal
      show
      onHide={onClose}
      centered
      size="lg"
      fullscreen="sm-down"
      scrollable
      contentClassName="image-picker__content"
    >
      <Modal.Header closeButton closeVariant="white" className="image-picker__header">
        <Modal.Title className="image-picker__title">
          Autocompletar con TMDb
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {!hasTmdbKey() ? (
          <p className="image-picker__message">
            Falta configurar <code>VITE_TMDB_API_KEY</code> en el archivo{' '}
            <code>.env</code>.
          </p>
        ) : (
          <>
            <form className="image-picker__search-form" onSubmit={runSearch}>
              <div className="image-picker__search-box">
                <i className="bi bi-search" aria-hidden="true" />
                <input
                  type="search"
                  className="image-picker__search-input"
                  placeholder="Escribí un nombre para buscar…"
                  aria-label="Buscar película o serie en TMDb"
                  value={query}
                  onChange={(event) => {
                    const next = event.target.value
                    setQuery(next)
                    setResults([])
                    setError('')
                    setLoading(Boolean(next.trim()))
                  }}
                />
              </div>
              <button type="submit" className="image-picker__search-btn" disabled={loading}>
                {loading ? 'Buscando…' : 'Buscar ahora'}
              </button>
            </form>

            {error && <p className="image-picker__error">{error}</p>}

            {!loading && !error && results.length === 0 && (
              <p className="image-picker__message">
                La búsqueda se hace sola mientras escribís. Al elegir un
                resultado se completan los campos vacíos del formulario.
              </p>
            )}

            <ul className="image-picker__grid">
              {results.map((result) => (
                <li key={`${result.media_type}-${result.id}`}>
                  <button
                    type="button"
                    className="image-picker__result-btn"
                    onClick={() => void handlePick(result)}
                    disabled={loading}
                    title={result.title ?? result.name ?? 'Seleccionar'}
                  >
                    <img
                      src={`${TMDB_IMAGE_BASE}/w342${result.poster_path}`}
                      alt={result.title ?? result.name ?? 'Poster'}
                      className="image-picker__poster"
                      loading="lazy"
                    />
                    <span className="image-picker__result-title">
                      {result.title ?? result.name}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </Modal.Body>

      <Modal.Footer className="image-picker__footer">
        <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
          Cancelar
        </button>
      </Modal.Footer>
    </Modal>
  )
}
