import React from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

export default function EstadisticasEncargado() {
  const navigate = useNavigate();

  return (
    <div className="background">
      <div className="login-card">
        <button
          className="back-button"
          onClick={() => navigate("/dashboard-encargado")}
        >
          <IoArrowBack size={22} />
        </button>

        <h2 className="title">
          Estadísticas
        </h2>

        <p style={{ color: "white" }}>
          Aquí podrás visualizar reportes, estadísticas y métricas de uso.
        </p>
      </div>
    </div>
  );
}
