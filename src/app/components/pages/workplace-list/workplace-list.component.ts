import {Component, OnInit} from '@angular/core';
import {WorkplaceService} from '../../../services/workplace.service';
import {Workplace} from '../../../models/workplace';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';

interface HardcodedWorplace {
  url: string;
  name: any;
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
      name: _('workplace-list.pilots.sud-west'),
    },
    {
      url: 'https://www.thesez-vous.com/projets-pilotes.html',
      name: _('workplace-list.pilots.sherbrooke'),
    },
    {
      url: 'https://www.thesez-vous.com/projets-pilotes.html',
      name: _('workplace-list.pilots.quebec'),
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
