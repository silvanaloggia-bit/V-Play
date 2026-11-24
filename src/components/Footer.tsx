import { Link } from 'react-router'
import vplayLogo from '../assets/images/logo/vplay-logo-navbar.svg'
import './Footer.css'


interface FooterLink {
label: string
path: string
}
interface FooterColumn {
title: string
links: FooterLink[]
}
interface SocialNetwork {
name: string
icon: string
path: string
}
const footerColumns: FooterColumn[] = [
{
title: 'VPLAY',
links: [
{ label: 'Acerca de nosotros', path: '/acerca-de-nosotros' },
{ label: 'Planes', path: '/suscripcion' },
{ label: 'Contacto', path: '/contacto' },
],
},
{
title: 'Ayuda',
links: [
{ label: 'Preguntas frecuentes', path: '/preguntas-frecuentes' },
{ label: 'Términos de uso', path: '/terminos' },
{ label: 'Privacidad', path: '/privacidad' },
],
},
]
const socialNetworks: SocialNetwork[] = [
{ name: 'Instagram', icon: 'bi-instagram', path: '/instagram' },
{ name: 'X', icon: 'bi-twitter-x', path: '/x' },
{ name: 'YouTube', icon: 'bi-youtube', path: '/youtube' },
{ name: 'TikTok', icon: 'bi-tiktok', path: '/tiktok' },
]
export default function Footer() {
const currentYear = new Date().getFullYear()
return (
<footer className="main-footer">
<div className="container">
<div className="row gy-4 text-center text-md-start">
<div className="col-12 col-md-4">
<Link to="/" className="footer-brand">
<img src={vplayLogo} alt="VPLAY" className="footer-logo" />
</Link>
<p className="footer-tagline">Dale Play, pelis y series sin pausa.</p>
</div>
          {footerColumns.map((footerColumn) => (
            <nav
              key={footerColumn.title}
              className="col-6 col-md-2"
              aria-label={footerColumn.title}
            >
              <h2 className="footer-column-title">{footerColumn.title}</h2>
              <ul className="footer-link-list">
                {footerColumn.links.map((footerLink) => (
                  <li key={footerLink.path}>
                    <Link to={footerLink.path} className="footer-link">
                      {footerLink.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="col-12 col-md-4">
            <h2 className="footer-column-title">Seguinos</h2>
            <div className="footer-social-list">
              {socialNetworks.map((socialNetwork) => (
                <Link
                  key={socialNetwork.name}
                  to={socialNetwork.path}
                  aria-label={socialNetwork.name}
                  className="footer-social-button"
                >
                  <i className={`bi ${socialNetwork.icon}`} aria-hidden="true"></i>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {currentYear} VPLAY · Todos los derechos reservados</span>
          <span>Proyecto Final · Rolling Code</span>
          <span>This product uses the TMDB API but is not endorsed on certified by TMDB.</span>
        </div>
      </div>
    </footer>
)
}
