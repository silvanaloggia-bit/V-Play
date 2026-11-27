import { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import { Link, useLocation, useNavigate } from 'react-router'
import { plans } from '../data/initialData'
import { useAuth } from '../hooks/useAuth'
import { useCategories } from '../hooks/useCategories'
import { slugify } from '../utils/slugify'
import SearchBar from './movies/SearchBar'
import vplayLogo from '../assets/images/logo/vplay-logo-navbar.svg'
import './Navbar.css'
const SCROLL_TO_DARKEN_NAVBAR = 40
const roleLabels = {
admin: 'Administrador',
editor: 'Editor',
subscriber: 'Suscriptor',
}
function AppNavbar() {
const navigate = useNavigate()
const { loggedUser, logout } = useAuth()
const { categories } = useCategories()
const isStaff = loggedUser?.role === 'admin' || loggedUser?.role === 'editor'
const isSubscriber = loggedUser?.role === 'subscriber'
const userPlan = plans.find((plan) => plan.id === loggedUser?.planId)
const { pathname } = useLocation()
const [isPageScrolled, setIsPageScrolled] = useState(window.scrollY > SCROLL_TO_DARKEN_NAVBAR)
const isOverHero = pathname === '/' && !isPageScrolled

useEffect(() => {
  function handlePageScroll(): void {
    setIsPageScrolled(window.scrollY > SCROLL_TO_DARKEN_NAVBAR)
  }

  window.addEventListener('scroll', handlePageScroll)
  return () => window.removeEventListener('scroll', handlePageScroll)
}, [])

function handleLogout(): void {
logout()
navigate('/')
}
return (
<Navbar expand="xl" sticky="top" className={isOverHero ? 'main-navbar main-navbar--over-hero' : 'main-navbar'}>
<Container fluid>
<Navbar.Brand as={Link} to="/">
<img src={vplayLogo} alt="VPLAY" className="navbar-logo" />
</Navbar.Brand>
        <Navbar.Toggle aria-controls="mainNavbar" />

        <Navbar.Collapse id="mainNavbar">
          <Nav className="mx-auto my-2 my-xl-0">
            <Nav.Link as={Link} to="/">
              Inicio
            </Nav.Link>

           <Nav.Link as={Link} to="/#categoria-top-5-peliculas" className="navbar-top-link">
              Top V-Play
            </Nav.Link>
            {isSubscriber && (
              <Nav.Link as={Link} to="/mi-lista">
                <i className="bi bi-bookmark-heart me-1" aria-hidden="true"></i>
                Mi lista
              </Nav.Link>
            )}


            <NavDropdown title="Categorías" id="navbarCategoriesDropdown">
              {categories.map((category) => (
                <NavDropdown.Item
                  key={category.id}
                  as={Link}
                  to={`/#categoria-${slugify(category.name)}`}
                >
                  {category.name}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
          </Nav>

          <div className="d-flex flex-column flex-xl-row align-items-xl-center gap-3">
           <SearchBar />

            <div className="navbar-session">
              {(!loggedUser || isSubscriber) && (
                <Button
                  className="navbar-subscribe-button flex-grow-1 flex-xl-grow-0"
                  onClick={() => navigate('/suscripcion')}
                >
                  Suscripción
                </Button>
              )}

              {isStaff && (
                <Button
                  className="navbar-admin-button flex-grow-1 flex-xl-grow-0"
                  onClick={() => navigate('/admin')}
                >
                  <i className="bi bi-gear-fill" aria-hidden="true"></i>
                  Administrar
                </Button>
              )}

              {loggedUser ? (
                <div className="navbar-user">
                  <span className="navbar-avatar" aria-hidden="true">
                    {loggedUser.name.charAt(0)}
                  </span>
                  <div className="navbar-user-text">
                    <span className="navbar-user-name">Hola, {loggedUser.name}</span>
                    <span className="navbar-user-plan">
                    {userPlan ? `Plan ${userPlan.name}` : isSubscriber ? 'Plan Free' : roleLabels[loggedUser.role]}
                    </span>
                  </div>
                  {isSubscriber && (
                    <Button className="navbar-icon-button" aria-label="Notificaciones">
                      <i className="bi bi-bell" aria-hidden="true"></i>
                    </Button>
                  )}
                  <Button
                    className="navbar-icon-button"
                    aria-label="Cerrar sesión"
                    onClick={handleLogout}
                  >
                    <i className="bi bi-box-arrow-right" aria-hidden="true"></i>
                  </Button>
                </div>
              ) : (
                <Button
                  className="navbar-icon-button"
                  aria-label="Iniciar sesión"
                  onClick={() => navigate('/login')}
                >
                  <i className="bi bi-person-fill" aria-hidden="true"></i>
                </Button>
              )}
            </div>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
)
}
export default AppNavbar
