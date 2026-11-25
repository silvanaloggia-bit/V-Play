import type { ReactNode } from 'react'
import Modal from 'react-bootstrap/Modal'
import './DeleteMovieModal.css'

interface DeleteMovieModalProps {
  open: boolean
  title?: string
  children: ReactNode
  confirmLabel?: string
  onCancel: () => void
  onConfirm: () => void
}

export default function DeleteMovieModal({
  open,
  title = 'Confirmar acción',
  children,
  confirmLabel = 'Confirmar',
  onCancel,
  onConfirm,
}: DeleteMovieModalProps) {
  return (
    <Modal
      show={open}
      onHide={onCancel}
      centered
      contentClassName="delete-modal__content"
    >
      <Modal.Header closeButton closeVariant="white" className="delete-modal__header">
        <Modal.Title className="delete-modal__title">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="delete-modal__body">{children}</Modal.Body>
      <Modal.Footer className="delete-modal__footer">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onCancel}
        >
          Cancelar
        </button>
        <button type="button" className="btn btn-danger" onClick={onConfirm}>
          {confirmLabel}
        </button>
      </Modal.Footer>
    </Modal>
  )
}
