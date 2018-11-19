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

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent implements OnInit {

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
              private workplaceService: WorkplaceService) { }

  ngOnInit() {
  }

  exportUser() {
    this.userService.export().subscribe(
      data => {
        this.downloadFile(data);
      }
    );
  }

  exportOrder() {
    this.orderService.export().subscribe(
      data => {
        this.downloadFile(data);
      }
    );
  }

  exportMembership() {
    this.membershipService.export().subscribe(
      data => {
        this.downloadFile(data);
      }
    );
  }

  exportPackage() {
    this.reservationPackageService.export().subscribe(
      data => {
        this.downloadFile(data);
      }
    );
  }

  exportOrganization() {
    this.organizationService.export().subscribe(
      data => {
        this.downloadFile(data);
      }
    );
  }

  exportPeriod() {
    this.periodService.export().subscribe(
      data => {
        this.downloadFile(data);
      }
    );
  }

  exportTimeslot() {
    this.timeslotService.export().subscribe(
      data => {
        this.downloadFile(data);
      }
    );
  }

  exportReservation() {
    this.reservationService.export().subscribe(
      data => {
        this.downloadFile(data);
      }
    );
  }

  exportAcademicField() {
    this.academicFieldService.export().subscribe(
      data => {
        this.downloadFile(data);
      }
    );
  }

  exportAcademicLevel() {
    this.academicLevelService.export().subscribe(
      data => {
        this.downloadFile(data);
      }
    );
  }

  exportWorkplace() {
    this.workplaceService.export().subscribe(
      data => {
        this.downloadFile(data);
      }
    );
  }

  downloadFile(data: Response) {
    const blob = new Blob([data], { type: 'application/vnd.ms-excel' });
    const url = window.URL.createObjectURL(blob);
    window.open(url);
  }
}
