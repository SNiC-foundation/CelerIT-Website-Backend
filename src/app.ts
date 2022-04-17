import express from "express";
import bodyParser from "body-parser";
import { RegisterRoutes } from "../build/routes";
import * as swaggerJson from "./swagger.json";
import * as swaggerUI from "swagger-ui-express";

const app = express();

// Use body parser to read sent json payloads
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(["/openapi", "/docs", "/swagger"], swaggerUI.serve, swaggerUI.setup(swaggerJson));

RegisterRoutes(app);

export default app;
