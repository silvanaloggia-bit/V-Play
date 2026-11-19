import type { Movie } from '../../types/movie'
import styles from './TrendsPanel.module.css'

interface TrendsPanelProps {
  movies: Movie[]
}

export default function TrendsPanel({ movies }: TrendsPanelProps) {
  // Las tendencias del hero son los títulos con banner asignado
  const trends = movies.filter((movie) => Boolean(movie.bannerUrl))

  return (
    <section>
      <div className={styles.header}>
        <h2 className={styles.heading}>
          <i className="bi bi-graph-up-arrow me-2" aria-hidden="true" />
          Tendencias del hero
        </h2>
        <button type="button" className={styles.addBtn}>
          <i className="bi bi-plus-lg me-1" aria-hidden="true" />
          Agregar tendencia
        </button>
      </div>

      {trends.length === 0 ? (
        <div className={styles.emptyBox}>
          No hay tendencias configuradas.
        </div>
      ) : (
        <ul className={styles.list}>
          {trends.map((movie) => (
            <li key={movie.id} className={styles.card}>
              <img
                src={movie.bannerUrl}
                alt={movie.name}
                className={styles.banner}
              />
              <div className={styles.info}>
                <span className={styles.name}>{movie.name}</span>
                <p className={styles.description}>{movie.description}</p>
              </div>
              <div className={styles.actions}>
                <button type="button" className="btn btn-outline-danger btn-sm">
                  Quitar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <p className={styles.note}>
        Las tendencias definen qué títulos aparecen en el carousel del inicio.
        Por ahora se listan los títulos que tienen banner asignado.
      </p>
    </section>
  )
}
