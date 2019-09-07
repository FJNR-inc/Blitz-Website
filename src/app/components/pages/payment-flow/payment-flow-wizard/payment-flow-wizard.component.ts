import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

export interface Step {
  'label': string;
  'id': string;
}

@Component({
  selector: 'app-payment-flow-wizard',
  templateUrl: './payment-flow-wizard.component.html',
  styleUrls: ['./payment-flow-wizard.component.scss']
})
export class PaymentFlowWizardComponent implements OnInit {

  _steps: Step[] = [];

  @Input()
  set steps(steps: Step[]) {
    this._steps = steps;
  }
  get steps() {
    return this._steps;
  }

  _currentStep: Step;
  @Output() currentStepChange = new EventEmitter();

  @Input()
  set currentStep(currentStep: Step) {
    this._currentStep = currentStep;
    this.currentIndex = this.steps.indexOf(currentStep);
    this.currentStepChange.emit(this._currentStep);
  }
  get currentStep() {
    return this._currentStep;
  }

  currentIndex = 0;

  constructor() { }

  ngOnInit() {
  }

  changeStep(step) {
    // This line allow the user to navigate by clicking on the wizard
    // this.currentStep = step;
  }
}
