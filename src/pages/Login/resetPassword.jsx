//vista para reestablecer la contraseña 
import { useForm } from 'react-hook-form';
import { resetPassword } from '../../api/api_Manager';  
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import styled from 'styled-components';
import { User,Mail, Info, Lock } from 'lucide-react'; 
import { useEffect } from 'react';

const ContainerRestore = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(to right, #0049D6, #63d8d9);
`;

const RequestPassword = styled.div`
    background: rgba(255, 255, 255, 0.85);
    padding: 40px;
    border-radius: 20px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    width: 400px;
    max-width: 90%;
    height: 320px;
    backdrop-filter: none;
    -webkit-backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.3);
`;

const Header = styled.header`
    text-align: center;
    line-height: 100px;
    margin-top: -50px;
`;

const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
    gap: 10px;
    margin-top: 6px;
`;

const InputContainer = styled.div`
    display: flex;
    align-items: center;
    width: 97%;
    border: 1px solid ${props => (props.$error ? 'red' : '#ccc')};
    border-radius: 5px;
    padding-right: 10px;
    background: white;
`;

const StyledInput = styled.input`
    width: 100%;
    padding: 10px;
    border: none;
    outline: none;
    background: transparent;
`;

const IconWrapper = styled.span`
    margin-left: 10px;
    color: #666;
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
    margin-top: 30px;
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

const Title = styled.h1`
    font-size: 24px;
    color: #333;

    @media (max-width: 600px) {
        font-size: 20px;
        color: #444;
        line-height: 2.3; 
        padding-bottom: 20px;
        padding-top: 20px;
    }
`;

const ResetPassword = () => {

    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();//esto dejarlo para cuando el backend pase los tokens por url como parametros y porder obetenrlos 


    useEffect(() => {
        
        const token = localStorage.getItem('resetToken');
        const uid = localStorage.getItem('resetUid');

        console.log("primer token recibido y guardado en el local storage",token)
        console.log("segundo token uid recibido y guardado en el local storage",uid)

        if (!token || !uid)  {
            toast.error('No se encontro informacion de reestablecimiento. Solicite nuevamente. ')
        }
    }, [navigate]);

    const onSubmit = async (data) => {
            //await solicitarPassword(data.usuario, data.corrñleo);
            //toast.success('Correo enviado con éxito. Revisa tu bandeja de entrada.');
            if (data.password !== data.confirmPassword) {
                toast.error('Las contraseñas ingresadas no coinciden.')
                reset();
                return; //cortamos ejecucion 
            }

            try {
                //obtenemos tokens 
                const token = localStorage.getItem('resetToken');
                const uid = localStorage.getItem('resetUid');

                console.log("primer token", typeof(token))

                await resetPassword(uid, token, data.password, data.confirmPassword);

                toast.success('Contraseña reestablecida con exito');

                //limpiamos para no dejar nada en session Storage 
                localStorage.removeItem('resetToken');
                localStorage.removeItem('resetUid');

                navigate('/'); //redirigimos al login 

            } catch (error) {
                if (error.response) {
                    if (error.response.status == 400) {
                        toast.error('Token invalido. Solicite nuevamente.'); //cambiar los mensajes porque no se que arrojaria el backend 
                    } else {
                        toast.error('Error al procesar la solicitud. Inténtelo de nuevo más tarde.');
                    }
                } else {
                    toast.error('Error al conectar con el servidor.');
                }
            }
        };

    const handleCancel = () => {
        localStorage.removeItem('resetToken');
        localStorage.removeItem('resetUid');
        navigate('/')
    };

    return (
        <ContainerRestore>
            <RequestPassword>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Header>
                        <Title>Crea tu nueva contraseña</Title>
                    </Header>
                    <hr style={{ 
                                border: '1px solid #ccc', 
                                marginTop: '-30px', 
                                width: '100%',  
                                marginLeft: '0'  
                            }} />
                                <article style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <Info size={15} />
                                    <h4 style={{ fontWeight: '400', color: '#333' }}>Por seguridad, ingresa tu nueva contraseña dos veces..</h4>
                                </article>
                    <InputGroup>
                        <label htmlFor="password">Nueva Contraseña</label>
                        <InputContainer $error={errors.usuario}>
                            <IconWrapper>
                                <Lock size={18} />
                            </IconWrapper>
                            <StyledInput
                                type="password"
                                id="password"
                                placeholder="********"
                                $error={errors.usuario}
                                {...register("password", { required: "Este campo es obligatorio.",
                                    minLength : {value: 8, message: "Debe contener minimo 8 carcateres"},
                                    pattern : {
                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                                        message : "Debe contener mayúsculas, minúsculas y números"
                                    }
                                })}
                            />
                        </InputContainer>
                        {errors.password && <ErrorText>{errors.password.message}</ErrorText>}
                        
                        <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                        <InputContainer $error={errors.correo}>
                            <IconWrapper>
                                <Lock size={18} />
                            </IconWrapper>
                            <StyledInput
                                type="password"
                                placeholder="********"
                                id = "confirmPassword"
                                $error={errors.correo}
                                {...register("confirmPassword", {
                                    required: "Este campo es obligatorio",
                                })}
                            />
                        </InputContainer>
                        {errors.confirmPassword && <ErrorText>{errors.confirmPassword.message}</ErrorText>}
                    </InputGroup>
                    <ButtonGroup>
                        <StyledButton type="button" onClick={handleCancel}>Cancelar</StyledButton>
                        <StyledButton type="submit">Reestablecer</StyledButton>
                    </ButtonGroup>
                </form>
                <ToastContainer />
            </RequestPassword>
        </ContainerRestore>
    );
};

export default ResetPassword;