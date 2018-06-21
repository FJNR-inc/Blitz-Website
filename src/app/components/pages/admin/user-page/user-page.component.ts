import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../../../services/user.service';
import { User } from '../../../../models/user';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss']
})
export class UserPageComponent implements OnInit {

  user: User;

  settings = {
    columns: [
      {
        name: 'workplace',
        title: 'Espace de travail'
      },
      {
        name: 'start_event',
        title: 'Date et heure'
      }
    ]
  };

  fakeData = [
    {
      workplace: 'Espace della vitta',
      start_event: 'Samedi 23 juin 2018 (09 h 00 - 12 h 00) ',
    },
    {
      workplace: 'Espace della vitta',
      start_event: 'Dimanche 24 juin 2018 (14 h 00 - 17 h 00) ',
    },
  ];

  constructor(private activatedRoute: ActivatedRoute,
              private userService: UserService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.userService.get(params['id']).subscribe(
        data => {
          this.user = new User(data);
        }
      );
    });
  }

}
