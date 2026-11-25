import { Link } from 'react-router'
import { teamMembers } from '../data/teamMembers'
import './AboutPage.css'

const productionCredits = [
  { task: 'Guion en', tool: 'TypeScript' },
  { task: 'Efectos especiales en', tool: 'React' },
  { task: 'Producción en', tool: 'Scrum y Trello' },
  { task: 'Montaje en', tool: 'Git y GitHub' },
  { task: 'Filmado en', tool: 'Rolling Code' },
]

export default function AboutPage() {
  return (
    <main className="about-page">
      <section className="about-show">
        <div className="about-show-backdrop" aria-hidden="true">
          {teamMembers.map((member) => (
            <span key={member.id} className={`about-show-panel about-show-panel-${member.id}`}>
              {member.photo && <img src={member.photo} alt="" />}
            </span>
          ))}
        </div>

        <div className="container about-show-content">
          <p className="about-show-badge">
            <strong>V</strong> Serie original
          </p>
          <h1 className="about-show-title">El equipo VPLAY</h1>

          <div className="about-show-meta">
            <span className="about-show-match">100% de coincidencia</span>
            <span>2026</span>
            <span className="about-show-rating">ATP</span>
            <span>1 temporada</span>
            <span>{teamMembers.length} episodios</span>
          </div>

          <p className="about-show-synopsis">
            Cuatro estudiantes de Rolling Code, un proyecto final y una misión: que encontrar qué ver
            sea tan fácil como darle play. Basada en hechos reales, ramas de Git y muchas dailies.
          </p>

          <div className="about-show-actions">
            <a href="#episodios" className="about-button">
              <i className="bi bi-play-fill" aria-hidden="true"></i> Conocé al elenco
            </a>
            <Link to="/" className="about-button about-button-secondary">
              <i className="bi bi-house-door" aria-hidden="true"></i> Volver al inicio
            </Link>
          </div>
        </div>
      </section>

      <section className="container about-episodes" id="episodios">
        <div className="about-episodes-header">
          <h2 className="about-episodes-title">Episodios</h2>
          <span className="about-episodes-season">Temporada 1</span>
        </div>

        <ol className="about-episode-list">
          {teamMembers.map((member, memberIndex) => (
            <li key={member.id} className={`about-episode about-episode-${member.id}`}>
              <span className="about-episode-number">{memberIndex + 1}</span>

              <div className="about-episode-film">
                <div className="about-episode-photo">
                  {member.photo ? (
                    <img src={member.photo} alt={`Foto de ${member.name}`} />
                  ) : (
                    <span className="about-episode-initial">{member.name.charAt(0)}</span>
                  )}
                  <span className="about-episode-frame">0{memberIndex + 1}A</span>
                  <span className="about-episode-play" aria-hidden="true">
                    <i className="bi bi-play-circle"></i>
                  </span>
                </div>
              </div>

              <div>
                <div className="about-episode-heading">
                  <h3 className="about-episode-name">
                    {member.name} <span className="about-episode-tagline">· {member.tagline}</span>
                  </h3>
                  <span className="about-episode-role">{member.role}</span>
                </div>
                <p className="about-episode-description">{member.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="container about-credits">
        <ul className="about-credits-list">
          {productionCredits.map((credit) => (
            <li key={credit.tool}>
              {credit.task} <strong>{credit.tool}</strong>
            </li>
          ))}
        </ul>

        <h2 className="about-end-title">Fin</h2>
        <p className="about-end-question">¿Seguís mirando?</p>
        <Link to="/" className="about-button">
          <i className="bi bi-house-door" aria-hidden="true"></i> Volver al inicio
        </Link>
      </section>
    </main>
  )
}
