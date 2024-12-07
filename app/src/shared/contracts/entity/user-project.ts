export enum UserProjectRole {
  OWNER = 'OWNER',
  WORKER = 'WORKER',
  ADMIN = 'ADMIN',
  VIEWER = 'VIEWER',
}

export interface IUserProject {
  id: string;
  userId: string;
  projectId: string;
  role: UserProjectRole;
  createdAt?: Date;
  updatedAt?: Date;
}
