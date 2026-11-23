import { useEffect, useState, type FormEvent } from 'react'
import Modal from 'react-bootstrap/Modal'
import styles from './ImagePickerModal.module.css'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string | undefined
const TMDB_SEARCH_URL = 'https://api.themoviedb.org/3/search/multi'
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p'

interface TmdbResult {
  id: number
  media_type: 'movie' | 'tv' | 'person'
  title?: string
  name?: string
  poster_path: string | null
  backdrop_path: string | null
}

export interface PickedImages {
  posterUrl: string
  bannerUrl?: string
}

interface ImagePickerModalProps {
  /** Texto inicial para buscar (normalmente el nombre del título) */
  defaultQuery?: string
  onClose: () => void
  onSelect: (images: PickedImages) => void
}

async function searchTmdb(term: string): Promise<TmdbResult[]> {
  const response = await fetch(
    `${TMDB_SEARCH_URL}?api_key=${API_KEY}&language=es-ES&include_adult=false&query=${encodeURIComponent(term)}`,
  )

  if (!response.ok) {
    throw new Error(`TMDb respondió ${response.status}`)
  }

  const data = (await response.json()) as { results?: TmdbResult[] }

  return (data.results ?? []).filter(
    (result) => result.media_type !== 'person' && Boolean(result.poster_path),
  )
}

export default function ImagePickerModal({
  defaultQuery = '',
  onClose,
  onSelect,
}: ImagePickerModalProps) {
  const [query, setQuery] = useState(defaultQuery)
  const [results, setResults] = useState<TmdbResult[]>([])
  const [loading, setLoading] = useState(Boolean(API_KEY && defaultQuery.trim()))
  const [error, setError] = useState('')

  useEffect(() => {
    if (!API_KEY || !defaultQuery.trim()) return

    let active = true

    searchTmdb(defaultQuery)
      .then((found) => {
        if (!active) return
        setResults(found)
        setLoading(false)
      })
      .catch(() => {
        if (!active) return
        setError('No se pudo buscar en TMDb. Revisá la API key o la conexión.')
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [defaultQuery])

  const runSearch = async (event: FormEvent) => {
    event.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setError('')

    try {
      setResults(await searchTmdb(query.trim()))
    } catch {
      setError('No se pudo buscar en TMDb. Revisá la API key o la conexión.')
    } finally {
      setLoading(false)
    }
  }

  const handlePick = (result: TmdbResult) => {
    if (!result.poster_path) return

    onSelect({
      posterUrl: `${TMDB_IMAGE_BASE}/w500${result.poster_path}`,
      bannerUrl: result.backdrop_path
        ? `${TMDB_IMAGE_BASE}/w780${result.backdrop_path}`
        : undefined,
    })
  }

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
        <Modal.Title className={styles.title}>Buscar imagen en TMDb</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {!API_KEY ? (
          <p className={styles.message}>
            Falta configurar <code>VITE_TMDB_API_KEY</code> en el archivo{' '}
            <code>.env</code>.
          </p>
        ) : (
          <>
            <form className={styles.searchForm} onSubmit={runSearch}>
              <div className={styles.searchBox}>
                <i className="bi bi-search" aria-hidden="true" />
                <input
                  type="search"
                  className={styles.searchInput}
                  placeholder="Buscar película o serie…"
                  aria-label="Buscar película o serie en TMDb"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
              <button type="submit" className={styles.searchBtn} disabled={loading}>
                {loading ? 'Buscando…' : 'Buscar'}
              </button>
            </form>

            {error && <p className={styles.error}>{error}</p>}

            {!loading && !error && results.length === 0 && (
              <p className={styles.message}>
                Escribí un título y presioná Buscar.
              </p>
            )}

            <ul className={styles.grid}>
              {results.map((result) => (
                <li key={`${result.media_type}-${result.id}`}>
                  <button
                    type="button"
                    className={styles.resultBtn}
                    onClick={() => handlePick(result)}
                    title={result.title ?? result.name ?? 'Seleccionar'}
                  >
                    <img
                      src={`${TMDB_IMAGE_BASE}/w342${result.poster_path}`}
                      alt={result.title ?? result.name ?? 'Poster'}
                      className={styles.poster}
                      loading="lazy"
                    />
                    <span className={styles.resultTitle}>
                      {result.title ?? result.name}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </Modal.Body>

      <Modal.Footer className={styles.footer}>
        <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
          Cancelar
        </button>
      </Modal.Footer>
    </Modal>
  )
}
