const app = document.querySelector('#app');

app.innerHTML = `
    <div class="todos">
        <div class="todos-header">
            <h3 class="todos-title">TODO APP</h3>
            <div>
                <p>Tienes <span class="todos-count"></span> Items por hacer!! </p>
                <button type="button" class="todos-clear" style="display:none;" >Borrar Completados</button>
            </div>
        </div>
        <form class="todos-form" name="todos">
            <input type="text" placeholder="Que vas hacer?" name="todo">
            <small>Escribi algo!!!</small>
        </form>
        <ul class="todos-list">
        </ul>
    </div>
`; 

const saveInLocalStorage = (todos) => {
    localStorage.setItem("todos", JSON.stringify(todos));
};

// Selectores

const root = document.querySelector(".todos");
const list = root.querySelector(".todos-list");
const count = root.querySelector(".todos-count");
const clear = root.querySelector(".todos-clear");
const form = document.forms.todos;
const input = form.elements.todo;

// State

let state = JSON.parse(localStorage.getItem("todos")) || []; 

//! Render Function

const renderTodos = (todos) => {
    let toDosListHtml = todos.map((todo, index) => `
        <li data-id= "${index}" ${todo.complete ? ' class="todos-complete"' : ""}>
            <input type="checkbox" ${todo.complete ? "checked" : ""}>
            <span>${todo.label}</span>
            <button type= "button"></button>
        </li>
    `).join("");
    list.innerHTML = toDosListHtml;
    clear.style.display = todos.filter((todo) => todo.complete).length ? "block" : "none";
    count.innerText = todos.filter((todo) => !todo.complete).length;
};

//! Handlers

const addToDo = (e) => {
    e.preventDefault();
    const label = input.value.trim();
    const complete = false; 
    if (label.length === 0){
        form.classList.add("error");
        return;
    };
    form.classList.remove("error");
    state = [...state, {label, complete}];
    console.log(state);
    renderTodos(state);
    saveInLocalStorage(state);
    input.value = "";
};

const upDateToDo = ({target}) => {
    //Obtener la posición en el array del TODO 
    const id = parseInt(target.parentNode.dataset.id);
    const complete = target.checked;
    state = state.map((todo, index) => {
        if(index === id) {
            return {
                ...todo,
                complete
            };
        }
        return todo
    });
    renderTodos(state);
    saveInLocalStorage(state);
};

const editToDo = ({target}) => {
    if(target.nodeName !== "SPAN"){
        return;
    }
    const id = parseInt(target.parentNode.dataset.id);
    const currentLabel = state[id].label;
    const input = document.createElement("input");
    input.type = "text";
    input.value = currentLabel;

    const handlerEdit = (event) => {
        const label = event.target.value;
        event.stopPropagation();
        if(label !== currentLabel) {
            state = state.map((todo, index) => {
                if(index === id){
                    return {
                        ...todo,
                        label
                    }
                }
                return todo;
            });
            renderTodos(state);
            saveInLocalStorage(state);
        }
        event.target.display = "";
        event.target.removeEventListener("change", handlerEdit);
    };
    
    input.addEventListener("change", handlerEdit);
    
    target.parentNode.append(input);
    input.focus();
}

const deleteToDo = ({target}) => {
    if(target.nodeName !== "BUTTON"){
        return
    }
    const id = parseInt(target.parentNode.dataset.id);
    const label = target.previousElementSibling.innerText;
    if(window.confirm(`Estas seguro de borrar ${label}??, ok??`)){
        state = state.filter((todo, index) => index !== id);
        renderTodos(state);
        saveInLocalStorage(state);
    }
};

const clearCompletes = () => {
    const todoComplete = state.filter((todo) => todo.complete).length;
    if(todoComplete === 0) {
        return;
    }
    if(window.confirm(`Borrar ${todoComplete} todos?`)){
        state = state.filter((todo) => !todo.complete)
        renderTodos(state);
        saveInLocalStorage(state);
    }
};




//! Init Function - Inicia nuestra App

function init() {
    renderTodos(state);
    form.addEventListener("submit", addToDo);
    list.addEventListener("change", upDateToDo);
    list.addEventListener("dblclick", editToDo);
    list.addEventListener("click", deleteToDo);
    clear.addEventListener("click", clearCompletes);
};

init();
