import { useForm } from 'react-hook-form';
import { solicitarPassword } from '../api/api_Manager';  
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import styled from 'styled-components';

const ContainerRestore = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(to right, #0049D6, #63d8d9);
`;

const RequestPassword = styled.div`
    background: white;
    padding: 80px;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 400px;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
`;

const Header = styled.header`
    text-align: center;
    line-height: 100px;
    margin-top: -100px;
`;

const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
    gap: 10px;
`;

const StyledInput = styled.input`
    width: 90%;
    padding: 10px;
    border: 1px solid ${props => (props.$error ? 'red' : '#ccc')};
    border-radius: 5px;
`;

const ErrorText = styled.span`
    color: red;
    font-size: 12px;
    margin-top: -10px;
`;

const ButtonGroup = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 10px;
    margin-top: 20px;
`;

const StyledButton = styled.button`
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    flex: 1;
    font-weight: bold;
    background-color: #00c5d6;
    color: #ffffff;
    border: none;
    border-radius: 5px;

    &:hover {
        background-color: #2575fc;
    }
`;

const RestorePassword = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            await solicitarPassword(data.usuario, data.correo);
            toast.success('Correo enviado con éxito. Revisa tu bandeja de entrada.');
            reset();
        } catch (error) {
        if (error.response) {
            if (error.response.status == 400) {
                toast.error('Usuario o correo incorrecto.');
            } else {
                toast.error('Error al procesar la solicitud. Inténtelo de nuevo más tarde.');
            }
        } else if (error.request) {
            toast.error('Error al conectar con el servidor.');
        } else {
            toast.error('Credenciales incorrectas. Verifique e intente de nuevo.');
        }
    }
    };

    const handleCancel = () => navigate('/');

    return (
        <ContainerRestore>
            <RequestPassword>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Header>
                        <h1>Recuperar Contraseña</h1>
                    </Header>
                    <hr style={{ border: '1px solid #ccc', marginTop: '-30px', width: 395 }} />
                    <article>
                        <center><h3>Complete los campos para recuperar su acceso</h3></center>
                    </article>
                    <InputGroup>
                        <strong><label htmlFor="username">Usuario</label></strong>
                        <StyledInput
                            type="text"
                            id="username"
                            placeholder="Ingrese su usuario"
                            $error={errors.usuario}
                            {...register("usuario", { required: "El campo usuario es obligatorio" })} // mensaje de correo obligatorio si no lo lllena
                        />
                        {errors.usuario && <ErrorText>{errors.usuario.message}</ErrorText>}
                        
                        <strong><label htmlFor="email">Correo electrónico</label></strong>
                        <StyledInput
                            type="email"
                            placeholder="Ingrese su correo electrónico"
                            $error={errors.correo}
                            {...register("correo", {
                                required: "El campo correo electrónico es obligatorio",
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, //usa la funcion register para aceptar cierto numero de caracteres especiales antes de @ luego asegura q haya un dominio despues del dicho caracter 
                                    message: "El correo electrónico no es válido." // si no cumple con las caracteristicas muestra el mensaje 
                                }
                            })}
                        />
                        {errors.correo && <ErrorText>{errors.correo.message}</ErrorText>} {/*mensaje de errores desplegado si no se cumple con los requisistos u otros factores*/}
                    </InputGroup>
                    <ButtonGroup>
                        <StyledButton type="submit">Enviar correo</StyledButton>
                        <StyledButton type="button" onClick={handleCancel}>Cancelar</StyledButton>
                    </ButtonGroup>
                </form>
                <ToastContainer />
            </RequestPassword>
        </ContainerRestore>
    );
};

export default RestorePassword;
