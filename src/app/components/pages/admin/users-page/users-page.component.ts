import { Component, OnInit } from '@angular/core';
import { User } from '../../../../models/user';
import { UserService } from '../../../../services/user.service';
import { Router } from '@angular/router';
import {isNull} from "util";

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.scss']
})
export class UsersPageComponent implements OnInit {

  listUsers: User[];

  settings = {
    clickable: true,
    previous: false,
    next: false,
    numberOfPage: 0,
    page: 0,
    columns: [
      {
        name: 'first_name',
        title: 'Prénom'
      },
      {
        name: 'last_name',
        title: 'Nom'
      },
      {
        name: 'email',
        title: 'Courriel'
      },
      {
        name: 'university',
        title: 'Université'
      },
      {
        name: 'is_active',
        title: 'Actif',
        type: 'boolean'
      }
    ]
  };

  constructor(private userService: UserService,
              private router: Router) { }

  ngOnInit() {
    this.refreshUserList();
  }

  changePage(index: number) {
    this.refreshUserList(index);
  }

  refreshUserList(page = 1, limit = 20) {
    this.userService.list(limit, limit * (page - 1)).subscribe(
      users => {
        this.settings.numberOfPage = Math.ceil(users.count / limit);
        this.settings.page = page;
        this.settings.previous = !isNull(users.previous);
        this.settings.next = !isNull(users.next);
        this.listUsers = this.userAdapter(users.results.map(u => new User(u)));
        }
    );
  }

  userAdapter(users) {
    const usersAdapted = [];
    for (let user of users) {
      console.log(user);
      user = {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        university: user.getUniversity(),
        is_active: user.is_active
      };
      usersAdapted.push(user);
    }
    return usersAdapted;
  }

  selectUser(user) {
    this.router.navigate(['/admin/users/' + user.id]);
  }
}
