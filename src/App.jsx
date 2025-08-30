import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import RestorePassword from './pages/login/restorePassword';
import { Inicio } from './pages/home';
import Login from './pages/Login/login';
import { createGlobalStyle } from 'styled-components';
import Usuarios from './pages/Usuarios/usuarios';
import Administrar from './pages/Administrar/administrar';
import ResetPassword from './pages/Login/resetPassword';
import Sucursales from './pages/Sucursales/sucursales';
import Revisiones from './pages/Solicitudes/revisiones';
import FormView from './pages/Forms/forms';
import { AnimatePresence } from 'framer-motion'; 
import '@fontsource-variable/inter';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Estilos globales
const GlobalStyle = createGlobalStyle`
  body, html {
    margin: 0;
    padding: 0;
    width: 100%;    
    height: 100%;
    font-family: 'Inter Variable', Helvetica, Arial, sans-serif;
    font-size: 12px;
    scroll-behavior: smooth;

    translate: no;

    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 3px;
    }
  }
`;


// Función para rutas protegidas
function ProtectedRoute({ children }) {
  const token = sessionStorage.getItem('access');
  return token ? children : <Navigate to="/" />;
}

function AppRoutes() {
  const location = useLocation(); 

  return (
    <AnimatePresence mode="wait"> {/* para habilitar animaciones de salida*/}
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Login />} />
        <Route path="/contraseña" element={<RestorePassword />} />
        <Route path="/inicio" element={<ProtectedRoute><Inicio /></ProtectedRoute>} />
        <Route path="/usuarios" element={<ProtectedRoute><Usuarios /></ProtectedRoute>} />
        <Route path="/sucursales" element={<ProtectedRoute><Sucursales /></ProtectedRoute>} />
        <Route path="/reset" element={<ProtectedRoute><ResetPassword /></ProtectedRoute>} />
        <Route path="/administrar" element={<ProtectedRoute><Administrar /></ProtectedRoute>} />
        <Route path="/revisiones" element={<ProtectedRoute><Revisiones /></ProtectedRoute>} />
        <Route path="/forms" element={<ProtectedRoute><FormView /></ProtectedRoute>} />
      </Routes>
    </AnimatePresence>
  );
}
// <Route path="/reset" element={<ProtectedRoute><ResetPassword /></ProtectedRoute>} /> esta ruta toca sacarla 
// de el protected route ya que si cuenta con proteccion de tokens (si no tiene tokens no lo deja ingresar)
// pero los tokens son distintos a los de acces y refresh hacer otro ProtectedRoute pero especial para los tokens de la ruta reset password 
function App() {
  return (
    <>
      <GlobalStyle />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </>
  );
}

export default App;
