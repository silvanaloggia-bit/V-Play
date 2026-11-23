import type { ReactNode } from 'react'
import Modal from 'react-bootstrap/Modal'
import styles from './DeleteMovieModal.module.css'

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
      contentClassName={styles.content}
    >
      <Modal.Header closeButton closeVariant="white" className={styles.header}>
        <Modal.Title className={styles.title}>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.body}>{children}</Modal.Body>
      <Modal.Footer className={styles.footer}>
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
