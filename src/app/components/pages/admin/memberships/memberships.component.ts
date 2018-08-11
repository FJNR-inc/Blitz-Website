import { Component, OnInit } from '@angular/core';
import { Membership } from '../../../../models/membership';
import { MembershipService } from '../../../../services/membership.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MyModalService } from '../../../../services/my-modal/my-modal.service';
import { NotificationsService } from 'angular2-notifications';
import { isNull, isString } from 'util';
import { AcademicLevel } from '../../../../models/academicLevel';
import { AcademicLevelService } from '../../../../services/academic-level.service';

@Component({
  selector: 'app-memberships',
  templateUrl: './memberships.component.html',
  styleUrls: ['./memberships.component.scss']
})
export class MembershipsComponent implements OnInit {

  listMemberships: Membership[];
  listAcademicLevels: AcademicLevel[] = [];
  listAdaptedMemberships: any[];
  listAcademicLevelsSelected: string[];

  membershipForm: FormGroup;
  membershipErrors: string[];
  selectedMembershipUrl: string;

  settings = {
    addButton: true,
    editButton: true,
    previous: false,
    next: false,
    numberOfPage: 0,
    page: 0,
    columns: [
      {
        name: 'name',
        title: 'Nom'
      },
      {
        name: 'price',
        title: 'Prix'
      },
      {
        name: 'available',
        title: 'Disponible',
        type: 'boolean'
      }
    ]
  };

  constructor(private membershipService: MembershipService,
              private myModalService: MyModalService,
              private notificationService: NotificationsService,
              private formBuilder: FormBuilder,
              private acdemicLevelService: AcademicLevelService) { }

  ngOnInit() {
    this.refreshMembershipList();
    this.refreshAcademicLevelList();

    this.membershipForm = this.formBuilder.group(
      {
        name: null,
        price: null,
        duration: null,
        academic_levels: [[]],
        available: null,
      }
    );
  }

  changePage(index: number) {
    this.refreshMembershipList(index);
  }

  refreshMembershipList(page = 1, limit = 20) {
    this.membershipService.list(null, limit, limit * (page - 1)).subscribe(
      memberships => {
        this.settings.numberOfPage = Math.ceil(memberships.count / limit);
        this.settings.page = page;
        this.settings.previous = !isNull(memberships.previous);
        this.settings.next = !isNull(memberships.next);
        this.listMemberships = memberships.results.map(o => new Membership(o));
        this.listAdaptedMemberships = [];
        for (const membership of this.listMemberships) {
          this.listAdaptedMemberships.push(this.membershipAdapter(membership));
        }
      }
    );
  }

  refreshAcademicLevelList() {
    this.acdemicLevelService.list().subscribe(
      levels => {
        this.listAcademicLevels = levels.results.map(l => new AcademicLevel(l));
      }
    );
  }

  OpenModalCreateMembership() {
    this.membershipForm.reset();
    this.membershipForm.controls['duration'].setValue('365 00:00:00');
    this.membershipForm.controls['available'].setValue(false);
    this.membershipForm.controls['academic_levels'].setValue([[]]);
    this.selectedMembershipUrl = null;
    this.toogleModal('form_memberships', 'Ajouter un type de membership', 'Créer');
  }

  OpenModalEditMembership(item) {
    for (const membership of this.listMemberships) {
      if (membership.id === item.id) {
        this.membershipForm.controls['name'].setValue(membership.name);
        this.membershipForm.controls['price'].setValue(membership.price);
        this.membershipForm.controls['duration'].setValue(membership.duration);
        this.membershipForm.controls['academic_levels'].setValue(membership.academic_levels);
        this.membershipForm.controls['available'].setValue(membership.available);

        // We keep a copy of the academic_levels list in memory to manage the select multiple
        this.listAcademicLevelsSelected = this.membershipForm.controls['academic_levels'].value;

        this.selectedMembershipUrl = item.url;
        this.toogleModal('form_memberships', 'Éditer un type de membership', 'Éditer');
      }
    }
  }

  submitMembership() {
    if ( this.membershipForm.valid ) {
      const membership = this.membershipForm.value;
      if (!isString(this.membershipForm.controls['academic_levels'].value[0])) {
        membership['academic_levels'] = [];
      }

      if (this.selectedMembershipUrl) {
        this.membershipService.update(this.selectedMembershipUrl, membership).subscribe(
          data => {
            this.notificationService.success('Modifié');
            this.refreshMembershipList();
            this.toogleModal('form_memberships');
          },
          err => {
            if (err.error.non_field_errors) {
              this.membershipErrors = err.error.non_field_errors;
            }
            if (err.error.name) {
              this.membershipForm.controls['name'].setErrors({
                apiError: err.error.name
              });
            }
            if (err.error.price) {
              this.membershipForm.controls['price'].setErrors({
                apiError: err.error.price
              });
            }
            if (err.error.academic_levels) {
              this.membershipForm.controls['academic_levels'].setErrors({
                apiError: err.error.academic_levels
              });
            }
            if (err.error.available) {
              this.membershipForm.controls['available'].setErrors({
                apiError: err.error.available
              });
            }
          }
        );
      } else {
        this.membershipService.create(membership).subscribe(
          data => {
            this.notificationService.success('Ajouté');
            this.refreshMembershipList();
            this.toogleModal('form_memberships');
          },
          err => {
            if (err.error.non_field_errors) {
              this.membershipErrors = err.error.non_field_errors;
            }
            if (err.error.name) {
              this.membershipForm.controls['name'].setErrors({
                apiError: err.error.name
              });
            }
            if (err.error.price) {
              this.membershipForm.controls['price'].setErrors({
                apiError: err.error.price
              });
            }
            if (err.error.academic_levels) {
              this.membershipForm.controls['academic_levels'].setErrors({
                apiError: err.error.academic_levels
              });
            }
            if (err.error.available) {
              this.membershipForm.controls['available'].setErrors({
                apiError: err.error.available
              });
            }
          }
        );
      }
    }
  }

  toogleModal(name, title = '', button2 = '') {
    const modal = this.myModalService.get(name);

    if (!modal) {
      console.error('No modal named %s', name);
      return;
    }

    modal.title = title;
    modal.button2Label = button2;
    modal.toggle();
  }

  membershipAdapter(membership) {
    return {
      id: membership.id,
      url: membership.url,
      name: membership.name,
      price: membership.price,
      available: membership.available,
    };
  }

  showAcademicLevelWarning() {
    if (this.membershipForm) {
      if (this.membershipForm.value['academic_levels'].value) {
        if (this.membershipForm.value['academic_levels'].value.length) {
          return true;
        }
      }
    }
    return false;
  }

  changeAcademicLevel(event) {
    // Update the list of academic level we kept in memory
    const stringValue = event.target.value.split( '\'' )[1];
    const index = this.listAcademicLevelsSelected.indexOf(stringValue);
    if (index > -1) {
      this.listAcademicLevelsSelected.splice(index, 1);
    } else {
      this.listAcademicLevelsSelected.push(stringValue);
    }

    // Refresh the data in form
    this.membershipForm.controls['academic_levels'].setValue(this.listAcademicLevelsSelected);
  }
}
