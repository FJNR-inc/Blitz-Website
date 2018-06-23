import { Directive, HostListener, Input } from '@angular/core';
import { MyModalService } from '../services/my-modal/my-modal.service';

@Directive({
  selector: '[appMyModalOpen]'
})
export class MyModalOpenDirective {
  @Input() appMyModalOpen: string;

  constructor(private myModals: MyModalService) {
  }

  @HostListener('click') onClick() {
    const modal = this.myModals.get(this.appMyModalOpen);

    if (!modal) {
      console.error('No modal named %s', this.appMyModalOpen);
      return;
    }

    modal.toggle();
  }
}
