import path from 'node:path';
import router from './routes';
import express, { Application } from 'express';
import handleError from './middlewares/handleError';

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);
app.use('/uploads', express.static(path.resolve(__dirname, '../', 'uploads')));

app.use(handleError);

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
