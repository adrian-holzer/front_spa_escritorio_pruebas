import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CrearHorario from './components/CrearHorario';
import SeleccionarTurno from './components/SeleccionarTurno';
import ProcesarPago from './components/ProcesarPago';
import EnviarFactura from './components/EnviarFactura';

const App = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <h3>***Cambiar manualmente por un token valido  en la variable config segun se necesite (cliente,prof, admin o secretario )****</h3>
            <li>
              <Link to="/crear-horario">Crear Horario (Para admin, prof o secretario)</Link>
            </li>
            <li>
              <Link to="/seleccionar-turno">Seleccionar Turno (Para el cliente)</Link>
            </li>
            <li>
              <Link to="/procesar-pago">Realizar Pago (Para el cliente)</Link>
            </li>
           
          </ul>
        </nav>

        <Routes>
          <Route path="/crear-horario" element={<CrearHorario />} />
          <Route path="/seleccionar-turno" element={<SeleccionarTurno />} />
          <Route path="/procesar-pago" element={<ProcesarPago />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
