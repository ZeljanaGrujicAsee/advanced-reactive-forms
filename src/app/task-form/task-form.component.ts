import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent {
  taskForm: FormGroup;

  constructor(private fb: FormBuilder) {
    // Initialize form with basic fields, we will expand on this later
    this.taskForm = this.fb.group({
      title: [''], // Form control for task title
      description: [''] // Form control for task description
    });
  }

  // Basic submit method to log form values, we will add more advanced handling later
  onSubmit(): void {
    console.log('Form Submitted:', this.taskForm.value);
  }
}