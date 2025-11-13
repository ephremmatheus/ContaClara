import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import { Home } from './pages/Home.jsx'
import Cadastro from './pages/Cadastro.jsx'
import Login from './pages/Login.jsx'
import Layout from './pages/Layout.jsx'

{/* CONVIDADO */}
import LayoutConvidado from './pages/LayoutConvidado.jsx'
import Sistema from './pages/Sistema.jsx'
import Prestacao from './pages/Prestacao.jsx'
import Registros from './pages/Registros.jsx'
import PedidosSistema from './pages/PedidosSistema.jsx'

{/* */}
import System from './pages/System.jsx'
import PrestacaoSystem from './pages/PrestacaoSystem.jsx'
import RegistrosSystem from './pages/RegistrosSystem.jsx'
import PedidosSystem from './pages/PedidosSystem.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/cadastro' element={<Cadastro />} />

        {/* Sistema convidado */} 
        <Route path="/sistema" element={<LayoutConvidado />}>
          <Route index element={<Sistema />} />
          <Route path="prestacao" element={<Prestacao />} />
          <Route path="registros" element={<Registros />} />
          <Route path="pedidos" element={<PedidosSistema/>}/>
        </Route>

        <Route path="/system" element={<Layout />}>
          <Route index element={<System />} />
          <Route path="prestacao" element={<PrestacaoSystem />} />
          <Route path="registros" element={<RegistrosSystem />} />
          <Route path="pedidos" element={<PedidosSystem/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
