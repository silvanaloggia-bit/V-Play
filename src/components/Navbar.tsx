import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import { Link, useNavigate } from 'react-router'
import { categories } from '../config/constants'
import vplayLogo from '../assets/images/logo/vplay-logo-navbar.svg'
import './Navbar.css'

function AppNavbar() {
  const navigate = useNavigate()

  return (
    <Navbar expand="lg" className="main-navbar">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">
          <img src={vplayLogo} alt="VPLAY" className="navbar-logo" />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="mainNavbar" />

        <Navbar.Collapse id="mainNavbar">
          <Nav className="mx-auto my-2 my-lg-0">
            <Nav.Link as={Link} to="/">
              Inicio
            </Nav.Link>

            <Nav.Link as={Link} to="/">
              Tendencias
            </Nav.Link>

            <NavDropdown title="Categorías" id="navbarCategoriesDropdown">
              {categories.map((category) => (
                <NavDropdown.Item key={category} href={`#${category}`}>
                  {category}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
          </Nav>

          <div className="d-flex flex-column flex-lg-row align-items-lg-center gap-3">
            <Form
              className="d-flex"
              role="search"
              onSubmit={(event) => event.preventDefault()}
            >
              <Form.Control
                type="search"
                placeholder="Buscar película"
                className="me-2 navbar-search-input"
                aria-label="Buscar película"
              />
              <Button type="submit" className="navbar-search-button" aria-label="Buscar">
                <i className="bi bi-search" aria-hidden="true"></i>
              </Button>
            </Form>

            <Button className="navbar-subscribe-button" onClick={() => navigate('/suscripcion')}>
              Suscripción
            </Button>

            <div className="d-flex align-items-center gap-2">
              <Button className="navbar-icon-button" aria-label="Notificaciones">
                <i className="bi bi-bell" aria-hidden="true"></i>
              </Button>

              <Button
                className="navbar-icon-button"
                aria-label="Iniciar sesión"
                onClick={() => navigate('/login')}
              >
                <i className="bi bi-person-fill" aria-hidden="true"></i>
              </Button>
            </div>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default AppNavbar