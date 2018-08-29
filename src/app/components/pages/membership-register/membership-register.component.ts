import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AcademicField} from '../../../models/academicField';
import {Organization} from '../../../models/organization';
import {AcademicLevel} from '../../../models/academicLevel';
import {AcademicFieldService} from '../../../services/academic-field.service';
import {OrganizationService} from '../../../services/organization.service';
import {AcademicLevelService} from '../../../services/academic-level.service';
import {UserService} from '../../../services/user.service';
import {Router} from '@angular/router';
import {MyModalService} from '../../../services/my-modal/my-modal.service';
import {User} from '../../../models/user';
import {AuthenticationService} from '../../../services/authentication.service';

@Component({
  selector: 'app-membership-register',
  templateUrl: './membership-register.component.html',
  styleUrls: ['./membership-register.component.scss']
})
export class MembershipRegisterComponent implements OnInit {


  menu = [
    {
      'name': 'Informations'
    },
    {
      'name': 'Vérification'
    },
    {
      'name': 'Confirmation'
    },
    {
      'name': 'Abonnement'
    },
    {
      'name': 'Résumé'
    },
    {
      'name': 'Paiement'
    }
  ];

  menuActive = 0;

  registerForm: FormGroup;
  errors: string[];

  listAcademicFields: AcademicField[];
  listAcademicLevels: AcademicLevel[];
  listOrganizations: Organization[];
  years: number[] = [];
  hasSubmit = false;

  selectedUniversity: Organization;

  validatedTerms = false;

  constructor(private formBuilder: FormBuilder,
              private academicFieldService: AcademicFieldService,
              private academicLevelService: AcademicLevelService,
              private organizationService: OrganizationService,
              private userService: UserService,
              private router: Router,
              private myModalService: MyModalService,
              private authenticationService: AuthenticationService) {
    this.registerForm = this.formBuilder.group(
      {
        email: [null, Validators.required],
        first_name: [null, Validators.required],
        last_name: [null, Validators.required],
        university: ['none'],
        academic_level: [null],
        academic_field: [null],
        birth_day: ['', Validators.required],
        birth_month: ['', Validators.required],
        birth_year: ['', Validators.required],
        gender: [null, Validators.required],
        password: [null, Validators.required],
        confirmation: [null, Validators.required],
      },
      {validator: [
        this.confirmationValidator(),
        this.monthValidator(),
        this.yearValidator(),
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

  ngOnInit() {
    if (this.authenticationService.isAuthenticated()) {
      this.router.navigate(['/membership/subscription']);
    }
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

  submit() {
    if (this.validatedTerms === true) {
      this.register();
    } else {
      this.toogleModal();
    }
  }

  toogleModal() {
    const name = 'form_terms';
    const modal = this.myModalService.get(name);

    if (!modal) {
      console.error('No modal named %s', name);
      return;
    }

    modal.button2Label = 'Accepter';
    modal.toggle();
  }

  acceptTerms() {
    this.validatedTerms = true;
    this.toogleModal();
    this.submit();
  }

  register() {
    this.hasSubmit = true;
    const form = this.registerForm;
    if ( form.valid ) {
      const birthdate = form.value['birth_year'] + '-' + form.value['birth_month'] + '-' + form.value['birth_day'];
      const userData = {
        first_name: form.value['first_name'],
        last_name: form.value['last_name'],
        email: form.value['email'],
        birthdate: birthdate,
        gender: form.value['gender'],
      };
      if (form.value['university'] !== 'none') {
        userData['university'] = form.value['university'];
      }
      if (form.value['academic_field'] !== 'none') {
        userData['academic_field'] = form.value['academic_field'];
      }
      if (form.value['academic_level'] !== 'none') {
        userData['academic_level'] = form.value['academic_level'];
      }

      const user = new User(userData);
      this.userService.create(user, form.value['password']).subscribe(
        data => {
          this.router.navigate(['/membership/verification']);
        },
        err => {
          if (err.error.non_field_errors) {
            this.errors = err.error.non_field_errors;
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
          if (err.error.academic_level) {
            if (err.error.academic_level.name) {
              this.registerForm.controls['academic_level'].setErrors({
                apiError: err.error.academic_level.name
              });
            } else {
              this.registerForm.controls['academic_level'].setErrors({
                apiError: err.error.academic_level
              });
            }
          }
          if (err.error.academic_field) {
            if (err.error.academic_field.name) {
              this.registerForm.controls['academic_field'].setErrors({
                apiError: err.error.academic_field.name
              });
            } else {
              this.registerForm.controls['academic_field'].setErrors({
                apiError: err.error.academic_field
              });
            }
          }
          if (err.error.password) {
            this.registerForm.controls['password'].setErrors({
              apiError: err.error.password
            });
          }
        }
      );
    }
  }

  changeUniversity() {
    this.selectedUniversity = null;
    for (const university of this.listOrganizations) {
      if (university.name === this.registerForm.controls['university'].value) {
        this.selectedUniversity = university;
        this.registerForm.controls['email'].setErrors(null);
      }
    }
  }

  goToLoginPage() {
    this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url }});
  }
}
