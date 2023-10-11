// Imagenes
import Salir from '../assets/HomeAssets/angulo-doble-derecha.svg';
import Usuarios from '../assets/HomeAssets/usuarios.svg';
import Vacas from '../assets/HomeAssets/comprobacion-de-lista.svg';
import Produccion from '../assets/HomeAssets/grafico-histograma.svg';
import Gestionar from '../assets/HomeAssets/comprobacion-de-la-lista-del-portapapeles.svg';
import Logo from '../assets/HomeAssets/Logo.svg';

// React
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Componentes
import { Welcome } from '../components/Welcome';
import { Manage } from '../components/Manage';
import { Users } from '../components/Users';

// Componente
export const Home = () => {

  // Recibimos los atributos "state" y usamos "navegate"
  // Estos nos permiten validar si el usuario ha iniciado sesión correctamente
  const { state } = useLocation();
  const navigate = useNavigate();
  const typeUser = state.type;

  useEffect(() => {
    if (state && state.logged) {
      // El usuario está autenticado, todo está bien
    } else {
      // El usuario no está autenticado, redirigir al Login
      navigate('/');
    }
  }, [state, navigate]);

  // Cambiar ventana del Home
  const [buttonState, setButtonState] = useState(<Welcome/>)

  // Método para cambiar la vista del Home dependiendo del botón
  const handleButtonClick = (component) => {
    setButtonState(component);
  };

  return (
    <>
      <div className="flex">

        {/* Sección del sidebar 20% */}
        <aside className="h-screen w-[20%]" aria-label="Sidebar">
          <div className="h-full px-3 py-4 overflow-y-auto bg-gray-200">
            <div className="flex justify-center mb-5">
              <img src={Logo} alt="Logo" className='h-40 w-40'/>
            </div>
              <ul className="flex flex-col gap-4">
                {
                  (typeUser == 'Administrativo') ?
                <>
                    <li>
                    <button 
                      className="flex items-center py-2 pr-[154px] pl-[20px] text-white rounded-xl group bg-amber-950 hover:bg-orange-700 transition-all duration-75"
                      onClick={() => handleButtonClick(<Manage setButtonState={setButtonState}/>)}>
                      <img src={Gestionar} alt="Salir" className="h-4 w-4 text-amber-950"/>
                      <span className="flex-1 ml-2 whitespace-nowrap font-semibold">Gestionar</span>
                    </button>
                    </li>
                    <li>
                        <button 
                          className="flex items-center py-2 pr-[161px] pl-[20px] text-white rounded-xl group bg-amber-950 hover:bg-orange-700 transition-all duration-75"
                          onClick={() => handleButtonClick(<Users setButtonState={setButtonState}/>)}>
                          <img src={Usuarios} alt="Salir" className="h-4 w-4"/>
                          <span className="flex-1 ml-2 whitespace-nowrap font-semibold">Usuarios</span>
                        </button>
                    </li>
                </> :
                  <li className='ml-16 font-semibold italic'><p>Vista de usuario</p></li>                
                }
                <li>
                    <button className="flex items-center py-2 pr-[142px] pl-[20px] text-white rounded-xl group bg-amber-950 hover:bg-orange-700 transition-all duration-75">
                      <img src={Produccion} alt="Salir" className="h-4 w-4 text-amber-950"/>
                      <span className="flex-1 ml-2 whitespace-nowrap font-semibold">Producción</span>
                    </button>
                </li>
                <li>
                    <button className="flex items-center py-2 pr-[183px] pl-[20px] text-white rounded-xl group bg-amber-950 hover:bg-orange-700 transition-all duration-75">
                      <img src={Vacas} alt="Salir" className="h-4 w-4 text-amber-950"/>
                      <span className="flex-1 ml-2 whitespace-nowrap font-semibold">Vacas</span>
                    </button>
                </li>
                <li>
                    <button className="flex items-center justify-center p-2 pr-[180px] pl-[20px] text-amber-950 rounded-xl group hover:bg-slate-300 transition-all duration-75">
                      <img src={Salir} alt="Salir" className="h-4 w-4"/>
                      <span className="flex-1 ml-2 whitespace-nowrap font-semibold">Salir</span>
                    </button>
                </li>
              </ul>
          </div>
        </aside>

        {/* Sección principal 80% */}
        <div className="h-screen w-[80%]">
          {buttonState}
        </div>
      </div>
    </>
  )
}