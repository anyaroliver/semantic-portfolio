(() => {
  "use strict";
  const KEY = "daymark-tasks-v1";
  const form = document.querySelector("#task-form");
  const input = document.querySelector("#task-input");
  const list = document.querySelector("#task-list");
  const empty = document.querySelector("#empty");
  const status = document.querySelector("#status");
  const clearButton = document.querySelector("#clear");
  const filters = [...document.querySelectorAll("[data-filter]")];
  let filter = "all";
  let tasks = load();

  document.querySelector("#today").textContent = new Intl.DateTimeFormat(undefined,{weekday:"short",month:"short",day:"numeric"}).format(new Date());
  document.querySelector("#year").textContent = new Date().getFullYear();

  function load() {
    try {
      const data = JSON.parse(window.localStorage.getItem(KEY) || "[]");
      return Array.isArray(data) ? data.filter(t => t && typeof t.id === "string" && typeof t.text === "string" && typeof t.completed === "boolean") : [];
    } catch (error) { console.warn("Could not load saved tasks", error); return []; }
  }
  function save() {
    try { window.localStorage.setItem(KEY, JSON.stringify(tasks)); }
    catch (error) { announce("Could not save tasks in this browser."); console.warn(error); }
  }
  function announce(message) { status.textContent = ""; setTimeout(() => status.textContent = message, 20); }
  function visibleTasks() {
    if (filter === "active") return tasks.filter(t => !t.completed);
    if (filter === "completed") return tasks.filter(t => t.completed);
    return tasks;
  }
  function render() {
    const completed = tasks.filter(t => t.completed).length;
    const active = tasks.length - completed;
    document.querySelector("#all-count").textContent = tasks.length;
    document.querySelector("#active-count").textContent = active;
    document.querySelector("#done-count").textContent = completed;
    document.querySelector("#remaining").textContent = `${active} ${active === 1 ? "task" : "tasks"} left`;
    clearButton.disabled = completed === 0;
    filters.forEach(b => {
      const selected = b.dataset.filter === filter;
      b.classList.toggle("selected", selected);
      b.setAttribute("aria-pressed", String(selected));
    });
    list.replaceChildren();
    visibleTasks().forEach(task => list.append(makeTask(task)));
    empty.hidden = list.children.length > 0;
    if (empty.hidden) return;
    const title = empty.querySelector("h3"), copy = empty.querySelector("p");
    if (!tasks.length) { title.textContent = "A fresh start."; copy.textContent = "Add your first task above and build a little momentum."; }
    else if (filter === "active") { title.textContent = "All caught up."; copy.textContent = "There are no active tasks. Enjoy the breathing room."; }
    else if (filter === "completed") { title.textContent = "Not checked off yet."; copy.textContent = "Completed tasks will show up here."; }
  }
  function makeTask(task) {
    const li = document.createElement("li");
    li.className = `task${task.completed ? " done" : ""}`;
    li.dataset.id = task.id;
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox"; checkbox.checked = task.completed; checkbox.dataset.action = "toggle";
    checkbox.setAttribute("aria-label", `${task.completed ? "Mark active" : "Complete"}: ${task.text}`);
    const text = document.createElement("span"); text.className = "task-text"; text.textContent = task.text;
    const actions = document.createElement("div"); actions.className = "actions";
    const edit = document.createElement("button"); edit.type = "button"; edit.className = "icon"; edit.dataset.action = "edit"; edit.textContent = "✎"; edit.title = "Edit task"; edit.setAttribute("aria-label", `Edit ${task.text}`);
    const del = document.createElement("button"); del.type = "button"; del.className = "icon delete"; del.dataset.action = "delete"; del.textContent = "×"; del.title = "Delete task"; del.setAttribute("aria-label", `Delete ${task.text}`);
    actions.append(edit, del); li.append(checkbox, text, actions); return li;
  }
  function id() { return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`; }

  form.addEventListener("submit", event => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) { input.focus(); return; }
    tasks.unshift({id:id(),text,completed:false});
    save(); filter = "all"; render(); input.value = ""; input.focus(); announce(`Added task: ${text}`);
  });
  filters.forEach(button => button.addEventListener("click", () => { filter = button.dataset.filter; render(); }));

  // Event delegation handles task checkboxes, edits, saves and deletes from the list.
  list.addEventListener("change", event => {
    const checkbox = event.target;
    if (!(checkbox instanceof HTMLInputElement) || checkbox.dataset.action !== "toggle") return;
    const task = tasks.find(t => t.id === checkbox.closest("[data-id]")?.dataset.id);
    if (!task) return;
    task.completed = checkbox.checked; save(); render(); announce(task.completed ? `Completed: ${task.text}` : `Marked active: ${task.text}`);
  });
  list.addEventListener("click", event => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const li = button.closest("[data-id]");
    const task = tasks.find(t => t.id === li?.dataset.id);
    if (!task) return;
    if (button.dataset.action === "delete") {
      tasks = tasks.filter(t => t.id !== task.id); save(); render(); announce(`Deleted task: ${task.text}`); return;
    }
    if (button.dataset.action === "edit") {
      const editor = document.createElement("input");
      editor.className = "edit"; editor.maxLength = 160; editor.value = task.text; editor.setAttribute("aria-label", `Edit task: ${task.text}`);
      li.querySelector(".task-text").replaceWith(editor);
      button.dataset.action = "save"; button.textContent = "✓"; button.title = "Save task"; button.setAttribute("aria-label", "Save task");
      editor.focus(); editor.select(); return;
    }
    if (button.dataset.action === "save") saveEdit(li, task);
  });
  function saveEdit(li, task) {
    const editor = li.querySelector(".edit");
    if (!editor) return;
    const value = editor.value.trim();
    if (!value) { editor.setCustomValidity("A task cannot be empty."); editor.reportValidity(); editor.focus(); return; }
    task.text = value; save(); render(); announce("Task updated.");
  }
  list.addEventListener("keydown", event => {
    if (!event.target.matches(".edit")) return;
    const li = event.target.closest("[data-id]");
    if (event.key === "Enter") { event.preventDefault(); const task = tasks.find(t => t.id === li.dataset.id); saveEdit(li, task); }
    if (event.key === "Escape") render();
  });
  clearButton.addEventListener("click", () => {
    const count = tasks.filter(t => t.completed).length;
    tasks = tasks.filter(t => !t.completed); save(); render(); announce(`Cleared ${count} completed ${count === 1 ? "task" : "tasks"}.`);
  });
  render();
})();