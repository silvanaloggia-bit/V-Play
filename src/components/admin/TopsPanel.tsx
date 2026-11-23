import type { Movie, MovieType } from '../../types/movie'
import styles from './TopsPanel.module.css'

const TOP_SIZE = 5
const TOP_SLOTS = Array.from({ length: TOP_SIZE }, (_, index) => index + 1)

interface TopsPanelProps {
  movies: Movie[]
  series: Movie[]
  onAdd: (type: MovieType) => void
  onRemove: (movie: Movie) => void
  onMove: (movie: Movie, direction: 'up' | 'down') => void
}

interface TopListProps {
  title: string
  items: Movie[]
  addLabel: string
  onAdd: () => void
  onRemove: (movie: Movie) => void
  onMove: (movie: Movie, direction: 'up' | 'down') => void
  spaced?: boolean
}

function TopList({
  title,
  items,
  addLabel,
  onAdd,
  onRemove,
  onMove,
  spaced = false,
}: TopListProps) {
  return (
    <>
      <div className={`${styles.header} ${spaced ? styles.headerSpaced : ''}`}>
        <h2 className={styles.heading}>
          <i className="bi bi-trophy me-2" aria-hidden="true" />
          {title}
        </h2>
        <button
          type="button"
          className={styles.addBtn}
          onClick={onAdd}
          disabled={items.length >= TOP_SIZE}
          title={
            items.length >= TOP_SIZE
              ? `El top ya tiene ${TOP_SIZE} puestos ocupados`
              : addLabel
          }
        >
          <i className="bi bi-plus-lg me-1" aria-hidden="true" />
          {addLabel}
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
            {TOP_SLOTS.map((position) => {
              const movie = items[position - 1]
              const lastFilled = position === items.length

              return (
                <tr key={movie?.id ?? `empty-${position}`}>
                  <td>
                    <span className={styles.rankBadge}>{position}</span>
                  </td>
                  <td>
                    {movie ? (
                      <img
                        src={movie.imageUrl}
                        alt={movie.name}
                        className={styles.thumb}
                      />
                    ) : (
                      <div className={styles.placeholderThumb} />
                    )}
                  </td>
                  <td className={movie ? styles.name : styles.placeholderText}>
                    {movie?.name ?? 'Sin asignar'}
                  </td>
                  <td
                    className={
                      movie ? styles.category : styles.placeholderText
                    }
                  >
                    {movie?.category ?? '—'}
                  </td>
                  <td>
                    {movie ? (
                      <div className={styles.actions}>
                        <button
                          type="button"
                          className={`btn btn-sm ${styles.iconBtn}`}
                          aria-label={`Subir ${movie.name}`}
                          title="Subir"
                          disabled={position === 1}
                          onClick={() => onMove(movie, 'up')}
                        >
                          <i className="bi bi-arrow-up" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          className={`btn btn-sm ${styles.iconBtn}`}
                          aria-label={`Bajar ${movie.name}`}
                          title="Bajar"
                          disabled={lastFilled || position === TOP_SIZE}
                          onClick={() => onMove(movie, 'down')}
                        >
                          <i className="bi bi-arrow-down" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          className={`btn btn-sm ${styles.iconBtn} ${styles.deleteBtn}`}
                          aria-label={`Quitar ${movie.name} del top`}
                          title="Quitar del top"
                          onClick={() => onRemove(movie)}
                        >
                          <i className="bi bi-trash" aria-hidden="true" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className={`btn btn-sm ${styles.iconBtn} ${styles.deleteBtn}`}
                        aria-label={`Puesto ${position} libre`}
                        title="Puesto libre"
                        disabled
                      >
                        <i className="bi bi-trash" aria-hidden="true" />
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default function TopsPanel({
  movies,
  series,
  onAdd,
  onRemove,
  onMove,
}: TopsPanelProps) {
  return (
    <section>
      <TopList
        title="Top películas"
        items={movies}
        addLabel="Agregar al top"
        onAdd={() => onAdd('pelicula')}
        onRemove={onRemove}
        onMove={onMove}
      />

      <TopList
        title="Top series"
        items={series}
        addLabel="Agregar serie"
        onAdd={() => onAdd('serie')}
        onRemove={onRemove}
        onMove={onMove}
        spaced
      />

      {series.length === 0 && (
        <p className={styles.note}>
          Todavía no hay series en el top. Cargá una desde la pestaña
          “Títulos” eligiendo el tipo “Serie”.
        </p>
      )}
    </section>
  )
}
