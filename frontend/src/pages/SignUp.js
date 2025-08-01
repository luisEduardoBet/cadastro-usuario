import { useState } from "react";
import { Link } from "react-router-dom";
import "../static/index.css";
import "../static/signup.css"


function SignUp(){ 
    
  const [form, setForm] = useState({ nome: "", email: "", cpf: "", senha: "", idade: "", perfil: "0", });
  const [erros, setErros] = useState({});
  const [resposta, setResposta] = useState(null);

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

      const response = await fetch("http://localhost:3001/SignUp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
      });
      
      console.log(response);
      const data = await response.json();

      
      setResposta(data); 

      if (resposta.sucesso){ 
        setForm({ nome: "", email: "", cpf: "", senha: "", idade: "" });
      }

      

    };

  const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };

    return( 

    <div className="container">
      <div className="nav-buttons">
        <Link to="/"> <button>Listar</button> </Link>
        <Link to="/SignUp"><button>Cadastrar</button></Link>
      </div>
      
        <>
          <h2>Cadastro de Usuário</h2>
          <form onSubmit={handleSubmit}>

            <div class="form-set">
              <label>Nome<span className="obrigatorio">*</span></label>
              <input type="text" name="nome" placeholder="Nome completo" value={form.nome} onChange={handleChange} className={erros.nome ? "erro" : ""}/>
            </div>

            <div class="form-set">
              <label>Email <span className="obrigatorio">*</span></label>
              <input type="text" name="email" placeholder="Email" value={form.email} onChange={handleChange} className={erros.email ? "erro" : ""}/>
            </div>

            <div class="form-set"> 

            <label>CPF<span className="obrigatorio">*</span></label>
            <input type="text" name="cpf" placeholder="CPF" value={form.cpf} onChange={handleChange} className={erros.cpf ? "erro" : ""}/>

            </div>

            <div class="form-set">
              <label>Senha <span className="obrigatorio">*</span></label>
              <input type="password" name="senha" placeholder="Senha" value={form.senha} onChange={handleChange} className={erros.senha ? "erro" : ""}/>
            </div>

            <div class="form-set">
              <label>Idade</label>
              <input type="number" name="idade" placeholder="Idade" value={form.idade} onChange={handleChange}/>
            </div>

            <div class="form-set">
            
              <label>Perfil</label>
              <select name="perfil" value={form.perfil} onChange={handleChange}>
                <option value="1">Admnistrador</option>
                <option value="0">Usuário</option>
              </select>
            </div>

            <button class="submit" type="submit">Salvar</button>
          </form>

          {resposta && (
            <div className={resposta.sucesso ? "success_msg" : "error_msg"}>
              <p>{resposta.mensagem}</p>
            </div>
          )}
        </>
    </div>

    ); 
}; 
export default SignUp;