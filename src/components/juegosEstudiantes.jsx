import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

export default function JuegosEstudiante() {
  const [juegos, setJuegos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const cargarJuegos = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/juegos");
      const data = await res.json();
      console.log(" Juegos recibidos:", data); 
      setJuegos(data);
    } catch (e) {
      console.error("Error al cargar juegos", e);
    }
  };

  useEffect(() => {
    cargarJuegos();
  }, []);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/dashboard-estudiante");
    }
  };

  const juegosFiltrados = juegos.filter((j) => {
    const texto = searchTerm.toLowerCase();
    return (
      j.nomJuego.toLowerCase().includes(texto) ||
      (j.descripcion || "").toLowerCase().includes(texto)
    );
  });

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        background: "#18004d",
        position: "relative",
        overflowY: "auto",
      }}
    >
      <button
        type="button"
        onClick={() => navigate("/dashboard-estudiante")}
        style={{
          position: "fixed",       
          top: "20px",
          left: "20px",
          width: "42px",
          height: "42px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(15,23,42,0.95)",
          borderRadius: "999px",
          border: "1px solid #7DF9FF",
          cursor: "pointer",
          color: "#7DF9FF",
          boxShadow: "0 0 12px rgba(125,249,255,0.7)",
          zIndex: 9999,            
        }}
      >
        <IoArrowBack size={22} />
      </button>

      {/* CONTENEDOR PRINCIPAL */}
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          paddingTop: "70px",
          paddingBottom: "40px",
        }}
      >
        <h1
          style={{
            color: "white",
            textAlign: "center",
            fontSize: "1.8rem",
            marginBottom: "15px",
          }}
        >
          Explorar Juegos
        </h1>

        {/* BARRA DE BÚSQUEDA */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "10px",
            position: "relative",
          }}
        >
          <input
            type="text"
            placeholder="Buscar juegos por nombre o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "420px",
              maxWidth: "90%",
              padding: "14px",
              borderRadius: "999px",
              border: "2px solid #7DF9FF",
              background: "rgba(255,255,255,0.12)",
              color: "white",
              outline: "none",
              fontSize: "1rem",
              textAlign: "center",
              boxShadow: "0 0 12px rgba(125,249,255,0.4)",
            }}
          />

          {searchTerm.length > 0 && juegosFiltrados.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "52px",
                width: "420px",
                maxWidth: "90%",
                background: "rgba(3,7,18,0.95)",
                border: "1px solid #7DF9FF",
                borderRadius: "10px",
                maxHeight: "220px",
                overflowY: "auto",
                zIndex: 30,
              }}
            >
              {juegosFiltrados.map((j) => (
                <div
                  key={j.codJuego}
                  onClick={() =>
                    navigate(`/estudiante/juego/${j.codJuego}`)
                  }
                  style={{
                    padding: "10px 14px",
                    color: "white",
                    cursor: "pointer",
                    borderBottom: "1px solid rgba(255,255,255,0.1)",
                    textAlign: "left",
                    fontSize: "0.95rem",
                  }}
                >
                  {j.nomJuego}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* GRID DE JUEGOS */}
        <div
          style={{
            marginTop: "30px",
            width: "100%",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "24px",
          }}
        >
          {juegosFiltrados.map((j) => {
            const portadaUrl = j.portada
              ? `http://localhost:4000${j.portada}`
              : `http://localhost:4000/portadas/${j.codJuego}.jpg`;

            return (
              <div
                key={j.codJuego}
                style={{
                  background: "rgba(255,255,255,0.08)",
                  borderRadius: "14px",
                  cursor: "pointer",
                  overflow: "hidden",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.45)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  display: "flex",
                  flexDirection: "column",
                }}
                onClick={() =>
                  navigate(`/estudiante/juego/${j.codJuego}`)
                }
              >
                {/* PORTADA */}
                <div
                  style={{
                    width: "100%",
                    height: "180px",
                    overflow: "hidden",
                    background:
                      "linear-gradient(135deg,#4b0082,#7DF9FF)",
                  }}
                >
                  <img
                    src={portadaUrl}
                    alt={j.nomJuego}
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

                {/* INFO */}
                <div
                  style={{
                    padding: "12px 14px 16px 14px",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <h3
                    style={{
                      color: "#7DF9FF",
                      margin: "6px 0 4px",
                      fontSize: "1.05rem",
                    }}
                  >
                    {j.nomJuego}
                  </h3>
                  <p
                    style={{
                      color: "white",
                      fontSize: "0.85rem",
                      opacity: 0.9,
                      marginBottom: "8px",
                      minHeight: "40px",
                    }}
                  >
                    {j.descripcion
                      ? j.descripcion.substring(0, 80) + "..."
                      : "Sin descripción."}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.78rem",
                      color: "#cbd5f5",
                      opacity: 0.85,
                    }}
                  >
                    <span>Duración: {j.duracion} min</span>
                    <span>Jugadores: {j.cntJugadores}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {juegosFiltrados.length === 0 && (
            <p
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                color: "white",
                opacity: 0.8,
                marginTop: "30px",
              }}
            >
              No se encontraron juegos con ese criterio de búsqueda.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
