// React
import { useState, useEffect } from "react";

// Componentes
import { Welcome } from "./Welcome";

// Librerías
import axios from 'axios';

// Componente
export const Production = (props) => {

    // Estado Inicial del "productForm"
    const productForm = {
        cowName: '',
        monthProduct: '',
        milk: ''
    }

    // Manejo de estado del "formState"
    const [formState, setFormState] = useState(productForm);

    // Obtenemos los valores de los atributos del "formState"
    const { cowName, monthProduct, milk } = formState

    // Función que nos permite setear los input del "formState"
    const resetFormState = () => {
        setFormState(productForm)
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
            axios.post('https://exps-mvc-api.vercel.app/api/product', {
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
                    title: '¡Se ha agregado más leche a la granja 🐮!',
                    showConfirmButton: false,
                    timer: 3000
                })
            })
            .catch((error) => {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: '¡Ocurrió un error al agregar la leche a la granja!',
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

    // Definimos los estados para los filtros de la Producción Lechera
    const [productionData, setProductionData] = useState([]);
    const [productionSelected, setProductionSelected] = useState('');

    // Guardamos la Producción Lechera que seleccionamos
    const handleSelectProduction = (event) => {
        setProductionSelected(event.target.value);
    }

    // Traemos los datos de la Producción Lechera mediante la API en Supabase
    useEffect(() => {
        axios.get('https://exps-mvc-api.vercel.app/api/production')
            .then(response => {
                setProductionData(response.data);
            })
            .catch(error => {
                console.error('Error al obtener los resultados:', error);
            });
    }, [handleSelectProduction]);

    // Traemos los datos de la Producción Lechera que seleccionemos en el "formState"
    const handleProductData = (event) => {
        event.preventDefault();
        console.log(productionData)
        // Filtramos los datos de la Producción Lechera seleccionada
        const productMilk = productionData.find(data => data.vacas.cow_name == productionSelected)
        // Enviamos los datos a los input correspondientes
        setFormState({
            cowName: productMilk.vacas.cow_name,
            monthProduct: productMilk.meses.id,
            milk: productMilk.production
        })
        // Limpiamos el campo de selección
        setProductionSelected('')
    }

    // Definimos los estados para los filtros de las vacas
    const [cowData, setCowData] = useState([]);

    // Nota: Se es necesario realizar una petición a la API de las vacas, en vista de que las vacas
    // que no tienen producción lechera no pueden editarse, y por lo tanto se hace necesario comparar
    // las vacas con aquellas que no tienen producción lechera
    // Traemos los datos de las vacas mediante la API en Supabase
    useEffect(() => {
        axios.get('https://exps-mvc-api.vercel.app/api/cows')
            .then(response => {
                // Filtramos las vacas que aún no se han agregado a Producción Lechera
                let data = response.data;
                let filterData = data.filter(cow => !productionData.some(product => product.vacas.cow_name === cow.cow_name))
                setCowData(filterData);
            })
            .catch(error => {
                console.error('Error al obtener los resultados:', error);
            });
    }, [handleSelectProduction]);
    
    // Guardamos el nombre de la vaca que seleccionamos
    // const handleSelectCow = (event) => {
    //     setFormState({
    //         cowName: event.target.value
    //     })
    // }

    // ---------------- Regresamos a la vista principal --------------------
    const changeView = () => {
        props.setButtonState(<Welcome />)
    }

    return (
        <>
            <div className="bg-gray-100 h-screen">
                <div className="flex items-center">
                    <h1 className="text-4xl text-slate-900 font-bold ml-14 mt-8">Producción Lechera</h1>
                    <div className="flex justify-end items-center ml-[600px]">
                        <button onClick={changeView}>
                            <svg width="31" height="29" viewBox="0 0 61 59" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M23.1277 9.71431C23.6903 10.2675 24.0063 11.0177 24.0063 11.8C24.0063 12.5822 23.6903 13.3324 23.1277 13.8856L16.2467 20.65H33.0096C38.5807 20.65 43.9237 22.8256 47.8631 26.6982C51.8025 30.5708 54.0156 35.8232 54.0156 41.3V47.2C54.0156 47.9823 53.6994 48.7327 53.1367 49.2859C52.5739 49.8392 51.8106 50.15 51.0147 50.15C50.2189 50.15 49.4556 49.8392 48.8928 49.2859C48.33 48.7327 48.0139 47.9823 48.0139 47.2V41.3C48.0139 37.388 46.4331 33.6363 43.6192 30.8701C40.8054 28.104 36.989 26.55 33.0096 26.55H16.2467L23.1277 33.3143C23.4143 33.5864 23.6429 33.912 23.8002 34.2719C23.9575 34.6318 24.0403 35.0189 24.0437 35.4106C24.0472 35.8023 23.9713 36.1907 23.8204 36.5533C23.6695 36.9158 23.4467 37.2452 23.1649 37.5222C22.8832 37.7992 22.5481 38.0182 22.1793 38.1665C21.8105 38.3149 21.4154 38.3895 21.0169 38.3861C20.6185 38.3827 20.2247 38.3013 19.8586 38.1467C19.4925 37.9921 19.1613 37.7674 18.8845 37.4856L6.88105 25.6856C6.31848 25.1324 6.00244 24.3822 6.00244 23.6C6.00244 22.8177 6.31848 22.0675 6.88105 21.5143L18.8845 9.71431C19.4472 9.16127 20.2104 8.85059 21.0061 8.85059C21.8018 8.85059 22.565 9.16127 23.1277 9.71431Z" fill="#3F1406"/>
                            </svg>
                        </button>
                    </div> 
                </div>
                <div className="ml-14 mt-5 flex space-x-4">
                    <button className="w-28 p-2 text-black text-md shadow-md bg-gray-200 font-semibold border-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-orange-500 focus:bg-orange-500 focus:text-white">Formulario</button>
                    <button className="w-28 p-2 text-black text-md shadow-md bg-gray-200  font-semibold border-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-orange-500 focus:bg-orange-500 focus:text-white">Gráfico</button>
                </div>
                <form className="ml-9 flex items-center" onSubmit={handleProductData}>
                    <select 
                        name="cows"
                        className="bg-gray-50 border border-gray-300 text-gray-600 text-md font-semibold rounded-lg focus:ring-blue-500 focus:border-blue-500 m-5 pr-[330px] pl-5 p-2.5"
                        value={productionSelected}
                        onChange={handleSelectProduction}>
                        <option value="">Editar Producción Lechera...</option>
                        {productionData.map(product => (
                        <option key={product.id}>{product.vacas.cow_name}</option>
                        ))}
                    </select>
                    <button type="submit" className="text-white text-md shadow-md bg-blue-700 font-semibold border-blue-700 rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 px-10 py-3 mb-1 mr-2 ml-2">Enviar</button>
                </form>
                
                <div className="flex">
                    <div className="h-auto bg-orange-400 rounded-xl shadow-xl ml-14  flex">
                        <div className="p-8 flex flex-col">
                            <form className="w-[438px]">
                                <div>
                                    <label htmlFor="cowName" className="block mb-2 text-md font-bold">Vaca</label>
                                    <select 
                                        name="elementos" 
                                        className="bg-gray-100 font-semibold text-md border-gray-300 text-gray-600 text-md rounded-xl focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
                                        value={cowName}
                                        onChange={handleSelectProduction}
                                        required>
                                    <option value="">Selecciona una vaca...</option>
                                    {productionData.map(product => (
                                        <option key={product.vacas.id}>{product.vacas.cow_name}</option>
                                    ))}
                                    </select>
                                </div>
                                <div className="mt-3">
                                    <label htmlFor="monthProduct" className="block mb-2 text-md font-bold">Mes de producción:</label>
                                    <select
                                        name="monthProduct" 
                                        className="bg-gray-100 font-semibold text-md border-gray-300 text-gray-600 text-md rounded-xl focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
                                        value={monthProduct}
                                        onChange={onInputChange}
                                        required>
                                        <option value="">Selecciona un mes...</option>
                                        <option value="1">Enero</option>
                                        <option value="2">Febrero</option>
                                        <option value="3">Marzo</option>
                                        <option value="4">Abril</option>
                                        <option value="5">Mayo</option>
                                        <option value="6">Junio</option>
                                        <option value="7">Julio</option>
                                        <option value="8">Agosto</option>
                                        <option value="9">Septiembre</option>
                                        <option value="10">Octubre</option>
                                        <option value="11">Noviembre</option>
                                        <option value="12">Diciembre</option>
                                    </select>
                                </div>
                                <div className="mt-3 mb-3">
                                    <label htmlFor="milk" className="block mb-2 text-md font-bold">Litros de Leche</label>
                                    <input 
                                        type="number" 
                                        name="milk" 
                                        className="font-semibold text-md border-gray-300 text-gray-600 text-md rounded-xl focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5" 
                                        placeholder="Litros"
                                        value={milk}
                                        onChange={onInputChange}
                                        required />
                                </div> 
                            </form>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center px-5 gap-3 ml-3">
                        <button 
                            type="submit" 
                            className="font-semibold shadow-md focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 rounded-lg text-md px-6 py-3 mr-2 mb-2"
                            >Guardar</button>
                        <button 
                            type="submit" 
                            className="font-semibold shadow-md focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 rounded-lg text-md px-6 py-3 mr-2 mb-2"
                            >Eliminar</button>
                        <button 
                            type="submit" 
                            className="font-semibold shadow-md text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 rounded-lg text-md px-6 py-3 mr-2 mb-2"
                            >Actualizar</button>
                        <button 
                            type="submit" 
                            className="font-semibold shadow-md text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 rounded-lg text-md px-6 py-3 mr-2 mb-2"
                            onClick={resetFormState}
                            >Limpiar</button>
                    </div>
                </div>
            </div>
        </>
    )
}
