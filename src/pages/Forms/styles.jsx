import styled from 'styled-components';

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
    font-size: 2rem;
    color: rgba(0, 0, 0, 0.75);
    text-align: center;
    margin-top: 10px;
    margin-bottom: 20px;
    font-weight: 500;
`;

const ImageLoader = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 300px;
    margin-top: -10px;
    margin-left: 20px;

    @media (max-width: 779px) {
        margin-left: 20px;
    }

    @media (max-width: 500px) {
        margin-left: -90px;
    }

`;

const ContainerCardSoli = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 300px;
    min-width: 340px;
    margin-top: 25px;
    margin-left: 10px;

    @media (max-width: 1276px) and (min-width: 780px) {
        margin-left: 20px;
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

    @media (max-width: 500px) and (min-width: 100px){
        margin-left: -85px;
        margin-top: 320px;
        width: 300px;

    }

    @media (max-width: 1291px) and (min-width: 1277px){
        margin-left: 20px;
        margin-top: 290px;
    }
`;

const HeadContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center; // Centro horizontalmente todo
    flex-direction: column;
    width: 100%;
    padding: 0 20px;
    margin-bottom: 1rem;

    @media (min-width: 600px) {
        flex-direction: row;
        justify-content: space-between; 
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
    top: 25px; 
    left: 340px;
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
  HeadContainer,
  Barra,
  VolverButton,
};
