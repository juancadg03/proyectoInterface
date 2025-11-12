import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

export default function LoginPage() {
  const [cedula, setCedula] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    // Aquí luego haremos la conexión al backend
    alert(`Cédula: ${cedula}\nContraseña: ${password}`);
  };

  return (
    <div className="background">
      <div className="login-card">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Cédula"
            className="login-input"
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
          />
          <br />
          <input
            type="password"
            placeholder="Contraseña"
            className="login-input"
            autoComplete="new-password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <button className="btn primary" type="submit">
            Ingresar
          </button>
          <br /><br />
          <button className="back-button" onClick={() => navigate("/")}>
                  <IoArrowBack size={22} />
          </button>
        </form>
      </div>
    </div>
  );
}
