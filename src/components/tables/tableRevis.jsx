import React from 'react';
import styled from 'styled-components';
import {X}  from 'lucide-react';  

// Estilos base
const TableContainer = styled.div`
  width: 93.5%;
  margin: 20px auto 20px 85px;
  position: relative;

  @media (max-width: 764px) {
    margin: 20px auto 0px 20px;
  }
`;

//estilo para boton de limpiar checbox 
const ClearButton = styled.button`
  background: green;
  border: none;
  color: white;

  border-radius: 6px;
  cursor: pointer;
  height: 17px;
  width: 18px;

  font-weight: bold;


  &:hover {
    background: #dc2626; /* rojo más oscuro */
  }
`;


const ScrollWrapper = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
  overflow-y: auto;
  width: 100%;
  max-height: 70vh;
  
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
  position: relative;
`;

const TableHeader = styled.th`
  background-color: #5FB8D6;
  color: white;
  padding: 12px 15px;
  text-align: left;
  font-weight: 500;
  height: 20px;
`;

const TableRow = styled.tr`
  background-color: ${({ $selected }) => $selected ? '#c1edf4' : 'transparent'};

  &:nth-child(even) {
    background-color: ${({ $selected }) => $selected ? '#c1edf4' : '#f9f9f9'};
  }

  &:hover {
    background-color: ${({ $selected }) => $selected ? '#b2ebf2' : '#f1f1f1'};
  }
`;

const TableCell = styled.td`
  padding: 12px 15px;
  border-bottom: 1px solid #ddd;
  white-space: nowrap;
  position: relative;
  overflow: visible;
`;

const EstadoBadge = styled.span`
  display: inline-block;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  background-color: ${({ $estado }) => $estado === 'AC' ? '#d4edda' : '#f8d7da'};
  color: ${({ $estado }) => $estado === 'AC' ? '#155724' : '#721c24'};
`;

const CheckboxCell = styled.td`
  padding: 12px 15px;
  border-bottom: 1px solid #ddd;
  text-align: center;
`;

const CheckboxInput = styled.input`
  cursor: pointer;
  width: 16px;
  height: 16px;
`;

const Table = ({ 
  data, 
  columns, 
  onRowClick,
  expandable, 
  selectable,
  onSelectionChange,
  renderExpandedContent,
  containerStyle,
  expandedRows = []
}) => {
  const [selectedRows, setSelectedRows] = React.useState([]);

  const toggleSelect = (id, e) => {
    e.stopPropagation();
    setSelectedRows(prev => 
      prev.includes(id)
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
    
    if (onSelectionChange) {
      onSelectionChange(
        selectedRows.includes(id)
          ? selectedRows.filter(rowId => rowId !== id)
          : [...selectedRows, id]
      );
    }
  };

  const clearSelection = () => {
    setSelectedRows([]);
    if (onSelectionChange) {
      onSelectionChange([]);
    }
  }

return (
    <TableContainer style={containerStyle}>
      <ScrollWrapper>
        <StyledTable>
        <thead>
  <tr>
    {selectable && (
      <TableHeader style={{ width: '50px', textAlign: 'center' }}>
        {selectedRows.length > 0 && (
          <ClearButton onClick={clearSelection}>
            <X size={'15px'} style={{marginLeft: '-4px'}}/>
          </ClearButton>
        )}
      </TableHeader>
    )}
    {columns.map((column) => (
      <TableHeader key={column.key}>{column.title}</TableHeader>
    ))}
  </tr>
</thead>

          <tbody>
            {data.length > 0 ? (
              data.map((item) => (
                <React.Fragment key={item.id}>
                  <TableRow 
                    onClick={() => onRowClick && onRowClick(item)}
                    $selected={selectedRows.includes(item.id)}
                  >
                    {selectable && (
                      <CheckboxCell onClick={(e) => e.stopPropagation()}> 
                        <CheckboxInput
                          type="checkbox"
                          checked={selectedRows.includes(item.id)}
                          onChange={(e) => toggleSelect(item.id, e)}
                        />
                      </CheckboxCell>
                    )}
                    
                    {columns.map((column) => (
                      <TableCell key={column.key}>
                        {column.render 
                          ? column.render(item[column.key], item) 
                          : column.key === 'estado'
                            ? <EstadoBadge $estado={item[column.key]}>{item[column.key]}</EstadoBadge>
                            : item[column.key]
                        }
                      </TableCell>
                    ))}
                  </TableRow>

                  {expandable && expandedRows.includes(item.id) && (
                    <TableRow>
                      <TableCell colSpan={columns.length + (selectable ? 1 : 0)}>
                        {renderExpandedContent(item)}
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + (selectable ? 1 : 0)} style={{ textAlign: 'center' }}>
                  No hay datos disponibles
                </TableCell>
              </TableRow>
            )}
          </tbody>
        </StyledTable>
      </ScrollWrapper>
    </TableContainer>
  );
};

export default Table;