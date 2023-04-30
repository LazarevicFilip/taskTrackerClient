
export interface UpdateStausTask{
  id: number;
  name: string;
  status: string;
  projectId: number;
  priority: string;
  description: string;
  userIds? : number[];
  taskFiles?: any[];
}
export interface AddTaskModel{
  name: string;
  status: string;
  priority: string;
  description: string;
  userIds : number[];
  projectId: number;
}
// export interface UpdateTaskModel{
//   id: number;
//   name: string;
//   status: string;
//   priority: string;
//   description: string;
//   UserIds : number[];
//   projectId: number;
// }
