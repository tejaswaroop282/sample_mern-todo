import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL || "";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");

  const load = () => fetch(`${API}/api/todos`).then((r) => r.json()).then(setTodos);
  useEffect(() => {
    load();
  }, []);

  const add = async (e) => {
    e.preventDefault();
    await fetch(`${API}/api/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    setTitle("");
    load();
  };
  const toggle = (id) => fetch(`${API}/api/todos/${id}`, { method: "PATCH" }).then(load);
  const remove = (id) => fetch(`${API}/api/todos/${id}`, { method: "DELETE" }).then(load);

  return (
    <main>
      <h1>Todos</h1>
      <form onSubmit={add}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What needs doing?" />
        <button type="submit">Add</button>
      </form>
      <ul>
        {todos.map((t) => (
          <li key={t._id}>
            <label>
              <input type="checkbox" checked={t.done} onChange={() => toggle(t._id)} /> {t.title}
            </label>
            <button onClick={() => remove(t._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
