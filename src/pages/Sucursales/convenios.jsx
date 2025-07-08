// ConveniosPanel.jsx
import Table from '../../components/table';
import Toolbar from '../../components/toolbar';
import styled from 'styled-components';
import columnsAgreement from './TableAgreement/columnsAgreement';
import UserForm from '../../components/userForm';
import { useState, useEffect } from 'react';
import useAgreementManagement from './TableAgreement/convenioManagement';


export default function ConveniosPanel() {
  const [activeForm, setActiveForm] = useState(false);
  const [selected, setSelected]   = useState([]);
  const [editing, setEditing]     = useState(null);

  const {
    orderData,
    fetchAgreementData,
    createAgreement,
    removeAgreement,
    updateAgreement,
    setStatusFilter,
    setSearchText,
  } = useAgreementManagement();

  /* cargar convenios al montar */
  useEffect(() => { fetchAgreementData(); }, []);

  /* acciones */
  const handleCreate = () => { setActiveForm(true); setEditing(null); };
  const handleDelete = async () => {
    if (await removeAgreement(selected)) {
      setSelected([]); fetchAgreementData();
    }
  };
  const handleSubmit = async (data) => {
    editing
      ? await updateAgreement(data, editing.nit)
      : await createAgreement(data);
    setActiveForm(false); setEditing(null);
  };

  return (
    <div>
      <Toolbar
        onCreate={handleCreate}
        onDelete={handleDelete}
        onActiveButton={false}   
      >
        <Toolbar.Search
          placeholder="Buscar..."
          onSearch={setSearchText}
        />
        <Toolbar.Dropdown
          options={{ 'AC': 'Activo', 'IN': 'Inactivo', '': 'Todos' }}
          onSelect={setStatusFilter}
        />
      </Toolbar>

      <div>
        <Table
          selectable
          data={orderData}
          columns={columnsAgreement({ setEditing, setActiveForm })}
          onSelectionChange={setSelected}
        />
      </div>


      {activeForm && (
        <UserForm
          title={editing ? `Editar Convenio ${editing.nombre}` : 'Crear Convenio'}
          fields={[
            { name: 'nombre',  label: 'Nombre',  type: 'text', required: true },
            { name: 'nit',     label: 'NIT',     type: 'text', required: true },
            { name: 'telefono',label: 'Teléfono',type: 'tel',  required: true },
            {
              name: 'estado',  label: 'Estado',  type: 'select',
              options: [
                { value: 'AC', label: 'Activo' },
                { value: 'IN', label: 'Inactivo' },
              ],
              defaultValue: 'AC',
              required: true,
            },
          ]}
          initialValues={editing}
          onCancel={() => { setActiveForm(false); setEditing(null); }}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
