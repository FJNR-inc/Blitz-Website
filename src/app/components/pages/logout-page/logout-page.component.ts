import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../services/authentication.service';
import {TranslateService} from '@ngx-translate/core';
import {MyNotificationService} from '../../../services/my-notification/my-notification.service';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';


@Component({
  selector: 'app-logout',
  templateUrl: 'logout-page.component.html',
  styleUrls: []
})
export class LogoutPageComponent {

  constructor(private router: Router,
              private notificationService: MyNotificationService,
              private authenticationService: AuthenticationService,
              private translate: TranslateService) {
    this.authenticationService.logout().subscribe(
      data => {
        this.authenticationService.removeToken();
        this.authenticationService.setProfile('');
        this.notificationService.error(
          _('logout-page.notifications.disconnected.title'),
          _('logout-page.notifications.disconnected.content')
        );
        this.router.navigate(['/']);
      }
    );
  }
}
