import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  @Input() fields: [{name: string, type: string, label: string, choices?: [{value: boolean, label: string}]}];
  @Input() form: FormGroup;
  @Input() errors: any[];

  constructor() { }

  ngOnInit() {
  }

}
