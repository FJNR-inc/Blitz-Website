import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';

export interface IFormField {
  name: string;
  type: string;
  label: string;
  choices?: IFormFieldChoice[];
}

export interface IFormFieldChoice {
  value: boolean;
  label: string;
}

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  @Input() fields: IFormField[];
  @Input() form: FormGroup;
  @Input() errors: any[];

  constructor() { }

  ngOnInit() {
  }

}
