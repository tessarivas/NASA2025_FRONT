import Globe from '../components/Globe';
import Welcome from '../components/Welcome';
import Particles from '../components/Particles2';
import SearchBar from '../components/SearchBar';
import SignInForm from '../components/auth/SignInForm';
import SignUpForm from '../components/auth/SignUpForm';
import FadeContent from '../components/FadeContent'
import { useCurrentUser } from '../hooks/useCurrentUser';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function HomePage() {
    const { user, isAuthenticated } = useCurrentUser();
    const navigate = useNavigate();
    const [currentView, setCurrentView] = useState('welcome'); // 'welcome', 'signin', 'signup'

    // Función para obtener el primer nombre
    const getFirstName = (user) => {
        if (!user) return '';

        // Si hay un campo 'name', tomar la primera palabra
        if (user.name) {
            return user.name.split(' ')[0];
        }

        // Si solo hay username, usar eso
        if (user.username) {
            return user.username;
        }

        return 'Usuario';
    };

    const handleSearch = (query) => {
        if (!query.trim()) return;
        
        // Si el usuario está autenticado, ir al dashboard con el mensaje
        if (isAuthenticated) {
            // Limpiar el historical_id para crear un nuevo chat
            localStorage.removeItem('historical_id');
            
            navigate('/dashboard', {
                state: { newMessage: query.trim() }
            });
        } else {
            // Si no está autenticado, mostrar el formulario de sign in
            setCurrentView('signin');
        }
    };

    const handleSignInClick = () => {
        setCurrentView('signin');
    };

    const handleSignUpClick = () => {
        setCurrentView('signup');
    };

    const handleBackToWelcome = () => {
        setCurrentView('welcome');
    };

    const handleLogout = () => {
        // Clear authentication data manually without redirect
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setCurrentView('welcome');
        // Force re-render by triggering storage event
        window.dispatchEvent(new Event('storage'));
    };

    return (
        <div className='bg-gradient-to-b from-[#030409] to-[#091437] relative'
        >
            {/* Header Navigation */}
            <nav className="absolute top-0 left-0 right-0 z-10 p-6">
                <div className="flex justify-between items-center">
                    {/* Logo o título */}
                    <button 
                        onClick={handleBackToWelcome}
                        className="text-white font-bold text-xl select-none hover:text-blue transition-colors duration-300 cursor-pointer" 
                        style={{ fontFamily: 'Zen Dots' }}
                    >
                        NASA Explorer
                    </button>

                    {/* Navigation Links */}
                    <div className="flex items-center gap-4">
                        {isAuthenticated ? (
                            <>
                                {/* Log Out button */}
                                <button
                                    onClick={handleLogout}
                                    className="text-white/70 cursor-pointer hover:text-white transition-colors duration-300 text-sm"
                                    style={{ fontFamily: 'Space Mono, monospace' }}
                                >
                                    Log Out
                                </button>

                                {/* Dashboard */}
                                <Link
                                    to="/dashboard"
                                    className="bg-royal-blue/20 hover:bg-royal-blue/30 text-blue border border-royal-blue/30 transition-all duration-300 text-sm backdrop-blur-sm px-4 py-2 rounded-lg"
                                    style={{ fontFamily: 'Space Mono, monospace' }}
                                >
                                    Dashboard
                                </Link>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={handleSignInClick}
                                    className="text-blue hover:text-orange transition-colors duration-300 text-sm cursor-pointer"
                                    style={{ fontFamily: 'Space Mono, monospace' }}
                                >
                                    Sign In
                                </button>
                                <button
                                    onClick={handleSignUpClick}
                                    className="bg-royal-blue/20 hover:bg-royal-blue/30 text-blue border border-royal-blue/30 hover:border-blue/50 cursor-pointer px-4 py-2 rounded-lg transition-all duration-300 text-sm backdrop-blur-sm"
                                    style={{ fontFamily: 'Space Mono, monospace' }}
                                >
                                    Sign Up
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </nav>

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
                <Particles />
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
                        {currentView === 'welcome' && (
                            <FadeContent>
                                <Welcome
                                    name={isAuthenticated ? getFirstName(user) : "Explorer"}
                                />
                            </FadeContent>
                        )}
                        {currentView === 'signin' && (
                            <FadeContent>
                                <SignInForm
                                    onToggleToSignUp={() => setCurrentView('signup')}
                                    onCancel={handleBackToWelcome}
                                />
                            </FadeContent>
                        )}
                        {currentView === 'signup' && (
                            <FadeContent>
                                <SignUpForm
                                    onToggleToSignIn={() => setCurrentView('signin')}
                                    onCancel={handleBackToWelcome}
                                />
                            </FadeContent>

                        )}
                    </div>

                    {/* Componente de búsqueda - solo en vista welcome */}
                    {currentView === 'welcome' && (
                        <>
                            <FadeContent
                            className='w-full'>
                                <SearchBar
                                    onSearch={handleSearch}
                                    placeholder="Ask another question..."
                                />
                            </FadeContent>
                            {/* Call to action sutil */}
                            {isAuthenticated && (
                                <div className="text-center -mt-4">
                                    <Link
                                        to="/dashboard"
                                        className="inline-flex items-center text-blue hover:text-orange transition-colors duration-300 text-sm group"
                                        style={{ fontFamily: 'Space Mono, monospace' }}
                                    >
                                        Go to Dashboard
                                        <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>
                            )}
                        </>
                    )}
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