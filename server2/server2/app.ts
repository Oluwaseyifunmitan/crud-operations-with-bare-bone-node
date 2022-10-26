import fs from "fs";
import http, { IncomingMessage, Server, ServerResponse } from "http";
const {parser}= require("html-metadata-parser");

/*
implement your server code here
*/

const server: Server = http.createServer(async(req: IncomingMessage, res: ServerResponse) => {
    if (req.method === "GET" && req.url === "/") {
      const response = await parser('https://www.youtube.com');
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(response, null, 2));
    }
  });
  server.listen(3001);