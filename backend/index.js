const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./db").default;

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/SignUp", (req, res) => {

  const { nome, email, cpf, senha, idade, perfil } = req.body;
  const query = `INSERT INTO usuario (nome, email,cpf, senha, idade, perfil) VALUES ('${nome}', '${email}', '${cpf}', '${senha}', ${idade}, ${perfil})`;

  db.query(query, (err) => {
    if (err) {
      return res.status(500).json({sucesso: false, mensagem: "Algo deu Errado!!"});
    } 
    return res.status(200).json({sucesso: true, mensagem: "Usuario Cadastrado"});

  });
});


app.get("/", (req, res) => {

  const query = "SELECT * FROM usuario";
  db.query(query, (err, result) => {
    return res.status(200).json(result);

  });
});




app.put("/", (req, res) => {

  const {id, status} = req.body;
  const query = `UPDATE usuario SET status = ${status} WHERE id = ${id}`;

  db.query(query, (err, result) => {
    if (err) return res.status(500).json({ erro: "Erro ao alterar status" });

    return res.status(200).json({ mensagem: "Status atualizado."});

  });
});

app.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
 
  const queryExcluir = `DELETE FROM usuario WHERE id = ${id}`;
  

  db.query(queryExcluir, (err) => {
    if (err) {
      return res.status(500).json({ erro: "Erro ao excluir usuario" });
    }
    return res.status(200).json({ mensagem: "Usuário excluído com sucesso"});
    });
});


app.listen(3001, () => {
  console.log("Servidor rodando na porta 3001");

});