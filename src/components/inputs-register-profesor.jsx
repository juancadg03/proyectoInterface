import React from "react";

export default function InputRegisterProfesor() {
  return (
    <div className="inputs">
      <input type="text" placeholder="Código del profesor" className="register-input" /><br />
      <input type="text" placeholder="Cédula" className="register-input"  /><br />
      <input type="text" placeholder="Nombre" className="register-input"  /><br />
      <input type="password" placeholder="Contraseña" className="register-input" autoComplete="new-password" /><br />
      <select className="input-select-facultad">
        <option value="">Seleccione facultad</option>
        <option value="1001">Ingeniería</option>
        <option value="1002">Ciencias</option>
      </select>
    </div>
  );
}
