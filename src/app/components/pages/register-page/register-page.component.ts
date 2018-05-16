import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AcademicFieldService} from '../../../services/academic-field.service';
import {AcademicField} from '../../../models/academicField';
import {AcademicLevel} from '../../../models/academicLevel';
import {AcademicLevelService} from '../../../services/academic-level.service';
import {Organization} from '../../../models/organization';
import {OrganizationService} from '../../../services/organization.service';
import {UserService} from '../../../services/user.service';
import {Router} from '@angular/router';
import {User} from '../../../models/user';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit {

  registerForm: FormGroup;
  errors: string[];

  listAcademicFields: AcademicField[];
  listAcademicLevels: AcademicLevel[];
  listOrganizations: Organization[];
  years: number[] = [];
  hasSubmit = false;

  constructor(private formBuilder: FormBuilder,
              private academicFieldService: AcademicFieldService,
              private academicLevelService: AcademicLevelService,
              private organizationService: OrganizationService,
              private userService: UserService,
              private router: Router) {
    this.registerForm = this.formBuilder.group(
      {
        email: [null, Validators.required],
        first_name: [null, Validators.required],
        last_name: [null, Validators.required],
        university: [null, Validators.required],
        academic_level: [null, Validators.required],
        academic_field: [null, Validators.required],
        birth_day: [null, Validators.required],
        birth_month: [null, Validators.required],
        birth_year: [null, Validators.required],
        gender: [null, Validators.required],
        password: [null, Validators.required],
        confirmation: [null, Validators.required],
        terms: [null, Validators.required]
      },
      {validator: [
        this.confirmationValidator(),
        this.dayValidator(),
        this.monthValidator(),
        this.yearValidator(),
        this.termsValidator()
      ]}
    );
  }

  confirmationValidator() {
    return (group: FormGroup) => {

      const password = group.controls['password'];
      const confirmation = group.controls['confirmation'];

      if (password.value !== confirmation.value) {
        return confirmation.setErrors({
          apiError: ['La confirmation n\'est pas identique au mot de passe.']
        });
      }
    };
  }

  dayValidator() {
    return (group: FormGroup) => {

      const day = group.controls['birth_day'];

      if (!day.value && day.valid) {
        return day.setErrors({
          apiError: ['Ce champ ne peut pas etre vide.']
        });
      }
    };
  }

  monthValidator() {
    return (group: FormGroup) => {

      const month = group.controls['birth_month'];

      if (!month.value && month.valid) {
        return month.setErrors({
          apiError: ['Ce champ ne peut pas etre vide.']
        });
      }
    };
  }

  yearValidator() {
    return (group: FormGroup) => {

      const year = group.controls['birth_year'];

      if (!year.value && year.valid) {
        return year.setErrors({
          apiError: ['Ce champ ne peut pas etre vide.']
        });
      }
    };
  }

  termsValidator() {
    return (group: FormGroup) => {

      const terms = group.controls['terms'];
      if (terms.value !== true && terms.valid) {
        return terms.setErrors({
          apiError: ['Veuillez accepter les conditions d\'utilisation.']
        });
      }
    };
  }

  ngOnInit() {
    const actualYear = new Date().getFullYear();
    const minYear = actualYear - 120;
    const maxYear = actualYear - 13;

    for (let i = maxYear; i > minYear; i--) {
      this.years.push(i);
    }


    this.academicFieldService.list().subscribe(
      fields => {
        this.listAcademicFields = fields.results.map(f => new AcademicField(f));
      }
    );
    this.academicLevelService.list().subscribe(
      levels => {
        this.listAcademicLevels = levels.results.map(l => new AcademicLevel(l));
      }
    );
    this.organizationService.list().subscribe(
      organizations => {
        this.listOrganizations = organizations.results.map(o => new Organization(o));
      }
    );
  }

  register(form: FormGroup) {
    if ( form.valid ) {
      const birthdate = form.value['birth_year'] + '-' + form.value['birth_month'] + '-' + form.value['birth_day'];
      const user = new User({
        first_name: form.value['first_name'],
        last_name: form.value['last_name'],
        email: form.value['email'],
        university: form.value['university'],
        academic_field: form.value['academic_field'],
        academic_level: form.value['academic_level'],
        birthdate: birthdate,
        gender: form.value['gender'],
      });
      this.userService.create(user, form.value['password']).subscribe(
        data => {
          this.router.navigate(['/']);
        },
        err => {
          console.log(err.error);
          if (err.error.non_field_errors) {
            this.errors = err.error.non_field_errors;
            console.log(this.errors);
          }
          if (err.error.first_name) {
            this.registerForm.controls['first_name'].setErrors({
              apiError: err.error.first_name
            });
          }
          if (err.error.last_name) {
            this.registerForm.controls['last_name'].setErrors({
              apiError: err.error.last_name
            });
          }
          if (err.error.email) {
            this.registerForm.controls['email'].setErrors({
              apiError: err.error.email
            });
          }
          if (err.error.university && err.error.university.name) {
            this.registerForm.controls['university'].setErrors({
              apiError: err.error.university.name
            });
          }
          if (err.error.academic_level && err.error.academic_level.name) {
            this.registerForm.controls['academic_level'].setErrors({
              apiError: err.error.academic_level.name
            });
          }
          if (err.error.academic_field && err.error.academic_field.name) {
            this.registerForm.controls['academic_field'].setErrors({
              apiError: err.error.academic_field.name
            });
          }
          if (err.error.password) {
            this.registerForm.controls['password'].setErrors({
              apiError: err.error.password
            });
          }
        }
      );
    } else {
      console.log(form.valid);
    }
  }
}
