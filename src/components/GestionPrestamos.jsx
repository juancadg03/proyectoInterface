import React from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

export default function GestionPrestamos() {
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
          Gestión de Préstamos
        </h2>

        <p style={{ color: "white" }}>
          Aquí podrás registrar, aprobar o cerrar préstamos de juegos.
        </p>
      </div>
    </div>
  );
}
