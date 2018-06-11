import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Workplace } from '../../../../models/workplace';
import { WorkplaceService } from '../../../../services/workplace.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TimeSlot } from '../../../../models/timeSlot';
import { TimeSlotService } from '../../../../services/time-slot.service';

@Component({
  selector: 'app-workplace',
  templateUrl: './workplace.component.html',
  styleUrls: ['./workplace.component.scss']
})
export class WorkplaceComponent implements OnInit {

  workplace: Workplace;
  listTimeslots: TimeSlot[];
  isACreation: boolean;

  workplaceForm: FormGroup;
  errors: string[];

  locationForm: FormGroup;

  settings = {
    addButton: true,
    editButton: true,
    removeButton: true,
    columns: [
      {
        name: 'period',
        title: 'Periode'
      },
      {
        name: 'day',
        title: 'Jour'
      },
      {
        name: 'start',
        title: 'Debut'
      },
      {
        name: 'end',
        title: 'Fin'
      },
      {
        name: 'price',
        title: 'Prix'
      }
    ]
  };

  constructor(private activatedRoute: ActivatedRoute,
              private workplaceService: WorkplaceService,
              private timeSlotService: TimeSlotService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.isACreation = false;
      this.workplaceService.get(params['id']).subscribe(
        data => {
          this.workplace = new Workplace(data);
          this.initForms();
          this.timeSlotService.list(params['id']).subscribe(
            timeslots => {
              this.listTimeslots = timeslots.results.map(
                t => this.timeSlotAdapter(new TimeSlot(t))
              );
            }
          );
        }
      );
    });
  }

  initForms() {
    this.initWorkplaceForm();
    this.initLocationForm();
  }

  initWorkplaceForm() {
    this.workplaceForm = this.formBuilder.group(
      {
        name: this.workplace.name,
        details: this.workplace.details,
        seats: this.workplace.seats,
      }
    );
  }

  initLocationForm() {
    this.locationForm = this.formBuilder.group(
      {
        address_line_1: this.workplace.location.address_line1,
        address_line_2: this.workplace.location.address_line2,
        postal_code: this.workplace.location.postal_code,
        city: this.workplace.location.city,
        state_province: this.workplace.location.state_province.name,
        country: this.workplace.location.country.name
      }
    );
  }

  timeSlotAdapter(timeSlot) {
    return {
      id: timeSlot.id,
      day: timeSlot.getStartDay(),
      start: timeSlot.getStartTime(),
      end: timeSlot.getEndTime(),
      period: timeSlot.period.name,
      price: timeSlot.price
    };
  }

}
