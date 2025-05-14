const http = require("http");
const fs = require("fs");
const path = require("path");
const Usuarios = require("./modules/Usuarios");

const PORT = 3000;

const server = http.createServer((req, res) => {
  const url = req.url;

  // Define idioma com base no cabeçalho Accept-Language
  const lang = req.headers["accept-language"]?.startsWith("pt") ? "pt" : "en";

  if (url === "/" || url === "/index") {
    const file = lang === "pt" ? "index-pt.html" : "index-en.html";
    serveFile(path.join(__dirname, "public", file), "text/html", res);
  } else if (url === "/sobre") {
    serveFile(path.join(__dirname, "public", "sobre.html"), "text/html", res);
  } else if (url === "/usuarios") {
    const usuarios = new Usuarios(path.join(__dirname, "data", "usuarios.txt"));
    const topUsuarios = usuarios.getTopUsuarios(5);
    const html = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <link rel="stylesheet" href="/css/estilo.css">
        <title>Usuários</title>
      </head>
      <body>
        <h1>Top 5 Usuários</h1>
        <ul>
          ${topUsuarios.map((user) => `<li>${user}</li>`).join("")}
        </ul>
        <a href="/">Voltar</a>
      </body>
      </html>`;
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(html);
  } else if (url.startsWith("/css/")) {
    serveFile(path.join(__dirname, "public", url), "text/css", res);
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Página não encontrada");
  }
});

function serveFile(filePath, contentType, res) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500);
      return res.end("Erro interno");
    }
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  });
}

server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
