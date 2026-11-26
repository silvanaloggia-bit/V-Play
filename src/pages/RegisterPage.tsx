import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router'
import { registerSchema, type RegisterFormData } from '../schemas/registerSchema'
import { useAuth } from '../hooks/useAuth'
import { authService } from '../services/authService'
import type { User } from '../types/user'
import './Login.css'
import './Register.css'

export default function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { acceptTerms: false },
  })

  const submitRegister = handleSubmit((registerData) => {
    const email = registerData.email

    if (authService.isEmailTaken(email)) {
      setError('email', { message: 'Ya existe una cuenta con ese email.' })
      return
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      name: registerData.name.trim(),
      lastName: '',
      email,
      password: registerData.password,
      role: 'subscriber',
      planId: '',
      isActive: true,
      planEndDate: '',
    }

    authService.registerUser(newUser)
    login(email, registerData.password)
    navigate('/suscripcion')
  })

  return (
    <main className="login-page">
      <div className="login-card register-card">
        <h1 className="login-title">
          Creá tu <span className="register-title-accent">cuenta</span>
        </h1>
        <p className="register-plan-note">
          <i className="bi bi-film" aria-hidden="true"></i>
          <span>
            Crear la cuenta es <strong>gratis</strong>. Después elegís tu plan para empezar a ver.
          </span>
        </p>

        <form onSubmit={submitRegister} noValidate>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="register-name" className="form-label login-label">
                Nombre
              </label>
              <input
                id="register-name"
                type="text"
                className="form-control login-input"
                placeholder="¿Cómo te llamamos?"
                autoComplete="given-name"
                maxLength={40}
                {...register('name')}
              />
              {errors.name && <div className="login-error">{errors.name.message}</div>}
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="register-email" className="form-label login-label">
                Correo electrónico
              </label>
              <input
                id="register-email"
                type="email"
                className="form-control login-input"
                placeholder="tu@email.com"
                autoComplete="email"
                maxLength={100}
                {...register('email')}
              />
              {errors.email && <div className="login-error">{errors.email.message}</div>}
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="register-password" className="form-label login-label">
                Contraseña
              </label>
              <input
                id="register-password"
                type="password"
                className="form-control login-input"
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
                maxLength={32}
                {...register('password')}
              />
              {errors.password && <div className="login-error">{errors.password.message}</div>}
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="register-confirm-password" className="form-label login-label">
                Repetir contraseña
              </label>
              <input
                id="register-confirm-password"
                type="password"
                className="form-control login-input"
                placeholder="Repetí la contraseña"
                autoComplete="new-password"
                maxLength={32}
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <div className="login-error">{errors.confirmPassword.message}</div>
              )}
            </div>
          </div>

          <div className="mb-3">
            <div className="form-check">
              <input
                id="register-accept-terms"
                type="checkbox"
                className="form-check-input register-check"
                {...register('acceptTerms')}
              />
              <label htmlFor="register-accept-terms" className="form-check-label register-terms">
                Acepto los <span className="register-terms-link">términos y condiciones</span>
              </label>
            </div>
            {errors.acceptTerms && <div className="login-error">{errors.acceptTerms.message}</div>}
          </div>

          <button type="submit" className="btn w-100 login-button">
            Crear cuenta
          </button>
        </form>

        <p className="login-register">
          ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
        </p>
      </div>
    </main>
  )
}