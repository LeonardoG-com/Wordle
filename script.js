// Seleciona todos os botões do teclado virtual
const keyboardButtons = document.querySelectorAll('#keyboard button');

// Seleciona elementos do popup de regras
const btnRegras = document.getElementById('btnRegras');
const popupRegras = document.getElementById('popupRegras');
const fecharPopup = document.getElementById('fecharPopup');

// Seleciona elementos do popup de letras incompletas
const popupLetrasIncompletas = document.getElementById("popupLetrasIncompletas");
const fecharPopupLetras = document.getElementById("fecharPopupLetras");

// Seleciona elementos do popup de vitória
const popupVitoria = document.getElementById("popupVitoria");
const fecharPopupVitoria = document.getElementById("fecharPopupVitoria");

// Seleciona o botão de reinício (inicialmente escondido)
const botaoReiniciar = document.getElementById("botaoReiniciar");


// Seleciona elementos do popup de derrota
const popupDerrota = document.getElementById("popupDerrota");
const fecharPopupDerrota = document.getElementById("fecharPopupDerrota");
const mensagemDerrota = document.getElementById("mensagemDerrota");

// Eventos para fechar o popup de derrota
fecharPopupDerrota.addEventListener('click', () => {
    popupDerrota.style.display = 'none';
    botaoReiniciar.style.display = 'block';
});
window.addEventListener('click', (event) => {
    if (event.target === popupDerrota) {
        popupDerrota.style.display = 'none';
        botaoReiniciar.style.display = 'block';
    }
});

// Eventos para abrir e fechar o popup de regras
btnRegras.addEventListener('click', () => popupRegras.style.display = 'block');
fecharPopup.addEventListener('click', () => popupRegras.style.display = 'none');
window.addEventListener('click', (event) => {
    if (event.target === popupRegras) popupRegras.style.display = 'none';
});

// Eventos para fechar o popup de letras incompletas
fecharPopupLetras.addEventListener('click', () => popupLetrasIncompletas.style.display = 'none');
window.addEventListener('click', (event) => {
    if (event.target === popupLetrasIncompletas) popupLetrasIncompletas.style.display = 'none';
});

// Eventos para fechar o popup de vitória e mostrar botão de reinício
fecharPopupVitoria.addEventListener('click', () => {
    popupVitoria.style.display = 'none';
    botaoReiniciar.style.display = 'block';
});
window.addEventListener('click', (event) => {
    if (event.target === popupVitoria) {
        popupVitoria.style.display = 'none';
        botaoReiniciar.style.display = 'block';
    }
});

// Variáveis do jogo
let palavraSecreta = "";
let listaPalavras = [];
const MAX_LINHAS = 6;
const board = [];

// Carrega a lista de palavras e escolhe uma aleatória
function carregarPalavras() {
    fetch("words.json")
        .then(res => res.json())
        .then(data => {
            listaPalavras = data.palavras.map(p => p.toUpperCase());
            palavraSecreta = listaPalavras[Math.floor(Math.random() * listaPalavras.length)];
            console.log("Palavra secreta:", palavraSecreta);
        })
        .catch(err => console.error("Erro ao carregar palavras:", err));
}

// Verifica se a linha está dentro do limite
function isLinhaValida(linha) {
    return linha >= 0 && linha < MAX_LINHAS;
}



// Adiciona uma letra na linha atual
function adicionarLetraTabuleiro(letra) {
    let linha = board.length - 1;

    if (board.length < MAX_LINHAS && board[linha] == undefined) {
        adicionarLinha();
        linha++;
    }

    if (!isLinhaValida(linha)) return;

    if (board[linha].length < 5) {
        board[linha] += letra.toUpperCase();
        desenharLetraTabuleiro(letra.toUpperCase(), linha, board[linha].length - 1);
    }
}

// Adiciona uma nova linha vazia
function adicionarLinha() {
    board.push("");
}

// Remove a última letra da linha atual
function removerUltimaLetraLinha() {
    let linha = board.length - 1;
    if (!isLinhaValida(linha)) return;

    if (board[linha].length > 0) {
        board[linha] = board[linha].slice(0, -1);
        desenharLetraTabuleiro("", linha, board[linha].length);
    }
}

// Atualiza a célula do tabuleiro com a letra
function desenharLetraTabuleiro(letra, linha, coluna) {
    const cell = document.querySelector(`#board .row:nth-child(${linha + 1}) .cell:nth-child(${coluna + 1})`);
    if (cell) {
        cell.textContent = letra;
        cell.className = "cell"; // limpa classes antigas
    }
}

// Compara a palavra jogada com a palavra secreta
function getResultadoPalavra(palavraJogada, palavraCorreta) {
    const resultado = [];
    const usada = Array(5).fill(false);

    // Letras na posição correta
    for (let i = 0; i < 5; i++) {
        if (palavraJogada[i] === palavraCorreta[i]) {
            resultado[i] = 'correta';
            usada[i] = true;
        }
    }

    // Letras certas na posição errada ou erradas
    for (let i = 0; i < 5; i++) {
        if (!resultado[i]) {
            let achou = false;
            for (let j = 0; j < 5; j++) {
                if (!usada[j] && palavraJogada[i] === palavraCorreta[j]) {
                    achou = true;
                    usada[j] = true;
                    break;
                }
            }
            resultado[i] = achou ? 'existe' : 'errada';
        }
    }

    return resultado;
}

// Aplica as cores no tabuleiro e atualiza o teclado
function aplicarCores(linha, resultado) {
    const row = document.querySelectorAll(`#board .row:nth-child(${linha + 1}) .cell`);
    resultado.forEach((status, i) => {
        const letra = row[i].textContent;
        row[i].classList.add(status);
        atualizarTeclado(letra, status);
    });
}

// Atualiza o teclado com o status da letra
function atualizarTeclado(letra, status) {
    const tecla = Array.from(keyboardButtons).find(btn => btn.textContent === letra);
    if (!tecla) return;

    const prioridade = { correta: 3, existe: 2, errada: 1 };
    const estadoAtual = tecla.dataset.estado;

    if (!estadoAtual || prioridade[status] > prioridade[estadoAtual]) {
        tecla.classList.remove("correta", "existe", "errada");
        tecla.classList.add(status);
        tecla.dataset.estado = status;
    }
}

// Evento para cada tecla do teclado virtual
keyboardButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        const key = event.target.textContent.toUpperCase();

        if (key === "BACKSPACE") {
            removerUltimaLetraLinha();

        } else if (key === "ENTER") {
            const linhaAtual = board[board.length - 1];

            if (!palavraSecreta) return;

            if (linhaAtual.length < 5) {
                popupLetrasIncompletas.style.display = 'block';
                return;
            }


            const resultado = getResultadoPalavra(linhaAtual, palavraSecreta);
            aplicarCores(board.length - 1, resultado);

            if (linhaAtual.toUpperCase() === palavraSecreta.toUpperCase()) {
                popupVitoria.style.display = "block";
            } else if (board.length < MAX_LINHAS) {
                adicionarLinha();
            } else {
                mensagemDerrota.textContent = `Fim de jogo! A palavra correta era: ${palavraSecreta}`;
                popupDerrota.style.display = "block";

            }

        } else {
            adicionarLetraTabuleiro(key);
        }
    });
});

// Inicializa o jogo
carregarPalavras();
adicionarLinha();
