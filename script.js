AOS.init({ duration: 800, once: true });

const inicio = new Date(2025, 5, 12, 20, 0, 0); // 12/06/2025

// Botão Pulsante e Música
document.getElementById('btn-iniciar').addEventListener('click', () => {
  document.getElementById('start-screen').style.display = 'none';
  document.getElementById('main-content').style.display = 'block';
  document.getElementById('bg-music').play();
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

  // --- Próximo Versário ---
  let proximoVersario = new Date(agora.getFullYear(), agora.getMonth(), 12);
  if (agora.getDate() >= 12 && agora.getMonth() === proximoVersario.getMonth()) {
    proximoVersario.setMonth(proximoVersario.getMonth() + 1);
  }
  
  const diffVersarioMs = proximoVersario - agora;
  const diasParaVersario = Math.ceil(diffVersarioMs / (1000 * 60 * 60 * 24));
  
  // Total de meses cravados que farão no próximo dia 12
  let totalMesesFuturo = (proximoVersario.getFullYear() - inicio.getFullYear()) * 12 + (proximoVersario.getMonth() - inicio.getMonth());

  document.getElementById('proximoVersarioData').innerText = `Em ${diasParaVersario} dia${diasParaVersario !== 1 ? 's' : ''}!`;
  // Nova frase solicitada:
  document.getElementById('proximoVersarioTempo').innerText = `Iremos completar ${totalMesesFuturo} meses que você me atura! 😅`;

  // --- Aniversários (Corrigido as datas) ---
  const contarDatas = (dia, mes) => {
    let count = 0;
    for (let y = inicio.getFullYear(); y <= agora.getFullYear(); y++) {
      const data = new Date(y, mes, dia);
      // Se a data do aniversário daquele ano for maior ou igual ao dia que começaram a namorar
      if (data >= inicio && data <= agora) count++;
    }
    return count;
  };

  // Lembrete: em Javascript os meses vão de 0 (Jan) a 11 (Dez)
  document.getElementById('aniversariosGabz').innerText = contarDatas(23, 7); // 23/08 (Agosto é 7)
  document.getElementById('aniversariosGiih').innerText = contarDatas(23, 5); // 23/06 (Junho é 5)
  document.getElementById('aniversariosAthena').innerText = contarDatas(23, 5); // Athena tbm 23/06

  // --- Natais ---
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

// --- Botão Secreto ---
const modal = document.getElementById("modal-senha");
const btnAbrir = document.getElementById("btn-anime-dia");
const spanFechar = document.getElementById("fechar-modal");
const btnVerificar = document.getElementById("btn-verificar");
const inputSenha = document.getElementById("senha-input");

btnAbrir.onclick = () => {
  modal.style.display = "flex";
  document.getElementById('modal-body').style.display = "block";
  document.getElementById('resultado-secreto').style.display = "none";
  inputSenha.value = "";
  document.getElementById('erro-senha').style.display = "none";
}

spanFechar.onclick = () => modal.style.display = "none";
window.onclick = (event) => { if (event.target === modal) modal.style.display = "none"; }

btnVerificar.onclick = async () => {
  if (inputSenha.value === "2323") {
    try {
      const response = await fetch('frases.json');
      const dados = await response.json();
      
      const fraseAleatoria = dados.frases[Math.floor(Math.random() * dados.frases.length)];
      const elogioAleatorio = dados.elogios[Math.floor(Math.random() * dados.elogios.length)];
      
      document.getElementById('frase-dia').innerText = `"${fraseAleatoria}"`;
      document.getElementById('elogio-dia').innerText = elogioAleatorio;
      
      document.getElementById('modal-body').style.display = "none";
      document.getElementById('resultado-secreto').style.display = "block";
      document.getElementById('modal-titulo').innerText = "Pra você 💜";
    } catch (error) {
      console.error("Erro:", error);
      alert("Oops! O arquivo frases.json não foi encontrado.");
    }
  } else {
    document.getElementById('erro-senha').style.display = "block";
  }
}
