import React, { useState } from "react";
import ButtonsRegister from "./buttons-register";

export default function InputRegisterEncargado() {
  const [cedula, setCedula] = useState("");
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!cedula || !nombre || !password) {
      alert("Completa todos los campos");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cedula,
          nombre,
          password,
          tipo_rol: "encargado",
        }),
      });

      const data = await response.json();
      if (data.ok) {
        alert("Encargado registrado con éxito");
        setCedula("");
        setNombre("");
        setPassword("");
      } else {
        alert(data.error || "Error al registrar");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("No se pudo conectar con el servidor");
    }
  };

  return (
    <>
      <div className="inputs">
        <input type="text" placeholder="Cédula del encargado" className="register-input" value={cedula} onChange={(e) => setCedula(e.target.value)} /><br />
        <input type="text" placeholder="Nombre del encargado" className="register-input" value={nombre} onChange={(e) => setNombre(e.target.value)} /><br />
        <input type="password" placeholder="Contraseña" className="register-input" value={password} onChange={(e) => setPassword(e.target.value)} /><br />
      </div>
      <ButtonsRegister onRegister={handleRegister} />
    </>
  );
}
