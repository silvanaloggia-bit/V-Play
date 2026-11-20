import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import 'bootstrap/dist/css/bootstrap.min.css' 
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles/global.css'
import App from './App'
import { storageService } from './services/storageService';
import { MoviesProvider } from './context/MoviesContext'


storageService.seedInitialData()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
   <MoviesProvider>
    <App />
     </MoviesProvider>
    </BrowserRouter>
  </StrictMode>,
)
