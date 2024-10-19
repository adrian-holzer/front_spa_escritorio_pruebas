import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';

const ProcesarPago = () => {
  const [misTurnos, setMisTurnos] = useState([]);
  const [turnoId, setTurnoId] = useState('');
  const [numTarjeta, setNumTarjeta] = useState('');
  const [nombreTitular, setNombreTitular] = useState('');
  const [vencimiento, setVencimiento] = useState('');
  const [codSeguridad, setCodSeguridad] = useState('');
  const [metodoPago, setMetodoPago] = useState('CREDITO');
  const [detallesFactura, setDetallesFactura] = useState({});
  
  const token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyMiIsImlhdCI6MTcyOTM0NjU5MywiZXhwIjoxNzI5NDMyOTkzfQ.Araj8Hfw-KH8Vrw7kB8kW-EAhJYfBlapRvC795pHqRvKIL80ZrdMntRjQ-4cc24xbRg53zPSKHDdRI29FdXacg";
  
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  useEffect(() => {
    // Obtener turnos asignados al cliente
    axios.get('http://localhost:8080/api/turno/misTurnos', config)
      .then(response => {
        setMisTurnos(response.data.data);
      })
      .catch(error => console.error('Error al cargar mis turnos', error));
  }, []);

  const handleProcesarPago = (e) => {
    e.preventDefault();

    if (!turnoId || !numTarjeta || !nombreTitular || !vencimiento || !codSeguridad) {
      alert('Por favor complete todos los campos.');
      return;
    }

    const pagoData = {
      turnoId,
      numTarjeta,
      nombreTitular,
      vencimiento,
      codSeguridad,
      metodoPago
    };

    // Procesar pago y luego generar el PDF
    axios.post('http://localhost:8080/api/pago/procesar', pagoData, config)
      .then(response => {
        alert('Pago procesado exitosamente');
        console.log(response.data.data)
        setDetallesFactura(response.data.data); // Asumimos que la respuesta incluye detalles del pago y turno
        generarFacturaPDF(response.data.data); // Llamar a la función para generar el PDF
      })
      .catch(error => console.error('Error al procesar el pago', error));
  };

  // Función para generar el PDF con los detalles del pago y el turno
  const generarFacturaPDF = (detalles) => {
    const doc = new jsPDF();

    console.log(detalles)


    doc.setFontSize(18);
doc.text('Factura de Pago', 10, 10); // Título principal

doc.setFontSize(12); // Cambiar tamaño de fuente para los detalles
doc.text(`Número de Transacción: ${detalles.id}`, 10, 30); // Detalle del número de transacción


const fechaISO = detalles.fechaPago;

// Convertir la fecha a un objeto Date
const fecha = new Date(fechaISO);

// Formatear la fecha en el formato deseado
const dia = fecha.getDate().toString().padStart(2, '0');
const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Los meses en JS son base 0, por eso se suma 1
const anio = fecha.getFullYear();

const horas = fecha.getHours().toString().padStart(2, '0');
const minutos = fecha.getMinutes().toString().padStart(2, '0');
const segundos = fecha.getSeconds().toString().padStart(2, '0');

// Crear el formato final
const fechaFormateada = `${dia}/${mes}/${anio} ${horas}:${minutos}:${segundos}`;

console.log(fechaFormateada);
doc.text(`Fecha de Pago: ${fechaFormateada}`, 10, 40);  // Fecha del pago




// Detalles del turno
doc.text(`Fecha del Turno: ${detalles.turno.fecha}`, 10, 50); 
doc.text(`Hora del Turno: ${detalles.turno.horaInicio}`, 10, 60); 

// Detalles del titular y pago
doc.text(`Nombre del Titular: ${nombreTitular}`, 10, 70); 
doc.text(`Método de Pago: ${metodoPago}`, 10, 80); 
doc.text(`Turno ID: ${detalles.turno.idTurno}`, 10, 90); 

// Detalles de los servicios
doc.text('Detalles de los Servicios:', 10, 100);
detalles.turno.servicios.forEach((servicio, index) => {
  doc.text(`${index + 1}. ${servicio.detallesServicio} - ${servicio.precio} $`, 10, 110 + (index * 10));
});

// Monto total
doc.text(`Monto Total: ${detalles.monto} $`, 10, 120 + (detalles.turno.servicios.length * 10));

// Guardar el PDF
doc.save('factura.pdf');



  // Convertir el PDF a Blob
  const pdfBlob = doc.output('blob');

  // Crear un objeto FormData
  const formData = new FormData();
  formData.append('factura', pdfBlob, 'factura.pdf'); // 'factura.pdf' es el nombre del archivo
  formData.append('detallesPago', JSON.stringify(detalles)); // Adjuntar los detalles de pago también, si es necesario

  // Enviar la solicitud POST con axios
  axios.post('http://localhost:8080/api/pago/enviar-factura', formData, {
    headers: {
      'Content-Type': 'multipart/form-data', // Importante para enviar archivos
      'Authorization': `Bearer ${token}` // Si usas autenticación con token
    }
  })
  .then(response => {
    alert('Factura enviada por correo exitosamente');
  })
  .catch(error => {
    console.error('Error al enviar la factura', error);
  });

  };

  return (
    <div>
      <h2>Procesar Pago</h2>
      <form onSubmit={handleProcesarPago}>
        <label>Mis Turnos:</label>
        <select value={turnoId} onChange={e => setTurnoId(e.target.value)}>
          <option value="">Seleccione un turno</option>
          {misTurnos.map(turno => (
            <option key={turno.idTurno} value={turno.idTurno}>
              {turno.fecha} - {turno.horaInicio}
            </option>
          ))}
        </select>

        <label>Número de Tarjeta:</label>
        <input
          type="text"
          value={numTarjeta}
          onChange={e => setNumTarjeta(e.target.value)}
          placeholder="XXXX-XXXX-XXXX-XXXX"
        />

        <label>Nombre del Titular:</label>
        <input
          type="text"
          value={nombreTitular}
          onChange={e => setNombreTitular(e.target.value)}
        />

        <label>Vencimiento:</label>
        <input
          type="text"
          value={vencimiento}
          onChange={e => setVencimiento(e.target.value)}
          placeholder="MM/YY"
        />

        <label>Código de Seguridad:</label>
        <input
          type="text"
          value={codSeguridad}
          onChange={e => setCodSeguridad(e.target.value)}
          placeholder="XXX"
        />

        <label>Método de Pago:</label>
        <select value={metodoPago} onChange={e => setMetodoPago(e.target.value)}>
          <option value="CREDITO">Crédito</option>
          <option value="DEBITO">Débito</option>
        </select>

        <button type="submit">Procesar Pago</button>
      </form>
    </div>
  );
};

export default ProcesarPago;
