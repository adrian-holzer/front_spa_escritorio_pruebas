import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SeleccionarTurno = () => {
  const [fecha, setFecha] = useState('');
  const [turnosDisponibles, setTurnosDisponibles] = useState([]);
  const [idTurno, setIdTurno] = useState('');
  const [servicios, setServicios] = useState([]);
  const [servicioIds, setServicioIds] = useState([]);
  const [error, setError] = useState('');  // Estado para manejar los errores
  const token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyMiIsImlhdCI6MTcyOTM0NjU5MywiZXhwIjoxNzI5NDMyOTkzfQ.Araj8Hfw-KH8Vrw7kB8kW-EAhJYfBlapRvC795pHqRvKIL80ZrdMntRjQ-4cc24xbRg53zPSKHDdRI29FdXacg";
  
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  useEffect(() => {
    // Cargar los servicios al montar el componente
    axios.get('http://localhost:8080/api/servicio/listar')
      .then(response => {

        console.log(response.data.data)
        setServicios(response.data.data); // Ajusta según la estructura de tu respuesta
      })
      .catch(error => console.error('Error al cargar los servicios', error));
  }, []);

  useEffect(() => {
    if (fecha) {
      // Obtener turnos disponibles según la fecha seleccionada
      axios.get(`http://localhost:8080/api/turno/disponibles?fecha=${fecha}`, config)
        .then(response => {
          setTurnosDisponibles(response.data.data);
        })
        .catch(error => console.error('Error al cargar los turnos disponibles', error));
    }
  }, [fecha]);

  const handleAsignarTurno = (e) => {
    e.preventDefault();

    // Validar que se haya seleccionado al menos un servicio
    if (servicioIds.length === 0) {
      setError('Debe seleccionar al menos un servicio');
      return;  // Detener el envío del formulario si no hay servicios seleccionados
    }

    const seleccionarturnoData = {
      idTurno,
      servicioIds
    };

    // Limpiar el mensaje de error si pasa la validación
    setError('');

    axios.post('http://localhost:8080/api/turno/asignar', seleccionarturnoData, config)
      .then(response => {
        alert('Turno asignado exitosamente');
      })
      .catch(error => console.error('Error al asignar el turno', error));
  };

  const agregarServicio = (id) => {
    if (!servicioIds.includes(id)) {
      setServicioIds([...servicioIds, id]);
    }
  };

  const eliminarServicio = (id) => {
    setServicioIds(servicioIds.filter(servicioId => servicioId !== id));
  };

  return (
    <div>
      <h2>Seleccionar Turno</h2>
      <form onSubmit={handleAsignarTurno}>
        <label>Fecha:</label>
        <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} />

        <label>Turnos Disponibles:</label>
        <select value={idTurno} onChange={e => setIdTurno(e.target.value)}>
          <option value="">Seleccione un turno</option>
          {turnosDisponibles.map(turno => (
            <option key={turno.idTurno} value={turno.idTurno}>{turno.horaInicio}</option>
          ))}
        </select>

        <label>Servicios:</label>
        <div>
          {servicios.map(servicio => (
            <div key={servicio.idServicio}>
              <span>{servicio.detallesServicio}</span>
              <button type="button" onClick={() => agregarServicio(servicio.idServicio)}>Agregar</button>
            </div>
          ))}
        </div>

        <h4>Servicios Seleccionados:</h4>
        <ul>
          {servicioIds.map(id => {
            const servicio = servicios.find(s => s.idServicio === id);

            console.log("hola0" + servicio)
            return (
              <li key={servicio.idServicio}>
                {servicio ? servicio.detallesServicio : id}
                <button type="button" onClick={() => eliminarServicio(id)}>Eliminar</button>
              </li>
            );
          })}
        </ul>

        {error && <p style={{ color: 'red' }}>{error}</p>}  {/* Mostrar mensaje de error */}

        <button type="submit">Asignar Turno</button>
      </form>
    </div>
  );
};

export default SeleccionarTurno;
