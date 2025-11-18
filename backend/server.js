require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// Helper para formatear Date a DATETIME SQL
function toSQLDateTime(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    " " +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes()) +
    ":" +
    pad(date.getSeconds())
  );
}

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
    res.status(500).json({ error: "Error al obtener facultades" });
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
      tipo_rol,
      nombre,
      codigo,
      semestre,
      cod_fact,
    } = req.body;

    if (!cedula || !password || !tipo_rol) {
      return res
        .status(400)
        .json({ error: "Faltan datos obligatorios (cedula, password, tipo_rol)" });
    }

    const tipoRolChar = tipo_rol;
    if (!tipoRolChar) {
      return res.status(400).json({ error: "tipo_rol inválido" });
    }

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

      await connection.execute(
        "INSERT INTO Usuario (cedula_usuario, password_hash, tipo_rol) VALUES (?, ?, ?)",
        [cedula, hashedPassword, tipo_rol]
      );

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

      if (err.code === "ER_DUP_ENTRY") {
        return res
          .status(409)
          .json({ error: "La cédula o el código ya están registrados" });
      }

      return res.status(500).json({ error: "Error al registrar usuario" });
    }
  } catch (err) {
    console.error("Error general en /api/register:", err);
    return res.status(500).json({ error: "Error interno en el registro" });
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
//  GET: Obtener todos los juegos
// ---------------------------
app.get("/api/juegos", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT codJuego, nomJuego, tematica, duracion, cntJugadores, competencias, idioma, descripcion, rangoEdad, dificultad, numCopias FROM Juego ORDER BY nomJuego"
    );
    res.json(rows);
  } catch (err) {
    console.error("Error al obtener juegos:", err);
    res.status(500).json({ error: "Error al obtener juegos" });
  }
});

// ---------------------------
//  POST: Añadir juego
// ---------------------------
app.post("/api/juegos", async (req, res) => {
  try {
    const {
      codJuego,
      nomJuego,
      tematica,
      duracion,
      cntJugadores,
      competencias,
      idioma,
      descripcion,
      rangoEdad,
      dificultad,
      numCopias,
      cedEncargado,
    } = req.body;

    if (!codJuego || !nomJuego || !tematica || !duracion || !cntJugadores || !competencias || !idioma || !descripcion || !rangoEdad || !dificultad || !numCopias) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    if (numCopias < 3) {
      return res.status(400).json({ error: "El número de copias debe ser mínimo 3" });
    }

    await pool.execute(
      "INSERT INTO Juego (codJuego, nomJuego, tematica, duracion, cntJugadores, competencias, idioma, descripcion, rangoEdad, dificultad, numCopias) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [codJuego, nomJuego, tematica, duracion, cntJugadores, competencias, idioma, descripcion, rangoEdad, dificultad, numCopias]
    );

    res.status(201).json({ ok: true, message: "Juego añadido exitosamente" });
  } catch (err) {
    console.error("Error al añadir juego:", err);

    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "El código de juego ya existe" });
    }

    res.status(500).json({ error: "Error al añadir juego" });
  }
});

// ---------------------------
//  DELETE: Eliminar juego
// ---------------------------
app.delete("/api/juegos/:codJuego", async (req, res) => {
  try {
    const { codJuego } = req.params;

    const [result] = await pool.execute(
      "DELETE FROM Juego WHERE codJuego = ?",
      [codJuego]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Juego no encontrado" });
    }

    res.json({ ok: true, message: "Juego eliminado exitosamente" });
  } catch (err) {
    console.error("Error al eliminar juego:", err);
    res.status(500).json({ error: "Error al eliminar juego" });
  }
});

// ---------------------------
//  GET: Estadísticas de un juego
// ---------------------------
app.get("/api/estadisticas/:codJuego", async (req, res) => {
  try {
    const { codJuego } = req.params;

    const [rows] = await pool.execute(
      `SELECT 
        j.codJuego,
        j.nomJuego,
        COALESCE(AVG(e.ranking), 0) as rankingPromedio,
        COUNT(DISTINCT exp.cod_Expe) as cntUsos
      FROM Juego j
      LEFT JOIN Experiencia exp ON j.codJuego = exp.codJuego
      LEFT JOIN Evaluaciones e ON exp.cod_evalu = e.cod_Eval
      WHERE j.codJuego = ?
      GROUP BY j.codJuego, j.nomJuego`,
      [codJuego]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Juego no encontrado" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error al obtener estadísticas:", err);
    res.status(500).json({ error: "Error al obtener estadísticas" });
  }
});

// =======================================================
//        GESTIÓN DE RESERVAS (ENCARGADO)
// =======================================================

// GET: listar horarios reservados
app.get("/api/encargado/horarios", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT cod_Expe, fechaHora, horaFin, tiempoDisponible, cod_Prof, codJuego, reservado
       FROM Experiencia
       WHERE reservado = 1
       ORDER BY fechaHora`
    );
    res.json(rows);
  } catch (err) {
    console.error("Error al obtener horarios:", err);
    res.status(500).json({ ok: false, message: "Error al obtener horarios" });
  }
});

// POST: crear una reserva nueva
// cod_Expe se calcula manualmente empezando en 7001
app.post("/api/encargado/crear-horario", async (req, res) => {
  try {
    const { fechaISO, tiempoDisponible, codProf, codJuego, cedEncargado } = req.body;

    if (!fechaISO || !tiempoDisponible || !codProf || !codJuego || !cedEncargado) {
      return res
        .status(400)
        .json({ ok: false, message: "Faltan datos para crear la reserva" });
    }

    const minutos = parseInt(tiempoDisponible, 10);
    if (isNaN(minutos) || minutos <= 0) {
      return res
        .status(400)
        .json({ ok: false, message: "Tiempo disponible inválido" });
    }

    const inicio = new Date(fechaISO);
    if (isNaN(inicio.getTime())) {
      return res
        .status(400)
        .json({ ok: false, message: "Fecha/hora inválida" });
    }
    const fin = new Date(inicio.getTime() + minutos * 60000);

    // Validación horario permitido (8–13 o 14–17)
    const hIni = inicio.getHours() + inicio.getMinutes() / 60;
    const hFin = fin.getHours() + fin.getMinutes() / 60;
    const permitido =
      (hIni >= 8 && hFin <= 13) || (hIni >= 14 && hFin <= 17);

    if (!permitido) {
      return res
        .status(400)
        .json({ ok: false, message: "El horario debe estar dentro de 8–13 o 14–17." });
    }

    const fechaHoraSQL = toSQLDateTime(inicio);
    const horaFinSQL = toSQLDateTime(fin);

    // Validación real de solapamiento en SQL
    const [choque] = await pool.execute(
      `SELECT *
       FROM Experiencia
       WHERE reservado = 1
         AND DATE(fechaHora) = DATE(?)
         AND (? < horaFin AND ? > fechaHora)`,
      [fechaHoraSQL, fechaHoraSQL, horaFinSQL]
    );

    if (choque.length > 0) {
      return res
        .status(400)
        .json({ ok: false, message: "Ese intervalo ya está reservado." });
    }

    // Siguiente código empezando en 7001
    const [maxRows] = await pool.execute(
      "SELECT COALESCE(MAX(cod_Expe), 7000) AS maxCode FROM Experiencia"
    );
    const nextCode = maxRows[0].maxCode + 1;

    await pool.execute(
      `INSERT INTO Experiencia
       (cod_Expe, fechaHora, horaFin, tiempoDisponible, cod_Prof, cod_Estud, codJuego, CedulaEncarg, reservado)
       VALUES (?, ?, ?, ?, ?, NULL, ?, ?, 1)`,
      [nextCode, fechaHoraSQL, horaFinSQL, minutos, codProf, codJuego, cedEncargado]
    );

    return res.json({ ok: true, cod_Expe: nextCode });
  } catch (err) {
    console.error("Error al crear horario:", err);
    return res.status(500).json({ ok: false, message: "Error al crear el horario" });
  }
});

// PUT: modificar una reserva
app.put("/api/encargado/modificar-reserva/:codExpe", async (req, res) => {
  try {
    const { codExpe } = req.params;
    const { fechaISO, tiempoDisponible, codProf, codJuego } = req.body;

    if (!fechaISO || !tiempoDisponible || !codProf || !codJuego) {
      return res
        .status(400)
        .json({ ok: false, message: "Faltan datos para modificar la reserva" });
    }

    const minutos = parseInt(tiempoDisponible, 10);
    if (isNaN(minutos) || minutos <= 0) {
      return res
        .status(400)
        .json({ ok: false, message: "Tiempo disponible inválido" });
    }

    const inicio = new Date(fechaISO);
    if (isNaN(inicio.getTime())) {
      return res
        .status(400)
        .json({ ok: false, message: "Fecha/hora inválida" });
    }
    const fin = new Date(inicio.getTime() + minutos * 60000);

    const hIni = inicio.getHours() + inicio.getMinutes() / 60;
    const hFin = fin.getHours() + fin.getMinutes() / 60;
    const permitido =
      (hIni >= 8 && hFin <= 13) || (hIni >= 14 && hFin <= 17);

    if (!permitido) {
      return res
        .status(400)
        .json({ ok: false, message: "El horario debe estar dentro de 8–13 o 14–17." });
    }

    const fechaHoraSQL = toSQLDateTime(inicio);
    const horaFinSQL = toSQLDateTime(fin);

    // Validar solapamiento ignorando esta misma reserva
    const [choque] = await pool.execute(
      `SELECT *
       FROM Experiencia
       WHERE reservado = 1
         AND cod_Expe <> ?
         AND DATE(fechaHora) = DATE(?)
         AND (? < horaFin AND ? > fechaHora)`,
      [codExpe, fechaHoraSQL, fechaHoraSQL, horaFinSQL]
    );

    if (choque.length > 0) {
      return res
        .status(400)
        .json({ ok: false, message: "El intervalo editado se solapa con otra reserva." });
    }

    const [result] = await pool.execute(
      `UPDATE Experiencia
       SET fechaHora = ?, horaFin = ?, tiempoDisponible = ?, cod_Prof = ?, codJuego = ?
       WHERE cod_Expe = ?`,
      [fechaHoraSQL, horaFinSQL, minutos, codProf, codJuego, codExpe]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Reserva no encontrada" });
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error("Error al modificar reserva:", err);
    return res.status(500).json({ ok: false, message: "Error al modificar la reserva" });
  }
});

// DELETE: cancelar/eliminar una reserva
app.delete("/api/encargado/cancelar-reserva/:codExpe", async (req, res) => {
  try {
    const { codExpe } = req.params;

    const [result] = await pool.execute(
      "DELETE FROM Experiencia WHERE cod_Expe = ?",
      [codExpe]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Reserva no encontrada" });
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error("Error al cancelar reserva:", err);
    return res.status(500).json({ ok: false, message: "Error al cancelar la reserva" });
  }
});
app.post("/api/profesor/solicitar-reserva", async (req, res) => {
  try {
    const { codProf, codJuego, fechaHora, tiempoDisponible } = req.body;

    if (!codProf || !codJuego || !fechaHora || !tiempoDisponible) {
      return res.json({ ok: false, message: "Datos incompletos" });
    }

    await pool.execute(`
      INSERT INTO SolicitudesReserva (cod_Prof, codJuego, fechaHora, tiempoDisponible)
      VALUES (?, ?, ?, ?)
    `, [codProf, codJuego, fechaHora, tiempoDisponible]);

    return res.json({ ok: true });

  } catch (err) {
    console.error(err);
    return res.json({ ok: false, message: "Error al enviar solicitud" });
  }
});
app.post("/api/encargado/aceptar-solicitud/:id", async (req, res) => {
  const { id } = req.params;

  // 1. Obtener solicitud
  const [rows] = await pool.execute("SELECT * FROM SolicitudesReserva WHERE id = ?", [id]);

  if (rows.length === 0) return res.json({ ok: false, message: "No existe solicitud" });

  const sol = rows[0];

  // 2. Crear reserva en Experiencia
  const [maxRows] = await pool.execute(
    "SELECT COALESCE(MAX(cod_Expe),7000) AS maxCode FROM Experiencia"
  );
  const nextCode = maxRows[0].maxCode + 1;

  await pool.execute(`
    INSERT INTO Experiencia (cod_Expe, fechaHora, tiempoDisponible, cod_Prof, cod_Estud, codJuego, CedulaEncarg, reservado)
    VALUES (?, ?, ?, ?, NULL, ?, ?, 1)
  `, [nextCode, sol.fechaHora, sol.tiempoDisponible, sol.cod_Prof, sol.codJuego, req.body.cedEncargado]);

  // 3. Cambiar estado
  await pool.execute("UPDATE SolicitudesReserva SET estado='aceptada' WHERE id=?", [id]);

  res.json({ ok: true });
});
app.post("/api/encargado/rechazar-solicitud/:id", async (req, res) => {
  await pool.execute(
    "UPDATE SolicitudesReserva SET estado='rechazada' WHERE id=?",
    [req.params.id]
  );
  res.json({ ok: true });
});

app.get("/api/juegos/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.execute(
      "SELECT * FROM Juego WHERE codJuego = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ ok: false, message: "Juego no encontrado" });
    }

    return res.json(rows[0]);
  } catch (err) {
    console.error("Error cargando juego:", err);
    return res.status(500).json({ ok: false, message: "Error del servidor" });
  }
});


// ---------------------------
//  SERVIDOR
// ---------------------------
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server corriendo en puerto ${PORT}`);
});

