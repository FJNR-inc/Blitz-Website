import { Component, OnInit } from '@angular/core';
import { TimeSlot } from '../../../../models/timeSlot';
import { TimeSlotService } from '../../../../services/time-slot.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {ReservationService} from '../../../../services/reservation.service';
import {Reservation} from '../../../../models/reservation';
import {User} from '../../../../models/user';
import {MyModalService} from '../../../../services/my-modal/my-modal.service';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';
import {AuthenticationService} from '../../../../services/authentication.service';
import {isNull} from 'util';
import {UserService} from '../../../../services/user.service';
import {OrderService} from '../../../../services/order.service';
import {Cart} from '../../../../models/cart';

@Component({
  selector: 'app-timeslot',
  templateUrl: './timeslot.component.html',
  styleUrls: ['./timeslot.component.scss']
})
export class TimeslotComponent implements OnInit {

  createReservationLabel = _('timeslot.create_reservation');
  bypassPayment = false;
  noUniversity = _('retreat.add_user_modal.no_university');
  waitAPI = false;
  errorOrder: any[];

  timeslot: TimeSlot;
  listReservations: Reservation[];
  selectedReservation: any;
  selectedUser: User;
  errors: string[];
  userFilters = [];
  listUsers: User[];

  limitChoices = [10, 20, 100, 1000];
  limit = 10;
  page = 1;

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
    addButton: true,
    editButton: true,
    noDataText: _('timeslot.no_reservation'),
    title: _('timeslot.list_reservations'),
    previous: false,
    next: false,
    numberOfPage: 0,
    page: 0,
    columns: [
      {
        name: 'first_name',
        title: _('timeslot.common.first_name')
      },
      {
        name: 'last_name',
        title: _('timeslot.common.last_name')
      },
      {
        name: 'is_active',
        title: _('timeslot.common.active'),
        type: 'boolean'
      },
      {
        name: 'is_present',
        title: _('timeslot.common.present'),
        type: 'boolean'
      },
      {
        name: 'cancelation_reason',
        title: _('timeslot.common.reason')
      }
    ]
  };

  constructor(private timeslotService: TimeSlotService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private reservationService: ReservationService,
              private myModalService: MyModalService,
              private authenticationService: AuthenticationService,
              private userService: UserService,
              private orderService: OrderService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.timeslotService.get(params['id']).subscribe(
        timeslot => {
          this.timeslot = new TimeSlot(timeslot);
          this.refreshReservation();
        }
      );
    });

    if (this.authenticationService.isAdmin()) {
      this.settings['clickable'] = true;
    }
  }

  goToUser(event) {
    this.router.navigate(['/admin/users/' + event.id]);
  }

  refreshReservation() {
    const filters = [
      {
        'name': 'timeslot',
        'value': this.timeslot.id
      },
      {
        'name': 'ordering',
        'value': 'user__first_name'
      }
    ];
    this.reservationService.list(filters).subscribe(
      reservations => {
        this.listReservations = reservations.results.map(
          r => this.reservationAdapter(new Reservation(r))
        );
      }
    );
  }

  reservationAdapter(reservation) {
    const user = new User(reservation.user_details);

    return {
      id: user.id,
      url: reservation.url,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      is_active: reservation.is_active,
      is_present: reservation.is_present,
      cancelation_reason: reservation.getCancelationReasonLabel()
    };
  }

  editReservation(reservation) {
    this.selectedReservation = reservation;
    this.toggleModal('reservation_edition');
  }

  openModalReservation() {
    this.resetUserData();
    this.refreshUserList();
    this.selectedUser = null;
    this.toggleModal('select_user');
  }

  addReservation() {
    if (this.selectedUser) {
       const cart = new Cart();
       cart.addTimeslot(this.timeslot);
       cart.setBypassPayment(this.bypassPayment);
       cart.setTargetUser(this.selectedUser);

       this.orderService.create(cart.generateOrder()).subscribe(
         () => {
           this.refreshReservation();
           this.toggleModal('select_user');
         },
         err => {
           this.waitAPI = false;
           this.errorOrder = [];
           if (err.error.non_field_errors) {
             this.errorOrder = err.error.non_field_errors;
           } else {
             this.errorOrder = this.errorOrder.concat([_('shared.form.errors.unknown')]);
             if (err.error.order_lines) {
               for (const orderLine of err.error.order_lines) {
                 if (orderLine.object_id) {
                   this.errorOrder = this.errorOrder.concat(orderLine.object_id);
                 }
               }
             }
           }
         }
       );
    }
  }

  resetUserData() {
    this.listUsers = null;
  }

  unselectUser() {
    this.selectedUser = null;
    this.errors = null;
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

  selectUser(user) {
    this.selectedUser = user;
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

  userAdapter(users) {
    const usersAdapted = [];
    for (let user of users) {
      user = {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        university: user.getUniversity(),
        is_active: user.is_active,
        url: user.url
      };
      usersAdapted.push(user);
    }
    return usersAdapted;
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

  submitReservation(is_present) {
    const value = new Reservation({'is_present': is_present});
    this.reservationService.update(this.selectedReservation.url, value).subscribe(
      data => {
        this.toggleModal('reservation_edition');
        this.refreshReservation();
      },
      err => {
        if (err.error.non_field_errors) {
          this.errors = err.error.non_field_errors;
        } else if (err.error.is_present) {
          this.errors = err.error.is_present;
        }
      }
    );
  }

  toggleModal(name) {
    const modal = this.myModalService.get(name);

    if (!modal) {
      return;
    }

    modal.toggle();
  }
}
