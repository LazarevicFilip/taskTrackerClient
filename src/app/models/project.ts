
export interface ProjectModel{
  id?: number;
  name: string;
  startDate: Date
  completionDate: Date
  projectStatus: string;
  projectPriority: string;
  userIds?: number[];
}
