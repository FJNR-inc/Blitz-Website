import {Component, OnInit} from '@angular/core';
import {RightPanelService} from '../../../services/right-panel.service';
import {Retreat} from '../../../models/retreat';
import {TimeSlot} from '../../../models/timeSlot';

@Component({
  selector: 'app-right-panel-container',
  templateUrl: './right-panel-container.component.html',
  styleUrls: ['./right-panel-container.component.scss']
})
export class RightPanelContainerComponent implements OnInit {

  currentPanel: string;

  get product(): Retreat | TimeSlot {
    return this._rightPanelService.product;
  }

  get productType(): 'TimeSlot' | 'Retreat' {
    return this.product instanceof TimeSlot ? 'TimeSlot' : 'Retreat';
  }

  constructor(private _rightPanelService: RightPanelService) {
  }

  ngOnInit() {
    this._rightPanelService.currentPanel$.subscribe(
      (currentPanel: string) => {
        this.currentPanel = currentPanel;
      }
    );
  }

  close() {
    this._rightPanelService.closePanel();
  }

  openCart() {
    this._rightPanelService.openCartPanel();
  }

  authenticate() {
    this._rightPanelService.authenticate();
  }

  finalize() {
    this._rightPanelService.finalize();
  }

}
