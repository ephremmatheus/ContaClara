import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import { Home } from './pages/Home.jsx'
import Cadastro from './pages/Cadastro.jsx'
import Login from './pages/Login.jsx'
import Layout from './pages/Layout.jsx'
import Sistema from './pages/Sistema.jsx'
import Prestacao from './pages/Prestacao.jsx'
import Registros from './pages/Registros.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/cadastro' element={<Cadastro />} />

        {/* Sistema */}
        <Route path="/sistema" element={<Layout />}>
          <Route index element={<Sistema />} />
          <Route path="prestacao" element={<Prestacao />} />
          <Route path="registros" element={<Registros />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
