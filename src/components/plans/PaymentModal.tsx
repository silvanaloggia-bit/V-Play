import { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { subscriptionSchema } from '../../schemas/subscriptionSchema'
import {
  formatCardExpiry,
  formatCardNumber,
  getCardBrand,
  getCardDigits,
} from '../../utils/cardValidation'
import type { Plan } from '../../types/plan'
import './PaymentModal.css'

const PAYMENT_DELAY_IN_MILLISECONDS = 1500

interface PaymentModalProps {
  plan: Plan
  cardHolderName: string
  onClose: () => void
  onPaymentApproved: (cardDescription: string) => void
}

export default function PaymentModal({
  plan,
  cardHolderName,
  onClose,
  onPaymentApproved,
}: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const formattedPrice = plan.price.toLocaleString('es-AR')

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: { cardHolder: cardHolderName, cardNumber: '', cardExpiry: '', cardCode: '' },
  })

  const cardNumber = useWatch({ control, name: 'cardNumber' })
  const cardBrand = getCardBrand(cardNumber)

  function handleClose(): void {
    if (!isProcessing) {
      onClose()
    }
  }

  const submitPayment = handleSubmit((paymentData) => {
    setIsProcessing(true)
    const cardLastDigits = getCardDigits(paymentData.cardNumber).slice(-4)
    const cardDescription = `${getCardBrand(paymentData.cardNumber)} terminada en ${cardLastDigits}`

    setTimeout(() => {
      onPaymentApproved(cardDescription)
    }, PAYMENT_DELAY_IN_MILLISECONDS)
  })

  return (
    <Modal show onHide={handleClose} centered contentClassName="payment-modal__content">
      <Modal.Header closeButton={!isProcessing} closeVariant="white" className="payment-modal__header">
        <Modal.Title className="payment-modal__title">
          Pagar plan <span>{plan.name}</span>
        </Modal.Title>
      </Modal.Header>

      <form onSubmit={submitPayment} noValidate>
        <Modal.Body>
          <div className="payment-modal__summary">
            <span>Plan {plan.name}</span>
            <strong>
              $ {formattedPrice} <small>/ mes</small>
            </strong>
          </div>

          <div className="mb-3">
            <label htmlFor="payment-card-holder" className="form-label">
              Nombre en la tarjeta
            </label>
            <input
              id="payment-card-holder"
              type="text"
              className="form-control"
              placeholder="Como figura en la tarjeta"
              autoComplete="cc-name"
              maxLength={40}
              disabled={isProcessing}
              {...register('cardHolder')}
            />
            {errors.cardHolder && (
              <div className="payment-modal__error">{errors.cardHolder.message}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="payment-card-number" className="form-label">
              Número de tarjeta
            </label>
            <div className="payment-modal__card-number">
              <input
                id="payment-card-number"
                type="text"
                inputMode="numeric"
                className="form-control"
                placeholder="0000 0000 0000 0000"
                autoComplete="cc-number"
                disabled={isProcessing}
                {...register('cardNumber', {
                  onChange: (event) => setValue('cardNumber', formatCardNumber(event.target.value)),
                })}
              />
              <span className="payment-modal__brand">{cardBrand}</span>
            </div>
            {errors.cardNumber && (
              <div className="payment-modal__error">{errors.cardNumber.message}</div>
            )}
          </div>

          <div className="row">
            <div className="col-6 mb-3">
              <label htmlFor="payment-card-expiry" className="form-label">
                Vencimiento
              </label>
              <input
                id="payment-card-expiry"
                type="text"
                inputMode="numeric"
                className="form-control"
                placeholder="MM/AA"
                autoComplete="cc-exp"
                disabled={isProcessing}
                {...register('cardExpiry', {
                  onChange: (event) => setValue('cardExpiry', formatCardExpiry(event.target.value)),
                })}
              />
              {errors.cardExpiry && (
                <div className="payment-modal__error">{errors.cardExpiry.message}</div>
              )}
            </div>

            <div className="col-6 mb-3">
              <label htmlFor="payment-card-code" className="form-label">
                Código de seguridad
              </label>
              <input
                id="payment-card-code"
                type="password"
                inputMode="numeric"
                className="form-control"
                placeholder="123"
                autoComplete="cc-csc"
                maxLength={3}
                disabled={isProcessing}
                {...register('cardCode')}
              />
              {errors.cardCode && (
                <div className="payment-modal__error">{errors.cardCode.message}</div>
              )}
            </div>
          </div>

          <p className="payment-modal__demo-note">
            <i className="bi bi-shield-lock" aria-hidden="true"></i>
            Pago de prueba: no se cobra nada ni se guarda la tarjeta. Podés usar 4242 4242 4242 4242.
          </p>
        </Modal.Body>

        <Modal.Footer className="payment-modal__footer">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={handleClose}
            disabled={isProcessing}
          >
            Cancelar
          </button>
          <button type="submit" className="payment-modal__submit" disabled={isProcessing}>
            {isProcessing ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                Procesando pago...
              </>
            ) : (
              `Pagar $ ${formattedPrice}`
            )}
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  )
}