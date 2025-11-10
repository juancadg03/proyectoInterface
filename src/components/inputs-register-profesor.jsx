import React, { useState, useEffect } from "react";
import ButtonsRegister from "./buttons-register";

export default function InputRegisterProfesor() {
  const [codigo, setCodigo] = useState("");
  const [cedula, setCedula] = useState("");
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [facultad, setFacultad] = useState("");
  const [facultades, setFacultades] = useState([]);

  // Cargar facultades desde el backend
  useEffect(() => {
    fetch("http://localhost:4000/api/facultades")
      .then((res) => res.json())
      .then((data) => setFacultades(data))
      .catch((err) => console.error("Error al obtener facultades:", err));
  }, []);

  // Enviar datos al backend
  const handleSubmit = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          codigo,
          cedula,
          nombre,
          password,
          cod_fact: facultad,
          tipo_rol: "profesor",
        }),
      });

      const data = await res.json();
      if (res.ok) alert("Profesor registrado correctamente");
      else alert(data.error || "Error al registrar");
    } catch (err) {
      console.error("Error en el registro:", err);
      alert("No se pudo conectar con el servidor");
    }
  };

  return (
    <>
      <div className="inputs">
        <input
          type="text"
          placeholder="Código del profesor"
          className="register-input"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
        /><br />
        <input
          type="text"
          placeholder="Cédula"
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
          type="password"
          placeholder="Contraseña"
          className="register-input"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br />

        <select
          className="input-select-facultad"
          value={facultad}
          onChange={(e) => setFacultad(e.target.value)}
        >
          <option value="">Seleccione facultad</option>
          {facultades.map((f) => (
            <option key={f.cod_fact} value={f.cod_fact}>
              {f.nomFact}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
