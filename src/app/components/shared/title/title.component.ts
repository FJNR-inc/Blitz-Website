import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss']
})
export class TitleComponent implements OnInit {

  @Input() level: number;
  @Input() text: string;
  @Input() type: string;
  @Input() for: string;
  @Input() inline = false;

  constructor() { }

  ngOnInit() {
  }

}
