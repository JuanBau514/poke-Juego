const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
let cards;
let interval;
let firstCard = false;
let secondCard = false;

var items = []; // Array de las Imagenes que se van a mostrar en las cartas

const getPokemon = async () => {
    try {
        const url = "https://pokeapi.co/api/v2/pokemon?limit=12"; // traigo de la API 12 pokemones
        const response = await fetch(url); // creo una variable que apunta a al url de la variable anterior
        const data = await response.json(); // creo una variable que espera la respuesta de la variable anterior
        const pokemon = await Promise.all( // la var pokemon es una promesa que espera el resultado de la funcion Promise.all
            data.results.map(async (result) => {
                const response = await fetch(result.url);
                const pokemonData = await response.json();
                return {
                    name: result.name,
                    image: pokemonData.sprites.front_default,
                };
            })
        );
        return pokemon;
    } catch (error) {
        console.error("Error fetching Pokémon data:", error);
    }
};


getPokemon().then((pokemon) => {
    items = pokemon;
    console.log(items);
    initializer();
});


//Array de Items (cartas), URL de las imagenes en las cartas

/*
const items = [
    { name: "1", image: "http://gifgifs.com/animations/anime/pita-ten/pita_ten_17.gif" },
    { name: "2", image: "http://gifgifs.com/animations/anime/my-neighbor-totoro/my_neighbor_totoro_3.gif" },
    { name: "3", image: "http://gifgifs.com/animations/anime/bleach/gato-yoruichi/gato_yoruichi_1.gif" },
    { name: "4", image: "http://gifgifs.com/animations/anime/naruto/Sasuke-uchiha/sasuke_uchiha_15.gif" },
    { name: "5", image: "http://gifgifs.com/animations/anime/onegai-twins/onegai_twins_6.gif" },
    { name: "6", image: "http://gifgifs.com/animations/anime/saikano/saikano_13.gif" },
    { name: "7", image: "http://gifgifs.com/animations/creatures-cartoons/pokemon/Pikachu_jumps.gif" },
    { name: "8", image: "http://gifgifs.com/animations/anime/sayonara-zetsubo-sensei/sayonara_zetsubo_sensei_9.gif" },
    { name: "9", image: "http://gifgifs.com/animations/anime/death-note/death_note_6.gif" },
    { name: "10", image: "http://gifgifs.com/animations/anime/sayonara-zetsubo-sensei/sayonara_zetsubo_sensei_2.gif" },
    { name: "11", image: "http://gifgifs.com/animations/anime/fooly-cooly/fooly_cooly_48.gif" },
    { name: "12", image: "http://gifgifs.com/animations/anime/kimi-ga-nozomu-eien/kimi_ga_nozomu_eien_17.gif" },
];

*/

//Iniciador del temporizador
let seconds = 0,
    minutes = 0;

//Iniciador del contador de movimientos
let movesCount = 0,
    winCount = 0;

//Temporizador
const timeGenerator = () => {
    seconds += 1;
    if (seconds >= 60) {
        minutes += 1;
        seconds = 0;
    }
    //Formateo del contador, antes de inciar un nuevo ciclo
    let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
    let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
    timeValue.innerHTML = `<span>Time:</span>${minutesValue}:${secondsValue}`;
};

//Contador de movimientos
const movesCounter = () => {
    movesCount += 1;
    moves.innerHTML = `<span>Moves:</span>${movesCount}`;
};

//Toma cualquiere objeto dentro del array de items
const generateRandom = (size = 4) => {
    //Array temporal (probicional)
    let tempArray = [...items];
    //icializa la array "cardValues"
    let cardValues = [];
    //El tamaño debería ser el doble (matriz 4*4)/2 ya que existirían pares de objetos
    size = (size * size) / 2;
    //Se selecciona un objeto aleatorio 
    for (let i = 0; i < size; i++) {
        const randomIndex = Math.floor(Math.random() * tempArray.length);
        cardValues.push(tempArray[randomIndex]);
        //Una vez se selecciona, elimina el objeto del array temporal
        tempArray.splice(randomIndex, 1);
    }
    return cardValues;
};

const matrixGenerator = (cardValues, size = 4) => {

    gameContainer.innerHTML = "";
    cardValues = [...cardValues, ...cardValues];
    cardValues.sort(() => Math.random() - 0.5);
    const totalCards = size * size;
    for (let i = 0; i < totalCards; i++) {
        if (cardValues[i]) {
            gameContainer.innerHTML += `
            <div class="card-container" data-card-value="${cardValues[i].name}">
                <div class="card-before">?</div>
                <div class="card-after">
                    <img src="${cardValues[i].image}" class="image"/>
                </div>
            </div>
        `;
        }
    }
    gameContainer.style.gridTemplateColumns = `repeat(${size}, auto)`;

    cards = document.querySelectorAll(".card-container");
    cards.forEach((card) => {
        card.addEventListener("click", () => {
            //Si la tarjeta seleccionada no se ha emparejado, se ejecutará (animación) al hacer clic en ella.
            //En caso contrario solo se inrorara
            if (!card.classList.contains("matched")) {
                //Se da vuelta la carta seleccionada
                card.classList.add("flipped");
                //Identifica la primera carta seleccionada
                if (!firstCard) {
                    firstCard = card;
                    firstCardValue = card.getAttribute("data-card-value");
                } else {
                    //Incrementa el contador de movimientos, cuando selecionen la 2 carta
                    movesCounter();
                    //Identifica la segunda carta y evalua
                    secondCard = card;
                    let secondCardValue = card.getAttribute("data-card-value");
                    if (firstCardValue == secondCardValue) {
                        //Si ambas tarjetas coinciden, estas tarjetas seran ignoradas la próxima vez (gracias a la clase matched)
                        firstCard.classList.add("matched");
                        secondCard.classList.add("matched");
                        firstCard = false;
                        winCount += 1;
                        //Comprueba si winCount es igual a la mitad de cartas (cardValues)
                        if (winCount == Math.floor(cardValues.length / 2)) {
                            result.innerHTML = `<h2>You Won</h2>
            <h4>Moves: ${movesCount}</h4>`;
                            stopGame();
                        }
                    } else {
                        //Si las cartas no coinciden, vuelven a la normalidad
                        let [tempFirst, tempSecond] = [firstCard, secondCard];
                        firstCard = false;
                        secondCard = false;
                        let delay = setTimeout(() => {
                            tempFirst.classList.remove("flipped");
                            tempSecond.classList.remove("flipped");
                        }, 900);
                    }
                }
            }
        });
    });
};

//Start game
startButton.addEventListener("click", () => {
    movesCount = 0;
    seconds = 0;
    minutes = 0;
    //Visibilidad de controles y botones
    controls.classList.add("hide");
    stopButton.classList.remove("hide");
    startButton.classList.add("hide");
    //Iniciar Temporizador
    interval = setInterval(timeGenerator, 1000);
    //Inicio de movimientos
    moves.innerHTML = `<span>Moves:</span> ${movesCount}`;
    initializer();
});

//Stop game
stopButton.addEventListener(
    "click",
    (stopGame = () => {
        controls.classList.remove("hide");
        stopButton.classList.add("hide");
        startButton.classList.remove("hide");
        clearInterval(interval);
    })
);

//Inicializar los valores y los llamados a funciones
const initializer = () => {
    result.innerText = "";
    winCount = 0;
    let cardValues = generateRandom();
    console.log(cardValues);
    matrixGenerator(cardValues);
};