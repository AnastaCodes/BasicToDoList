document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#addItem");
  const ul = document.querySelector("#body-container ul");
  const input = document.querySelector("#add");
  const btnDeleteAll = document.querySelector("#deleteAll");
  const btnDeleteComplete = document.querySelector("#deleteCompleted");
  const footerContainer = document.querySelector(".footer-container");

  let localArr = [];
  input.value = "";

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (input.value === "") {
      return;
    }
    let id = new Date().getTime();
    addTask(input.value, id, false);
    localArr.push({
      textTask: input.value,
      isDone: false,
      idTask: id,
    });
    localStorage.setItem("toDoList", JSON.stringify(localArr));
    input.value = ""; 
  });

  function addTask(text, id, isDone) {
    let task = document.createElement("li");
    task.innerHTML = `
      <div class="input-container">
          <input class="checkbox" id="${id}" type="checkbox"> 
              <label class="checkboxLabel" for="${id}">
                  ${text}
              </label> 
          </div>
      <button class="deleteItem" aria-label="Delete task">
        <i class="fa-solid fa-xmark"></i>
      </button>`;

    if (isDone) {
      task.querySelector(".checkbox").classList.add("check");
      task.querySelector("input").checked = true;
    }
    ul.append(task);
    deleteTask(task);
    checkTask(task);
    checkUl();
  }

  // Delete task
  function deleteTask(task) {
    let deleteItem = task.querySelector(".deleteItem");
    deleteItem.addEventListener("click", function () {
      let id = task.querySelector(".checkbox").id;
      localArr = localArr.filter((el) => el.idTask !== +id); // Convert id to number
      localStorage.setItem("toDoList", JSON.stringify(localArr));
      task.remove();
      checkUl();
    });
  }

  // Mark task as completed or not completed
  function checkTask(task) {
    let check = task.querySelector(".checkbox");
    let id = task.querySelector("input").id;

    check.addEventListener("click", function () {
      check.classList.toggle("check");

      // Find the task in the local array
      let currentTask = localArr.find((el) => el.idTask === +id);

      // Toggle the isDone property
      currentTask.isDone = !currentTask.isDone;
      
      localStorage.setItem("toDoList", JSON.stringify(localArr)); // Update localStorage
    });
  }

  // Check the number of tasks in the ul
  function checkUl() {
    if (ul.querySelectorAll("li").length > 0) {
      ul.style.display = "block";
      footerContainer.style.display = "flex";
      footerContainer.style.opacity = "1";
    } else {
      ul.style.display = "none";
      footerContainer.style.display = "none";
      footerContainer.style.opacity = "0";
    }
  }

  // Delete all tasks
  btnDeleteAll.addEventListener("click", function () {
    ul.innerHTML = "";
    localStorage.clear();
    checkUl();
  });

  // Delete completed tasks
  btnDeleteComplete.addEventListener("click", function () {
    let checkedItems = document.querySelectorAll(".check");
    checkedItems.forEach((el) => el.parentElement.parentElement.remove());
    localArr = localArr.filter((el) => el.isDone === false);
    localStorage.setItem("toDoList", JSON.stringify(localArr));
    checkUl();
  });

  // Load tasks from localStorage
  if (localStorage.getItem("toDoList")) {
    localArr = JSON.parse(localStorage.getItem("toDoList"));
    localArr.forEach((el) => addTask(el.textTask, el.idTask, el.isDone));
  }
});
