import { useState } from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import { categories } from '../../config/constants'
import type { Category, Movie } from '../../types/movie'
import styles from './MovieTable.module.css'

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

  return (
    <section>
      <div className={styles.toolbar}>
        {/* Buscador: por ahora solo visual. TODO: conectarlo al filtro de la tabla. */}
        <div className={styles.searchBox}>
          <i className="bi bi-search" aria-hidden="true" />
          <input
            type="search"
            className={styles.searchInput}
            placeholder="Buscar por nombre o código"
            aria-label="Buscar por nombre o código"
          />
        </div>
        <span className={styles.counter}>
          {filtering
            ? `${filteredMovies.length} de ${movies.length} en "${categoryFilter}"`
            : `${movies.length} título${movies.length === 1 ? '' : 's'}`}
        </span>
      </div>

      <div className={`table-responsive ${styles.tableWrapper}`}>
        <table className={`table table-hover align-middle mb-0 ${styles.table}`}>
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
                    className={`${styles.headerDropdown} ${
                      filtering ? styles.headerDropdownActive : ''
                    }`}
                    id="categoryFilter"
                  >
                    {filtering ? categoryFilter : 'Categoría'}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className={styles.dropdownMenu}>
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
                <td colSpan={5} className={styles.empty}>
                  {movies.length === 0
                    ? 'No hay títulos cargados todavía.'
                    : 'No hay títulos en esta categoría.'}
                </td>
              </tr>
            )}

            {filteredMovies.map((movie) => (
              <tr key={movie.id}>
                <td>
                  <img
                    src={movie.imageUrl}
                    alt={movie.name}
                    className={styles.thumb}
                  />
                </td>
                <td>
                  <div className={styles.titleCell}>
                    <span className={styles.name}>{movie.name}</span>
                    <span className={styles.metaRow}>
                      <span
                        className={`badge ${styles.typeBadge} ${
                          movie.type === 'serie'
                            ? styles.typeSerie
                            : styles.typePelicula
                        }`}
                      >
                        {movie.type === 'serie' ? 'Serie' : 'Película'}
                      </span>
                      <span className={styles.movieId}>
                        ID: {formatShortId(movie.id)}
                      </span>
                    </span>
                    {movie.isFeatured && (
                      <span className={`badge ${styles.featuredBadge}`}>
                        ⭐ Destacada
                      </span>
                    )}
                  </div>
                </td>
                <td className={styles.categoryText}>{movie.category}</td>
                <td>
                  <div className={styles.badges}>
                    {movie.published ? (
                      <span className={`badge ${styles.badgePublished}`}>
                        <span className={styles.dot} aria-hidden="true" />
                        Publicada
                      </span>
                    ) : (
                      <span className={`badge ${styles.badgeInactive}`}>
                        <span className={styles.dot} aria-hidden="true" />
                        Borrador
                      </span>
                    )}
                  </div>
                </td>
                <td>
                  <div className={styles.actions}>
                    <button
                      type="button"
                      className={`btn btn-sm ${styles.iconBtn} ${
                        movie.isFeatured ? styles.starActive : ''
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
                      className={`btn btn-sm ${styles.iconBtn}`}
                      aria-label={`Editar ${movie.name}`}
                      title="Editar"
                      onClick={() => onEdit(movie)}
                    >
                      <i className="bi bi-pencil" aria-hidden="true" />
                    </button>
                    {canDelete && (
                      <button
                        type="button"
                        className={`btn btn-sm ${styles.iconBtn} ${styles.deleteBtn}`}
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
