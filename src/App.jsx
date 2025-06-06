import {BrowserRouter, Routes,Route, Navigate} from 'react-router-dom';
import RestorePassword from './pages/restorePassword';
import {Inicio} from './pages/principal';
import  Login from './pages/login';
import { createGlobalStyle } from 'styled-components';
import Usuarios from './pages/Usuarios/usuarios';
import Administrar from './pages/Administrar/administrar';
import Estadisticas from './pages/estadisticas';
import Sucursales from './pages/Sucursales/sucursales';
import Revisiones from './pages/Solicitudes/revisiones';
import FormView from './pages/Forms/forms';


//estilos globales para la configuracion de las paginas 
const GlobalStyle = createGlobalStyle`
    body, html {
        margin: 0;
        padding: 0;
        width: 100%;    
        height: 100%;
        font-family: Helvetica, Arial, sans-serif;
        font-size: 12px;
              
        /* Scroll suave */
        scroll-behavior: smooth;

        /* Estilos personalizados para scrollbar */
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
`;
    


//Funcion para la proteccion de rutas
function ProtectedRoute({children}) {
  const token = sessionStorage.getItem('access');
  return token ? children : <Navigate to="/" />;
}

function App(){
  return(
  <>
    <GlobalStyle />


    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/contraseña" element={<RestorePassword />} />
      <Route path="/inicio" element={<ProtectedRoute><Inicio /></ProtectedRoute>} />
      <Route path="/usuarios" element={<ProtectedRoute><Usuarios /></ProtectedRoute>} />
      <Route path="/sucursales" element={<ProtectedRoute><Sucursales/></ProtectedRoute>} />
      <Route path="/estadisticas" element={<ProtectedRoute><Estadisticas /></ProtectedRoute>} />
      <Route path="/administrar" element={<ProtectedRoute><Administrar /></ProtectedRoute>} />
      <Route path="/revisiones" element={<ProtectedRoute><Revisiones /></ProtectedRoute>} />
      <Route path="/forms" element={<ProtectedRoute><FormView /></ProtectedRoute>} />
    </Routes>
    </BrowserRouter>
  </>
  );
}


//<Route path="/inicio" element={<ProtectedRoute><Inicio /></ProtectedRoute>} />  ponerlo en inicio para la proteccion de ruta
//<Route path="/inicio" element={<Inicio />} /> ponerlo para evitar la proteccion de ruta 

export default App; 