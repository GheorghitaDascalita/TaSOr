function checkNotificationPromise() {
    try {
      Notification.requestPermission().then();
    } catch(e) {
      return false;
    }

    return true;
  }

function askNotificationPermission() {
    // function to actually ask the permissions
    function handlePermission(permission) {
      // Whatever the user answers, we make sure Chrome stores the information
      if(!('permission' in Notification)) {
        Notification.permission = permission;
      }
    }
  
    // Let's check if the browser supports notifications
    if (!"Notification" in window) {
      console.log("This browser does not support notifications.");
    } else {
      if(checkNotificationPromise()) {
        Notification.requestPermission()
        .then((permission) => {
          handlePermission(permission);
        })
      } else {
        Notification.requestPermission(function(permission) {
          handlePermission(permission);
        });
      }
    }
  }
  askNotificationPermission();


function notify(deadline, task, x){
    var text = "You have a project due for tommorow"
    if(x == 1){
         text = 'HEY! Your project is now overdue.';
    }
    var notification = new Notification('To do list', { body: text + " " + deadline + " " + task });
}
  

//   if deadline - current date =  1 zi notifica
//   if deadline -current date < 0 notifica
// din class "project" ia deadlines
function notifyDeadlines(){
    var proiecte;
    var today = new Date();
    var deadline = new Date();
    var task;

    fetch('http://localhost:3000/projinfo')
                    .then((response) => {
                        return response.json();
                })
                .then((myJson) => {
                    proiecte = myJson.proj;
                    console.log(proiecte);
    }).then(() => {
        var len = Object.keys(proiecte).length;

        for(var i = 0; i<len; i++){
            deadline = new Date(proiecte[i].deadline);
            task = proiecte[i].description;
            
            if(deadline < today){
                notify(deadline, task, 1);
                console.log("11")
            }else if(deadline-today < 86400000){ // miliseconds in a day
                notify(deadline, task, 0);
                console.log("22");
            }
        }


    });
}

var lenCurrent = document.getElementsByClassName("project").length;
var current = document.getElementsByClassName("task").length; 
function checkNewProj(){
    var proiecte;
    
    fetch('http://localhost:3000/projinfo')
                .then((response) => {
                    return response.json();
              })
              .then((myJson) => {
                proiecte = myJson.proj;
                console.log(proiecte);
    }).then(() => {
        var len = Object.keys(proiecte).length;
        // var lenCurrent = document.getElementsByClassName("project").length;
        var notification;
        if(lenCurrent < len){
            notification = new Notification('New Project', { body: "A new project has been added, check it out!" });
            lenCurrent = len;
        }


    })
}

function checkNewTask(){
    var categorii;
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('id');
    
    fetch('http://localhost:3000/catinfo', {
        method:'POST',
        body:JSON.stringify({id:myParam}),
        mode: 'cors',    
        headers: {
            'Content-Type': 'Application/JSON',
            'Accept': 'Application/JSON'
        },
        credentials: 'include'
    }).then((response) => {
                    return response.json();
    }).then((myJson) => {
                categorii = myJson.cat;
                var lenCat = Object.keys(categorii).length;
                var tickets = 0;
                for(var i=0; i<lenCat; i++){
                    
                    var lenTicket = Object.keys(categorii[i].id_tickets).length;
                    tickets += lenTicket;
                }
                
                if(current < tickets ){
                    notification = new Notification('New Task', { body: "A new task has been added, check it out!" });
                    current = tickets;
                }     
    })
  

}
var newProj = 0;
var newTask = 0;
if(window.location.pathname == "/projects"){
    notifyDeadlines();

}
if(window.location.pathname == "/projects"){
    if(newTask != 0){
        clearInterval(newTask);
    }
  newProj = setInterval(checkNewProj, 50000); // if in project page
}
if(window.location.pathname == "/board"){
 if(newProj != 0){
     clearInterval(newProj);
 }

    newTask =  setInterval(checkNewTask, 50000); // if in board page
}