import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

@Directive({
  selector: '[appIsAuthenticated]'
})
export class AuthenticatedDirective implements OnInit {

  @Input() appIsAuthenticated: boolean;
  element: ElementRef = null;

  constructor(element: ElementRef,
              private authenticationService: AuthenticationService) {
    this.element = element;
  }

  ngOnInit() {
    if (this.authenticationService.isAuthenticated() !== this.appIsAuthenticated) {
      this.element.nativeElement.style.display = 'none';
    }
  }
}
