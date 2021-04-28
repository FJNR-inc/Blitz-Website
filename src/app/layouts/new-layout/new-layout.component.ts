import {Component, OnInit} from '@angular/core';
import {RightPanelService} from '../../services/right-panel.service';

@Component({
  selector: 'app-new-layout',
  template: `
    <div class="new-layout">
      <div class="new-layout__nav">
        <app-nt-header></app-nt-header>
      </div>

      <div class="new-layout__container" [ngStyle]="{ width: 'calc(100% - 300px - ' + getWidthRightPanel() + ')' }">
          <div>
            <router-outlet></router-outlet>
          </div>

          <app-newsletter-footer></app-newsletter-footer>
      </div>

      <div class="new-layout__right-panel">
        <app-right-panel-container></app-right-panel-container>
      </div>
    </div>
  `,
  styleUrls: ['new-layout.component.scss'],
})
export class NewLayoutComponent implements OnInit {

  isRightPanelOpen = false;

  constructor(private _rightPanelService: RightPanelService) {
  }

  ngOnInit() {
    this._rightPanelService.currentPanel$.subscribe(
      (currentPanel: string) => {
        this.isRightPanelOpen = !!currentPanel;
        console.log(this.getWidthRightPanel());
      }
    );
  }

  getWidthRightPanel() {
    if (this.isRightPanelOpen) {
      return '490px';
    } else {
      return '0px';
    }
  }
}
