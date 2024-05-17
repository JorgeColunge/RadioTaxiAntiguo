import React, { useState } from 'react';
import axios from 'axios';

const TaxiRequestForm = () => {
  const [clientId, setClientId] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [endAddress, setEndAddress] = useState('');
  const [message, setMessage] = useState('');

  const handleRequestTaxi = async (e) => {
    e.preventDefault();

    try {
      // Convertir las direcciones en coordenadas usando la API de Google Maps Geocoding
      const startCoords = await getCoordinates(address);
      const endCoords = await getCoordinates(endAddress);

      const taxiRequestData = {
        clientId,
        name,
        latitude: startCoords.lat,
        longitude: startCoords.lng,
        address,
        endLatitude: endCoords.lat,
        endLongitude: endCoords.lng,
        endAddress
      };

      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/geolocation/taxi-request`, taxiRequestData);
      setMessage('Solicitud de taxi enviada exitosamente.');
      console.log('Respuesta de la solicitud de taxi:', response.data);
    } catch (error) {
      setMessage('Error al solicitar el taxi.');
      console.error('Error al solicitar el taxi:', error);
    }
  };

  const getCoordinates = async (address) => {
    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
        params: {
          address: address,
          key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
        }
      });
      const { lat, lng } = response.data.results[0].geometry.location;
      return { lat, lng };
    } catch (error) {
      console.error('Error al convertir la dirección en coordenadas:', error);
      throw error;
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h2 className="card-title">Formulario de Solicitud de Taxi</h2>
        {message && <p className="alert alert-info">{message}</p>}
        <form onSubmit={handleRequestTaxi}>
          <div className="form-group">
            <label>ID del Cliente:</label>
            <input
              type="text"
              className="form-control"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Nombre:</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Dirección de Inicio:</label>
            <input
              type="text"
              className="form-control"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Dirección de Destino:</label>
            <input
              type="text"
              className="form-control"
              value={endAddress}
              onChange={(e) => setEndAddress(e.target.value)}
              required
            />
          </div>
          <br></br>
          <button type="submit" className="btn btn-warning btn-block">
            Solicitar Taxi
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaxiRequestForm;
