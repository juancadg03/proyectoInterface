import React from "react";

export default function InputRegisterEncargado() {
  return (
    <div className="inputs">
      <input type="text" placeholder="Cédula del encargado" className="register-input" /><br />
      <input type="text" placeholder="Nombre del encargado" className="register-input" /><br />
      <input type="password" placeholder="Contraseña" className="register-input" autoComplete="new-password" /><br />
    </div>
  );
}
