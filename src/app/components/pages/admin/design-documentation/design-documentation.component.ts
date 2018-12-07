import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-design-documentation',
  templateUrl: './design-documentation.component.html',
  styleUrls: ['./design-documentation.component.scss']
})
export class DesignDocumentationComponent implements OnInit {

  // nt-button
  descriptionNtButton = 'Bouton basiques.';
  usageNtButton = `
    <div>
      <a class="nt-button">Button</a>
    </div>

    <br/>

    <div>
      <a class="nt-button nt-button--reverse">Button reverse</a>
    </div>

    <br/>

    <div>
      <a class="nt-button nt-button--disabled">Button disabled</a>
    </div>

    <br/>

    <div>
      <a class="nt-button nt-button--success">Button sucess</a>
    </div>

    <br/>

    <div>
      <a class="nt-button nt-button--danger">Button danger</a>
    </div>

    <br/>

    <div>
      <a class="nt-button nt-button--full-width">Button full width</a>
    </div>
  `;

  // calendar-icon
  date = new Date();
  usageCalendarIcon = '<app-calendar-icon [date]="date"></app-calendar-icon>';
  descriptionCalendarIcon = 'Permet d\'afficher une date sous une forme facilement compréhensible.';

  // alert
  messages = ['line 1', 'line 2'];
  usageAlert = `
    <!-- Danger -->
    <app-alert type="danger" [messages]="messages"></app-alert>

    <!-- Informations -->
    <app-alert type="info" [messages]="messages"></app-alert>

    <!-- Warning -->
    <app-alert type="warning" [messages]="messages"></app-alert>
    
    <!-- Success -->
    <app-alert type="success" [messages]="messages"></app-alert>
  `;
  descriptionAlert = 'Permet d\'afficher une date sous une forme facilement compréhensible.';

  constructor() { }

  ngOnInit() {
  }
}
