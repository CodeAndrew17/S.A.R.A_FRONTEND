import React from 'react';
import styled from 'styled-components';
import { ChevronDown, ChevronUp } from 'lucide-react';

// Estilos base

const TableContainer = styled.div`
  width: 93.5%;
  margin: 20px auto 20px 90px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);


  @media (max-width: 1024px) {
    width: 90%;
  }

  @media (max-width: 768px) {
    width: 85%;
  }

`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  background-color: #5FB8D6;
  color: white;
  padding: 12px 15px;
  text-align: left;
  font-weight: 500;
  
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
  &:hover {
    background-color: #f1f1f1;
  }
`;

const TableCell = styled.td`
  padding: 12px 15px;
  border-bottom: 1px solid #ddd;
  white-space: nowrap;
`;

const ExpandButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #5FB8D6;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const EstadoBadge = styled.span`
  display: inline-block;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  background-color: ${({ estado }) => estado === 'AC' ? '#d4edda' : '#f8d7da'};
  color: ${({ estado }) => estado === 'AC' ? '#155724' : '#721c24'};
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
  selectable, // ! Nuevo prop para mostrar/ocultar checkbox
  onSelectionChange, //! ← Callback cuando cambia la selección
  renderExpandedContent,
  containerStyle
}) => {
  const [expandedRows, setExpandedRows] = React.useState([]);
  const [selectedRows, setSelectedRows] = React.useState([]); //!Se guardaran los id de las checkbox Selecionados 

  const toggleExpand = (id) => {
    setExpandedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id) 
        : [...prev, id]
    );
  };

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

  return (
    <TableContainer style={containerStyle}>
      <StyledTable>
        <thead>
          <tr>
            {selectable && <TableHeader style={{ width: '10px' }}></TableHeader>} 
            {expandable && <TableHeader style={{ width: '10px' }}></TableHeader>}
            {columns.map((column) => (
              <TableHeader key={column.key}>{column.title}</TableHeader>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item) => (
              <React.Fragment key={item.id}>
                <TableRow onClick={() => onRowClick && onRowClick(item)}>
                  {selectable && (
                    <CheckboxCell onClick={(e) => e.stopPropagation()}> 
                      <CheckboxInput
                        type="checkbox"
                        checked={selectedRows.includes(item.id)}
                        onChange={(e) => toggleSelect(item.id, e)}
                      />
                    </CheckboxCell>
                  )}
                  
                  {expandable && (
                    <TableCell>
                      <ExpandButton onClick={(e) => {
                        e.stopPropagation();
                        toggleExpand(item.id);
                      }}>
                        {expandedRows.includes(item.id) ? (
                          <ChevronUp size={18} />
                        ) : (
                          <ChevronDown size={18} />
                        )}
                      </ExpandButton>
                    </TableCell>
                  )}
                  
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      {column.render 
                        ? column.render(item[column.key], item) 
                        : column.key === 'estado'
                          ? <EstadoBadge estado={item[column.key]}>{item[column.key]}</EstadoBadge>
                          : item[column.key]
                      }
                    </TableCell>
                  ))}
                </TableRow>

                {expandable && expandedRows.includes(item.id) && (
                  <TableRow>
                    <TableCell colSpan={columns.length + (selectable ? 1 : 0) + (expandable ? 1 : 0)}>
                      {renderExpandedContent(item)}
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length + (selectable ? 1 : 0) + (expandable ? 1 : 0)} style={{ textAlign: 'center' }}>
                No hay datos disponibles
              </TableCell>
            </TableRow>
          )}
        </tbody>
      </StyledTable>
    </TableContainer>
  );
};

export default Table;
