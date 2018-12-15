import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-icon-info',
  templateUrl: './icon-info.component.html',
  styleUrls: ['./icon-info.component.scss']
})
export class IconInfoComponent implements OnInit {

  @Input() link;

  constructor() { }

  ngOnInit() {
  }

}
