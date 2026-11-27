import { useState } from 'react'
import { Accordion } from 'react-bootstrap'
import { Link } from 'react-router'
import { posters } from '../assets/importMovies'
import './FaqPage.css'

const MOSAIC_POSTER_COUNT = 16
const ALL_CATEGORIES = 'Todas'

const faqCategories = [ALL_CATEGORIES, 'Planes y pagos', 'Cuenta', 'Ver títulos', 'Mi lista', 'Sobre VPLAY']

const faqQuestions = [
  {
    id: 'faq-precio',
    category: 'Planes y pagos',
    question: '¿Cuánto cuesta VPLAY?',
    answer: 'Hay tres planes: Básico a $15.000, Estándar a $25.000 y Premium a $40.000. Cada plan dura 30 días desde que se aprueba el pago.',
    linkLabel: 'Ver los planes',
    linkPath: '/suscripcion',
  },
  {
    id: 'faq-diferencias',
    category: 'Planes y pagos',
    question: '¿Qué cambia entre un plan y otro?',
    answer: 'La cantidad de usuarios (2, 4 o 6), la calidad de imagen (HD, Full HD o 4K) y en cuántos dispositivos podés descargar.',
    linkLabel: 'Comparar los planes',
    linkPath: '/suscripcion',
  },
  {
    id: 'faq-cambiar-plan',
    category: 'Planes y pagos',
    question: '¿Cómo cambio o cancelo mi plan?',
    answer: 'Escribinos desde Contacto con el motivo "Cambiar de plan" o "Cancelar suscripción" y el equipo de VPLAY lo hace por vos.',
    linkLabel: 'Ir a Contacto',
    linkPath: '/contacto?motivo=plan',
  },
  {
    id: 'faq-dinero-real',
    category: 'Planes y pagos',
    question: '¿Se cobra dinero real?',
    answer: 'No. VPLAY es un proyecto educativo de Rolling Code: el pago es de prueba y la tarjeta no se guarda.',
    linkLabel: 'Leer los términos',
    linkPath: '/terminos#terminos-planes',
  },
  {
    id: 'faq-crear-cuenta',
    category: 'Cuenta',
    question: '¿Cómo creo mi cuenta?',
    answer: 'Tocá Registrarse, completá tus datos y aceptá los términos. Hasta que elijas un plan, tu cuenta figura como Plan Free.',
    linkLabel: 'Crear mi cuenta',
    linkPath: '/registro',
  },
  {
    id: 'faq-contrasena',
    category: 'Cuenta',
    question: 'Olvidé mi contraseña, ¿qué hago?',
    answer: 'Escribinos desde Contacto con el email de tu cuenta y te ayudamos a entrar de nuevo.',
    linkLabel: 'Ir a Contacto',
    linkPath: '/contacto',
  },
  {
    id: 'faq-trailer',
    category: 'Ver títulos',
    question: '¿Cómo veo un tráiler?',
    answer: 'Pasá el mouse por una película o serie (o tocala en el celular) y el tráiler empieza solo, sin sonido. Desde el ícono del parlante le das sonido.',
    linkLabel: 'Ir al inicio',
    linkPath: '/',
  },
  {
    id: 'faq-buscar',
    category: 'Ver títulos',
    question: '¿Cómo busco una película o serie?',
    answer: 'Escribí el nombre en el buscador de arriba y apretá Enter. El título aparece en grande, con su tráiler.',
    linkLabel: 'Ver el Top V-Play',
    linkPath: '/#categoria-top-5-peliculas',
  },
  {
    id: 'faq-mi-lista',
    category: 'Mi lista',
    question: '¿Para qué sirve Mi lista?',
    answer: 'Para guardar lo que querés ver después. Tocá el ícono de guardar en cualquier título y lo encontrás en Mi lista.',
    linkLabel: 'Ver Mi lista',
    linkPath: '/mi-lista',
  },
  {
    id: 'faq-equipo',
    category: 'Sobre VPLAY',
    question: '¿Quiénes hacen VPLAY?',
    answer: 'Un equipo de estudiantes de Rolling Code. En Acerca de nosotros podés conocer a cada uno.',
    linkLabel: 'Conocer al equipo',
    linkPath: '/acerca-de-nosotros',
  },
]

export default function FaqPage() {
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORIES)
  const mosaicPosters = Object.values(posters).slice(0, MOSAIC_POSTER_COUNT)
  const visibleQuestions = faqQuestions.filter(
    (faqQuestion) => activeCategory === ALL_CATEGORIES || faqQuestion.category === activeCategory,
  )

  return (
    <main className="faq-page">
      <section className="faq-page__hero">
        <div className="faq-page__mosaic" aria-hidden="true">
          {mosaicPosters.map((poster) => (
            <img key={poster} src={poster} alt="" className="faq-page__mosaic-poster" />
          ))}
        </div>

        <div className="container faq-page__header">
          <h1 className="faq-page__title">
            Preguntas <span>frecuentes</span>
          </h1>
          <p className="faq-page__subtitle">Todo lo que necesitás saber antes de darle play.</p>
        </div>
      </section>

      <div className="container faq-page__body">
        <div className="faq-page__categories" role="group" aria-label="Categorías de preguntas">
          {faqCategories.map((faqCategory) => (
            <button
              key={faqCategory}
              type="button"
              className={`faq-page__category ${faqCategory === activeCategory ? 'faq-page__category--active' : ''}`}
              aria-pressed={faqCategory === activeCategory}
              onClick={() => setActiveCategory(faqCategory)}
            >
              {faqCategory}
            </button>
          ))}
        </div>

        <Accordion key={activeCategory} defaultActiveKey={visibleQuestions[0].id} className="faq-page__list">
          {visibleQuestions.map((faqQuestion, questionIndex) => (
            <Accordion.Item key={faqQuestion.id} eventKey={faqQuestion.id} className="faq-page__item">
              <Accordion.Header className="faq-page__question">
                <span className="faq-page__number">{String(questionIndex + 1).padStart(2, '0')}</span>
                {faqQuestion.question}
              </Accordion.Header>
              <Accordion.Body className="faq-page__answer">
                <p>{faqQuestion.answer}</p>
                <Link to={faqQuestion.linkPath} className="faq-page__answer-link">
                  {faqQuestion.linkLabel}
                  <i className="bi bi-arrow-right" aria-hidden="true"></i>
                </Link>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>

        <aside className="faq-page__help">
          <i className="bi bi-chat-dots faq-page__help-icon" aria-hidden="true"></i>
          <div>
            <h2 className="faq-page__help-title">¿No encontraste tu respuesta?</h2>
            <p className="faq-page__help-text">Escribinos y te contestamos por email en menos de 48 h.</p>
          </div>
          <Link to="/contacto" className="faq-page__help-button">
            Ir a Contacto
          </Link>
        </aside>
      </div>
    </main>
  )
}