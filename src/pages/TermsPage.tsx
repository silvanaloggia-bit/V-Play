import { Link } from 'react-router'
import { posters } from '../assets/importMovies'
import './TermsPage.css'

const TERMS_UPDATED_AT = '27/11/2026'
const MOSAIC_POSTER_COUNT = 16

const termsSections = [
  {
    id: 'terminos-aceptacion',
    title: 'Aceptación',
    text: 'Al crear tu cuenta en VPLAY aceptás estos términos. Si no estás de acuerdo con alguno, no uses el servicio.',
  },
  {
    id: 'terminos-cuenta',
    title: 'Tu cuenta',
    text: 'Sos responsable de tu email y de tu contraseña. No compartas tu cuenta con personas fuera de los usuarios que incluye tu plan.',
  },
  {
    id: 'terminos-planes',
    title: 'Planes y pagos',
    text: 'Cada plan dura 30 días desde que se aprueba el pago. El precio y los beneficios de cada plan están en la página de planes.',
  },
  {
    id: 'terminos-bajas',
    title: 'Cambios y bajas',
    text: 'Para cambiar o cancelar tu plan, escribinos desde Contacto y el equipo de VPLAY lo gestiona por vos.',
  },
  {
    id: 'terminos-contenido',
    title: 'Uso del contenido',
    text: 'Las películas y series son para verlas de forma personal. Las imágenes y los datos de los títulos son de TMDb y de sus estudios.',
  },
  {
    id: 'terminos-privacidad',
    title: 'Privacidad',
    text: 'Tus datos se guardan en este navegador y no se comparten con nadie. La tarjeta que usás en el pago de prueba no se guarda.',
  },
  {
    id: 'terminos-cambios',
    title: 'Cambios en estos términos',
    text: 'Si cambiamos algo de estos términos, vas a ver la nueva fecha de actualización arriba de esta página.',
  },
]

export default function TermsPage() {
  const mosaicPosters = Object.values(posters).slice(0, MOSAIC_POSTER_COUNT)

  function handleBackToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className="terms-page">
      <section className="terms-page__hero">
        <div className="terms-page__mosaic" aria-hidden="true">
          {mosaicPosters.map((poster) => (
            <img key={poster} src={poster} alt="" className="terms-page__mosaic-poster" />
          ))}
        </div>

        <div className="container terms-page__header">
          <h1 className="terms-page__title">
            Términos <span>de uso</span>
          </h1>
          <p className="terms-page__date">
            <i className="bi bi-calendar3" aria-hidden="true"></i>
            Última actualización: {TERMS_UPDATED_AT}
          </p>
        </div>
      </section>

      <div className="container terms-page__body">
        <nav className="terms-page__index" aria-label="Índice de los términos">
          <h2 className="terms-page__index-title">Índice</h2>
          <ol className="terms-page__index-list">
            {termsSections.map((termsSection, sectionIndex) => (
              <li key={termsSection.id}>
                <a href={`#${termsSection.id}`} className="terms-page__index-link">
                  {sectionIndex + 1}. {termsSection.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <article className="terms-page__content">
          <p className="terms-page__note">
            <i className="bi bi-info-circle" aria-hidden="true"></i>
            VPLAY es un proyecto educativo de Rolling Code: no se cobra dinero real ni se guardan tarjetas.
          </p>

          {termsSections.map((termsSection, sectionIndex) => (
            <section key={termsSection.id} id={termsSection.id} className="terms-page__section">
              <h2 className="terms-page__section-title">
                <span>{String(sectionIndex + 1).padStart(2, '0')}</span>
                {termsSection.title}
              </h2>
              <p className="terms-page__section-text">{termsSection.text}</p>
            </section>
          ))}

          <div className="terms-page__actions">
            <button type="button" className="terms-page__top-button" onClick={handleBackToTop}>
              <i className="bi bi-arrow-up" aria-hidden="true"></i>
              Volver arriba
            </button>
            <Link to="/contacto" className="terms-page__contact-button">
              <i className="bi bi-chat-dots" aria-hidden="true"></i>
              Ir a Contacto
            </Link>
          </div>
        </article>
      </div>
    </main>
  )
}