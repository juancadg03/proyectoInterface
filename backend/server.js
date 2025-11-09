require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json()); // para leer JSON de React

// Registro de usuario
app.post('/api/register', async (req, res) => {
  const { cedula, password, tipo_rol } = req.body;
  if (!cedula || !password || !tipo_rol) return res.status(400).json({ error: 'Faltan datos' });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.execute(
      'INSERT INTO Usuario (cedula_usuario, password_hash, tipo_rol) VALUES (?, ?, ?)',
      [cedula, hashedPassword, tipo_rol]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al registrar' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  const { cedula, password } = req.body;
  if (!cedula || !password) return res.status(400).json({ error: 'Faltan datos' });

  try {
    const [rows] = await pool.execute('SELECT * FROM Usuario WHERE cedula_usuario = ?', [cedula]);
    const user = rows[0];
    if (!user) return res.status(401).json({ error: 'Usuario no encontrado' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Contraseña incorrecta' });

    const token = jwt.sign({ cedula: user.cedula_usuario, tipo_rol: user.tipo_rol }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al hacer login' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server corriendo en puerto ${PORT}`));
