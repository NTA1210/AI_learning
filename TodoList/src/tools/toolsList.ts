import OpenAI from "openai";

export const tools: OpenAI.Chat.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "getTasks",
      description: "returns the available tasks",
      parameters: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "The title of the task",
          },
          isCompleted: {
            type: "boolean",
            description: "The status of the task completed or not",
          },
        },
        required: [],
      },
    },
  },

  {
    type: "function",
    function: {
      name: "getTaskById",
      description: "returns the task by id",
      parameters: {
        type: "object",
        properties: {
          id: {
            type: "number",
            description: "The id of the task",
          },
        },
        required: ["id"],
      },
    },
  },

  {
    type: "function",
    function: {
      name: "createTask",
      description: "create a new task",
      parameters: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "The title of the task",
          },
        },
        required: ["title"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "updateTask",
      description: "update a task",
      parameters: {
        type: "object",
        properties: {
          id: {
            type: "number",
            description: "The id of the task",
          },
          title: {
            type: "string",
            description: "The title of the task",
          },
          isCompleted: {
            type: "boolean",
            description: "The status of the task",
          },
        },
        required: ["id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "deleteTask",
      description: "delete a task",
      parameters: {
        type: "object",
        properties: {
          id: {
            type: "number",
            description: "The id of the task",
          },
        },
        required: ["id"],
      },
    },
  },
];
