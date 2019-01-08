import {Component, Input, OnInit} from '@angular/core';
import {isNull} from 'util';
import {MyModalService} from '../../../services/my-modal/my-modal.service';
import {Router} from '@angular/router';
import {MyNotificationService} from '../../../services/my-notification/my-notification.service';
import {TranslateService} from '@ngx-translate/core';
import {RetirementReservationService} from '../../../services/retirement-reservation.service';
import {RetirementReservation} from '../../../models/retirementReservation';
import {Retirement} from '../../../models/retirement';
import {User} from '../../../models/user';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';

@Component({
  selector: 'app-table-retirement-reservations',
  templateUrl: './table-retirement-reservations.component.html',
  styleUrls: ['./table-retirement-reservations.component.scss']
})
export class TableRetirementReservationsComponent implements OnInit {

  @Input() retirement: Retirement = null;
  @Input() user: User = null;

  listRetirementReservations: RetirementReservation[];
  listAdaptedRetirementReservations: any[];

  settings = {
    title: _('table-retirement-reservation.title_table'),
    noDataText: _('table-retirement-reservation.no_reservation'),
    clickable: true,
    previous: false,
    next: false,
    numberOfPage: 0,
    page: 0,
    columns: [
      {
        name: 'name',
        title: _('shared.common.name')
      },
      {
        name: 'is_present',
        title: _('shared.common.present'),
        type: 'boolean'
      },
      {
        name: 'is_active',
        title: _('shared.common.canceled'),
        type: 'boolean'
      },
      {
        name: 'cancelation_reason',
        title: _('shared.common.reason')
      },
      {
        name: 'cancelation_action',
        title: _('shared.common.action')
      }
    ]
  };

  constructor(private retirementReservationService: RetirementReservationService,
              private myModalService: MyModalService,
              private notificationService: MyNotificationService,
              private router: Router) { }

  ngOnInit() {
    this.refreshPeriodList();
  }

  refreshPeriodList(page = 1, limit = 20) {
    let filter = null;
    if (this.retirement) {
      filter = [{'name': 'retirement', 'value': this.retirement.id}];
    }
    if (this.user) {
      filter = [{'name': 'user', 'value': this.user.id}];
    }
    this.retirementReservationService.list(filter, limit, limit * (page - 1)).subscribe(
      retirementReservations => {
        this.settings.numberOfPage = Math.ceil(retirementReservations.count / limit);
        this.settings.page = page;
        // todo: remove previous and next page on all pagined page.
        this.settings.previous = !isNull(retirementReservations.previous);
        this.settings.next = !isNull(retirementReservations.next);
        this.listRetirementReservations = retirementReservations.results.map(p => new RetirementReservation(p));
        this.listAdaptedRetirementReservations = [];
        for (const retirementReservation of this.listRetirementReservations) {
          this.listAdaptedRetirementReservations.push(this.retirementReservationAdapter(retirementReservation));
        }
      }
    );
  }

  changePage(index: number) {
    this.refreshPeriodList(index);
  }

  retirementReservationAdapter(retirementReservation) {
    const reservationAdapted = {
      id: retirementReservation.id,
      url: retirementReservation.url,
      name: retirementReservation.user_details.getFullName(),
      is_present: retirementReservation.is_present,
      is_active: retirementReservation.is_active,
      cancelation_reason: retirementReservation.getCancelationReasonLabel() || '-',
      cancelation_action: retirementReservation.getCancelationActionLabel() || '-'
    };

    return reservationAdapted;
  }

  goTo(event) {
    if (this.retirement) {
      for (const retirement of this.listRetirementReservations) {
        if (retirement.id === event.id) {
          this.router.navigate(['/admin/users/' + retirement.user_details.id]);
        }
      }
    }
    if (this.user) {
      for (const retirement of this.listRetirementReservations) {
        if (retirement.id === event.id) {
          if (retirement.cancelation_reason === 'RD') {
            this.toggleModal('retirement_deleted');
          } else {
            this.router.navigate(['/admin/retirements/' + retirement.retirement_details.id]);
          }
        }
      }
    }
  }

  toggleModal(name) {
    const modal = this.myModalService.get(name);

    if (!modal) {
      console.error('No modal named %s', name);
      return;
    }

    modal.toggle();
  }
}
