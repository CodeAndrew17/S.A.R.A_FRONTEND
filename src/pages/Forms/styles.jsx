import styled from 'styled-components';

const SideAndContent = styled.div`
    display: flex;
    flex-direction: row;
    height: 100vh;
    background: linear-gradient(to bottom right, #e5e7eb, #d1d5db);
`;

const Content = styled.div`
    flex: 1;
    padding: 1.5rem;
    margin-left: 260px; /* compensa el ancho del sidebar */
    overflow-y: auto;
    overflow-x: hidden;
    width: 100%;
    max-width: 100vw;
    box-sizing: border-box;

    @media (max-width: 768px) {
        margin-left: 0; /* en móvil sidebar debería superponerse */
        width: 100%;
    }
`;


const Head = styled.div`
    padding-bottom: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 40px;
    flex-direction: row;
    width: 60%;
    margin-bottom: 1rem;

    @media (max-width: 500px) and (min-width: 300px){
    gap: 20px;
    justify-content: flex-start;
    padding-left: 0;
    padding-right: 0px;
    flex-direction: row;
    width: 100%;
    }

`;

const Body = styled.div`
    padding-left: 40px;
    display: flex;
    flex-direction: row;
    gap: 1.5rem;
    margin-top: 2rem;
    align-items: flex-start;

    @media (max-width: 995px) {
        flex-direction: column;
        padding-left: 50px;
    }

    @media (max-width: 500px) {
        flex-direction: column;
        padding-left: 0px;
    }
`;

const Column = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    flex: 1;
`;

const InfoBlock = styled.div`
    flex: 1 1 300px; 
    padding: 10px 20px;
`;


const InfoLine = styled.p`
    display: flex;
    align-items: center;
    gap: 0.5rem;

    font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 1.3rem;
    font-weight: 500;
    line-height: 1.6;
    color: rgba(33, 37, 41, 0.85);
    margin: 6px 0;
    letter-spacing: 0.2px;
    transition: color 0.2s ease;

    svg {
        flex-shrink: 0;
    }

    &:hover {
        color: rgba(0, 0, 0, 0.95);
    }

    strong {
        font-weight: 600;
        color: rgba(0, 0, 0, 0.9);
    }
`;


const ObservationNote = styled.p`
    font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 1.7rem;
    font-weight: 500;
    font-style: italic;
    color: ${({ important }) => important ? 'rgba(220, 38, 38, 0.9)' : 'rgba(55, 65, 81, 0.75)'};
    background-color: ${({ important }) => important ? 'rgba(254, 226, 226, 0.5)' : 'transparent'};
    padding: ${({ important }) => important ? '6px 10px' : '0'};
    border-left: ${({ important }) => important ? '3px solid rgba(220, 38, 38, 0.8)' : 'none'};
    margin: 4px 0 10px 0;
    border-radius: 4px;
    transition: all 0.2s ease;

    &:hover {
        color: ${({ important }) => important ? 'rgba(185, 28, 28, 1)' : 'rgba(31, 41, 55, 0.9)'};
    }
`;

const ContainerContent = styled.div`
    display: flex;
    flex-direction: row; /* Cambia de column a row */
    padding: 2rem;
    width: calc(100% - 260px);
    margin-left: 260px;
    gap: 2rem;
    align-items: flex-start; /* Opcional, alinea los elementos en el eje vertical */
    flex-wrap: wrap; /* Opcional, permite que los bloques bajen si no hay espacio */
`;


const Divider = styled.hr`
    border: none;
    height: 1px;
    margin: 16px 0 10px;
    background: linear-gradient(to right, transparent, rgba(0, 0, 0, 0.15), transparent);
`;

const TextLoadImg = styled.div`
    font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 1.2rem;
    color: rgba(0, 0, 0, 0.75);
    text-align: center;
    margin-bottom: 10px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    svg {
        flex-shrink: 0;
        color: #555; /* Color del icono */
    }
`;

const ImageLoader = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 300px;
    margin-top: -10px;
    margin-left: 80px;
    width: 450px;


    @media (max-width: 779px) {
        margin-left: 20px;

    }

    @media (max-width: 500px) {
        margin-left: -40px;
        margin-bottom: 1rem;
    }
`;

//1276
//1433
const ContainerCardSoli = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 450px;
    min-width: 350px;
    margin-top: 32px;
    margin-left: 60px;
    max-width: 530px;

    @media (max-width: 1472px) and (min-width: 1291px) {
        margin-left: 20px;
        margin-top: 290px;
    }

    @media (max-width: 1432px) and (min-width: 780px) {
        margin-left: 80px;
        margin-top: 290px;
    }

    @media (max-width: 1472px) and (min-width: 1433px) {
        margin-left: 80px;
        margin-top: 290px;
    }

    @media (max-width: 779px) and (min-width: 763px){
        margin-left: 25px;
        margin-top: 290px;
    }

    @media (max-width: 763px) and (min-width: 501px){
        margin-left: 25px;
        margin-top: 320px;
    }

    @media (max-width: 500px) and (min-width: 400px){
        margin-left: 5px;
        margin-top: 310px;
        width: 300px;
    }

    @media (max-width: 414px) and (min-width: 320px){
        margin-left: -15px;
        margin-top: 290px;
        width: 300px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    
    @media (max-width: 325px) and (min-width: 100px){
        margin-left: -30px;
        margin-top: 310px;
        width: 300px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    @media (max-width: 1291px) and (min-width: 1277px){
        margin-left: 20px;
        margin-top: 290px;
    }
`;

const Barra = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;

    @media (min-width: 600px) {
        flex: 1;
        justify-content: center;
    }
`;


const VolverButton = styled.div`
    position: absolute;
    top: 40px; 
    left: 370px;
    z-index: 1; 

    @media (max-width: 500px) and (min-width: 100px) {
        margin-left: -120px; // Ajusta el margen para pantallas pequeñas
    }

        @media (max-width: 870px) and (min-width: 501px) {
        margin-left: -40px; // Ajusta el margen para pantallas pequeñas
    }

    @media (max-width: 785px) and (min-width: 500px) {
        margin-left: -60px; // Ajusta el margen para pantallas pequeñas
    }
`;

export {
    InfoBlock,
    InfoLine,
    ObservationNote,
    ContainerContent,
    Divider,
    TextLoadImg,
    ImageLoader,
    ContainerCardSoli,
    Head,
    Barra,
    VolverButton,
    Content,
    SideAndContent,
    Body,
    Column
};