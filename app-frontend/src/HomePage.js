import React from 'react';
import { Link } from 'react-router-dom';
import { Person, People, ChatDots, Globe } from 'react-bootstrap-icons';
import HomePageContentTipo1 from './components/HomePageContentTipo1';
import HomePageContentTipo2 from './components/HomePageContentTipo2';
import LogoutButton from './components/LogoutButton'; // Asegúrate de tener este componente

const HomePage = () => {
  const tipo_usuario = localStorage.getItem('tipo_usuario');

  return (
    <div className="container-fluid">
      <div className="row align-items-center justify-content-between" style={{ padding: '20px' }}>
        <div className="col-auto">
          <img src={"/imagenes/Logo.jpg"} alt="Logo" style={{ width: '250px', marginRight: '20px' }} />
        </div>
        <div className="col-auto d-flex align-items-center">
          <Link to="/user" className="btn btn-link text-dark">
            <Person size={30} />
          </Link>
          <Link to="/users-list" className="btn btn-link text-dark ml-2">
            <People size={30} />
          </Link>
          <Link to="/chat" className="btn btn-link text-dark ml-2">
            <ChatDots size={30} />
          </Link>
          <LogoutButton className="btn btn-warning ml-2" />
        </div>
      </div>
      {tipo_usuario === 'tipo1' ? <HomePageContentTipo1 /> : <HomePageContentTipo2 />}
    </div>
  );
};

export default HomePage;
