const { test, before, after } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const request = require("supertest");
const { createApp } = require("../src/app");
const Todo = require("../src/models/Todo");

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/todo_test";
const app = createApp();

before(async () => {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  await Todo.deleteMany({});
});

after(async () => {
  await Todo.deleteMany({});
  await mongoose.disconnect();
});

test("health check responds ok", async () => {
  const res = await request(app).get("/health");
  assert.strictEqual(res.status, 200);
  assert.deepStrictEqual(res.body, { status: "ok" });
});

test("creates and lists a todo", async () => {
  const created = await request(app).post("/api/todos").send({ title: "write tests" });
  assert.strictEqual(created.status, 201);
  assert.strictEqual(created.body.done, false);
  const list = await request(app).get("/api/todos");
  assert.strictEqual(list.body.length, 1);
  assert.strictEqual(list.body[0].title, "write tests");
});

test("rejects an empty title", async () => {
  const res = await request(app).post("/api/todos").send({ title: "   " });
  assert.strictEqual(res.status, 400);
});

test("toggles and deletes a todo", async () => {
  const { body } = await request(app).post("/api/todos").send({ title: "toggle me" });
  const toggled = await request(app).patch(`/api/todos/${body._id}`);
  assert.strictEqual(toggled.body.done, true);
  const removed = await request(app).delete(`/api/todos/${body._id}`);
  assert.strictEqual(removed.status, 204);
  const missing = await request(app).delete(`/api/todos/${body._id}`);
  assert.strictEqual(missing.status, 404);
});
