import { Component, OnInit } from '@angular/core';
import { Membership } from '../../../../models/membership';
import { MembershipService } from '../../../../services/membership.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MyModalService } from '../../../../services/my-modal/my-modal.service';
import { NotificationsService } from 'angular2-notifications';
import { isNull } from 'util';
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

  membershipForm: FormGroup;
  membershipErrors: string[];
  selectedMembershipUrl: string;

  settings = {
    addButton: true,
    editButton: true,
    removeButton: true,
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
        academic_level: ['none'],
      }
    );
  }

  changePage(index: number) {
    this.refreshMembershipList(index);
  }

  refreshMembershipList(page = 1, limit = 20) {
    this.membershipService.list(limit, limit * (page - 1)).subscribe(
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
    this.selectedMembershipUrl = null;
    this.toogleModal('form_memberships', 'Ajouter un type d\'adhésion', 'Créer');
  }

  OpenModalEditMembership(item) {
    for (const membership of this.listMemberships) {
      if (membership.id === item.id) {
        this.membershipForm.controls['name'].setValue(membership.name);
        this.membershipForm.controls['price'].setValue(membership.price);
        this.membershipForm.controls['duration'].setValue(membership.duration);
        this.membershipForm.controls['academic_level'].setValue(membership.academic_level);
        if (membership.academic_level === null) {
          this.membershipForm.controls['academic_level'].setValue('none');
        } else {
          this.membershipForm.controls['academic_level'].setValue(membership.academic_level);
        }
        this.selectedMembershipUrl = item.url;
        this.toogleModal('form_memberships', 'Éditer un type d\'adhésion', 'Éditer');
      }
    }
  }

  submitMembership() {
    if ( this.membershipForm.valid ) {
      const membership = this.membershipForm.value;
      if (this.membershipForm.controls['academic_level'].value === 'none') {
        membership['academic_level'] = null;
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
              console.log(this.membershipErrors);
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
              console.log(this.membershipErrors);
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
          }
        );
      }
    }
  }

  removeMembership(item) {
    this.membershipService.remove(item).subscribe(
      data => {
        this.notificationService.success('Supprimé', 'Le type d\'adhésion a bien été supprimé.');
        this.refreshMembershipList();
      },
      err => {
        this.notificationService.error('Erreur', 'Echec de la tentative de suppression.');
      }
    );
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
    };
  }

  showAcademicLevelWarning() {
    if (this.membershipForm) {
      for (const level of this.listAcademicLevels) {
        if (level.url === this.membershipForm.value['academic_level']) {
          return true;
        }
      }
    }
    return false;
  }
}
