import { createConnection } from "mysql2";

const connection = createConnection({
  host: "localhost",
  user: "root",
  password: "admin123",
  database: "testeDB",
  multipleStatements: true 
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Conectado ao MySQL!");
});

export default connection;
