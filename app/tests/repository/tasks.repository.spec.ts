import { Test, TestingModule } from '@nestjs/testing';
import { TaskDocument, TaskStatus } from 'src/shared/dto/entities/task';
import { CreateTaskDto } from 'src/shared/dto/task/create';
import { Types } from 'mongoose';
import { TaskDao } from 'src/modules/data/dao/task.dao';
import { TaskRepository } from 'src/modules/data/repository/task.repository';

describe('TaskRepository', () => {
  let taskRepository: TaskRepository;
  let taskDao: jest.Mocked<TaskDao>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskRepository,
        {
          provide: TaskDao,
          useValue: {
            create: jest.fn(),
            changeStatus: jest.fn(),
            findById: jest.fn(),
            findAllWithFilters: jest.fn(),
            count: jest.fn(),
            findAllByProject: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    taskRepository = module.get<TaskRepository>(TaskRepository);
    taskDao = module.get(TaskDao);
  });

  it('should create a new task', async () => {
    // Arrange
    const createTaskDto: CreateTaskDto = { title: 'New Task', description: 'Task description' };
    const projectId = new Types.ObjectId();
    const taskDoc = {
      _id: new Types.ObjectId(),
      title: createTaskDto.title,
      description: createTaskDto.description,
      projectId,
      status: TaskStatus.OPEN,
      startDate: null,
      endDate: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    taskDao.create.mockResolvedValue(taskDoc as unknown as TaskDocument);

    // Act
    const task = await taskRepository.create(createTaskDto, projectId.toString());

    // Assert
    expect(taskDao.create).toHaveBeenCalledWith(createTaskDto, projectId.toString());
    expect(task).toEqual({
      id: taskDoc._id.toString(),
      title: 'New Task',
      description: 'Task description',
      projectId: projectId.toString(),
      status: TaskStatus.OPEN,
      startDate: null,
      endDate: null,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it('should find a task by ID', async () => {
    // Arrange
    const taskId = new Types.ObjectId();
    const projectId = new Types.ObjectId();
    const taskDoc = {
      _id: taskId,
      title: 'Find Task',
      description: 'Task description',
      projectId,
      status: TaskStatus.OPEN,
      startDate: null,
      endDate: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    taskDao.findById.mockResolvedValue(taskDoc as unknown as TaskDocument);

    // Act
    const task = await taskRepository.findById(taskId.toString());

    // Assert
    expect(taskDao.findById).toHaveBeenCalledWith(taskId.toString());
    expect(task).toEqual({
      id: taskId.toString(),
      title: 'Find Task',
      description: 'Task description',
      projectId: projectId.toString(),
      status: TaskStatus.OPEN,
      startDate: null,
      endDate: null,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it('should find all tasks with pagination', async () => {
    // Arrange
    const projectId = new Types.ObjectId();
    const pagination = { page: 1, limit: 10 };
    const filters = { projectId };
    const sortOptions = { createdAt: -1 };
    const taskDocs = [
      {
        _id: new Types.ObjectId(),
        title: 'Task 1',
        description: 'Description 1',
        projectId,
        status: TaskStatus.OPEN,
        startDate: null,
        endDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: new Types.ObjectId(),
        title: 'Task 2',
        description: 'Description 2',
        projectId,
        status: TaskStatus.IN_PROGRESS,
        startDate: null,
        endDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    taskDao.findAllWithFilters.mockResolvedValue(taskDocs as unknown as TaskDocument[]);
    taskDao.count.mockResolvedValue(2);

    // Act
    const result = await taskRepository.findAll(pagination, filters, sortOptions);

    // Assert
    expect(taskDao.findAllWithFilters).toHaveBeenCalledWith(
      filters,
      sortOptions,
      0,
      10,
    );
    expect(taskDao.count).toHaveBeenCalledWith(filters);
    expect(result).toEqual({
      data: taskDocs.map((doc) => ({
        id: doc._id.toString(),
        title: doc.title,
        description: doc.description,
        projectId: doc.projectId.toString(),
        status: doc.status,
        startDate: doc.startDate,
        endDate: doc.endDate,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      })),
      total: 2,
      page: 1,
      limit: 10,
    });
  });
});
