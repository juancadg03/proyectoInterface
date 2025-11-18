import React from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

export default function DashboardProfesor() {
  const navigate = useNavigate();

  return (
    <div className="background">
      <div className="login-card" style={{ maxWidth: "500px", textAlign: "center" }}>
        <button className="back-button" onClick={() => navigate("/login")}>
                          <IoArrowBack size={22} />
        </button>
        <h2 className="title">Bienvenido, Profesor</h2>

        <div style={{ display: "grid", gap: "20px", marginTop: "20px"}}>
          <button
            className="btn primary"
            onClick={() => navigate("/juegosProfesor")}
            style={{
              padding: "12px",
              fontSize: "16px",
              borderRadius: "6px",
              cursor: "pointer",
              marginTop: "20px"
            }}
          >
            Juegos Disponibles / Reservar
          </button>

          <button
            className="btn secondary"
            onClick={() => navigate("/evaluarExperiencia")}
            style={{
              padding: "12px",
              fontSize: "16px",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Evaluar Experiencia
          </button>
        </div>
      </div>
    </div>
  );
}