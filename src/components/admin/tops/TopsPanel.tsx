import type { Movie, MovieType } from '../../types/movie'
import './TopsPanel.css'

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
      <div className={`tops-panel__header ${spaced ? 'tops-panel__header--spaced' : ''}`}>
        <h2 className="tops-panel__heading">
          <i className="bi bi-trophy me-2" aria-hidden="true" />
          {title}
        </h2>
        <button
          type="button"
          className="tops-panel__add-btn"
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

      <div className="tops-panel__list-wrapper">
        <table className="table table-hover align-middle mb-0 tops-panel__table">
          <thead>
            <tr>
              <th scope="col" className="tops-panel__rank-col">
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
                    <span className="tops-panel__rank-badge">{position}</span>
                  </td>
                  <td>
                    {movie ? (
                      <img
                        src={movie.imageUrl}
                        alt={movie.name}
                        className="tops-panel__thumb"
                      />
                    ) : (
                      <div className="tops-panel__placeholder-thumb" />
                    )}
                  </td>
                  <td className={movie ? 'tops-panel__name' : 'tops-panel__placeholder-text'}>
                    {movie?.name ?? 'Sin asignar'}
                  </td>
                  <td
                    className={
                      movie ? 'tops-panel__category' : 'tops-panel__placeholder-text'
                    }
                  >
                    {movie?.category ?? '—'}
                  </td>
                  <td>
                    {movie ? (
                      <div className="tops-panel__actions">
                        <button
                          type="button"
                          className="btn btn-sm tops-panel__icon-btn"
                          aria-label={`Subir ${movie.name}`}
                          title="Subir"
                          disabled={position === 1}
                          onClick={() => onMove(movie, 'up')}
                        >
                          <i className="bi bi-arrow-up" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm tops-panel__icon-btn"
                          aria-label={`Bajar ${movie.name}`}
                          title="Bajar"
                          disabled={lastFilled || position === TOP_SIZE}
                          onClick={() => onMove(movie, 'down')}
                        >
                          <i className="bi bi-arrow-down" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm tops-panel__icon-btn tops-panel__delete-btn"
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
                        className="btn btn-sm tops-panel__icon-btn tops-panel__delete-btn"
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
        <p className="tops-panel__note">
          Todavía no hay series en el top. Cargá una desde la pestaña
          “Títulos” eligiendo el tipo “Serie”.
        </p>
      )}
    </section>
  )
}
