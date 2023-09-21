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
    task.completed = false;
    const docRef = await db.collection('tasks').add(task);
    const taskId = docRef.id;
    res.status(200).json({ message: 'Task created successfully', taskId });
  } catch (error) {
    res.status(500).json({ error: 'Error creating task' });
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
    res.status(500).json({ error: 'Error getting tasks' });
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
    res.status(200).json({ message: 'Task updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating task' });
  }
};

const deleteTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.taskId;
    await db.collection('tasks').doc(taskId).delete();
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting task' });
  }
};

export { addTask, getAllTask, updateTask, deleteTask };
