import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-newsletter-success',
  templateUrl: './newsletter-success.component.html',
  styleUrls: ['./newsletter-success.component.scss']
})
export class NewsletterSuccessComponent implements OnInit {

  @Input()
  emailNewsletter: string;

  @Output()
  goBackButton: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

}
