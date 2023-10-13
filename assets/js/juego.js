// 2C = Two of Clubs
// 2D = Two of Diamonds
// 2H = Two of Hearts
// 2S = Two of Spades

// Modulo
const backjack = (() => {
    'use strict'

    let deck = [];
    let puntosJugadores = []

    const   tipos = ['C','D','H','S'],
            especiales = ['A','J','Q','K'];

    const puntosHTML = document.querySelectorAll('small')
    const cartasJugadores = document.querySelectorAll('.cartasJugador'),
            btnNuevo = document.getElementById('btnNuevo'),
            btnCarta = document.getElementById('btnCarta'),
            btnDetener = document.getElementById('btnDetener');

    const inicializarJuego = ( numJugadores = 1) => {
        deck = crearDeck();
        puntosJugadores = []

        btnCarta.disabled = false;
        btnDetener.disabled = false;
        puntosHTML.forEach(element => element.innerText = '0 pts.');
        cartasJugadores.forEach(element => element.innerHTML = '<img class="carta" src="assets/images/cartas/grey_back.png"/>');

        for (let index = 0; index < numJugadores + 1; index++) {
            puntosJugadores.push(0)
        }
    };

    const crearDeck = () => {
        deck = [];

        for (let i = 2; i < 11; i++) {
            for (const tipo of tipos) {
                deck.push( i + tipo );
            }
        }

        for (const tipo of tipos) {
            for (const especial of especiales) {
                deck.push( especial + tipo);
            }
        }

        return _.shuffle( deck );
    }

    const pedirCarta = () => {

        if ( deck.length === 0) {
            throw 'No hay mas cartas en el deck';
        }
        
        return deck.pop();
    }

    const valorCarta = ( carta ) => {
        // toma todos los caracteres desde el inicio hasta el penúltimo carácter de la cadena, creando así una nueva cadena sin el último carácter.
        let valor = carta.slice(0, -1)
        return ( isNaN( valor ) ) ?
            ( valor === 'A' ) ? 11 : 10
            : valor * 1
    }

    const sumarPuntos = ( carta, turno ) => {
        let puntosJugador = puntosJugadores[turno] + valorCarta( carta );
        puntosJugadores[turno] = puntosJugador;
        puntosHTML[turno].innerText = `${puntosJugador} pts.`;
    }

    const crearCarta = ( carta, turno) => {
        let img = document.createElement('img')

        img.classList.add('carta')
        img.src = `assets/images/cartas/${carta}.png`
        cartasJugadores[turno].appendChild(img)
    }

    const calculaGanador = () => {
        const [puntosMinimos, puntosBot] = puntosJugadores

        setTimeout( () =>{
            if( puntosBot === puntosMinimos ){
                console.warn('Nadie gana.');
                Swal.fire({
                    title: 'Nadie gana.!',
                    text: 'Jugar de nuevo?',
                    icon: 'info',
                    confirmButtonText: 'OK',
                    showCancelButton: true,
                    cancelButtonText: 'Cerrar',
                    showCloseButton: false,
                }).then((result) => {
                    if (result.isConfirmed) {
                        reiniciar();
                    }
                })
            }else if (puntosMinimos > 21) {
                console.warn('Jugador perdio la partida.');
                Swal.fire({
                    title: 'Jugador perdio la partida.!',
                    text: 'Jugar de nuevo?',
                    icon: 'error',
                    confirmButtonText: 'OK',
                    showCancelButton: true,
                    cancelButtonText: 'Cerrar',
                    showCloseButton: false,
                }).then((result) => {
                    if (result.isConfirmed) {
                        reiniciar();
                    }
                })
            } else if( puntosBot > 21 ) {
                console.log('Jugador gano la partida.');
                Swal.fire({
                    title: 'Jugador gano la partida.!',
                    text: 'Jugar otra partida?',
                    icon: 'success',
                    confirmButtonText: 'Cool',
                    showCancelButton: true,
                    cancelButtonText: 'Cerrar',
                    showCloseButton: false,
                }).then((result) => {
                    if (result.isConfirmed) {
                        reiniciar();
                    }
                })
            }else {
                console.log('Bot gano la partida.');
                Swal.fire({
                    title: 'Bot gano la partida.!',
                    text: 'Jugar otra partida?',
                    icon: 'warning',
                    confirmButtonText: 'Cool',
                    showCancelButton: true,
                    cancelButtonText: 'Cerrar',
                    showCloseButton: false,
                }).then((result) => {
                    reiniciar();
                })
            }
        }, 600)
    };

    const reiniciar = () =>{
        console.clear();
        deck = crearDeck();
        inicializarJuego();
    };

    // Turno BOT
    const turnoBot = ( puntosMinimos ) => {
        const botIndex = puntosJugadores.length - 1
        do {
            let carta = pedirCarta();
            sumarPuntos( carta, botIndex );
            crearCarta(carta, botIndex)

            if (puntosMinimos > 21){
                break;
            }
        } while ( (puntosJugadores[botIndex] < puntosMinimos) && (puntosMinimos <= 21) );

        calculaGanador();
    }

    // Eventos
    btnNuevo.addEventListener('click', () => {
        reiniciar();
        inicializarJuego();
    });

    btnCarta.addEventListener('click', () => {
        let carta = pedirCarta();

        sumarPuntos( carta, 0 );
        crearCarta(carta, 0)

        if (puntosJugadores[0] > 21) {
            btnCarta.disabled = true;
            btnDetener.disabled = true;
            turnoBot( puntosJugadores[0] );
        } else if( puntosJugadores[0] === 21 ) {
            btnCarta.disabled = true;
            btnDetener.disabled = true;
            turnoBot( puntosJugadores[0] );
        }
    });

    btnDetener.addEventListener('click', () => {
        btnCarta.disabled = true;
        btnDetener.disabled = true;
        turnoBot( puntosJugadores[0] );
    });

    return {
        start: inicializarJuego,
        reset: reiniciar
    }

})();

// Prueba de carta aleatoria y tamaño del deck
// for (let index = 0; index < 60; index++) {
//     let carta = pedirCarta();
//     const valor = valorCarta( carta );
//     console.log({ carta, valor })
// }
