import http, {
  IncomingMessage,
  Server,
  ServerResponse,
  STATUS_CODES,
} from "http";
// import url from "url";
import fs from "fs";
import IEmployee from "./interface/IEmployee";
import dotenv from "dotenv";

import { createModuleResolutionCache } from "typescript";
import path from "path";
import { Console } from "console";
const data = require(path.resolve(__dirname, "../database.json"));
//console.log(data);

dotenv.config();
/*
implement your server code here
*/

const server: Server = http.createServer(
  (req: IncomingMessage, res: ServerResponse) => {
    function saveFile(saved: any) {
      let myd = JSON.stringify(saved);
      fs.writeFile("./database.json", myd, "utf8", (err) => {
        if (err) throw err;
        console.log("file has been written");
      });
    }

    if (req.method === "GET" && req.url === "/employee") {
      res.end(JSON.stringify(data));
      console.log("in data");
    }

    //home handler or route
    if (req.method === "POST" && req.url === "/create") {
      req.on("data", (chunk) => {
        const myData = JSON.parse(chunk.toString());
        data.push(myData);
        saveFile(data);
      });
      res.end(JSON.stringify({ greetings: "hi" }));
    }

    if (req.method === "DELETE" && req.url === "/delete") {
      req.on("data", (incomingId) => {
        const { id } = JSON.parse(incomingId.toString());

        console.log(id);
        let files = Array.from(data);
        let filteredId = files.filter((file: any) => file.id != id);
        saveFile(filteredId);
      });
      res.end("file deleted");
    }

    if (req.method === "PUT" && req.url === "/putfile") {
      req.on("data", (updatedData) => {
        const { id } = JSON.parse(updatedData.toString());
        updatedData = JSON.parse(updatedData.toString());
        let files = Array.from(data);
        let updatedId: any = files.filter((file: any) => file.id == id);

        if (updatedId.length > 0) {
          console.log(updatedData.organization);
          updatedId[0]["updatedAt"] = new Date();
          updatedId[0]["organization"] = updatedData.organization
            ? updatedData.organization
            : updatedId[0]["organization"];

          updatedId[0]["products"] = updatedData.products
            ? updatedData.products
            : updatedId[0]["products"];

          updatedId[0]["marketValue"] = updatedData.marketValue
            ? updatedData.marketValue
            : updatedId[0]["marketValue"];

          updatedId[0]["address"] = updatedData.address
            ? updatedData.address
            : updatedId[0]["address"];

          updatedId[0]["ceo"] = updatedData.ceo
            ? updatedData.ceo
            : updatedId[0]["ceo"];

          updatedId[0]["country"] = updatedData.country
            ? updatedData.country
            : updatedId[0]["country"];

          updatedId[0]["noOfEmployees"] = updatedData.noOfEmployees
            ? updatedData.noOfEmployees
            : updatedId[0]["noOfEmployees"];

          updatedId[0]["employees"] = updatedData.employees
            ? updatedData.employees
            : updatedId[0]["employees"];

          let filteredObj = data.map((element: any) => {
            if (element.id === updatedId[0].id) {
              return updatedId[0]
            } else {
              return element;
            }
          });

       
          saveFile(filteredObj);
        } else {
          console.log("nothing to update ");
        }
      });
      res.end("file updated");
    }
  }
);

server.listen(process.env.PORT, () => {
  console.log(`running on port ${process.env.PORT}`);
});
