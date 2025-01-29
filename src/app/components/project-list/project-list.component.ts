import {
  AfterViewInit,
  Component,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Project, ProjectService } from '../../services/project.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { firstValueFrom } from 'rxjs';
import { PaginatedProjects } from '../../interfaces/project.interface';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    RouterModule,
  ],
})
export class ProjectListComponent implements AfterViewInit {
  constructor(private projectService: ProjectService, private router: Router) {}

  displayedColumns: string[] = ['name', 'address', 'status', 'actions'];
  projects: Project[] = [];
  dataSource = new MatTableDataSource<Project>();
  searchQuery: string = '';
  length = 0;
  page = 1;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  async ngAfterViewInit() {
    const results = await this.obtainProjects(this.page);
    this.projects = results.results;
    console.log('result -->', results);
    this.length = results.count;
    this.dataSource = new MatTableDataSource(this.projects);
    this.dataSource.sort = this.sort;
  }

  async handlePageEvent(e: PageEvent) {
    e.pageIndex == this.page ? (this.page += 1) : (this.page -= 1);
    let results = await this.obtainProjects(this.page);
    this.length = results.count;
    this.projects = results.results;
    this.dataSource = new MatTableDataSource(this.projects);
  }

  async obtainProjects(
    currentPage = 1,
    search = ''
  ): Promise<PaginatedProjects> {
    const results = await firstValueFrom(
      this.projectService.getProjects(search, currentPage)
    );
    return results;
  }

  async applyFilter(search: HTMLInputElement) {
    console.log('event filter -->', search.name);
    // const result = await this.obtainProjects(1, search);
    // console.log('input search -->', result);
    // const filterValue = (event.target as HTMLInputElement).value;
    // this.dataSource.filter = filterValue.trim().toLowerCase();

    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.firstPage();
    // }
  }

  editProject(projectId: string) {
    // Redirigir o abrir un formulario para editar el proyecto
    console.log(`Edit project ${projectId}`);
    this.router.navigate(['/projects', projectId]);
  }

  createProject() {
    this.router.navigate(['/projects/create']);
  }

  deleteProject(projectId: string) {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projectService.deleteProject(projectId).subscribe(() => {
        this.projects = this.projects.filter((p) => p.id !== projectId);
        this.dataSource.data = this.projects;
      });
    }
  }
}
