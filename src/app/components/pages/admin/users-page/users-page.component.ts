import { Component, OnInit } from '@angular/core';
import { User } from '../../../../models/user';
import { UserService } from '../../../../services/user.service';
import { Router } from '@angular/router';
import { isNull } from 'util';
import {Membership} from '../../../../models/membership';
import {MembershipService} from '../../../../services/membership.service';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.scss']
})
export class UsersPageComponent implements OnInit {

  listUsers: User[];
  listMemberships: Membership[];
  userFilters = [];

  filters = [
    {
      display: 'Prénom',
      name: 'first_name',
      comparators: [
        {
          display: 'contient',
          name: 'contain'
        },
        {
          display: 'est egal a',
          name: 'equal_to'
        }
      ]
    },
    {
      display: 'Université',
      name: 'university',
      comparators: [
        {
          display: 'est',
          name: 'is'
        },
        {
          display: 'n\'est pas',
          name: 'is_not'
        }
      ]
    },
  ];

  settings = {
    noDataText: _('users-page.no_users'),
    allowFiltering: false,
    clickable: true,
    previous: false,
    next: false,
    numberOfPage: 0,
    page: 0,
    columns: [
      {
        name: 'first_name',
        title: _('users-page.common.first_name')
      },
      {
        name: 'last_name',
        title: _('users-page.common.last_name')
      },
      {
        name: 'email',
        title: _('users-page.common.email')
      },
      {
        name: 'university',
        title: _('users-page.common.university')
      },
      {
        name: 'is_active',
        title: _('users-page.common.active'),
        type: 'boolean'
      }
    ]
  };

  limitChoices = [10, 20, 100, 1000];
  limit = 20;
  page = 1;

  constructor(private userService: UserService,
              private router: Router,
              private membershipService: MembershipService) { }

  ngOnInit() {
    this.refreshUserList();
    this.refreshMembershipList();
  }

  changePage(index: number) {
    this.page = index;
    this.refreshUserList();
  }

  changeLimit(event) {
    this.limit = event;
    this.page = 1;
    this.refreshUserList();
  }

  refreshUserList(page = this.page, limit = this.limit) {
    this.resetUserData();
    this.userService.list(this.userFilters, limit, limit * (page - 1)).subscribe(
      users => {
        this.settings.numberOfPage = Math.ceil(users.count / limit);
        this.settings.page = page;
        this.settings.previous = !isNull(users.previous);
        this.settings.next = !isNull(users.next);
        this.listUsers = this.userAdapter(users.results.map(u => new User(u)));
        }
    );
  }

  refreshMembershipList() {
    this.membershipService.list().subscribe(
      memberships => {
        this.listMemberships = memberships.results.map(o => new Membership(o));
      }
    );
  }

  userAdapter(users) {
    const usersAdapted = [];
    for (let user of users) {
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

  updateFilters(filters) {
    this.userFilters = [];

    for (const filter of filters) {
        const newFilter = {
          'name': filter.name,
          'comparator': 'contain',
          'value': filter.value
        };
        this.userFilters.push(newFilter);
    }
    this.refreshUserList();
  }

  updateFilter(name, value) {
    let update = false;
    for (const filter of this.userFilters) {
      if (filter.name === name) {
        filter.value = value;
        update = true;
      }
    }
    if (!update) {
      const newFilter = {
        name: name,
        value: value
      };
      this.userFilters.push(newFilter);
    }
    this.refreshUserList();
  }

  resetUserData() {
    this.listUsers = null;
  }
}
