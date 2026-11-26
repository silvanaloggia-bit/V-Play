import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import Modal from 'react-bootstrap/Modal'
import { plans } from '../../../data/initialData'
import { userPlanSchema } from '../../../schemas/userPlanSchema'
import type { User } from '../../../types/user'
import './UserFormModal.css'

interface UserFormModalProps {
  user: User
  onClose: () => void
  onSave: (updatedUser: User) => void
}

export default function UserFormModal({ user, onClose, onSave }: UserFormModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userPlanSchema),
    defaultValues: {
      planId: user.planId ?? '',
      isActive: user.isActive !== false,
      planEndDate: user.planEndDate ?? '',
    },
  })

  const submitUserPlan = handleSubmit((userPlanData) => {
    onSave({
      ...user,
      planId: userPlanData.planId,
      isActive: userPlanData.isActive,
      planEndDate: userPlanData.planId === '' ? '' : userPlanData.planEndDate,
    })
  })

  return (
    <Modal show onHide={onClose} centered contentClassName="user-form-modal__content">
      <Modal.Header closeButton closeVariant="white" className="user-form-modal__header">
        <Modal.Title className="user-form-modal__title">Editar usuario</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="user-form-modal__user-email">
          {user.name} · {user.email}
        </p>

        <form id="user-form" onSubmit={submitUserPlan} noValidate>
          <div className="mb-3">
            <label htmlFor="user-plan" className="form-label">
              Plan
            </label>
            <select id="user-plan" className="form-select" {...register('planId')}>
              <option value="">Sin plan</option>
              {plans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name} · $ {plan.price.toLocaleString('es-AR')}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="user-plan-end-date" className="form-label">
              Vencimiento del plan
            </label>
            <input
              id="user-plan-end-date"
              type="date"
              className="form-control"
              {...register('planEndDate')}
            />
            <div className="user-form-modal__hint">Si el usuario no tiene plan, dejala vacía.</div>
            {errors.planEndDate && (
              <div className="user-form-modal__error">{errors.planEndDate.message}</div>
            )}
          </div>

          <div className="form-check">
            <input id="user-active" type="checkbox" className="form-check-input" {...register('isActive')} />
            <label htmlFor="user-active" className="form-check-label">
              Usuario activo
            </label>
          </div>
        </form>
      </Modal.Body>

      <Modal.Footer className="user-form-modal__footer">
        <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
          Cancelar
        </button>
        <button type="submit" form="user-form" className="user-form-modal__save-button">
          Guardar cambios
        </button>
      </Modal.Footer>
    </Modal>
  )
}