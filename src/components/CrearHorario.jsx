import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CrearHorario = () => {
  const [profesionales, setProfesionales] = useState([]);
  const [idProfesional, setIdProfesional] = useState('');
  const [fecha, setFecha] = useState('');
  const [horaInicio, setHoraInicio] = useState('08:00');
  const token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJwcm9mMSIsImlhdCI6MTcyOTM0NjY0MSwiZXhwIjoxNzI5NDMzMDQxfQ.KbP53MJy_gJgWo9DSzFm-QTY2iEdjsG5W35sWW1C3jrSmfxpR778cFEzXdyCx0591ZFJ2hzgvKdoNtsVsvHtmw"
  // Cargar los profesionales desde la API
  useEffect(() => {
    axios.get('http://localhost:8080/api/profesional/listar',{
        headers: {
          Authorization: `Bearer ${token}`  // Incluye el token en los headers
        }
      })
      .then(response => {

        console.log(response)
        setProfesionales(response.data.data);
      })
      .catch(error => console.error('Error al cargar los profesionales', error));
  }, []);

  const handleCrearTurno = (e) => {
    e.preventDefault();

    // Validar que la fecha no sea anterior a hoy
    const fechaSeleccionada = new Date(fecha);
    if (fechaSeleccionada < new Date()) {
      alert('No se pueden seleccionar fechas pasadas');
      return;
    }
    const turnoData = {
        idProfesional,
        fecha,
        horaInicio
    };


    const config = {
        headers: {
            'Authorization': `Bearer ${token}`
        }

    };

    axios.post('http://localhost:8080/api/turno/crear', turnoData, config)
      .then(response => {
        alert('Turno creado exitosamente');
      })
      .catch(error => console.error('Error al crear el turno', error));
  };

  return (
    <div>
      <h2>Crear Horario</h2>
      <form onSubmit={handleCrearTurno}>
        <label>Profesional:</label>
        <select value={idProfesional} onChange={e => setIdProfesional(e.target.value)}>
          <option value="">Seleccione un profesional</option>
          {profesionales.map(prof => (
            <option key={prof.idProfesional} value={prof.idProfesional}>{prof.usuario.nombre}  {prof.usuario.apellido}</option>
          ))}
        </select>
        
        <label>Fecha:</label>
        <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} />
        
        <label>Hora de Inicio:</label>
        <input type="time" value={horaInicio} onChange={e => setHoraInicio(e.target.value)} />
        
        <button type="submit">Crear Turno</button>
      </form>
    </div>
  );
};

export default CrearHorario;
