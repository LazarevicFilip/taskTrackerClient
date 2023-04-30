import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private baseUrl : string = 'http://localhost:5284/api/projects';
  constructor(private http: HttpClient) { }

  getUserProjects(){
    return this.http.get<any>(`${this.baseUrl}/user`);
  }
  getTasksForProject(projectId: any){
    return this.http.get<any>(`${this.baseUrl}/${projectId}/tasks`);
  }

}
