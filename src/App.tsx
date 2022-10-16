import React, { useState, useEffect } from "react";
import "./App.scss";
import Axios from "axios";

function App() {
  interface Todos {
    id?: number;
    todoTitle: string;
    todoDesc: string;
  }
  const [todoTitle, setTodoTitle] = useState("");
  const [todoDescription, setTodoDescription] = useState("");
  const [todoList, setTodoList] = useState<Todos[]>([]);
  const [newTodoDesc, setNewTodoDesc] = useState({
    id: 0,
    newTodoDesc: "",
  });

  const getTodo = () => {
    Axios.get("http://localhost:3001/api/get").then((response) => {
      console.log(response);
      setTodoList(response.data);
    });
  };
  const submitTodo = () => {
    Axios.post("http://localhost:3001/api/insert", {
      todoTitle: todoTitle,
      todoDescription: todoDescription,
    }).then(() => {
      setTodoList([
        ...todoList,
        { todoTitle: todoTitle, todoDesc: todoDescription },
      ]);
      getTodo();
    });
  };
  const deleteTodo = (id: number) => {
    Axios.delete(`http://localhost:3001/api/delete/${id}`).then(() => {
      getTodo();
    });
  };
  const updateTodo = (id: number) => {
    if (newTodoDesc.newTodoDesc !== "" && id === newTodoDesc.id) {
      Axios.put(`http://localhost:3001/api/update/`, {
        id: id,
        updatedDesc: newTodoDesc.newTodoDesc,
      }).then(() => {
        getTodo();
        setNewTodoDesc({ id: 0, newTodoDesc: "" });
      });
    }
  };
  useEffect(() => {
    getTodo();
  }, []);
  return (
    <div className="App">
      <h1>TODO MVP</h1>
      <div className="form">
        <label>Title</label>
        <input
          type="text"
          name="title"
          onChange={(e) => {
            setTodoTitle(e.target.value);
          }}
        />
        <label>Description</label>
        <input
          type="text"
          name="description"
          onChange={(e) => {
            setTodoDescription(e.target.value);
          }}
        />
        <button
          onClick={() => {
            submitTodo();
          }}
        >
          Submit
        </button>
        {todoList.map((val) => {
          return (
            <div className="card" key={val.id}>
              <h1>{val.todoTitle}</h1>
              <p>{val.todoDesc}</p>
              <button
                onClick={() => {
                  deleteTodo(val.id as number);
                }}
              >
                Delete
              </button>
              <input
                type="text"
                id="upadteInput"
                onChange={(e) => {
                  setNewTodoDesc({
                    id: val.id as number,
                    newTodoDesc: e.target.value,
                  });
                }}
              />
              <button
                onClick={() => {
                  updateTodo(val.id as number);
                }}
              >
                Update
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
