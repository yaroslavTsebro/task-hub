export enum UserTaskStatus {
  PERFORMER = 'PERFORMER',
  OBSERVER = 'OBSERVER',
  ASSISTANT = 'ASSISTANT',
}

export interface IUserTask {
  id: string;
  userId: string;
  taskId: string;
  role: UserTaskStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
