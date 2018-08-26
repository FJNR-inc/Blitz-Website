import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-nt-wizzard',
  templateUrl: './nt-wizzard.component.html',
  styleUrls: ['./nt-wizzard.component.scss']
})
export class NtWizzardComponent implements OnInit {

  @Input() items: any[];
  @Input() active: number;

  constructor() { }

  ngOnInit() {
    if (this.active !== null) {
      let count = 0;
      for (const item of this.items) {
        if (count === this.active) {
          item.actived = true;
          break;
        } else {
          item.completed = true;
          count += 1;
        }
      }
    }
  }

  getIndex() {
    if (this.active) {
      return this.active + 1;
    } else {
      return 0;
    }
  }
}
