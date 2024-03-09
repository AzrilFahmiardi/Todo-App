document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("form");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addTodo();
  });

  const todos = [];
  const RENDER_EVENT = "render-todo";
  document.addEventListener(RENDER_EVENT, function () {
    console.log(todos);

    const unCompletedTask = document.getElementById("todos");
    unCompletedTask.innerHTML = "";

    const CompletedTask = document.getElementById("todos-completed");
    CompletedTask.innerHTML = "";

    for (const todoItem of todos) {
      const todoELement = makeTodo(todoItem);
      if (!todoItem.isCompleted) {
        unCompletedTask.append(todoELement);
      } else {
        CompletedTask.append(todoELement);
      }
    }
  });

  function addTodo() {
    const title = document.getElementById("title").value;
    const timeStamp = document.getElementById("date").value;

    const generatedID = generateID();

    const generatedObjectTodo = generateObjectTodo(generatedID, title, timeStamp, false);
    todos.push(generatedObjectTodo);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function generateID() {
    return +new Date();
  }

  function generateObjectTodo(ID, task, timeStamp, isCompleted) {
    return {
      ID,
      task,
      timeStamp,
      isCompleted,
    };
  }

  function makeTodo(todoObject) {
    const title = document.createElement("h2");
    title.innerHTML = todoObject.task;
    const timeStamp = document.createElement("p");
    timeStamp.innerHTML = todoObject.timeStamp;

    const textContainer = document.createElement("div");
    textContainer.classList.add("inner");
    textContainer.append(title, timeStamp);

    const container = document.createElement("div");
    container.append(textContainer);
    container.classList.add("shadow", "item");
    container.setAttribute("id", `${todoObject.ID}`);

    if (todoObject.isCompleted) {
      const undoButton = document.createElement("button");
      undoButton.classList.add("undo-button");

      undoButton.addEventListener("click", function () {
        undoTaskFromCompleted(todoObject.ID);
      });

      const trashButton = document.createElement("button");
      trashButton.classList.add("trash-button");

      trashButton.addEventListener("click", function () {
        removeTaskFromCompleted(todoObject.ID);
      });

      container.append(undoButton, trashButton);
    } else {
      const checkButton = document.createElement("button");
      checkButton.classList.add("check-button");

      checkButton.addEventListener("click", function () {
        addTaskToCompleted(todoObject.ID);
      });

      container.append(checkButton);
    }

    return container;
  }

  function addTaskToCompleted(todoObject) {
    const todoTarget = find(todoObject);

    if (todoTarget === null) {
      return;
    }

    todoTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function undoTaskFromCompleted(todoObject) {
    const todoTarget = find(todoObject);

    if (todoTarget === null) {
      return;
    }

    todoTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function removeTaskFromCompleted(todoObject) {
    const todoTargetIndex = findIndex(todoObject);

    if (todoTargetIndex === -1) {
      return;
    }

    todos.splice(todoTargetIndex, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function find(todoObject) {
    for (const todositem of todos) {
      if (todositem.ID === todoObject) {
        return todositem;
      }
    }

    return null;
  }

  function findIndex(todoObject) {
    for (const index in todos) {
      if (todos[index].ID === todoObject) {
        return index;
      }
    }
    return -1;
  }

  const storageKey = "TODO_APPS";
  const dataSaved = "SAVE_DATA";

  function isStorageExist() {
    if (typeof Storage === "undefined") {
      alert("Browser anda tidak mendukung web storage");
      return false;
    }
    return true;
  }

  function saveData() {
    if (isStorageExist) {
      localStorage.setItem(storageKey, JSON.stringify(todos));

      document.dispatchEvent(new Event(dataSaved));
    }
  }

  document.addEventListener(dataSaved, function () {
    console.log("DATA SAVED");
  });

  function loadData() {
    let data = localStorage.getItem(storageKey);
    let parsed = JSON.parse(data);
    if (parsed !== null) {
      for (const data of parsed) {
        todos.push(data);
      }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  if (isStorageExist) {
    loadData();
  }
});
