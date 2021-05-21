import {Component, Input, OnInit} from '@angular/core';
import {RetreatReservation} from '../../../../models/retreatReservation';
import {RetreatReservationService} from '../../../../services/retreat-reservation.service';

@Component({
  selector: 'app-profile-reservation-open',
  templateUrl: './profile-reservation-open.component.html',
  styleUrls: ['./profile-reservation-open.component.scss']
})
export class ProfileReservationOpenComponent implements OnInit {

  @Input() reservation: RetreatReservation = null;

  constructor(private retreatReservationService: RetreatReservationService) { }

  ngOnInit() {}

  goToVideoconference() {
    this.retreatReservationService.logActivity(this.reservation.url).subscribe(
      () => {
        window.open(this.reservation.retreat_details.videoconference_link, '_blank');
      },
      () => {
        window.open(this.reservation.retreat_details.videoconference_link, '_blank');
      }
    );
  }
}
