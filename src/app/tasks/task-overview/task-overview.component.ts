import { Component, OnInit } from '@angular/core';
import { Task, TaskService } from '../../services/task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-task-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-overview.component.html',
  styleUrl: './task-overview.component.css'
})
export class TaskOverviewComponent implements OnInit {
  task: Task | undefined;

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private router: Router,
    private titleService: Title,
    private metaService: Meta
  ) { }

  ngOnInit(): void {
    const taskId = Number(this.route.snapshot.paramMap.get('id'));
    if (taskId) {
      this.task = this.taskService.getTaskById(taskId);
      if (this.task) {
        // Set the page title dynamically
        this.titleService.setTitle(`Task Overview: ${this.task.title}`);

        // Set meta tags dynamically
        this.metaService.updateTag({ name: 'description', content: `Viewing details for task: ${this.task.title}.` });
        this.metaService.updateTag({ name: 'keywords', content: 'task management, overview, Angular, tasks' });
      }
    }
  }

  goBack(): void {
    this.router.navigate(['/tasks']);
  }
}