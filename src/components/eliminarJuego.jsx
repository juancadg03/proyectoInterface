import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

export default function EliminarJuego() {
  const navigate = useNavigate();
  const [juegos, setJuegos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchJuegos();
  }, []);

  const fetchJuegos = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/juegos");
      if (response.ok) {
        const data = await response.json();
        setJuegos(data);
      } else {
        setMessage({ text: "Error al cargar los juegos", type: "error" });
      }
    } catch (error) {
      setMessage({ text: "Error de conexión", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (codJuego, nomJuego) => {
    if (!window.confirm(`¿Está seguro de eliminar el juego "${nomJuego}"?`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/juegos/${codJuego}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMessage({ text: "Juego eliminado exitosamente", type: "success" });
        setJuegos(juegos.filter((juego) => juego.codJuego !== codJuego));
        setTimeout(() => setMessage({ text: "", type: "" }), 3000);
      } else {
        const error = await response.json();
        setMessage({
          text: error.message || "Error al eliminar el juego",
          type: "error",
        });
      }
    } catch (error) {
      setMessage({ text: "Error de conexión. Intente nuevamente.", type: "error" });
    }
  };

  const filteredJuegos = juegos.filter(
    (juego) =>
      juego.nomJuego?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(juego.codJuego)?.includes(searchTerm) ||
      juego.tematica?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="background">
      <div
        className="login-card"
        style={{ maxWidth: "900px", maxHeight: "90vh", overflowY: "auto" }}
      >
        <button className="back-button" onClick={() => navigate("/dashboard-encargado")}>
                  <IoArrowBack size={22} />
        </button>

        <h2 className="title">Eliminar Juegos</h2>

        {message.text && (
          <div
            className={`message ${message.type}`}
            style={{
              padding: "10px",
              marginBottom: "15px",
              borderRadius: "5px",
              backgroundColor: message.type === "success" ? "#d4edda" : "#f8d7da",
              color: message.type === "success" ? "#155724" : "#721c24",
              border: `1px solid ${
                message.type === "success" ? "#c3e6cb" : "#f5c6cb"
              }`,
            }}
          >
            {message.text}
          </div>
        )}

        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Buscar por nombre, código o temática..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              fontSize: "14px",
            }}
          />
        </div>

        {loading ? (
          <p style={{ textAlign: "center", padding: "20px" }}>Cargando juegos...</p>
        ) : filteredJuegos.length === 0 ? (
          <p style={{ textAlign: "center", padding: "20px", color: "#666" }}>
            {searchTerm ? "No se encontraron juegos con ese criterio" : "No hay juegos disponibles"}
          </p>
        ) : (
          <div style={{ display: "grid", gap: "15px" }}>
            {filteredJuegos.map((juego) => (
              <div
                key={juego.codJuego}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "15px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "#fff",
                  transition: "box-shadow 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)")
                }
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: "0 0 8px 0", fontSize: "18px", fontWeight: "600" }}>
                    {juego.nomJuego}
                  </h3>
                  <div style={{ fontSize: "14px", color: "#666" }}>
                    <p style={{ margin: "4px 0" }}>
                      <strong>Código:</strong> {juego.codJuego}
                    </p>
                    <p style={{ margin: "4px 0" }}>
                      <strong>Temática:</strong> {juego.tematica}
                    </p>
                    <p style={{ margin: "4px 0" }}>
                      <strong>Copias disponibles:</strong> {juego.numCopias}
                    </p>
                    {juego.descripcion && (
                      <p style={{ margin: "8px 0 0 0", fontSize: "13px" }}>
                        {juego.descripcion.length > 100
                          ? `${juego.descripcion.substring(0, 100)}...`
                          : juego.descripcion}
                      </p>
                    )}
                  </div>
                </div>

                {/* BOTÓN SIN LUCIDE REACT */}
                <button
                  onClick={() => handleDelete(juego.codJuego, juego.nomJuego)}
                  style={{
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    padding: "10px 15px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "14px",
                    fontWeight: "500",
                    transition: "background-color 0.2s",
                    marginLeft: "15px",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#c82333")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#dc3545")
                  }
                >
                  🗑 Eliminar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}