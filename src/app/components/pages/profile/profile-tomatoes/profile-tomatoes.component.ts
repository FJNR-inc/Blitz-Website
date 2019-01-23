import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-profile-tomatoes',
  templateUrl: './profile-tomatoes.component.html',
  styleUrls: ['./profile-tomatoes.component.scss']
})
export class ProfileTomatoesComponent implements OnInit {

  @Input() totalPastTomatoes;
  @Input() totalFutureTomatoes;

  constructor() { }

  ngOnInit() {
  }

}
