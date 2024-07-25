// GLOBAL VARIABLES
let modalDisplay = false;
let changeUsernameDisplay = false;
let newTaskWindowDisplay = false;
let firstLoad = false;
let currentSelectedTask;

// COUNTER UPDATE
if (localStorage.tasksArray) updateCounter();

//DOM ELEMENTS
let labelFinishAllTasks = document.getElementById("finish-all-tasks");
let labelDeleteAllTasks = document.getElementById("delete-all-tasks");
let labelAboutModal = document.getElementById("about-modal");
let labelOverlay = document.getElementById("overlay");
let labelAboutText = document.getElementById("about-text");
let labelUsernameModal = document.getElementById("change-name-modal");
let labelNewTaskWindow = document.getElementById("new-task-window");
let labelNewTaskText = document.getElementById("new-task-menu-text");
let labelNoDeadline = document.getElementById("dont-specify-deadline");
let labelRoot = document.documentElement;
let inputDeadline = document.getElementById("input-deadline");
const deadlineCheckbox = document.getElementById("deadline-checkbox");
const btnAddNewTask = document.getElementById("btn-add-task");
const btnCloseModal = document.getElementById("close-modal");
const btnConfirmUsername = document.getElementById("confirm-username");
const btnCancelUsername = document.getElementById("close-username-modal");
const btnConfirmAddTask = document.getElementById("confirm-add-task");
const btnCancelNewTask = document.getElementById("cancel-add-task");
const btnConfirmEditTask = document.getElementById("confirm-edit-task");
const btnCancelEditTask = document.getElementById("cancel-edit-task");

// EVENT HANDLERS
labelFinishAllTasks.addEventListener("click", finishAllTasks);
labelDeleteAllTasks.addEventListener("click", deleteAllTasks);
btnCloseModal.addEventListener("click", toggleAboutModal);
deadlineCheckbox.addEventListener("click", DeadlineCheckbox);
btnAddNewTask.addEventListener("click", toggleNewTaskWindow);
btnCancelNewTask.addEventListener("click", closeNewTaskWindow);
btnConfirmAddTask.addEventListener("click", addNewTask);
btnConfirmEditTask.addEventListener("click", confirmEditTask);
btnCancelEditTask.addEventListener("click", cancelEditTask);

//FUNCTIONS
function openMobileMenu() {
  const navOptions = document.getElementById("navOptions");
  if (navOptions.style.display === "block") navOptions.style.display = "none";
  else navOptions.style.display = "block";
}

function notification(english) {
  let notif = document.getElementById("notification");
  notif.style.opacity = "100";
  notif.innerHTML = `<p>${english}</p>`;
  setTimeout(function () {
    notif.style.opacity = "0";
  }, 2000);
}

function getDate(format) {
  let date = new Date();
  let day = date.getDate();
  let month = date.getMonth();
  month++;
  let year = date.getFullYear();
  if (format === "iso")
    return month > 9 ? `${year}-${month}-${day}` : `${year}-0${month}-${day}`;
  else
    return month > 9 ? `${day}.${month}.${year}` : `${day}.0${month}.${year}`;
}

function getDeadline(deadlineInput) {
  let tempStr = deadlineInput.split("-");
  let str = `${tempStr[2]}.${tempStr[1]}.${tempStr[0]}`;
  return str;
}

function toggleNewTaskWindow(e) {
  e.preventDefault();
  if (localStorage["no-deadline"]) localStorage.removeItem("no-deadline");
  document.querySelector(".task-log-msg").innerHTML = ``;
  let taskDescription = document.getElementById("new-task-desc");
  taskDescription.value = "";
  if (!newTaskWindowDisplay) {
    labelNewTaskWindow.classList.remove("hidden");
    labelOverlay.classList.remove("hidden");
    let today = getDate("iso");
    inputDeadline.setAttribute("value", `${today}`);
    inputDeadline.setAttribute("min", `${today}`);
    document.getElementById("new-task-desc").focus();
    newTaskWindowDisplay = true;
  }
}

function closeNewTaskWindow(e) {
  e.preventDefault();
  labelNewTaskWindow.classList.add("hidden");
  labelOverlay.classList.add("hidden");
  newTaskWindowDisplay = false;
}

function DeadlineCheckbox() {
  if (this.checked) {
    localStorage.setItem("no-deadline", "true");
    inputDeadline.disabled = true;
  } else {
    localStorage.removeItem("no-deadline");
    inputDeadline.disabled = false;
  }
}

function addNewTask(e) {
  e.preventDefault();
  let taskDescription = document.getElementById("new-task-desc");
  taskDescription = taskDescription.value.trim();
  if (taskDescription.length >= 5) {
    let deadlineInput = document.getElementById("input-deadline");
    deadlineInput = deadlineInput.value;
    let deadline = getDeadline(deadlineInput);
    let task = new TaskConstructor(taskDescription, deadline);
    let tasksArray = JSON.parse(localStorage.getItem("tasksArray"));
    tasksArray.push(task);
    localStorage.setItem("tasksArray", JSON.stringify(tasksArray));
    let container = document.getElementById("tasklist-container");
    container.innerHTML = ``;
    updateTasks();
    updateCounter();
    closeNewTaskWindow(e);
    sortTasks();
  } else {
      document.querySelector(
        ".task-log-msg"
      ).innerHTML = `<i class="fas fa-exclamation-circle"></i> The task description must be at least 5 (five) letters long.`;
    }
  }

function TaskConstructor(input, deadline) {
  (this.index = document.querySelector(
    ".tasklist-container"
  ).childElementCount),
    (this.task = input),
    (this.status = "unfinished"),
    (this.date = getDate()),
    (this.deadline = localStorage["no-deadline"] ? false : deadline);
}

function updateTasks() {
  let tasksArray = JSON.parse(localStorage.getItem("tasksArray"));
  tasksArray.forEach((task) => {
    let container = document.getElementById("tasklist-container");
    let div = document.createElement("div");
    div.classList.add("task-container");
    if (task.status === "finished") {
      div.classList.add("task-confirmed");
    } else {
      div.classList.remove("task-confirmed");
    }
    div.innerHTML = `<div class="task-desc flex-col">
    <h5 class="task-text">${task.task}</h5>    
        <span  class="task-deadline">
        <i class="far fa-clock"></i> ${task.date} ${
      task.deadline === false
        ? ""
        : '<i class="fas fa-flag-checkered"></i> ' + task.deadline
    }       
        </span>    
    </div>


</div>

<div class="task-controls">
    <div>      
      <button class="btn btn-success btn-finish-task">
        <i class="fas fa-check"></i>
      </button>
      <button class="btn btn-primary btn-edit-task">
        <i class="fas fa-pen"></i>
      </button>
      <button class="btn btn-danger btn-delete-task">
        <i class="far fa-trash-alt"></i>
      </button>
    </div>        
</div>
</div>`;

    container.appendChild(div);
    const btnFinishTask = document.querySelectorAll(".btn-finish-task");
    for (let i = 0; i < btnFinishTask.length; i++) {
      btnFinishTask[i].addEventListener("click", finishTask);
    }
    const btnEditTask = document.querySelectorAll(".btn-edit-task");
    for (let i = 0; i < btnFinishTask.length; i++) {
      btnEditTask[i].addEventListener("click", editTask);
    }
    const btnDeleteTask = document.querySelectorAll(".btn-delete-task");
    for (let i = 0; i < btnFinishTask.length; i++) {
      btnDeleteTask[i].addEventListener("click", deleteTask);
    }
  });
}

function finishTask() {
  setTimeout(() => {
    if (localStorage.taskOrder) sortTasks();
  }, 400);

  const tmp = this.parentNode.parentNode.parentNode.firstChild.textContent
    .trim()
    .split("  ");
  const taskToConfirm = tmp[0];
  const tempTasksArray = JSON.parse(localStorage.getItem("tasksArray"));
  tempTasksArray.forEach((obj) => {
    if (obj.task === taskToConfirm) {
      if (obj.status === "unfinished") {
        obj.status = "finished";
        this.parentNode.parentNode.parentNode.classList.add("task-confirmed");
        notification(`Task ${obj.task} marked as finished.`)
      } else {
        obj.status = "unfinished";
        this.parentNode.parentNode.parentNode.classList.remove(
          "task-confirmed");
        notification(`Task ${obj.task} marked as unfinished.`);

      }
    }
  });
  localStorage.setItem("tasksArray", JSON.stringify(tempTasksArray));
  updateCounter();
}

function finishAllTasks() {
  const tempTasksArray = JSON.parse(localStorage.getItem("tasksArray"));
  tempTasksArray.forEach((task) => {
    if (task.status === "unfinished") task.status = "finished";
  });
  localStorage.setItem("tasksArray", JSON.stringify(tempTasksArray));
  document.getElementById("tasklist-container").innerHTML = ``;
  updateTasks();
  updateCounter();
  openMobileMenu();
  notification(
    "All tasks marked as finished."
  );
}

function editTask() {
  const tmp = this.parentNode.parentNode.parentNode.firstChild.textContent
    .trim()
    .split("  ");
  const taskToEdit = tmp[0];
  const tempTasksArray = JSON.parse(localStorage.getItem("tasksArray"));
  tempTasksArray.forEach((obj) => {
    if (obj.task === taskToEdit) {
      currentSelectedTask = obj.task;
      toggleEditTaskWindow(currentSelectedTask);
    }
  });
}

function toggleEditTaskWindow(currentSelectedTask) {
  document.querySelector(".edit-log-msg").innerHTML = ``;
  const editTaskWindow = document.getElementById("edit-task-window");
  if (editTaskWindow.classList.contains("hidden")) {
    window.setTimeout(function () {
      document.getElementById("edit-task-desc").focus();
      document.getElementById("edit-task-desc").value = ``;
    }, 0);
    editTaskWindow.classList.remove("hidden");
    labelOverlay.classList.remove("hidden");
    document.getElementById("edit-task-text").textContent = "Edit task";
    document.getElementById(
      "previous-task-desc"
    ).textContent = `${currentSelectedTask}`;
  } else {
    editTaskWindow.classList.add("hidden");
    labelOverlay.classList.add("hidden");
  }
}

function confirmEditTask(e) {
  e.preventDefault();
  let input = document.getElementById("edit-task-desc").value;
  if (input.length >= 5) {
    const tempTasksArray = JSON.parse(localStorage.getItem("tasksArray"));

    tempTasksArray.forEach((obj) => {
      if (obj.task === currentSelectedTask) {
        notification(
          `Task '${obj.task}' changed to '${input}'`
        );
        obj.task = `${input}`;
      }
    });
    localStorage.setItem("tasksArray", JSON.stringify(tempTasksArray));
    let container = document.getElementById("tasklist-container");
    container.innerHTML = ``;
    updateTasks();
    updateCounter();
    toggleEditTaskWindow();
  } else {
    e.preventDefault();
    document.querySelector(
        ".edit-log-msg"
      ).innerHTML = `<i class="fas fa-exclamation-circle"></i> The new task description must be at least 5 (five) letters long.`;
    }
  }

function cancelEditTask(e) {
  e.preventDefault();
  document.getElementById("edit-task-window").classList.add("hidden");
  labelOverlay.classList.add("hidden");
  document.querySelector(".edit-log-msg").innerHTML = "";
}

function deleteTask() {
  const tmp = this.parentNode.parentNode.parentNode.firstChild.textContent
    .trim()
    .split("  ");
  const taskToDelete = tmp[0];
  const tasksAfterRemoval = JSON.parse(
    localStorage.getItem("tasksArray")
  ).filter((obj) => {
    return obj.task !== taskToDelete;
  });
  localStorage.setItem("tasksArray", JSON.stringify(tasksAfterRemoval));
  let container = document.getElementById("tasklist-container");
  container.innerHTML = ``;
  updateTasks();
  updateCounter();
  notification(
    `Task "${taskToDelete}" deleted.`
  );
}

function deleteAllTasks() {
  let tmp = JSON.parse(localStorage.getItem("tasksArray"));
  tmp = [];
  localStorage.setItem("tasksArray", JSON.stringify(tmp));
  document.getElementById("tasklist-container").innerHTML = ``;
  updateTasks();
  updateCounter();
  openMobileMenu();
  notification(
    "All tasks have been deleted."
  );
}

function updateCounter() {
  const tasksArray = JSON.parse(localStorage.getItem("tasksArray"));
  const pendingTasks = tasksArray.filter((task) => {
    return task.status === "unfinished";
  }).length;
  const finishedTasks = tasksArray.filter((task) => {
    return task.status === "finished";
  }).length;
  const allTasks = tasksArray.length;
  document.getElementById("pending-tasks-number").textContent = pendingTasks;
  document.getElementById("finished-tasks-number").textContent = finishedTasks;
  document.getElementById("all-tasks-number").textContent = allTasks;
}


function toggleAboutModal() {
  openMobileMenu();
  if (!modalDisplay) {
    labelAboutModal.classList.remove("hidden");
    labelOverlay.classList.remove("hidden");
    modalDisplay = true;
  } else {
    labelAboutModal.classList.add("hidden");
    labelOverlay.classList.add("hidden");
    modalDisplay = false;
  }
}

function sortTasks(config) {
  let tempTaskArray = JSON.parse(localStorage.getItem("tasksArray"));
  let sortBy;
  if (config === "updateOrder") sortBy = localStorage.taskOrder;
  else {
    sortBy = document.getElementById("filter").value;
    localStorage.setItem("taskOrder", sortBy);
  }

  switch (sortBy) {
    case "oldestFirst":
      tempTaskArray.sort((a, b) => {
        let taskA = a.index;
        let taskB = b.index;
        if (taskA < taskB) return -1;
        else if (taskB > taskA) return 1;
      });
      break;

    case "newestFirst":
      tempTaskArray.sort((a, b) => {
        let taskA = a.index;
        let taskB = b.index;
        if (taskA > taskB) return -1;
        else if (taskB < taskA) return 1;
      });
      break;

    case "pendingFirst":
      tempTaskArray.sort((a, b) => {
        let taskA = a.status;
        let taskB = b.status;
        if (taskA > taskB) return -1;
        else if (taskB < taskA) return 1;
      });
      break;

    case "finishedFirst":
      tempTaskArray.sort((a, b) => {
        let taskA = a.status;
        let taskB = b.status;
        if (taskA < taskB) return -1;
        else if (taskB > taskA) return 1;
      });
      break;

    default:
      break;
  }
  document.getElementById("tasklist-container").innerHTML = ``;
  localStorage.setItem("tasksArray", JSON.stringify(tempTaskArray));
  updateTasks();
}

window.addEventListener("click", () => {
  if (navOptions.style.display === "block") openMobileMenu();
});

document.querySelector(".topnav").addEventListener("click", (e) => {
  e.stopPropagation();
});

(function checkArrayOfTasks() {
  if (!localStorage.tasksArray) {
    let tasksArray = [];
    localStorage.setItem("tasksArray", JSON.stringify(tasksArray));
  } else {
    if (!firstLoad) {
      updateTasks();
      firstLoad = true;
    } else console.log("already LOADED");
  }
})();

(function checkPageConfig() {
    loadPageConfig();
})();


function loadPageConfig() {
  if (localStorage.taskOrder) {
    sortTasks("updateOrder");
    document.getElementById("filter").value = localStorage.taskOrder;
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const logoutButton = document.getElementById('logout');
  if (logoutButton) {
      logoutButton.addEventListener('click', function(event) {
          event.preventDefault();
          window.location.href = '../index.html';
      });
  }
});