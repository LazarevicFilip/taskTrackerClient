import { Component, OnInit } from '@angular/core';
import { TaskStatus, Priority } from 'src/app/models/status';
import { ProjectService } from 'src/app/services/project.service';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { AddTaskModel, UpdateStausTask } from 'src/app/models/task';
import { TaskService } from 'src/app/services/task.service';
import {  NgToastService } from 'ng-angular-popup';

import { IDropdownSettings, } from 'ng-multiselect-dropdown';
import { AuthService } from 'src/app/services/auth.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {

  public projects : any = [];
  public users : any = [];
  public initialProjectId!: number;
  public displayUserNames!: string;

  public displayedItem!: (UpdateStausTask | null);
  selectedFile!: File;

  dropdownSettings:IDropdownSettings={};

  public taskStatusArr: string[] = TaskStatus;
  public taskPriorityArr: string[] = Priority;

  addTaskForm!: FormGroup;

  todoTasks: UpdateStausTask[] = [];
  inProgressTasks: UpdateStausTask[] = [];
  doneTasks: UpdateStausTask[] = [];
  myTasks: UpdateStausTask[] = [];

  showAdd!: boolean;
  showEdit!: boolean;

  isChecked: boolean = false;

  constructor(
    private projectService : ProjectService,
    private taskService : TaskService,
    private authService: AuthService,
    private fb: FormBuilder,
    private toast: NgToastService,
    ){
  }
  ngOnInit(): void {
    this.dropdownSettings = {
      idField: 'id',
      textField: 'userName',
    };

    this.addTaskForm = this.fb.group({
      id: [''],
      name: ['',Validators.required],
      userIds: ['',Validators.required],
      status: [0,Validators.required],
      priority: [0,Validators.required],
      description: [''],
    });

    this.projectService.getUserProjects()
    .subscribe(res => {
      this.initialProjectId = res[0].id;
          this.projects = res;
          this.changeProject(this.initialProjectId);
    })
    // .pipe(
    //   switchMap((res: any) => {
    //     this.initialProjectId = res[0].id;
    //     this.projects = res;
    //     this.changeProject(this.initialProjectId);
    //     //return this.projectService.getUsersForProject(this.initialProjectId);
    //   })
    // )
    // .subscribe((res: any) => {
    //   console.log(res);
    //   this.users = res;
    // });

  }
  drop(event: CdkDragDrop<UpdateStausTask[]>) {
    this.taskService.updateTask(event.previousContainer.data[event.previousIndex],event.container.id)
    .subscribe({
      next: (res) => console.log(res),
      error: (er)=>{
        this.toast.error({detail: 'ERROR', summary: 'Something went wrong.' , duration: 5000});
      }
    })
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
  addTask(){
    this.showAdd = true;
    this.showEdit = false;
    const useridsArr = this.addTaskForm.value.userIds.map((x:any) => x.id);
    const task : AddTaskModel = {
      name : this.addTaskForm.value.name,
      status: this.addTaskForm.value.status,
      priority: this.addTaskForm.value.priority,
      description: this.addTaskForm.value.description,
      userIds: useridsArr,
      projectId: this.initialProjectId
    }
    this.taskService.addTask(task)
    .subscribe({
      next: (v) => {
        this.toast.success({detail: 'SUCCESS', summary: 'You have successfully created a task.' , duration: 5000});
        document.getElementById('reset')?.click();
        this.addTaskForm.reset();
        //this.changeProject(this.initialProjectId);
        this.changeToMyProjects(this.isChecked);
      },
      error: (e) => {
        if(e.status === 422){
          this.addTaskForm.reset();
          this.toast.error({detail: 'ERROR', summary: e.error.error[0].errorMessge , duration: 5000})
        }
      },
  })
  }

  deleteTask(id: number){
    this.taskService.deleteTask(id)
    .subscribe(res => {
      this.toast.success({detail: 'SUCCESS', summary: 'Successfully deleted task', duration: 3000});
      //this.changeProject(this.initialProjectId);//2
      this.changeToMyProjects(this.isChecked);
    })
  }
  onEdit(item: UpdateStausTask){
    this.showAdd = false;
    this.showEdit = true;
    this.addTaskForm.controls['id'].setValue(item.id);
    this.addTaskForm.controls['description'].setValue(item.description);
    this.addTaskForm.controls['userIds'].setValue(item.userIds);
    this.addTaskForm.controls['name'].setValue(item.name);
    this.addTaskForm.controls['status'].setValue(TaskStatus.findIndex(x => x === item.status));
    this.addTaskForm.controls['priority'].setValue(Priority.findIndex(x => x === item.priority));

  }
  editTask(){
    const task : UpdateStausTask = this.addTaskForm.value
    if(this.addTaskForm.controls['userIds'].value[0].userName){
      task.userIds = this.addTaskForm.controls['userIds'].value.map((x:any) => x.id);
    }
    task.projectId = this.initialProjectId;
    console.log(task);

    this.taskService.updateTask(task,task.status.toString())
    .subscribe({
      next: (v) => {
        this.toast.success({detail: 'SUCCESS', summary: 'You have successfully updated a task.' , duration: 5000});
        document.getElementById('reset')?.click();
        this.addTaskForm.reset();
        this.changeToMyProjects(this.isChecked);//1
      },
      error: (e) => {
        console.log(e);
        if(e.status === 422){
          this.addTaskForm.reset();
          this.toast.error({detail: 'ERROR', summary: e.error.error[0].errorMessge , duration: 5000})
        }
      },
  })
  }
  changeProject($event: any){
   (document.querySelector('.cb-myTask') as HTMLInputElement).checked = false;
    this.initialProjectId = $event;
    this.projectService.getTasksForProject($event)
    .subscribe(res => {
      console.log(res);
      const userId = this.authService.getUserIdFromToken();
      this.myTasks = res.filter((x: any) => x.userIds.includes(Number(userId)));
      this.todoTasks = res.filter((x : any )=> x.status == 'ToDo');
      this.inProgressTasks = res.filter((x : any )=> x.status == 'InProgress');
      this.doneTasks = res.filter((x : any )=> x.status == 'Done');
    })
    this.projectService.getUsersForProject(this.initialProjectId)
    .subscribe(res => {
      this.users = res;
    });
  }

  clearForm(){
    this.showAdd = true;
    this.showEdit = false;
    this.addTaskForm.reset();
    this.addTaskForm.controls['status'].setValue(0);
    this.addTaskForm.controls['priority'].setValue(0);
    this.addTaskForm.controls['userIds'].setValue(0);
  }
  changeToMyProjects($event: any){
    if(typeof $event != 'boolean'){
      this.isChecked = ($event.target as HTMLInputElement).checked;
    }
    if(this.isChecked){
      this.projectService.getTasksForProject(this.initialProjectId)
      .subscribe(res => {
        console.log(res);
        const userId = this.authService.getUserIdFromToken();
        this.myTasks = res.filter((x: any) => x.userIds.includes(Number(userId)));
  this.todoTasks = this.myTasks.filter((x : any )=> x.status == 'ToDo');
      this.inProgressTasks = this.myTasks.filter((x : any )=> x.status == 'InProgress');
      this.doneTasks = this.myTasks.filter((x : any )=> x.status == 'Done');
      })
    }else{
      this.changeProject(this.initialProjectId);
    }
  }
  displayOne(item: UpdateStausTask){
    (document.querySelector('#file') as HTMLInputElement).value = ''
    this.displayedItem = item;
    const userNames = this.users.filter((x: any ) => this.displayedItem?.userIds?.includes(x.id)).map((x:any) => x.userName).join(', ');
    this.displayUserNames = userNames;
    this.taskService.getTaskFiles(this.displayedItem?.id!)
    .subscribe((res:any) => {
      this.displayedItem!.taskFiles = res;
    })
  }
  onUploadFile($event:any){
    this.selectedFile = $event.target.files[0];
  }
  uploadFile(){
    console.log(this.selectedFile);
    const fileData = new FormData();
    fileData.append('File',this.selectedFile);
    fileData.append('TaskId',this.displayedItem?.id?.toString()!);
    this.taskService.uploadFile(fileData)
    .subscribe({
      next: (res => {
        (document.querySelector('#file') as HTMLInputElement).value = '';
        this.toast.success({detail: 'SUCCESS', summary: 'You have successfully uploaded a file.' , duration: 5000});
        this.displayOne(this.displayedItem!);
      }),
      error: (e => {
        if(e.status === 422){
          this.toast.error({detail: 'ERROR', summary: e.error.error[0].errorMessge , duration: 5000});
        }else{
          this.toast.error({detail: 'ERROR', summary: 'Something went wrong...' , duration: 5000});
        }
      })
    });
  }
  deleteFile(fileName: string){
  console.log(fileName);
   this.taskService.deleteFile(this.displayedItem?.id!,fileName)
   .subscribe({
    next: (res => {
      this.toast.success({detail: 'SUCCESS', summary: 'You have successfully deleted a file.' , duration: 5000});
      this.displayOne(this.displayedItem!);
    }),
    error: (e => {
      this.toast.error({detail: 'ERROR', summary: 'Something went wrong...' , duration: 5000});
    })
   });

  }
}
