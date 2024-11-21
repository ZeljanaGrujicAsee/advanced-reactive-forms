import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { forbiddenTitleValidator } from '../../validators/forbidden-title.validator';
import { dateRangeValidator } from '../../validators/date-range.validator';
import { ValidationMessageComponent } from '../../shared/validation-message/validation-message.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { tasks } from '../tasks-mock';

@Component({
  selector: 'app-task-create',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ValidationMessageComponent],
  templateUrl: './task-create.component.html',
  styleUrl: './task-create.component.css'
})
export class TaskCreateComponent implements OnInit {
  taskForm: FormGroup;
  formSubmitted = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), forbiddenTitleValidator(['Test', 'Forbidden'])]],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      dueDate: ['', Validators.required],
      subtasks: this.fb.array([]),
      teamAssignment: this.fb.group({ // Adding a nested form group for team assignment
        teamMemberName: ['', Validators.required],
        role: ['', Validators.required]
      })
    }, { validators: dateRangeValidator('startDate', 'dueDate') });
  }

  ngOnInit(): void {
    this.taskForm.get('startDate')?.valueChanges.subscribe((startDateValue) => {
      const dueDateControl = this.taskForm.get('dueDate');

      if (startDateValue && this.isValidDate(startDateValue)) {
        const startDate = new Date(startDateValue);
        const today = new Date();

        if (startDate.getTime() > today.getTime()) {
          // Disable Due Date if Start Date is in the future
          dueDateControl?.disable({ emitEvent: false });
        } else {
          // Enable Due Date if Start Date is today or in the past
          dueDateControl?.enable({ emitEvent: false });
        }
      } else {
        dueDateControl?.disable({ emitEvent: false }); // Disable Due Date if Start Date is not valid
      }
    });
  }

  isValidDate(date: any): boolean {
    return !isNaN(Date.parse(date)); // Checks if the date is valid
  }

  get subtasks(): FormArray {
    return this.taskForm.get('subtasks') as FormArray;
  }

  addSubtask(): void {
    if (this.subtasks.length < 3) {
      this.subtasks.push(this.fb.control('', Validators.required));
    }
  }

  onSubmit() {
    if (this.taskForm.valid) {
      const newTask = {
        id: tasks.length + 1,
        ...this.taskForm.value,
        status: 'Pending',
      };

      tasks.push(newTask);

      console.log('New Task:', newTask);
      window.alert('Task created successfully!');

      this.taskForm.reset();

      this.router.navigate(['/tasks']);
    }
  }

  goBack() {
    this.router.navigate(['/tasks']);
  }
}