const keyboardButtons = document.querySelectorAll('#keyboard button');

// Abrir popup de regras
const btnRegras = document.getElementById('btnRegras');
const popupRegras = document.getElementById('popupRegras');
const fecharPopup = document.getElementById('fecharPopup');

btnRegras.addEventListener('click', () => {
    popupRegras.style.display = 'block';
});

// Fechar popup ao clicar no X
fecharPopup.addEventListener('click', () => {
    popupRegras.style.display = 'none';
});

// Fechar popup se clicar fora da área do conteúdo
window.addEventListener('click', (event) => {
    if (event.target === popupRegras) {
        popupRegras.style.display = 'none';
    }
});


function carregarPalavras() {
    fetch("words.json")
        .then(res => res.json())
        .then(data => {
            listaPalavras = data.palavras.map(p => p.toUpperCase());
            palavraSecreta = listaPalavras[Math.floor(Math.random() * listaPalavras.length)];
            console.log("Palavra secreta:", palavraSecreta); 
        })
        .catch(err => console.error("Erro ao carregar JSON:", err));
}

for(let i = 0; i < keyboardButtons.length; i++) {
    keyboardButtons[i].addEventListener('click', function(event) {
        const key = event.target.textContent;
        if(key.toUpperCase() === "Backspace".toUpperCase()) {
            // Vai remover a última letra da linha atual
            removerUltimaLetraLinha(0);
        } else if(key.toUpperCase() === "Enter".toUpperCase()) {
            // Verificar se tem o cumprimento necessário, se palavra é válida, obter o resultado para a palavra, mostrar o feedback e passar para a próxima linha
            // Depois das verificações
            if(board.length < MAX_LINHAS) {
                adicionarLinha();
            }
        } else {
            // Adicionar letra ao tabuleiro
            adicionarLetraTabuleiro(key);
        }
    });
}

const MAX_LINHAS = 6;
const board = [];
const words = ["APPLE", "HELLO", "MAGIC", "HOUSE"];

function isLinhaValida(linha) {
    if(linha < 0 || linha >= MAX_LINHAS) {
        console.error("Linha inválida");
        return false;
    }
    return true;
}

function isPalavraValida(palavra) {
    return words.includes(palavra.toUpperCase());
}

function adicionarLetraTabuleiro(letra) {
    // TODO: Adicionar uma letra ao tabuleiro tanto no DOM quanto no array.
    var linha = board.length - 1; // Linha atual onde a letra será adicionada
    if(board.length < MAX_LINHAS && board[linha] == undefined) {
        adicionarLinha(); // Adiciona uma nova linha se necessário
        linha++;
    }
    if(!isLinhaValida(linha)) {
        return;
    }


    if(board[linha].length < 5) {
        board[linha] += letra;
        desenharLetraTabuleiro(letra, linha, board[linha].length - 1);
        console.log(`Letra '${letra}' adicionada à linha ${linha}.`);
        console.log(board);
    } else {
        console.error("Linha já está completa.");
        return;
    }
}

function adicionarLinha() {
        board.push("");
}

function removerUltimaLetraLinha(linha) { 
    // TODO: Para o backspace, remover a última letra da linha especificada no tabuleiro.
    var linha = board.length - 1;
    
    if(!isLinhaValida(linha)) {
        return;
    }
    if(board[linha].length > 0) {
        board[linha] = board[linha].slice(0, -1);
        desenharLetraTabuleiro("", linha, board[linha].length)
    } else {
        console.error("Linha já está vazia.");
    }
}

function desenharLetraTabuleiro(letra, linha, coluna) {
    const cell = document.querySelector(`#board div:nth-child(${linha + 1}) div:nth-child(${coluna + 1})`);
    if(cell) {
        cell.textContent = letra;
    } else {
        console.error("Célula inválida para desenhar a letra.");
    }
}


function getResultadoPalavra(palavraJogada, palavraCorreta) {
    // TODO: Verifica se a jogada é correta. Devolve uma estrutura que indica quais letras estão corretas, erradas ou em posições erradas.
}

carregarPalavras()