// Imagenes
import Logo from '../assets/LoginAssets/Logo.svg';
import OrangeCow from '../assets/LoginAssets/OrangeCow.png';

// React
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Librerías
import axios from 'axios';
import Swal from 'sweetalert2'

// Componente
export const Login = () => {

    // Estado Inicial del "loginState"
    const loginUser = {
        username: '',
        password: ''
    }

    // Inicializamos el "navegador" (router)
    const navigate = useNavigate();
    
    // Manejo de estado del "loginState"
    const [loginState, setLoginState] = useState(loginUser);

    // Obtenemos los valores de los input del Login
    const onInputChange = ({target}) => {
        const { name, value } = target;
        setLoginState({
            ...loginState,
            [name]: value,
        });
    }
    
    // Obtenemos los valores de los atributos del "loginState"
    const {username, password} = loginState

    // Función que me permite setear los input del "Login"
    const resetLoginState = () => {
        setLoginState(loginUser)
    }

    // Enviamos los valores del "loginState" a la API para validarlos
    const onSubmitForm = (e) => {
        e.preventDefault()
        axios.post('https://exps-mvc-api.vercel.app/api/login', {
            username: username,
            password: password
        }, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            }
        })
        .then((response) => {
            const user = response.data[0].name;
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: '¡Bienvenid@ ' + user + '!',
                showConfirmButton: false,
                timer: 3000
            })
            navigate('/home', {
                state: {
                    logged: true,
                    type: response.data[0].type,
                    userName: user
                }
            })
        })
        .catch((error) => {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: '¡Usuario sin autorización!',
                showConfirmButton: false,
                timer: 3000
              })
        });
        resetLoginState()
    }

    return (
        <>
            <div className="bg-white flex justify-center items-center h-screen">
                <div className="fixed inset-0 overflow-hidden blur-[1px] bg-cover bg-center h-screen">
                    <img className="w-screen h-screen bg-contain opacity-90 object-cover object-center" src={OrangeCow} alt="Organe Cow"/>
                </div>
                <div className="flex justify-items-center justify-center absolute">
                    <div className="bg-white flex flex-col justify-center items-center rounded-md shadow-2xl">
                        <div className="px-5 pb-3 pt-6">
                            <img src={Logo} alt="Logo"/>
                        </div>
                        <div className="px-5 py-1 text-orange-950">
                            <h1 className="text-2xl font-bold text-center">
                                Iniciar Sesión
                            </h1>
                        </div>
                        <form className="px-10 py-5 flex flex-col justify-items-center w-80">
                            <div className="mb-4">
                                <label htmlFor="username" className="block mb-2 text-sm font-semibold text-gray-900">Usuario</label>
                                <input 
                                    type="text" 
                                    name="username"
                                    className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-md block w-full p-2.5" 
                                    placeholder="user@elremanso.co"
                                    required
                                    value={username}
                                    onChange={onInputChange}></input>
                            </div>
                            <div className="mb-8">
                                <label htmlFor="password" className="block mb-2 text-sm font-semibold text-gray-90">Contraseña</label>
                                <input 
                                    type="password" 
                                    name="password" 
                                    className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-md block w-full p-2.5" 
                                    placeholder="**********" 
                                    required
                                    value={password}
                                    onChange={onInputChange}></input>
                            </div>
                            <button 
                                type="button" 
                                className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-semibold rounded-md text-sm px-5 py-2.5 text-center mr-2 mb-4 w-full"
                                onClick={onSubmitForm}>Ingresar
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}