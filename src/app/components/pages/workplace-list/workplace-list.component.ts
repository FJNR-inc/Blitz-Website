import {Component, OnInit} from '@angular/core';
import {WorkplaceService} from '../../../services/workplace.service';
import {Workplace} from '../../../models/workplace';

interface HardcodedWorplace {
  url: string;
  name: string;
}

@Component({
  selector: 'app-workplace-list',
  templateUrl: './workplace-list.component.html',
  styleUrls: ['./workplace-list.component.scss']
})
export class WorkplaceListComponent implements OnInit {

  workplaces: Workplace[];

  hardcodedWorkplaces: HardcodedWorplace[] = [
    {
      url: 'https://www.thesez-vous.com/projets-pilotes.html',
      name: 'L\'ESPACE PILOTE SAINT-HENRI',
    },
    {
      url: 'https://www.thesez-vous.com/projets-pilotes.html',
      name: 'L\'ESPACE PILOTE SHERBROOKE',
    },
    {
      url: 'https://www.thesez-vous.com/projets-pilotes.html',
      name: 'L\'ESPACE PILOTE québec',
    },
  ];

  constructor(private workplaceService: WorkplaceService) {
  }

  ngOnInit() {

    this.workplaceService.list().subscribe(
      (data) => {
        this.workplaces = data.results;
        this.workplaces.push();
      }
    );
  }

}
