import styled from 'styled-components';
import { useState } from 'react';

const Table = ({ columns, data, idKey = "id" }) => {  // Agrega idKey con valor por defecto
    const [selectedRows, setSelectedRows] = useState([]);
  
    const handleCheckBoxChange = (rowID) => {
      if (selectedRows.includes(rowID)) {
        setSelectedRows(selectedRows.filter((id) => id !== rowID));
      } else {
        setSelectedRows([...selectedRows, rowID]);
      }
    };
  
    return (
      <TableContainer>
        <TableElement>
          <thead>
            <tr>
              <th>Seleccionar</th>
              {columns.map((column, index) => (
                <th key={index}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row[idKey]}>  {/* Usa idKey aquí */}
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(row[idKey])}
                    onChange={() => handleCheckBoxChange(row[idKey])}  
                  />
                </td>
                {columns.map((column, colIndex) => (
                  <td key={colIndex}>{row[column]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </TableElement>
      </TableContainer>
    );
  };
  
    
    const TableContainer = styled.div`
    padding: 20px;
  `;
  
  const TableElement = styled.table`
    width: 100%;
    border-collapse: collapse;
  
    th, td {
      border: 1px solid #ddd;
      padding: 8px;
    }
  
    tr:hover {
      background-color: #f1f1f1;
    }
  
    .selected {
      background-color: #e6f7ff;
    }
  `;

export default Table; 