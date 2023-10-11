import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Login } from '../pages/Login'
import { Home } from '../pages/Home'
import { Logout } from '../pages/Logout'

export const Router = () => {
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