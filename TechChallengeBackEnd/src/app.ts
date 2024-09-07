import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import routers from './app/routes/routes';
import swaggerUi from "swagger-ui-express";
import swaggerOutput from "./app/config/swagger_output.json";

const app = express();

app.use(cors());

app.use(express.json());

app.use(routers);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOutput));


export default app;