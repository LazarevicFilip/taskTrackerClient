import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ProjectModel } from 'src/app/models/project';
import { Priority, ProjectStatus } from 'src/app/models/status';
import { AuthService } from 'src/app/services/auth.service';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
  projects: ProjectModel[] = [];
  pagesCount: number[] = [];

  perPage: number = 5;
  currentPage: number = 1;

  users: any;
  showAdd!: boolean;
  showEdit!: boolean

  dropdownSettings:IDropdownSettings={};

  addProjectForm!: FormGroup;

  public projectStatusArr: string[] = ProjectStatus;
  public projectPriorityArr: string[] = Priority;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private toast: NgToastService,
    private authService: AuthService){

  }
  ngOnInit(): void {
    this.dropdownSettings = {
      idField: 'id',
      textField: 'userName',
    };

    this.addProjectForm = this.fb.group({
      id: [''],
      name: ['',Validators.required],
      userIds: ['',Validators.required],
      projectStatus: [0,Validators.required],
      projectPriority: [0,Validators.required],
      startDate: ['',Validators.required],
      completionDate: ['']
    })

    this.getAllProjects(false);

    this.authService.getAllUsers()
    .subscribe(res => {
      this.users = res;
    })
  }
  setCurrentPage(page: number){
    if(page <= 0) page = 1;
    if(page > this.pagesCount.length) page = this.pagesCount.length
    this.currentPage = page;
    this.getAllProjects(false);
  }
  getAllProjects(x : boolean){
    this.projectService.getAllProjects(this.currentPage, this.perPage)
    .subscribe(res => {
      console.log(res)
     this.projects = res.data.sort((a:any,b:any)=> b.id - a.id );
     this.pagesCount =Array.from({length: res.pagesCount}, (_, i) => i + 1);
     if(x){
      this.currentPage = res.pagesCount;
      this.getAllProjects(false);
     }
    });
  }
  addProject(){
    const useridsArr = this.addProjectForm.value.userIds.map((x:any) => x.id);
    const project : ProjectModel = {
      name: this.addProjectForm.value['name'],
      startDate: this.addProjectForm.value['startDate'],
      completionDate: this.addProjectForm.value['completionDate'],
      projectStatus: this.addProjectForm.value['projectStatus'],
      projectPriority: this.addProjectForm.value['projectPriority'],
      userIds: useridsArr
    }
    this.projectService.addProject(project)
    .subscribe({
      next: (v) => {
        this.toast.success({detail: 'SUCCESS', summary: 'You have successfully created a task.' , duration: 5000});
        document.getElementById('reset')?.click();
        this.addProjectForm.reset();
        this.getAllProjects(true);
      },
      error: (e) => {
        if(e.status === 422){
          this.addProjectForm.reset();
          this.toast.error({detail: 'ERROR', summary: e.error.error[0].errorMessge , duration: 5000})
        }
      },
    })
  }
  deleteProject(id: number){
    this.projectService.deleteProject(id)
    .subscribe({
      next: (res)=>{
        this.toast.success({detail: 'SUCCESS', summary: 'Successfully deleted task', duration: 3000});
        this.getAllProjects(true);
      },
      error: (e) => {
        if(e.status === 409)
        this.toast.error({detail: 'ERROR', summary: e.error.error, duration: 3000});
      }
    })
  }
  clearForm(){
    this.showAdd = true;
    this.showEdit = false;
    this.addProjectForm.reset();
    this.addProjectForm.controls['projectStatus'].setValue(0);
    this.addProjectForm.controls['projectPriority'].setValue(0);
    this.addProjectForm.controls['userIds'].setValue(0);
  }
  onEdit(item: ProjectModel){
    this.showAdd = false;
    this.showEdit = true;
    this.addProjectForm.controls['id'].setValue(item.id);
    this.addProjectForm.controls['userIds'].setValue(item.userIds);
    this.addProjectForm.controls['name'].setValue(item.name);
    this.addProjectForm.controls['completionDate'].setValue(item.completionDate?.toString().split("T")[0]);
    this.addProjectForm.controls['startDate'].setValue(item.startDate.toString().split("T")[0]);
    this.addProjectForm.controls['projectStatus'].setValue(ProjectStatus.findIndex(x => x === item.projectStatus));
    this.addProjectForm.controls['projectPriority'].setValue(Priority.findIndex(x => x === item.projectPriority));
  }
  editProject(){
    const project : ProjectModel = this.addProjectForm.value;
    if(this.addProjectForm.controls['userIds'].value[0].userName){
      project.userIds = this.addProjectForm.controls['userIds'].value.map((x:any) => x.id);
    }
    this.projectService.updateProject(project.id!,project)
    .subscribe({
      next: (v) => {
        this.toast.success({detail: 'SUCCESS', summary: 'You have successfully updated a project.' , duration: 5000});
        this.addProjectForm.reset();
        document.getElementById('reset')?.click();
        this.getAllProjects(false);
      },
      error: (e) => {
        console.log(e);
        if(e.status === 422){
          this.toast.error({detail: 'ERROR', summary: e.error.error[0].errorMessge , duration: 5000})
        }
      },
  })
  }

}
