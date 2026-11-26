import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import PaymentModal from '../components/plans/PaymentModal'
import PlanCard from '../components/plans/PlanCard'
import { posters } from '../assets/importMovies'
import { plans } from '../data/initialData'
import { useAuth } from '../hooks/useAuth'
import { authService } from '../services/authService'
import { formatDate, getDateInDays } from '../utils/formatDate'
import './SubscriptionPage.css'

const PLAN_DURATION_DAYS = 30
const MOSAIC_POSTER_COUNT = 16

const includedBenefits = [
  { icon: 'bi-collection-play', text: 'Películas y series de todas las categorías' },
  { icon: 'bi-phone', text: 'Mirá en el celular, la tablet o la tele' },
  { icon: 'bi-calendar-x', text: 'Sin permanencia: cancelás cuando quieras' },
]

export default function SubscriptionPage() {
  const { loggedUser } = useAuth()
  const navigate = useNavigate()
  const [planToPayId, setPlanToPayId] = useState('')
  const [purchaseMessage, setPurchaseMessage] = useState('')

  const isSubscriber = loggedUser?.role === 'subscriber'
  const currentPlan = plans.find((plan) => plan.id === loggedUser?.planId)
  const planToPay = plans.find((plan) => plan.id === planToPayId)
  const mosaicPosters = Object.values(posters).slice(0, MOSAIC_POSTER_COUNT)

  function handleSelectPlan(planId: string): void {
    if (!loggedUser) {
      navigate('/registro')
      return
    }

    if (!isSubscriber) {
      return
    }

    setPurchaseMessage('')
    setPlanToPayId(planId)
  }

  function handlePaymentApproved(cardDescription: string): void {
    if (!loggedUser || !planToPay) {
      return
    }

    authService.updateUser({
      ...loggedUser,
      planId: planToPay.id,
      isActive: true,
      planEndDate: getDateInDays(PLAN_DURATION_DAYS),
    })

    setPurchaseMessage(`¡Listo! Ya tenés el plan ${planToPay.name}. Pagaste con ${cardDescription}.`)
    setPlanToPayId('')
    navigate('/suscripcion', { replace: true })
  }

  return (
    <main className="subscription-page">
      <section className="subscription-hero">
        <div className="subscription-mosaic" aria-hidden="true">
          {mosaicPosters.map((poster) => (
            <img key={poster} src={poster} alt="" className="subscription-mosaic-poster" />
          ))}
        </div>

        <div className="container subscription-header">
          <h1 className="subscription-title">
            Elegí tu <span className="subscription-title-accent">plan</span>
          </h1>
          <p className="subscription-subtitle">
            Pelis y series sin pausa. Cambiá o cancelá cuando quieras.
          </p>

          {!loggedUser && (
            <p className="subscription-status">
              <Link to="/registro">Registrate gratis</Link> y elegí tu plan para empezar a ver.
            </p>
          )}

          {isSubscriber && !currentPlan && (
            <p className="subscription-status">
              Todavía no tenés un plan. Elegí uno para empezar a ver.
            </p>
          )}

          {isSubscriber && currentPlan && (
            <p className="subscription-status">
              Tu plan actual: <strong>{currentPlan.name}</strong>
              {loggedUser.planEndDate && ` · vence el ${formatDate(loggedUser.planEndDate)}`}
            </p>
          )}

          {loggedUser && !isSubscriber && (
            <p className="subscription-status">
              Estás con una cuenta del equipo: los planes son para suscriptores.
            </p>
          )}

          {purchaseMessage && (
            <p className="subscription-success" role="status">
              {purchaseMessage}
            </p>
          )}
        </div>
      </section>

      <div className="container">
        <section className="subscription-plans">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isSelected={plan.id === loggedUser?.planId}
              onSelectPlan={handleSelectPlan}
            />
          ))}
        </section>

        <section className="subscription-included">
          <h2 className="subscription-included-title">Todos los planes incluyen</h2>
          <ul className="subscription-included-list">
            {includedBenefits.map((includedBenefit) => (
              <li key={includedBenefit.text} className="subscription-included-item">
                <i className={`bi ${includedBenefit.icon}`} aria-hidden="true"></i>
                {includedBenefit.text}
              </li>
            ))}
          </ul>
        </section>
      </div>

      {planToPay && loggedUser && (
        <PaymentModal
          plan={planToPay}
          cardHolderName={`${loggedUser.name} ${loggedUser.lastName}`.trim()}
          onClose={() => setPlanToPayId('')}
          onPaymentApproved={handlePaymentApproved}
        />
      )}
    </main>
  )
}