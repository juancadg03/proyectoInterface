import React from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

export default function ButtonsRegister({ onRegister }) {
  const navigate = useNavigate();

  return (
    <div className="buttons">
      {/* Llama a la función de registro si existe */}
      <button
        className="btn primary reg"
        onClick={() => {
          if (onRegister) onRegister();
          else alert("No hay acción de registro configurada");
        }}
      >
        Registrar
      </button>
      <br /><br />

      <button className="back-button" onClick={() => navigate("/")}>
        <IoArrowBack size={22} />
      </button>
    </div>
  );
}
