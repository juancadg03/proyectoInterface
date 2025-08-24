import './App.css'
import './index.css'

function Card() {
  return (
    <div className="card">
      <h1>JUAN DIAZ</h1>
      <h2>DISEÑADOR UX EN FORMACIÓN</h2>
    </div>
  )
}

function App() {
  return (
    <div className="container">
      <Card />
      <Card />
      <Card />
      <Card />
    </div>
  )
}

export default App