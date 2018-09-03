import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent implements OnInit {

  haveReadTerms = false;

  @Input() name: string;
  @Input() title: string;
  @Input() typeModal: string;
  @Input() button2Label: string;
  @Input() maxWidth = '95%';

  @Output() button2: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onScroll(event) {
    if (event.target.scrollTop + event.target.offsetHeight >= event.target.scrollHeight) {
      this.haveReadTerms = true;
    }
  }

  acceptTerms(): void {
    this.button2.emit(null);
  }
}
