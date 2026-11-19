import type { Movie } from '../../types/movie'
import styles from './TopsPanel.module.css'

interface TopsPanelProps {
  movies: Movie[]
}

// Por ahora "top" = primeros títulos del catálogo.
// TODO: ranking real por tipo (película / serie) cuando el modelo lo tenga.
const TOP_SIZE = 4

export default function TopsPanel({ movies }: TopsPanelProps) {
  const topPeliculas = movies.slice(0, TOP_SIZE)

  return (
    <section>
      {/* Top películas */}
      <div className={styles.header}>
        <h2 className={styles.heading}>
          <i className="bi bi-trophy me-2" aria-hidden="true" />
          Top películas
        </h2>
        <button type="button" className={styles.addBtn}>
          <i className="bi bi-plus-lg me-1" aria-hidden="true" />
          Agregar al top
        </button>
      </div>

      <div className={styles.listWrapper}>
        <table className={`table table-hover align-middle mb-0 ${styles.table}`}>
          <thead>
            <tr>
              <th scope="col" className={styles.rankCol}>
                #
              </th>
              <th scope="col"></th>
              <th scope="col">Nombre</th>
              <th scope="col">Categoría</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {topPeliculas.map((movie, index) => (
              <tr key={movie.id}>
                <td className={styles.rank}>{index + 1}</td>
                <td>
                  <img
                    src={movie.imageUrl}
                    alt={movie.name}
                    className={styles.thumb}
                  />
                </td>
                <td className={styles.name}>{movie.name}</td>
                <td className={styles.category}>{movie.category}</td>
                <td>
                  <button type="button" className="btn btn-outline-danger btn-sm">
                    Quitar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Top series */}
      <div className={`${styles.header} ${styles.headerSpaced}`}>
        <h2 className={styles.heading}>
          <i className="bi bi-trophy me-2" aria-hidden="true" />
          Top series
        </h2>
        <button type="button" className={styles.addBtn}>
          <i className="bi bi-plus-lg me-1" aria-hidden="true" />
          Agregar al top
        </button>
      </div>

      <div className={styles.emptyBox}>
        Todavía no hay series en el top.
        <span className={styles.emptyHint}>
          Pendiente: diferenciar películas y series en el modelo de datos.
        </span>
      </div>
    </section>
  )
}
