import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router';

// Más adelante esta lista se importa desde config/constants.ts
const categories = ['Acción', 'Comedia', 'Drama'];

function AppNavbar() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">
          Vplay
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbarScroll" />

        <Navbar.Collapse id="navbarScroll">
          <Nav className="mx-auto my-2 my-lg-0">
            <Nav.Link as={Link} to="/">
              Inicio
            </Nav.Link>

            <NavDropdown title="Categorías" id="navbarCategoriesDropdown">
              {categories.map((category) => (
                <NavDropdown.Item key={category} href={`#${category}`}>
                  {category}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
          </Nav>

          <div className="d-flex align-items-center gap-3 flex-nowrap">
            <Form
              className="d-flex"
              role="search"
              onSubmit={(event) => event.preventDefault()}
            >
              <Form.Control
                type="search"
                placeholder="Buscar película"
                className="me-2"
                aria-label="Buscar película"
              />
              <Button type="submit" variant="outline-secondary" aria-label="Buscar">
                <i className="bi bi-search" aria-hidden="true"></i>
              </Button>
            </Form>

            <Button variant="info" className="fw-bold text-uppercase text-nowrap">
              Suscripción
            </Button> 

            <Button
              as={Link}
              to="/login"
              variant="secondary"
              className="rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: '42px', height: '42px' }}
              aria-label="Ingresar"
            >
              <i className="bi bi-person-fill" aria-hidden="true"></i>
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;