import React, { useState } from 'react';
import { login } from '../api/api_Manager'; // Importa la función login
import { useNavigate, Link } from 'react-router-dom'; // Importa Link para navegación
import styled from 'styled-components';
import logo from '../assets/images/logo.png';
import { useForm } from 'react-hook-form'; // Importar useForm


//Styled components aplicados cada funcion es un componente de css
const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(to right, #0049d6, #63d8d9);
`;

const LoginBox = styled.div`
  display: flex;
  background-color: white;
  padding: 0;
  border-radius: 105px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 800px;
  height: 490px;
`;

const LeftSection = styled.div`
  flex: 1;
  border-radius: 7px;
  background-color: white;
  padding: 60px;
`;

const LogoContainer = styled.div`
  text-align: center;
  justify-content: center;
  margin-bottom: -26px;
  margin-top: -30px;
`;

const Logo = styled.img`
  max-width: 127px;
  height: auto;
`;

const GradientText = styled.h2`
  font-family: 'Playwrite IS', sans-serif;
  font-size: 29px;
  text-align: center;
  background: linear-gradient(90deg, #16368d, #0087d6);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Separator = styled.hr`
  border: none;
  height: 2px;
  background-color: #ccc;
  margin: 10px 0;
`;

const RightSection = styled.div`
  flex: 1;
  border-radius: 7px;
  background-color: #eeedfc;
  padding: 40px;
`;

const InputGroup = styled.div`
  margin-bottom: 17px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
`;

const Input = styled.input`
  width: 90%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const ForgotPasswordLink = styled(Link)`
  text-align: center;
  display: block;
  margin-top: 24px;
  margin-bottom: 19px;
`;

const SubmitButton = styled.button`
  font-weight: bold;
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #00c5d6;
  color: #fff;
  cursor: pointer;

  &:hover {
    background-color: #2575fc;
  }
`;

const Message = styled.p`
  color: red;
`;

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm(); // Usar useForm y registrar los campos, se inicializa y desecstructura para usar register y los demas
  const [error, setError] = useState(null);
  const navigate = useNavigate(); //se inicializa navigate

  const onSubmit = async (data) => {
    try {
      const result = await login(data.usuario, data.password); // Llama a la función login
      console.log('Tokens:', result); //imprime los tokens en consola / NOTA: QUITAR EN PRODUCCION
      // Almacena los tokens en sessionStorage
      sessionStorage.setItem('access', result.access);
      sessionStorage.setItem('refresh', result.refresh);

      sessionStorage.setItem('username', data.usuario); // almacena el nombre de usuario en sessionStorage

      // Navega a la página de inicio
      navigate('/inicio');
    } catch (err) {
      console.error('Error:', err);
      setError(err.message); // Muestra el mensaje de error
    }
  };

  return (
    <LoginContainer>
      <LoginBox>
        <LeftSection>
          <LogoContainer>
            <Logo src={logo} alt="Logo" />
          </LogoContainer>
          <GradientText>Iniciar Sesión</GradientText>
          <Separator />
          <form onSubmit={handleSubmit(onSubmit)}>
            <InputGroup>
              <Label htmlFor="username">Usuario</Label>
              <Input
                type="text"
                id="username"
                placeholder="Ingrese su nombre de usuario"
                {...register('usuario', { required: 'El campo usuario es obligatorio' })} //validacion para llenar campos obligatorios
              />
              {errors.usuario && <Message>{errors.usuario.message}</Message>} {/*imprimimos el mensaje de error si hay*/}
            </InputGroup>
            <InputGroup>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                type="password"
                id="password"
                placeholder="Ingrese su contraseña"
                {...register('password', { required: 'El campo contraseña es obligatorio' })}
              />
              {errors.password && <Message>{errors.password.message}</Message>}
              <ForgotPasswordLink to="/contraseña">¿Olvidaste tu contraseña?</ForgotPasswordLink>
            </InputGroup>
            <SubmitButton type="submit">Iniciar Sesión</SubmitButton>
          </form>
          {error && <Message>{error}</Message>} {/* Muestra errores si existen */}
        </LeftSection>
        <RightSection />
      </LoginBox>
    </LoginContainer>
  );
};

export default Login;
