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
