import React, { useState } from 'react';
import { login } from '../api/api_Manager';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../assets/images/logo.png';
import { useForm } from 'react-hook-form';
import { User, Lock } from 'lucide-react'; // Importamos los iconos

// Styled components
const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(to right, #0049d6, #63d8d9);
`;

const LoginBox = styled.div`
  background: rgba(255, 255, 255, 0.85);
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  width: 400px;
  max-width: 90%;
  backdrop-filter: none;
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);
`;


const LogoContainer = styled.div`
  text-align: center;
  margin-bottom: 20px;
  margin-top: -20px;
`;

const Logo = styled.img`
  max-width: 125px;
  height: auto;
`;

const GradientText = styled.h2`
  font-family: 'Playwrite IS', sans-serif;
  font-size: 35px;
  text-align: center;
  background: linear-gradient(90deg, #16368d, #0087d6);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 20px;
  margin-top: -10px;
`;

const Separator = styled.hr`
  border: none;
  height: 2px;
  background-color: #ccc;
  margin: 10px 0 20px;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%; /* Asegura que ocupe todo el ancho */
`;

const InputContainer = styled.div`
  position: relative;
  width: 87%; /* Mismo ancho que el botón */
  display: flex;
  justify-content: center;
`;

const InputIcon = styled.span`
  position: absolute;
  right: 90%;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
`;

const Input = styled.input`
  width: 80%;
  padding: 12px 12px 12px 40px; /* Añadido padding para el icono */
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
`;

const ForgotPasswordLink = styled(Link)`
  display: block;
  text-align: center;
  margin-top: 10px;
  color: #666;
  text-decoration: none;
  font-size: 14px;
  margin-top: 15px;

  &:hover {
    color: #0049d6;
  }
`;

const SubmitButton = styled.button`
  width: 87%;
  padding: 12px;
  border: none;
  border-radius: 5px;
  background-color: #00c5d6;
  color: white;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  margin: 10px auto 0; /* Centrado con margen automático */
  display: block; /* Necesario para que funcione el margen auto */
  transition: background-color 0.3s;

  &:hover {
    background-color: #2575fc;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  width: 87%; /* Mismo ancho que los inputs */
  text-align: left; /* Alinea el texto a la izquierda */
`;

const Message = styled.p`
  color: red;
  margin-top: 10px;
  text-align: center;
`;

const Login = () => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm({ 
    mode: 'onChange',
    reValidateMode: 'onChange'
  });

  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setApiError(null);
    try {
      const result = await login(data.usuario, data.password);
      sessionStorage.setItem('access', result.access);
      sessionStorage.setItem('refresh', result.refresh);
      sessionStorage.setItem('username', result.usuario);
      sessionStorage.setItem('rol', result.rol);
      navigate('/inicio');
    } catch (err) {
      setApiError(err.message);
    }
  };

  return (
    <LoginContainer>
      <LoginBox>
        <LogoContainer>
          <Logo src={logo} alt="Logo" />
        </LogoContainer>
        <GradientText>Bienvenido</GradientText>
        <Separator />
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputGroup>
            <Label htmlFor="username">Usuario</Label>
            <InputContainer>
              <InputIcon>
                <User size={20} /> {/* Icono de usuario */}
              </InputIcon>
              <Input
                type="text"
                id="username"
                placeholder="Ingrese su nombre de usuario"
                {...register('usuario', { 
                  required: 'El campo usuario es obligatorio', 
                  onChange: () => setApiError(null) 
                })}
              />
            </InputContainer>
            {errors.usuario && <Message>{errors.usuario.message}</Message>}
          </InputGroup>
          <InputGroup>
            <Label htmlFor="password">Contraseña</Label>
            <InputContainer>
              <InputIcon>
                <Lock size={20} /> {/* Icono de candado */}
              </InputIcon>
              <Input
                type="password"
                id="password"
                placeholder="Ingrese su contraseña"
                {...register('password', { 
                  required: 'El campo contraseña es obligatorio', 
                  onChange: () => setApiError(null) 
                })}
              />
            </InputContainer>
            <ForgotPasswordLink to="/contraseña">
              ¿Olvidaste tu contraseña?
            </ForgotPasswordLink>
            {errors.password && <Message>{errors.password.message}</Message>}
          </InputGroup>
          <SubmitButton type="submit">Iniciar Sesión</SubmitButton>
          {apiError && <Message>{apiError}</Message>}
        </form>
      </LoginBox>
    </LoginContainer>
  );
};

export default Login;