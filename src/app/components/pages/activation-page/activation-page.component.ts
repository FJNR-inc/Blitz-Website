import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AuthenticationService } from '../../../services/authentication.service';

@Component({
  selector: 'app-activation-page',
  templateUrl: './activation-page.component.html',
  styleUrls: ['./activation-page.component.scss']
})
export class ActivationPageComponent implements OnInit {

  success: boolean = null;

  constructor(private activatedRoute: ActivatedRoute,
              private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.authenticationService.activate(params['token']).subscribe(
        data => {
          this.success = true;
        },
        error => {
          this.success = false;
        }
      );
    });
  }

}
