const buttons = document.querySelectorAll('.nav-btn');
const title = document.getElementById('game-title');
const viewport = document.getElementById('viewport');

const hoverSound = new Audio('assets/select.wav');
const startSound = new Audio('assets/start.wav');
hoverSound.volume = 1;
startSound.volume = 0.5;

buttons.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        hoverSound.currentTime = 0; 
        hoverSound.play().catch(e => console.log("Esperando interacción..."));
    });
    btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const gameName = btn.getAttribute('data-game');
        title.innerText = btn.innerText;

        loadGame(gameName);
    });
});

function loadGame(name) {

    const viewport = document.getElementById('viewport');
    const title = document.getElementById('game-title');
    if (!title) return;

    const gameList = document.querySelector('.game-list');

    gameList.classList.remove('ready-to-play');

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    const clickedBtn = document.querySelector(`[data-game="${name}"]`);
    if (clickedBtn) clickedBtn.classList.add('active');
    
    if (name === 'home') {
        title.innerText = "Home";
        viewport.innerHTML = `
            <div class="about-container"> 
                <div class="layout">               
                    <div class="about-content">
                        <button id="hello-btn" class="arcade-btn">Hello there!</button>
                        <p id="extra-text" class="hidden">
                            I am Ana and this is my little arcade, choose your favourite game!
                        </p>
                    </div>
                    
                    <div class="pixel-character">👾</div>
                </div>

            </div>`;

        const talkSound = new Audio('assets/blip.wav')
        talkSound.volume = 0.1;

        function typeEffect(element, text, speed, callback) {
            let i = 0;
            element.textContent = "";
            element.classList.remove('typing-finished');
            
            const timer = setInterval(() => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);

                    if(text.charAt(i) !== " ") {
                        const soundClone = talkSound.cloneNode();
                        soundClone.playbackRate = 0.8 + Math.random() * 0.4;
                        soundClone.play();
                    }

                    i++;
                } else {
                    clearInterval(timer);
                    element.classList.add('typing-finished');
                    if (callback) callback();
                }
            }, speed);
        }

        const helloBtn = document.getElementById('hello-btn');
        const extraText = document.getElementById('extra-text');

        typeEffect(helloBtn, "Hello there!", 100);

        helloBtn.addEventListener('click', function() {
            this.style.display = 'none';
            extraText.style.display = 'inline-block';

            typeEffect(extraText, "I am Ana and this is my little arcade, choose your favourite game to start playing!", 50, () => {
                document.querySelector('.game-list').classList.add('ready-to-play');
            });
        });
        return;
    }
    

    title.innerText = name.charAt(0).toUpperCase() + name.slice(1);

    const gamePath = `./projects/${name}/index.html`;

    viewport.innerHTML = `
        <iframe 
            src="${gamePath}" 
            style="width:100%; height:100%; border:none;"
            title="${name} Game">
        </iframe>`;
}

window.onload = function() {
    const splash = document.getElementById('splash-screen');

    splash.addEventListener('click', () => {
        splash.style.display = 'none';
        loadGame('home');

        startSound.play().catch(e => console.log("Audio play failed"));
    });
}

document.getElementById('reset-btn').addEventListener('click', () => {
    const iframe = document.querySelector('#viewport iframe');
    
    if (iframe) {
        iframe.src = iframe.src;
    } else {
        loadGame('home');
    }
});

document.querySelectorAll('.sidebar-footer a').forEach(link => {
    link.addEventListener('mouseenter', () => {
        hoverSound.play();
    });
});
