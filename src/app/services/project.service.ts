import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private baseUrl : string = 'https://tasktrackerappservice.azurewebsites.net/api/projects';

  constructor(private http: HttpClient) { }

  getUserProjects(){
    return this.http.get<any>(`${this.baseUrl}/user`);
  }
  getTasksForProject(projectId: any){
    return this.http.get<any>(`${this.baseUrl}/${projectId}/tasks`);
  }
  getUsersForProjec(projectId: any){
    return this.http.get<any>(`${this.baseUrl}/${projectId}/users`);
  }
}
