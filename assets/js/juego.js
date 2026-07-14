const myMain = (() => {
    'use strict' // cal iniciar joc

    let deck = [];
    const tipos = ['C', 'D', 'H', 'S'],
        especiales = ['A', 'J', 'Q', 'K'];

    // let puntosJugador = 0,
    //     puntosBot = 0;
    let puntosJugadores = [];


    // Refs. html
    const btnPedir = document.querySelector('#btnPedir'),
        btnDetener = document.querySelector('#btnDetener'),
        btnNuevo = document.querySelector('#btnNuevo');

    const divCartasJugadores = document.querySelectorAll('.divCartas'),
        puntosHTML = document.querySelectorAll('small');

    // PRE: 
    // POST: inicia el juego
    const inicializarJuego = (numJugadores = 2) => {
        deck = crearDeck();
        puntosJugadores = [];
        for(let i = 0; i < numJugadores; i++){
            puntosJugadores.push(0);
        }

        puntosHTML.forEach(elem => elem.innerText = 0);
        divCartasJugadores.forEach(elem => elem.innerHTML = '');

        btnDetener.disabled = false;
        btnPedir.disabled = false;
    }

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

        return _.shuffle(deck);
    }

    // PRE: deck.length >= 1
    // POST: devuelve una carta y la elimina de deck
    const pedirCarta = () => {

        if(deck.length === 0){
            throw 'No hay cartas en el deck';
        }
        return deck.pop();
    }

    // PRE: carta es una de tipo y número válido en formato: numero + carta
    // POST: devuelve el valor de la carta en puntuación de Blackjack
    const valorCarta = (carta) => {
        
        const valor = carta.substring(0, carta.length - 1);

        return (isNaN(valor)) ? 
            ((valor === 'A') ? 11 : 10) 
            : valor * 1;
    }

    // PRE:
    // Turno: 0 indica que es el primer jugador, el último es el Bot
    // Carta: es una carta valida en formato Blackjack ej: (2H)
    const acumularPuntos = (turno, carta) => {

        puntosJugadores[turno] = puntosJugadores[turno] + valorCarta(carta);
        puntosHTML[turno].innerText = puntosJugadores[turno];

        return puntosJugadores[turno];
    }

    const crearCarta = (carta, turno) => {
        const imgCarta = document.createElement('img');
        imgCarta.src = `assets/cartas/${ carta }.png`;
        imgCarta.classList.add('carta')
        divCartasJugadores[turno].append(imgCarta);  
    }

    const determinarGanador = () => {

        const [puntosMinimos, puntosBot] = puntosJugadores; // 2 jug

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

    // PRE: puntosMinimos son los putntos obtenidos por el jugador  
    //      que el ordenador intentará superar
    // POST: el ordenador saca las cartas necesarias para intentar ganar 
    //       y se determina el ganador
    const turnoComputadora = ( puntosMinimos ) => {

        let puntosBot = 0;

        do {
        const carta = pedirCarta();
        puntosBot = acumularPuntos(puntosJugadores.length - 1, carta);
        crearCarta(carta, puntosJugadores.length - 1);

        } while( (puntosBot < puntosMinimos) && (puntosMinimos <= 21));

        determinarGanador();
        
    }


    // Eventos

    btnPedir.addEventListener('click', () => {
        const carta = pedirCarta();
        const puntosJugador = acumularPuntos(0, carta);

        crearCarta(carta, 0);


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
        turnoComputadora(puntosJugadores[0]);
    });

    btnNuevo.addEventListener('click', () => {
        inicializarJuego();
    });

    inicializarJuego();

    return {
        nuevoJuego: inicializarJuego
    };

})();

