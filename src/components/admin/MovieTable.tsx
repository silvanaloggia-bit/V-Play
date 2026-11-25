import { useState } from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import { categories } from '../../config/constants'
import type { Category, Movie } from '../../types/movie'
import { formatTitleMeta } from '../../utils/movieMeta'
import './MovieTable.css'

type CategoryFilter = Category | 'todas'

// ID visual corto: "001" para los ids numéricos del seed y 6 caracteres
// para los UUID generados con crypto.randomUUID().
function formatShortId(id: string): string {
  if (/^\d+$/.test(id)) return id.padStart(3, '0')
  return id.replace(/-/g, '').slice(0, 6).toUpperCase()
}

interface MovieTableProps {
  movies: Movie[]
  onEdit: (movie: Movie) => void
  onDelete: (movie: Movie) => void
  onToggleFeatured: (movie: Movie) => void
  /** Solo el rol admin ve el botón de eliminar */
  canDelete: boolean
  /** Cuántas destacadas hay actualmente */
  featuredCount: number
  /** Máximo de destacadas permitidas */
  featuredLimit: number
}

export default function MovieTable({
  movies,
  onEdit,
  onDelete,
  onToggleFeatured,
  canDelete,
  featuredCount,
  featuredLimit,
}: MovieTableProps) {
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('todas')

  const filteredMovies =
    categoryFilter === 'todas'
      ? movies
      : movies.filter((movie) => movie.category === categoryFilter)

  const filtering = categoryFilter !== 'todas'

  const rows = filteredMovies.map((movie) => ({
    movie,
    meta: formatTitleMeta(movie),
  }))

  return (
    <section>
      <div className="movie-table__toolbar">
        {/* Buscador: por ahora solo visual. TODO: conectarlo al filtro de la tabla. */}
        <div className="movie-table__search-box">
          <i className="bi bi-search" aria-hidden="true" />
          <input
            type="search"
            className="movie-table__search-input"
            placeholder="Buscar por nombre o código"
            aria-label="Buscar por nombre o código"
          />
        </div>
        <span className="movie-table__counter">
          {filtering
            ? `${filteredMovies.length} de ${movies.length} en "${categoryFilter}"`
            : `${movies.length} título${movies.length === 1 ? '' : 's'}`}
        </span>
      </div>

      <div className="table-responsive movie-table__table-wrapper">
        <table className="table table-hover align-middle mb-0 movie-table__table">
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col">Nombre</th>
              {/* El texto "Categoría" del encabezado es el dropdown que filtra la tabla */}
              <th scope="col">
                <Dropdown
                  onSelect={(key) =>
                    setCategoryFilter((key ?? 'todas') as CategoryFilter)
                  }
                >
                  <Dropdown.Toggle
                    className={`movie-table__header-dropdown ${
                      filtering ? 'movie-table__header-dropdown--active' : ''
                    }`}
                    id="categoryFilter"
                  >
                    {filtering ? categoryFilter : 'Categoría'}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="movie-table__dropdown-menu">
                    <Dropdown.Item
                      eventKey="todas"
                      active={categoryFilter === 'todas'}
                    >
                      Todas
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    {categories.map((category) => (
                      <Dropdown.Item
                        key={category}
                        eventKey={category}
                        active={categoryFilter === category}
                      >
                        {category}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </th>
              <th scope="col">Estado</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredMovies.length === 0 && (
              <tr>
                <td colSpan={5} className="movie-table__empty">
                  {movies.length === 0
                    ? 'No hay títulos cargados todavía.'
                    : 'No hay títulos en esta categoría.'}
                </td>
              </tr>
            )}

            {rows.map(({ movie, meta }) => (
              <tr key={movie.id}>
                <td>
                  <img
                    src={movie.imageUrl}
                    alt={movie.name}
                    className="movie-table__thumb"
                  />
                </td>
                <td>
                  <div className="movie-table__title-cell">
                    <span className="movie-table__name">{movie.name}</span>
                    <span className="movie-table__meta-row">
                      <span
                        className={`badge movie-table__type-badge ${
                          movie.type === 'serie'
                            ? 'movie-table__type-serie'
                            : 'movie-table__type-pelicula'
                        }`}
                      >
                        {movie.type === 'serie' ? 'Serie' : 'Película'}
                      </span>
                      <span className="movie-table__movie-id">
                        ID: {formatShortId(movie.id)}
                      </span>
                    </span>
                    {meta && (
                      <span className="movie-table__details-row">{meta}</span>
                    )}
                    {movie.isFeatured && (
                      <span className="badge movie-table__featured-badge">
                        ⭐ Destacada
                      </span>
                    )}
                  </div>
                </td>
                <td className="movie-table__category-text">{movie.category}</td>
                <td>
                  <div className="movie-table__badges">
                    {movie.published ? (
                      <span className="badge movie-table__badge-published">
                        <span className="movie-table__dot" aria-hidden="true" />
                        Publicada
                      </span>
                    ) : (
                      <span className="badge movie-table__badge-in--active">
                        <span className="movie-table__dot" aria-hidden="true" />
                        Borrador
                      </span>
                    )}
                  </div>
                </td>
                <td>
                  <div className="movie-table__actions">
                    <button
                      type="button"
                      className={`btn btn-sm movie-table__icon-btn ${
                        movie.isFeatured ? 'movie-table__star--active' : ''
                      }`}
                      aria-label={
                        movie.isFeatured
                          ? `Quitar destacada de ${movie.name}`
                          : `Destacar ${movie.name}`
                      }
                      aria-pressed={movie.isFeatured}
                      title={
                        movie.isFeatured
                          ? 'Quitar destacada'
                          : !movie.published
                            ? 'Solo las publicadas pueden destacarse'
                            : featuredCount >= featuredLimit
                              ? `Ya hay ${featuredLimit} destacadas; quitá una para elegir otra`
                              : 'Destacar'
                      }
                      disabled={
                        !movie.isFeatured &&
                        (!movie.published || featuredCount >= featuredLimit)
                      }
                      onClick={() => onToggleFeatured(movie)}
                    >
                      <i
                        className={`bi ${
                          movie.isFeatured ? 'bi-star-fill' : 'bi-star'
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm movie-table__icon-btn"
                      aria-label={`Editar ${movie.name}`}
                      title="Editar"
                      onClick={() => onEdit(movie)}
                    >
                      <i className="bi bi-pencil" aria-hidden="true" />
                    </button>
                    {canDelete && (
                      <button
                        type="button"
                        className="btn btn-sm movie-table__icon-btn movie-table__delete-btn"
                        aria-label={`Eliminar ${movie.name}`}
                        title="Eliminar"
                        onClick={() => onDelete(movie)}
                      >
                        <i className="bi bi-trash" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
