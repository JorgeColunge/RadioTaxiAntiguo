import React from 'react';
import HomePageContentTipo1 from './components/HomePageContentTipo1';
import HomePageContentTipo2 from './components/HomePageContentTipo2';

const HomePage = () => {
  const tipo_usuario = localStorage.getItem('tipo_usuario');

  return (
    <div>
      {tipo_usuario === 'tipo1' ? <HomePageContentTipo1 /> : <HomePageContentTipo2 />}
    </div>
  );
};

export default HomePage;
