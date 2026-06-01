import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

// Migrate legacy hash-based URLs (e.g. /#grammar → /grammar)
;(function migrateHash() {
  const hash = window.location.hash.slice(1)
  const validSlugs = new Set(['home','dashboard','words','sentences','script','cards','quiz','review','cloze','rush','scramble','classifier-drop','mistake-hunter','passages','months','grammar','pronunciation','classifiers','reading','register','fonts','playbooks','about','culture','idioms','festivals','food','numbers','clusters'])
  if (hash && validSlugs.has(hash) && window.location.pathname === '/') {
    window.history.replaceState(null, '', `/${hash}`)
  }
})()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
