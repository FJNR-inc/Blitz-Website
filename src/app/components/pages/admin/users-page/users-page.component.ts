import { Component, OnInit } from '@angular/core';
import { User } from '../../../../models/user';
import { UserService } from '../../../../services/user.service';
import { Router } from '@angular/router';
import { MyModalService } from '../../../../services/my-modal/my-modal.service';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.scss']
})
export class UsersPageComponent implements OnInit {

  listUsers: User[];

  settings = {
    clickable: true,
    addButton: true,
    editButton: true,
    removeButton: true,
    columns: [
      {
        name: 'first_name',
        title: 'Prenom'
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
        title: 'Universite'
      },
      {
        name: 'is_active',
        title: 'Actif',
        type: 'boolean'
      }
    ]
  };

  constructor(private userService: UserService,
              private router: Router,
              private myModalService: MyModalService) { }

  ngOnInit() {
    this.userService.list().subscribe(
      users => {
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

  createUser() {
    const modal = this.myModalService.get('create_user');

    if (!modal) {
      console.error('No modal named %s', 'create_user');
      return;
    }

    modal.toggle();
  }
}
