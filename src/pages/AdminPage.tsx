import { useState } from 'react'
import ConfirmModal from '../components/admin/ConfirmModal'
import MovieFormModal from '../components/admin/MovieFormModal'
import MovieTable from '../components/admin/MovieTable'
import TopsPanel from '../components/admin/TopsPanel'
import TopPickerModal from '../components/admin/TopPickerModal'
import { useAuth } from '../hooks/useAuth'
import { useMovies } from '../hooks/useMovies'
import type { Movie, MovieType } from '../types/movie'
import styles from './AdminPage.module.css'

const TOP_LIMIT = 5
const FEATURED_LIMIT = 3

const TABS = [
  { id: 'titulos', label: 'Títulos', icon: 'bi-collection' },
  { id: 'tops', label: 'Tops', icon: 'bi-trophy' },
] as const

type TabId = (typeof TABS)[number]['id']

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabId>('titulos')

  // Persistencia real: useMovies guarda en localStorage a través de movieService
  const { movies, updateMovies } = useMovies()

  // Solo el rol admin puede eliminar títulos
  const { loggedUser } = useAuth()
  const canDelete = loggedUser?.role === 'admin'

  // Top (orden por ids; la persistencia real viene con la lógica)
  const [topIds, setTopIds] = useState<string[]>(() =>
    movies
      .filter((movie) => (movie.type ?? 'pelicula') === 'pelicula')
      .slice(0, TOP_LIMIT)
      .map((movie) => movie.id),
  )
  const [topSerieIds, setTopSerieIds] = useState<string[]>(() =>
    movies
      .filter((movie) => movie.type === 'serie')
      .slice(0, TOP_LIMIT)
      .map((movie) => movie.id),
  )
  const [pickerType, setPickerType] = useState<MovieType | null>(null)

  const topMovies = topIds
    .map((id) => movies.find((movie) => movie.id === id))
    .filter((movie): movie is Movie => Boolean(movie))

  const topSeries = topSerieIds
    .map((id) => movies.find((movie) => movie.id === id))
    .filter((movie): movie is Movie => Boolean(movie))

  const pickerMovies = pickerType
    ? movies.filter((movie) => {
        const type = movie.type ?? 'pelicula'
        if (type !== pickerType) return false
        const currentTop = pickerType === 'pelicula' ? topIds : topSerieIds
        return !currentTop.includes(movie.id)
      })
    : []

  const pickerCount =
    pickerType === 'pelicula' ? topMovies.length : topSeries.length

  // Modales
  const [formOpen, setFormOpen] = useState(false)
  const [movieToEdit, setMovieToEdit] = useState<Movie | null>(null)
  const [movieToDelete, setMovieToDelete] = useState<Movie | null>(null)

  const publishedCount = movies.filter((movie) => movie.published).length
  const featuredCount = movies.filter((movie) => movie.isFeatured).length

  const handleOpenCreate = () => {
    setMovieToEdit(null)
    setFormOpen(true)
  }

  const handleOpenEdit = (movie: Movie) => {
    setMovieToEdit(movie)
    setFormOpen(true)
  }

  const handleSave = (movie: Movie) => {
    // Reglas de negocio: un borrador no puede ser destacado y hay como
    // máximo FEATURED_LIMIT títulos destacados.
    const previousMovie = movies.find((item) => item.id === movie.id)
    const wasFeatured = previousMovie?.isFeatured ?? false
    const otherFeatured = movies.filter(
      (item) => item.isFeatured && item.id !== movie.id,
    ).length

    const keepFeatured =
      movie.published &&
      movie.isFeatured &&
      (wasFeatured || otherFeatured < FEATURED_LIMIT)

    const normalized: Movie = {
      ...movie,
      type: movie.type ?? 'pelicula',
      isFeatured: keepFeatured,
    }

    const exists = Boolean(previousMovie)
    const finalList = exists
      ? movies.map((item) => (item.id === normalized.id ? normalized : item))
      : [...movies, normalized]

    updateMovies(finalList)

    // Si cambió de tipo, deja de pertenecer al top donde estaba
    const previousType = previousMovie
      ? (previousMovie.type ?? 'pelicula')
      : null
    if (previousType !== null && previousType !== normalized.type) {
      setTopIds((previous) => previous.filter((id) => id !== normalized.id))
      setTopSerieIds((previous) =>
        previous.filter((id) => id !== normalized.id),
      )
    }

    setFormOpen(false)
    setMovieToEdit(null)
  }

  const handleToggleFeatured = (movie: Movie) => {
    // Los borradores no pueden destacarse
    if (!movie.published && !movie.isFeatured) return
    // No se pueden superar las 3 destacadas
    if (!movie.isFeatured && featuredCount >= FEATURED_LIMIT) return

    updateMovies(
      movies.map((item) =>
        item.id === movie.id
          ? { ...item, isFeatured: !movie.isFeatured }
          : item,
      ),
    )
  }

  const handleConfirmDelete = () => {
    if (!movieToDelete) return

    updateMovies(movies.filter((item) => item.id !== movieToDelete.id))
    // Si estaba en algún top, también sale de ahí
    setTopIds((previous) => previous.filter((id) => id !== movieToDelete.id))
    setTopSerieIds((previous) =>
      previous.filter((id) => id !== movieToDelete.id),
    )
    setMovieToDelete(null)
  }

  const handleAddToTop = (movie: Movie) => {
    const add = (previous: string[]) =>
      previous.length >= TOP_LIMIT || previous.includes(movie.id)
        ? previous
        : [...previous, movie.id]

    if ((movie.type ?? 'pelicula') === 'serie') {
      setTopSerieIds(add)
    } else {
      setTopIds(add)
    }
    setPickerType(null)
  }

  const handleRemoveFromTop = (movie: Movie) => {
    if ((movie.type ?? 'pelicula') === 'serie') {
      setTopSerieIds((previous) => previous.filter((id) => id !== movie.id))
    } else {
      setTopIds((previous) => previous.filter((id) => id !== movie.id))
    }
  }

  const handleMoveInTop = (movie: Movie, direction: 'up' | 'down') => {
    const move = (previous: string[]) => {
      const index = previous.indexOf(movie.id)
      if (index === -1) return previous

      const target = direction === 'up' ? index - 1 : index + 1
      if (target < 0 || target >= previous.length) return previous

      const next = [...previous]
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    }

    if ((movie.type ?? 'pelicula') === 'serie') {
      setTopSerieIds(move)
    } else {
      setTopIds(move)
    }
  }

  return (
    <div className={styles.page}>
      <main className={`container ${styles.main}`}>
        <div className={styles.headerRow}>
          <div>
            <h1 className={styles.title}>Panel — Películas y Series</h1>
            <p className={styles.subtitle}>
              {movies.length} título{movies.length === 1 ? '' : 's'} ·{' '}
              {publishedCount} publicado{publishedCount === 1 ? '' : 's'}
            </p>
          </div>
          {activeTab === 'titulos' && (
            <button
              type="button"
              className={styles.addBtn}
              onClick={handleOpenCreate}
            >
              <i className="bi bi-plus-lg me-1" aria-hidden="true" />
              Agregar título
            </button>
          )}
        </div>

        <nav className={styles.tabs} aria-label="Secciones del panel">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`${styles.tab} ${
                activeTab === tab.id ? styles.tabActive : ''
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <i className={`bi ${tab.icon} me-1`} aria-hidden="true" />
              {tab.label}
            </button>
          ))}
        </nav>

        {activeTab === 'titulos' && (
          <MovieTable
            movies={movies}
            onEdit={handleOpenEdit}
            onDelete={setMovieToDelete}
            onToggleFeatured={handleToggleFeatured}
            canDelete={canDelete}
            featuredCount={featuredCount}
            featuredLimit={FEATURED_LIMIT}
          />
        )}
        {activeTab === 'tops' && (
          <TopsPanel
            movies={topMovies}
            series={topSeries}
            onAdd={(type) => setPickerType(type)}
            onRemove={handleRemoveFromTop}
            onMove={handleMoveInTop}
          />
        )}
      </main>

      {pickerType && (
        <TopPickerModal
          movies={pickerMovies}
          type={pickerType}
          currentCount={pickerCount}
          limit={TOP_LIMIT}
          onClose={() => setPickerType(null)}
          onAdd={handleAddToTop}
        />
      )}

      {formOpen && (
        <MovieFormModal
          movie={movieToEdit}
          featuredCount={featuredCount}
          featuredLimit={FEATURED_LIMIT}
          onClose={() => setFormOpen(false)}
          onSave={handleSave}
        />
      )}

      <ConfirmModal
        open={movieToDelete !== null}
        title="Eliminar título"
        confirmLabel="Eliminar"
        onCancel={() => setMovieToDelete(null)}
        onConfirm={handleConfirmDelete}
      >
        ¿Seguro que querés eliminar <strong>{movieToDelete?.name}</strong>?
        Esta acción no se puede deshacer.
      </ConfirmModal>
    </div>
  )
}
