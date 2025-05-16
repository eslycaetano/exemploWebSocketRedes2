const http = require("http");
const fs = require("fs");
const path = require("path");
const WebSocket = require("ws");

const server = http.createServer((req, res) => {
  let filePath = path.join(__dirname, "..", "public", req.url === "/" ? "index.html" : req.url);
  const extname = path.extname(filePath);
  const mimeTypes = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
  };

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Arquivo não encontrado.");
    } else {
      const contentType = mimeTypes[extname] || "application/octet-stream";
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content);
    }
  });
});

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("Novo cliente conectado");
  ws.send("Bem-vindo ao chat!");

  ws.on("message", (message) => {
    let parsed;
    try {
      parsed = JSON.parse(message);
    } catch (e) {
      console.error("Mensagem inválida:", message);
      return;
    }

    const textoFinal = `[${parsed.user}]: ${parsed.text}`;

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(textoFinal);
      }
    });
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}, acessível em http://localhost:${PORT}`);
});
