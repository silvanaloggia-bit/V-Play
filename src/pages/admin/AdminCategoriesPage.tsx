import { useState } from 'react'
import CategoryFormModal from '../../components/admin/CategoryFormModal'
import CategoryTable from '../../components/admin/CategoryTable'
import DeleteMovieModal from '../../components/admin/DeleteMovieModal'
import { useCategories } from '../../hooks/useCategories'
import { useMovies } from '../../hooks/useMovies'
import type { Category } from '../../types/category'
import type { Movie } from '../../types/movie'

export default function AdminCategoriesPage() {
  const { categories, createCategory, updateCategory, deleteCategory, moveCategory } =
    useCategories()
  const { movies, updateMovies } = useMovies()

  const [categoryFormOpen, setCategoryFormOpen] = useState(false)
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null)
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)

  function handleOpenCreate() {
    setCategoryToEdit(null)
    setCategoryFormOpen(true)
  }

  function handleOpenEdit(category: Category) {
    setCategoryToEdit(category)
    setCategoryFormOpen(true)
  }

  function handleSave(name: string): string | null {
    const trimmed = name.trim()

    if (categoryToEdit) {
      const previousName = categoryToEdit.name
      const result = updateCategory(categoryToEdit.id, trimmed)
      if (!result.ok) return result.error

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
      const result = createCategory(trimmed)
      if (!result.ok) return result.error
    }

    setCategoryFormOpen(false)
    setCategoryToEdit(null)
    return null
  }

  function handleConfirmDelete() {
    if (!categoryToDelete) return
    if (movies.some((movie) => movie.category === categoryToDelete.name)) {
      setCategoryToDelete(null)
      return
    }
    deleteCategory(categoryToDelete.id)
    setCategoryToDelete(null)
  }

  function handleMove(category: Category, direction: 'up' | 'down') {
    moveCategory(category.id, direction)
  }

  return (
    <>
      <div className="admin-page__header-row">
        <div />
        <button
          type="button"
          className="admin-page__add-btn"
          onClick={handleOpenCreate}
        >
          <i className="bi bi-plus-lg me-1" aria-hidden="true" />
          Agregar categoría
        </button>
      </div>

      <CategoryTable
        categories={categories}
        movies={movies}
        onEdit={handleOpenEdit}
        onDelete={setCategoryToDelete}
        onMove={handleMove}
      />

      {categoryFormOpen && (
        <CategoryFormModal
          category={categoryToEdit}
          onClose={() => {
            setCategoryFormOpen(false)
            setCategoryToEdit(null)
          }}
          onSave={handleSave}
        />
      )}

      <DeleteMovieModal
        open={categoryToDelete !== null}
        title="Eliminar categoría"
        confirmLabel="Eliminar"
        onCancel={() => setCategoryToDelete(null)}
        onConfirm={handleConfirmDelete}
      >
        ¿Seguro que querés eliminar{' '}
        <strong>{categoryToDelete?.name}</strong>? Esta acción no se puede
        deshacer.
      </DeleteMovieModal>
    </>
  )
}
