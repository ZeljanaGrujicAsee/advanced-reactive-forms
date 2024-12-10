import { Task } from "../services/task.service";
import { loadTasksSuccess } from "./task.actions";
import { taskReducer } from "./task.reducer";
import { initialTaskState } from "./task.state";

describe('TaskReducer', () => {
    it('should handle loadTaskSuccess and upate the state with tasks', () => {
        // Arrange 
        const mockTask: Task[] = [
            { id: 1, title: 'Task One', description: 'First Task', startDate: '2024-12-01', dueDate: '2024-12-31', status: 'Pending' },
            { id: 2, title: 'Task Two', description: 'Second Task', startDate: '2024-12-01', dueDate: '2024-12-31', status: 'Pending' }
        ];

        const totalCount = 2;
        const action = loadTasksSuccess({ tasks: mockTask, totalCount });

        // Act
        const newState = taskReducer(initialTaskState, action);

        //Assert
        expect(newState.isLoading).toBeFalse();
        expect(newState.totalCount).toBe(totalCount);
        expect(newState.entities[1]).toEqual(mockTask[0]);
        expect(newState.entities[2]).toEqual(mockTask[1]);
    })
})