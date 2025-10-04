import Globe from '../components/Globe';
import Welcome from '../components/Welcome';
import Particles from '../components/Particles2';
import SearchBar from '../components/SearchBar';

export default function HomePage() {
    const handleSearch = (query) => {
        console.log('Searching for:', query);
        // Aquí puedes agregar la lógica de búsqueda
    };
    return (
        <div className='bg-gradient-to-b from-[#030409] to-[#091437] '
        >
            {/* Fondo de partículas para toda la pantalla */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 0,
                opacity: 0.5
            }}>
                <Particles/>
            </div>

            {/* Contenedor de dos columnas */}
            <div style={{
                position: 'relative',
                display: 'flex',
                width: '100%',
                height: '100vh',
                zIndex: 1
            }}>
                {/* Columna izquierda - Para agregar componentes */}
                <div style={{
                    position: 'relative',
                    flex: 1,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '3rem',
                    gap: '2rem',
                    overflow: 'hidden'
                }}>
                    {/* Contenido de la columna izquierda */}
                    <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '600px' }}>
                        <Welcome
                            name="Nombre de usuario"/>  
                    </div>

                    {/* Componente de búsqueda */}
                    <SearchBar 
                        onSearch={handleSearch}
                        placeholder="Ask another question..."
                    />
                </div>

                {/* Columna derecha - Esfera interactiva */}
                <div style={{
                    position: 'relative',
                    flex: 1,
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                }}>
                    {/* Globe encima de las particles */}
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <Globe />
                    </div>
                </div>
            </div>
        </div>
    );
}   