function dateStamp() {
  let newDate = new Date()
  let year = newDate.getFullYear()
  let month = monthNumberToString(newDate.getMonth())
  let day = newDate.getDate()
  return month + " " + day + ', ' + year
}
// dateStamp()

function monthNumberToString(month){
    if (month === 0) {
        return "Jan"
    } else if (month === 1) {
        return "Feb"
    } else if (month === 2) {
        return "March"
    } else if (month === 3) {
        return "April"
    } else if (month === 4) {
        return "May"
    } else if (month === 5) {
        return "Jun"
    } else if (month === 6) {
        return "July"
    } else if (month === 7) {
        return "Aug"
    } else if (month === 8) {
        return "Sept"
    } else if (month === 9) {
        return "Oct"
    } else if (month === 10) {
        return "Nov"
    } else if (month === 11) {
        return "Dec"
    }
}


const notesApiUrl = 'http://localhost:3000/notes/'
const submitButton = document.querySelector('#submit-container')
const dnd = dragula({})

// Application State (memory)
let tagNotes = {work: [], school: [], family: [], play: [], misc: []}



function toggleNoteDisplayMode(note, isEditing) {
    const viewNoteContainer = document.querySelector(`#view-note-${note.id}`)
    const editNoteContainer = document.querySelector(`#edit-note-${note.id}`)
    
    if (isEditing) {
        viewNoteContainer.style.display = "none"
        editNoteContainer.style.display = "flex"
    } else {
        viewNoteContainer.style.display = "flex"
        editNoteContainer.style.display = "none"
    }  
}

function diplayViewNote(note, parent) {
    // create view mode container
    const viewContainer = document.createElement('div')
    viewContainer.classList.add('view')
    viewContainer.id = `view-note-${note.id}`
    parent.appendChild(viewContainer)

    // create noteBodyDate container
    const noteBodyDateContainer = document.createElement('div')
    noteBodyDateContainer.classList.add('note-body-date-container')
    viewContainer.appendChild(noteBodyDateContainer)

    // create a body element to go inside the noteBodyDateContainer
    const body = document.createElement('div')
    body.innerText = note.body
    body.classList.add('note-body')
    body.id = 'note-body'
    noteBodyDateContainer.appendChild(body)

    // create note date to go inside noteBodyDateContainer
    const noteDate = document.createElement('div')
    noteDate.id = 'note-date'
    
    if (note.updated_at) {
        noteDate.innerText = 'Updated on' + ' ' + note.updated_at
    } else {
        noteDate.innerText = 'Created on' + ' ' + note.created_at
    }
    noteBodyDateContainer.appendChild(noteDate)

    // create an actions container to house delete and update buttons
    const actions = document.createElement('div')
    actions.classList.add('actions')
    viewContainer.appendChild(actions)

    // delete button
    const deleteButton = document.createElement('button')
    deleteButton.classList.add('fas')
    deleteButton.classList.add('fa-trash')
    deleteButton.classList.add('action-buttons')
    deleteButton.addEventListener('click', function(event) {
        event.preventDefault
        deleteNote(note.category, note.id)
    })
    actions.appendChild(deleteButton)

    // update button
    const updateButton = document.createElement('button')
    updateButton.classList.add('fas')
    updateButton.classList.add('fa-pen-alt')
    updateButton.classList.add('action-buttons')
    updateButton.addEventListener('click', function(event) {
        event.preventDefault
        toggleNoteDisplayMode(note, true)

    })
    actions.appendChild(updateButton)
} 

function displayEditNote(note, parent) {
    // create edit mode container
    const editContainer = document.createElement('div')
    // hide the edit mode by default
    editContainer.style.display = 'none'
    editContainer.id = `edit-note-${note.id}`
    editContainer.classList.add('edit')
    parent.appendChild(editContainer)

    // create noteBodyDate container
    const noteBodyDateContainer = document.createElement('div')
    noteBodyDateContainer.classList.add('note-body-date-container')
    editContainer.appendChild(noteBodyDateContainer)

    // create a body element to go inside the noteBodyDateContainer
    const body = document.createElement('textarea')
    body.value = note.body
    body.classList.add('edit-note-body')
    // body.classList.add('note-body')
    body.id = `note-body-${note.id}`
    noteBodyDateContainer.appendChild(body)

    // create note date to go inside noteBodyDateContainer
    const noteDate = document.createElement('div')
    noteDate.id = 'note-date'
    noteDate.innerText = 'Created on' + ' ' + note.created_at
    noteBodyDateContainer.appendChild(noteDate)

    // create an actions container to house delete and update buttons
    const actions = document.createElement('div')
    actions.classList.add('actions')
    editContainer.appendChild(actions)

    // cancel button
    const cancelButton = document.createElement('button')
    cancelButton.classList.add('far')
    cancelButton.classList.add('fa-window-close')
    cancelButton.classList.add('action-buttons')
    cancelButton.addEventListener('click', function(event) {
        event.preventDefault()
        toggleNoteDisplayMode(note, false)
        document.querySelector(`#note-body-${note.id}`).value = note.body
    })
    actions.appendChild(cancelButton)

    // save button
    const saveButton = document.createElement('button')
    saveButton.classList.add('far')
    saveButton.classList.add('fa-check-square')
    saveButton.classList.add('action-buttons')
    saveButton.addEventListener('click', function(event) {
        event.preventDefault
        
        toggleNoteDisplayMode(note, false)
        const body = document.querySelector(`#note-body-${note.id}`).value
        updateNote(note.id, note.category, body)
        
        // null created_at date
        noteDate.value = ''

        // create update note date to go inside noteBodyDateContainer
        const updateNoteDate = document.createElement('div')
        updateNoteDate.id = 'note-date'
        updateNoteDate.innerText = 'Updated on' + ' ' + note.updated_at
        noteBodyDateContainer.appendChild(updateNoteDate)
    })
    actions.appendChild(saveButton)
}

function displayNotesImproved(tagNotes) {
    const categories = Object.keys(tagNotes)

    
    // Provide category selection options for user
    const categorySelect = document.querySelector("#category-input")
    categorySelect.innerHTML = ''
    

    const savedNotes = document.querySelector('#saved-note-container')
    savedNotes.innerHTML = ''
    for (let categoryName of categories) {
        console.log(categoryName)
        
        const categoryOption = document.createElement('option')
        categoryOption.innerText = categoryName
        categorySelect.appendChild(categoryOption)

        let notesForCategory = tagNotes[categoryName]
        if (notesForCategory.length === 0) {
            continue
        }

        // create container for notes
        const categoryContainer = document.createElement('div')
        categoryContainer.classList.add("categoryContainer")
        // Set category container id to the category name so that
        // it can be referenced in the dragula drop event
        categoryContainer.id = categoryName
        dnd.containers.push(categoryContainer)
        savedNotes.appendChild(categoryContainer)
        
        // create element for category
        const category = document.createElement('h2')
        category.innerText = categoryName
        category.classList.add('category')
        category.id = 'note-category'
        categoryContainer.appendChild(category)

        for (let note of notesForCategory) {

            // create contentContainer to house view and edit modes. View and edit modes will each contain noteBodyDate and actions containers
            const contentContainer = document.createElement('div')
            contentContainer.classList.add('content-container')
            contentContainer.id = note.id
            categoryContainer.appendChild(contentContainer)
            
            diplayViewNote(note, contentContainer)
            displayEditNote(note, contentContainer)
            
        }
        
    }
    dnd.on('drop', function(noteContainer, destinationCategoryContainer) {
        updateNoteCategory(noteContainer.id, destinationCategoryContainer.id)

    })
}

// API interactions
function getAllNotes() {
    fetch(notesApiUrl)
    .then(function(response) {
        return response.json()
    })
    .then(function(notes) {
        console.log(notes)
        for (let note of notes) {
            if (note.category === 'school')
            tagNotes.school.push(note)
            
            else if (note.category === 'work') {
                tagNotes.work.push(note)
            }
            else if (note.category === 'family') {
                tagNotes.family.push(note)
            }
            else if (note.category === 'play') {
                tagNotes.play.push(note)
            }
            else if (note.category === 'misc') {
                tagNotes.misc.push(note)
            }
        }
            
        displayNotesImproved(tagNotes)
    })
}

function addNote(category, body) {
    fetch(notesApiUrl, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({category: category, body: body, created_at: dateStamp()})
    })
    .then(function(response) {
        return response.json()
    })
    .then(function(note) {
        console.log(note)
        tagNotes[category].push(note)
        displayNotesImproved(tagNotes)
    })
}

function deleteNote(category, id) {
    fetch(`${notesApiUrl}${id}`, {
        method: 'DELETE',
    })
    .then(function() {
        const noteToRemove = tagNotes[category].find(function(note) {
            return note.id === id
        })
        const noteIndexToRemove = tagNotes[category].indexOf(noteToRemove)
        tagNotes[category].splice(noteIndexToRemove, 1)
        displayNotesImproved(tagNotes)
    })
}

function updateNote(id, category, body) {
    fetch(`${notesApiUrl}${id}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({body: body, updated_at: dateStamp()})
    })
    .then(response => response.json())
    .then(function(updatedNote) {
        // notes for category eg., family. This is the array of notes for a given category.
        const notesForCategory = tagNotes[category]
        const noteToUpdate = notesForCategory.find(note => note.id === updatedNote.id)
        const noteIndexToUpdate = notesForCategory.indexOf(noteToUpdate)
        notesForCategory[noteIndexToUpdate] = updatedNote
        tagNotes[category] = notesForCategory
        displayNotesImproved(tagNotes)
        console.log(tagNotes)
    })
}

function updateNoteCategory(id, category) {
    fetch(`${notesApiUrl}${id}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({category: category, updated_at: dateStamp()})
    })
    
}

submitButton.addEventListener('submit', function(event) {
    event.preventDefault()
    const category = document.querySelector('#category-input').value
    const body = document.querySelector('#note').value
    console.log(category, body)
    addNote(category, body)
    document.querySelector('#note').value = ''
})

getAllNotes()