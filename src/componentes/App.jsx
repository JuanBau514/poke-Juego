import { useState } from 'react'
import reactLogo from '../assets/react.svg'
import viteLogo from '../assets/vite.svg'
import '../estilosCss/App.css'

function App() {
  const [count, setCount] = useState(0)

  // conexion con la api de pokemon

  const [pokemon, setPokemon] = useState([]) // estado inicial vacio

  const getPokemones = async () => {
    const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100&offset=200')
    const data = await res.json()
    const results = data.results
    setPokemon(results)
  }



  return (
    <>
      <div>
              <h1>Poke-Memoria</h1>

        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
              <h4>El juego de memoria de Pokemon </h4>

      </div>


      <div className="card">
        <button onClick={() => getPokemones()}>
          Empezar a jugar
        </button>
        <p>
        </p>
      </div>

      <div className='reglas'>
        <h2>Reglas del juego</h2>
        <p>
          1. El juego consiste en encontrar las parejas de pokemones iguales.<br />
          2. El juego termina cuando completas el nivel 10. <br />
          3. Con cada nivel que se avanza, se aumenta la cantidad de pokemones. <br />
          4. El juego se reinicia cuando se pierde. <br />
          5. Te daremos un archivo pdf que valide que pasaste el juego <br/>
          6. Tienes 3 intentos para pasar el juego <br/>

        </p>
       
      </div>

      <p className="read-the-docs">
        proyecto realizado con React y Vite. <br />
        Juego realizado por Juan Bautista, y Danna Sepulveda. <br />
      </p>

    </>
  )
}

export default App
