const state = {
  taskList: [],
};

const taskContents = document.querySelector(".task__contents");

const taskModal = document.querySelector(".task__modal__body");

// HTML Code for my task
const htmlTaskContent = ({ id, title, taskId, description, type, url }) =>
  `
  <div class = 'col-md-6 col-lg-4 mt-3' id = ${id} key = ${id} >

      <div class = 'card shadow-sm task__card'>
          <div class = 'card-header d-flex gap-2 justify-content-end task__card__header' id = 'my__task__header'>
            <button type = 'button' class = 'btn btn-outline-info mr-2 my__task__card__edit__button' name = ${id} onclick = "editTask.apply(this,arguments)">
                  <i class = 'fas fa-pencil-alt' name = ${id}></i>
            </button>
            <button type = 'button' class = 'btn btn-outline-danger mr-2 my__task__card__delete__button' name = ${id} onclick = "deleteTask.apply(this,arguments)">
                  <i class = 'fas fa-trash-alt' name = ${id}></i>
            </button>

          </div>

          <div class = 'card-body my__task__card__body'>

          ${
            url
              ? `<img  width='100%' height='200px' style="object-fit: cover; object-position: center"  src=${url} alt='card image cap' class='card-image-top md-3 rounded-lg' />`
              : `
          <img   width='100%' height='185px' style="object-fit: cover; object-position: center ; " src="./task.webp" alt='card image cap' class='place__holder__image mb-3' />

          `
          }
              <h4 class = 'task__card_title'>${title}</h4>

              <p calss = 'description trim-3-lines text-muted' data-gram_editor = 'false' > ${description} </p>

              <div class = 'tags text-white d-flex flex-wrap' >
                  <span class ='badge bg-primary m-1 my__task__card__type' > ${type} </span>
              </div>
          </div>

          <div class = 'card-footer'>
              <button
                  type = 'button'
                  class = 'btn btn-outline-primary float-right my__task__card__open__btn'
                  data-bs-toggle = 'modal'
                  data-bs-target = '#showTask'
                  onclick = 'openTask.apply(this , arguments)'
                  id = ${id}

                  >Open Task
              </button>
          </div>
      </div>
  </div>
`;

// HTML Code for open Task Modal
const htmlModalContent = ({ id, title, description, url }) => {
  const date = new Date(parseInt(id));
  return `
      <div id = ${id}>
      ${
        url
          ? `
            <img width='100%' src=${url} alt='card image cap' class='img-fluid place__holder__image mb-3' />
          `
          : `
          <img width='100%' style="object-fit: cover; object-position: center;  " src="../images/defult task image.png" alt='card image cap' class='img-fluid place__holder__image mb-3' />
          `
      }
      <strong class = 'text-sm text-muted' > Created on ${date.toDateString()} </strong>
      <h2 class = 'my-3' >${title}</h2>
      <p class = 'lead' > ${description} </p>
      </div>
  `;
};

// This function is for updating local storage
const updateLocalStorage = () => {
  localStorage.setItem(
    "tasks",
    JSON.stringify({
      tasks: state.taskList,
    })
  );
};

// This function checks and shows previous data  if any
const loadInitialData = () => {
  const localStorageCopy = JSON.parse(localStorage.tasks);

  if (localStorageCopy) state.taskList = localStorageCopy.tasks;

  state.taskList.map((cardDate) => {
    // console.log(cardDate)
    taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(cardDate));
  });
  console.log(state.taskList);
};

// This function collects our tasks data and shows my tasks
const handleSubmit = (event) => {
  const id = `${Date.now()}`;
  const taskId = state.taskList.length + 1;
  const input = {
    // url: document.getElementById("imageUrl").value,
    title: document.getElementById("taskTitle").value,
    description: document.getElementById("taskDescription").value,
    type: document.getElementById("tags").value,
  };
  console.log(input.url);

  if (input.title === "" || input.description === "" || input.type === "") {
    return alert("please fill all fields");
  }

  taskContents.insertAdjacentHTML(
    "beforeend",
    htmlTaskContent({
      ...input,
      id,
      taskId,
    })
  );

  state.taskList.push({ ...input, id, taskId });
  updateLocalStorage();
};

// This function open my task in details
const openTask = (e) => {
  if (!e) e = window.event;

  const getTask = state.taskList.find(({ id }) => id === e.target.id);
  taskModal.innerHTML = htmlModalContent(getTask);
};

// this funciton delete my tasks if i want
const deleteTask = (e) => {
  if (!e) e = window.event;
  const targetID = e.target.getAttribute("name");
  const type = e.target.tagName;

  const removeTask = state.taskList.filter(({ id }) => id !== targetID);
  state.taskList = removeTask;
  updateLocalStorage();
  if (type === "BUTTON") {
    return e.target.parentNode.parentNode.parentNode.parentNode.removeChild(
      e.target.parentNode.parentNode.parentNode
    );
  }
  return e.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(
    e.target.parentNode.parentNode.parentNode.parentNode
  );
};

// This function to Edit my task .
const editTask = (e) => {
  if (!e) e = window.event;

  const targetID = e.target.id;
  const type = e.target.tagName;

  let parentNode;
  let taskTitle;
  let taskDescription;
  let taskType;
  let submitButton;

  if (type === "BUTTON") {
    parentNode = e.target.parentNode.parentNode;
  } else {
    parentNode = e.target.parentNode.parentNode.parentNode;
  }

  taskTitle = parentNode.childNodes[3].childNodes[3];
  taskDescription = parentNode.childNodes[3].childNodes[5];
  taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
  submitButton = parentNode.childNodes[5].childNodes[1];

  taskTitle.setAttribute("contenteditable", "true");

  taskDescription.setAttribute("contenteditable", "true");
  taskType.setAttribute("contenteditable", "true");

  submitButton.setAttribute("onclick", "saveEdit.apply(this , arguments)");
  submitButton.removeAttribute("data-bs-toggle");
  submitButton.removeAttribute("data-bs-target");
  submitButton.innerHTML = "Save Changes";
};

// this function saves my changes in my tasks
const saveEdit = (e) => {
  if (!e) e = window.event;

  var element = document.getElementById("element-id");

  const targetID = e.target.id;
  const parentNode = e.target.parentNode.parentNode;

  const taskTitle = parentNode.childNodes[3].childNodes[3];
  const taskDescription = parentNode.childNodes[3].childNodes[5];
  const taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
  const submitButton = parentNode.childNodes[5].childNodes[1];

  const updateData = {
    taskTitle: taskTitle.innerHTML,
    taskDescription: taskDescription.innerHTML,
    taskType: taskType.innerHTML,
  };

  let stateCopy = state.taskList;
  stateCopy = stateCopy.map((task) =>
    task.id === targetID
      ? {
          id: task.id,
          title: updateData.taskTitle,
          description: updateData.taskDescription,
          type: updateData.taskType,
          // url: task.url,
        }
      : task
  );

  state.taskList = stateCopy;
  updateLocalStorage();

  taskTitle.setAttribute("contenteditable", "false");
  taskDescription.setAttribute("contenteditable", "false");
  taskType.setAttribute("contenteditable", "false");

  submitButton.setAttribute("onclick", "openTask.apply(this , arguments)");
  submitButton.setAttribute("data-bs-toggle", "modal");
  submitButton.setAttribute("data-bs-target", "#showTask");
  submitButton.innerHTML = "Open Task";
};

// This function for search Functionality
const searchTask = (e) => {
  if (!e) window.event;

  while (taskContents.firstChild) {
    taskContents.removeChild(taskContents.firstChild);
  }

  const resultData = state.taskList.filter(({ title }) => {
    return title.toLowerCase().includes(e.target.value.toLowerCase());
  });
  resultData.map((cardData) => {
    taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(cardData));
  });
};
// Speech Recogination for task content

document.addEventListener("DOMContentLoaded", function () {
  // Create mic button dynamically
  const micButton = document.createElement("button");
  micButton.innerHTML = '<i class="fas fa-microphone"></i>';
  micButton.classList.add("mic-btn");
  document.body.appendChild(micButton);

  // Create a floating modal for speech recognition
  const overlay = document.createElement("div");
  overlay.classList.add("speech-overlay");
  document.body.appendChild(overlay);

  const modal = document.createElement("div");
  modal.classList.add("speech-modal");
  modal.innerHTML = `<div class='speech-modal-content'>
                        <p id='speech-question'></p>
                        <p id='speech-text'>Listening...</p>
                        <div class='listening-animation'></div>
                    </div>`;
  document.body.appendChild(modal);

  // Speech recognition setup
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = "en-US";

  let currentStep = 0;
  let taskData = { title: "", type: "", description: "" };
  const steps = [
    "What is the task title?",
    "What is the task level? You can say Easy, Medium, or Hard.",
    "What is the task description?",
  ];
  let isListening = false;

  micButton.addEventListener("click", function () {
    if (isListening) {
      isListening = false;
      closeSpeechModal();
    } else {
      micButton.innerHTML = '<i class="fas fa-times"></i>';
      micButton.classList.add("active");
      overlay.style.display = "block";
      modal.style.display = "flex";
      currentStep = 0;
      taskData = { title: "", type: "", description: "" };
      isListening = true;
      updateSpeechText("Speaking...");
      speakMessage("Welcome! I will ask you some questions to create a task.", askQuestion, false);
    }
  });

  function updateSpeechText(text) {
    document.getElementById("speech-text").innerText = text;
  }

  function updateSpeechQuestion(text) {
    document.getElementById("speech-question").innerText = text;
  }

  function speakMessage(message, callback, printMsg = true) {
    const speechSynthesis = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = "en-US";
    utterance.rate = 1;
    updateSpeechText("Speaking...");
    if(printMsg){
      updateSpeechQuestion(message);
    }
    speechSynthesis.speak(utterance);
    utterance.onend = function () {
      if (callback) callback();
    };
  }

  function askQuestion() {
    if (currentStep < steps.length) {
      updateSpeechQuestion(steps[currentStep]);
      setTimeout(() => {
        speakMessage(steps[currentStep], function () {
          updateSpeechText("Listening...");
          recognition.start();
        });
      }, 500); // Small delay to ensure visibility
    } else {
      speakMessage("Thank you for providing the information. Your task has been recorded.", fillTaskForm);
    }
  }

  recognition.onresult = function (event) {
    const speechResult = event.results[0][0].transcript;
    console.log(`Recognized: ${speechResult}`);

    if (currentStep === 0) {
      taskData.title = speechResult;
    } else if (currentStep === 1) {
      taskData.type = speechResult;
    } else if (currentStep === 2) {
      taskData.description = speechResult;
    }

    currentStep++;
    askQuestion();
  };

  function fillTaskForm() {
    document.getElementById("taskTitle").value = taskData.title;
    document.getElementById("tags").value = taskData.type;
    document.getElementById("taskDescription").value = taskData.description;
    closeSpeechModal();
    handleSubmit();
  }

  function closeSpeechModal() {
    overlay.style.display = "none";
    modal.style.display = "none";
    micButton.innerHTML = '<i class="fas fa-microphone"></i>';
    micButton.classList.remove("active");
    isListening = false;
    recognition.abort();
    window.speechSynthesis.cancel();
  }

  recognition.onerror = function (event) {
    console.error("Speech recognition error: ", event.error);
    speakMessage("There was an error with speech recognition. Please try again.", closeSpeechModal);
  };
});


