import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AddTaskModel, UpdateStausTask } from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private statusArr : string[] = ['ToDo','InProgress','Done']
  //private baseUrl : string = 'https://tasktrackerappservice.azurewebsites.net/api/tasks';
  private baseUrl : string = 'http://localhost:5284/api/tasks';
  constructor(private http: HttpClient) { }

  updateTask(task: UpdateStausTask,id:string){
    task.status = this.statusArr[Number(id)];
    return this.http.put<any>(`${this.baseUrl}/${task.id}`,task);
  }
  addTask(task: AddTaskModel){
    return this.http.post<any>(this.baseUrl,task);
  }
  deleteTask(id: number){
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
  uploadFile(file: FormData){
    return this.http.post<any>(`${this.baseUrl}/file`,file);
  }
  deleteFile(taskId: number, fileName: string){
    return this.http.delete<any>(`${this.baseUrl}/${taskId}/file/${fileName}`,)
  }
  getTaskFiles(taskId:number){
    return this.http.get<any>(`${this.baseUrl}/${taskId}/file`)
  }
}
