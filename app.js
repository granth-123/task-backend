import express from 'express';
import dotenv from 'dotenv';
import connectDb from './config/db.js';
import authRoutes from './routers/authRoutes.js'

dotenv.config();
connectDb();

const app = express();
const port = 5000;

app.use(express.json());

app.use("/user",authRoutes);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
