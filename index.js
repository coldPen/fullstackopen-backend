const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();
app.use(cors());

morgan.token("post-data", (req, res) => JSON.stringify(req.body));

app.use(
  express.json(),
  morgan((tokens, req, res) => {
    const tokenList = [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
    ];

    if (req.method === "POST") tokenList.push(tokens["post-data"](req, res));

    return tokenList.join(" ");
  })
);

let persons = [
  {
    name: "Louriette Jambier",
    number: "0123456756",
    id: 1,
  },
  {
    name: "Flontang Carnoulde",
    number: "0961734563",
    id: 2,
  },
  {
    name: "Dilyanne Rontaulque",
    number: "0845176487",
    id: 3,
  },
  {
    name: "Fouettard Bourfousier",
    number: "0861547839",
    id: 4,
  },
  {
    name: "Carchiasse Remplace",
    number: "0456176472",
    id: 5,
  },
  {
    name: "Edgar Pouillenski",
    number: "0987654321",
    id: 7,
  },
  {
    name: "Lourion Ladacrecausse",
    number: "0512765628",
    id: 8,
  },
];

app.get("/info", (req, res) => {
  res.send(`
        <div>Phonebook has info for ${persons.length} people</div>
        <br/>
        <div>${new Date()}</div>
    `);
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

const generateId = () => Math.floor(Math.random() * 10000);

const error = (response, message) =>
  response.status(400).json({ error: message });

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name) {
    error(res, "name is missing");
  }
  if (!body.number) {
    error(res, "number is missing");
  }

  if (persons.map((person) => person.name).includes(body.name)) {
    error(res, "name must be unique");
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  persons = persons.concat(person);

  res.json(person);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);

  res.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
