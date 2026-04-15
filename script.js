AOS.init({ duration: 800, once: true });

const inicio = new Date(2025, 5, 12, 20, 0, 0); // 12/06/2025

// --- Lógica de Login na Tela Inicial ---
document.getElementById('btn-iniciar').addEventListener('click', () => {
  const senha = document.getElementById('senha-entrada').value;
  
  if (senha === "IPY2323") {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';
    document.getElementById('bg-music').play().catch(e => console.log("O autoplay da música pode estar bloqueado pelo navegador."));
  } else {
    document.getElementById('erro-entrada').style.display = 'block';
  }
});

// Permite logar apertando "Enter"
document.getElementById('senha-entrada').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    document.getElementById('btn-iniciar').click();
  }
});

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

// --- Lógica de Listas (Filmes, Jogos, Séries) usando LocalStorage ---
function configurarLista(storageKey, inputId, btnId, listId) {
  const input = document.getElementById(inputId);
  const btn = document.getElementById(btnId);
  const lista = document.getElementById(listId);

  // Carrega os dados salvos
  function renderizar() {
    lista.innerHTML = '';
    const dados = JSON.parse(localStorage.getItem(storageKey)) || [];
    dados.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `<span>${item.nome}</span> <span class="data-item">${item.data}</span>`;
      lista.appendChild(li);
    });
  }

  // Adiciona novo item
  btn.addEventListener('click', () => {
    if (input.value.trim() !== "") {
      const dados = JSON.parse(localStorage.getItem(storageKey)) || [];
      const hoje = new Date();
      const dataFormatada = `${hoje.getDate().toString().padStart(2, '0')}/${(hoje.getMonth()+1).toString().padStart(2, '0')}/${hoje.getFullYear()}`;
      
      // Insere no começo da lista
      dados.unshift({ nome: input.value.trim(), data: dataFormatada });
      localStorage.setItem(storageKey, JSON.stringify(dados));
      
      input.value = "";
      renderizar();
    }
  });

  // Permite adicionar com "Enter"
  input.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') btn.click();
  });

  renderizar();
}

configurarLista('filmes_juntos', 'filme-input', 'btn-add-filme', 'lista-filmes');
configurarLista('jogos_juntos', 'jogo-input', 'btn-add-jogo', 'lista-jogos');
configurarLista('series_juntas', 'serie-input', 'btn-add-serie', 'lista-series');

// --- Botão Secreto (Sem Senha) ---
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
