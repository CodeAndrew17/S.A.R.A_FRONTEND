import React from "react";
import styled from "styled-components";
import Dropdown from "../../../components/Dropdown";
import SearchBar from "../../../components/SearchBar";
import CustomButton from "../../../components/button";
import { Trash, Edit, Plus } from "lucide-react";

const ToolbarWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  width: 90%;
  margin: 20px auto;
  flex-wrap: wrap;
  gap: 20px;

  @media (max-width: 1024px) {
    gap: 15px;
    width: 95%;
    flex-direction: ${props => props.$isLandscape ? "column" : "row"};
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
    padding: 10px;
    width: 100%;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  flex-grow: 1;
  min-width: 300px;
  flex-wrap: wrap;

  @media (min-width: 1025px) {
    padding-left: 210px;
    gap: 80px;
  }

  @media (max-width: 1024px) {
    gap: ${props => props.$isLandscape ? "15px" : "40px"};
    padding-left: ${props => props.$isLandscape ? "0" : "100px"};
    justify-content: ${props => props.$isLandscape ? "center" : "flex-start"};
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
    padding-left: 0;
    width: 100%;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;

  @media (min-width: 1025px) {
    gap: 50px;
  }

  @media (max-width: 1024px) {
    gap: ${props => props.$isLandscape ? "10px" : "15px"};
    width: ${props => props.$isLandscape ? "100%" : "auto"};
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ResponsiveButton = styled(CustomButton).withConfig({
  shouldForwardProp: (prop) => prop !== 'isLandscape',
})`
  @media (max-width: 1024px) {
    width: ${props => props.isLandscape ? "30%" : props.width} !important;
  }

  @media (max-width: 480px) {
    width: 100% !important;
  }
`;

const Toolbar = ({ onSearch, onDelete, onEdit, onCreate }) => {
  const [isLandscape, setIsLandscape] = React.useState(false);

  React.useEffect(() => {
    const checkOrientation = () => {
      setIsLandscape(window.matchMedia("(max-width: 1024px) and (max-height: 768px)").matches);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);

  return (
    <ToolbarWrapper $isLandscape={isLandscape}>
      <FilterContainer $isLandscape={isLandscape}>
        <Dropdown
          options={{
            "AC": "Activo", 
            "IN": "Inactivo",
            "": "Todos"
          }}
          onSelect={onSearch}
        />
        <SearchBar
          placeholder="Cédula, Nombre o Sucursal"
          width="280px"
          maxWidth="400px"
          responsiveWidth={isLandscape ? "70%" : "50%"}
          responsiveMaxWidth="300px"
          mobileWidth="90%"
          onSearch={onSearch}
        />
      </FilterContainer>
      <ButtonContainer $isLandscape={isLandscape}>
        <ResponsiveButton 
          bgColor="#FF6B6B" 
          hoverColor="#D9534F" 
          width="130px" 
          height="38px" 
          onClick={onDelete}
          isLandscape={isLandscape}
        >
          <Trash /> Eliminar
        </ResponsiveButton>
        <ResponsiveButton 
          bgColor="#5A9AC6" 
          hoverColor="#468BAF" 
          width="130px" 
          height="38px" 
          onClick={onEdit}
          isLandscape={isLandscape}
        >
          <Edit /> Editar
        </ResponsiveButton>
        <ResponsiveButton 
          bgColor="#5FB8D6" 
          hoverColor="#519CB2" 
          width="160px" 
          height="38px" 
          onClick={onCreate}
          isLandscape={isLandscape}
        >
          <Plus /> Crear Nuevo
        </ResponsiveButton>
      </ButtonContainer>
    </ToolbarWrapper>
  );
};

export default Toolbar;