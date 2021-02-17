import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Task } from '../task';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss']
})
export class CreateTaskComponent {
  taskForm: FormGroup;
  today = new Date();
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.initializeForm();
  }

  initializeForm(): void {
    this.taskForm = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl(''),
      startDate: new FormControl(new Date()),
      endDate: new FormControl(''),
      startTime: new FormControl(new Date()),
      endTime: new FormControl('')
    });
  }
}
