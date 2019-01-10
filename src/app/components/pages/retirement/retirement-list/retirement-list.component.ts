import { Component, OnInit } from '@angular/core';
import {RetirementService} from '../../../../services/retirement.service';
import {Retirement} from '../../../../models/retirement';
import {AuthenticationService} from '../../../../services/authentication.service';
import {RetirementReservation} from '../../../../models/retirementReservation';
import {RetirementReservationService} from '../../../../services/retirement-reservation.service';

@Component({
  selector: 'app-retirement-list',
  templateUrl: './retirement-list.component.html',
  styleUrls: ['./retirement-list.component.scss']
})
export class RetirementListComponent implements OnInit {

  retirements: Retirement[];
  retirementReservations: RetirementReservation[];

  constructor(private retirementService: RetirementService,
              private authenticationService: AuthenticationService,
              private retirementReservationService: RetirementReservationService) { }

  ngOnInit() {
    this.refreshRetirements();
    this.refreshRetirementReservations();
  }

  refreshRetirements() {
    const now = new Date().toISOString();
    const filters = [
      {
        'name': 'is_active',
        'value': true
      },
      {
        'name': 'end_time__gte',
        'value': now
      }
    ];
    this.retirementService.list(filters).subscribe(
      data => {
        this.retirements = data.results.map(r => new Retirement(r));
      }
    );
  }

  refreshRetirementReservations() {
    const filters = [
      {
        'name': 'user',
        'value': this.authenticationService.getProfile().id
      }
    ];
    this.retirementReservationService.list(filters).subscribe(
      data => {
        this.retirementReservations = data.results.map(r => new RetirementReservation(r));
      }
    );
  }

  isAlreadyReserved(retirement) {
    for (const reservation of this.retirementReservations) {
      if ( reservation.retirement === retirement.url ) {
        return true;
      }
    }
    return false;
  }
}
