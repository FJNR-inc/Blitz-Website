import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MyModalService } from '../../services/my-modal/my-modal.service';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';

@Component({
  selector: 'app-nt-modal',
  templateUrl: './nt-modal.component.html',
  styleUrls: ['./nt-modal.component.scss']
})
export class NtModalComponent implements OnInit {

  @Input() name: string;
  @Input() title;
  @Input() typeModal: string;
  @Input() button1Label = null;
  @Input() button2Label = null;
  @Input() maxWidth = '95%';
  @Input() activated = true;
  @Input() autoClose = false;
  @Input() show = false;

  @ViewChild('modalContent') modalContent;

  @Output() button1: EventEmitter<any> = new EventEmitter();
  @Output() button2: EventEmitter<any> = new EventEmitter();
  @Output() onClose: EventEmitter<any> = new EventEmitter();

  isModalInformation: boolean;
  isModalForm: boolean;

  errorMessage: string;

  constructor(private myModals: MyModalService) {
  }

  ngOnInit() {
    this.isModalInformation = this.typeModal === 'information';
    this.isModalForm = this.typeModal === 'form';

    this.myModals.set(this.name, this);
  }

  clickOverlay(event: Event) {
    const target = (event.target as HTMLElement);

    if (target.classList.contains('modal-component')) {
      this.toggle();
    }
  }

  setErrorMessage(value: string) {
    this.errorMessage = value;
  }

  close() {
    this.show = false;
  }

  toggle() {
    this.show = !this.show;

    if (this.show) {
      document.addEventListener('keyup', this.escapeListener);
    } else {
      this.onClose.emit(null);
      document.removeEventListener('keyup', this.escapeListener);
      this.errorMessage = '';
    }
  }

  private escapeListener = (event: KeyboardEvent) => {
    if (event.which === 27 || event.keyCode === 27) {
      this.show = false;
    }
  }

  clickButton1(): void {
    this.button1.emit(null);
    if (this.autoClose) {
      this.toggle();
    }
  }

  clickButton2(): void {
    this.button2.emit(null);
    if (this.autoClose) {
      this.toggle();
    }
  }

  getLabelButton1() {
    if (this.button1Label) {
      return this.button1Label;
    } else {
      return _('shared.yes');
    }
  }

  getLabelButton2() {
    if (this.button2Label) {
      return this.button2Label;
    } else {
      return _('shared.no');
    }
  }
}
