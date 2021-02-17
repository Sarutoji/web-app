const addTaskForm = document.querySelector('#addTaskForm')
const addTaskTitle = document.querySelector('#addTaskForm #title')
const addTaskBtn = document.querySelector('#addTaskBtn')
const addTaskMsg = document.querySelector('#addTaskMsg')

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

addTaskForm.addEventListener('submit', (event) => {
    event.preventDefault()

    addTaskBtn.classList.add('is-loading', 'is-disabled')
    addTaskMsg.classList.remove('is-danger', 'is-success')
    addTaskMsg.classList.add('is-hidden')

    setTimeout(() => {
        addTask()
            .then((response) => {
                if (!response.ok) {
                    throw Error('Wystapil blad podczas dodawania notatki. Sprobuj ponownie pozniej.')
                }

                addTaskMsg.textContent = 'Pomyslnie dodano notatke.'
                addTaskMsg.classList.add('is-success')
                addTaskTitle.value = ''
            })
            .catch((error) => {
                addTaskMsg.textContent = error.message
                addTaskMsg.classList.add('is-danger')
            })
            .finally(() => {
                addTaskBtn.classList.remove('is-loading', 'is-disabled')
                addTaskMsg.classList.remove('is-hidden')
            })
    }, 1000)
})