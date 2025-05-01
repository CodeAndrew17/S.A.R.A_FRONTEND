const columns = [

    {
        key: 'nombre',
        title: 'Nombre',
    },
    {
      key: 'nit',
      title: 'NIT',
    },
    {
      key: 'telefono',
      title: 'Teléfono',
    },
    {
      key: 'estado',
      title: 'Estado',
      render: (estado) => (
        <span style={{
          backgroundColor: estado === 'Activo' ? '#d4edda' : '#f8d7da',
          color: estado === 'Activo' ? '#155724' : '#721c24',
          padding: '3px 8px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          {estado}
        </span>
      )
    },
    {
        key: 'actions',
        title: 'Acciones',
      }
  ];

export default columns;