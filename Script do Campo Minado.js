// Funções do Jogo

const jogo = document.getElementById("game");
const largura = 10;
const altura = 10;
const numBombas = 10;
const celulas = [];
let jogoFinalizado = false;

// Função ao clicar na célula

function clickCelula(celula) {
    if (jogoFinalizado || celula.classList.contains("Seguro")) return;
    if (celula.dataset.bomba === "Bomba") {
        celula.classList.add("Explodiu");
        encerrarJogo();
    } else {
        revelar(celula);
        checarVitoria();
    }
}

// Geração do Mapa

function gerarMapa() {
    const total = largura * altura;
    const bombas = Array(numBombas).fill("Bomba");
    const seguros = Array(total - numBombas).fill("Seguro");
    const grades = bombas.concat(seguros).sort(() => Math.random() - 0.5);

    for (let i = 0; i < total; i++) {
        const celula = document.createElement("div");
        celula.classList.add("celula");
        celula.setAttribute("id", i);
        celula.setAttribute("data-bomba", grades[i]);
        celulas.push(celula);
        jogo.appendChild(celula);
        celula.addEventListener("click", () => clickCelula(celula));
    }

    // Contar Bombas ao Redor

    for (let i = 0; i < celulas.length; i++) {
        if (celulas[i].dataset.bomba === "Seguro") {
            let bombasAoRedor = 0;
            const isLeftEdge = i % largura === 0;
            const isRightEdge = i % largura === largura - 1;

            const adjacent = [
                i - largura,
                i + largura,
                !isLeftEdge && i - 1,
                !isRightEdge && i + 1,
                !isLeftEdge && i - largura - 1,
                !isRightEdge && i - largura + 1,
                !isLeftEdge && i + largura - 1,
                !isRightEdge && i + largura + 1
            ].filter(idx => idx !== false && idx >= 0 && idx < celulas.length);

            adjacent.forEach(idx => {
                if (celulas[idx].dataset.bomba === "Bomba") {
                    bombasAoRedor++;
                }
            });

            celulas[i].dataset.bombas = bombasAoRedor;
        }
    }
}

// Revelar as Células

function revelar(celula) {
    if (celula.classList.contains("Seguro")) return;
    celula.classList.add("Seguro");

    const count = parseInt(celula.dataset.bombas);
    if (count > 0) {
        celula.innerHTML = count;
    } else {
        const id = parseInt(celula.id);
        const isLeftEdge = id % largura === 0;
        const isRightEdge = id % largura === largura - 1;

        const adjacent = [
            id - largura,
            id + largura,
            !isLeftEdge && id - 1,
            !isRightEdge && id + 1,
            !isLeftEdge && id - largura - 1,
            !isRightEdge && id - largura + 1,
            !isLeftEdge && id + largura - 1,
            !isRightEdge && id + largura + 1
        ].filter(idx => idx !== false && idx >= 0 && idx < largura * altura);

        adjacent.forEach(idx => {
            revelar(celulas[idx]);
        });
    }
}

// Encerrar Jogo (Perdeu)

function encerrarJogo() {
    jogoFinalizado = true;
    celulas.forEach(celula => {
        if (celula.dataset.bomba === "Bomba") {
            celula.classList.add("Bomba");
            celula.innerHTML = "💣";
        }
    });
    alert("Você perdeu!");
}

// Checar se o Jogador Venceu

function checarVitoria() {
    const segurosRevelados = celulas.filter(cell => cell.classList.contains("Seguro"));
    if (segurosRevelados.length === largura * altura - numBombas) {
        jogoFinalizado = true;
        alert("Você venceu!");
    }
}

gerarMapa();