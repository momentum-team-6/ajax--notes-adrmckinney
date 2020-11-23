// const { create } = require("json-server")

const notesApiUrl = 'http://localhost:3000/notes/'
const form = document.querySelector('#note-writing-container')

let loadedNotes = []
let updatedNote = null

function displayNotes(notes) {
    const savedNoteList = document.querySelector('#saved-note-list')
    savedNoteList.innerHTML = ""
    console.log(savedNoteList)
    for (let note of notes) {
        console.log(note)
        // create an element for the note
        const noteElement = document.createElement('div')
        noteElement.classList.add("note")
        
        // create title for note and add it to noteElement
        const title = document.createElement('h3')
        title.innerText = note.title
        noteElement.appendChild(title)

        // create body for note and add it to noteElement
        const body = document.createElement('p')
        body.innerText = note.body
        noteElement.appendChild(body)
        
        // Add note element to saved-note-list
        savedNoteList.appendChild(noteElement)

        // Add dynamic delete button
        const deleteButton = document.createElement('button')
        deleteButton.innerText = 'Delete'
        deleteButton.addEventListener('click', function(event) {
            event.preventDefault()
            deleteNote(note.id)
        })
        deleteButton.classList.add('delete-button')
        noteElement.appendChild(deleteButton)

        // create dynamic update note
        const updateButton = document.createElement('button')
        updateButton.innerText = 'Update'
        updateButton.classList.add('update-button')
        updateButton.addEventListener('click', function(event) {
            event.preventDefault()
            const submitButton = document.querySelector('#submit-button')
            submitButton.innerText = 'Update Note'
            updatedNote = note
            document.querySelector('#note-title').value = note.title
            document.querySelector('#note-body').value = note.body
        })
        noteElement.appendChild(updateButton)

        // create a dynamic date stamp
        // const dateStamp = document.createElement('date')
        // dateStamp.addEventListener('click', function(event){
        //     preventDefault()

        // })
        //     dateStamp.innerText = new Date()
        
        // noteElement.appendChild(dateStamp)
    }
}

// API interactions

function getAllNotes() {
    fetch(notesApiUrl)
    .then(function(response) {
        return response.json()
    })
    .then(function(notes) {
        loadedNotes = notes
        displayNotes(loadedNotes)
    })
}

function addNote(title, body) {
    fetch(notesApiUrl, {
        method: 'POST', 
        headers: {"Content-Type": "application/json"}, 
        body: JSON.stringify({"title": title, "body": body})
    })
    .then(r => r.json())
    .then(function(note) {
        console.log(note)
        loadedNotes.push(note)
        displayNotes(loadedNotes)
    })

}

function deleteNote(id) {
    fetch(`${notesApiUrl}${id}`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
    })
    .then(function(response) {
        return response.json()
    })
    .then(function() {
        const noteToRemove = loadedNotes.find(function(note) {
            return note.id === id
        })
        const noteIndexToRemove = loadedNotes.indexOf(noteToRemove)
        loadedNotes.splice(noteIndexToRemove, 1)
        displayNotes(loadedNotes)
    })
    
}

function updateNote(id, title, body) {
    console.log(id, title, body)
    fetch(`${notesApiUrl}${id}`, {
        method: "PATCH",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({'title': title, 'body': body})
    })
    .then(function(response) {
        return response.json()
    })
    .then(function(updatedNote) {
        const noteToUpdate = loadedNotes.find(function(note) {
            return note.id === updatedNote.id
        })
        const noteIndexToUpdate = loadedNotes.indexOf(noteToUpdate)
        loadedNotes[noteIndexToUpdate] = updatedNote
        displayNotes(loadedNotes)
    })
}


// user events

form.addEventListener('submit', function(event) {
    event.preventDefault()
    const title = document.querySelector('#note-title').value
    const body = document.querySelector('#note-body').value
    console.log(title, body)
    if (updatedNote) {
        updateNote(updatedNote.id, title, body)
    } else {
        addNote(title, body)
    }

    document.querySelector('#note-title').value = ""
    document.querySelector('#note-body').value = ""
    document.querySelector('#submit-button').innerHTML = 'Create Note'
    updatedNote = null

    
    
    }
)

// gets all notes to display for the first page load. This should always be last
getAllNotes()

