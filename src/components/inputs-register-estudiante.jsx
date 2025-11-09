
export default function InputRegisterEstudiante() {
  return (
    <div className="inputs">
      <input type="text" placeholder="Código del estudiante" className="register-input" /><br />
      <input type="text" placeholder="Cédula del estudiante" className="register-input" /><br />
      <input type="text" placeholder="Nombre" className="register-input" /><br />
      <input type="number" placeholder="Semestre" className="register-input" /><br />
      <input type="password" placeholder="Contraseña" className="register-input" autoComplete="new-password" /><br />
    </div>
  );
}
