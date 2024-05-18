import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Person, People, ChatDots, PencilSquare, Trash } from 'react-bootstrap-icons';
import LogoutButton from './LogoutButton';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';

function UserList() {
  const [users, setUsers] = useState([]); // Estado para almacenar los usuarios
  const [editingUser, setEditingUser] = useState(null); // Estado para el usuario que está siendo editado
  const [newUser, setNewUser] = useState({ id_usuario: '', nombre: '', email: '', tipo: '', password: '' }); // Estado para un nuevo usuario
  const [showModal, setShowModal] = useState(false); // Estado para mostrar/ocultar el formulario

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/users`);
        setUsers(response.data); // Actualizar el estado con la lista de usuarios
      } catch (error) {
        console.error('There was an error!', error);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setEditingUser(user);
    setNewUser(user);
    setShowModal(true);
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/auth/user/${userId}`);
      setUsers(users.filter(user => user.id_usuario !== userId)); // Actualizar la lista de usuarios
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (editingUser) {
        response = await axios.put(`${process.env.REACT_APP_API_URL}/api/auth/user/${editingUser.id_usuario}`, newUser);
      } else {
        response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, newUser);
      }
      setUsers(editingUser ? users.map(user => (user.id_usuario === editingUser.id_usuario ? response.data : user)) : [...users, response.data]);
      setEditingUser(null);
      setNewUser({ id_usuario: '', nombre: '', email: '', tipo: '', password: '' });
      setShowModal(false);
    } catch (error) {
      console.error('Error al guardar el usuario:', error);
    }
  };

  const backButtonStyle = {
    position: 'absolute',
    bottom: '20px',
    right: '20px',
    zIndex: 1000
  };

  return (
    <div className="container-fluid">
      <div className="row align-items-center justify-content-between" style={{ padding: '20px' }}>
        <div className="col-auto">
          <Link to="/home">
            <img src={"/imagenes/Logo.jpg"} alt="Logo" style={{ width: '250px', marginRight: '20px' }} />
          </Link>
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
      <div className="container mt-5">
        <h1 className="mb-3">Lista de Conductores</h1>
        <button onClick={() => { setShowModal(true); setEditingUser(null); setNewUser({ id_usuario: '', nombre: '', email: '', tipo: '', password: '' }); }} className="btn btn-warning mb-3">Agregar Usuario</button>
        
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{editingUser ? 'Editar Usuario' : 'Agregar Usuario'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="id_usuario">
                <Form.Label>ID Usuario:</Form.Label>
                <Form.Control
                  type="text"
                  value={newUser.id_usuario}
                  onChange={(e) => setNewUser({ ...newUser, id_usuario: e.target.value })}
                  required
                  disabled={editingUser !== null}
                />
              </Form.Group>
              <Form.Group controlId="nombre">
                <Form.Label>Nombre:</Form.Label>
                <Form.Control
                  type="text"
                  value={newUser.nombre}
                  onChange={(e) => setNewUser({ ...newUser, nombre: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group controlId="tipo">
                <Form.Label>Tipo:</Form.Label>
                <Form.Control
                  as="select"
                  value={newUser.tipo}
                  onChange={(e) => setNewUser({ ...newUser, tipo: e.target.value })}
                  required
                >
                  <option value="">Seleccione un tipo</option>
                  <option value="tipo1">Operador</option>
                  <option value="tipo2">Conductor</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="password">
                <Form.Label>Contraseña:</Form.Label>
                <Form.Control
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  required={!editingUser}
                />
              </Form.Group>
              <br></br>
              <Button variant="warning" type="submit" className="mr-2">Guardar</Button>
              <Button variant="secondary" onClick={() => { setShowModal(false); setEditingUser(null); setNewUser({ id_usuario: '', nombre: '', email: '', tipo: '', password: '' }); }}>Cancelar</Button>
            </Form>
          </Modal.Body>
        </Modal>

        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id_usuario}>
                <td>{user.id_usuario}</td>
                <td>{user.nombre}</td>
                <td>{user.tipo === 'tipo1' ? 'Operador' : 'Conductor'}</td>
                <td>
                  <PencilSquare onClick={() => handleEdit(user)} style={{ cursor: 'pointer', marginRight: '10px' }} />
                  <Trash onClick={() => handleDelete(user.id_usuario)} style={{ cursor: 'pointer', color: 'red' }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserList;
