import React from 'react';
import styled from 'styled-components';
import { ChevronDown, ChevronUp } from 'lucide-react';

// Estilos base
const TableContainer = styled.div`
  width: 100%;
  margin: 20px 0;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
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

// Componente Table
const Table = ({ 
  data, 
  columns, 
  onRowClick,
  expandable,
  renderExpandedContent
}) => {
  const [expandedRows, setExpandedRows] = React.useState([]);

  const toggleExpand = (id) => {
    setExpandedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id) 
        : [...prev, id]
    );
  };

  return (
    <TableContainer>
      <StyledTable>
        <thead>
          <tr>
            {expandable && <TableHeader style={{ width: '50px' }}></TableHeader>}
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
                    <TableCell colSpan={columns.length + 1}>
                      {renderExpandedContent(item)}
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length + (expandable ? 1 : 0)} style={{ textAlign: 'center' }}>
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