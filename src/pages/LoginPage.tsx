import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router'
import { loginSchema } from '../schemas/loginSchema'
import { useAuth } from '../hooks/useAuth'
import { authService } from '../services/authService'
import './Login.css'
export default function LoginPage() {
const { login } = useAuth()
const navigate = useNavigate()
const [loginErrorMessage, setLoginErrorMessage] = useState('')
const {
register,
handleSubmit,
formState: { errors },
} = useForm({ resolver: zodResolver(loginSchema) })
const submitLogin = handleSubmit((loginData) => {
const loginResult = login(loginData.email, loginData.password)
if (loginResult === 'inactive') {
 setLoginErrorMessage('Tu cuenta está inactiva. Comunicate con VPLAY.')
 return
  }
  if (loginResult === 'wrong-credentials') {
  setLoginErrorMessage('Email o contraseña incorrectos')
  return
  }
    const loggedUser = authService.getLoggedUser()
    if (loggedUser?.role === 'admin' || loggedUser?.role === 'editor') {
      navigate('/admin')
      return
    }
    navigate('/')
})
return (
<main className="login-page">
<div className="login-card">
<h1 className="login-title">Iniciar sesión</h1>
<p className="login-subtitle">Ingresá con tu cuenta de V-Play.</p>
        <form onSubmit={submitLogin} noValidate>
          <div className="mb-3">
            <label htmlFor="login-email" className="form-label login-label">
              Correo electrónico
            </label>
            <input
              id="login-email"
              type="email"
              className="form-control login-input"
              placeholder="tu@email.com"
              autoComplete="email"
              {...register('email', { onChange: () => setLoginErrorMessage('') })}
            />
            {errors.email && <div className="login-error">{errors.email.message}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="login-password" className="form-label login-label">
              Contraseña
            </label>
            <input
              id="login-password"
              type="password"
              className="form-control login-input"
              placeholder="Tu contraseña"
              autoComplete="current-password"
              {...register('password', { onChange: () => setLoginErrorMessage('') })}
            />
            {errors.password && <div className="login-error">{errors.password.message}</div>}
          </div>

          <button type="submit" className="btn w-100 login-button">
            Ingresar
          </button>
          {loginErrorMessage && (
            <div className="mt-3 login-error" role="alert">
              {loginErrorMessage}
            </div>
          )}
        </form>
  
        <p className="login-register">
          ¿No tenés cuenta? <Link to="/registro">Registrate gratis</Link>
        </p>
      </div>
    </main>
)
}
