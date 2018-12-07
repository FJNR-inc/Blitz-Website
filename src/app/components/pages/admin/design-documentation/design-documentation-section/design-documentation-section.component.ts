import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-design-documentation-section',
  templateUrl: './design-documentation-section.component.html',
  styleUrls: ['./design-documentation-section.component.scss']
})
export class DesignDocumentationSectionComponent implements OnInit {

  @Input() title;
  @Input() description;
  @Input() usage;
  @Input() innerHtml;

  constructor() { }

  ngOnInit() {
    console.log(this.title);
  }

  sanitize(code) {
    code = code.replace(/&/g, '&amp;');
    code = code.replace(/</g, '&lt;');
    code = code.replace(/>/g, '&gt;');
    return code;
  }
}
