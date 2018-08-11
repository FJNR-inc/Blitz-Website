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
  sponsorsList = [
    {
      'imageUrl': '../../../../assets/images/temp/partners/partners1.jpg',
      'name': '',
    },
    {
      'imageUrl': '../../../../assets/images/temp/partners/partners2.jpg',
      'name': '',
    },
    {
      'imageUrl': '../../../../assets/images/temp/partners/partners3.jpg',
      'name': '',
    },
    {
      'imageUrl': '../../../../assets/images/temp/partners/partners4.png',
      'name': '',
    },
    {
      'imageUrl': '../../../../assets/images/temp/partners/partners5.jpg',
      'name': '',
    },
    {
      'imageUrl': '../../../../assets/images/temp/partners/partners6.jpg',
      'name': '',
    },
    {
      'imageUrl': '../../../../assets/images/temp/partners/partners7.jpg',
      'name': '',
    },
    {
      'imageUrl': '../../../../assets/images/temp/partners/partners8.jpg',
      'name': '',
    },
    {
      'imageUrl': '../../../../assets/images/temp/partners/partners9.jpg',
      'name': '',
    },
    {
      'imageUrl': '../../../../assets/images/temp/partners/partners10.jpg',
      'name': '',
    },
    {
      'imageUrl': '../../../../assets/images/temp/partners/partners11.jpg',
      'name': '',
    },
    {
      'imageUrl': '../../../../assets/images/temp/partners/partners12.jpg',
      'name': '',
    },
    {
      'imageUrl': '../../../../assets/images/temp/partners/partners13.gif',
      'name': '',
    },
    {
      'imageUrl': '../../../../assets/images/temp/partners/partners14.jpg',
      'name': '',
    },
    {
      'imageUrl': '../../../../assets/images/temp/partners/partners15.png',
      'name': '',
    },
    {
      'imageUrl': '../../../../assets/images/temp/partners/partners16.png',
      'name': '',
    },
    {
      'imageUrl': '../../../../assets/images/temp/partners/partners17.jpg',
      'name': '',
    },
    {
      'imageUrl': '../../../../assets/images/temp/partners/partners18.png',
      'name': '',
    },
    {
      'imageUrl': '../../../../assets/images/temp/partners/partners19.jpg',
      'name': '',
    },
    {
      'imageUrl': '../../../../assets/images/temp/partners/partners20.gif',
      'name': '',
    },
    {
      'imageUrl': '../../../../assets/images/temp/partners/partners21.jpg',
      'name': '',
    },
    {
      'imageUrl': '../../../../assets/images/temp/partners/partners22.png',
      'name': '',
    },
    {
      'imageUrl': '../../../../assets/images/temp/partners/partners23.png',
      'name': '',
    },
    {
      'imageUrl': '../../../../assets/images/temp/partners/partners24.png',
      'name': '',
    },
    {
      'imageUrl': '../../../../assets/images/temp/partners/partners25.jpg',
      'name': '',
    }
  ];

  constructor(private workplaceService: WorkplaceService) { }

  ngOnInit() {
    this.workplaceService.list().subscribe(
      workplaces => {
        this.workplaceList = workplaces.results.map(w => new Workplace(w));
      }
    );
  }
}
