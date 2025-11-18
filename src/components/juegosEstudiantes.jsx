import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

export default function JuegosEstudiante() {
  const [juegos, setJuegos] = useState([]);
  const navigate = useNavigate();

  const cargarJuegos = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/juegos");
      const data = await res.json();
      setJuegos(data);
    } catch (e) {
      console.error("Error al cargar juegos", e);
    }
  };

  useEffect(() => {
    cargarJuegos();
  }, []);

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
      <h2
        style={{
          color: "white",
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        Explorar Juegos Disponibles
      </h2>

      {/* Botón volver */}
      <button
        onClick={() => navigate("/dashboard-estudiante")}
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
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "25px",
        }}
      >
        {juegos.map((j) => (
          <div
            key={j.codJuego}
            style={{
              background: "rgba(255,255,255,0.12)",
              padding: "15px",
              borderRadius: "10px",
              cursor: "pointer",
              textAlign: "center",
              transition: "0.2s",
            }}
            onClick={() => navigate(`/estudiante/juego/${j.codJuego}`)}
          >
            <h3 style={{ color: "#7DF9FF", marginTop: "10px" }}>
              {j.nomJuego}
            </h3>
            <p style={{ color: "white", fontSize: "0.9rem" }}>
              {j.descripcion?.substring(0, 80)}...
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
