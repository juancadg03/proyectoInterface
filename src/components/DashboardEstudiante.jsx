import React from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

export default function DashboardEstudiante() {
  const navigate = useNavigate();

  return (
    <div className="background">
      <div className="login-card" style={{ maxWidth: "500px", textAlign: "center" }}>
        <button className="back-button" onClick={() => navigate("/login")}>
                                  <IoArrowBack size={22} />
        </button>
        <h2 className="title">Bienvenido, Estudiante</h2>

        <div style={{ display: "grid", gap: "20px", marginTop: "30px" }}>
          <button
            className="btn primary"
            onClick={() => navigate("/juegos-estudiante")}
            style={{
              padding: "12px",
              fontSize: "16px",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
             Ver Juegos Disponibles
          </button>

          <button
            className="btn primary"
            onClick={() => navigate("/evaluar")}
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