const totalCards = 12;
let cards = [];
let selected = [];
let valuesUsed = [];
let currentMove = 0;
let pairsFound = 0;

let cardTemplate = '<div class="card"><div class="back"></div><div class="front"></div></div>'

const cardFlipSound = new Audio('assets/card-flip.wav');
const looseSound = new Audio('assets/loose.wav');
const correctSound = new Audio('assets/correct.wav')
const winSound = new Audio('assets/win.mp3');

cardFlipSound.volume = 1;
looseSound.volume = 1;
correctSound.volume = 1;
winSound.volume = 1;

function activate(e) {
    if(currentMove < 2) {
        if((!selected[0] || selected[0] !== e.currentTarget) && !e.currentTarget.classList.contains('active')) {
            
            cardFlipSound.currentTime = 0;
            cardFlipSound.play().catch(e => console.log("Esperando interacción"));

            e.currentTarget.classList.add('active');
            selected.push(e.currentTarget);

            if(++currentMove == 2) {

                if(selected[0].querySelector('.front').innerHTML == selected[1].querySelector('.front').innerHTML) {
                    pairsFound++;

                    correctSound.play();
                    selected = [];
                    currentMove = 0;
                    if (pairsFound === totalCards / 2) {
                        winSound.play();
                        document.getElementById("win-screen").style.display = "flex";
                    }
                }
                else {
                    looseSound.currentTime = 0;
                    looseSound.play();

                    selected[0].classList.add('shake');
                    selected[1].classList.add('shake');

                    setTimeout(() => {
                        selected[0].classList.remove('active');
                        selected[1].classList.remove('active');
                        
                        selected[0].classList.remove('shake');
                        selected[1].classList.remove('shake');
                        
                        selected = [];
                        currentMove = 0;
                    }, 600);
                }
            }
        }
    }
}

function randomValue() {
    let rnd = Math.floor(Math.random() * totalCards * 0.5);
    let values = valuesUsed.filter(value => value === rnd);
    if(values.length < 2) {
        valuesUsed.push(rnd);
    }
    else {
        randomValue();
    }
}

function initGame() {
    document.querySelector('#game').innerHTML = "";
    cards = [];
    valuesUsed = [];
    selected = [];
    currentMove = 0;
    pairsFound = 0;

    for (let i=0; i<totalCards; i++) {
        randomValue();
        let div = document.createElement('div');
        div.innerHTML = cardTemplate;
        cards.push(div);
        document.querySelector('#game').append(cards[i]);
        cards[i].querySelector('.front').innerHTML = valuesUsed[i];
        cards[i].querySelector('.card').addEventListener('click', activate);
    }
}

function resetGame() {
    document.getElementById("win-screen").style.display = "none";
    initGame();
}

initGame();