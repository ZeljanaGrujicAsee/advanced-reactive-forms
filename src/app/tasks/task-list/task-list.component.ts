import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Task, tasks } from '../tasks-mock';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent {
  tasks: Task[] = tasks;

  constructor(private router: Router) { }

  navigateToEditTask(taskId: number) {
    this.router.navigate(['/tasks/edit', taskId]);
  }

  navigateToCreateTask() {
    this.router.navigate(['/tasks/create']);
  }
}
