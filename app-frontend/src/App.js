import 'bootstrap/dist/css/bootstrap.min.css'; // Importa Bootstrap CSS
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import HomePage from "./HomePage";
import UserPage from "./components/UserPage";
import UsersMap from "./ControlPage";
import UserList from './components/UserList';
import RequireAuth from './RequireAuth';
import RedirectAuth from './RedirectAuth';
import socket from './Socket'; // Importa la instancia del socket

function App() {
  useEffect(() => {
    socket.connect();

    const id_usuario = localStorage.getItem('id_usuario');
    if (id_usuario) {
      socket.emit('registerUser', id_usuario);
    }

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<RedirectAuth><Login /></RedirectAuth>} />
        <Route path="/register" element={<RedirectAuth><Register /></RedirectAuth>} />
        <Route path="/home" element={<RequireAuth><HomePage /></RequireAuth>} />
        <Route path="/map" element={<RequireAuth><UsersMap /></RequireAuth>} />
        <Route path="/user" element={<RequireAuth><UserPage /></RequireAuth>} />
        <Route path="/users-list" element={<RequireAuth><UserList /></RequireAuth>} />
      </Routes>
    </Router>
  );
}

export default App;


