const addTaskForm = document.querySelector('#addTaskForm')
const addTaskTitle = document.querySelector('#addTaskForm #title')
const addTaskBtn = document.querySelector('#addTaskBtn')
const addTaskMsg = document.querySelector('#addTaskMsg')
const tasksList = document.querySelector('#tasksList')
const tasksListMsg = document.querySelector('#tasksListMsg')

const addTask = async () => {
    const data = new FormData(addTaskForm)

    const headers = new Headers({
        'Content-Type': 'application/json; charset=utf-8'
    })

    const body = JSON.stringify({
        title: data.get('title'),
        description: data.get('description')
    })

    return await fetch('/api/tasks', { method: 'POST', headers, body })
}
const listTasks = async () => {
    tasksList.innerHTML = ''
    tasksListMsg.classList.remove('is-danger')
    tasksListMsg.classList.add('is-hidden')

    fetch('/api/tasks')
        .then((response) => {
            if (!response.ok) {
                throw Error(response.statusText)
            }

            return response.json()
        })
        .then((response) => {
            response.forEach((task) => {
                const title = document.createElement('td')
                title.innerHTML = `<p>${task.title}</p>`

                const actions = document.createElement('td')
                actions.classList.add('has-text-right')
                actions.innerHTML = `<button class="button is-small is-primary" id="deleteTask${task.id}" onclick="completeTask('${task.id}');"><span class="icon is-small"><i class="fas fa-check"></i></span></button>`

                const row = document.createElement('tr')
                row.appendChild(title)
                row.appendChild(actions)

                tasksList.appendChild(row)
            })
        })
        .catch(() => {
            tasksListMsg.textContent = 'Wystapil blad podczas pobierania notatek. Spróbuj ponownie pozniej.'
            tasksListMsg.classList.add('is-danger')
        })
}
const completeTask = (id) => {
    tasksListMsg.classList.remove('is-danger')
    tasksListMsg.classList.add('is-hidden')

    const button = document.querySelector(`#deleteTask${id}`)
    button.classList.add('is-loading')

    setTimeout(() => {
        fetch(`/api/tasks?id=${id}`, { method: 'DELETE' })
            .then((response) => {
                if (!response.ok) {
                    throw Error(response.statusText)
                }

                tasksListMsg.textContent = 'Pomyslnie usunieto notatke.'
                tasksListMsg.classList.add('is-success')

                listTasks()
            })
            .catch(() => {
                button.classList.remove('is-loading')
                tasksListMsg.textContent = 'Wystipil blad podczas usuwania notatki. Spróbuj ponownie pozniej.'
                tasksListMsg.classList.add('is-danger')
            })
            .finally(() => {
                tasksListMsg.classList.remove('is-hidden')
            })
    }, 1000)
}

listTasks()

addTaskForm.addEventListener('submit', (event) => {
    event.preventDefault()

    addTaskBtn.classList.add('is-loading', 'is-disabled')
    addTaskMsg.classList.remove('is-danger', 'is-success')
    addTaskMsg.classList.add('is-hidden')

    setTimeout(() => {
        addTask()
            .then((response) => {
                if (!response.ok) {
                    throw Error(response.statusText)
                }

                addTaskMsg.textContent = 'Pomyslnie dodano notatke.'
                addTaskMsg.classList.add('is-success')
                addTaskTitle.value = ''

                listTasks()
            })
            .catch(() => {
                addTaskMsg.textContent = 'Wystapil blad podczas dodawania notatki. Spróbuj ponownie pozniej.'
                addTaskMsg.classList.add('is-danger')
            })
            .finally(() => {
                addTaskBtn.classList.remove('is-loading', 'is-disabled')
                addTaskMsg.classList.remove('is-hidden')
            })
    }, 1000)
})