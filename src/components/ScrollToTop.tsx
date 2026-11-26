import { useEffect } from 'react'
import { useLocation } from 'react-router'

export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    const sectionToShow = hash ? document.getElementById(hash.slice(1)) : null

    if (sectionToShow) {
      sectionToShow.scrollIntoView({ behavior: 'instant' })
      return
    }

    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash])

  return null
}