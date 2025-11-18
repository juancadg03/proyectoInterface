import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

export default function SolicitudReservaProfesor() {
  const { codJuego } = useParams();
  const navigate = useNavigate();

  const [juego, setJuego] = useState(null);
  const [fechaHora, setFechaHora] = useState("");
  const [tiempoDisponible, setTiempoDisponible] = useState("");

  // Cargar un solo juego
  const cargarJuego = async () => {
    const res = await fetch(`http://localhost:4000/api/juegos/${codJuego}`);
    const data = await res.json();
    setJuego(data);
  };

  // Enviar solicitud
  const enviarSolicitud = async () => {
    const codProf = localStorage.getItem("codProf");

    if (!codProf || !fechaHora || !tiempoDisponible) {
      alert("Complete todos los campos.");
      return;
    }

    const res = await fetch("http://localhost:4000/api/profesor/solicitar-reserva", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        codProf,
        codJuego,
        fechaHora,
        tiempoDisponible: Number(tiempoDisponible),
      }),
    });

    const data = await res.json();

    if (data.ok) {
      alert("Solicitud enviada. El encargado debe aceptarla.");
      navigate("/profesor/juegos");
    } else {
      alert(data.message);
    }
  };

  useEffect(() => {
    cargarJuego();
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        background: "linear-gradient(145deg, #15003a, #22006b)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px",
        boxSizing: "border-box",
        color: "white",
      }}
    >
      {/* Contenedor principal */}
      <div
        style={{
          width: "100%",
          maxWidth: "550px",
          background: "rgba(255,255,255,0.10)",
          padding: "40px",
          borderRadius: "20px",
          backdropFilter: "blur(7px)",
          boxShadow: "0 0 25px rgba(0,0,0,0.4)",
          position: "relative",
        }}
      >
        {/* Botón volver */}
        <button
          onClick={() => navigate("/juegosProfesor")}
          style={{
            position: "absolute",
            top: "15px",
            left: "15px",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#7DF9FF",
          }}
        >
          <IoArrowBack size={26} />
        </button>

        {/* Título */}
        <h2 style={{ color: "#7DF9FF", marginBottom: "20px", textAlign: "center" }}>
          Solicitar Reserva
        </h2>

        {/* Datos del juego */}
        {juego && (
          <div
            style={{
              textAlign: "center",
              marginBottom: "25px",
              background: "rgba(255,255,255,0.15)",
              padding: "15px",
              borderRadius: "12px",
            }}
          >
            <h3 style={{ color: "white", marginBottom: "5px" }}>{juego.nomJuego}</h3>
            <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>
              Temática: {juego.tematica}
            </p>
            <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>
              Duración sugerida: {juego.duracion} min
            </p>
          </div>
        )}

        {/* Formulario */}
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div>
            <label style={{ fontSize: "0.9rem", color: "#cde8ff" }}>
              Fecha y hora de inicio
            </label>
            <input
              type="datetime-local"
              value={fechaHora}
              onChange={(e) => setFechaHora(e.target.value)}
              className="login-input"
              style={{
                width: "100%",
                marginTop: "5px",
                padding: "10px",
                background: "rgba(255,255,255,0.2)",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: "8px",
                color: "white",
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: "0.9rem", color: "#cde8ff" }}>
              Duración (minutos)
            </label>
            <input
              type="number"
              placeholder="Ej: 60"
              value={tiempoDisponible}
              onChange={(e) => setTiempoDisponible(e.target.value)}
              className="login-input"
              style={{
                width: "100%",
                marginTop: "5px",
                padding: "10px",
                background: "rgba(255,255,255,0.2)",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: "8px",
                color: "white",
              }}
            />
          </div>
        </div>

        {/* Botón enviar */}
        <button
          onClick={enviarSolicitud}
          className="btn primary"
          style={{
            marginTop: "30px",
            width: "100%",
            padding: "12px",
            fontSize: "1rem",
            borderRadius: "10px",
            background: "#7DF9FF",
            color: "#18004d",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "0.2s",
          }}
        >
          Enviar solicitud
        </button>
      </div>
    </div>
  );
}
