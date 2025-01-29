import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedProjects } from '../interfaces/project.interface';

export interface Project {
  id?: string;
  name: string;
  address: string;
  description?: string;
  started_at: string;
  finished_at?: string;
  status: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private apiUrl = 'http://127.0.0.1:8000/api/projects/';

  constructor(private http: HttpClient) {}

  getProjects(
    search: string = '',
    page: number = 1
  ): Observable<PaginatedProjects> {
    let params = new HttpParams().set('page', page);
    if (search) params = params.set('search', search);
    return this.http.get<PaginatedProjects>(this.apiUrl, { params });
  }

  createProject(project: Project): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, project);
  }

  updateProject(id: string, project: Project): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}${id}/`, project);
  }

  deleteProject(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }

  getProjectById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}${id}/`);
  }
}
