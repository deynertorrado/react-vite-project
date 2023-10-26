// Imagenes
import Salir from '../assets/HomeAssets/angulo-doble-derecha.svg';
import Usuarios from '../assets/HomeAssets/usuarios.svg';
import Vacas from '../assets/HomeAssets/comprobacion-de-lista.svg';
import Produccion from '../assets/HomeAssets/grafico-histograma.svg';
import Gestionar from '../assets/HomeAssets/comprobacion-de-la-lista-del-portapapeles.svg';
import Logo from '../assets/HomeAssets/Logo.svg';

// Importaciones de React
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Importación de Componentes
import { Welcome } from '../components/Welcome';
import { Manage } from '../components/Manage';
import { Users } from '../components/Users';
import { Production } from '../components/Production';

// Componente Principal
export const Home = () => {

  // ------------------------ Autenticación ------------------------
  // Recibimos los atributos de "state" y usamos "navigate"
  // Estos nos permiten validar si el usuario ha iniciado sesión correctamente
  const navigate = useNavigate();
  const { state } = useLocation();
  let userType = (state == null) ? 'Unknow' : state.userType;
  let userName = (state == null) ? 'Unknow' : state.userName;

  // Hacemos uso de useEffect para validar al autenticación del usuario
  useEffect(() => {
    if (state == null) {
      // En caso de que el usuario no esté autenticado lo redirigimos al Login
      navigate('/');
    }
  }, [true]);

  // -------------------- Cambio de Vistas --------------------
  // Hacemos uso del useState para ir cambiando entre componentes de "Pages"
  const [buttonState, setButtonState] = useState(<Welcome/>)

  // Método para cambiar la vista del "Home" dependiendo del botón en el que se haga click
  const handleButtonClick = (component) => {
    setButtonState(component);
  };

  // Método para salir del sistema
  const onLogout = () => {
    navigate('/logout', {
      state: {
        userName: userName
      }
    });
  }

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
                  // Dependiendo del tipo de usuario ocultamos algunos accesos para gestionar la información
                  (userType == 'Administrativo') ?
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
                    <button 
                      className="flex items-center py-2 pr-[142px] pl-[20px] text-white rounded-xl group bg-amber-950 hover:bg-orange-700 transition-all duration-75"
                      onClick={() => handleButtonClick(<Production setButtonState={setButtonState}/>)}>
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
                    <button 
                        className="flex items-center justify-center p-2 pr-[180px] pl-[20px] text-amber-950 rounded-xl group hover:bg-slate-300 transition-all duration-75"
                        onClick={onLogout}>
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