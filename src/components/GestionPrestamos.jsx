import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

export default function GestionPrestamos() {
  const navigate = useNavigate();

  const [horarios, setHorarios] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [juegos, setJuegos] = useState([]);

  const [fechaHora, setFechaHora] = useState("");
  const [tiempoDisponible, setTiempoDisponible] = useState("");
  const [codProf, setCodProf] = useState("");
  const [juegoSeleccionado, setJuegoSeleccionado] = useState("");

  const [editData, setEditData] = useState({
    cod_Expe: null,
    fechaHora: "",
    tiempoDisponible: "",
    codProf: "",
    codJuego: ""
  });

  const [hoveredId, setHoveredId] = useState(null);

  /* ===== Helpers de fecha ===== */
  const toInputDatetimeLocal = (value) => {
    if (!value) return "";
    const d = new Date(value);
    if (isNaN(d.getTime())) return "";
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
      d.getDate()
    )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const calcularFin = (inicioISO, minutos) => {
    if (!inicioISO || !minutos) return null;
    const d = new Date(inicioISO);
    if (isNaN(d.getTime())) return null;
    return new Date(d.getTime() + minutos * 60000);
  };

  const estaDentroHorarioLaboral = (inicio, fin) => {
    if (!inicio || !fin) return false;

    const sameDay = inicio.toDateString() === fin.toDateString();
    if (!sameDay) return false;

    const hIni = inicio.getHours() + inicio.getMinutes() / 60;
    const hFin = fin.getHours() + fin.getMinutes() / 60;

    const enManana = hIni >= 8 && hFin <= 13;
    const enTarde = hIni >= 14 && hFin <= 17;

    return enManana || enTarde;
  };

  const seSolapaConExistentes = (inicio, fin, ignorarCodExpe = null) => {
    if (!inicio || !fin) return false;

    for (let i = 0; i < horarios.length; i++) {
      const h = horarios[i];
      if (ignorarCodExpe !== null && h.cod_Expe === ignorarCodExpe) continue;

      const inicioH = new Date(h.fechaHora);
      const finH = h.horaFin ? new Date(h.horaFin) : null;

      if (!finH) continue;

      const sameDay = inicio.toDateString() === inicioH.toDateString();
      if (!sameDay) continue;

      if (inicio < finH && fin > inicioH) return true;
    }
    return false;
  };

  /* ===== Cargar data ===== */
  const cargarHorarios = async () => {
    const res = await fetch("http://localhost:4000/api/encargado/horarios");
    setHorarios(await res.json());
  };

  const cargarSolicitudes = async () => {
    const res = await fetch("http://localhost:4000/api/encargado/solicitudes");
    setSolicitudes(await res.json());
  };

  const cargarJuegos = async () => {
    const res = await fetch("http://localhost:4000/api/juegos");
    setJuegos(await res.json());
  };

  useEffect(() => {
    cargarHorarios();
    cargarSolicitudes();
    cargarJuegos();
  }, []);

  /* ===== Crear reserva manual ===== */
  const crearReserva = async () => {
    if (!fechaHora || !codProf || !juegoSeleccionado || !tiempoDisponible) {
      alert("Complete todos los campos.");
      return;
    }

    const minutos = parseInt(tiempoDisponible, 10);
    if (isNaN(minutos) || minutos <= 0) {
      alert("Duración inválida.");
      return;
    }

    const inicio = new Date(fechaHora);
    const fin = calcularFin(fechaHora, minutos);

    if (!estaDentroHorarioLaboral(inicio, fin)) {
      alert("Debe estar en horario del centro de juegos.");
      return;
    }

    if (seSolapaConExistentes(inicio, fin)) {
      alert("Intervalo solapado con otra reserva.");
      return;
    }

    const cedEncargado =
      localStorage.getItem("cedula") ||
      localStorage.getItem("cedEncargado");

    const res = await fetch("http://localhost:4000/api/encargado/crear-horario", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fechaISO: fechaHora,
        tiempoDisponible: minutos,
        codProf,
        codJuego: juegoSeleccionado,
        cedEncargado
      })
    });

    const data = await res.json();
    if (data.ok) {
      alert("Reserva creada.");
      setFechaHora("");
      setTiempoDisponible("");
      setCodProf("");
      setJuegoSeleccionado("");
      cargarHorarios();
    } else {
      alert(data.message);
    }
  };

/* ===== Aceptar solicitud ===== */
const aceptarSolicitud = async (sol) => {
  const cedEncargado = localStorage.getItem("cedEncargado");

  if (!cedEncargado) {
    alert("ERROR: No se encontró cedEncargado. Inicia sesión nuevamente.");
    return;
  }

  const res = await fetch(
    `http://localhost:4000/api/encargado/aceptar-solicitud/${sol.id}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cedEncargado }),
    }
  );

  const data = await res.json();

  if (data.ok) {
    alert("Solicitud aceptada.");
    cargarSolicitudes();
    cargarHorarios();
  } else {
    alert(data.message);
  }
};


  /* ===== Rechazar solicitud ===== */
  const rechazarSolicitud = async (id) => {
  const res = await fetch(
    `http://localhost:4000/api/encargado/rechazar-solicitud/${id}`,
    { method: "POST" }
  );

  const data = await res.json();

  if (data.ok) {
    alert("Solicitud rechazada.");
    cargarSolicitudes();
  } else {
    alert(data.message);
  }
};

  /* ===== Cancelar reserva ===== */
  const cancelarReserva = async (cod_Expe) => {
    if (!window.confirm("¿Cancelar esta reserva?")) return;

    const res = await fetch(
      `http://localhost:4000/api/encargado/cancelar-reserva/${cod_Expe}`,
      { method: "DELETE" }
    );
    const data = await res.json();

    if (data.ok) {
      alert("Reserva cancelada.");
      cargarHorarios();
    }
  };

  /* ===== Edición ===== */
  const iniciarEdicion = (h) => {
    setEditData({
      cod_Expe: h.cod_Expe,
      fechaHora: toInputDatetimeLocal(h.fechaHora),
      tiempoDisponible: h.tiempoDisponible,
      codProf: h.cod_Prof,
      codJuego: h.codJuego
    });
  };

  const guardarEdicion = async () => {
    const minutos = parseInt(editData.tiempoDisponible, 10);
    const inicio = new Date(editData.fechaHora);
    const fin = calcularFin(editData.fechaHora, minutos);

    if (seSolapaConExistentes(inicio, fin, editData.cod_Expe)) {
      alert("Intervalo solapado.");
      return;
    }

    const res = await fetch(
      `http://localhost:4000/api/encargado/modificar-reserva/${editData.cod_Expe}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fechaISO: editData.fechaHora,
          tiempoDisponible: minutos,
          codProf: editData.codProf,
          codJuego: editData.codJuego
        })
      }
    );

    const data = await res.json();
    if (data.ok) {
      alert("Reserva modificada.");
      setEditData({
        cod_Expe: null,
        fechaHora: "",
        tiempoDisponible: "",
        codProf: "",
        codJuego: ""
      });
      cargarHorarios();
    }
  };

  const finCreacion = calcularFin(
    fechaHora,
    parseInt(tiempoDisponible || "0", 10)
  );

  return (
  <div className="reservas-wrapper">

    {/* Botón volver */}
    <button className="back-btn" onClick={() => navigate("/dashboard-encargado")}>
      <IoArrowBack size={28} />
    </button>

    {/* Título */}
    <h1 className="reservas-title">Gestión de Reservas y Solicitudes</h1>

    <div className="reservas-grid">

      {/* =====================================================
           FORMULARIO CREAR RESERVA
      ====================================================== */}
      <div className="card-glass" style={{ width: "32%" }}>
        <h2 className="section-title">Crear reserva</h2>

        <label>Fecha y hora inicio</label>
        <input
          type="datetime-local"
          className="input-glass"
          value={fechaHora}
          onChange={(e) => setFechaHora(e.target.value)}
        />

        <label style={{ marginTop: "8px" }}>Duración (min)</label>
        <input
          type="number"
          className="input-glass"
          value={tiempoDisponible}
          onChange={(e) => setTiempoDisponible(e.target.value)}
        />

        {finCreacion && (
          <p style={{ color: "white", marginTop: "5px" }}>
            Termina: {finCreacion.toLocaleString()}
          </p>
        )}

        <label style={{ marginTop: "8px" }}>Código profesor</label>
        <input
          type="text"
          className="input-glass"
          value={codProf}
          onChange={(e) => setCodProf(e.target.value)}
        />

        <label style={{ marginTop: "8px" }}>Juego</label>
        <select
          className="input-glass"
          value={juegoSeleccionado}
          onChange={(e) => setJuegoSeleccionado(e.target.value)}
        >
          <option value="">Seleccione...</option>
          {juegos.map((j) => (
            <option value={j.codJuego} key={j.codJuego}>
              {j.nomJuego}
            </option>
          ))}
        </select>

        <button
          className="btn-primary"
          style={{ marginTop: "20px", width: "100%" }}
          onClick={crearReserva}
        >
          Crear reserva
        </button>
      </div>

      {/* =====================================================
           SOLICITUDES DE PROFESORES
      ====================================================== */}
      <div className="card-glass" style={{ width: "28%" }}>
        <h2 className="section-title">Solicitudes de profesores</h2>

        {solicitudes.length === 0 && (
          <p style={{ color: "#D0D0D0" }}>No hay solicitudes.</p>
        )}

        {solicitudes.map((s) => {
          const juego = juegos.find((j) => j.codJuego === s.codJuego);
          const inicio = new Date(s.fechaHora);
          const fin = calcularFin(s.fechaHora, s.tiempoDisponible);

          return (
            <div className="card-white" key={s.id}>
              <p><b>Profesor:</b> {s.cod_Prof}</p>
              <p><b>Juego:</b> {juego?.nomJuego}</p>
              <p><b>Inicio:</b> {inicio.toLocaleString()}</p>
              <p><b>Fin:</b> {fin.toLocaleString()}</p>
              <p><b>Duración:</b> {s.tiempoDisponible} min</p>

              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button
                  className="btn-primary"
                  style={{ flex: 1 }}
                  onClick={() => aceptarSolicitud(s)}
                >
                  Aceptar
                </button>

                <button
                  className="btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => rechazarSolicitud(s.id)}
                >
                  Rechazar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* =====================================================
           RESERVAS EXISTENTES
      ====================================================== */}
      <div className="card-glass" style={{ width: "32%" }}>
        <h2 className="section-title">Reservas existentes</h2>

        {horarios.map((h) => {
          const juego = juegos.find((j) => j.codJuego === h.codJuego);
          const inicio = new Date(h.fechaHora);
          const fin = h.horaFin ? new Date(h.horaFin) : null;

          return (
            <div className="card-white" key={h.cod_Expe} >
              <p><b>Reserva:</b> E{h.cod_Expe}</p>
              <p><b>Inicio:</b> {inicio.toLocaleString()}</p>
              <p><b>Fin:</b> {fin?.toLocaleString()}</p>
              <p><b>Profesor:</b> {h.cod_Prof}</p>
              <p><b>Duración:</b> {h.tiempoDisponible} min</p>
              <p><b>Juego:</b> {juego?.nomJuego}</p>

              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button
                  className="btn-secondary"
                  style={{color:"black"}}
                  onClick={() => iniciarEdicion(h)}
                >
                  Editar
                </button>
                <button
                  className="btn-secondary"
                  style={{color:"black"}}
                  onClick={() => cancelarReserva(h.cod_Expe)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          );
        })}

        {/* ---------- FORMULARIO EDITAR RESERVA ---------- */}
        {editData.cod_Expe && (
          <div className="card-edit">
            <h3 className="section-title">
              Editar reserva E{editData.cod_Expe}
            </h3>

            <label>Fecha y hora inicio</label>
            <input
              type="datetime-local"
              className="input-glass"
              value={editData.fechaHora}
              onChange={(e) =>
                setEditData((p) => ({ ...p, fechaHora: e.target.value }))
              }
            />

            <label style={{ marginTop: "10px" }}>Duración (min)</label>
            <input
              type="number"
              className="input-glass"
              value={editData.tiempoDisponible}
              onChange={(e) =>
                setEditData((p) => ({ ...p, tiempoDisponible: e.target.value }))
              }
            />

            <label style={{ marginTop: "10px" }}>Profesor</label>
            <input
              type="text"
              className="input-glass"
              value={editData.codProf}
              onChange={(e) =>
                setEditData((p) => ({ ...p, codProf: e.target.value }))
              }
            />

            <label style={{ marginTop: "10px" }}>Juego</label>
            <select
              className="input-glass"
              value={editData.codJuego}
              onChange={(e) =>
                setEditData((p) => ({ ...p, codJuego: e.target.value }))
              }
            >
              <option value="">Seleccione...</option>
              {juegos.map((j) => (
                <option key={j.codJuego} value={j.codJuego} >
                  {j.nomJuego}
                </option>
              ))}
            </select>

            <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
              <button className="btn-primary" onClick={guardarEdicion}>
                Guardar cambios
              </button>
              <button
                className="btn-secondary"
                onClick={() =>
                  setEditData({
                    cod_Expe: null,
                    fechaHora: "",
                    tiempoDisponible: "",
                    codProf: "",
                    codJuego: ""
                  })
                }
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

}
