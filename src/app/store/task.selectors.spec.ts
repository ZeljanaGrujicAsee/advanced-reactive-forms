import { Task } from "../services/task.service"
import { selectPaginatedTasks } from "./task.selectors";

describe('Task Selectors', () => {
    it('should return paginated tasks', () => {
        // Arrange
        const mockTask: Task[] = [
            { id: 1, title: 'Task One', description: 'First Task', startDate: '2024-12-01', dueDate: '2024-12-31', status: 'Pending' },
            { id: 2, title: 'Task Two', description: 'Second Task', startDate: '2024-12-01', dueDate: '2024-12-31', status: 'Pending' }
        ];

        const currentPage = 1;
        const pageSize = 1;

        // Act
        const result = selectPaginatedTasks.projector(mockTask, currentPage, pageSize);

        // Assert
        expect(result).toEqual([
            { id: 1, title: 'Task One', description: 'First Task', startDate: '2024-12-01', dueDate: '2024-12-31', status: 'Pending' }
        ])
    })
})