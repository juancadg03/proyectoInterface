import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

export default function GestionPrestamos() {
  const navigate = useNavigate();

  const [horarios, setHorarios] = useState([]);
  const [juegos, setJuegos] = useState([]);

  // Datos para crear reserva
  const [fechaHora, setFechaHora] = useState("");
  const [tiempoDisponible, setTiempoDisponible] = useState("");
  const [codProf, setCodProf] = useState("");
  const [juegoSeleccionado, setJuegoSeleccionado] = useState("");

  // Datos para edición
  const [editData, setEditData] = useState({
    cod_Expe: null,
    fechaHora: "",
    tiempoDisponible: "",
    codProf: "",
    codJuego: ""
  });

  const [hoveredId, setHoveredId] = useState(null);

  // ===== Helpers de fecha =====
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
      if (ignorarCodExpe !== null && h.cod_Expe === ignorarCodExpe) {
        continue;
      }

      const inicioH = new Date(h.fechaHora);
      const finH = h.horaFin ? new Date(h.horaFin) : null;

      if (isNaN(inicioH.getTime()) || !finH || isNaN(finH.getTime())) {
        continue;
      }

      const sameDay = inicio.toDateString() === inicioH.toDateString();
      if (!sameDay) continue;

      // Solapamiento: inicio < finH && fin > inicioH
      if (inicio < finH && fin > inicioH) {
        return true;
      }
    }
    return false;
  };

  // ===== Carga de datos =====
  const cargarHorarios = async () => {
    const res = await fetch("http://localhost:4000/api/encargado/horarios");
    const data = await res.json();
    setHorarios(data);
  };

  const cargarJuegos = async () => {
    const res = await fetch("http://localhost:4000/api/juegos");
    const data = await res.json();
    setJuegos(data);
  };

  useEffect(() => {
    cargarHorarios();
    cargarJuegos();
  }, []);

  // ===== Crear reserva =====
  const crearReserva = async () => {
    if (!fechaHora || !codProf || !juegoSeleccionado || !tiempoDisponible) {
      alert("Complete fecha, profesor, juego y tiempo disponible.");
      return;
    }

    const minutos = parseInt(tiempoDisponible, 10);
    if (isNaN(minutos) || minutos <= 0) {
      alert("El tiempo disponible debe ser un número de minutos mayor que cero.");
      return;
    }

    const inicio = new Date(fechaHora);
    const fin = calcularFin(fechaHora, minutos);

    if (!estaDentroHorarioLaboral(inicio, fin)) {
      alert("El intervalo debe estar completamente dentro de 8:00–13:00 o 14:00–17:00.");
      return;
    }

    if (seSolapaConExistentes(inicio, fin, null)) {
      alert("Ya existe una experiencia en ese intervalo de tiempo.");
      return;
    }

    const cedEncargado =
      localStorage.getItem("cedula") ||
      localStorage.getItem("cedula_usuario") ||
      localStorage.getItem("cedEncargado");

    const res = await fetch("http://localhost:4000/api/encargado/crear-horario", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fechaISO: fechaHora,          // para cálculos en el backend
        tiempoDisponible: minutos,
        codProf,
        codJuego: juegoSeleccionado,
        cedEncargado
      })
    });

    const data = await res.json();

    if (data.ok) {
      alert("Horario reservado");
      setFechaHora("");
      setTiempoDisponible("");
      setCodProf("");
      setJuegoSeleccionado("");
      cargarHorarios();
    } else {
      alert(data.message || "Error al reservar");
    }
  };

  // ===== Cancelar =====
  const cancelarReserva = async (cod_Expe) => {
    if (!window.confirm("¿Seguro de cancelar esta reserva?")) return;

    const res = await fetch(
      `http://localhost:4000/api/encargado/cancelar-reserva/${cod_Expe}`,
      { method: "DELETE" }
    );
    const data = await res.json();

    if (data.ok) {
      alert("Reserva cancelada");
      cargarHorarios();
    } else {
      alert(data.message || "Error al cancelar la reserva");
    }
  };

  // ===== Edición =====
  const iniciarEdicion = (h) => {
    setEditData({
      cod_Expe: h.cod_Expe,
      fechaHora: toInputDatetimeLocal(h.fechaHora),
      tiempoDisponible: h.tiempoDisponible ? String(h.tiempoDisponible) : "",
      codProf: h.cod_Prof || "",
      codJuego: h.codJuego || ""
    });
  };

  const guardarEdicion = async () => {
    if (
      !editData.cod_Expe ||
      !editData.fechaHora ||
      !editData.tiempoDisponible ||
      !editData.codProf ||
      !editData.codJuego
    ) {
      alert("Complete todos los campos de la edición.");
      return;
    }

    const minutos = parseInt(editData.tiempoDisponible, 10);
    if (isNaN(minutos) || minutos <= 0) {
      alert("El tiempo disponible debe ser un número de minutos mayor que cero.");
      return;
    }

    const inicio = new Date(editData.fechaHora);
    const fin = calcularFin(editData.fechaHora, minutos);

    if (!estaDentroHorarioLaboral(inicio, fin)) {
      alert("El intervalo editado debe estar dentro de 8:00–13:00 o 14:00–17:00.");
      return;
    }

    if (seSolapaConExistentes(inicio, fin, editData.cod_Expe)) {
      alert("El intervalo editado se solapa con otra experiencia.");
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
      alert("Reserva modificada");
      setEditData({
        cod_Expe: null,
        fechaHora: "",
        tiempoDisponible: "",
        codProf: "",
        codJuego: ""
      });
      cargarHorarios();
    } else {
      alert(data.message || "Error al modificar la reserva");
    }
  };

  // Fin estimado mostrado en el formulario de creación
  const finCreacion = calcularFin(
    fechaHora,
    parseInt(tiempoDisponible || "0", 10)
  );

  return (
    <div
      className="gp-wrapper"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "#18004d",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        overflowY: "auto",
        overflowX: "hidden",
        padding: "40px 0",
        boxSizing: "border-box"
      }}
    >
      {/* Logo fijo abajo-izquierda */}
      <img
        src="/logopuj.PNG"
        alt="Logo PUJ"
        style={{
          position: "fixed",
          bottom: "20px",
          left: "20px",
          width: "110px",
          opacity: 0.9
        }}
      />

      <div
        className="gp-container"
        style={{
          width: "90%",
          maxWidth: "1300px",
          display: "flex",
          gap: "40px"
        }}
      >
        {/* COLUMNA IZQUIERDA */}
        <div
          className="gp-left"
          style={{
            width: "40%",
            background: "rgba(255,255,255,0.12)",
            padding: "25px",
            borderRadius: "12px",
            position: "relative"
          }}
        >
          {/* Botón back */}
          <button
            className="gp-back-button"
            onClick={() => navigate("/dashboard-encargado")}
            style={{
              position: "absolute",
              top: "15px",
              left: "15px",
              background: "none",
              border: "none",
              color: "#ffffff",
              cursor: "pointer"
            }}
          >
            <IoArrowBack size={25} />
          </button>

          <h2
            style={{
              color: "#7DF9FF",
              textAlign: "center",
              marginTop: "40px",
              marginBottom: "10px"
            }}
          >
            Gestión de Reservas
          </h2>

          <p
            style={{
              color: "white",
              marginBottom: "20px",
              textAlign: "center",
              fontSize: "0.95rem"
            }}
          >
            Horario del Centro de Juegos:
            <br />
            <strong>8:00 a 13:00</strong> y <strong>14:00 a 17:00</strong>
          </p>

          <div
            className="seccion-form"
            style={{ display: "flex", flexDirection: "column", gap: "8px" }}
          >
            <h3
              style={{
                color: "white",
                marginBottom: "10px",
                textAlign: "left"
              }}
            >
              Reservar horario
            </h3>

            {/* Fecha/hora inicio */}
            <label
              style={{ color: "white", fontSize: "0.9rem", marginTop: "5px" }}
            >
              Fecha y hora de inicio
            </label>
            <input
              type="datetime-local"
              className="login-input"
              value={fechaHora}
              onChange={(e) => setFechaHora(e.target.value)}
            />

            {/* Duración */}
            <label
              style={{ color: "white", fontSize: "0.9rem", marginTop: "10px" }}
            >
              Duración de la experiencia (minutos)
            </label>
            <input
              type="number"
              className="login-input"
              placeholder="Ej: 60"
              value={tiempoDisponible}
              onChange={(e) => setTiempoDisponible(e.target.value)}
            />

            {finCreacion && !isNaN(finCreacion.getTime()) && (
              <p
                style={{
                  color: "#a4cfff",
                  fontSize: "0.85rem",
                  marginTop: "5px"
                }}
              >
                Hora de fin estimada:{" "}
                <strong>{finCreacion.toLocaleString()}</strong>
              </p>
            )}

            {/* Profesor */}
            <label
              style={{ color: "white", fontSize: "0.9rem", marginTop: "10px" }}
            >
              Código del profesor
            </label>
            <input
              type="text"
              className="login-input"
              placeholder="Ej: 102030"
              value={codProf}
              onChange={(e) => setCodProf(e.target.value)}
            />

            {/* Juego */}
            <label
              style={{ color: "white", fontSize: "0.9rem", marginTop: "10px" }}
            >
              Juego a utilizar
            </label>
            <select
              className="login-input"
              value={juegoSeleccionado}
              onChange={(e) => setJuegoSeleccionado(e.target.value)}
            >
              <option value="">Seleccione un juego</option>
              {juegos.map((j) => (
                <option key={j.codJuego} value={j.codJuego}>
                  {j.nomJuego}
                </option>
              ))}
            </select>

            {/* Botón centrado */}
            <div
              className="btn-wrapper"
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                marginTop: "20px"
              }}
            >
              <button className="btn primary" onClick={crearReserva}>
                Reservar horario
              </button>
            </div>
          </div>

          {/* FORMULARIO DE EDICIÓN */}
          {editData.cod_Expe && (
            <div
              style={{
                marginTop: "30px",
                padding: "12px",
                borderRadius: "8px",
                backgroundColor: "rgba(0,0,0,0.5)"
              }}
            >
              <h3 style={{ color: "#7DF9FF", marginBottom: "10px" }}>
                Modificar Reserva (E{editData.cod_Expe})
              </h3>

              <label style={{ color: "white", fontSize: "0.9rem" }}>
                Fecha y hora de inicio
              </label>
              <input
                type="datetime-local"
                className="login-input"
                value={editData.fechaHora}
                onChange={(e) =>
                  setEditData((p) => ({ ...p, fechaHora: e.target.value }))
                }
              />

              <label
                style={{ color: "white", fontSize: "0.9rem", marginTop: "10px" }}
              >
                Duración (minutos)
              </label>
              <input
                type="number"
                className="login-input"
                placeholder="Ej: 60"
                value={editData.tiempoDisponible}
                onChange={(e) =>
                  setEditData((p) => ({
                    ...p,
                    tiempoDisponible: e.target.value
                  }))
                }
              />

              <label
                style={{ color: "white", fontSize: "0.9rem", marginTop: "10px" }}
              >
                Código del profesor
              </label>
              <input
                type="text"
                className="login-input"
                placeholder="Código del profesor"
                value={editData.codProf}
                onChange={(e) =>
                  setEditData((p) => ({ ...p, codProf: e.target.value }))
                }
              />

              <label
                style={{ color: "white", fontSize: "0.9rem", marginTop: "10px" }}
              >
                Juego
              </label>
              <select
                className="login-input"
                value={editData.codJuego}
                onChange={(e) =>
                  setEditData((p) => ({ ...p, codJuego: e.target.value }))
                }
              >
                <option value="">Seleccione un juego</option>
                {juegos.map((j) => (
                  <option key={j.codJuego} value={j.codJuego}>
                    {j.nomJuego}
                  </option>
                ))}
              </select>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "12px",
                  justifyContent: "center"
                }}
              >
                <button className="btn primary" onClick={guardarEdicion}>
                  Guardar cambios
                </button>
                <button
                  className="btn secondary"
                  type="button"
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

        {/* COLUMNA DERECHA */}
        <div
          className="gp-right"
          style={{
            width: "60%",
            background: "rgba(255,255,255,0.12)",
            padding: "25px",
            borderRadius: "12px"
          }}
        >
          <h3 style={{ color: "white" }}>Horarios reservados</h3>

          <div
            className="gp-reservas-list"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              maxHeight: "500px",
              overflowY: "auto",
              marginTop: "10px",
              paddingRight: "8px"
            }}
          >
            {horarios.map((h) => {
              const juego = juegos.find((j) => j.codJuego === h.codJuego);
              const inicio = new Date(h.fechaHora);
              const fin = h.horaFin ? new Date(h.horaFin) : null;
              const minutos = h.tiempoDisponible ? Number(h.tiempoDisponible) : 0;

              return (
                <div
                  key={h.cod_Expe}
                  className="gp-reserva-card"
                  onMouseEnter={() => setHoveredId(h.cod_Expe)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    background: "white",
                    color: "black",
                    padding: "12px",
                    borderRadius: "8px",
                    position: "relative"
                  }}
                >
                  <p>
                    <strong>Código:</strong> E{h.cod_Expe}
                  </p>
                  <p>
                    <strong>Inicio:</strong> {inicio.toLocaleString()}
                  </p>
                  <p>
                    <strong>Fin:</strong>{" "}
                    {fin ? fin.toLocaleString() : "No registrado"}
                  </p>
                  <p>
                    <strong>Duración:</strong> {minutos} min
                  </p>
                  <p>
                    <strong>Profesor:</strong> {h.cod_Prof}
                  </p>
                  <p>
                    <strong>Juego:</strong> {juego ? juego.nomJuego : "Sin juego"}
                  </p>

                  {hoveredId === h.cod_Expe && (
                    <div
                      style={{
                        marginTop: "8px",
                        display: "flex",
                        gap: "8px",
                        flexWrap: "wrap"
                      }}
                    >
                      <button
                        className="btn secondary"
                        onClick={() => iniciarEdicion(h)}
                      >
                        Modificar
                      </button>
                      <button
                        className="btn secondary"
                        onClick={() => cancelarReserva(h.cod_Expe)}
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
