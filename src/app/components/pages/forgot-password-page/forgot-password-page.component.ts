import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AuthenticationService} from '../../../services/authentication.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-forgot-password-page',
  templateUrl: './forgot-password-page.component.html',
  styleUrls: ['./forgot-password-page.component.scss']
})
export class ForgotPasswordPageComponent {

  forgotForm: FormGroup;
  errors: string;

  constructor(private formBuilder: FormBuilder,
              private authenticationService: AuthenticationService,
              private router: Router) {
    this.forgotForm = this.formBuilder.group(
      {
        email: null,
      }
    );
  }

  resetPassword(form: FormGroup) {
    if ( form.valid ) {
      this.authenticationService.resetPassword(form.value['email']).subscribe(
        data => {
          console.log('success');
          this.router.navigate(['/forgot-password/confirmation']);
        },
        err => {
          console.log(err.error);
          if (err.error.non_field_errors) {
            this.errors = err.error.non_field_errors;
            console.log(this.errors);
          }
          if (err.error.email) {
            this.forgotForm.controls['email'].setErrors({
              apiError: err.error.email
            });
          }
        }
      );
    }
  }

}
