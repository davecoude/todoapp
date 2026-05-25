// Estado de la aplicación
let tasks = [];
let currentFilter = "all";

// HU-01: Agregar tarea
function addTask() {
  const input = document.getElementById("taskInput");
  const text = input.value.trim();
  if (!text) return;

  tasks.push({ id: Date.now(), text, done: false });
  input.value = "";
  render();
}

// HU-02: Marcar como completada
function toggleTask(id) {
  tasks = tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
  render();
}

// HU-03: Eliminar tarea
function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  render();
}

// HU-05: Filtrar tareas
function filterTasks(filter) {
  currentFilter = filter;
  render();
}

// HU-04: Actualizar contador y renderizar lista
function render() {
  const list = document.getElementById("taskList");
  const counter = document.getElementById("counter");

  const filtered = tasks.filter((t) => {
    if (currentFilter === "active") return !t.done;
    if (currentFilter === "done") return t.done;
    return true;
  });

  list.innerHTML = filtered
    .map(
      (t) => `
    <li class="${t.done ? "done" : ""}">
      <span onclick="toggleTask(${t.id})" style="cursor:pointer">${t.text}</span>
      <button class="delete-btn" onclick="deleteTask(${t.id})">Eliminar</button>
    </li>
  `,
    )
    .join("");

  const pending = tasks.filter((t) => !t.done).length;
  counter.textContent = `Tareas pendientes: ${pending}`;
}
