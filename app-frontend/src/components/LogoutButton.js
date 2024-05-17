import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('id_usuario');
    navigate('/');
  };

  return (
    <button onClick={handleLogout} className="btn btn-warning">
      Cerrar sesión
    </button>
  );
};

export default LogoutButton;