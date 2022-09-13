var btn = document.getElementById("new-project");
btn.addEventListener("click", addProject);


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

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function addProject(button){

    // creez elementele din structura html a unui proiect
    var container = document.getElementById("project-container");
    var link = document.createElement('a');
    var project = document.createElement('li');
    var title = document.createElement('h3');
    var desc = document.createElement('p');
    var deadline = document.createElement('p');
    var submit = document.createElement('button');

    var title_input = document.createElement('input');
    title_input.setAttribute('placeholder', 'project title');
    title_input.setAttribute('class', 'input_proiect');

    
    var desc_input = document.createElement('input');
    desc_input.setAttribute('placeholder', 'project description');
    desc_input.setAttribute('class', 'input_proiect');
    
    var deadline_input = document.createElement('input');
    deadline_input.setAttribute('placeholder', 'project deadline');
    deadline_input.setAttribute('class', 'input_proiect');
    deadline_input.setAttribute('type', 'date');

   
    // pun atributele necesare fiecarui element
    project.setAttribute("class", "project");
    desc.setAttribute("class", "descriere");
    deadline.setAttribute("class", "deadline");
    submit.textContent = "Add"

    // ---

    var text;
    container.appendChild(link);
    link.appendChild(project);
    project.appendChild(title_input);
    project.appendChild(desc_input);
    project.appendChild(deadline_input);
    project.appendChild(submit);

    submit.addEventListener('click', (e) => {
        if(title_input.value && desc_input.value && deadline_input.value){
            fetch('http://localhost:3000/addproj',{
                method: 'POST',
                mode: 'cors',    
                headers: {
                    'Content-Type': 'Application/JSON',
                    'Accept': 'Application/JSON'
                },
                credentials: 'include',
                body: JSON.stringify({
                    proj_title: title_input.value,
                    proj_description: desc_input.value,
                    proj_deadline: new Date(deadline_input.value)
                })
            }).then((response) => {
                    return response.json();
                }).then((myJson) => {
                    text = title_input.value;
                    title.textContent = text;
                    insertAfter(title, title_input);
                    project.removeChild(title_input);

                    text = desc_input.value;
                    desc.textContent = text;
                    insertAfter(desc, desc_input);
                    project.removeChild(desc_input);

                    text = new Date(deadline_input.value);
                    deadline.textContent = text;
                    insertAfter(deadline, deadline_input);
                    project.removeChild(deadline_input);


                    project.setAttribute('id', myJson.id)
                    link.setAttribute("href", "./board?id=" + myJson.id);
                    e.target.parentNode.removeChild(e.target)
                });
        }
    })

}


function updateProjectListDB(id, name, content){
    
    fetch('http://localhost:3000/updateproj',{
            method: 'POST',
            mode: 'cors',    
            headers: {
                'Content-Type': 'Application/JSON',
                'Accept': 'Application/JSON'
            },
            credentials: 'include',
            body: JSON.stringify({
                proj_id:id,
                column_name:name,
                data:content
            })
        }).then((response) => {
            return response.json();
        }).then((myJson) => {
            console.log(myJson);
        });
}

