import {InternationalizationService} from '../services/internationalization.service';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Injectable} from '@angular/core';
import {isBoolean} from 'util';

@Injectable()
export class FormUtil {

  formBuilder = new FormBuilder();

  static manageFormErrors(form: FormGroup, errors) {
    for (const key of Object.keys(form.controls)) {
      if (errors.error[key]) {
        form.controls[key].setErrors({
          apiError: errors.error[key]
        });
      }
    }

    return form;
  }

  static isCompleted(form: FormGroup, fields) {
    for (const field of fields) {
      if (field.type !== 'alert') {
        if (!form.controls[field.name].value) {
          console.log(form.controls[field.name].value);
          return false;
        }
      }
    }
    return true;
  }

  constructor() { }

  createFormGroup(fields) {
    const form = this.formBuilder.group(
      this.getControlsConfig(fields)
    );

    for (const field of fields) {
      if (field.type === 'choices') {
        const formArray = form.get(field.name) as FormArray;
        for (const choice of field.choices) {
          formArray.push(new FormControl(choice.value));
        }
      } else if (field.type === 'checkbox') {
        form.controls[field.name].setValue(false);
      }
    }

    return form;
  }

  getControlsConfig(fields) {
    const controlsConfig = [];
    for (const field of fields) {
      if (field.type === 'choices') {
        controlsConfig[field.name] = this.formBuilder.array([]);
      } else if (field.type !== 'alert') {
        controlsConfig[field.name] = null;
      }
    }
    return controlsConfig;
  }
}
