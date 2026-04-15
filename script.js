AOS.init({ duration: 800, once: true });
const inicio = new Date(2025, 5, 12, 20, 0, 0); // 12/06/2025

// Função para sortear música e dar o play
async function iniciarMusica() {
  try {
    const response = await fetch('musicas.json');
    const dados = await response.json();
    const links = dados.links;
    
    // Sorteia um link da lista
    const linkSorteado = links[Math.floor(Math.random() * links.length)];
    
    // Extrai o ID do video do link do YouTube (serve para youtu.be e youtube.com)
    let videoId = "";
    if (linkSorteado.includes("youtu.be/")) {
      videoId = linkSorteado.split('youtu.be/')[1].split('?')[0];
    } else if (linkSorteado.includes("v=")) {
      videoId = linkSorteado.split('v=')[1].split('&')[0];
    }

    // Injeta o iframe do YouTube (autoplay ativado)
    const iframeHtml = `<iframe width="100%" height="200" src="https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    
    document.getElementById('player-musica').innerHTML = iframeHtml;
  } catch (error) {
    console.error("Erro ao carregar a música:", error);
    document.getElementById('player-musica').innerHTML = "<p style='text-align:center; opacity:0.7;'>A música não pôde ser carregada. 🥺</p>";
  }
}

// Lógica de Login
document.getElementById('btn-iniciar').addEventListener('click', () => {
  const senha = document.getElementById('senha-entrada').value;
  if (senha === "IPY2323") {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';
    iniciarMusica(); // Toca a música e carrega o vídeo
    carregarMemorias(); // Carrega as listas
  } else {
    document.getElementById('erro-entrada').style.display = 'block';
  }
});

document.getElementById('senha-entrada').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') document.getElementById('btn-iniciar').click();
});

// Atualiza Tempos e Datas
function atualizar() {
  const agora = new Date();
  const diffMs = agora - inicio;

  const segundos = Math.floor(diffMs / 1000);
  const minutos = Math.floor(segundos / 60);
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);
  const meses = Math.floor(dias / 30.4375);
  const anos = Math.floor(meses / 12);

  document.getElementById('anosMeses').innerText = `${anos} anos e ${meses % 12} meses`;
  document.getElementById('detalhesTempo').innerHTML = `
    ${dias.toLocaleString('pt-BR')} dias<br>
    ${horas.toLocaleString('pt-BR')} horas<br>
    ${minutos.toLocaleString('pt-BR')} minutos<br>
    ${segundos.toLocaleString('pt-BR')} segundos
  `;

  let proximoVersario = new Date(agora.getFullYear(), agora.getMonth(), 12);
  if (agora.getDate() >= 12 && agora.getMonth() === proximoVersario.getMonth()) {
    proximoVersario.setMonth(proximoVersario.getMonth() + 1);
  }
  const diffVersarioMs = proximoVersario - agora;
  const diasParaVersario = Math.ceil(diffVersarioMs / (1000 * 60 * 60 * 24));
  let totalMesesFuturo = (proximoVersario.getFullYear() - inicio.getFullYear()) * 12 + (proximoVersario.getMonth() - inicio.getMonth());

  document.getElementById('proximoVersarioData').innerText = `Em ${diasParaVersario} dia${diasParaVersario !== 1 ? 's' : ''}!`;
  document.getElementById('proximoVersarioTempo').innerText = `Iremos completar ${totalMesesFuturo} meses que você me atura! 😅`;

  const contarDatas = (dia, mes) => {
    let count = 0;
    for (let y = inicio.getFullYear(); y <= agora.getFullYear(); y++) {
      const data = new Date(y, mes, dia);
      if (data >= inicio && data <= agora) count++;
    }
    return count;
  };

  document.getElementById('aniversariosGabz').innerText = contarDatas(23, 7); 
  document.getElementById('aniversariosGiih').innerText = contarDatas(23, 5); 
  document.getElementById('aniversariosAthena').innerText = contarDatas(23, 5); 

  let natais = 0;
  for (let y = inicio.getFullYear(); y <= agora.getFullYear(); y++) {
    const natal = new Date(y, 11, 25);
    if (natal >= inicio && natal <= agora) natais++;
  }
  document.getElementById('natais').innerText = natais;

  let proximoNatal = new Date(agora.getFullYear(), 11, 25);
  if (proximoNatal <= agora) {
    proximoNatal = new Date(agora.getFullYear() + 1, 11, 25);
  }
  const diffNatalMs = proximoNatal - agora;
  const diasNatal = Math.ceil(diffNatalMs / (1000 * 60 * 60 * 24));
  document.getElementById('proximoNatal').innerText = `⏳ Próximo em ${diasNatal} dias`;
}
atualizar();
setInterval(atualizar, 1000);

// Carrega listas do memorias.json
async function carregarMemorias() {
  try {
    const response = await fetch('memorias.json');
    const dados = await response.json();

    function renderizarLista(idLista, itens) {
      const lista = document.getElementById(idLista);
      lista.innerHTML = "";
      itens.forEach(item => {
        let dataFormatada = item.data;
        // Tratamento para data 00/00/0000
        if (item.data === "00/00/0000") {
          dataFormatada = "Data perdida no espaço-tempo 🛸";
        } else if (item.data === "") {
          dataFormatada = "Não lembramos o dia exato 😅";
        }

        const li = document.createElement('li');
        li.innerHTML = `<span class="nome-item">${item.nome}</span> <span class="data-item">${dataFormatada}</span>`;
        lista.appendChild(li);
      });
    }

    renderizarLista('lista-filmes', dados.filmes);
    renderizarLista('lista-jogos', dados.jogos);
    renderizarLista('lista-series', dados.series);
  } catch (error) {
    console.error("Erro ao carregar memórias:", error);
  }
}

// Botão Secreto 
const modal = document.getElementById("modal-secreto");
const btnAbrir = document.getElementById("btn-anime-dia");
const spanFechar = document.getElementById("fechar-modal");

btnAbrir.onclick = async () => {
  try {
    const response = await fetch('frases.json');
    const dados = await response.json();
    
    const fraseAleatoria = dados.frases[Math.floor(Math.random() * dados.frases.length)];
    const elogioAleatorio = dados.elogios[Math.floor(Math.random() * dados.elogios.length)];
    
    document.getElementById('frase-dia').innerText = `"${fraseAleatoria}"`;
    document.getElementById('elogio-dia').innerText = elogioAleatorio;
    
    modal.style.display = "flex";
  } catch (error) {
    console.error("Erro:", error);
    alert("Oops! O arquivo frases.json não foi encontrado.");
  }
}

spanFechar.onclick = () => modal.style.display = "none";
window.onclick = (event) => { if (event.target === modal) modal.style.display = "none"; }
