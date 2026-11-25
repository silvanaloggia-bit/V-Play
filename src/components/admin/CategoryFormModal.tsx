import { useState, type FormEvent } from 'react'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import type { Category } from '../../types/category'
import './CategoryFormModal.css'

interface CategoryFormModalProps {
  /** null = crear una categoría nueva; con category = editar esa categoría. */
  category: Category | null
  onClose: () => void
  /** Devuelve un mensaje de error si no se pudo guardar; null si salió bien. */
  onSave: (name: string, icon: string) => string | null
}

const ICON_OPTIONS = [
  { value: '', label: 'Sin icono' },
  { value: 'bi-lightning-charge', label: 'Rayo' },
  { value: 'bi-emoji-smile', label: 'Sonrisa' },
  { value: 'bi-film', label: 'Película' },
  { value: 'bi-ghost', label: 'Fantasma' },
  { value: 'bi-rocket-takeoff', label: 'Cohete' },
  { value: 'bi-star', label: 'Estrella' },
  { value: 'bi-trophy', label: 'Trofeo' },
  { value: 'bi-heart', label: 'Corazón' },
  { value: 'bi-music-note-beamed', label: 'Música' },
]

export default function CategoryFormModal({
  category,
  onClose,
  onSave,
}: CategoryFormModalProps) {
  const [name, setName] = useState(() => category?.name ?? '')
  const [icon, setIcon] = useState(() => category?.icon ?? '')
  const [submitted, setSubmitted] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const editing = Boolean(category)
  const nameError = submitted && name.trim() === ''

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setSubmitted(true)
    setSaveError(null)

    if (name.trim() === '') return

    const error = onSave(name, icon)
    if (error) {
      setSaveError(error)
    }
  }

  return (
    <Modal
      show
      onHide={onClose}
      centered
      contentClassName="category-form__content"
    >
      <Modal.Header closeButton closeVariant="white" className="category-form__header">
        <Modal.Title className="category-form__title">
          {editing ? 'Editar categoría' : 'Agregar categoría'}
        </Modal.Title>
      </Modal.Header>

      <Form id="category-form" onSubmit={handleSubmit} noValidate>
        <Modal.Body>
          <Form.Group controlId="category-name" className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(event) => {
                setName(event.target.value)
                setSaveError(null)
              }}
              isInvalid={nameError || saveError !== null}
              placeholder="Ej. Aventura"
            />
            {nameError && (
              <Form.Control.Feedback type="invalid">
                El nombre es obligatorio.
              </Form.Control.Feedback>
            )}
          </Form.Group>

          <Form.Group controlId="category-icon" className="mb-3">
            <Form.Label>Icono</Form.Label>
            <div className="category-form__icon-row">
              {icon && (
                <span className="category-form__icon-preview" aria-hidden="true">
                  <i className={`bi ${icon}`} />
                </span>
              )}
              <Form.Select
                value={icon}
                onChange={(event) => setIcon(event.target.value)}
              >
                {ICON_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Select>
            </div>
            <Form.Text className="category-form__hint">
              Opcional. Se muestra junto al nombre en el panel.
            </Form.Text>
          </Form.Group>

          {saveError && (
            <p className="category-form__error" role="alert">
              <i className="bi bi-exclamation-circle me-1" aria-hidden="true" />
              {saveError}
            </p>
          )}
        </Modal.Body>

        <Modal.Footer className="category-form__footer">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button type="submit" form="category-form" className="category-form__submit">
            {editing ? 'Guardar cambios' : 'Crear categoría'}
          </button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
