import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import vplayLogo from '../../assets/images/logo/vplay-logo-navbar.svg'
import './VplayIntro.css'

const INTRO_DURATION_IN_MILLISECONDS = 2500

export default function VplayIntro() {
  const navigate = useNavigate()

  useEffect(() => {
    const introTimer = setTimeout(() => navigate('/', { replace: true }), INTRO_DURATION_IN_MILLISECONDS)
    return () => clearTimeout(introTimer)
  }, [navigate])

  return (
    <button
      type="button"
      className="vplay-intro"
      aria-label="Saltar intro y entrar a VPLAY"
      onClick={() => navigate('/', { replace: true })}
    >
      <img className="vplay-intro__logo" src={vplayLogo} alt="VPLAY" />
    </button>
  )
}
