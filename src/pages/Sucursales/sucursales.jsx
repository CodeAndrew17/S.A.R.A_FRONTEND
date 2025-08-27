
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/sidebar';
import styled from 'styled-components';
import { Trash, Plus, Building, Building2, Handshake  } from 'lucide-react';
import Toolbar from '../../components/layout/toolbar';
import Table from '../../components/tables/table';
import UserForm from '../../components/modals/userForm';
import TabsContainer from '../../components/ui/TabContainer';

import columnsBranch from './TableBranches/columnsBranches';
import ConveniosPanel from './convenios'; 

import {
  getBranches, getAgreement,
} from '../../api/api_Convenios';
import {
  handleSucursalSubmit,
  handleDeleteBranches,
  handleUpdateBranches,
} from './TableBranches/sucursalManagement';

import filterData from '../../utils/unitySearch';
import getOrderRegister from '../../utils/getLastRegister';
import { title } from 'framer-motion/client';


const TitleWrapper = styled.div`
  background:#f0f0f0;
  border-radius:8px;
  box-shadow:0 2px 4px rgba(0,0,0,.1);
  padding:30px 20px 20px;
  text-align:center;
  margin:10px 0;
`;
const TitleText = styled.h1`
  margin:0;
  font-size:32px;
  line-height:1.2;
`;


export default function Sucursales() {

  const [activeTab, setActiveTab] = useState('sucursales');


  const [activeForm, setActiveForm] = useState(null);
  const [editingBranch, setEditingBranch] = useState(null);
  const [sucursalesConvenios, setSucursalesConvenios] = useState([]);
  const [filteredSucursales, setFilteredSucursales] = useState([]);
  const [conveniosOptions, setConveniosOptions] = useState([]);
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');


    useEffect(() => { //montamos el useeffect para escuchar los cambios en el elemnto conveniospanel para actualizarlo cada vez q cambien en las options 
    const handleConveniosUpdated = () => {
      // Forzar la recarga cuando se dispare el evento
      loadData();
    };

    // Escuchar el evento personalizado
    window.addEventListener('conveniosUpdated', handleConveniosUpdated);
    
    return () => {
      window.removeEventListener('conveniosUpdated', handleConveniosUpdated);
    };
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [sucursales, convenios] = await Promise.all([
        getBranches(),
        getAgreement(),
      ]);

      const data = sucursales.map(s => ({
        ...s,
        convenio: convenios.find(c => c.id === s.id_convenio)?.nombre ?? 'Sin convenio',
      }));

      setSucursalesConvenios(data);
      setFilteredSucursales(data);
      setConveniosOptions(convenios);
    } catch (err) { 
      console.error(err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => {
    loadData();
  }, []);


  
  const refreshBranches = async () => {
    const suc = await getBranches();
    const data = suc.map(s => ({
      ...s,
      convenio: conveniosOptions.find(c => c.id === s.id_convenio)?.nombre ?? 'Sin convenio',
    }));
    setSucursalesConvenios(data);
    setFilteredSucursales(data);
  };

  
  const handleCrearSucursal = () => { setEditingBranch(null); setActiveForm('sucursal'); };
  const handleDelete = async () => {
    await handleDeleteBranches(selectedBranches, setConveniosOptions, setSucursalesConvenios);
    setSelectedBranches([]); refreshBranches();
  };
  const handleFormSubmit = async data => {
    editingBranch
      ? await handleUpdateBranches(editingBranch.id, data)
      : await handleSucursalSubmit(
  data,
  setConveniosOptions,
  setActiveForm,
  setSucursalesConvenios
);
    setActiveForm(null); setEditingBranch(null); refreshBranches();
  };

  
  const filteredData = filterData({
    data: sucursalesConvenios,
    searchText,
    searchFields: ['nombre', 'ciudad', 'direccion', 'convenio'],
    statusField: 'estado',
    statusFilter,
  });
  
  const orderData = getOrderRegister({ data: filteredData });

  
  return (
    <div>
      <Sidebar />

      
      <TabsContainer
        activeId={activeTab}
        onChange={setActiveTab}
        tabs={[
          {
            id: 'sucursales',
            label: (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building2 size={28} /> Sucursales
              </span>
            ),
            element: (
              <>
                <Toolbar
                  onCreate={handleCrearSucursal}
                  onDelete={handleDelete}
                  onActiveButton={false} 
                  buttonsGap="40px"

                >
                  <Toolbar.Search
                    placeholder="Buscar..."
                    onSearch={setSearchText}
                  />
                  <Toolbar.Dropdown
                    options={{ AC: 'Activo', IN: 'Inactivo', '': 'Todos' }}
                    onSelect={setStatusFilter}
                  />
                </Toolbar>

                {loading ? (
                  <p style={{ textAlign: 'center' }}>Cargando...</p>
                ) : (
                  <Table
                    data={orderData}
                    columns={columnsBranch({ setEditingBranch, setActiveForm })}
                    selectable
                    selectedRows={selectedBranches}
                    onSelectionChange={setSelectedBranches}
                    containerStyle={{ fontSize: '13px' }}
                  />
                )}

                {activeForm === 'sucursal' && (
                  <UserForm
                    title={editingBranch ? 'Editar Sucursal' : 'Crear Sucursal'}
                    fields={[
                      { name: 'nombre', placeholder: 'Nombre', type: 'text', required: true },
                      { name: 'ciudad', placeholder: 'Ciudad', type: 'text', required: true },
                      { name: 'direccion', placeholder: 'Dirección', type: 'text', required: true },
                      { name: 'telefono', placeholder: 'Teléfono', type: 'tel', required: true },
                      {
                        name: 'estado', label: 'Estado' ,placeholder: 'Estado',type: 'switch', required: true,
                        options: [{ value: 'AC', label: 'Activo' }, { value: 'IN', label: 'Inactivo' }],
                        defaultValue: 'AC',
                      },
                      {
                        name: 'id_convenio', label: 'Convenio', type: 'select', required: true,
                        options: conveniosOptions.filter(c=> c.estado =="AC").map(c => ({ value: c.id, label: c.nombre })),
                      },
                    ]}
                    initialValues={editingBranch}
                    onSubmit={handleFormSubmit}
                    onCancel={() => { setActiveForm(null); setEditingBranch(null); }}
                  />
                )}
              </>
            ),
          },
          { id: 'convenios', label: (
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Handshake size={28} /> Convenios
            </span>
          ), element: <ConveniosPanel /> },
        ]}
      />
    </div>
  );
}