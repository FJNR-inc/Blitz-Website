import {Component, Input, OnInit} from '@angular/core';
import {RetreatReservation} from '../../../../models/retreatReservation';

@Component({
  selector: 'app-profile-reservation-open',
  templateUrl: './profile-reservation-open.component.html',
  styleUrls: ['./profile-reservation-open.component.scss']
})
export class ProfileReservationOpenComponent implements OnInit {

  @Input() reservation: RetreatReservation = null;

  constructor() { }

  ngOnInit() {}

  goToVideoconference() {
    window.open(this.reservation.retreat_details.videoconference_link, '_blank');
  }
}
