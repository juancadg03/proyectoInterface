require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("./db"); // Asegúrate que este pool sea de mysql2/promise

const app = express();
app.use(cors());
app.use(express.json());

// ---------------------------
//  GET: Facultades
// ---------------------------
app.get("/api/facultades", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT cod_fact, nomFacu FROM Facultad"
    );
    res.json(rows);
  } catch (err) {
    console.error("Error al obtener facultades:", err);
    res
      .status(500)
      .json({ error: "Error al obtener facultades" });
  }
});

// ---------------------------
//  POST: Registro de usuario
// ---------------------------
app.post("/api/register", async (req, res) => {
  try {
    const {
      cedula,
      password,
      tipo_rol, // "profesor" | "estudiante" | "encargado"
      nombre,
      codigo, // cod_prof o cod_Estu según el caso
      semestre,
      cod_fact, // para profesor
    } = req.body;

    if (!cedula || !password || !tipo_rol) {
      return res
        .status(400)
        .json({ error: "Faltan datos obligatorios (cedula, password, tipo_rol)" });
    }

    const tipoRolChar = tipo_rol
    if (!tipoRolChar) {
      return res.status(400).json({ error: "tipo_rol inválido" });
    }

    // Validaciones específicas por rol
    if (tipo_rol === "profesor") {
      if (!codigo || !nombre) {
        return res
          .status(400)
          .json({ error: "Faltan datos para profesor (codigo, nombre)" });
      }
    }

    if (tipo_rol === "estudiante") {
      if (!codigo || !nombre || semestre === undefined) {
        return res
          .status(400)
          .json({ error: "Faltan datos para estudiante (codigo, nombre, semestre)" });
      }
    }

    if (tipo_rol === "encargado") {
      if (!nombre) {
        return res
          .status(400)
          .json({ error: "Faltan datos para encargado (nombre)" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Insertar en Usuario
      // Inserción en la tabla Usuario
      await connection.execute(
        "INSERT INTO Usuario (cedula_usuario, password_hash, tipo_rol) VALUES (?, ?, ?)",
        [cedula, hashedPassword, tipo_rol]
      );
      
      // Insertar en tabla según rol
      if (tipo_rol === "profesor") {
        await connection.execute(
          "INSERT INTO Profesor (cod_prof, cedula_prof, nombreProf, cod_fact) VALUES (?, ?, ?, ?)",
          [codigo, cedula, nombre, cod_fact || null]
        );
      } else if (tipo_rol === "estudiante") {
        await connection.execute(
          "INSERT INTO Estudiante (cod_Estu, cedEstud, nombreEst, semestre) VALUES (?, ?, ?, ?)",
          [codigo, cedula, nombre, semestre]
        );
      } else if (tipo_rol === "encargado") {
        await connection.execute(
          "INSERT INTO Encargado (cedEncargado, nomEncargado) VALUES (?, ?)",
          [cedula, nombre]
        );
      }

      await connection.commit();
      connection.release();

      return res.json({
        ok: true,
        message: "Usuario registrado correctamente",
      });
    } catch (err) {
      await connection.rollback();
      connection.release();
      console.error("Error en transacción de registro:", err);

      // Manejo de duplicados
      if (err.code === "ER_DUP_ENTRY") {
        return res
          .status(409)
          .json({ error: "La cédula o el código ya están registrados" });
      }

      return res
        .status(500)
        .json({ error: "Error al registrar usuario" });
    }
  } catch (err) {
    console.error("Error general en /api/register:", err);
    return res
      .status(500)
      .json({ error: "Error interno en el registro" });
  }
});

// ---------------------------
//  POST: Login
// ---------------------------
app.post("/api/login", async (req, res) => {
  const { cedula, password } = req.body;

  if (!cedula || !password) {
    return res
      .status(400)
      .json({ error: "Faltan datos (cedula, password)" });
  }

  try {
    const [rows] = await pool.execute(
      "SELECT * FROM Usuario WHERE cedula_usuario = ?",
      [cedula]
    );

    const user = rows[0];
    if (!user) {
      return res
        .status(401)
        .json({ error: "Usuario no encontrado" });
    }

    const match = await bcrypt.compare(
      password,
      user.password_hash
    );
    if (!match) {
      return res
        .status(401)
        .json({ error: "Contraseña incorrecta" });
    }

    const tipo_rol = user.tipo_rol || "desconocido";

    const token = jwt.sign(
      {
        cedula: user.cedula_usuario,
        tipo_rol: user.tipo_rol,
      },
      process.env.JWT_SECRET || "dev_secret",
      { expiresIn: "8h" }
    );

    return res.json({
      ok: true,
      token,
      cedula: user.cedula_usuario,
      tipo_rol,
    });
  } catch (err) {
    console.error("Error en /api/login:", err);
    return res
      .status(500)
      .json({ error: "Error al hacer login" });
  }
});

// ---------------------------
//  SERVIDOR
// ---------------------------
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server corriendo en puerto ${PORT}`);
});
