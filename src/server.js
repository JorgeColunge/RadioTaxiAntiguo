require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const pool = require('./config/dbConfig');
const http = require('http'); 
const socketIo = require('socket.io');

const app = express();

// Configuración de Socket.io utilizando HTTP
const httpServer = http.createServer(app);
const io = require('socket.io')(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log(`Usuario conectado: ${socket.id}`);

  socket.on('registerUser', async (id_usuario) => {
    try {
      await pool.query('UPDATE usuarios SET socket_id = $1 WHERE id_usuario = $2', [socket.id, id_usuario]);
      console.log(`Usuario ${id_usuario} registrado con socket ID ${socket.id}`);
    } catch (err) {
      console.error('Error al registrar socket ID:', err);
    }
  });

  socket.on('disconnect', async () => {
    try {
      await pool.query('UPDATE usuarios SET socket_id = NULL WHERE socket_id = $1', [socket.id]);
      console.log(`Socket ID ${socket.id} ha sido removido`);
    } catch (err) {
      console.error('Error al remover socket ID:', err);
    }
  });
});

app.use(express.json());
app.use(cors());

const geolocationRoutes = require('./routes/geolocationRoutes')(io);
const authRoutes = require('./routes/authRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/geolocation', geolocationRoutes);

app.get('/', (req, res) => {
  res.send('¡Hola Mundo!');
});

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'build')));

// Catch-all para enviar index.html para cualquier ruta que no coincida con las rutas API
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/db', async (req, res) => {
  try {
    const response = await pool.query('SELECT NOW()');
    res.json(response.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al conectar con la base de datos');
  }
});

// Escucha en el puerto asignado por Render o en un puerto predeterminado para desarrollo local
const PORT = process.env.PORT || 3002;
httpServer.listen(PORT, () => {
  console.log(`Servidor corriendo en este puerto ${PORT}`);
});

module.exports = { app, httpServer, io };
