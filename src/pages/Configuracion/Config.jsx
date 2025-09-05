import Sidebar from "../../components/layout/sidebar"
import styled from "styled-components";

const TitleWrapper = styled.div`
  background-color: #f0f0f0;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  padding: 30px 20px 20px; /* Más espacio arriba */
  text-align: center;
  margin-top: 10px;
  height: auto; /* ¡No fijes altura si no es necesario! */
`;


const TitleText = styled.h1`
  color: #000;
  font-size: 32px;
  line-height: 1.2; /* Mucho mejor que usar pixeles fijos */
  margin: 0;

  @media (max-width: 500px) {
    font-size: 25px;
  }
`;

const GeneralContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 10px;
    background-color: blue; 
    justify-content: center; /* Centra los hijos horizontalmente */
    align-items: center;     /* Centra los hijos verticalmente */
    padding: 20px;
    margin-top: 20px;
    height: 100vh; 
`;


const TypesContainers = styled.div`
    background-color: red; 
    padding: 20px; 

`;

export function Configuracion() {

    return(
    <div>
        <Sidebar />
        <TitleWrapper>
            <TitleText>Configuración</TitleText>
        </TitleWrapper>
        <GeneralContainer>  
            <TypesContainers >

        </TypesContainers>
        <TypesContainers >

        </TypesContainers>
        </GeneralContainer>
    </div>
    )
}; 