import * as functions from 'firebase-functions';
import * as express from 'express';
import { addTask, getAllTask, updateTask, deleteTask } from './entryController';

const app = express();

app.post('/tasks', addTask);
app.get('/tasks', getAllTask);
app.put('/tasks/:taskId', updateTask);
app.delete('/tasks/:taskId', deleteTask);

exports.api = functions.https.onRequest(app);
