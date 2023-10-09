let inprogressContainer=document.querySelector(".inprogress-container");
let doneContainer=document.querySelector(".done-container");
let todoContainer=document.querySelector(".todo-container");
let reviewContainer=document.querySelector(".review-container");
let elements=document.getElementsByClassName("element");
let form=document.querySelector("form");
let updateBtn=document.querySelector(".update-btn");
let stageInput=document.querySelector(".stage-row");

  let inputs=form.elements;

  let taskName=inputs["name"];
  let storyPoint=inputs["story-point"];
  let assigner=inputs["assigner"];
  let stage=inputs["stage"].value;

let tasks=[{name:"Todo 1",point:10,createdAt:new Date(),stage:"IN_PROGRESS",assigner:"Asim"}];

form.addEventListener("submit",AddTask);

function AddTask(e){
 e.preventDefault();

let task={
    name:taskName.value,
    point:Number(storyPoint.value),
    assigner:assigner.value,
    stage:stage.value || "TODO",
    createdAt:new Date()
}
  tasks.push(task)
  ClearInputs();

  stageInput.classList.add("hide")
  stage.value=""
  List()
}

  function ClearInputs(){
    taskName.value="";
   storyPoint.value="";
   assigner.value=""; 
  }

  function List(){
     todoContainer.innerHTML=""
     inprogressContainer.innerHTML=""
     reviewContainer.innerHTML=""
     doneContainer.innerHTML=""

     let sortedTask=tasks.sort((x,y)=>x.createdAt-y.createdAt);


     sortedTask.forEach((task,index)=>{

        let taskElement=`<div class="element" data-id="${index}" draggable="true">${task.name} <span>${task.point}</span></div>`

        switch(task.stage){
            case"TODO":
            todoContainer.innerHTML+=taskElement;
            break;
            case"IN_PROGRESS":
            inprogressContainer.innerHTML+=taskElement;
            break;
            case"REVIEW":
            reviewContainer.innerHTML+=taskElement;
            break;
            case"DONE":
            doneContainer.innerHTML+=taskElement;
            break;
        }
     })

     Draggable()
  }

  function Draggable(){
    for (const element of elements) {
    
        element.addEventListener("dragstart",function(e){
            let element=e.target;
    
            inprogressContainer.addEventListener("dragover",function(e){
               e.preventDefault();
            });
    
            [inprogressContainer,doneContainer,todoContainer,reviewContainer].forEach(container=>{
    
                container.addEventListener("dragover",function(e){
                    e.preventDefault();
                    container.classList.add("large");
                });
                container.addEventListener("dragleave",function(){
                  container.classList.remove("large");
              });
                container.addEventListener("drop",function(e){
                    e.preventDefault();
                    let stage=container.getAttribute("data-name");

                   if(element){
                    container.appendChild(element);
                    let id=Number(element.getAttribute("data-id"));
                    let task= tasks(id);
                    let updatedTask= {...task,stage:stage};

                    tasks.splice(id,1,updatedTask);
                    List()
                   }
                   element=null;
                });
            })
        })

        element.addEventListener("click",ShowData);
    }
  }

  let updatedId=null;

  function ShowData(e){
    let element=e.target;
    let id=Number(element.getAttribute("data-id"));
    let task= tasks(id);
    updatedId=id;

    inputs["name"].value=task.name;
    inputs["story-point"].value=task.point;
    inputs["assigner"].value=task.assigner;
    inputs["stage"].value=task.stage;
    updateBtn.classList.remove("hide");
    stageInput.classList.remove("hide");
}

    updateBtn.addEventListener("click",updatedTask);

    function updatedTask(){

        let findedTask=tasks[updatedId];
        findedTask.name=taskName.value;
        findedTask.point=storyPoint.value;
        findedTask.assigner=assigner.value;
        findedTask.stage=stage.value;

        tasks.splice(updatedId,1,findedTask);

        List();

        ClearInputs();
        updatedBtn.classList.add("hide");
        stageInput.classList.add("hide");
        updatedId=null;
    }

  document.addEventListener("DOMContentLoaded",function(){
    List()
})