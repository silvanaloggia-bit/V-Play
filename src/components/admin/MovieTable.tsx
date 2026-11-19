import { useState } from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import { categories } from '../../config/constants'
import type { Category, Movie } from '../../types/movie'
import styles from './MovieTable.module.css'

type CategoryFilter = Category | 'todas'

interface MovieTableProps {
  movies: Movie[]
}

export default function MovieTable({ movies }: MovieTableProps) {
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('todas')

  const filteredMovies =
    categoryFilter === 'todas'
      ? movies
      : movies.filter((movie) => movie.category === categoryFilter)

  const filtering = categoryFilter !== 'todas'

  return (
    <section>
      <div className={styles.toolbar}>
        <span className={styles.counter}>
          {filtering
            ? `${filteredMovies.length} de ${movies.length} en "${categoryFilter}"`
            : `${movies.length} título${movies.length === 1 ? '' : 's'} en el catálogo`}
        </span>
        <div className="d-flex gap-2">
          <button type="button" className={styles.addBtn}>
            <i className="bi bi-plus-lg me-1" aria-hidden="true" />
            Agregar título
          </button>
        </div>
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
                <td className={styles.name}>{movie.name}</td>
                <td className={styles.categoryText}>{movie.category}</td>
                <td>
                  <div className={styles.badges}>
                    {movie.published ? (
                      <span className={`badge ${styles.badgePublished}`}>
                        Publicado
                      </span>
                    ) : (
                      <span className={`badge ${styles.badgeInactive}`}>
                        Inactivo
                      </span>
                    )}
                    {movie.isFeatured && (
                      <span className={`badge ${styles.badgeFeatured}`}>
                        ⭐ Destacada
                      </span>
                    )}
                  </div>
                </td>
                <td>
                  <div className={styles.actions}>
                    <button
                      type="button"
                      className={`btn btn-sm ${styles.editBtn}`}
                    >
                      Editar
                    </button>
                    <button type="button" className="btn btn-outline-danger btn-sm">
                      Eliminar
                    </button>
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
