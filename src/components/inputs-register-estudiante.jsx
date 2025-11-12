import React, { useState } from "react";
import ButtonsRegister from "./buttons-register";

export default function InputRegisterEstudiante() {
  const [codigo, setCodigo] = useState("");
  const [cedula, setCedula] = useState("");
  const [nombre, setNombre] = useState("");
  const [semestre, setSemestre] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    if (!codigo || !cedula || !nombre || !semestre || !password) {
      alert("Completa todos los campos");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          codigo,
          cedula,
          nombre,
          semestre,
          password,
          tipo_rol: "estudiante",
        }),
      });

      const data = await response.json();
      if (data.ok) alert("Estudiante registrado correctamente");
      else alert(data.error || "Error al registrar estudiante");
    } catch (error) {
      console.error("Error al registrar:", error);
      alert("Error de conexión con el servidor");
    }
  };

  return (
    <>
      <div className="inputs">
        <input type="text" placeholder="Código del estudiante" className="register-input" value={codigo} onChange={(e) => setCodigo(e.target.value)} /><br />
        <input type="text" placeholder="Cédula del estudiante" className="register-input" value={cedula} onChange={(e) => setCedula(e.target.value)} /><br />
        <input type="text" placeholder="Nombre" className="register-input" value={nombre} onChange={(e) => setNombre(e.target.value)} /><br />
        <input type="number" placeholder="Semestre" className="register-input" value={semestre} onChange={(e) => setSemestre(e.target.value)} /><br />
        <input type="password" placeholder="Contraseña" className="register-input" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} /><br />
      </div>
      <ButtonsRegister onRegister={handleSubmit} />
    </>
  );
}
