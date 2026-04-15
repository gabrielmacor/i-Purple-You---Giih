// Inicializa a biblioteca de animações
AOS.init({ duration: 800, once: true });

const inicio = new Date(2025, 5, 12, 20, 0, 0); // 12/06/2025 20:00

// Libera a tela inicial e toca a música
document.getElementById('btn-iniciar').addEventListener('click', () => {
  document.getElementById('start-screen').style.display = 'none';
  document.getElementById('main-content').style.display = 'block';
  document.getElementById('bg-music').play();
});

function atualizar() {
  const agora = new Date();
  const diffMs = agora - inicio;

  // Calculo de Tempo Juntos
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

  // Calculo Próximo Versário (dia 12)
  let proximoVersario = new Date(agora.getFullYear(), agora.getMonth(), 12);
  if (agora.getDate() >= 12 && agora.getMonth() === proximoVersario.getMonth()) {
    proximoVersario.setMonth(proximoVersario.getMonth() + 1);
  }
  
  const diffVersarioMs = proximoVersario - agora;
  const diasParaVersario = Math.ceil(diffVersarioMs / (1000 * 60 * 60 * 24));
  
  // Calcula quanto tempo vão completar nesse próximo versário
  let totalMesesFuturo = (proximoVersario.getFullYear() - inicio.getFullYear()) * 12 + (proximoVersario.getMonth() - inicio.getMonth());
  let anosFuturo = Math.floor(totalMesesFuturo / 12);
  let mesesFuturo = totalMesesFuturo % 12;
  
  let textoCompletara = "";
  if (anosFuturo > 0) textoCompletara += `${anosFuturo} ano${anosFuturo > 1 ? 's' : ''}`;
  if (anosFuturo > 0 && mesesFuturo > 0) textoCompletara += " e ";
  if (mesesFuturo > 0 || totalMesesFuturo === 0) textoCompletara += `${mesesFuturo} mês${mesesFuturo > 1 ? 'es' : ''}`;

  document.getElementById('proximoVersarioData').innerText = `Em ${diasParaVersario} dia${diasParaVersario !== 1 ? 's' : ''}!`;
  document.getElementById('proximoVersarioTempo').innerText = `Iremos completar ${textoCompletara} juntinhos 🥰`;

  // Aniversários
  const contarDatas = (dia, mes) => {
    let count = 0;
    for (let y = inicio.getFullYear(); y <= agora.getFullYear(); y++) {
      const data = new Date(y, mes, dia);
      if (data >= inicio && data <= agora) count++;
    }
    return count;
  };

  document.getElementById('aniversariosGabz').innerText = contarDatas(23, 6); // Julho é mês 6 (0-index)
  document.getElementById('aniversariosGiih').innerText = contarDatas(23, 4); // Maio é mês 4
  document.getElementById('aniversariosAthena').innerText = contarDatas(23, 5); // Junho é mês 5

  // Natais
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

// --- Lógica do Botão Secreto ---
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
      // Busca o arquivo JSON com as frases
      const response = await fetch('frases.json');
      const dados = await response.json();
      
      // Escolhe uma frase e um elogio aleatórios
      const fraseAleatoria = dados.frases[Math.floor(Math.random() * dados.frases.length)];
      const elogioAleatorio = dados.elogios[Math.floor(Math.random() * dados.elogios.length)];
      
      document.getElementById('frase-dia').innerText = `"${fraseAleatoria}"`;
      document.getElementById('elogio-dia').innerText = elogioAleatorio;
      
      document.getElementById('modal-body').style.display = "none";
      document.getElementById('resultado-secreto').style.display = "block";
      document.getElementById('modal-titulo').innerText = "Pra você 💜";
    } catch (error) {
      console.error("Erro ao carregar as frases:", error);
      alert("Oops! Não consegui carregar as frases. Verifique se o arquivo frases.json está na mesma pasta!");
    }
  } else {
    document.getElementById('erro-senha').style.display = "block";
  }
}
