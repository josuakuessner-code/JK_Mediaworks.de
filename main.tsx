import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/kanit/latin-300.css'
import '@fontsource/kanit/latin-400.css'
import '@fontsource/kanit/latin-500.css'
import '@fontsource/kanit/latin-700.css'
import '@fontsource/kanit/latin-900.css'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
