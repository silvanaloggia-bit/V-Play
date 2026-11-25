import { useState } from 'react'
import PlanCard from '../components/plans/PlanCard'
import { posters } from '../assets/importMovies'
import { plans } from '../data/initialData'
import './SubscriptionPage.css'

const MOSAIC_POSTER_COUNT = 16

const includedBenefits = [
  { icon: 'bi-collection-play', text: 'Películas y series de todas las categorías' },
  { icon: 'bi-phone', text: 'Mirá en el celular, la tablet o la tele' },
  { icon: 'bi-calendar-x', text: 'Sin permanencia: cancelás cuando quieras' },
]

export default function SubscriptionPage() {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)

  const mosaicPosters = Object.values(posters).slice(0, MOSAIC_POSTER_COUNT)

  function handleSelectPlan(planId: string): void {
    setSelectedPlanId(planId)
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
        </div>
      </section>

      <div className="container">
        <section className="subscription-plans">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isSelected={plan.id === selectedPlanId}
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
    </main>
  )
}