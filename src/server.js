const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 });

console.log("Servidor WebSocket rodando na porta 8080");

wss.on("connection", function connection(ws) {
  console.log("Novo cliente conectado");
  ws.send("Bem-vindo ao chat! Envie uma mensagem.");

  ws.on("message", function incoming(message) {
    let parsed;
    try {
      parsed = JSON.parse(message);
    } catch (e) {
      console.error("Mensagem inválida:", message);
      return;
    }

    const textoFinal = `[${parsed.user}]: ${parsed.text}`;

    // Envia para todos os clientes conectados
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(textoFinal);
      }
    });
  });
});
