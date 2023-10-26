// Imagenes
import imagenBienvenida from '../assets/HomeAssets/background-image.png';
import vaca from '../assets/HomeAssets/cow.png';

// Componente Principal
export const Welcome = () => {
  // Retornamos la vista de Bienvenida
  return (
    <div className='flex flex-col gap-11'>
        <div>
            <img src={imagenBienvenida} alt="Imagen Bienvenida" className="w-full h-[450px]"/>
        </div>
            <div className="flex justify-center justify-items-center items-center">
            <img src={vaca} alt="Vaca" className="mr-2"/>
            <h1 className="text-4xl font-bold text-gray-800">Producción Lechera: 45.6L</h1>
        </div>
    </div>
  )
}