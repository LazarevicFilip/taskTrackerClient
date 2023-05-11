import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ProjectModel } from 'src/app/models/project';
import { Priority, ProjectStatus } from 'src/app/models/status';
import { UserRegisterModel } from 'src/app/models/user-register.model';
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

  projectsDdl: { id: number; name: string }[] = [];

  perPage: number = 5;
  currentPage: number = 1;

  users: any;
  showAdd!: boolean;
  showEdit!: boolean

  dropdownSettingsProject:IDropdownSettings={};
  dropdownSettingsEmployee:IDropdownSettings={};

  addProjectForm!: FormGroup;
  addEmployeeForm!: FormGroup;

  public projectStatusArr: string[] = ProjectStatus;
  public projectPriorityArr: string[] = Priority;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private toast: NgToastService,
    private authService: AuthService){

  }
  ngOnInit(): void {
    this.dropdownSettingsProject = {
      idField: 'id',
      textField: 'userName',
    };
    this.dropdownSettingsEmployee = {
      idField: 'id',
      textField: 'name',
    };

    this.addProjectForm = this.fb.group({
      id: [''],
      name: ['',Validators.required],
      userIds: ['',Validators.required],
      projectStatus: [0,Validators.required],
      projectPriority: [0,Validators.required],
      startDate: ['',Validators.required],
      completionDate: ['']
    });

    this.addEmployeeForm = this.fb.group({
      userName: ['',[Validators.required,Validators.pattern(/^(?=[a-zA-Z0-9._]{3,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/)]],
      firstName: ['',[Validators.required,Validators.pattern(/^[A-Z][a-z]{2,}(\s[A-Z][a-z]{2,})*$/)]],
      lastName: ['',[Validators.required,Validators.pattern(/^[A-Z][a-z]{2,}(\s[A-Z][a-z]{2,})*$/)]],
      email: ['',[Validators.required,Validators.email]],
      projectIds: [''],
      password: ['',[Validators.required,Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
      rePassowrd: ['',[Validators.required]]
    },
    {
      validators: this.password.bind(this)
    });

    this.getAllProjects(false);

    this.getAllUsers();
  }
  getAllUsers(){
    this.authService.getAllUsers()
    .subscribe(res => {
      this.users = res;
    });
  }
  password(formGroup: FormGroup){
    const  password  = formGroup.controls['password'];
    const confirmPassword  = formGroup.controls['rePassowrd'];
    return password.value === confirmPassword.value ? null : { passwordNotMatch: true };
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
     this.projectsDdl = res.data.map((item: { id: number; name: string }) => ({ id: item.id, name: item.name }));
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
  addEmployee(){
    const projectIdsArr = this.addEmployeeForm.value.projectIds != '' ? this.addEmployeeForm.value.projectIds?.map((x:any) => x.id) : null;
    const employee : UserRegisterModel = {
      userName: this.addEmployeeForm.value['userName'],
      firstName: this.addEmployeeForm.value['firstName'],
      lastName: this.addEmployeeForm.value['lastName'],
      email: this.addEmployeeForm.value['email'],
      password: this.addEmployeeForm.value['password'],
      projectIds: projectIdsArr,
    }
    console.log(employee);
    this.authService.register(employee)
    .subscribe({
      next: (res) => {
        this.toast.success({detail: 'SUCCESS', summary: res.message, duration: 5000});
        this.addEmployeeForm.reset();
        document.getElementById('reset2')?.click();
        this.getAllProjects(false);
        this.getAllUsers();
      },
      error: (err) => {
        this.toast.error({detail: 'ERROR', summary: err.error.error[0].errorMessge, duration: 5000});
      }
    })
  }

}
