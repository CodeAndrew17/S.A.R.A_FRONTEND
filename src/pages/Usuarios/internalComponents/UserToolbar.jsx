import React from "react";
import styled from "styled-components";
import Dropdown from "../../../components/Dropdown";
import SearchBar from "../../../components/SearchBar";
import CustomButton from "../../../components/button";
import { Trash, Edit, Plus } from "lucide-react";

const ToolbarWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
  width: 100%;
  margin-bottom: 20px; 
  margin-top: 20px; 
`;


const ToolbarContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 20px;
  max-width: 1000px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const ResponsiveButton = styled(CustomButton).withConfig({
  shouldForwardProp: (prop) => prop !== 'isLandscape',
})`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;

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
    <ToolbarWrapper>
      <ToolbarContent>
        <CustomButton 
          bgColor="#5FB8D6" 
          hoverColor="#519CB2" 
          width="160px" 
          height="38px" 
          onClick={onCreate}
          isLandscape={isLandscape}
        >
          <Plus /> Crear Nuevo
        </CustomButton>
        <CustomButton 
          bgColor="#FF6B6B" 
          hoverColor="#D9534F" 
          width="130px" 
          height="38px" 
          onClick={onDelete}
          isLandscape={isLandscape}
        >
          <Trash /> Eliminar
        </CustomButton>
        <CustomButton 
          bgColor="#5A9AC6" 
          hoverColor="#468BAF" 
          width="130px" 
          height="38px" 
          onClick={onEdit}
          isLandscape={isLandscape}
        >
          <Edit /> Editar
        </CustomButton>

        <SearchBar
          placeholder="Cédula,Nombre o Sucursal"
          width="290px"
          maxWidth="400px"  
          responsiveWidth={isLandscape ? "70%" : "50%"}
          responsiveMaxWidth="300px"
          mobileWidth="90%"
          onSearch={onSearch}
        />
        <Dropdown
          options={{
            "AC": "Activo", 
            "IN": "Inactivo",
            "": "Todos"
          }}
          onSelect={onSearch}
        />
      </ToolbarContent>
    </ToolbarWrapper>
  );
};

export default Toolbar;
