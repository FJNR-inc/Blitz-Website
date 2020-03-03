import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MyNotificationService} from '../../../services/my-notification/my-notification.service';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {

  returnUrl: string;

  constructor(
    private router: Router,
    private notificationService: MyNotificationService,
    private activatedRoute: ActivatedRoute
  ) {
    this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/profile';

  }

  authentified() {
    this.notificationService.success(
      _('login-page.notifications.connected.title'),
      _('login-page.notifications.connected.content')
    );
    this.router.navigate([this.returnUrl]).then();
  }
}
