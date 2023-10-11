// Imagenes
import editarImg from '../assets/HomeAssets/edit.svg';

// React
import { useState, useEffect } from "react";

// Librerías
import axios from 'axios';
import Swal from 'sweetalert2'

// Componentes
import { Welcome } from "./Welcome";

export const Users = (props) => {

    // Estado Inicial del "userForm"
    const userForm = {
        userName: '',
        user: '',
        userPassword: '',
        userType: ''
    }
    
    // Manejo de estado del "formState"
    const [formState, setFormState] = useState(userForm);

    // Obtenemos los valores de los atributos del "formState"
    const { userName, user, userPassword, userType } = formState

    // Función que me permite setear los input del "Form"
    const resetFormState = () => {
        setFormState(userForm)
    }

    // Obtenemos los valores de los input del "Form"
    const onInputChange = ({target}) => {
        const { name, value } = target;
        setFormState({
            ...formState,
            [name]: value,
        });
    }

    // Enviamos los datos del "formState" a la API para validarlos
    const onSubmitForm = (e) => {
        e.preventDefault()
        const verificarCampos = Object.values(formState).every(value  => value !== '')
        if (verificarCampos) {
            axios.post('https://exps-mvc-api.vercel.app/api/users', {
                ...formState
            }, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                }
            })
            .then((response) => {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: '¡Se ha agregado un nuevo usuario!',
                    showConfirmButton: false,
                    timer: 3000
                })
            })
            .catch((error) => {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: '¡Ocurrió un error al agregar el usuario!',
                    showConfirmButton: false,
                    timer: 3000
                })
            });
        } else {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: '¡Los campos no están llenos!',
                showConfirmButton: false,
                timer: 3000
            })
        }
        resetFormState()
    }

    // ---------------- Consultar API de los usuarios ----------------
    const [dataUsers, setDataUsers] = useState([])
    useEffect(() => {
        axios.get('https://exps-mvc-api.vercel.app/api/users')
        .then(res => {
            setDataUsers(res.data)
        })
        .catch(err => {
            console.error('Error al obtener los usuarios: ', err)
        })
    }, [dataUsers]) // Le pasamos el 'dataUsers' como dependencia para que se actualice

    // --------------- Editar datos de los usuarios -----------------
    const [userId, setUserId] = useState(null)
    const onEditUser = (ID) => {
        // Filtramos los datos mediante el id
        const selectedUser = dataUsers.find(user => user.id === ID);
        // Pasamos el id del usuario seleccionado
        setUserId(ID)
        console.log('Información de la fila seleccionada:', selectedUser);
        // Enviamos los datos al campo del formulario 
        setFormState({
            userName: selectedUser.name,
            user: selectedUser.username,
            userPassword: selectedUser.password,
            userType: selectedUser.type
        })
    }

    // ---------------- Actualizar datos en la DB --------------------
    // Cuadro de diálogo de actualización
    const onUpdateUser = (e) => {
        const verificarCampos = Object.values(formState).every(value => value !== '')
        if (verificarCampos) {
            Swal.fire({
                title: '¿Desea actualizar el usuario',
                showCancelButton: true,
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Actualizar',
              }).then((result) => {
                if (result.isConfirmed) {
                    UpdateUser(e)
                } else {
                    resetFormState()
                }
            })
        } else {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: '¡Los campos no tienen información!',
                showConfirmButton: false,
                timer: 3000
            })
        }
    }

    const UpdateUser = (e) => {
        e.preventDefault();
        axios.put('https://exps-mvc-api.vercel.app/api/users', {
            ...formState,
            userId
        }, {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        }
        })
        .then(res => {
            Swal.fire({
            position: 'center',
            icon: 'success',
            title: '¡Datos actualizados con éxito!',
            showConfirmButton: false,
            timer: 3000
            })
        })
        .catch(err => {
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: '¡Ocurrió un error al actualizar los datos!',
            showConfirmButton: false,
            text: `${JSON.parse(JSON.stringify(err)).message}`,
            timer: 3000
            })
        });
        resetFormState()
    }

    // ---------------- Eliminar datos en la DB --------------------
    // Cuadro de diálogo de eliminación
    const onDeleteUser = (e) => {
        const verificarCampos = Object.values(formState).every(value => value !== '')
        if (verificarCampos) {
            Swal.fire({
                title: '¿Desea eliminar el usuario?',
                showCancelButton: true,
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Eliminar',
              }).then((result) => {
                if (result.isConfirmed) {
                    deleteUser(e)
                } else {
                    resetFormState()
                }
            })
        } else {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: '¡Los campos no tienen información!',
                showConfirmButton: false,
                timer: 3000
            })
        }
    }
    
    const deleteUser = (e) => {
        e.preventDefault();
        axios.delete(`https://exps-mvc-api.vercel.app/api/users/${userId}`, {
            headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            }
        })
        .then(res => {
            Swal.fire({
            position: 'center',
            icon: 'success',
            title: '¡Se eliminó el usuario correctamente!',
            showConfirmButton: false,
            timer: 3000
            })
        })
        .catch(err => {
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: '¡Ocurrió un error al eliminar el usuario!',
            showConfirmButton: false,
            timer: 3000
            })
        })
        resetFormState()
    }

    // ---------------- Regresamos a la vista principal --------------------
    const changeView = () => {
        props.setButtonState(<Welcome />)
    }
    
    return (
        <>
            <div className='bg-gray-100 h-screen'>
                <div className="flex items-center">
                    <h1 className="text-4xl text-slate-900 font-bold ml-14 mt-8">Gestionar Usuarios</h1>
                    <div className="flex justify-end items-center ml-[662px]">
                        <button onClick={changeView}>
                            <svg width="31" height="29" viewBox="0 0 61 59" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M23.1277 9.71431C23.6903 10.2675 24.0063 11.0177 24.0063 11.8C24.0063 12.5822 23.6903 13.3324 23.1277 13.8856L16.2467 20.65H33.0096C38.5807 20.65 43.9237 22.8256 47.8631 26.6982C51.8025 30.5708 54.0156 35.8232 54.0156 41.3V47.2C54.0156 47.9823 53.6994 48.7327 53.1367 49.2859C52.5739 49.8392 51.8106 50.15 51.0147 50.15C50.2189 50.15 49.4556 49.8392 48.8928 49.2859C48.33 48.7327 48.0139 47.9823 48.0139 47.2V41.3C48.0139 37.388 46.4331 33.6363 43.6192 30.8701C40.8054 28.104 36.989 26.55 33.0096 26.55H16.2467L23.1277 33.3143C23.4143 33.5864 23.6429 33.912 23.8002 34.2719C23.9575 34.6318 24.0403 35.0189 24.0437 35.4106C24.0472 35.8023 23.9713 36.1907 23.8204 36.5533C23.6695 36.9158 23.4467 37.2452 23.1649 37.5222C22.8832 37.7992 22.5481 38.0182 22.1793 38.1665C21.8105 38.3149 21.4154 38.3895 21.0169 38.3861C20.6185 38.3827 20.2247 38.3013 19.8586 38.1467C19.4925 37.9921 19.1613 37.7674 18.8845 37.4856L6.88105 25.6856C6.31848 25.1324 6.00244 24.3822 6.00244 23.6C6.00244 22.8177 6.31848 22.0675 6.88105 21.5143L18.8845 9.71431C19.4472 9.16127 20.2104 8.85059 21.0061 8.85059C21.8018 8.85059 22.565 9.16127 23.1277 9.71431Z" fill="#3F1406"/>
                            </svg>
                        </button>
                    </div> 
                </div>

                <div className="flex m-8">
                    <div className="w-[40%]">
                        <form className="bg-white p-5 rounded-xl shadow-xl">
                            <div className="grid gap-3 mb-4">
                                <div>
                                    <label htmlFor="userName" className="block mb-2 text-md font-bold text-gray-800">Nombre:</label>
                                    <input 
                                        type="text" 
                                        name="userName" 
                                        className="bg-gray-100 font-semibold text-md border-gray-300 text-gray-600 text-md rounded-xl focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5" 
                                        placeholder="Nombre..."
                                        value={userName}
                                        onChange={onInputChange}
                                        required/>
                                </div>
                                <div>
                                    <label htmlFor="user" className="block mb-2 text-md font-bold text-gray-800">Usuario:</label>
                                    <input 
                                        type="text" 
                                        name="user" 
                                        className="bg-gray-100 font-semibold text-md border-gray-300 text-gray-600 text-md rounded-xl focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5" 
                                        placeholder="Usuario..."
                                        value={user}
                                        onChange={onInputChange} 
                                        required/>
                                </div>
                                <div>
                                    <label htmlFor="userPassword" className="block mb-2 text-md font-bold text-gray-800">Contraseña:</label>
                                    <input 
                                        type="password" 
                                        name="userPassword" 
                                        className="bg-gray-100 font-semibold text-md border-gray-300 text-gray-600 text-md rounded-xl focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5" 
                                        placeholder="*********"
                                        value={userPassword}
                                        onChange={onInputChange} 
                                        required/>
                                </div>  
                                <div>
                                    <label htmlFor="userType" className="block mb-2 text-md font-bold text-gray-800">Tipo de Usuario:</label>
                                    <select 
                                        name="userType" 
                                        className="bg-gray-100 font-semibold text-md border-gray-300 text-gray-600 text-md rounded-xl focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
                                        value={userType}
                                        onChange={onInputChange}
                                        required>
                                        <option value="">Selecciona un tipo...</option>
                                        <option value="Administrativo">Administrativo</option>
                                        <option value="Normal">Normal</option>
                                    </select>
                                </div>
                            </div>
                        </form>
                        <div className="mt-5">
                            <button 
                                type="submit" 
                                className="font-semibold shadow-md focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 rounded-lg text-md px-6 py-3 mr-2 mb-2"
                                onClick={onSubmitForm}>Guardar</button>
                            <button 
                                type="submit" 
                                className="font-semibold shadow-md focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 rounded-lg text-md px-6 py-3 mr-2 mb-2"
                                onClick={onDeleteUser}>Eliminar</button>
                            <button 
                                type="submit" 
                                className="font-semibold shadow-md text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 rounded-lg text-md px-6 py-3 mr-2 mb-2"
                                onClick={onUpdateUser}>Actualizar</button>
                            <button 
                                type="submit" 
                                className="font-semibold shadow-md text-white bg-indigo-500 focus:outline-none hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 rounded-lg text-md px-4 py-3 mr-2 mb-2"
                                onClick={resetFormState}>X</button>
                        </div>
                    </div>
                    <div className="w-[50%] ml-6">
                        <div className="max-h-[460px] overflow-auto shadow-xl rounded-xl">
                            <table className="w-full text-sm text-left text-gray-500 font-semibold">
                                <thead className="text-md text-gray-700 bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Nombre</th>
                                        <th scope="col" className="px-6 py-3">Tipo</th>
                                        <th scope="col" className="px-6 py-3">Editar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {
                                dataUsers.map(user => {
                                    return (
                                        <tr className="bg-white border-b" key={user.id}>
                                            <th scope="row" className="px-6 py-4 text-gray-900 whitespace-nowrap">{user.name}</th>
                                            <td className="px-6 py-4">{user.type}</td>
                                            <td className="px-6 py-4">
                                                <button 
                                                    className="font-semibold shadow-md text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 rounded-lg text-md px-2 py-2 ml-2 mb-1 focus:outline-none"
                                                    onClick={() => onEditUser(user.id)}>
                                                    <img src={editarImg} alt="Editar" className='h-[15px] w-[15px]'/>
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })
                                }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}