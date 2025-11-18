import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack, IoStatsChart, IoStar, IoPlay } from "react-icons/io5";

export default function Estadisticas() {
  const navigate = useNavigate();
  const [juegos, setJuegos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [selectedJuego, setSelectedJuego] = useState(null);
  const [estadisticas, setEstadisticas] = useState(null);

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

  const handleSelectJuego = async (codJuego, nomJuego) => {
    setSelectedJuego({ codJuego, nomJuego });
    setEstadisticas(null);
    setMessage({ text: "", type: "" });

    try {
      const response = await fetch('http://localhost:4000/api/estadisticas/${codJuego}');

      if (response.ok) {
        const data = await response.json();
        setEstadisticas(data);
      } else {
        setMessage({
          text: "Error al cargar las estadísticas",
          type: "error",
        });
      }
    } catch (error) {
      setMessage({
        text: "Error de conexión. Intente nuevamente.",
        type: "error",
      });
    }
  };

  return (
    <div className="background">
      <div
        className="login-card"
        style={{ maxWidth: "1000px", maxHeight: "90vh", overflowY: "auto" }}
      >
        <button
          className="back-button"
          onClick={() => navigate("/dashboard-encargado")}
          style={{left:"-80px"}}
        >
          <IoArrowBack size={22} />
        </button>

        <h2 className="title">Estadísticas de Juegos</h2>

        {message.text && (
          <div
            className={`message ${message.type}`}
            style={{
              padding: "10px",
              marginBottom: "15px",
              borderRadius: "5px",
              backgroundColor:
                message.type === "success" ? "#d4edda" : "#f8d7da",
              color: message.type === "success" ? "#155724" : "#721c24",
              border: `1px solid ${
                message.type === "success" ? "#c3e6cb" : "#f5c6cb"
              }`,
            }}
          >
            {message.text}
          </div>
        )}

        {loading ? (
          <p style={{ textAlign: "center", padding: "20px" }}>
            Cargando juegos...
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  marginBottom: "15px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <IoStatsChart size={20} />
                Seleccione un Juego
              </h3>

              {juegos.length === 0 ? (
                <p style={{ textAlign: "center", color: "#666" }}>
                  No hay juegos disponibles
                </p>
              ) : (
                <div style={{ display: "grid", gap: "10px" }}>
                  {juegos.map((juego) => (
                    <button
                      key={juego.codJuego}
                      onClick={() =>
                        handleSelectJuego(juego.codJuego, juego.nomJuego)
                      }
                      style={{
                        padding: "12px",
                        borderRadius: "6px",
                        border:
                          selectedJuego?.codJuego === juego.codJuego
                            ? "2px solid #007bff"
                            : "1px solid #ddd",
                        backgroundColor:
                          selectedJuego?.codJuego === juego.codJuego
                            ? "#e7f3ff"
                            : "#fff",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        if (selectedJuego?.codJuego !== juego.codJuego) {
                          e.currentTarget.style.boxShadow =
                            "0 2px 4px rgba(0,0,0,0.1)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <div style={{ fontWeight: "600", fontSize: "14px" }}>
                        {juego.nomJuego}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#666",
                          marginTop: "4px",
                        }}
                      >
                        Código: {juego.codJuego}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              {selectedJuego && estadisticas ? (
                <div
                  style={{
                    border: "2px solid #007bff",
                    borderRadius: "8px",
                    padding: "20px",
                    backgroundColor: "#f8f9fa",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      marginBottom: "20px",
                      color: "#007bff",
                    }}
                  >
                    Resultados
                  </h3>

                  <div style={{ marginBottom: "20px" }}>
                    <div
                      style={{
                        marginBottom: "15px",
                        padding: "15px",
                        backgroundColor: "#fff",
                        borderRadius: "6px",
                        border: "1px solid #ddd",
                      }}
                    >
                      <label
                        style={{
                          display: "block",
                          fontSize: "12px",
                          color: "#666",
                          marginBottom: "5px",
                          fontWeight: "500",
                        }}
                      >
                        Código de Juego
                      </label>
                      <div
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color: "#333",
                        }}
                      >
                        {estadisticas.codJuego}
                      </div>
                    </div>

                    <div
                      style={{
                        marginBottom: "15px",
                        padding: "15px",
                        backgroundColor: "#fff",
                        borderRadius: "6px",
                        border: "1px solid #ddd",
                      }}
                    >
                      <label
                        style={{
                          display: "block",
                          fontSize: "12px",
                          color: "#666",
                          marginBottom: "5px",
                          fontWeight: "500",
                        }}
                      >
                        Nombre del Juego
                      </label>
                      <div
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color: "#333",
                        }}
                      >
                        {estadisticas.nomJuego}
                      </div>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "15px",
                      }}
                    >
                      <div
                        style={{
                          padding: "15px",
                          backgroundColor: "#fff3cd",
                          borderRadius: "6px",
                          border: "1px solid #ffc107",
                        }}
                      >
                        <label
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            fontSize: "12px",
                            color: "#856404",
                            marginBottom: "8px",
                            fontWeight: "500",
                          }}
                        >
                          <IoStar size={16} />
                          Ranking Promedio
                        </label>
                        <div
                          style={{
                            fontSize: "24px",
                            fontWeight: "700",
                            color: "#333",
                          }}
                        >
                          {typeof estadisticas.rankingPromedio === "number"
                            ? estadisticas.rankingPromedio.toFixed(2)
                            : "N/A"}
                        </div>
                        <div
                          style={{
                            fontSize: "11px",
                            color: "#856404",
                            marginTop: "4px",
                          }}
                        >
                          de 5 estrellas
                        </div>
                      </div>

                      <div
                        style={{
                          padding: "15px",
                          backgroundColor: "#d1ecf1",
                          borderRadius: "6px",
                          border: "1px solid #17a2b8",
                        }}
                      >
                        <label
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            fontSize: "12px",
                            color: "#0c5460",
                            marginBottom: "8px",
                            fontWeight: "500",
                          }}
                        >
                          <IoPlay size={16} />
                          Cantidad de Usos
                        </label>
                        <div
                          style={{
                            fontSize: "24px",
                            fontWeight: "700",
                            color: "#333",
                          }}
                        >
                          {estadisticas.cntUsos || 0}
                        </div>
                        <div
                          style={{
                            fontSize: "11px",
                            color: "#0c5460",
                            marginTop: "4px",
                          }}
                        >
                          experiencias registradas
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : selectedJuego ? (
                <div
                  style={{
                    border: "2px solid #ddd",
                    borderRadius: "8px",
                    padding: "20px",
                    backgroundColor: "#f8f9fa",
                    textAlign: "center",
                    color: "#666",
                  }}
                >
                  <p>Cargando estadísticas...</p>
                </div>
              ) : (
                <div
                  style={{
                    border: "2px dashed #ddd",
                    borderRadius: "8px",
                    padding: "30px",
                    backgroundColor: "#f8f9fa",
                    textAlign: "center",
                    color: "#999",
                  }}
                >
                  <IoStatsChart
                    size={40}
                    style={{ margin: "0 auto 10px", opacity: 0.5 }}
                  />
                  <p style={{ margin: 0 }}>
                    Seleccione un juego para ver sus estadísticas
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}