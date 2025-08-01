import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "../static/index.css";
import "../static/home.css";

function Home() {
  const [usuarios, setUsuarios] = useState([]);
  const [filtroIdade, setFiltroIdade] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");


  useEffect(() => {
    listarUsuarios();
   }, [filtroIdade, filtroStatus]);



  const listarUsuarios = async () => {
    const response = await fetch("http://localhost:3001/");
    const data = await response.json();


    let filtrados = data;

    if (filtroIdade.trim() !== "") {
      const idadeMax = parseInt(filtroIdade);
      filtrados = filtrados.filter((usuario) => usuario.idade <= idadeMax);
    }

    if (filtroStatus !== "todos") {
      const status = filtroStatus === "ativo" ? 1 : 0;
      filtrados = filtrados.filter((usuario) => usuario.status === status);
    }

    setUsuarios(filtrados);
    
  };

   const alterarStatus = async (id, statusAtual) => {
    
    let status =  statusAtual === 1 ? 0 : 1;

    console.log(status, statusAtual);

    usuarios.forEach(usuario => {
        if (usuario.id === id) 
            usuario.status = status;
        });

    await fetch(`http://localhost:3001/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({id: id, status: status})
    });

    listarUsuarios();
  };


  const excluirUsuario = async (id) => {
    await fetch(`http://localhost:3001/${id}`, {
      method: "DELETE",
    });
    listarUsuarios();
};


  return (
    <div className="container2">
      <div className="nav-buttons">
        <Link to="/">
          <button>Listar</button>
        </Link>
        <Link to="/SignUp">
          <button>Cadastrar</button>
        </Link>
      </div>
      <>
        <h2>Usuários Cadastrados</h2>
        <div className="filtros">
          <label>
            Idade máxima:
            <input
              className="campo-filtros"
              type="number"
              value={filtroIdade}
              onChange={(e) => setFiltroIdade(e.target.value)}
            />
          </label>

          <label>
            Status:
            <select
              className="campo-filtros"
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
            >
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
                <th>CPF</th>
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
                  <td>{usuario.cpf}</td>
                  <td>{usuario.email}</td>
                  <td>{usuario.idade}</td>
                  <td>
                    <span
                      className={`status-icon ${
                        usuario.status ? "ativo" : "inativo"
                      }`}
                    onClick={() => alterarStatus(usuario.id, usuario.status)}
                    >
                      {usuario.status ? "✔️" : "❌"}
                    </span>
                  </td>
                  <td>
                    <span
                      className="icone-excluir"
                      onClick={() => excluirUsuario(usuario.id)}
                      title="Excluir usuário"
                    >
                      🗑️
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </>
    </div>
  );
}

export default Home;
