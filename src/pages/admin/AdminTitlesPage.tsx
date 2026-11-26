import { useState } from 'react'
import DeleteMovieModal from '../../components/admin/DeleteMovieModal'
import MovieFormModal from '../../components/admin/movies/MovieFormModal'
import MovieTable from '../../components/admin/movies/MovieTable'
import { useAuth } from '../../hooks/useAuth'
import { useMovies } from '../../hooks/useMovies'
import { useTops } from '../../hooks/useTops'
import type { Movie } from '../../types/movie'

const FEATURED_LIMIT = 3

export default function AdminTitlesPage() {
  const { movies, nextId, updateMovies } = useMovies()
  const { loggedUser } = useAuth()
  const { removeById } = useTops(movies)
  const canDelete = loggedUser?.role === 'admin'

  const [formOpen, setFormOpen] = useState(false)
  const [movieToEdit, setMovieToEdit] = useState<Movie | null>(null)
  const [movieToDelete, setMovieToDelete] = useState<Movie | null>(null)

  const publishedCount = movies.filter((movie) => movie.published).length
  const featuredCount = movies.filter((movie) => movie.isFeatured).length

  function handleOpenCreate() {
    setMovieToEdit(null)
    setFormOpen(true)
  }

  function handleOpenEdit(movie: Movie) {
    setMovieToEdit(movie)
    setFormOpen(true)
  }

  function handleSave(movie: Movie) {
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

    const previousType = previousMovie
      ? previousMovie.type ?? 'pelicula'
      : null
    if (previousType !== null && previousType !== normalized.type) {
      removeById(normalized.id)
    }

    setFormOpen(false)
    setMovieToEdit(null)
  }

  function handleToggleFeatured(movie: Movie) {
    if (!movie.published && !movie.isFeatured) return
    if (!movie.isFeatured && featuredCount >= FEATURED_LIMIT) return

    updateMovies(
      movies.map((item) =>
        item.id === movie.id ? { ...item, isFeatured: !movie.isFeatured } : item,
      ),
    )
  }

  function handleConfirmDelete() {
    if (!movieToDelete) return
    updateMovies(movies.filter((item) => item.id !== movieToDelete.id))
    removeById(movieToDelete.id)
    setMovieToDelete(null)
  }

  return (
    <>
      <div className="admin-page__header-row">
        <div>
          <p className="admin-page__subtitle">
            {movies.length} título{movies.length === 1 ? '' : 's'} ·{' '}
            {publishedCount} publicado{publishedCount === 1 ? '' : 's'}
          </p>
        </div>
        <button
          type="button"
          className="admin-page__add-btn"
          onClick={handleOpenCreate}
        >
          <i className="bi bi-plus-lg me-1" aria-hidden="true" />
          Agregar título
        </button>
      </div>

      <MovieTable
        movies={movies}
        onEdit={handleOpenEdit}
        onDelete={setMovieToDelete}
        onToggleFeatured={handleToggleFeatured}
        canDelete={canDelete}
        featuredCount={featuredCount}
        featuredLimit={FEATURED_LIMIT}
      />

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

      <DeleteMovieModal
        open={movieToDelete !== null}
        title="Eliminar título"
        confirmLabel="Eliminar"
        onCancel={() => setMovieToDelete(null)}
        onConfirm={handleConfirmDelete}
      >
        ¿Seguro que querés eliminar <strong>{movieToDelete?.name}</strong>? Esta
        acción no se puede deshacer.
      </DeleteMovieModal>
    </>
  )
}
