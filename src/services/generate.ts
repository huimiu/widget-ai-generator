import { callFunction } from "./callFunction";

export async function generate(q: string): Promise<any[]> {
  await new Promise((f) => setTimeout(f, 2000));
  try {
    // const respData = await callFunction(
    //   "POST",
    //   "callGraph",
    //   { graphType: "generate" },
    //   { question: q }
    // );
    const respData =
      '[\n  {\n    "name": "TodoTaskWidget.tsx",\n    "code": "// TodoTaskWidget.tsx\\nimport \\"../styles/TodoTaskWidget.css\\";\\nimport { Button, Text, Checkbox } from \\"@fluentui/react-components\\";\\nimport { CheckCircle20Filled, MoreHorizontal32Regular, Add20Filled } from \\"@fluentui/react-icons\\";\\nimport { BaseWidget } from \\"@microsoft/teamsfx-react\\";\\nimport { TodoTaskModel } from \\"../models/todoTaskModel\\";\\nimport { getTodoTasks, addTodoTask } from \\"../services/todoTaskService\\";\\ninterface ITodoTaskWidgetState {\\n  data: TodoTaskModel[];\\n}\\nexport default class TodoTaskWidget extends BaseWidget<any, ITodoTaskWidgetState> {\\n  async getData(): Promise<ITodoTaskWidgetState> {\\n    return { data: getTodoTasks() };\\n  }\\n  header(): JSX.Element | undefined {\\n    return (\\n      <div>\\n        <CheckCircle20Filled />\\n        <Text>Todo Tasks</Text>\\n        <Button icon={<MoreHorizontal32Regular />} appearance=\\"transparent\\" />\\n      </div>\\n    );\\n  }\\n  body(): JSX.Element | undefined {\\n    return (\\n      <div className=\\"todo-task-body\\">\\n        {this.state.data?.map((task: TodoTaskModel) => {\\n          return (\\n            <div key={task.id} className=\\"todo-task-item\\">\\n              <Checkbox label={task.title} checked={task.completed} />\\n              <Text className=\\"content\\">{task.content}</Text>\\n            </div>\\n          );\\n        })}\\n      </div>\\n    );\\n  }\\n  footer(): JSX.Element | undefined {\\n    return (\\n      <Button onClick={this.handleAddTask} icon={<Add20Filled />} appearance=\\"outline\\">\\n        Add Task\\n      </Button>\\n    );\\n  }\\n  private handleAddTask = () => {\\n    const newTask: TodoTaskModel = {\\n      id: \\"id\\",\\n      title: \\"New Task\\",\\n      content: \\"\\",\\n      completed: false,\\n    };\\n    addTodoTask(newTask);\\n    this.refresh();\\n  };\\n}"\n  },\n  {\n    "name": "TodoTaskWidget.css",\n    "code": ".todo-task-body {\\n  display: grid;\\n  row-gap: var(--spacingVerticalS);\\n  align-content: start;\\n  min-width: 14rem;\\n}\\n.todo-task-item {\\n  display: grid;\\n  grid-template-columns: 1fr min-content;\\n  align-items: center;\\n  gap: var(--spacingS);\\n}\\n.todo-task-item .content {\\n  color: var(--colorNeutralSecondary);\\n}\\n.todo-task-item .ms-Checkbox-text {\\n  display: flex;\\n  flex-wrap: wrap;\\n  align-items: center;\\n}\\n.loading {\\n  display: grid;\\n  justify-content: center;\\n  height: 100%;\\n}\\n"\n  },\n  {\n    "name": "todoTaskModel.ts",\n    "code": "export interface TodoTaskModel {\\n  id: string;\\n  title: string;\\n  content: string;\\n  completed: boolean;\\n}"\n  },\n  {\n    "name": "todoTaskService.ts",\n    "code": "import { TodoTaskModel } from \\"../models/todoTaskModel\\";\\nlet todoTasks: TodoTaskModel[] = [\\n  {\\n    id: \\"id1\\",\\n    title: \\"Task 1\\",\\n    content: \\"Task 1 content\\",\\n    completed: false,\\n  },\\n  {\\n    id: \\"id2\\",\\n    title: \\"Task 2\\",\\n    content: \\"Task 2 content\\",\\n    completed: true,\\n  },\\n  {\\n    id: \\"id3\\",\\n    title: \\"Task 3\\",\\n    content: \\"Task 3 content\\",\\n    completed: false,\\n  },\\n];\\nexport const getTodoTasks = (): TodoTaskModel[] => todoTasks;\\nexport const addTodoTask = (task: TodoTaskModel) => {\\n  todoTasks.push(task);\\n};"\n  }\n]';
    // return JSON.parse(respData["generated"]);
    return JSON.parse(respData);
  } catch (e) {
    console.log(e);
    throw e;
  }
}
