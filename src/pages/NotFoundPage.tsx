import { Link } from 'react-router'
import vplayIcon from '../assets/images/logo/vplay-icono.svg'
import './NotFoundPage.css'

export default function NotFoundPage() {
  return (
    <main className="not-found-page">
      <div className="not-found-content">
        <span className="not-found-tag">SIN SEÑAL</span>

        <h1 className="not-found-code" aria-label="Error 404">
          <span>4</span>
          <img src={vplayIcon} alt="" className="not-found-icon" />
          <span>4</span>
        </h1>

        <h2 className="not-found-title">¡Se nos colgó el streaming!</h2>
        <p className="not-found-text">
          Le dimos play, esperamos el buffering, reiniciamos el router y hasta cambiamos las pilas
          del control remoto. Esta página no carga ni en 4K ni en 144p.
        </p>

        <div className="not-found-player">
          <p className="not-found-episode">T4 · E04 — La página que nunca se estrenó</p>
          <div className="not-found-progress">
            <span className="not-found-progress-fill"></span>
          </div>
          <div className="not-found-time">
            <span>00:04</span>
            <span>Cargando… para siempre</span>
            <span>04:04</span>
          </div>
        </div>

        <Link to="/" className="not-found-button">
          <i className="bi bi-house-door-fill"></i>
          Volver al Inicio
        </Link>
      </div>
    </main>
  )
}