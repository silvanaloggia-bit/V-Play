import { Navigate, Route, Routes } from 'react-router'
import Footer from './components/Footer'
import AppNavbar from './components/Navbar'
import HomePage from './pages/HomePage'
import AdminPage from './pages/AdminPage'
import AdminTitlesPage from './pages/admin/AdminTitlesPage'
import AdminTopsPage from './pages/admin/AdminTopsPage'
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage'
import AdminUsersPage from './pages/admin/AdminUsersPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import NotFoundPage from './pages/NotFoundPage'
import ProtectedRoute from './routes/ProtectedRoute'
import SubscriptionPage from './pages/SubscriptionPage'
import AboutPage from './pages/AboutPage'
import MyListPage from './pages/MyListPage'

export default function App() {
  return (
    <>
      <AppNavbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/suscripcion" element={<SubscriptionPage />} />
        <Route path="/acerca-de-nosotros" element={<AboutPage />} />
        <Route path="/mi-lista" element={<MyListPage />} />
        <Route element={<ProtectedRoute allowedRoles={['admin', 'editor']} />}>
          <Route path="/admin" element={<AdminPage />}>
            <Route index element={<Navigate to="titulos" replace />} />
            <Route path="titulos" element={<AdminTitlesPage />} />
            <Route path="tops" element={<AdminTopsPage />} />
            <Route path="categorias" element={<AdminCategoriesPage />} />
            <Route path="usuarios" element={<AdminUsersPage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </>
  )
}
