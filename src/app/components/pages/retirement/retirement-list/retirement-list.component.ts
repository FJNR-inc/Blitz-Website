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

  retirementsInCart = [];

  constructor(private retirementService: RetirementService) { }

  ngOnInit() {
    this.refreshRetirements();
  }

  refreshRetirements() {
    this.retirementService.list().subscribe(
      data => {
        this.retirements = data.results.map(r => new Retirement(r));
      }
    );
  }

  addToCart(retirement) {
    this.retirementsInCart.push(retirement);
  }
}
