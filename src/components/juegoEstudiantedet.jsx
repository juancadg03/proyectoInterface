import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

export default function JuegoEstudianteDetalle() {
  const { codJuego } = useParams();
  const navigate = useNavigate();
  const [juego, setJuego] = useState(null);

  useEffect(() => {
    const cargarJuego = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/juegos/${codJuego}`);
        const data = await res.json();
        setJuego(data);
      } catch (e) {
        console.error("Error cargando juego:", e);
      }
    };

    cargarJuego();
  }, [codJuego]);

  if (!juego)
    return (
      <div className="background">
        <p style={{ color: "white", textAlign: "center" }}>Cargando...</p>
      </div>
    );

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        background: "#18004d",
        padding: "40px",
        boxSizing: "border-box",
      }}
    >
      <button
        onClick={() => navigate("/juegosEstudiantes")}
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

      <div
        style={{
          maxWidth: "700px",
          margin: "auto",
          background: "rgba(255,255,255,0.12)",
          padding: "25px",
          borderRadius: "12px",
        }}
      >
        <h2 style={{ color: "#7DF9FF", textAlign: "center" }}>
          {juego.nomJuego}
        </h2>

        <p style={{ color: "white", marginTop: "20px" }}>
          <strong>Temática:</strong> {juego.tematica}
        </p>

        <p style={{ color: "white" }}>
          <strong>Duración:</strong> {juego.duracion} minutos
        </p>

        <p style={{ color: "white" }}>
          <strong>Jugadores:</strong> {juego.cntJugadores}
        </p>

        <p style={{ color: "white" }}>
          <strong>Competencias:</strong> {juego.competencias}
        </p>

        <p style={{ color: "white" }}>
          <strong>Idioma:</strong> {juego.idioma}
        </p>

        <p style={{ color: "white" }}>
          <strong>Rango de Edad:</strong> {juego.rangoEdad}
        </p>

        <p style={{ color: "white" }}>
          <strong>Dificultad:</strong> {juego.dificultad}
        </p>

        <p style={{ color: "white", marginTop: "20px" }}>
          <strong>Descripción:</strong>
          <br />
          {juego.descripcion}
        </p>
      </div>
    </div>
  );
}
