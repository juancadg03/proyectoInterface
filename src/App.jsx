import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";

// Componentes del login
import TitleSection from "./components/title-login";
import UserSelect from "./components/selectuser-login";
import ActionButtons from "./components/buttons-login";
import LogoBottom from "./components/logo";
import LoginPage from "./components/loginPage"


import DashboardProfesor from "./components/DashboardProfesor";
import DashboardEstudiante from "./components/DashboardEstudiante";
import DashboardEncargado from "./components/DashboardEncargado";


// Componentes del registro
import TitleRegister from "./components/title-register";
import InputRegisterProfesor from "./components/inputs-register-profesor";
import InputRegisterEstudiante from "./components/inputs-register-estudiante";
import InputRegisterEncargado from "./components/inputs-register-encargado";

// Componentes de Encargados
import GestionPrestamos from "./components/GestionPrestamos";
import EstadisticasEncargado from "./components/EstadisticasEncargado";
import AnadirJuego from "./components/anadirJuego";
import EliminarJuego from "./components/eliminarJuego";
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
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard-profesor" element={<DashboardProfesor />} />
        <Route path="/dashboard-estudiante" element={<DashboardEstudiante />} />
        <Route path="/dashboard-encargado" element={<DashboardEncargado />} />
        <Route path="/dashboard-encargado" element={<DashboardEncargado />} />
        <Route path="/gestion-prestamos" element={<GestionPrestamos />} />
        <Route path="/estadisticas" element={<EstadisticasEncargado />} />
        <Route path="/anadirJuego" element={<AnadirJuego/>} />
        <Route path="/eliminarJuego" element={<EliminarJuego/>} />
              </Routes>
      <LogoBottom />
    </BrowserRouter>
  );
}

export default App;
