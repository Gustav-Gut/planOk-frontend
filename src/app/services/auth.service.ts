import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly tokenUrl = 'http://127.0.0.1:8000/api/token/';
  private username = 'gustav'; // Cambia por tus credenciales
  private password = '123456'; // Cambia por tus credenciales

  constructor(private http: HttpClient) {}

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  setToken(token: string): void {
    localStorage.setItem('accessToken', token);
  }

  logout(): void {
    localStorage.removeItem('accessToken');
  }

  refreshToken(): Observable<string> {
    const body = {
      username: this.username,
      password: this.password,
    };

    return new Observable<string>((observer) => {
      this.http.post<any>(this.tokenUrl, body).subscribe({
        next: (response) => {
          const newToken = response.access;
          observer.next(newToken);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        },
      });
    });
  }
}
