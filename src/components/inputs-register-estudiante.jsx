import React, { useState } from "react";

export default function InputRegisterEstudiante() {
  const [codigo, setCodigo] = useState("");
  const [cedula, setCedula] = useState("");
  const [nombre, setNombre] = useState("");
  const [semestre, setSemestre] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/api/register/profesor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cedula,
          password,
          tipo_rol: "estudiante",
        }),
      });

      const data = await response.json();
      if (data.ok) {
        alert("Estudiante registrado correctamente");
      } else {
        alert("Error al registrar el estudiante");
      }
    } catch (error) {
      console.error("Error al registrar:", error);
      alert(" Error de conexión con el servidor");
    }
  };

  return (
    <form className="inputs" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Código del estudiante"
        className="register-input"
        value={codigo}
        onChange={(e) => setCodigo(e.target.value)}
      /><br />

      <input
        type="text"
        placeholder="Cédula del estudiante"
        className="register-input"
        value={cedula}
        onChange={(e) => setCedula(e.target.value)}
      /><br />

      <input
        type="text"
        placeholder="Nombre"
        className="register-input"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      /><br />

      <input
        type="number"
        placeholder="Semestre"
        className="register-input"
        value={semestre}
        onChange={(e) => setSemestre(e.target.value)}
      /><br />

      <input
        type="password"
        placeholder="Contraseña"
        className="register-input"
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br />
    </form>
  );
}
