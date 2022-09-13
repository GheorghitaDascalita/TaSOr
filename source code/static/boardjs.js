function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

btns = document.querySelectorAll('.addTask')
var selectedEl = []
btns.forEach(btn => {
    btn.addEventListener('click', newTaskModal)
});

function newTaskModal(e){
    document.querySelector("#newTaskModal").style.display = 'block'
    document.querySelector(".newTask input").focus() 
    document.querySelector(".newTask").setAttribute('data-cat_id', e.target.previousSibling.id)
}

document.querySelector('#closeTask').addEventListener("click", closedNTM)

function closedNTM(e){
    document.querySelector("#newTaskModal").style.display = 'none'

    document.querySelector('.newTask').innerHTML = `
                <label for="title">Title: </label><input id="title" placeholder="task's title">
                <label for="description">Description: </label><input id="description" placeholder="task's description">
                <label for="start_time">Start time: </label><input id="start_time" type="date" placeholder="task's start time">
                <label for="deadline">Deadline: </label><input id="deadline" type="date" placeholder="task's deadline">
                <label for="url_proof">Proof: </label><input id="url_proof" placeholder="proof">
                <button>Add ticket</button>
            `
    document.querySelector('.newTask button').addEventListener('click', addTask)
    // document.querySelectorAll('.newTask input').forEach( function(element, index) {
    //     element.value = ''
    // });
}


document.querySelector('.newTask button').addEventListener('click', addTask)

function addTask(e) {

    title_input = document.querySelector('#title')
    description_input = document.querySelector('#description')
    start_time_input = document.querySelector('#start_time')
    deadline_input = document.querySelector('#deadline')
    url_proof_input = document.querySelector('#url_proof')

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    fetch('http://localhost:3000/addticket',
             {method: 'POST',
             mode: 'cors',    
             headers: {
                'Content-Type': 'Application/JSON',
                'Accept': 'Application/JSON'
            },
            credentials: 'include',
            body: JSON.stringify(
                {
                cat_id: e.target.parentNode.dataset.cat_id,
                title: title_input.value,
                description: description_input.value,
                start_time: new Date(start_time_input.value),
                deadline: new Date(deadline_input.value),
                url_proof: url_proof_input.value,

                operation: 'Ticket with title ' + title_input.value  + ' was added',
                id_project: urlParams.get("id"),
                }
                
                )
            })
        .then((response) => {
            return response.json();
      })
      .then((myJson) => {
            var task = document.createElement('li')
            let name = document.createElement('span')
            name.innerHTML = title_input.value
            let strong = document.createElement('strong')
            strong.appendChild(name)
            var del = document.createElement('span')
            del.innerHTML = '&times;'
            addDelEv(del)
            var cb = document.createElement('input')
            cb.setAttribute("type", "checkbox")
            addCheckEv(cb)
            task.appendChild(del)
            task.insertBefore(strong, del)
            task.insertBefore(cb, strong)
           
            task.setAttribute('id', myJson.id)
            task.setAttribute('draggable', 'true')
            addHandlers(task)

            id = e.target.parentNode.dataset.cat_id
            if((e.target.parentNode.dataset.cat_id[0] >= '0') && (e.target.parentNode.dataset.cat_id[0] <= '9'))
                id = "#\\3" + e.target.parentNode.dataset.cat_id[0] + " " + e.target.parentNode.dataset.cat_id.substr(1)
            document.querySelector(id).appendChild(task)


            // var title = document.createElement('span')
            // title.setAttribute('id', 'title')
            // title.textContent = title_input.value
            // insertAfter(title, title_input)
            // title_input.parentNode.removeChild(title_input)            

            // var description = document.createElement('span')
            // description.setAttribute('id', 'description')
            // description.textContent = description_input.value
            // insertAfter(description, description_input)
            // description_input.parentNode.removeChild(description_input)            

            // var start_time = document.createElement('span')
            // start_time.setAttribute('id', 'start_time')
            // start_time.textContent = start_time_input.value
            // console.log(start_time_input.value)
            // insertAfter(start_time, start_time_input)
            // start_time_input.parentNode.removeChild(start_time_input)            

            // var deadline = document.createElement('span')
            // deadline.setAttribute('id', 'deadline')
            // deadline.textContent = deadline_input.value
            // insertAfter(deadline, deadline_input)
            // deadline_input.parentNode.removeChild(deadline_input)

            var div = e.target.parentNode
            div.innerHTML = `<span style="color: green; font-size: x-large;">Task successfully added!</span>`
            setTimeout(closedNTM, 2000)


      });



      // trimit id-ul ticketului la server pentru a-l adauga in baza de date -------- tb fetch probabil
       
        // var xhr = new XMLHttpRequest();
        // xhr.open("POST", '/add', true)
        // xhr.setRequestHeader("Content-Type", "application/json")
        // var data = JSON.stringify({cat_id: button.target.id, id:task.id, name:task.querySelector("span").textContent});
        // // console.log(task.id);
        // console.log(data);
        // xhr.send();
         // ---------   

}

function addCheckEv(cb){
    cb.addEventListener('change', (e) => {
        let fields = e.target.parentNode.childNodes
        if(e.target.checked){
            e.target.parentNode.style.backgroundColor = 'rgba(100, 200, 100, 0.5)'
            fields[1].style.opacity = 0.2
            fields[2].style.opacity = 0.3
        }else{
            e.target.parentNode.style.backgroundColor = 'rgba(255, 255, 255, 1)'
            fields[1].style.opacity = 1
            fields[2].style.opacity = 1
        }

         fetch('http://localhost:3000/ticket-status/' + e.target.parentNode.id,
                 {method: 'POST',
                 mode: 'cors',    
                 headers: {
                    'Content-Type': 'Application/JSON',
                    'Accept': 'Application/JSON'
                },
                credentials: 'include',
                body: JSON.stringify({status: e.target.checked})
                })
    })

   
}

function addDelEv(del){
    del.addEventListener('click', (e) => {
                if(selectedEl.includes(e.target.parentNode)){
                    selectedEl = selectedEl.filter(function(value, index, arr){
                                    return value != e.target.parentNode;
                                });
                }
                // console.log(e.target.parentNode.id.split(" "));

                // trimit id-ul ticketului la server pentru a putea sa-l sterg din baza de date -------- tb fetch probabil
                // var xhr = new XMLHttpRequest();
                // xhr.open("POST", '/delete', true)
                // xhr.setRequestHeader("Content-Type", "application/json")
                // xhr.send(JSON.stringify({id:e.target.parentNode.id}));
                // ---------
                const queryString = window.location.search;
                const urlParams = new URLSearchParams(queryString);

                fetch('http://localhost:3000/delticket',
                     {method: 'POST',
                     mode: 'cors',    
                     headers: {
                        'Content-Type': 'Application/JSON',
                        'Accept': 'Application/JSON'
                    },
                    credentials: 'include',
                    body: JSON.stringify(
                        {
                            id_cat: e.target.parentNode.parentNode.id,
                            id_ticket: e.target.parentNode.id,
                            id_project: urlParams.get("id"),
                        }
                        
                        )
                    })
                
                e.target.parentNode.parentNode.removeChild(e.target.parentNode)
            })
}

// selecteaza toate taskurile aduse din baza de date la initializara paginii si adauga eventurile necesare --------
var tasks = document.querySelectorAll('.task');
tasks.forEach(task => {
    addCheckEv(task);
    
});
var todrop = document.querySelectorAll('.drop');
todrop.forEach(el =>{
    addDelEv(el);
})
// ----------

function addHandlers(el){
    el.addEventListener( 'click', clickHandler)
    el.addEventListener('dragstart', dragStartHandler)
    el.addEventListener('dragover', dragOverHandler)
    el.addEventListener('dragleave', dragLeaveHandler)
    el.addEventListener('dragend', dragEndHandler)
    el.addEventListener('drop', dropHandler)
}
function clickHandler(e){
    if(e.ctrlKey){
        if(selectedEl.includes(this)){
            selectedEl = selectedEl.filter(function(value, index, arr){
                                return value != e.target;
                            });
            this.classList.remove('selected')
        }
        else{
            selectedEl[selectedEl.length] = this
            this.classList.add('selected')
        }
    }
}
function dragStartHandler(e){
    if(!e.target.classList.contains('selected')){
        for(var i=0; i<selectedEl.length; i++)
            selectedEl[i].classList.remove('selected')
        selectedEl = [e.target]
        e.target.style.opacity = '40%'
    }
    else
        for(i=0; i<selectedEl.length; i++)
                selectedEl[i].style.opacity = "40%"
}
function dragOverHandler(e) {
    if (e.preventDefault)
        e.preventDefault(); // Necessary. Allows us to drop.
    this.classList.add('over');
    return false;
}
function dragLeaveHandler(e) {
    this.classList.remove('over');
}
function dragEndHandler(e){
    selectedEl.forEach(el =>
        el.style.opacity = "100%"
    )
}
function dropHandler(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    this.classList.remove('over')
    var dropHTML = ''
    for(i=0; i<selectedEl.length; i++){
        dropHTML += selectedEl[i].outerHTML
    }
    this.insertAdjacentHTML('beforebegin',dropHTML);
    var dropElem = this.previousSibling;
    for(i=selectedEl.length-1; i>=0; i--){
        if(selectedEl[i].firstChild.checked)
            dropElem.firstChild.checked = true
        dropElem.style.opacity = '100%'
        dropElem.classList.remove('selected')
        addCheckEv(dropElem.firstChild)
        addDelEv(dropElem.lastChild)
        addHandlers(dropElem);
        
        dropElem = dropElem.previousSibling
    }
    for(i=0; i<selectedEl.length; i++)
        selectedEl[i].parentNode.removeChild(selectedEl[i])
    selectedEl = []
    return false;
}
document.querySelector("#addCategory").addEventListener("click", addCategoryHandler)
function addCategoryHandler(e){
    document.querySelector("#newCatModal").style.display = 'block'
    document.querySelector('.newCategory').focus()
}
document.querySelector('#closeCat').addEventListener("click", (e)=>{
    document.querySelector("#newCatModal").style.display = 'none'
    document.querySelector('.newCategory').value = ''
})
document.querySelector('.newCategory').addEventListener('keyup', newCategoryHandler)
function newCategoryHandler(e){

    let key = e.which || e.keyCode
    if(key === 13){
        var div = document.createElement("div")
        div.classList.add('list')
        var label = document.createElement("label")
        // label.setAttribute('for', e.target.value + document.querySelectorAll('.list').length)
        label.innerHTML = e.target.value
        var ul = document.createElement("ul")
        // ul.setAttribute('id', e.target.value + document.querySelectorAll('.list').length)
        for(var i=0; i<selectedEl.length; i++){
            selectedEl[i].style.opacity = '100%'
            selectedEl[i].classList.remove('selected')
            ul.appendChild(selectedEl[i])
        }
        ul.addEventListener("dragover", overList)
        ul.addEventListener("drop", dropOnList)
        var button = document.createElement("button")
        button.classList.add('addTask')
        button.innerHTML = '&#x2b;'
        button.addEventListener('click', newTaskModal)
        div.appendChild(label)
        div.appendChild(ul)
        div.append(button)
        document.querySelector('#lists').appendChild(div)
        selectedEl = []
        

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        
        fetch('http://localhost:3000/addcat',
                     {method: 'POST',
                     mode: 'cors',    
                     headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify(
                        {
                        name: e.target.value,
                        id_project: urlParams.get("id"),
                        operation: 'Category with title ' +  e.target.value + ' was added',
                        }
                        
                    )
                    })
                .then((response) => {
                    return response.json();
              })
              .then((myJson) => {
                label.setAttribute('for', myJson.id)
                ul.setAttribute('id', myJson.id);
              });
        
       
        e.target.value = ''
        document.querySelector('#newCatModal').style.display = 'none'
       
        // ul tb sa ii dau ID

    }
}
function overList(e){
    if (e.preventDefault)
        e.preventDefault(); // Necessary. Allows us to drop.
    return false;
}
function dropOnList(e){
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    for(var i=0; i<selectedEl.length; i++){
        selectedEl[i].style.opacity = '100%'
        selectedEl[i].classList.remove('selected')
        this.appendChild(selectedEl[i])
    }
    selectedEl = []
}

function randomString(length) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');

    if (! length) {
        length = Math.floor(Math.random() * chars.length);
    }

    var str = '';
    for (var i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
}
document.querySelector("#activities").addEventListener('click', (e)=>{
  document.querySelector("#newActModal").style.display = 'block'
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
  fetch(`http://localhost:3000/activities/${urlParams.get("id")}`, {
    method: 'GET',
    mode: 'cors',
    headers: {
                'Content-Type': 'Application/JSON',
                'Accept': 'Application/JSON'
            },
            credentials: 'include'
  }).then((res) => {
    data = res.json();
    return data;
  }).then((json)=>{
    json.forEach( function(element, index) {
        div = document.createElement('div')
        div.innerHTML = element.operation
        document.querySelector('#activities-container').appendChild(div)
    });
  })  
})
document.querySelector("#closeAct").addEventListener('click', (e)=>{
    document.querySelector("#newActModal").style.display = 'none'
    document.querySelector("#activities-container").innerHTML = ''
})

document.querySelector("#addUser").addEventListener('click', (e)=>{
  document.querySelector("#newUserModal").style.display = 'block'
})
document.querySelector("#closeUser").addEventListener('click', (e)=>{
    document.querySelector("#newUserModal").style.display = 'none'
    // document.querySelector("#activities-container").innerHTML = ''
})
document.querySelector("#addUserToProj").addEventListener('keyup', (e)=>{
    let key = e.which || e.keyCode
    if(key === 13){
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
      fetch(`http://localhost:3000/userToProject/${urlParams.get("id")}`, {
        method: 'POST',
        mode: 'cors',
        headers: {
                    'Content-Type': 'Application/JSON',
                    'Accept': 'Application/JSON'
                },
                credentials: 'include',
      body: JSON.stringify({email: e.target.value})
      }
      ).then((res) => {
        data = res.json();
        return data;
      }).then((json)=>{

    
    
  })  
      document.querySelector("#newUserModal").style.display = 'none'
    e.target.value = 'none'
    }
})
