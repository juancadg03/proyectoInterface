import React from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

export default function DashboardEncargado() {
  const navigate = useNavigate();

  return (
    <div className="background">
      <div className="login-card">
        {/* Botón de regreso */}
        <button
          className="back-button"
          onClick={() => navigate("/login")}
        >
          <IoArrowBack size={22} />
        </button>

        {/* Título */}
        <h2 className="title" style={{marginBottom: "-40px"}}>
          Seleccione su gestión
        </h2>

        {/* Botón Gestión Préstamos */}
        <button
          className="btn primary"
          onClick={() => navigate("/gestion-prestamos")}
        >
          Gestión Préstamos
        </button>
        <br></br>

        {/* Botón Estadísticas */}
        <button
          className="btn secondary"
          onClick={() => navigate("/estadisticas")}
        >
          Estadísticas
        </button>
        <br></br>
        {/* Botón añadir juegos */}
        <button
          className="btn primary"
          style={{marginTop: "2px"}}
          onClick={() => navigate("/anadirJuego")}
        >
          Añadir nuevos Juegos
        </button>
        <br></br>

        {/* Botón Eliminar juegos*/}
        <button
          className="btn secondary"
          style={{marginTop: "2px"}}
          onClick={() => navigate("/eliminarJuego")}
        >
          Eliminar Juegos
        </button>
        
      </div>
    </div>
  );
}