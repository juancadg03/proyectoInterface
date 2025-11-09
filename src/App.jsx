import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";

// Componentes del login
import TitleSection from "./components/title-login";
import UserSelect from "./components/selectuser-login";
import ActionButtons from "./components/buttons-login";
import LogoBottom from "./components/logo";

// Componentes del registro
import TitleRegister from "./components/title-register";
import ButtonsRegister from "./components/buttons-register";
import InputRegisterProfesor from "./components/inputs-register-profesor";
import InputRegisterEstudiante from "./components/inputs-register-estudiante";
import InputRegisterEncargado from "./components/inputs-register-encargado";

// ---- LOGIN ----
function Login() {
  return (
    <div className="background">
      <div className="login-card">
        <TitleSection />
        <UserSelect />
        <ActionButtons />
      </div>
    </div>
  );
}

// ---- REGISTER ----
function Register() {
  const query = new URLSearchParams(useLocation().search);
  const userType = query.get("type") || "profesor";

  return (
    <div className="background">
      <div className="register-card">
        <TitleRegister />

        {userType === "profesor" && <InputRegisterProfesor />}
        {userType === "estudiante" && <InputRegisterEstudiante />}
        {userType === "encargado" && <InputRegisterEncargado />}

        <ButtonsRegister />
      </div>
    </div>
  );
}

// ---- APP PRINCIPAL ----
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <LogoBottom />
    </BrowserRouter>
  );
}

export default App;
