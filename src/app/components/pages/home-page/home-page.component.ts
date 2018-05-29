import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { WorkplaceService } from '../../../services/workplace.service';
import { Workplace } from '../../../models/workplace';


@Component({
  selector: 'app-home',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class HomePageComponent implements OnInit {

  workplaceList: Workplace[];

  constructor(private workplaceService: WorkplaceService) { }


  ngOnInit() {
    this.workplaceService.list().subscribe(
      workplaces => {
        this.workplaceList = workplaces.results.map(w => new Workplace(w));
      }
    );
  }
}
