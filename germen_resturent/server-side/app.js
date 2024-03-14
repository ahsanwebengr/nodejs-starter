import express from "express";
import cors from 'cors';
import bodyParser from "body-parser";
const app = express();

// Routes Imports 
import authRoutes from "././src/routes/auth.route.js";
import productRoutes from './src/routes/product.route.js';

// App Middlewares 
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express());

// Route Middlewares 
app.use("/api/auth", authRoutes);
app.use("/api", productRoutes);

export { app };