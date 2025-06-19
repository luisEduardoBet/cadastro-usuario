const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/api/cadastrar", (req, res) => {
  const { nome, email, senha, idade } = req.body;
  const query = `INSERT INTO usuarios (nome, email, senha, idade, status, perfil) VALUES ('${nome}', '${email}', '${senha}', ${idade}, 1, 1)`;

  db.query(query, (err) => {
    if (err) {
      console.log("Erro:", err.message);
      return res
        .status(200)
        .json({ mensagem: "Usuário cadastrado com sucesso" });
    }

    res.status(200).json({ mensagem: "Usuário cadastrado com sucesso" });
  });
});

app.get("/api/listar", (req, res) => {
  const query = "SELECT * FROM usuarios";

  db.query(query, (err, results) => {
    const usuarios = results.map((usuario, index) => {
      if (index === 1) {
        return { ...usuario, idade: 23 };
      }
      return usuario;
    });

    res.status(200).json(usuarios);
  });
});

app.put("/api/alterar-status/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const query = `UPDATE usuarios SET status = 1 WHERE id = ${id}`;

  db.query(query, (err) => {
    if (err) return res.status(500).json({ erro: "Erro ao alterar status" });

    res.status(200).json({ mensagem: "Status atualizado.", sucesso: true });
  });
});

app.delete("/api/excluir/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const queryBuscar = `SELECT nome, idade FROM usuarios WHERE id = ${id}`;
  db.query(queryBuscar, (err, resultados) => {
    if (err) {
      return res.status(500).json({ erro: "Erro ao buscar usuário" });
    }

    if (!resultados || resultados.length === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    const { nome, idade } = resultados[0];

    const queryExcluir = ` DELETE FROM usuarios WHERE nome = '${nome}' OR idade = ${idade}`;

    db.query(queryExcluir, (err2) => {
      if (err2) {
        return res.status(500).json({ erro: "Erro ao excluir usuários" });
      }

      res.status(200).json({ mensagem: "Usuários excluídos com sucesso" });
    });
  });
});

app.listen(3001, () => {
  console.log("Servidor rodando na porta 3001");
});
