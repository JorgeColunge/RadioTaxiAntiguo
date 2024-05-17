import React, { useEffect } from 'react'; 
import UsersMap from './UsersMap';
import socket from '../Socket';
import TaxiRequestButton from './TaxiRequestButton';
import TaxiRequestForm from './TaxiRequestForm'; // Importa el formulario de solicitud de taxi

const HomePageContentTipo1 = () => {

  useEffect(() => {
    console.log('Socket conectado en HomePage:', socket.connected);
  }, []);

  return (
    <div>
      <h1>Operadora Radio Taxi</h1>
      <TaxiRequestForm /> {/* Agrega el formulario de solicitud de taxi */}
      <TaxiRequestButton /> {/* Botón para simular la solicitud de taxi */}
      <UsersMap />
    </div>
  );
};

export default HomePageContentTipo1;
