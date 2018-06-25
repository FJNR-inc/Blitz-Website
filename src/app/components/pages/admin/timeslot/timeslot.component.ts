import { Component, OnInit } from '@angular/core';
import { TimeSlot } from '../../../../models/timeSlot';
import { TimeSlotService } from '../../../../services/time-slot.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-timeslot',
  templateUrl: './timeslot.component.html',
  styleUrls: ['./timeslot.component.scss']
})
export class TimeslotComponent implements OnInit {

  timeslot: TimeSlot;

  settings = {
    clickable: true,
    noDataText: 'Aucune réservation pour le moment',
    title: 'Liste des réservations:',
    columns: [
      {
        name: 'first_name',
        title: 'Prénom'
      },
      {
        name: 'last_name',
        title: 'Nom'
      },
      {
        name: 'email',
        title: 'Courriel',
      }
    ]
  };

  constructor(private timeslotService: TimeSlotService,
              private activatedRoute: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.timeslotService.get(params['id']).subscribe(
        timeslot => {
          this.timeslot = new TimeSlot(timeslot);
        }
      );
    });
  }

  goToUser(event) {
    this.router.navigate(['/admin/users/' + event.id]);
  }
}
