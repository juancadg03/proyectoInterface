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
        <h2 className="title">
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
      </div>
    </div>
  );
}
