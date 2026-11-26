import { useState } from 'react'
import CategoryFormModal from '../components/admin/CategoryFormModal'
import CategoryTable from '../components/admin/CategoryTable'
import DeleteMovieModal from '../components/admin/DeleteMovieModal'
import MovieFormModal from '../components/admin/MovieFormModal'
import MovieTable from '../components/admin/MovieTable'
import TopsPanel from '../components/admin/TopsPanel'
import TopPickerModal from '../components/admin/TopPickerModal'
import { useAuth } from '../hooks/useAuth'
import { useCategories } from '../hooks/useCategories'
import { useMovies } from '../hooks/useMovies'
import { TOP_LIMIT, useTops } from '../hooks/useTops'
import type { Category } from '../types/category'
import type { Movie, MovieType } from '../types/movie'
import './AdminPage.css'

const FEATURED_LIMIT = 3

const TABS = [
  { id: 'titulos', label: 'Títulos', icon: 'bi-collection' },
  { id: 'tops', label: 'Tops', icon: 'bi-trophy' },
  { id: 'categorias', label: 'Categorías', icon: 'bi-tags' },
] as const

type TabId = (typeof TABS)[number]['id']

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabId>('titulos')

  // Persistencia real: useMovies guarda en localStorage a través de movieService
  const { movies, nextId, updateMovies } = useMovies()

  // Categorías: CRUD propio, persistido en localStorage a través de useCategories
  const { categories, createCategory, updateCategory, deleteCategory } =
    useCategories()

  // Solo el rol admin puede eliminar títulos
  const { loggedUser } = useAuth()
  const canDelete = loggedUser?.role === 'admin'

  // Top: CRUD propio, persistido en localStorage a través de useTops
  const {
    topIds,
    topSerieIds,
    topMovies,
    topSeries,
    addToTop,
    removeFromTop,
    removeById,
    moveInTop,
  } = useTops(movies)

  const [pickerType, setPickerType] = useState<MovieType | null>(null)

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
  const [categoryFormOpen, setCategoryFormOpen] = useState(false)
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null)
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)

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
      removeById(normalized.id)
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
    removeById(movieToDelete.id)
    setMovieToDelete(null)
  }

  const handleOpenCreateCategory = () => {
    setCategoryToEdit(null)
    setCategoryFormOpen(true)
  }

  const handleOpenEditCategory = (category: Category) => {
    setCategoryToEdit(category)
    setCategoryFormOpen(true)
  }

  /** Devuelve un mensaje de error si no se pudo guardar; null si salió bien. */
  const handleSaveCategory = (name: string, icon: string): string | null => {
    const trimmed = name.trim()

    if (categoryToEdit) {
      const previousName = categoryToEdit.name
      const result = updateCategory(categoryToEdit.id, trimmed, icon)
      if (!result.ok) return result.error

      // Cascada: los títulos guardan el nombre anterior, no el id.
      if (previousName !== trimmed) {
        updateMovies(
          movies.map((movie) =>
            movie.category === previousName
              ? { ...movie, category: trimmed as Movie['category'] }
              : movie,
          ),
        )
      }
    } else {
      const result = createCategory(trimmed, icon)
      if (!result.ok) return result.error
    }

    setCategoryFormOpen(false)
    setCategoryToEdit(null)
    return null
  }

  const handleConfirmDeleteCategory = () => {
    if (!categoryToDelete) return
    // Defensa extra: la tabla ya deshabilita el botón cuando tiene títulos.
    if (movies.some((movie) => movie.category === categoryToDelete.name)) {
      setCategoryToDelete(null)
      return
    }
    deleteCategory(categoryToDelete.id)
    setCategoryToDelete(null)
  }

  const handleAddToTop = (movie: Movie) => {
    addToTop(movie)
    setPickerType(null)
  }

  const handleRemoveFromTop = (movie: Movie) => {
    removeFromTop(movie)
  }

  const handleMoveInTop = (movie: Movie, direction: 'up' | 'down') => {
    moveInTop(movie, direction)
  }

  return (
    <div className="admin-page__page">
      <main className="container admin-page__main">
        <div className="admin-page__header-row">
          <div>
            <h1 className="admin-page__title">Panel — Películas y Series</h1>
            <p className="admin-page__subtitle">
              {movies.length} título{movies.length === 1 ? '' : 's'} ·{' '}
              {publishedCount} publicado{publishedCount === 1 ? '' : 's'}
            </p>
          </div>
          {activeTab === 'titulos' && (
            <button
              type="button"
              className="admin-page__add-btn"
              onClick={handleOpenCreate}
            >
              <i className="bi bi-plus-lg me-1" aria-hidden="true" />
              Agregar título
            </button>
          )}
          {activeTab === 'categorias' && (
            <button
              type="button"
              className="admin-page__add-btn"
              onClick={handleOpenCreateCategory}
            >
              <i className="bi bi-plus-lg me-1" aria-hidden="true" />
              Agregar categoría
            </button>
          )}
        </div>

        <nav className="admin-page__tabs" aria-label="Secciones del panel">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`admin-page__tab ${
                activeTab === tab.id ? 'admin-page__tab--active' : ''
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
        {activeTab === 'categorias' && (
          <CategoryTable
            categories={categories}
            movies={movies}
            onEdit={handleOpenEditCategory}
            onDelete={setCategoryToDelete}
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
          nextId={nextId}
          featuredCount={featuredCount}
          featuredLimit={FEATURED_LIMIT}
          onClose={() => setFormOpen(false)}
          onSave={handleSave}
        />
      )}

      {categoryFormOpen && (
        <CategoryFormModal
          category={categoryToEdit}
          onClose={() => {
            setCategoryFormOpen(false)
            setCategoryToEdit(null)
          }}
          onSave={handleSaveCategory}
        />
      )}

      <DeleteMovieModal
        open={movieToDelete !== null}
        title="Eliminar título"
        confirmLabel="Eliminar"
        onCancel={() => setMovieToDelete(null)}
        onConfirm={handleConfirmDelete}
      >
        ¿Seguro que querés eliminar <strong>{movieToDelete?.name}</strong>?
        Esta acción no se puede deshacer.
      </DeleteMovieModal>

      <DeleteMovieModal
        open={categoryToDelete !== null}
        title="Eliminar categoría"
        confirmLabel="Eliminar"
        onCancel={() => setCategoryToDelete(null)}
        onConfirm={handleConfirmDeleteCategory}
      >
        ¿Seguro que querés eliminar{' '}
        <strong>{categoryToDelete?.name}</strong>? Esta acción no se puede
        deshacer.
      </DeleteMovieModal>
    </div>
  )
}
