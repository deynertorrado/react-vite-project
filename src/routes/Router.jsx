// Importaciones de React
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Importación de Componentes
import { Login } from '../pages/Login'
import { Home } from '../pages/Home'
import { Logout } from '../pages/Logout'

// Componente Principal
export const Router = () => {
  // Aquí establecemos las rutas de acceso del sistema
  return (
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<Login />}/>
            <Route path='/home' element= {<Home />}/>
            <Route path='/logout' element= {<Logout />}/>
        </Routes>
    </BrowserRouter>
  )
}