import taskService, { ITask } from "@/services/task.service";

export type ToolArgsMap = {
  getTasks: { title?: string; isCompleted?: boolean };
  getTaskById: { id: number };
  createTask: { title: string };
  updateTask: { id: number; title?: string; isCompleted?: boolean };
  deleteTask: { id: number };
};

type ToolHandlers = {
  [K in keyof ToolArgsMap]: (args: ToolArgsMap[K]) => Promise<ITask | ITask[]>;
};

export const toolHandlers: ToolHandlers = {
  getTasks: ({ title, isCompleted }) =>
    taskService.getTasks({ title, isCompleted }),

  getTaskById: ({ id }) => taskService.getTaskById(id),

  createTask: ({ title }) => taskService.createTask({ title }),

  updateTask: ({ id, title, isCompleted }) =>
    taskService.updateTask({ id, title, isCompleted }),

  deleteTask: ({ id }) => taskService.deleteTask(id),
};

export type ToolName = keyof ToolArgsMap;

export async function dispatchToolCall<K extends ToolName>(
  name: K,
  args: ToolArgsMap[K]
) {
  return toolHandlers[name](args);
}
