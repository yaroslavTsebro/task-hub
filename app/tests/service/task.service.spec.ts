import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { TaskStatus } from 'src/shared/dto/entities/task';
import { UserTaskStatus } from 'src/shared/dto/entities/user-task';
import { CreateTaskDto } from 'src/shared/dto/task/create';
import { AssignTaskDto } from 'src/shared/dto/task/user/assing';
import { ChangeStatusDto } from 'src/shared/dto/task/change-status';
import { ProjectRepository } from 'src/modules/data/repository/project.repository';
import { TaskRepository } from 'src/modules/data/repository/task.repository';
import { UserTaskRepository } from 'src/modules/data/repository/user-task.repository';
import { TaskService } from 'src/modules/task/task.service';
import { IUserTask } from 'src/shared/contracts/entity/user-task';

describe('TaskService', () => {
  let taskService: TaskService;
  let taskRepo: jest.Mocked<TaskRepository>;
  let userTaskRepo: jest.Mocked<UserTaskRepository>;
  let projectRepo: jest.Mocked<ProjectRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: TaskRepository,
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            changeStatus: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: UserTaskRepository,
          useValue: {
            assignUserToTask: jest.fn(),
            findByUserAndTask: jest.fn(),
            findByUser: jest.fn(),
          },
        },
        {
          provide: ProjectRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    taskService = module.get<TaskService>(TaskService);
    taskRepo = module.get(TaskRepository);
    userTaskRepo = module.get(UserTaskRepository);
    projectRepo = module.get(ProjectRepository);
  });

  it('should throw ConflictException if user is already assigned to the task', async () => {
    // Arrange
    const taskId = '6753e41a4b70b27b69aaf355';
    const assignTaskDto: AssignTaskDto = { userId: '6753e42403fa978e570b626d', role: UserTaskStatus.PERFORMER };
    const task = { id: taskId, title: 'Test Task' } as any;
  
    taskRepo.findById.mockResolvedValue(task);
    userTaskRepo.findByUserAndTask.mockResolvedValue({
      userId: assignTaskDto.userId,
      taskId: taskId,
      role: UserTaskStatus.PERFORMER,
    } as IUserTask);
  
    // Act & Assert
    await expect(taskService.assignTaskToUser(taskId, assignTaskDto)).rejects.toThrow(
      ConflictException,
    );
  
    expect(taskRepo.findById).toHaveBeenCalledWith(taskId);
    expect(userTaskRepo.findByUserAndTask).toHaveBeenCalledWith(assignTaskDto.userId, taskId);
  });
  

  it('should throw NotFoundException if project does not exist', async () => {
    // Arrange
    const projectId = '6753e436fd3e6f81b20377ed';
    const user = { id: '6753e42403fa978e570b626d' } as any;
    const createTaskDto: CreateTaskDto = { title: 'New Task', description: 'Description' };

    projectRepo.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(taskService.createTask(projectId, createTaskDto, user)).rejects.toThrow(
      NotFoundException,
    );
    expect(projectRepo.findById).toHaveBeenCalledWith(projectId);
  });

  it('should assign a user to a task', async () => {
    // Arrange
    const taskId = '6753e41a4b70b27b69aaf355';
    const assignTaskDto: AssignTaskDto = { userId: '6753e42403fa978e570b626d', role: UserTaskStatus.PERFORMER };
    const task = { id: taskId } as any;

    taskRepo.findById.mockResolvedValue(task);
    userTaskRepo.findByUserAndTask.mockResolvedValue(null);
    userTaskRepo.assignUserToTask.mockResolvedValue(undefined);

    // Act
    const result = await taskService.assignTaskToUser(taskId, assignTaskDto);

    // Assert
    expect(taskRepo.findById).toHaveBeenCalledWith(taskId);
    expect(userTaskRepo.findByUserAndTask).toHaveBeenCalledWith(assignTaskDto.userId, taskId);
    expect(userTaskRepo.assignUserToTask).toHaveBeenCalledWith(
      assignTaskDto.userId,
      taskId,
      assignTaskDto.role,
    );
    expect(result).toBeUndefined();
  });

  it('should throw ConflictException if user is already assigned to the task', async () => {
    // Arrange
    const taskId = '6753e41a4b70b27b69aaf355';
    const assignTaskDto: AssignTaskDto = { userId: '6753e42403fa978e570b626d', role: UserTaskStatus.PERFORMER };
    const task = { id: taskId } as any;

    taskRepo.findById.mockResolvedValue(task);
    const userTaskMock = {
      userId: '6753e42403fa978e570b626d',
      taskId: '6753e41a4b70b27b69aaf355',
      role: UserTaskStatus.PERFORMER,
    } as IUserTask;
    
    userTaskRepo.findByUserAndTask.mockResolvedValue(userTaskMock);
    

    // Act & Assert
    await expect(taskService.assignTaskToUser(taskId, assignTaskDto)).rejects.toThrow(
      ConflictException,
    );
    expect(taskRepo.findById).toHaveBeenCalledWith(taskId);
    expect(userTaskRepo.findByUserAndTask).toHaveBeenCalledWith(assignTaskDto.userId, taskId);
  });

  it('should update the status of a task', async () => {
    // Arrange
    const taskId = '6753e41a4b70b27b69aaf355';
    const changeStatusDto: ChangeStatusDto = { status: TaskStatus.IN_PROGRESS };
    const updatedTask = { id: taskId, status: TaskStatus.IN_PROGRESS } as any;

    taskRepo.findById.mockResolvedValue(updatedTask);
    taskRepo.changeStatus.mockResolvedValue(updatedTask);

    // Act
    const result = await taskService.changeTaskStatus(taskId, changeStatusDto, {} as any);

    // Assert
    expect(taskRepo.findById).toHaveBeenCalledWith(taskId);
    expect(taskRepo.changeStatus).toHaveBeenCalledWith(taskId, changeStatusDto.status);
    expect(result).toEqual(updatedTask);
  });

  it('should throw NotFoundException if task does not exist when changing status', async () => {
    // Arrange
    const taskId = '6753e41a4b70b27b69aaf355';
    const changeStatusDto: ChangeStatusDto = { status: TaskStatus.IN_PROGRESS };

    taskRepo.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(taskService.changeTaskStatus(taskId, changeStatusDto, {} as any)).rejects.toThrow(
      NotFoundException,
    );
    expect(taskRepo.findById).toHaveBeenCalledWith(taskId);
  });
});
