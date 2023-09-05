// Elementos HTML
const inputTask = document.getElementById('inputTask');
const btnAddTask = document.getElementById('btnAddTask');
const divTasks = document.getElementById('divTasks');
const divSummary = document.getElementById('summary');

const getTasks = () => {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

const saveTasks = (tasks) => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

const addTask = (htlmElement) => {
    const text = htlmElement.value;

    if (!text.trim()) {
        htlmElement.focus();
        return;
    };
    
    const newTask = { id: Date.now(), text, completed: false };
    
    const tasks = getTasks();

    tasks.push(newTask);

    saveTasks(tasks);

    htlmElement.value = '';
    htlmElement.focus();
}

const completeTask = (idTask) => {
    const tasks = getTasks();
    const indexTask = tasks.findIndex(task => task.id === Number(idTask));

    tasks[indexTask].completed = !tasks[indexTask].completed;

    saveTasks(tasks);

    renderTasks(tasks, divTasks);
}

const deleteTask = (idTask) => {
    const tasks = getTasks();
    const indexTask = tasks.findIndex(task => task.id === Number(idTask));

    tasks.splice(indexTask, 1);

    saveTasks(tasks);
    renderTasks(tasks, divTasks);
}

const getTaskTemplate = (task) => {
    return `<article>
                <strong>[${task.index}]</strong>
                <input onclick="completeTask(${task.id})" ${task.completed ? 'checked' : ''}
                    type="checkbox" id="${task.id}" class="check-box-task" name="checkboxTask" />
                <label for="${task.id}" >${task.text}</label>
                <button
                    onclick="deleteTask(${task.id})"
                    type="button"
                    class="btn btn-delete-task"
                ><i class="fa-solid fa-trash"></i></button>
            </article>`;
}

const renderTasks = (tasks, htmlContainerTasks) => {

    let txtListTasks = '';

    if (tasks.length > 0) {
        tasks.forEach((task, index) => {
            task.index = index + 1;
            txtListTasks += getTaskTemplate(task);
        });
    } else {
        txtListTasks = `<article><p><i class="fa-solid fa-circle-info"></i> No hay tareas para mostrar... agregue una.</p></article>`
    }

    htmlContainerTasks.innerHTML = txtListTasks;
    renderSummary(divSummary);
}

const renderSummary = (htmlElement) => {
    const tasks = getTasks();
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed ? task : null).length;
    const uncompletedTasks = totalTasks - completedTasks;

    htmlElement.innerHTML = `
        <article>
            <p><span>${totalTasks}</span> ${totalTasks === 1 ? 'Tarea' : 'Tareas'}</p>
            <p><span>${completedTasks}</span> ${completedTasks === 1 ? 'Terminada' : 'Terminadas'}</p>
            <p><span>${uncompletedTasks}</span> ${uncompletedTasks === 1 ? 'Incompleta' : 'Incompletas'}</p>
        </article>
    `;
}

const saveDataExample = () => {
    // Si no hay tareas de ejemplo, se crean.
    if (!localStorage.getItem('tasks')) {
        // Arreglo de tareas de ejemplo:
        const TASKS = [
            { id: 1693877620021, text: 'Learn JavaScript', completed: false },
            { id: 1693877641620, text: 'Read about tech', completed: false },
            { id: 1693877650234, text: 'Make the dinner', completed: true }
        ];
        saveTasks(TASKS);
    }
}

btnAddTask.addEventListener('click', () => {
    addTask(inputTask);
    renderTasks(getTasks(), divTasks);
});

inputTask.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        addTask(inputTask);
        renderTasks(getTasks(), divTasks);
    }
});

saveDataExample();
renderTasks(getTasks(), divTasks);
