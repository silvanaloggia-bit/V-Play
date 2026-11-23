import { useState, type FormEvent } from 'react'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import { categories } from '../../config/constants'
import type { Category, Movie, MovieType } from '../../types/movie'
import ImagePickerModal from './ImagePickerModal'
import styles from './MovieFormModal.module.css'

interface MovieFormModalProps {
  /** null = crear un título nuevo; con movie = editar ese título */
  movie: Movie | null
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
  }
}

export default function MovieFormModal({
  movie,
  featuredCount = 0,
  featuredLimit = 3,
  onClose,
  onSave,
}: MovieFormModalProps) {
  const [values, setValues] = useState<FormValues>(() => toFormValues(movie))
  const [submitted, setSubmitted] = useState(false)
  const [imagePickerOpen, setImagePickerOpen] = useState(false)

  const editing = Boolean(movie)
  const featuredFull = !values.isFeatured && featuredCount >= featuredLimit

  const update = <K extends keyof FormValues>(key: K, value: FormValues[K]) =>
    setValues((previous) => ({ ...previous, [key]: value }))

  const nameError = submitted && values.name.trim() === ''
  const categoryError = submitted && values.category === ''
  const imageError = submitted && values.imageUrl.trim() === ''

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setSubmitted(true)

    const name = values.name.trim()
    const category = values.category
    const imageUrl = values.imageUrl.trim()

    if (!name || !category || !imageUrl) return

    onSave({
      id: movie?.id ?? crypto.randomUUID(),
      name,
      description: values.description.trim(),
      type: values.type,
      category,
      imageUrl,
      bannerUrl: values.bannerUrl.trim() || undefined,
      published: values.published,
      isFeatured: values.isFeatured,
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
        contentClassName={styles.content}
      >
        <Modal.Header closeButton closeVariant="white" className={styles.header}>
          <Modal.Title className={styles.title}>
            {editing ? 'Editar título' : 'Agregar título'}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form id="movie-form" onSubmit={handleSubmit} noValidate>
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
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Form.Select>
            {categoryError && (
              <Form.Control.Feedback type="invalid">
                Elegí una categoría.
              </Form.Control.Feedback>
            )}
          </Form.Group>

          <Form.Group className="mb-4" controlId="movie-image">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <Form.Label className="mb-0">Imagen</Form.Label>
              <button
                type="button"
                className={styles.pickImageBtn}
                onClick={() => setImagePickerOpen(true)}
              >
                <i className="bi bi-search me-1" aria-hidden="true" />
                Buscar en TMDb
              </button>
            </div>
            <Form.Control
              type="url"
              placeholder="Pegá una URL o buscá en TMDb…"
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
                className={styles.posterPreview}
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

        <Modal.Footer className={styles.footer}>
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
            className={styles.submitBtn}
          >
            {editing ? 'Guardar cambios' : 'Crear título'}
          </button>
        </Modal.Footer>
      </Modal>

      {imagePickerOpen && (
        <ImagePickerModal
          defaultQuery={values.name}
          onClose={() => setImagePickerOpen(false)}
          onSelect={({ posterUrl, bannerUrl }) => {
            update('imageUrl', posterUrl)
            if (bannerUrl) update('bannerUrl', bannerUrl)
            setImagePickerOpen(false)
          }}
        />
      )}
    </>
  )
}
