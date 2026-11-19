import './Login.css'

export default function LoginPage() {
  return (
    <main className="login-page">
      <div className="login-card">
        <h1 className="login-title">Iniciar sesión</h1>
        <p className="login-subtitle">Ingresá con tu cuenta de V-Play.</p>

        <form>
          <div className="mb-3">
            <label htmlFor="login-email" className="form-label login-label">
              Correo electrónico
            </label>
            <input
              id="login-email"
              type="email"
              className="form-control login-input"
              placeholder="tu@email.com"
            />
            <div className="login-error">Ingresá un correo electrónico válido.</div>
          </div>

          <div className="mb-3">
            <label htmlFor="login-password" className="form-label login-label">
              Contraseña
            </label>
            <input
              id="login-password"
              type="password"
              className="form-control login-input"
              placeholder="••••••••"
            />
            <div className="login-error">La contraseña es obligatoria.</div>
          </div>

          <button type="button" className="btn w-100 login-button">
            Ingresar
          </button>

          <div className="mt-3 login-error">
            Email o contraseña incorrectos
          </div>
        </form>
      </div>
    </main>
  )
}
