// C: clubs
// D: diamonds
// H: Hearts
// S: spades


let deck = [];
const tipos = ['C', 'D', 'H', 'S'];
const especiales = ['A', 'J', 'Q', 'K'];

let puntosJugador = 0,
    puntosBot = 0;

//Refs. html
const btnPedir = document.querySelector('#btnPedir');
const btnDetener = document.querySelector('#btnDetener');
const btnNuevo = document.querySelector('#btnNuevo');

const divCartasJugador = document.querySelector('#jugador-cartas');
const divCartasBot = document.querySelector('#bot-cartas');


const puntosHTML = document.querySelectorAll('small');


// PRE: 
// POST: devuelve una baraja de cartas mezclada aleatoriamente
const crearDeck = () => {

    deck = [];

    for(let i = 2; i <= 10; i++){
        for(let tipo of tipos){
            deck.push(i + tipo);
        }
    }

    for(let esp of especiales){
        for(let tipo of tipos){
            deck.push(esp + tipo);
        }
    }

    deck = _.shuffle(deck);

    console.log(deck)
    return deck
}

// PRE: deck.length >= 1
// POST: devueve una carta y la elimina de deck
const pedirCarta = () => {

    if(deck.length === 0){
        throw 'No hay cartas en el deck';
    }

    const carta = deck.pop()



    return carta;
}
// PRE: carta es una de tipo y número válido en formato: numero + carta
const valorCarta = (carta) => {
    
    const valor = carta.substring(0,carta.length - 1);

    return (isNaN(valor)) ? 
        ((valor === 'A') ? 11 : 10) 
        : valor * 1;
}

// PRE: puntosMinimos son los putntos obtenidos por el jugador  
//      que el ordenador intentará superar
// POST: el ordenador saca las cartas necesarias para intentar ganar 
//       y se determina el ganador
const turnoComputadora = ( puntosMinimos ) => {
    do {
    const carta = pedirCarta();
    puntosBot = puntosBot + valorCarta(carta);
    puntosHTML[1].innerText = puntosBot;

    //                 <img class="carta" src="assets/cartas/2C.png">

    const imgCarta = document.createElement('img');
    imgCarta.src = `assets/cartas/${ carta }.png`;
    imgCarta.classList.add('carta')
    divCartasBot.append(imgCarta);  
    
    if(puntosMinimos > 21){
        break;
    }

    } while( (puntosBot < puntosMinimos) && (puntosMinimos <= 21));

    setTimeout(() => {
        if(puntosMinimos === puntosBot){
            alert('Empat!');
        }else if(puntosMinimos > 21){
            alert('Has perdut!');
        }else if(puntosBot > 21 ){
            alert('Has guanyat!');
        }else {alert('Has perdut!')};

    }, 100);
    
}


crearDeck();


// Eventos

btnPedir.addEventListener('click', () => {
    const carta = pedirCarta();
    puntosJugador = puntosJugador + valorCarta(carta);
    puntosHTML[0].innerText = puntosJugador;

    //                 <img class="carta" src="assets/cartas/2C.png">

    const imgCarta = document.createElement('img');
    imgCarta.src = `assets/cartas/${ carta }.png`;
    imgCarta.classList.add('carta')
    divCartasJugador.append(imgCarta);


    if( puntosJugador > 21 ){
        console.warn('Has perdut!');
        btnPedir.disabled = true;
        btnDetener.disabled = true;
        turnoComputadora(puntosJugador);
    } else if ( puntosJugador === 21){
        console.warn('21, has guanyat!');
        btnDetener.disabled = true;
        btnPedir.disabled = true;
        turnoComputadora(puntosJugador);
    }

});

btnDetener.addEventListener('click', () => {
    btnDetener.disabled = true;
    btnPedir.disabled = true;
    turnoComputadora(puntosJugador);
});

btnNuevo.addEventListener('click', () => {
    console.clear();

    btnDetener.disabled = false;
    btnPedir.disabled = false;
    deck = crearDeck();
    puntosBot = 0;
    puntosJugador = 0;
    puntosHTML[0].innerText = 0;
    puntosHTML[1].innerText = 0;

    divCartasBot.innerHTML = '';
    divCartasJugador.innerHTML = '';

});