import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DataServiceService } from '../shared/data-service.service';
import { CreateTaskComponent } from './create-task/create-task.component';
import { Task } from './task';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  userInfo: string;
  taskList: Task[] = [];
  pendingTask: Task[] = [];
  inprogressTask: Task[] = [];
  completedTask: Task[] = [];
  constructor(
    private router: Router,
    private ds: DataServiceService,
    private dialog: MatDialog
  ) {
    if (!this.ds.getToken()) {
      this.router.navigate(['']);
    }
    this.userInfo = this.ds.getUsers();
  }

  ngOnInit(): void {
    this.taskList = this.ds.getTask() ? this.ds.getTask() : [];
    this.filterTaskList();
    // this.ds.clearStorage();
  }

  // create task
  createTask() {
    const dialogRef = this.dialog.open(CreateTaskComponent, {
      width: '600px',
      height: '500px',
      disableClose: true,
      data: { label: 'Create Task', data: null }
    })
    dialogRef.afterClosed().subscribe((formData: any) => {
      const FormData = formData.controls;
      const temp: Task = {
        name: FormData.name.value,
        description: FormData.description.value,
        startDate: this.getDateTime(FormData.startDate.value, FormData.startTime.value),
        endDate: this.getDateTime(FormData.endDate.value, FormData.endTime.value),
        status: 'pending',
        id: Math.floor(Math.random() * 10 + 1) + FormData.name.value.split(' ').join()
      }
      this.taskList.push(temp);
      alert('Taks Created Successfully !');
      this.filterTaskList();
    });
  }

  markInProgress(event: boolean, data: Task) {
    if (event) {
      data.status = (data.status && data.status === 'pending') ? 'inprogress' : data.status === 'inprogress' ? 'completed' : 'pending';
      if (data.status === 'completed') {
        data.completedAt = this.getDateTime(new Date(), new Date());
      } else if (data.status === 'inprogress') {
        data.startDate = this.getDateTime(new Date(), new Date());
      }
    }
    this.filterTaskList();
  }

  // delete task
  deleteTask(id: string) {
    this.taskList = this.taskList.filter((_task) => _task.id !== id);
    this.filterTaskList();
  }
  // filter taks list based on status
  filterTaskList(): void {
    if (this.taskList.length) {
      this.pendingTask = this.taskList.filter((_task: Task) => _task.status === 'pending');
      this.pendingTask = this.sortByDate(this.pendingTask, 'endDate');
      this.inprogressTask = this.taskList.filter((_task: Task) => _task.status === 'inprogress');
      this.completedTask = this.taskList.filter((_task: Task) => _task.status === 'completed');
    }
    this.ds.storeTask(this.taskList);
  }
  // time duration, left, completed 
  getDuration(data: Task, status?: string): string {
    const d1: any = new Date(data.endDate);
    let d2: any;
    if (status === 'progress') {
      d2 = new Date(data.startDate);
    } else if (status === 'completed') {
      d2 = new Date(data.completedAt);
    } else {
      d2 = new Date(data.startDate);
    }
    // const diffTime: number = <number>Math.abs(d1 - d2);
    // const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    // return diffDays + ' days';
    let delta = Math.abs(d1 - d2) / 1000;
    const days = Math.floor(delta / 86400);
    delta -= days * 86400;
    const hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;
    const minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;
    // const seconds = delta % 60;
    return `${days} days ${hours} hrs ${minutes} min.`;
  }
  getDateTime(_date: Date, _time: Date): Date {
    const DATE = new Date(_date);
    const TIME = new Date(_time);
    const date = `${DATE.getFullYear()}-${DATE.getMonth()}-${DATE.getDate()}`; // YYYY-mm-dd
    const time = `${TIME.getHours()}:${TIME.getMinutes()}:${TIME.getSeconds()}`; // HH:MM:SS
    const dateTime = new Date(date + ' ' + time);
    return dateTime;
  }
  getTotalTime(data: Task): string {
    const endDate: any = new Date(data.completedAt);
    const completedDate: any = new Date(data.startDate);
    const timeLeft: any = endDate - completedDate;
    let delta = timeLeft / 1000;
    const days = Math.floor(delta / 86400);
    delta -= days * 86400;
    const hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;
    const minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;
    const seconds = Math.floor(delta % 60);
    return `${days} days ${hours} hrs ${minutes} min ${seconds} sec.`;
  }
  sortByDate(data: Task[], key: string): Task[] {
    if (data.length) {
      let _data: Task[] = [];
      _data = data.sort((a, b) => {
        const _a: any = new Date(a[key]);
        const _b: any = new Date(b[key]);
        return _a - _b;
      });
      console.log(_data);
      return _data;
    } else {
      return data;
    }
  }
  checkTimeExceed(data: Task): boolean {
    const currentTime: any = new Date();
    const startTime: any = new Date(data.startDate);
    return currentTime < startTime ? true : false;
  }
  getShortName(name: string): string {
    let sn = '';
    if (name) {
      sn = name.charAt(0).toUpperCase();
      return sn;
    } else {
      this.userInfo = 'Unknown'
      return sn = 'U';
    }
  }
  logout() {
    this.ds.clearSession();
    this.router.navigate(['']);
  }
}
