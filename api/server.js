const express = require("express");
const morgan = require("morgan");

const db = require("../data/dbConfig.js");

const server = express();

server.use(morgan("dev"));
server.use(express.json());

server.get("/api/accounts", (req, res) => {
  db.select("*")
    .from("accounts")
    .then(accounts => {
      res.status(200).json(accounts);
    })
    .catch(err => {
      res.status(500).json({ message: err.message });
    });
});

server.get("/api/accounts/:id", (req, res) => {
  const { id } = req.params;
  db.select("*")
    .from("accounts")
    .where("id", id)
    .first()
    .then(account => {
      res.status(200).json(account);
    })
    .catch(err => {
      res.status(500).json({ message: err.message });
    });
});

server.post("/api/accounts", (req, res) => {
  const request = req.body;
  db.insert({ name: request.name, budget: request.budget })
    .into("accounts")
    .then(async response => {
      const account = await db
        .select("*")
        .from("accounts")
        .where("id", response)
        .first();
      res.status(201).json(account);
    })
    .catch(err => {
      res.status(500).json({ message: err.message });
    });
});

server.put("/api/accounts/:id", (req, res) => {
  const request = req.body;
  const { id } = req.params;
  db("accounts")
    .where("id", id)
    .update({ name: request.name, budget: request.budget })
    .then(response => {
      res.status(200).json({ message: "account updated" });
    })
    .catch(err => {
      res.status(500).json({ message: err.message });
    });
});

server.delete("/api/accounts/:id", (req, res) => {
  const { id } = req.params;
  db("accounts")
    .where("id", id)
    .del()
    .then(response => {
      res.status(200).json({ message: "account deleted" });
    })
    .catch(err => {
      res.status(500).json({ message: err.message });
    });
});

module.exports = server;
