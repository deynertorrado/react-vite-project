// Imagenes
import Logo from '../assets/LoginAssets/Logo.svg';
import OrangeCow from '../assets/LoginAssets/OrangeCow.png';

// Importaciones de React
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export const Logout = () => {
    // ------------------------ Autenticación ------------------------
    // Recibimos el atributo de "state" y usamos "navigate"
    // Estos nos permiten validar si el usuario ha estado en el sistema con anterioridad
    const { state } = useLocation();
    const navigate = useNavigate();
    let userName = (state == null) ? 'Unknow' : state.userName;

    // Hacemos uso de useEffect para validar al autenticación del usuario
    useEffect(() => {
        if (state == null) {
        // En caso de que el usuario no esté autenticado lo redirigimos al Login
        navigate('/');
        }
    }, [true]);

    // Este método nos retorna al "Login"
    const onLogin = () => {
        navigate('/');
    }

    return (
        <>
        <div className="bg-white flex justify-center items-center h-screen">
            <div className="fixed inset-0 overflow-hidden blur-[1px] bg-cover bg-center h-screen">
                <img className="w-screen h-screen bg-contain opacity-90 object-cover object-center" src={OrangeCow} alt="Organe Cow"/>
            </div>
            <div className="flex justify-items-center justify-center absolute">
                <div className="bg-white flex flex-col justify-center items-center rounded-md shadow-2xl">
                    <div className="p-3 mt-4">
                        <img src={Logo} alt="Logo"/>
                    </div>
                    <div className="px-5 py-1 text-orange-950 flex flex-col justify-center w-full">
                        <h1 className="text-xl font-semibold text-center">
                            Gracias por haber visitado El Remanso
                        </h1>
                        <p className='text-center italic text-gray-800 font-semibold'>@{userName}</p>
                    </div>
                    <button 
                        type="button" 
                        className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-semibold rounded-md text-md px-5 py-2.5 text-center mb-6 mt-2"
                        onClick={onLogin}>Ir al Login
                    </button>
                </div>
            </div>
        </div>
        </>
    )
}
