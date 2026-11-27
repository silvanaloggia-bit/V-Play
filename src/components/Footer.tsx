import { Link } from 'react-router'
import vplayLogo from '../assets/images/logo/vplay-logo-navbar.svg'
import './Footer.css'


interface FooterLink {
label: string
path: string
}
interface SocialNetwork {
name: string
icon: string
path: string
}
const footerLinks: FooterLink[] = [
{ label: 'Acerca de nosotros', path: '/acerca-de-nosotros' },
{ label: 'Planes', path: '/suscripcion' },
{ label: 'Contacto', path: '/contacto' },
{ label: 'Preguntas frecuentes', path: '/preguntas-frecuentes' },
{ label: 'Términos de uso', path: '/terminos' },
{ label: 'Privacidad', path: '/terminos#terminos-privacidad' },
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
<div className="footer-top">
<div className="footer-brand-block">
<Link to="/" className="footer-brand">
<img src={vplayLogo} alt="VPLAY" className="footer-logo" />
</Link>
<p className="footer-tagline">Dale Play, pelis y series sin pausa.</p>
</div>

          <nav aria-label="Links de VPLAY">
            <ul className="footer-link-list">
              {footerLinks.map((footerLink) => (
                <li key={footerLink.path}>
                  <Link to={footerLink.path} className="footer-link">
                    {footerLink.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

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

        <div className="footer-bottom">
          <span>© {currentYear} VPLAY · Proyecto Final Rolling Code</span>
          <span>This product uses the TMDB API but is not endorsed or certified by TMDB.</span>
        </div>
      </div>
    </footer>
)
}