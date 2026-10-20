const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Todo = require("./models/Todo");

function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/health", (req, res) => res.json({ status: "ok" }));

  app.get("/api/todos", async (req, res) => {
    res.json(await Todo.find().sort({ createdAt: -1 }));
  });

  app.post("/api/todos", async (req, res) => {
    const title = String(req.body.title || "").trim();
    if (!title) return res.status(400).json({ error: "title is required" });
    res.status(201).json(await Todo.create({ title }));
  });

  app.patch("/api/todos/:id", async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ error: "not found" });
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ error: "not found" });
    todo.done = !todo.done;
    res.json(await todo.save());
  });

  app.delete("/api/todos/:id", async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ error: "not found" });
    const result = await Todo.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: "not found" });
    res.status(204).end();
  });

  return app;
}

module.exports = { createApp };
