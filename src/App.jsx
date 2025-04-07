import {BrowserRouter, Routes,Route, Navigate} from 'react-router-dom';
import {Recuperacontrasena} from './pages/recuperaContrasena';
import {Inicio} from './pages/principal';
import  Login from './components/login';
import { createGlobalStyle } from 'styled-components';
import Usuarios from './pages/usuarios';
import Administrar from './pages/administrar';
import Estadisticas from './pages/estadisticas';
import Convenios from './pages/convenios';
import Revisiones from './pages/revisiones';
import Configuracion from './pages/configuracion';


//estilos globales para la configuracion de las paginas 
const GlobalStyle = createGlobalStyle`
    body, html {
        margin: 0;
        padding: 0;
        width: 100%;    
        height: 100%;
        font-family: Helvetica, Arial, sans-serif;
        font-size: 12px;
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
      <Route path="/contraseña" element={<Recuperacontrasena />} />
      <Route path="/inicio" element={<ProtectedRoute><Inicio /></ProtectedRoute>} />
      <Route path="/usuarios" element={<ProtectedRoute><Usuarios /></ProtectedRoute>} />
      <Route path="/convenios" element={<ProtectedRoute><Convenios/></ProtectedRoute>} />
      <Route path="/estadisticas" element={<ProtectedRoute><Estadisticas /></ProtectedRoute>} />
      <Route path="/administrar" element={<ProtectedRoute><Administrar /></ProtectedRoute>} />
      <Route path="/revisiones" element={<ProtectedRoute><Revisiones /></ProtectedRoute>} />
      <Route path="/configuracion" element={<ProtectedRoute><Configuracion /></ProtectedRoute>} />
    </Routes>
    </BrowserRouter>
  </>
  );
}


//<Route path="/inicio" element={<ProtectedRoute><Inicio /></ProtectedRoute>} />  ponerlo en inicio para la proteccion de ruta
//<Route path="/inicio" element={<Inicio />} /> ponerlo para evitar la proteccion de ruta 

export default App; 