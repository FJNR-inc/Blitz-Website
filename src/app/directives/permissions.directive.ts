import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

@Directive({
  selector: '[appHasPermissions]'
})
export class PermissionsDirective implements OnInit {

  @Input() appHasPermissions: string[];
  element: ElementRef = null;

  constructor(element: ElementRef,
              private authenticationService: AuthenticationService) {
    this.element = element;
  }

  ngOnInit() {
    if (!this.authenticationService.hasPermissions(this.appHasPermissions)) {
      this.element.nativeElement.style.display = 'none';
    }
  }
}
