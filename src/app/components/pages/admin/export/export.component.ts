import { Component, OnInit } from '@angular/core';
import {UserService} from '../../../../services/user.service';
import {OrderService} from '../../../../services/order.service';
import {MembershipService} from '../../../../services/membership.service';
import {ReservationPackageService} from '../../../../services/reservation-package.service';
import {OrganizationService} from '../../../../services/organization.service';
import {PeriodService} from '../../../../services/period.service';
import {TimeSlotService} from '../../../../services/time-slot.service';
import {ReservationService} from '../../../../services/reservation.service';
import {AcademicFieldService} from '../../../../services/academic-field.service';
import {AcademicLevelService} from '../../../../services/academic-level.service';
import {WorkplaceService} from '../../../../services/workplace.service';
import {OrderLineService} from '../../../../services/order-line.service';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent implements OnInit {

  numberOfPages: any[] = [];
  limit = 0;

  exports: any;
  selectedExport: any;

  constructor(private userService: UserService,
              private orderService: OrderService,
              private membershipService: MembershipService,
              private reservationPackageService: ReservationPackageService,
              private organizationService: OrganizationService,
              private periodService: PeriodService,
              private timeslotService: TimeSlotService,
              private reservationService: ReservationService,
              private academicFieldService: AcademicFieldService,
              private academicLevelService: AcademicLevelService,
              private workplaceService: WorkplaceService,
              private orderLineService: OrderLineService) { }

  ngOnInit() {
    this.exports = [
      {
        service: this.userService,
        name: _('export.users'),
        code: 'user',
        icon: 'fa fa-user',
      },
      {
        service: this.orderService,
        name: 'export.orders',
        code: 'order',
        icon: 'fas fa-file-invoice-dollar',
      },
      {
        service: this.orderLineService,
        name: 'export.orderlines',
        code: 'orderLine',
        icon: 'fas fa-file-invoice-dollar',
      },
      {
        service: this.reservationPackageService,
        name: 'export.packages',
        code: 'package',
        icon: 'fas fa-hand-holding-usd',
      },
      {
        service: this.membershipService,
        name: 'export.memberships',
        code: 'membership',
        icon: 'fas fa-address-card',
      },
      {
        service: this.organizationService,
        name: 'export.universities',
        code: 'organization',
        icon: 'fas fa-university',
      },
      {
        service: this.periodService,
        name: 'export.periods',
        code: 'period',
        icon: 'far fa-calendar-alt',
      },
      {
        service: this.timeslotService,
        name: 'export.timeslots',
        code: 'timeslot',
        icon: 'far fa-clock',
      },
      {
        service: this.reservationService,
        name: 'export.reservations',
        code: 'timeslotReservation',
        icon: 'far fa-calendar-check',
      },
      {
        service: this.academicLevelService,
        name: 'export.level_of_study',
        code: 'levelOfStudy',
        icon: 'fa fa-graduation-cap',
      },
      {
        service: this.academicFieldService,
        name: 'export.field_of_study',
        code: 'fieldOfStudy',
        icon: 'fa fa-graduation-cap',
      },
      {
        service: this.workplaceService,
        name: 'export.workplaces',
        code: 'workplace',
        icon: 'fas fa-building',
      }
    ];
  }

  exportUser() {
    this.userService.export().subscribe(
      data => {
        this.downloadFile(data);
      }
    );
  }

  export(type: string, pageRequested: number = -1) {
    let pageToGet = 1;
    if (pageRequested > 0) {
      pageToGet = pageRequested;
    }

    for (const exportType of this.exports) {
      if (exportType.code === type) {
        exportType.service.export(pageToGet).subscribe(
          data => {
            console.log(data);

            const numberOfPages = Math.ceil(data.count / data.limit);
            this.numberOfPages = Array.from(Array(numberOfPages), (x, i) => i);
            this.limit = data.limit;
            this.selectedExport = exportType;
            if (pageRequested > 0) {
              window.open(data.file_url);
            }
          }
        );
      }
    }
  }

  downloadFile(data) {
    const blob = new Blob([data], { type: 'application/vnd.ms-excel' });
    const url = window.URL.createObjectURL(blob);
    window.open(url);
  }
}
