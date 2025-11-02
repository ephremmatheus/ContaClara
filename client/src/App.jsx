import { BrowserRouter, Routes, Route } from "react-router-dom"
import './App.css'
import { Home } from "./pages/Home"
import Layout from "./pages/Layout"
import Sistema from "./pages/Sistema"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} /> 
      </Routes>
    </BrowserRouter>
  )
}

export default App
