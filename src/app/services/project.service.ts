import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProjectModel } from '../models/project';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  //private baseUrl : string = 'https://tasktrackerappservice.azurewebsites.net/api/projects';
  private baseUrl : string = 'http://localhost:5284/api/projects';

  constructor(private http: HttpClient) { }

  getAllProjects(page: number,perPage: number){
    return this.http.get<any>(`${this.baseUrl}?page=${page}&perPage=${perPage}`);
  }
  getUserProjects(){
    return this.http.get<any>(`${this.baseUrl}/user`);
  }
  getTasksForProject(projectId: any){
    return this.http.get<any>(`${this.baseUrl}/${projectId}/tasks`);
  }
  getUsersForProject(projectId: any){
    return this.http.get<any>(`${this.baseUrl}/${projectId}/users`);
  }
  addProject(project: ProjectModel){
    return this.http.post<any>(`${this.baseUrl}`,project);
  }
  deleteProject(id: number){
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
  updateProject(id:number,project:ProjectModel){
    return this.http.put<any>(`${this.baseUrl}/${id}`,project);
  }
}
