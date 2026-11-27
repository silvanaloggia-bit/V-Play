import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useSearchParams } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { contactSchema } from '../schemas/contactSchema'
import { contactService } from '../services/contactService'
import type { ContactReason } from '../types/contact'
import './Login.css'
import './ContactPage.css'

const contactReasons = [
  { id: 'plan', label: 'Cambiar de plan' },
  { id: 'baja', label: 'Cancelar suscripción' },
  { id: 'tecnico', label: 'Problema técnico' },
  { id: 'otro', label: 'Otro' },
] as const

const helpCards = [
  { icon: 'bi-clock', title: 'Horario', text: 'Lunes a viernes, de 9 a 18 h' },
  { icon: 'bi-reply', title: 'Respuesta', text: 'Te contestamos por email en menos de 48 h' },
  { icon: 'bi-person-gear', title: 'Planes', text: 'Los cambios y las bajas los hace el equipo de VPLAY' },
]

export default function ContactPage() {
  const { loggedUser } = useAuth()
  const [searchParams] = useSearchParams()
  const [isSent, setIsSent] = useState(false)
  const initialReason: ContactReason = searchParams.get('motivo') === 'plan' ? 'plan' : 'otro'

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      reason: initialReason,
      name: loggedUser ? `${loggedUser.name} ${loggedUser.lastName}`.trim() : '',
      email: loggedUser ? loggedUser.email : '',
      message: '',
    },
  })

  const submitContact = handleSubmit((contactData) => {
    contactService.saveMessage({
      id: crypto.randomUUID(),
      ...contactData,
      sentAt: new Date().toISOString(),
    })
    setIsSent(true)
  })

  function handleWriteAgain(): void {
    reset()
    setIsSent(false)
  }

  return (
    <main className="contact-page">
      <header className="container contact-page__header">
        <h1 className="contact-page__title">
          Hablemos <span>de cine</span>
        </h1>
        <p className="contact-page__subtitle">
          ¿Querés cambiar o cancelar tu plan, o tenés una duda? Escribinos.
        </p>
      </header>

      <div className="container contact-page__body">
        <section className="contact-page__card">
          {isSent ? (
            <div className="contact-page__sent" role="status">
              <i className="bi bi-check-circle-fill contact-page__sent-icon" aria-hidden="true"></i>
              <h2 className="contact-page__sent-title">¡Mensaje enviado!</h2>
              <p className="contact-page__sent-text">Te respondemos por email en menos de 48 h.</p>
              <div className="contact-page__sent-actions">
                <Link to="/" className="contact-page__button">
                  Volver al inicio
                </Link>
                <button type="button" className="contact-page__link-button" onClick={handleWriteAgain}>
                  Escribir otro mensaje
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={submitContact} noValidate>
              <fieldset className="mb-3">
                <legend className="form-label login-label">Motivo</legend>
                <div className="contact-page__reasons">
                  {contactReasons.map((contactReason) => (
                    <label key={contactReason.id} className="contact-page__reason">
                      <input type="radio" value={contactReason.id} {...register('reason')} />
                      <span>{contactReason.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="mb-3">
                <label htmlFor="contact-name" className="form-label login-label">
                  Nombre
                </label>
                <input
                  id="contact-name"
                  type="text"
                  className="form-control login-input"
                  placeholder="¿Cómo te llamamos?"
                  autoComplete="name"
                  maxLength={60}
                  {...register('name')}
                />
                {errors.name && <div className="login-error">{errors.name.message}</div>}
              </div>

              <div className="mb-3">
                <label htmlFor="contact-email" className="form-label login-label">
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  className="form-control login-input"
                  placeholder="tu@email.com"
                  autoComplete="email"
                  maxLength={100}
                  {...register('email')}
                />
                {errors.email && <div className="login-error">{errors.email.message}</div>}
              </div>

              <div className="mb-3">
                <label htmlFor="contact-message" className="form-label login-label">
                  Mensaje
                </label>
                <textarea
                  id="contact-message"
                  className="form-control login-input contact-page__message"
                  placeholder="Contanos en qué te ayudamos"
                  rows={5}
                  maxLength={500}
                  {...register('message')}
                />
                {errors.message && <div className="login-error">{errors.message.message}</div>}
              </div>

              <button type="submit" className="btn login-button w-100">
                <i className="bi bi-send me-2" aria-hidden="true"></i>
                Enviar mensaje
              </button>
            </form>
          )}
        </section>

        <aside className="contact-page__help">
          {helpCards.map((helpCard) => (
            <div key={helpCard.title} className="contact-page__help-card">
              <i className={`bi ${helpCard.icon}`} aria-hidden="true"></i>
              <div>
                <h3 className="contact-page__help-title">{helpCard.title}</h3>
                <p className="contact-page__help-text">{helpCard.text}</p>
              </div>
            </div>
          ))}
        </aside>
      </div>
    </main>
  )
}