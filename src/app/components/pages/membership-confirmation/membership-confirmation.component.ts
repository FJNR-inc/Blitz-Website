import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {AuthenticationService} from '../../../services/authentication.service';

@Component({
  selector: 'app-membership-confirmation',
  templateUrl: './membership-confirmation.component.html',
  styleUrls: ['./membership-confirmation.component.scss']
})
export class MembershipConfirmationComponent implements OnInit {

  menuActive = 2;
  success = null;

  constructor(private authenticationService: AuthenticationService,
              private activatedRoute: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    if (this.authenticationService.isAuthenticated()) {
      this.router.navigate(['/membership/subscription']);
    }
    this.activatedRoute.params.subscribe((params: Params) => {
      this.authenticationService.activate(params['token']).subscribe(
        data => {
          this.success = true;
          this.authenticationService.setProfile(data.user);
          this.authenticationService.setToken(data.token);
        },
        error => {
          this.success = false;
        }
      );
    });
  }

}
