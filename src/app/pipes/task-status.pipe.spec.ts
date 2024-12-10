import { TaskStatusPipe } from "./task-status.pipe"

describe('TaskStatusPipe', () => {
    let pipe: TaskStatusPipe;

    beforeEach(() => {
        pipe = new TaskStatusPipe();
    })

    it('should return "⏳ Pending" when status is "Pending"', () => {
        expect(pipe.transform('Pending')).toBe('⏳ Pending');
    });
})