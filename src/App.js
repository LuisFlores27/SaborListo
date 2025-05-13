import './App.css';
import { useState } from 'react';

function App() {
  // Estados para manejar los ingredientes, recetas y detalles
  const [ingredientes, setIngredientes] = useState([]);
  const [input, setInput] = useState('');
  const [recetas, setRecetas] = useState([]);
  const [cargando, setCargando] = useState(false);

  const API_KEY = '6aa1d4a11d5e450ca7b6aaa2536ece06';

  // Función para agregar un ingrediente
  const agregarIngrediente = () => {
    const ingrediente = input.trim().toLowerCase();
    if (ingrediente && !ingredientes.includes(ingrediente)) {
      setIngredientes([...ingredientes, ingrediente]);
      setInput('');
    } else {
      alert('Este ingrediente ya está en la lista');
    }
  };

  // Función para limpiar la lista de ingredientes
  const limpiarIngredientes = () => {
    setIngredientes([]);
    setInput('');
    setRecetas([]);
  };

  // Función para buscar recetas con los ingredientes
  const buscarRecetas = () => {
    if (ingredientes.length === 0) {
      alert('Agrega al menos un ingrediente');
      return;
    }

    setCargando(true);
    const ingredientesParam = ingredientes.join(',+');
    const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredientesParam}&number=12&ranking=1&ignorePantry=false&apiKey=${API_KEY}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setRecetas(data);
        setCargando(false);
      })
      .catch((error) => {
        console.error('Error al buscar recetas:', error);
        setCargando(false);
      });
  };

  // Función para obtener detalles de una receta
  const obtenerDetallesReceta = (id, index) => {
    const url = `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=false&apiKey=${API_KEY}&instructionsRequired=true&addRecipeInformation=true&language=es`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const nuevasRecetas = [...recetas];
        nuevasRecetas[index].detalles = data; 
        setRecetas(nuevasRecetas);
      })
      .catch((error) => {
        console.error('Error al obtener detalles de la receta:', error);
      });
  };

  // Función para volver a la vista básica de la receta
  const volverResultados = (index) => {
    const nuevasRecetas = [...recetas];
    delete nuevasRecetas[index].detalles;
    setRecetas(nuevasRecetas);
  };

  return (
    <>
      <header>
        <h1>Encuentra recetas con los ingredientes que tengas a la mano</h1>
      </header>

      <main>
        <section id="buscador">
          <h2>Ingresa tus ingredientes</h2>
          <div className="input-container">
            <input
              type="text"
              id="ingrediente"
              placeholder="Escribe un ingrediente"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <div className="botones-container">
            <button id="agregar" onClick={agregarIngrediente}>
              <i className="fas fa-plus"></i> Agregar
            </button>
            <button id="limpiar" onClick={limpiarIngredientes}>
              <i className="fas fa-trash"></i> Reiniciar
            </button>
          </div>

          <h3>Ingredientes ingresados:</h3>
          <ul id="lista-ingredientes">
            {ingredientes.map((ing, index) => (
              <li key={index}>
                {ing}
                <button
                  className="btn-eliminar"
                  onClick={() => {
                    setIngredientes(ingredientes.filter((_, i) => i !== index));
                  }}
                >
                  X
                </button>
              </li>
            ))}
          </ul>

          <button id="buscar" onClick={buscarRecetas}>
            <i className="fas fa-search"></i> Buscar Recetas
          </button>
        </section>

        {/* Sección de resultados de recetas */}
        <section id="resultados">
          <h2>Recetas disponibles</h2>
          <div id="lista-recetas" className="recetas-grid">
            {cargando ? (
              <p className="instrucciones-iniciales">Buscando recetas...</p>
            ) : (
              recetas.length > 0 ? (
                recetas.map((receta, index) => (
                  <div key={receta.id} className="receta-card">
                    <img
                      src={receta.image}
                      alt={receta.title}
                      className="receta-imagen"
                    />
                    <div className="receta-info">
                      <h3>{receta.title}</h3>
                      <p>Ingredientes que tienes: {receta.usedIngredients.length}</p>
                      <p>Ingredientes adicionales: {receta.missedIngredients.length}</p>
                      {receta.detalles ? (
                        <>
                          <h4>Ingredientes:</h4>
                          <ul>
                            {receta.detalles.extendedIngredients.map((ing, idx) => (
                              <li key={idx}>
                                {ing.amount} {ing.unit} {ing.name}
                              </li>
                            ))}
                          </ul>
                          <h4>Instrucciones:</h4>
                          <ol>
                            {receta.detalles.analyzedInstructions?.[0]?.steps?.map((step, idx) => (
                              <li key={idx}>{step.step}</li>
                            ))}
                          </ol>
                          <button onClick={() => volverResultados(index)}>Cerrar</button> {/* Botón para cerrar */}
                        </>
                      ) : (
                        <button
                          className="btn-ver-detalle"
                          onClick={() => obtenerDetallesReceta(receta.id, index)}
                        >
                          Ver receta completa
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="instrucciones-iniciales">
                  Agrega ingredientes y presiona "Buscar Recetas" para encontrar deliciosas opciones.
                </p>
              )
            )}
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-box">
          <div className="footer-container">
            <div className="footer-section">
              <h3>Contacto</h3>
              <p>Email: contacto@recetasrusticas.com</p>
              <p>Teléfono: +52 123 456 7890</p>
            </div>
            <div className="footer-section">
              <h3>Redes Sociales</h3>
              <p><a href="#"><i className="fab fa-facebook"></i> Facebook</a> | <a href="#"><i className="fab fa-instagram"></i> Instagram</a></p>
            </div>
            <div className="footer-section">
              <p>&copy; 2025 Comunidad TecMM. Todos los derechos reservados.</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
