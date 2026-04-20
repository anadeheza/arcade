var numSelected = null;
var tileSelected = null;

var errores = 0;
var timer = 0;
var timerInterval = null;

const clickSound = new Audio('assets/click.wav');
const errorSound = new Audio('assets/error.wav');
const winSound = new Audio('assets/win.mp3');

winSound.volume = 1;
clickSound.volume = 1;
errorSound.volume = 1;

var puzzles = [
    {
        tablero: [
            "--74916-5",
            "2---6-3-9",
            "-----7-1-",
            "-586----4",
            "--3----9-",
            "--62--187",
            "9-4-7---2",
            "67-83----",
            "81--45---"
        ],
        solucion: [
            "387491625",
            "241568379",
            "569327418",
            "758619234",
            "123784596",
            "496253187",
            "934176852",
            "675832941",
            "812945763"
        ]
    },
    {
        tablero: [
            "5-4--8---",
            "67-1--3--",
            "----4-5--",
            "-5-7-----",
            "4-------1",
            "-----4-5-",
            "--1-3----",
            "--7--9-3-",
            "---2--1-9"
        ],
        solucion: [
            "534678912",
            "672195348",
            "198342567",
            "859761423",
            "426853791",
            "713924856",
            "961537284",
            "287419635",
            "345286179"
        ]
    },
    {
        tablero: [
            "4---6--8-",
            "-8-5-----",
            "--7------",
            "-2-----4-",
            "----8----",
            "-5-----2-",
            "-----6---",
            "-----7-3-",
            "-6--1---9"
        ],
        solucion: [
            "435269781",
            "682571493",
            "197834562",
            "826195347",
            "374682915",
            "951743628", 
            "519326874",
            "248957136",
            "763418259"
        ]
    }
];

var tablero = [];
var solucion = [];

function selectRandomPuzzle() {
    let randomIndex = Math.floor(Math.random() * puzzles.length);
    tablero = puzzles[randomIndex].tablero;
    solucion = puzzles[randomIndex].solucion;
}

window.onload = function() {
    selectRandomPuzzle();
    setGame();
    initGame();
}

function setGame() {
    //digitos 1-9
    for (let i = 1; i <= 9; i++) {
        let numero = document.createElement("div");
        numero.id = i;
        numero.innerText = i;
        numero.addEventListener("click", selectNumero);
        numero.classList.add("numero");
        document.getElementById("digitos").appendChild(numero);
    }

    //tablero 9x9
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let celda = document.createElement("div");
            celda.id = r.toString() + "-" + c.toString();
            
            if (tablero[r][c] != "-") {
                celda.innerText = tablero[r][c];
                celda.classList.add("celda-start");
            }
            
            if (r == 2 || r == 5) {
                celda.classList.add("horizontal-line");
            }

            if (c == 2 || c == 5) {
                celda.classList.add("vertical-line");
            }

            celda.addEventListener("click", selectCelda);
            celda.classList.add("celda");
            document.getElementById("tablero").appendChild(celda);

        }
    }
}

function selectNumero() { 
    clearNumberHighlight();
    clearRelatedHighlight();
    
    if (numSelected != null) {
        numSelected.classList.remove("numeroSeleccionado");
    }

    numSelected = this;
    numSelected.classList.add("numeroSeleccionado");
    
    clickSound.currentTime = 0;
    clickSound.play().catch(e => console.log("Esperando interacción"));

    highlightRelatedCellsForNumber(numSelected.id);
    highlightNumber(numSelected.id);
}

function highlightNumber(num) {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let celda = document.getElementById(r.toString() + "-" + c.toString());
            if (celda.innerText == num) {
                celda.classList.add("numero-destacado");
            }
        }
    }
}

function clearNumberHighlight() {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let celda = document.getElementById(r.toString() + "-" + c.toString());
            celda.classList.remove("numero-destacado");
        }
    }
}

function highlightRelatedCells(row, col) {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let celda = document.getElementById(r.toString() + "-" + c.toString());

            if (r === row || c === col) {
                celda.classList.add("celda-relacionada");
            }

            let boxRow = Math.floor(row / 3) * 3;
            let boxCol = Math.floor(col / 3) * 3;
            if (r >= boxRow && r < boxRow + 3 && c >= boxCol && c < boxCol + 3) {
                celda.classList.add("celda-relacionada");
            }
        }
    }
}

function highlightRelatedCellsForNumber(num) {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let celda = document.getElementById(r.toString() + "-" + c.toString());
            if (celda.innerText == num) {

                for (let i = 0; i < 9; i++) {
                    let cell = document.getElementById(r.toString() + "-" + i.toString());
                    cell.classList.add("celda-relacionada");
                }

                for (let i = 0; i < 9; i++) {
                    let cell = document.getElementById(i.toString() + "-" + c.toString());
                    cell.classList.add("celda-relacionada");
                }

                let boxRow = Math.floor(r / 3) * 3;
                let boxCol = Math.floor(c / 3) * 3;
                for (let i = boxRow; i < boxRow + 3; i++) {
                    for (let j = boxCol; j < boxCol + 3; j++) {
                        let cell = document.getElementById(i.toString() + "-" + j.toString());
                        cell.classList.add("celda-relacionada");
                    }
                }
            }
        }
    }
}

function clearRelatedHighlight() {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let celda = document.getElementById(r.toString() + "-" + c.toString());
            celda.classList.remove("celda-relacionada");
        }
    }
}

function selectCelda() {
    if (numSelected) {
        if (this.innerText != "") {
            return;
        }

        let coords = this.id.split("-");
        let r = parseInt(coords[0]);
        let c = parseInt(coords[1]);

        if (solucion[r][c] != numSelected.id) {
            errorSound.currentTime = 0;
            errorSound.play();

            errores += 1;
            let errorDisplay = document.getElementById("errores");
            if (errorDisplay) {
                errorDisplay.innerText = errores;
            }
            this.innerText = "";
        }
        else {
            clickSound.currentTime = 0;
            clickSound.play();
            
            this.innerText = numSelected.id;
            checkNumberComplete(numSelected.id);
            checkWin();
        }
    }
}

function checkNumberComplete(num) {
    // Checkeamos si todos los lugares donde va el numero estan completados
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (solucion[r][c] == num) {
                let celda = document.getElementById(r.toString() + "-" + c.toString());
                if (celda.innerText != num) {
                    document.getElementById(num).classList.remove("numeroCompleto");
                    return;
                }
            }
        }
    }
    document.getElementById(num).classList.add("numeroCompleto");
}

function checkWin() {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let celda = document.getElementById(r.toString() + "-" + c.toString());
            if (celda.innerText != solucion[r][c]) {
                return;
            }
        }
    }

    stopTimer();
    winSound.play();

    updateWinMessage();
    document.getElementById("win-screen").style.display = "flex";
}

function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timer++;
        updateTimerDisplay();
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function resetTimer() {
    stopTimer();
    timer = 0;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    let minutes = Math.floor(timer / 60);
    let seconds = timer % 60;
    let contador = document.querySelector(".contador");
    if (contador) {
        contador.innerText = 
            minutes.toString().padStart(2, '0') + ":" + seconds.toString().padStart(2, '0');
    }
}

function updateWinMessage() {
    let minutes = Math.floor(timer / 60);
    let seconds = timer % 60;
    let timeText = "Felicitaciones";
    document.querySelector(".win-message p").innerText = timeText;
}

function initGame() {
    selectRandomPuzzle();

    // limpiamos el tablero
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let celda = document.getElementById(r.toString() + "-" + c.toString());
            if (tablero[r][c] == "-") {
                celda.innerText = "";
                celda.classList.remove("celda-start");
            } else {
                celda.innerText = tablero[r][c];
                celda.classList.add("celda-start");
            }
        }
    }

    errores = 0;
    document.getElementById("errores").innerText = errores;
    document.getElementById("win-screen").style.display = "none";

    if (numSelected) {
        numSelected.classList.remove("numeroSeleccionado");
        clearNumberHighlight();
        numSelected = null;
    }
    // Reseteamos el timer
    resetTimer();
    startTimer();

    document.querySelector(".win-message p").innerText = "Felicitaciones";
    updateTimerDisplay();
    
    // Reseteamos los botones
    for (let i = 1; i <= 9; i++) {
        document.getElementById(i).classList.remove("numeroCompleto");
    }
}

function resetGame() {
    stopTimer();
    initGame();
}
