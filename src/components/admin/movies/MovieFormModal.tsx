import { useState, type FormEvent } from 'react'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import { useCategories } from '../../../hooks/useCategories'
import { getMovieFieldErrors, movieSchema } from '../../../schemas/movieSchema'
import type { TmdbPicked } from '../../../services/tmdbService'
import type { Category, Movie, MovieType } from '../../../types/movie'
import ImagePickerModal from './ImagePickerModal'
import './MovieFormModal.css'

interface MovieFormModalProps {
  /** null = crear un título nuevo; con movie = editar ese título */
  movie: Movie | null
  nextId: string
  /** Cuántas destacadas hay actualmente */
  featuredCount?: number
  /** Máximo de destacadas permitidas */
  featuredLimit?: number
  onClose: () => void
  onSave: (movie: Movie) => void
}

interface FormValues {
  name: string
  description: string
  type: MovieType
  category: Category | ''
  imageUrl: string
  bannerUrl: string
  published: boolean
  isFeatured: boolean
  duration: string
  seasons: string
  episodes: string
  releaseYear: string
  rating: string
}

const EMPTY_VALUES: FormValues = {
  name: '',
  description: '',
  type: 'pelicula',
  category: '',
  imageUrl: '',
  bannerUrl: '',
  published: true,
  isFeatured: false,
  duration: '',
  seasons: '',
  episodes: '',
  releaseYear: '',
  rating: '',
}

function toOptionalNumber(value: string): number | undefined {
  if (value.trim() === '') return undefined
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

// El componente se monta cada vez que se abre el modal,
// así el estado inicial sale directo de la prop movie.
function toFormValues(movie: Movie | null): FormValues {
  if (!movie) return EMPTY_VALUES

  return {
    name: movie.name,
    description: movie.description,
    type: movie.type ?? 'pelicula',
    category: movie.category,
    imageUrl: movie.imageUrl,
    bannerUrl: movie.bannerUrl ?? '',
    published: movie.published,
    isFeatured: movie.isFeatured,
    duration: movie.duration ? String(movie.duration) : '',
    seasons: movie.seasons ? String(movie.seasons) : '',
    episodes: movie.episodes ? String(movie.episodes) : '',
    releaseYear: movie.releaseYear ? String(movie.releaseYear) : '',
    rating: movie.rating !== undefined ? String(movie.rating) : '',
  }
}

function fillEmptyValues(values: FormValues, picked: TmdbPicked): FormValues {
  const keep = (current: string, incoming?: string | number): string => {
    if (current.trim() !== '') return current
    return incoming === undefined ? '' : String(incoming)
  }

  return {
    ...values,
    type: picked.type,
    name: keep(values.name, picked.name),
    description: keep(values.description, picked.description),
    category: keep(values.category, picked.category),
    imageUrl: keep(values.imageUrl, picked.posterUrl),
    bannerUrl: keep(values.bannerUrl, picked.bannerUrl),
    duration: keep(values.duration, picked.duration),
    seasons: keep(values.seasons, picked.seasons),
    episodes: keep(values.episodes, picked.episodes),
    releaseYear: keep(values.releaseYear, picked.releaseYear),
    rating: keep(values.rating, picked.rating),
  }
}

export default function MovieFormModal({
  movie,
  nextId,
  featuredCount = 0,
  featuredLimit = 3,
  onClose,
  onSave,
}: MovieFormModalProps) {
  const { categories } = useCategories()
  const [values, setValues] = useState<FormValues>(() => toFormValues(movie))
  const [submitted, setSubmitted] = useState(false)
  const [imagePickerOpen, setImagePickerOpen] = useState(false)
  const [tmdbId, setTmdbId] = useState<number | undefined>(movie?.tmdbId)

  const editing = Boolean(movie)
  const featuredFull = !values.isFeatured && featuredCount >= featuredLimit

  const update = <K extends keyof FormValues>(key: K, value: FormValues[K]) =>
    setValues((previous) => ({ ...previous, [key]: value }))

  const parsed = movieSchema.safeParse(values)
  const errors = parsed.success ? {} : getMovieFieldErrors(parsed.error)

  const nameError = submitted && Boolean(errors.name)
  const categoryError = submitted && Boolean(errors.category)
  const imageError = submitted && Boolean(errors.imageUrl)
  const durationError = submitted && Boolean(errors.duration)
  const seasonsError = submitted && Boolean(errors.seasons)
  const episodesError = submitted && Boolean(errors.episodes)
  const releaseYearError = submitted && Boolean(errors.releaseYear)
  const ratingError = submitted && Boolean(errors.rating)

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setSubmitted(true)

    const result = movieSchema.safeParse(values)
    if (!result.success) return

    const data = result.data
    onSave({
      id: movie?.id ?? nextId,
      name: data.name,
      description: data.description,
      type: data.type,
      category: data.category as Category,
      imageUrl: data.imageUrl,
      bannerUrl: data.bannerUrl || undefined,
      published: data.published,
      isFeatured: data.isFeatured,
      duration:
        data.type === 'pelicula' ? toOptionalNumber(data.duration) : undefined,
      seasons:
        data.type === 'serie' ? toOptionalNumber(data.seasons) : undefined,
      episodes:
        data.type === 'serie' ? toOptionalNumber(data.episodes) : undefined,
      releaseYear: toOptionalNumber(data.releaseYear),
      rating: toOptionalNumber(data.rating),
      tmdbId: tmdbId ?? movie?.tmdbId,
    })
  }

  return (
    <>
      <Modal
        show
        onHide={onClose}
        centered
        fullscreen="sm-down"
        scrollable
        contentClassName="movie-form__content"
      >
        <Modal.Header closeButton closeVariant="white" className="movie-form__header">
          <Modal.Title className="movie-form__title">
            {editing ? 'Editar título' : 'Agregar título'}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form id="movie-form" onSubmit={handleSubmit} noValidate>
          <div className="d-flex justify-content-end mb-3">
            <button
              type="button"
              className="movie-form__pick-image-btn"
              onClick={() => setImagePickerOpen(true)}
            >
              <i className="bi bi-stars me-1" aria-hidden="true" />
              Autocompletar con TMDb
            </button>
          </div>

          <Form.Group className="mb-3" controlId="movie-name">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              value={values.name}
              onChange={(event) => update('name', event.target.value)}
              isInvalid={nameError}
            />
            {nameError && (
              <Form.Control.Feedback type="invalid">
                El nombre es obligatorio.
              </Form.Control.Feedback>
            )}
          </Form.Group>

          <Form.Group className="mb-3" controlId="movie-description">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={values.description}
              onChange={(event) => update('description', event.target.value)}
            />
            <Form.Text>{values.description.length} caracteres</Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="movie-type">
            <Form.Label>Tipo</Form.Label>
            <Form.Select
              value={values.type}
              onChange={(event) =>
                update('type', event.target.value as MovieType)
              }
            >
              <option value="pelicula">Película</option>
              <option value="serie">Serie</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="movie-category">
            <Form.Label>Categoría</Form.Label>
            <Form.Select
              value={values.category}
              onChange={(event) =>
                update('category', event.target.value as Category | '')
              }
              isInvalid={categoryError}
            >
              <option value="">Seleccioná una categoría…</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </Form.Select>
            {categoryError && (
              <Form.Control.Feedback type="invalid">
                Elegí una categoría.
              </Form.Control.Feedback>
            )}
          </Form.Group>

          <div className="row g-3 mb-3">
            {values.type === 'pelicula' ? (
              <div className="col-12 col-sm-6">
                <Form.Group controlId="movie-duration">
                  <Form.Label>Duración (min)</Form.Label>
                  <Form.Control
                    type="number"
                    min={1}
                    step={1}
                    placeholder="Ej. 167"
                    value={values.duration}
                    onChange={(event) => update('duration', event.target.value)}
                    isInvalid={durationError}
                  />
                  {durationError && (
                    <Form.Control.Feedback type="invalid">
                      Ingresá los minutos como número entero.
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </div>
            ) : (
              <>
                <div className="col-6">
                  <Form.Group controlId="movie-seasons">
                    <Form.Label>Temporadas</Form.Label>
                    <Form.Control
                      type="number"
                      min={1}
                      step={1}
                      placeholder="Ej. 3"
                      value={values.seasons}
                      onChange={(event) => update('seasons', event.target.value)}
                      isInvalid={seasonsError}
                    />
                    {seasonsError && (
                      <Form.Control.Feedback type="invalid">
                        Ingresá un número entero.
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                </div>
                <div className="col-6">
                  <Form.Group controlId="movie-episodes">
                    <Form.Label>Episodios</Form.Label>
                    <Form.Control
                      type="number"
                      min={1}
                      step={1}
                      placeholder="Ej. 24"
                      value={values.episodes}
                      onChange={(event) => update('episodes', event.target.value)}
                      isInvalid={episodesError}
                    />
                    {episodesError && (
                      <Form.Control.Feedback type="invalid">
                        Ingresá un número entero.
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                </div>
              </>
            )}
          </div>

          <div className="row g-3 mb-4">
            <div className="col-6">
              <Form.Group controlId="movie-year">
                <Form.Label>Año</Form.Label>
                <Form.Control
                  type="number"
                  min={1888}
                  max={2100}
                  step={1}
                  placeholder="Ej. 2024"
                  value={values.releaseYear}
                  onChange={(event) => update('releaseYear', event.target.value)}
                  isInvalid={releaseYearError}
                />
                {releaseYearError && (
                  <Form.Control.Feedback type="invalid">
                    Ingresá un año entre 1888 y 2100.
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </div>
            <div className="col-6">
              <Form.Group controlId="movie-rating">
                <Form.Label>Puntaje</Form.Label>
                <Form.Control
                  type="number"
                  min={0}
                  max={10}
                  step={0.1}
                  placeholder="Ej. 8.2"
                  value={values.rating}
                  onChange={(event) => update('rating', event.target.value)}
                  isInvalid={ratingError}
                />
                {ratingError && (
                  <Form.Control.Feedback type="invalid">
                    Tiene que estar entre 0 y 10.
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </div>
          </div>

          <Form.Group className="mb-4" controlId="movie-image">
            <Form.Label>Imagen</Form.Label>
            <Form.Control
              type="url"
              placeholder="Pegá una URL del póster…"
              value={values.imageUrl}
              onChange={(event) => update('imageUrl', event.target.value)}
              isInvalid={imageError}
            />
            {imageError && (
              <Form.Control.Feedback type="invalid">
                La imagen es obligatoria.
              </Form.Control.Feedback>
            )}
            {values.imageUrl.trim() !== '' && (
              <img
                src={values.imageUrl}
                alt="Vista previa del poster"
                className="movie-form__poster-preview"
                onError={(event) => {
                  event.currentTarget.style.display = 'none'
                }}
              />
            )}
          </Form.Group>

          <div className="d-flex flex-column gap-2">
            <Form.Check
              type="switch"
              id="movie-published"
              label="Publicado (visible en el catálogo)"
              checked={values.published}
              onChange={(event) => {
                const published = event.target.checked
                // Un borrador no puede quedar como destacada
                setValues((previous) => ({
                  ...previous,
                  published,
                  isFeatured: published ? previous.isFeatured : false,
                }))
              }}
            />
            <Form.Check
              type="switch"
              id="movie-featured"
              label="Destacada (aparece como ⭐ Destacada en la lista)"
              checked={values.isFeatured}
              disabled={!values.published || featuredFull}
              onChange={(event) => update('isFeatured', event.target.checked)}
            />
            {!values.published && (
              <Form.Text className="text-muted">
                Publicá el título para poder destacarlo.
              </Form.Text>
            )}
            {values.published && featuredFull && (
              <Form.Text className="text-muted">
                Ya hay {featuredLimit} destacadas; quitá una para elegir otra.
              </Form.Text>
            )}
          </div>
          </Form>
        </Modal.Body>

        <Modal.Footer className="movie-form__footer">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="movie-form"
            className="movie-form__submit-btn"
          >
            {editing ? 'Guardar cambios' : 'Crear título'}
          </button>
        </Modal.Footer>
      </Modal>

      {imagePickerOpen && (
        <ImagePickerModal
          defaultQuery={values.name}
          onClose={() => setImagePickerOpen(false)}
          onSelect={(picked) => {
            setValues((previous) => fillEmptyValues(previous, picked))
            if (picked.tmdbId) setTmdbId(picked.tmdbId)
            setImagePickerOpen(false)
          }}
        />
      )}
    </>
  )
}
