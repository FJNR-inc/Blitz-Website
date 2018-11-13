import {InternationalizationService} from '../services/internationalization.service';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Injectable} from '@angular/core';

@Injectable()
export class FormUtil {

  formBuilder = new FormBuilder();

  static manageFormErrors(form: FormGroup, errors) {
    for (const key of Object.keys(form.controls)) {
      if (form[key].type !== 'alert') {
        if (errors.error[key]) {
          form.controls[key].setErrors({
            apiError: errors.error[key]
          });
        }
      }
    }

    return form;
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
