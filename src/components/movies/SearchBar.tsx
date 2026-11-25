import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { useLocation, useNavigate, useSearchParams } from 'react-router'

export default function SearchBar() {
  const navigate = useNavigate()
  const currentLocation = useLocation()
  const [searchParams] = useSearchParams()
  const searchText = searchParams.get('buscar') ?? ''

  function handleSearchChange(newSearchText: string): void {
    const isOnHome = currentLocation.pathname === '/'
    const homePath = newSearchText ? `/?buscar=${encodeURIComponent(newSearchText)}` : '/'
    navigate(homePath, { replace: isOnHome })
  }

  return (
    <Form className="d-flex" role="search" onSubmit={(event) => event.preventDefault()}>
      <Form.Control
        type="search"
        placeholder="Buscar película o serie"
        className="me-2 navbar-search-input"
        aria-label="Buscar película o serie"
        value={searchText}
        onChange={(event) => handleSearchChange(event.target.value)}
      />
      <Button type="submit" className="navbar-search-button" aria-label="Buscar">
        <i className="bi bi-search" aria-hidden="true"></i>
      </Button>
    </Form>
  )
}
