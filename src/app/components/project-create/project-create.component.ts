import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-project-create',
  templateUrl: './project-create.component.html',
  styleUrls: ['./project-create.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatOptionModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatNativeDateModule,
    MatButtonModule,
  ],
})
export class ProjectCreateComponent {
  projectForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private router: Router
  ) {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      address: ['', Validators.required],
      started_at: ['', Validators.required],
      status: ['', Validators.required],
      type: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      const formData = { ...this.projectForm.value };
      formData.started_at = formatDate(formData.started_at, 'yyyy-MM-dd', 'en');
      this.projectService.createProject(formData).subscribe({
        next: (response: any) => {
          console.log('Project created:', response);
          this.router.navigate(['/projects']);
        },
        error: (error: any) => {
          console.error('Error creating project:', error);
        },
      });
    }
  }
}
