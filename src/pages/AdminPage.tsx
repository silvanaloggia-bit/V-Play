import { NavLink, Outlet } from 'react-router'
import './AdminPage.css'

const TABS = [
  { to: 'titulos', label: 'Títulos', icon: 'bi-collection' },
  { to: 'tops', label: 'Tops', icon: 'bi-trophy' },
  { to: 'categorias', label: 'Categorías', icon: 'bi-tags' },
  { to: 'usuarios', label: 'Usuarios registrados', icon: 'bi-people' },
] as const

export default function AdminPage() {
  return (
    <div className="admin-page__page">
      <main className="container admin-page__main">
        <div className="admin-page__header-row">
          <div>
            <h1 className="admin-page__title">Panel de administración</h1>
            <p className="admin-page__subtitle">
              Cada sección gestiona su propio CRUD.
            </p>
          </div>
        </div>

        <nav className="admin-page__tabs" aria-label="Secciones del panel">
          {TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `admin-page__tab ${isActive ? 'admin-page__tab--active' : ''}`
              }
            >
              <i className={`bi ${tab.icon} me-1`} aria-hidden="true" />
              {tab.label}
            </NavLink>
          ))}
        </nav>

        <Outlet />
      </main>
    </div>
  )
}
