import { Component, OnInit } from '@angular/core';
import { Organization } from '../../../../models/organization';
import { OrganizationService } from '../../../../services/organization.service';

@Component({
  selector: 'app-organizations-page',
  templateUrl: './organizations-page.component.html',
  styleUrls: ['./organizations-page.component.scss']
})
export class OrganizationsPageComponent implements OnInit {

  listOrganizations: Organization[];

  settings = {
    clickable: true,
    columns: [
      {
        name: 'name',
        title: 'Nom'
      }
    ]
  };

  constructor(private organizationService: OrganizationService) { }

  ngOnInit() {
    this.organizationService.list().subscribe(
      organizations => {
        this.listOrganizations = organizations.results.map(o => new Organization(o));
      }
    );
  }
}
