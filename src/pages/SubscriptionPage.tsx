import { useState } from 'react'
import PlanCard from '../components/plans/PlanCard'
import { plans } from '../data/initialData'
import './SubscriptionPage.css'

export default function SubscriptionPage() {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)

  function handleSelectPlan(planId: string): void {
    setSelectedPlanId(planId)
  }

  return (
    <main className="subscription-page container">
      <header className="subscription-header">
        <h1 className="subscription-title">Elegí tu plan</h1>
        <p className="subscription-subtitle">Cambiá o cancelá cuando quieras.</p>
      </header>

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
    </main>
  )
}