import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

export default function LoginPage() {
  const [cedula, setCedula] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!cedula || !password) {
      alert("Por favor ingresa tu cédula y contraseña.");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cedula, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        alert(`Error: ${data.error || "Credenciales incorrectas"}`);
        return;
      }

      // Guardar datos base
      localStorage.setItem("token", data.token);
      localStorage.setItem("cedula", data.cedula);
      localStorage.setItem("rol", data.tipo_rol);

      // Guardar nombre (CORRECCIÓN)
      if (data.nombre) {
        localStorage.setItem("nombre", data.nombre);
      }

      // Guardar codProf si viene
      if (data.codProf) {
        localStorage.setItem("codProf", data.codProf);
      }

      // Guardar cedEncargado si viene
      if (data.cedEncargado) {
        localStorage.setItem("cedEncargado", data.cedEncargado);
      }

      alert(`Inicio de sesión exitoso como ${data.tipo_rol}`);

      // Redirección
      if (data.tipo_rol === "profesor") {
        navigate("/dashboard-profesor");
      } else if (data.tipo_rol === "estudiante") {
        navigate("/dashboard-estudiante");
      } else if (data.tipo_rol === "encargado") {
        navigate("/dashboard-encargado");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("No se pudo conectar con el servidor.");
    }
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <button className="btn primary" type="submit">
            Ingresar
          </button>
          <br /><br />
          <button
            type="button"
            className="back-button"
            onClick={() => navigate("/")}
          >
            <IoArrowBack size={22} />
          </button>
        </form>
      </div>
    </div>
  );
}
