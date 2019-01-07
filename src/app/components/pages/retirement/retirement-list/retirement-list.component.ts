import { Component, OnInit } from '@angular/core';
import {RetirementService} from '../../../../services/retirement.service';
import {Retirement} from '../../../../models/retirement';

@Component({
  selector: 'app-retirement-list',
  templateUrl: './retirement-list.component.html',
  styleUrls: ['./retirement-list.component.scss']
})
export class RetirementListComponent implements OnInit {

  retirements: Retirement[];

  constructor(private retirementService: RetirementService) { }

  ngOnInit() {
    this.refreshRetirements();
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
}
