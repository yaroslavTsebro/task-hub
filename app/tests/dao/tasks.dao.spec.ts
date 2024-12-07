jest.setTimeout(30000);
import { Test, TestingModule } from '@nestjs/testing';
import { Task, TaskSchema, TaskStatus } from 'src/shared/dto/entities/task';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { TaskDao } from 'src/modules/data/dao/task.dao';

describe('TaskDao ', () => {
  let taskDao: TaskDao;
  let taskModel: Model<Task>;
  let mongoUri: string;
  let container: StartedTestContainer;

  beforeAll(async () => {
    container = await new GenericContainer('mongo')
      .withExposedPorts(27017)
      .start();

    const port = container.getMappedPort(27017);
    mongoUri = `mongodb://localhost:${port}/test-db`;

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongoUri),
        MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
      ],
      providers: [TaskDao],
    }).compile();

    taskDao = module.get<TaskDao>(TaskDao);
    taskModel = module.get<Model<Task>>(getModelToken(Task.name));
  });

  afterAll(async () => {
    await container.stop();
  });

  afterEach(async () => {
    await taskModel.deleteMany({});
  });

  it('should create a new task ', async () => {
    // Arrange
    const createTaskDto = {
      title: 'Test Task',
      description: 'This is a test task',
    };
    const projectId = '64acfd6fdcba1f456789abcd';

    // Act
    const task = await taskDao.create(createTaskDto, projectId);

    // Assert
    expect(task).toBeDefined();
    expect(task.title).toBe('Test Task');
    expect(task.projectId.toString()).toBe(projectId);
  });

  it('should find a task by ID ', async () => {
    // Arrange
    const createdTask = await taskModel.create({
      title: 'Find Task',
      description: 'Find by ID',
      projectId: '64acfd6fdcba1f456789abcd',
    });

    // Act
    const foundTask = await taskDao.findById(createdTask._id.toString());

    // Assert
    expect(foundTask).toBeDefined();
    expect(foundTask?.title).toBe('Find Task');
  });

  it('should change the status of a task ', async () => {
    // Arrange
    const createdTask = await taskModel.create({
      title: 'Change Status Task',
      status: 'OPEN',
      projectId: '64acfd6fdcba1f456789abcd',
    });

    // Act
    const updatedTask = await taskDao.changeStatus(
      createdTask._id.toString(),
      TaskStatus.IN_PROGRESS,
    );

    // Assert
    expect(updatedTask).toBeDefined();
    expect(updatedTask?.status).toBe('IN_PROGRESS');
  });

  it('should find tasks with filters ', async () => {
    // Arrange
    const projectId = '64acfd6fdcba1f456789abcd';
    await taskModel.create([
      { title: 'Task 1', status: 'OPEN', projectId },
      { title: 'Task 2', status: 'IN_PROGRESS', projectId },
    ]);
    const filters = { projectId };
    const sort = { createdAt: -1 };
  
    // Act
    const tasks = await taskDao.findAllWithFilters(filters, sort, 0, 10);
  
    // Assert
    expect(tasks).toHaveLength(2);
    expect(tasks[0].status).toBe('IN_PROGRESS');
    expect(tasks[1].status).toBe('OPEN');
  });

  it('should count tasks with filters ', async () => {
    // Arrange
    const projectId = '64acfd6fdcba1f456789abcd';
    await taskModel.create([
      { title: 'Task 1', status: 'OPEN', projectId },
      { title: 'Task 2', status: 'IN_PROGRESS', projectId },
    ]);
    const filters = { projectId };

    // Act
    const count = await taskDao.count(filters);

    // Assert
    expect(count).toBe(2);
  });

  it('should update a task ', async () => {
    // Arrange
    const createdTask = await taskModel.create({
      title: 'Update Task',
      description: 'Before update',
      projectId: '64acfd6fdcba1f456789abcd',
    });
    const updateDto = { description: 'After update' };

    // Act
    const updatedTask = await taskDao.update(createdTask._id.toString(), updateDto);

    // Assert
    expect(updatedTask).toBeDefined();
    expect(updatedTask?.description).toBe('After update');
  });

  it('should delete a task ', async () => {
    // Arrange
    const createdTask = await taskModel.create({
      title: 'Delete Task',
      projectId: '64acfd6fdcba1f456789abcd',
    });

    // Act
    const deletedTask = await taskDao.delete(createdTask._id.toString());

    // Assert
    expect(deletedTask).toBeDefined();
    const foundTask = await taskModel.findById(createdTask._id);
    expect(foundTask).toBeNull();
  });
});
