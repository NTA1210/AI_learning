import dotenv from "dotenv";
dotenv.config();

export interface ITask {
  id?: number;
  title: string;
  isCompleted?: boolean;
}

class TaskService {
  private readonly apiUrl: string;
  constructor() {
    this.apiUrl = process.env.BASE_API_URL as string;
    if (!this.apiUrl) {
      throw new Error("API_URL is not defined");
    }
  }

  async getTasks({
    title,
    isCompleted,
  }: { title?: string; isCompleted?: boolean } = {}): Promise<ITask> {
    const url = new URL(this.apiUrl);
    if (typeof title === "string" && title.trim() !== "") {
      url.searchParams.set("title", title.trim());
    }

    if (typeof isCompleted === "boolean") {
      url.searchParams.set("isCompleted", String(isCompleted));
    }
    return await fetch(url)
      .then((res) => res.json())
      .then((data) => data.data)
      .catch((err) => {
        throw new Error(err);
      });
  }

  async getTaskById(id: number): Promise<ITask> {
    return await fetch(`${this.apiUrl}/${id}`)
      .then((res) => res.json())
      .then((data) => data.data)
      .catch((err) => {
        throw new Error(err);
      });
  }

  async createTask(task: ITask): Promise<ITask> {
    return await fetch(this.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    })
      .then((res) => res.json())
      .then((data) => data.data)
      .catch((err) => {
        throw new Error(err);
      });
  }

  async updateTask(task: Partial<ITask> & { id: number }): Promise<ITask> {
    const { id, ...payload } = task;

    console.log("Update:", id, payload);

    if (Object.keys(payload).length === 0) {
      throw new Error("Nothing to update");
    }

    return fetch(`${this.apiUrl}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => data.data);
  }

  async deleteTask(id: number): Promise<ITask> {
    return await fetch(`${this.apiUrl}/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => data.data)
      .catch((err) => {
        throw new Error(err);
      });
  }
}

export default new TaskService();
