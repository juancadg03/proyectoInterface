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
      <div
        style={{
          width: "100vw",
          minHeight: "100vh",
          background: "#18004d",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: "white", textAlign: "center" }}>Cargando...</p>
      </div>
    );

  // URL de portada
  const portadaUrl = juego.portada
    ? `http://localhost:4000${juego.portada}`
    : `http://localhost:4000/portadas/${juego.codJuego}.jpg`;

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        background: "#18004d",
        padding: "40px 20px",
        boxSizing: "border-box",
      }}
    >
      {/* Botón volver */}
      <button
        onClick={() => navigate(-1)}
        style={{
          position: "absolute",
          top: "15px",
          left: "15px",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#7DF9FF",
          zIndex: 20,
        }}
      >
        <IoArrowBack size={26} />
      </button>

      {/* Contenedor principal */}
      <div
        style={{
          maxWidth: "1000px",
          margin: "40px auto 0",
          background: "rgba(255,255,255,0.12)",
          padding: "25px 28px",
          borderRadius: "16px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.45)",
        }}
      >
        {/* Título */}
        <h2
          style={{
            color: "#7DF9FF",
            textAlign: "center",
            marginBottom: "20px",
            fontSize: "1.9rem",
          }}
        >
          {juego.nomJuego}
        </h2>

        {/* Layout en dos columnas: izquierda datos + portada, derecha descripción grande */}
        <div
          style={{
            display: "flex",
            gap: "24px",
            flexWrap: "wrap",
          }}
        >
          {/* Columna izquierda */}
          <div
            style={{
              flex: "1 1 280px",
              minWidth: "260px",
            }}
          >
            {/* Portada */}
            <div
              style={{
                width: "100%",
                height: "220px",
                borderRadius: "12px",
                overflow: "hidden",
                marginBottom: "18px",
                background: "linear-gradient(135deg,#4b0082,#7DF9FF)",
              }}
            >
              <img
                src={portadaUrl}
                alt={juego.nomJuego}
                onError={(e) => {
                  e.currentTarget.src = "/no-cover.png";
                }}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>

            {/* Datos rápidos */}
            <p style={{ color: "white", marginBottom: "6px" }}>
              <strong>Temática:</strong> {juego.tematica}
            </p>

            <p style={{ color: "white", marginBottom: "6px" }}>
              <strong>Duración:</strong> {juego.duracion} minutos
            </p>

            <p style={{ color: "white", marginBottom: "6px" }}>
              <strong>Jugadores:</strong> {juego.cntJugadores}
            </p>

            <p style={{ color: "white", marginBottom: "6px" }}>
              <strong>Competencias:</strong> {juego.competencias}
            </p>

            <p style={{ color: "white", marginBottom: "6px" }}>
              <strong>Idioma:</strong> {juego.idioma}
            </p>

            <p style={{ color: "white", marginBottom: "6px" }}>
              <strong>Rango de Edad:</strong> {juego.rangoEdad}
            </p>

            <p style={{ color: "white", marginBottom: "0" }}>
              <strong>Dificultad:</strong> {juego.dificultad}
            </p>
          </div>

          {/* Columna derecha: descripción grande */}
          <div
            style={{
              flex: "1 1 320px",
              minWidth: "280px",
              background: "rgba(0,0,0,0.25)",
              borderRadius: "12px",
              padding: "16px 18px",
            }}
          >
            <h3
              style={{
                color: "#7DF9FF",
                marginBottom: "10px",
                fontSize: "1.2rem",
              }}
            >
              Descripción del juego
            </h3>
            <p
              style={{
                color: "white",
                lineHeight: 1.5,
                textAlign: "justify",
                whiteSpace: "pre-line",
              }}
            >
              {juego.descripcion || "Este juego aún no tiene una descripción detallada."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
