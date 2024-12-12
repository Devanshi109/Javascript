import { Model } from './model.js';
import { View } from './view.js';

export const Controller = ((model, view) => {
    const state = new model.State();
    const todoContainer = document.querySelector(
        `.${view.domstr.listContainer}`
    );
    const inputbox = document.querySelector(`.${view.domstr.inputBox}`);

    const deleteTodo = () => {
        todoContainer.addEventListener("click", (e) => {
            if (e.target.className === view.domstr.deleteBtn) {
                state.todolist = state.todolist.filter(
                    (todo) => +todo.id !== +e.target.id
                );
                model.deleteTodo(e.target.id);
            }
        });
    };

    const addTodo = () => {
        inputbox.addEventListener("keyup", (e) => {
            if (e.key === "Enter" && e.target.value.trim() !== '') {
                const newtodo = new model.Todo(e.target.value);

                newtodo.completed = false;

                model.addTodo(newtodo).then((todo) => {
                    state.todolist = [todo, ...state.todolist];
                });

                e.target.value = '';
            }
        });
    };

    const init = () => {
        model.getTodos().then((todolist) => {

            const updatedTodos = todolist.reverse().map((todo, index) => ({
                ...todo,
                completed: index === 1, 
            }));

            state.todolist = updatedTodos;
        });
    };

    const toggleCheck = () => {
        todoContainer.addEventListener('click', (e) => {
            const liElement = e.target.closest('li');

            if (liElement) {
                const itemId = parseInt(liElement.dataset.id, 10);

                liElement.classList.toggle('checked');

                state.todolist = state.todolist.map((todo) =>
                    todo.id === itemId ? { ...todo, completed: !todo.completed } : todo
                );
            }
        });
    };

    const bootstrap = () => {
        init();
        deleteTodo();
        addTodo();
        toggleCheck();
    };

    return { bootstrap };
})(Model, View);