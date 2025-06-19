import React, { useState, useEffect } from "react";
import "./index.css";

function App() {
  const [form, setForm] = useState({ nome: "", email: "", senha: "", idade: "", perfil: "1", });
  const [resposta, setResposta] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [modulo, setModulo] = useState("listar");
  const [erros, setErros] = useState({});
  const [filtroIdade, setFiltroIdade] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");

  useEffect(() => {
    if (modulo === "listar") {
      listarUsuarios();
    }
  }, [modulo]);

  useEffect(() => {
    if (modulo === "listar") {
      listarUsuarios();
    }
  }, [filtroIdade, filtroStatus]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const novosErros = {};
    if (!form.nome.trim()) novosErros.nome = true;
    if (!form.email.trim()) novosErros.email = true;

    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      return;
    }

    setErros({});

    const response = await fetch("http://localhost:3001/api/cadastrar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await response.json();
    setResposta(data);
    setForm({ nome: "", email: "", senha: "", idade: "" });
  };

  const listarUsuarios = async () => {
    const response = await fetch("http://localhost:3001/api/listar");
    const data = await response.json();

    let filtrados = data;

    if (filtroIdade.trim() !== "") {
      const idadeMax = parseInt(filtroIdade) + 1;
      filtrados = filtrados.filter((usuario) => usuario.idade <= idadeMax);
    }

    if (filtroStatus !== "todos") {
      const status = filtroStatus === "ativo" ? 1 : 0;
      filtrados = filtrados.filter((usuario) => usuario.status === status);
    }

    setUsuarios(filtrados);
  };

  const alterarStatus = async (id, statusAtual) => {
    const novosUsuarios = usuarios.map((usuario) =>
      usuario.id === id
        ? { ...usuario, status: usuario.status === 1 ? 0 : 1 }
        : usuario
    );
    setUsuarios(novosUsuarios);

    await fetch(`http://localhost:3001/api/alterar-status/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
  };

  const excluirUsuario = async (id) => {
    await fetch(`http://localhost:3001/api/excluir/${id}`, {
      method: "DELETE",
    });

    listarUsuarios();
  };

  return (
    <div className="container">
      <div className="nav-buttons">
        <button onClick={() => setModulo("listar")}>Listar</button>
        <button onClick={() => setModulo("cadastrar")}>Cadastrar</button>
      </div>

      {modulo === "cadastrar" && (
        <>
          <h2>Cadastro de Usuário</h2>
          <form onSubmit={handleSubmit}>
            <label>Nome<span className="obrigatorio">*</span></label>
            <input type="text" name="nome" placeholder="Nome completo" value={form.nome} onChange={handleChange} className={erros.nome ? "erro" : ""}/>

            <label>Email <span className="obrigatorio">*</span></label>
            <input type="text" name="email" placeholder="Email" value={form.email} onChange={handleChange} className={erros.email ? "erro" : ""}/>

            <label>Senha <span className="obrigatorio">*</span></label>
            <input type="password" name="senha" placeholder="Senha" value={form.senha} onChange={handleChange} className={erros.senha ? "erro" : ""}/>

            <label>Idade</label>
            <input type="number" name="idade" placeholder="Idade" value={form.idade} onChange={handleChange}/>

            <label>Perfil</label>
            <select name="perfil" value={form.perfil} onChange={handleChange}>
              <option value="0">Admnistrador</option>
              <option value="1">Usuário</option>
            </select>

            <button type="submit">Salvar</button>
          </form>

          {resposta && (
            <div className="mensagem">
              <p>{resposta.mensagem}</p>
            </div>
          )}
        </>
      )}

      {modulo === "listar" && (
        <>
          <h2>Usuários Cadastrados</h2>
          <div className="filtros">
            <label>
              Idade máxima:
              <input className="campo-filtros" type="number" value={filtroIdade} onChange={(e) => setFiltroIdade(e.target.value)}/>
            </label>

            <label>
              Status:
              <select className="campo-filtros" value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
                <option value="todos">Todos</option>
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>
            </label>
          </div>

          {usuarios.length === 0 ? (
            <p>Nenhum usuário cadastrado.</p>
          ) : (
            <table className="tabela-usuarios">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Idade</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.id}>
                    <td>{usuario.nome}</td>
                    <td>{usuario.email}</td>
                    <td>{usuario.idade}</td>
                    <td>
                      <span className={`status-icon ${usuario.status ? "ativo" : "inativo"}`} onClick={() => alterarStatus(usuario.id, usuario.status)}>
                        {usuario.status ? "✔️" : "❌"}
                      </span>
                    </td>
                    <td>
                      <span className="icone-excluir" onClick={() => excluirUsuario(usuario.id)} title="Excluir usuário">
                        🗑️
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}

export default App;
