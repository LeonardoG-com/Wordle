
const teclas = document.querySelectorAll(".tecla");
const linhas = document.querySelectorAll(".linha");

let linhaAtual = 0;
let colunaAtual = 0;

teclas.forEach(tecla => {
    tecla.addEventListener("click", () => {
        const letra = tecla.textContent;

        if (letra === "REGRAS") {
            return; // impede que continue para o código da grelha
        }
if (letra === "ENTER") {
    // Verifica se já foram inseridas 5 letras
    if (colunaAtual < 5) {
        document.getElementById("popupLetras").style.display = "flex";
        return;
    }

    // Obter a palavra digitada
    let palavra = "";
    for (let i = 0; i < 5; i++) {
        palavra += linhas[linhaAtual].children[i].textContent;
    }

    palavra = palavra.toUpperCase();

    // Verifica se a palavra existe no JSON
    if (!listaPalavras.includes(palavra)) {
        alert("Palavra inválida!");
        return;
    }

    // Verifica se é a palavra secreta
    if (palavra === palavraSecreta) {
        alert("Parabéns! Acertou a palavra!");
        // Aqui pode adicionar código para terminar o jogo
    } else {
        alert("Palavra errada! Tente outra.");
        // Pode adicionar cores ou dicas aqui
        linhaAtual++;
        colunaAtual = 0;
    }

    return;
}



        if (letra === "BACKSPACE") {
            if (colunaAtual > 0) {
                colunaAtual--;
                const celula = linhas[linhaAtual].children[colunaAtual];
                celula.textContent = "";
            }
            return;
        }

        // Se já preencheu 5 letras, não faz nada
        if (colunaAtual >= 5) return;

        // Insere a letra na célula
        const celula = linhas[linhaAtual].children[colunaAtual];
        celula.textContent = letra;
        colunaAtual++;
    });
});


// Pop-up de regras
document.getElementById("btnRegras").addEventListener("click", () => {
    document.getElementById("popupRegras").style.display = "block";
});

document.getElementById("fecharPopup").addEventListener("click", () => {
    document.getElementById("popupRegras").style.display = "none";
});

// Pop-up de letras em falta "X"
document.getElementById("fecharPopupLetras").addEventListener("click", () => {
    document.getElementById("popupLetras").style.display = "none";
});

// Fecha se clicar fora do conteúdo
window.addEventListener("click", (event) => {
    const popup = document.getElementById("popupRegras");
    if (event.target === popup) {
        popup.style.display = "none";
    }
});

// Fecha se clicar fora do conteúdo letras em falta
window.addEventListener("click", (event) => {
    const popup = document.getElementById("popupLetras");
    if (event.target === popup) {
        popup.style.display = "none";
    }
});


// Função para abrir ficheiro JSON
let listaPalavras = [];
let palavraSecreta = "";

function carregarPalavras() {
  fetch("words.json")
    .then(res => res.json())
    .then(data => {
      listaPalavras = data.palavras.map(p => p.toUpperCase());
      palavraSecreta = listaPalavras[Math.floor(Math.random() * listaPalavras.length)];
      console.log("Palavra secreta:", palavraSecreta); // apenas para testes
    })
    .catch(err => console.error("Erro ao carregar o ficheiro JSON:", err));
}

carregarPalavras();