import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {MyNotificationService} from '../../../services/my-notification/my-notification.service';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';
import {AuthenticationService} from '../../../services/authentication.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  constructor(
    private router: Router,
    private notificationService: MyNotificationService,
    private authenticationService: AuthenticationService) { }

  ngOnInit() {
    const isConnected = this.authenticationService.isAuthenticated();

    if (isConnected) {
      this.router.navigate(['/profile']).then();
    }
  }

  authentified() {
    this.notificationService.success(
      _('login-page.notifications.connected.title'),
      _('login-page.notifications.connected.content')
    );
    this.router.navigate(['/profile']).then();
  }

}
