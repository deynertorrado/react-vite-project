// React
import { useState, useEffect } from "react";

// Librerías
import axios from 'axios';
import Swal from 'sweetalert2'

// Componentes
import { Welcome } from "./Welcome";

// Componente
export const Manage = (props) => {

    // Estado Inicial del "cowForm"
    const cowForm = {
        cowCode: '',
        cowName: '',
        cowBreed: '',
        cowDate: '',
        cowWeight: '',
        cowChilds: '',
    }
    
    // Manejo de estado del "formState"
    const [formState, setFormState] = useState(cowForm);

    // Obtenemos los valores de los atributos del "formState"
    const { cowCode, cowName, cowBreed, cowDate, cowWeight, cowChilds } = formState

    // Función que me permite setear los input del "Form"
    const resetFormState = () => {
        setFormState(cowForm)
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
            axios.post('https://exps-mvc-api.vercel.app/api/cows', {
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
                    title: '¡Se ha agregado una vaca al corral!',
                    showConfirmButton: false,
                    timer: 3000
                })
            })
            .catch((error) => {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: '¡Ocurrió un error al agregar la vaca!',
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

    // ---------------- Filtrado de datos en la DB --------------------

    // Definimos los estados para los filtros de las vacas
    const [cowData, setCowData] = useState([]);
    const [cowSelected, setCowSelected] = useState('');

    // Guardamos el identificador de las vacas
    const [cowID, setCowID] = useState(0)

    // Guardamos la vaca que seleccionamos
    const handleSelectCow = (event) => {
        setCowSelected(event.target.value);
    }
    
    // Traemos los datos de la vaca que seleccionemos al "formState"
    const handleCowData = (event) => {
        event.preventDefault();
        // Filtramos los datos de la vaca seleccionada
        const cow = cowData.find(data => data.cow_name === cowSelected);
        // Pasamos el identificador de la vaca correspondiente
        setCowID(cow.id)
        // Enviamos los datos a los input correspondientes
        setFormState({
            cowCode: cow.cow_code,
            cowName: cow.cow_name,
            cowBreed: cow.cow_breed,
            cowDate: cow.cow_date,
            cowWeight: cow.cow_weight,
            cowChilds: cow.cow_childs,
        })
        // Limpiamos el campo de selección
        setCowSelected('')
    }

    // Traemos los datos de las vacas mediante la API en Supabase
    useEffect(() => {
        axios.get('https://exps-mvc-api.vercel.app/api/cows')
            .then(response => {
                setCowData(response.data);
            })
            .catch(error => {
                console.error('Error al obtener los resultados:', error);
            });
    }, [handleSelectCow]);

    // ---------------- Actualizar datos en la DB --------------------

    // Cuadro de diálogo de actualización
    const onUpdateCow = (e) => {
        const verificarCampos = Object.values(formState).every(value => value !== '')
        if (verificarCampos) {
            Swal.fire({
                title: '¿Desea actualizar la vaca?',
                showCancelButton: true,
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Actualizar',
              }).then((result) => {
                if (result.isConfirmed) {
                    UpdateCow(e)
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

    const UpdateCow = (e) => {
        e.preventDefault();
        axios.put('https://exps-mvc-api.vercel.app/api/cows', {
            ...formState,
            cowID
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
    const onDeleteCow = (e) => {
        const verificarCampos = Object.values(formState).every(value => value !== '')
        if (verificarCampos) {
            Swal.fire({
                title: '¿Desea eliminar la vaca?',
                showCancelButton: true,
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Eliminar',
              }).then((result) => {
                if (result.isConfirmed) {
                    deleteCow(e)
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
    
    const deleteCow = (e) => {
        e.preventDefault();
        axios.delete(`https://exps-mvc-api.vercel.app/api/cows/${cowID}`, {
            headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            }
        })
        .then(res => {
            Swal.fire({
            position: 'center',
            icon: 'success',
            title: '¡Se eliminó la vaca correctamente!',
            showConfirmButton: false,
            timer: 3000
            })
        })
        .catch(err => {
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: '¡Ocurrió un error al eliminar la vaca!',
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
            <div className="bg-gray-100 h-screen">
                <div className="flex items-center">
                    <h1 className="text-4xl text-slate-900 font-bold ml-14 mt-8">Gestionar Información</h1>
                    <div className="flex justify-end items-center ml-[600px]">
                        <button onClick={changeView}>
                            <svg width="31" height="29" viewBox="0 0 61 59" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M23.1277 9.71431C23.6903 10.2675 24.0063 11.0177 24.0063 11.8C24.0063 12.5822 23.6903 13.3324 23.1277 13.8856L16.2467 20.65H33.0096C38.5807 20.65 43.9237 22.8256 47.8631 26.6982C51.8025 30.5708 54.0156 35.8232 54.0156 41.3V47.2C54.0156 47.9823 53.6994 48.7327 53.1367 49.2859C52.5739 49.8392 51.8106 50.15 51.0147 50.15C50.2189 50.15 49.4556 49.8392 48.8928 49.2859C48.33 48.7327 48.0139 47.9823 48.0139 47.2V41.3C48.0139 37.388 46.4331 33.6363 43.6192 30.8701C40.8054 28.104 36.989 26.55 33.0096 26.55H16.2467L23.1277 33.3143C23.4143 33.5864 23.6429 33.912 23.8002 34.2719C23.9575 34.6318 24.0403 35.0189 24.0437 35.4106C24.0472 35.8023 23.9713 36.1907 23.8204 36.5533C23.6695 36.9158 23.4467 37.2452 23.1649 37.5222C22.8832 37.7992 22.5481 38.0182 22.1793 38.1665C21.8105 38.3149 21.4154 38.3895 21.0169 38.3861C20.6185 38.3827 20.2247 38.3013 19.8586 38.1467C19.4925 37.9921 19.1613 37.7674 18.8845 37.4856L6.88105 25.6856C6.31848 25.1324 6.00244 24.3822 6.00244 23.6C6.00244 22.8177 6.31848 22.0675 6.88105 21.5143L18.8845 9.71431C19.4472 9.16127 20.2104 8.85059 21.0061 8.85059C21.8018 8.85059 22.565 9.16127 23.1277 9.71431Z" fill="#3F1406"/>
                            </svg>
                        </button>
                    </div> 
                </div>

                <form className="ml-[36px] flex items-center" onSubmit={handleCowData}>
                    <select 
                        name="elementos" 
                        className="bg-gray-50 border border-gray-300 text-gray-600 text-md font-semibold rounded-lg focus:ring-blue-500 focus:border-blue-500 block pl-5 pr-[330px] p-2.5 m-5"
                        value={cowSelected}
                        onChange={handleSelectCow}
                        required>
                    <option value="">Selecciona una vaca...</option>
                    {cowData.map(cowData => (
                        <option key={cowData.id}>{cowData.cow_name}</option>
                    ))}
                    </select>
                    <button type="submit" className="font-semibold shadow-md text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 rounded-lg text-md px-10 py-3 ml-2 mb-1 focus:outline-none">Enviar</button>
                </form>

                <div className="flex">
                    <div className="h-auto bg-orange-400 rounded-xl shadow-xl ml-14 mt-2 flex">
                        <div className="p-8 flex flex-col">
                            <form>
                                <div className="flex gap-8">
                                    <div className="mb-2">
                                        <label htmlFor="cowName" className="block mb-2 text-md font-bold">Nombre de la Vaca:</label>
                                        <input 
                                            type="text" 
                                            name="cowName" 
                                            className="font-semibold text-md border-gray-300 text-gray-600 text-md rounded-xl focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5" 
                                            placeholder="Nombre"
                                            value={cowName}
                                            onChange={onInputChange}
                                            required></input>
                                    </div>
                                    <div className="mb-2">
                                        <label htmlFor="cowCode" className="block mb-2 text-md font-bold">Código de la Vaca:</label>
                                        <input 
                                            type="text" 
                                            name="cowCode" 
                                            className="font-semibold text-md border-gray-300 text-gray-600 text-md rounded-xl focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5" 
                                            placeholder="Código"
                                            value={cowCode}
                                            onChange={onInputChange}
                                            required></input>
                                    </div>
                                </div>
                                <div className="mb-2">
                                    <label htmlFor="cowBreed" className="block mb-2 text-md font-bold">Raza:</label>
                                    <select 
                                        name="cowBreed" 
                                        className="font-semibold text-md bg-white border-gray-300 text-gray-600 text-md rounded-xl focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
                                        value={cowBreed}
                                        onChange={onInputChange} 
                                        required>
                                        <option value="">Selecciona una raza...</option>
                                        <option value="GYR">GYR</option>
                                        <option value="Mestiza">Mestiza</option>
                                        <option value="Carora">Carora</option>
                                        <option value="Guzera">Guzera</option>
                                    </select>
                                </div> 
                                <div className="mb-2">
                                    <label htmlFor="cowDate" className="block mb-2 text-md font-bold">Fecha de Nacimiento:</label>
                                    <input 
                                        type="date" 
                                        name="cowDate" 
                                        className="font-semibold text-md border-gray-300 text-gray-600 text-md rounded-xl focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5" 
                                        placeholder=""
                                        value={cowDate}
                                        onChange={onInputChange} 
                                        required></input>
                                </div>
                                <div className="mb-2">
                                    <div className="flex space-x-8">
                                        <div>
                                            <label htmlFor="cowWeight" className="block mb-2 text-md font-bold">Peso</label>
                                            <input 
                                                type="number" 
                                                name="cowWeight" 
                                                className="font-semibold text-md border-gray-300 text-gray-600 text-md rounded-xl focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5" 
                                                placeholder="Kg"
                                                value={cowWeight}
                                                onChange={onInputChange} 
                                                required></input>
                                        </div>
                                        <div>
                                            <label htmlFor="cowChilds" className="block mb-2 text-md font-bold">Partos</label>
                                            <input 
                                                type="number" 
                                                name="cowChilds" 
                                                className="font-semibold text-md border-gray-300 text-gray-600 text-md rounded-xl focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5" 
                                                placeholder=""
                                                value={cowChilds}
                                                onChange={onInputChange} 
                                                required></input>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center px-5 gap-3 ml-3">
                        <button 
                            type="submit" 
                            className="font-semibold shadow-md focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 rounded-lg text-md px-6 py-3 mr-2 mb-2"
                            onClick={onSubmitForm}>Guardar</button>
                        <button 
                            type="submit" 
                            className="font-semibold shadow-md focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 rounded-lg text-md px-6 py-3 mr-2 mb-2"
                            onClick={onDeleteCow}>Eliminar</button>
                        <button 
                            type="submit" 
                            className="font-semibold shadow-md text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 rounded-lg text-md px-6 py-3 mr-2 mb-2"
                            onClick={onUpdateCow}>Actualizar</button>
                        <button 
                            type="submit" 
                            className="font-semibold shadow-md text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 rounded-lg text-md px-6 py-3 mr-2 mb-2"
                            onClick={resetFormState}>Limpiar</button>
                    </div>
                </div>
            </div>
        </>
    )
}
