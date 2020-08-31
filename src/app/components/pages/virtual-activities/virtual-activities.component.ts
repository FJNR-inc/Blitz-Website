import { Component, OnInit } from '@angular/core';
import {RetreatTypeService} from '../../../services/retreat-type.service';
import {RetreatType} from '../../../models/retreatType';

@Component({
  selector: 'app-virtual-activities',
  templateUrl: './virtual-activities.component.html',
  styleUrls: ['./virtual-activities.component.scss']
})
export class VirtualActivitiesComponent implements OnInit {

  retreatTypes: RetreatType[];

  constructor(private retreatTypeService: RetreatTypeService) { }

  ngOnInit() {
    const filter = [
      {
        name: 'is_virtual',
        value: 'true',
      }
    ];
    this.retreatTypeService.list(filter).subscribe(
      (retreatTypes) => {
        this.retreatTypes = retreatTypes.results.map(o => new RetreatType(o));
      }
    );
  }

}
