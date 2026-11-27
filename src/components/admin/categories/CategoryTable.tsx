import type { Category } from '../../../types/category'
import type { Movie } from '../../../types/movie'
import './CategoryTable.css'

interface CategoryTableProps {
  categories: Category[]
  movies: Movie[]
  onEdit: (category: Category) => void
  onDelete: (category: Category) => void
  onMove: (category: Category, direction: 'up' | 'down') => void
}

export default function CategoryTable({
  categories,
  movies,
  onEdit,
  onDelete,
  onMove,
}: CategoryTableProps) {
  const usage = movies.reduce<Record<string, number>>((counts, movie) => {
    counts[movie.category] = (counts[movie.category] ?? 0) + 1
    return counts
  }, {})

  return (
    <section className="category-table">
      <div className="table-responsive category-table__wrapper">
        <table className={`table table-hover align-middle mb-0 category-table__table`}>
          <thead>
            <tr>
              <th scope="col">Categoría</th>
              <th scope="col">ID</th>
              <th scope="col">Títulos</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 && (
              <tr>
                <td colSpan={4} className="category-table__empty">
                  No hay categorías cargadas todavía.
                </td>
              </tr>
            )}

            {categories.map((category, index) => {
              const count = usage[category.name] ?? 0
              const deleteLabel = `Eliminar ${category.name}`

              return (
                <tr key={category.id}>
                  <td>
                    <span className="category-table__name">
                      <span>{category.name}</span>
                    </span>
                  </td>
                  <td className="category-table__id">{category.id}</td>
                  <td>
                    <span className="category-table__usage">
                      {count === 0 ? 'Sin títulos' : `${count} título${count === 1 ? '' : 's'}`}
                    </span>
                  </td>
                  <td>
                    <div className="category-table__actions">
                      <button
                        type="button"
                        className="btn btn-sm category-table__action"
                        aria-label={`Subir ${category.name}`}
                        title="Subir en el orden del Inicio"
                        disabled={index === 0}
                        onClick={() => onMove(category, 'up')}
                      >
                        <i className="bi bi-arrow-up" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm category-table__action"
                        aria-label={`Bajar ${category.name}`}
                        title="Bajar en el orden del Inicio"
                        disabled={index === categories.length - 1}
                        onClick={() => onMove(category, 'down')}
                      >
                        <i className="bi bi-arrow-down" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm category-table__action"
                        aria-label={`Editar ${category.name}`}
                        title="Editar"
                        onClick={() => onEdit(category)}
                      >
                        <i className="bi bi-pencil" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm category-table__action category-table__action--delete"
                        aria-label={deleteLabel}
                        title={
                          count > 0
                            ? `No se puede eliminar: tiene ${count} título${count === 1 ? '' : 's'}`
                            : 'Eliminar'
                        }
                        disabled={count > 0}
                        onClick={() => onDelete(category)}
                      >
                        <i className="bi bi-trash" aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <p className="category-table__note">
        No podés eliminar una categoría que tenga títulos asignados. Renombrarla
        actualiza todos sus títulos automáticamente.
      </p>
    </section>
  )
}
