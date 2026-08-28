let tarefas = JSON.parse(localStorage.getItem("agenddaTarefas")) || [
  {
    id: 1,
    titulo: "Finalizar apresentação do projeto",
    horario: "10:30",
    categoria: "Trabalho",
    prioridade: "alta",
    concluida: false
  },
  {
    id: 2,
    titulo: "Estudar para a prova",
    horario: "14:00",
    categoria: "Estudos",
    prioridade: "media",
    concluida: false
  },
  {
    id: 3,
    titulo: "Responder e-mails importantes",
    horario: "16:30",
    categoria: "Trabalho",
    prioridade: "baixa",
    concluida: true
  },
  {
    id: 4,
    titulo: "Ir ao supermercado",
    horario: "18:30",
    categoria: "Pessoal",
    prioridade: "media",
    concluida: false
  }
];

let filtroAtual = "todas";

function salvar() {
  localStorage.setItem(
    "agenddaTarefas",
    JSON.stringify(tarefas)
  );
}

function renderizarTarefas() {

  const lista = document.getElementById("taskList");

  const pesquisa = document
    .getElementById("searchInput")
    .value
    .toLowerCase();

  let filtradas = tarefas.filter(tarefa => {

    const correspondePesquisa =
      tarefa.titulo.toLowerCase().includes(pesquisa) ||
      tarefa.categoria.toLowerCase().includes(pesquisa);

    if (filtroAtual === "pendentes") {
      return !tarefa.concluida && correspondePesquisa;
    }

    if (filtroAtual === "concluidas") {
      return tarefa.concluida && correspondePesquisa;
    }

    return correspondePesquisa;
  });

  if (filtradas.length === 0) {
    lista.innerHTML = `
      <div class="empty">
        Nenhuma tarefa encontrada.
      </div>
    `;
  } else {

    lista.innerHTML = filtradas.map(tarefa => `

      <div class="task ${tarefa.concluida ? "completed" : ""}">

        <div
          class="task-check"
          onclick="alternarTarefa(${tarefa.id})"
        >
          ${tarefa.concluida ? "✓" : ""}
        </div>

        <div class="task-info">
          <strong>${escaparHTML(tarefa.titulo)}</strong>
          <small>
            ${tarefa.horario || "Sem horário"}
            • ${tarefa.categoria}
          </small>
        </div>

        <span class="priority ${tarefa.prioridade}">
          ${tarefa.prioridade.toUpperCase()}
        </span>

        <button
          class="delete-btn"
          onclick="deletarTarefa(${tarefa.id})"
          title="Excluir"
        >
          ×
        </button>

      </div>

    `).join("");
  }

  atualizarEstatisticas();
}

function atualizarEstatisticas() {

  const concluidas =
    tarefas.filter(t => t.concluida).length;

  const pendentes =
    tarefas.filter(t => !t.concluida).length;

  const alta =
    tarefas.filter(
      t => t.prioridade === "alta" && !t.concluida
    ).length;

  const produtividade =
    tarefas.length === 0
      ? 0
      : Math.round((concluidas / tarefas.length) * 100);

  document.getElementById("completedCount").textContent =
    concluidas;

  document.getElementById("pendingCount").textContent =
    pendentes;

  document.getElementById("highCount").textContent =
    alta;

  document.getElementById("productivity").textContent =
    produtividade + "%";

  document.getElementById("heroProgress").textContent =
    produtividade + "%";

  document.getElementById("heroProgressBar").style.width =
    produtividade + "%";

  document.getElementById("workCount").textContent =
    tarefas.filter(t => t.categoria === "Trabalho").length;

  document.getElementById("studyCount").textContent =
    tarefas.filter(t => t.categoria === "Estudos").length;

  document.getElementById("personalCount").textContent =
    tarefas.filter(t => t.categoria === "Pessoal").length;
}

function alternarTarefa(id) {

  const tarefa = tarefas.find(t => t.id === id);

  if (!tarefa) return;

  tarefa.concluida = !tarefa.concluida;

  salvar();
  renderizarTarefas();
}

function deletarTarefa(id) {

  tarefas = tarefas.filter(t => t.id !== id);

  salvar();
  renderizarTarefas();
}

function filtrar(tipo, botao) {

  filtroAtual = tipo;

  document
    .querySelectorAll(".filter")
    .forEach(btn => btn.classList.remove("active"));

  botao.classList.add("active");

  renderizarTarefas();
}

function abrirModal() {

  document
    .getElementById("modal")
    .classList.add("show");

  setTimeout(() => {
    document.getElementById("taskTitle").focus();
  }, 100);
}

function fecharModal() {

  document
    .getElementById("modal")
    .classList.remove("show");
}

function criarTarefa(event) {

  event.preventDefault();

  const titulo =
    document.getElementById("taskTitle").value.trim();

  const horario =
    document.getElementById("taskTime").value;

  const categoria =
    document.getElementById("taskCategory").value;

  const prioridade =
    document.querySelector(
      'input[name="priority"]:checked'
    ).value;

  const novaTarefa = {

    id: Date.now(),

    titulo,

    horario,

    categoria,

    prioridade,

    concluida: false
  };

  tarefas.unshift(novaTarefa);

  salvar();

  event.target.reset();

  fecharModal();

  filtroAtual = "todas";

  document
    .querySelectorAll(".filter")
    .forEach(btn => btn.classList.remove("active"));

  document
    .querySelector(".filter")
    .classList.add("active");

  renderizarTarefas();
}

function adicionarSugestao() {

  const existe = tarefas.some(
    t =>
      t.titulo.toLowerCase() ===
      "ir ao supermercado"
  );

  if (existe) {

    alert(
      "Essa tarefa já está na sua rotina."
    );

    return;
  }

  tarefas.unshift({
    id: Date.now(),
    titulo: "Ir ao supermercado",
    horario: "18:30",
    categoria: "Pessoal",
    prioridade: "media",
    concluida: false
  });

  salvar();
  renderizarTarefas();

  alert(
    "Sugestão adicionada à sua rotina!"
  );
}

function escaparHTML(texto) {

  const div = document.createElement("div");

  div.textContent = texto;

  return div.innerHTML;
}

document
  .getElementById("modal")
  .addEventListener("click", function(event) {

    if (event.target === this) {
      fecharModal();
    }

  });

document.addEventListener("keydown", function(event) {

  if (event.key === "Escape") {
    fecharModal();
  }

});

renderizarTarefas();
