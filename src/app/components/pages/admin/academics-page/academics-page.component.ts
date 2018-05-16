import { Component, OnInit } from '@angular/core';
import { AcademicField } from '../../../../models/academicField';
import { AcademicLevel } from '../../../../models/academicLevel';
import { AcademicFieldService } from '../../../../services/academic-field.service';
import { AcademicLevelService } from '../../../../services/academic-level.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-academics-page',
  templateUrl: './academics-page.component.html',
  styleUrls: ['./academics-page.component.scss']
})
export class AcademicsPageComponent implements OnInit {

  listAcademicFields: AcademicField[];
  listAcademicLevels: AcademicLevel[];

  settings = {
    clickable: true,
    columns: [
      {
        name: 'name',
        title: 'Nom'
      }
    ]
  };

  constructor(private academicFieldService: AcademicFieldService,
              private academicLevelService: AcademicLevelService,
              private router: Router) { }

  ngOnInit() {
    this.academicFieldService.list().subscribe(
      fields => {
        this.listAcademicFields = fields.results.map(f => new AcademicField(f));
      }
    );

    this.academicLevelService.list().subscribe(
      levels => {
        this.listAcademicLevels = levels.results.map(l => new AcademicLevel(l));
      }
    );
  }
}
