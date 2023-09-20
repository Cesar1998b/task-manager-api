import { Response } from 'express';
import { admin, db } from './config/firebase';
import { Task } from './models/task.model';

type Request = {
  body: Task;
  params: { taskId: string };
};

const addTask = async (req: Request, res: Response) => {
  try {
    const task = req.body;
    const date = admin.firestore.Timestamp.now();
    const currentDate = date.toDate();
    task.created = currentDate;
    const docRef = await db.collection('tasks').add(task);
    const taskId = docRef.id;
    res.status(200).json({ message: 'Tarea agregada con éxito', taskId });
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar la tarea' });
  }
};

const getAllTask = async (req: Request, res: Response) => {
  try {
    const snapshot = await db
      .collection('tasks')
      .orderBy('created', 'desc')
      .get();
    const tasks: Task[] = [];
    snapshot.forEach((doc) => {
      const taskData = doc.data() as Task;
      tasks.push({ ...taskData, id: doc.id });
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las tareas' });
  }
};

const updateTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.taskId;
    const updatedTask = req.body;
    const date = admin.firestore.Timestamp.now();
    const currentDate = date.toDate();
    updatedTask.updated = currentDate;
    await db.collection('tasks').doc(taskId).set(updatedTask, { merge: true });
    res.status(200).json({ message: 'Tarea actualizada con éxito' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la tarea' });
  }
};

const deleteTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.taskId;
    await db.collection('tasks').doc(taskId).delete();
    res.status(200).json({ message: 'Tarea eliminada con éxito' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la tarea' });
  }
};

export { addTask, getAllTask, updateTask, deleteTask };
