import * as functions from 'firebase-functions';
import * as express from 'express';
import * as cors from 'cors';
import { addTask, getAllTask, updateTask, deleteTask } from './entryController';

const corsOptions = {
  origin: 'https://task-manager-app-rust.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
};

const app = express();
app.use(cors(corsOptions));

app.post('/tasks', addTask);
app.get('/tasks', getAllTask);
app.put('/tasks/:taskId', updateTask);
app.delete('/tasks/:taskId', deleteTask);

exports.api = functions.https.onRequest(app);
