import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/kanit/latin-300.css'
import '@fontsource/kanit/latin-400.css'
import '@fontsource/kanit/latin-500.css'
import '@fontsource/kanit/latin-700.css'
import '@fontsource/kanit/latin-900.css'
import './index.css'
import App from './App'

// Veraltete Seite nach einem Update: fehlt ein Baustein, einmal neu laden (nicht in Schleife).
window.addEventListener('vite:preloadError', () => {
  try {
    if (sessionStorage.getItem('reloaded')) return
    sessionStorage.setItem('reloaded', '1')
  } catch {
    return
  }
  window.location.reload()
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
