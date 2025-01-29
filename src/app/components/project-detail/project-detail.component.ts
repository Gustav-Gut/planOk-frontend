import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProjectService } from '../../services/project.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css'],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatDatepickerModule,
  ],
})
export class ProjectDetailComponent implements OnInit {
  projectForm!: FormGroup;
  projectId!: string;
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    // Get the project ID from the route
    this.projectId = this.route.snapshot.paramMap.get('id')!;
    this.loadProject();
  }

  loadProject(): void {
    this.projectService.getProjectById(this.projectId).subscribe({
      next: (project) => {
        this.isLoading = false;
        this.projectForm = this.fb.group({
          name: [
            project.name,
            [Validators.required, Validators.maxLength(200)],
          ],
          description: [project.description, [Validators.maxLength(500)]],
          address: [project.address, [Validators.required]],
          started_at: [project.started_at, [Validators.required]],
          finished_at: [project.finished_at],
          status: [project.status, [Validators.required]],
        });
      },
      error: () => {
        this.isLoading = false;
        alert('Error loading project data.');
      },
    });
  }

  saveProject(): void {
    if (this.projectForm.valid) {
      this.projectService
        .updateProject(this.projectId, this.projectForm.value)
        .subscribe({
          next: () => {
            alert('Project updated successfully!');
            this.router.navigate(['/']);
          },
          error: () => {
            alert('Error updating project.');
          },
        });
    }
  }
}
