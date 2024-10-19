import React, { useState } from 'react';
import axios from 'axios';
const token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyMiIsImlhdCI6MTcyOTMxNzgwNCwiZXhwIjoxNzI5NDA0MjA0fQ.ffwBA0FrMqRSrD4qbmwZZW0sf-imQNR5mlvCmw4Ym7hRLV24ce08q66lsey0T41XpCzuLGg9vUImTYV4E0HLVw";
  
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };
const EnviarFactura = () => {
  const [turnoId, setTurnoId] = useState('');
  const [factura, setFactura] = useState(null);

  const handleGenerarFactura = () => {
    // Generar el PDF localmente (simulación)
    const pdfContent = 'Factura generada para el turno ' + turnoId;
    const blob = new Blob([pdfContent], { type: 'application/pdf' });
    setFactura(blob);
  };

  const handleEnviarFactura = (e) => {
    e.preventDefault();

    if (!factura) {
      alert('Genera primero la factura');
      return;
    }

    const formData = new FormData();
    formData.append('factura', factura);
    formData.append('turnoId', turnoId);

    axios.post('http://localhost:8080/api/pago/enviar-factura', formData,config)
      .then(response => {
        alert('Factura enviada por correo exitosamente');
      })
      .catch(error => console.error('Error al enviar la factura', error));
  };

  return (
    <div>
      <h2>Generar y Enviar Factura</h2>
      <form onSubmit={handleEnviarFactura}>
        <label>ID del Turno:</label>
        <input type="text" value={turnoId} onChange={e => setTurnoId(e.target.value)} />

        <button type="button" onClick={handleGenerarFactura}>Generar Factura</button>
        <button type="submit">Enviar Factura</button>
      </form>
    </div>
  );
};

export default EnviarFactura;
