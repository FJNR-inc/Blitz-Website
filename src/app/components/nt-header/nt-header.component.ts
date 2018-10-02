import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';

@Component({
  selector: 'app-nt-header',
  templateUrl: './nt-header.component.html',
  styleUrls: ['./nt-header.component.scss']
})
export class NtHeaderComponent implements OnInit {

  isOpen = false;

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit() {
  }

  toggleHeader() {
    this.isOpen = !this.isOpen;
  }

  closeHeader() {
    this.isOpen = false;
  }

  isAuthenticated() {
    return this.authenticationService.isAuthenticated();
  }
}
