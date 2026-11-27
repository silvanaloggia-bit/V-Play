import { useState, type FormEvent } from 'react'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import type { Category } from '../../../types/category'
import './CategoryFormModal.css'

interface CategoryFormModalProps {
  category: Category | null
  onClose: () => void
  onSave: (name: string) => string | null
}

export default function CategoryFormModal({
  category,
  onClose,
  onSave,
}: CategoryFormModalProps) {
  const [name, setName] = useState(() => category?.name ?? '')
  const [submitted, setSubmitted] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const editing = Boolean(category)
  const nameError = submitted && name.trim() === ''

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setSubmitted(true)
    setSaveError(null)

    if (name.trim() === '') return

    const error = onSave(name)
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
