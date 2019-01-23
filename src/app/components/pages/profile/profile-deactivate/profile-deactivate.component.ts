import { Component, OnInit } from '@angular/core';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';
import {UserService} from '../../../../services/user.service';
import {MyNotificationService} from '../../../../services/my-notification/my-notification.service';
import {AuthenticationService} from '../../../../services/authentication.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-profile-deactivate',
  templateUrl: './profile-deactivate.component.html',
  styleUrls: ['./profile-deactivate.component.scss']
})
export class ProfileDeactivateComponent implements OnInit {

  constructor(private userService: UserService,
              private notificationService: MyNotificationService,
              private authenticationService: AuthenticationService,
              private router: Router) { }

  ngOnInit() {
  }

  deactivateAccount() {
    this.userService.remove(this.authenticationService.getProfile()).subscribe(
      data => {
        this.notificationService.success(
          _('shared.notifications.deactivate_profile.title'),
          _('shared.notifications.deactivate_profile.content')
        );
        this.router.navigate(['/logout']);
      },
      err => {
        this.notificationService.error(
          _('shared.notifications.fail_deactivation.title'),
          _('shared.notifications.fail_deactivation.content')
        );
      }
    );
  }
}
