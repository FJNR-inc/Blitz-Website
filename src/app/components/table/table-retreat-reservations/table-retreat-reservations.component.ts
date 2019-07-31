import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {isNull} from 'util';
import {MyModalService} from '../../../services/my-modal/my-modal.service';
import {Router} from '@angular/router';
import {MyNotificationService} from '../../../services/my-notification/my-notification.service';
import {TranslateService} from '@ngx-translate/core';
import {RetreatReservationService} from '../../../services/retreat-reservation.service';
import {RetreatReservation} from '../../../models/retreatReservation';
import {Retreat} from '../../../models/retreat';
import {User} from '../../../models/user';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';
import {DateUtil} from '../../../utils/date';

@Component({
  selector: 'app-table-retreat-reservations',
  templateUrl: './table-retreat-reservations.component.html',
  styleUrls: ['./table-retreat-reservations.component.scss']
})
export class TableRetreatReservationsComponent implements OnInit {

  @Input() retreat: Retreat = null;
  @Input() user: User = null;
  @Input() hasAddButton: Boolean = false;

  @Output() addButton: EventEmitter<any> = new EventEmitter();

  listRetreatReservations: RetreatReservation[];
  listAdaptedRetreatReservations: any[];

  settings = null;

  constructor(private retreatReservationService: RetreatReservationService,
              private myModalService: MyModalService,
              private notificationService: MyNotificationService,
              private router: Router) { }

  ngOnInit() {
    this.refreshPeriodList();

    this.settings = {
      title: _('table-retreat-reservation.title_table'),
      noDataText: _('table-retreat-reservation.no_reservation'),
      addButton: this.hasAddButton,
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
        },
        {
          name: 'personnal_restrictions',
          title: _('shared.common.personnal_restrictions')
        },
        {
          name: 'inscription_date',
          title: _('shared.common.inscription_date')
        },
      ]
    };
  }

  refreshPeriodList(page = 1, limit = 20) {
    let filter = null;
    if (this.retreat) {
      filter = [{'name': 'retreat', 'value': this.retreat.id}];
    }
    if (this.user) {
      filter = [{'name': 'user', 'value': this.user.id}];
    }
    this.retreatReservationService.list(filter, limit, limit * (page - 1)).subscribe(
      retreatReservations => {
        this.settings.numberOfPage = Math.ceil(retreatReservations.count / limit);
        this.settings.page = page;
        // todo: remove previous and next page on all pagined page.
        this.settings.previous = !isNull(retreatReservations.previous);
        this.settings.next = !isNull(retreatReservations.next);
        this.listRetreatReservations = retreatReservations.results.map(p => new RetreatReservation(p));
        this.listAdaptedRetreatReservations = [];
        for (const retreatReservation of this.listRetreatReservations) {
          this.listAdaptedRetreatReservations.push(this.retreatReservationAdapter(retreatReservation));
        }
      }
    );
  }

  changePage(index: number) {
    this.refreshPeriodList(index);
  }

  retreatReservationAdapter(retreatReservation: RetreatReservation) {

    const inscriptionDate = new Date(retreatReservation.inscription_date);
    const inscription_date = DateUtil.formatDayAndTime(inscriptionDate);

    const reservationAdapted = {
      id: retreatReservation.id,
      url: retreatReservation.url,
      is_present: retreatReservation.is_present,
      is_active: retreatReservation.is_active,
      cancelation_reason: retreatReservation.getCancelationReasonLabel() || '-',
      cancelation_action: retreatReservation.getCancelationActionLabel() || '-',
      personnal_restrictions: retreatReservation.user_details.personnal_restrictions,
      inscription_date: inscription_date
    };

    if (this.retreat) {
      reservationAdapted['name'] = retreatReservation.user_details.getFullName();
    } else if (this.user) {
      reservationAdapted['name'] = retreatReservation.retreat_details.name;
    }

    return reservationAdapted;
  }

  goTo(event) {
    if (this.retreat) {
      for (const retreat of this.listRetreatReservations) {
        if (retreat.id === event.id) {
          this.router.navigate(['/admin/users/' + retreat.user_details.id]);
        }
      }
    }
    if (this.user) {
      for (const retreat of this.listRetreatReservations) {
        if (retreat.id === event.id) {
          if (retreat.cancelation_reason === 'RD') {
            this.toggleModal('retreat_deleted');
          } else {
            this.router.navigate(['/admin/retreats/' + retreat.retreat_details.id]);
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

  addButtonFunction() {
    this.addButton.emit();
  }
}
