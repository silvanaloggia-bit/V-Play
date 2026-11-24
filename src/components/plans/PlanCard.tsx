import type { Plan } from '../../types/plan'
import './PlanCard.css'

interface PlanCardProps {
  plan: Plan
  isSelected: boolean
  onSelectPlan: (planId: string) => void
}

export default function PlanCard({ plan, isSelected, onSelectPlan }: PlanCardProps) {
  const formattedPrice = plan.price.toLocaleString('es-AR')

  let cardClassName = 'plan-card'
  if (plan.isRecommended) {
    cardClassName += ' plan-card-recommended'
  }
  if (isSelected) {
    cardClassName += ' plan-card-selected'
  }

  let buttonClassName = 'plan-card-button'
  if (isSelected) {
    buttonClassName += ' plan-card-button-selected'
  }

  return (
    <article className={cardClassName}>
      {plan.isRecommended && (
        <span className="plan-card-badge">
          <i className="bi bi-star-fill"></i> Recomendado
        </span>
      )}

      <h2 className="plan-card-name">{plan.name}</h2>

      <p className="plan-card-price">
        $ {formattedPrice} <span className="plan-card-period">/ mes</span>
      </p>

      <ul className="plan-card-benefits">
        {plan.benefits.map((benefit) => (
          <li key={benefit}>
            <i className="bi bi-check-lg"></i> {benefit}
          </li>
        ))}
      </ul>

      <button type="button" className={buttonClassName} onClick={() => onSelectPlan(plan.id)}>
        {isSelected ? 'Plan elegido' : 'Elegir plan'}
      </button>
    </article>
  )
}