import {Component, OnInit, ViewChild} from '@angular/core';
import {OrderLineService} from '../../../services/order-line.service';
import {ChartOptions, ChartTooltipItem, ChartType} from 'chart.js';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {debounceTime, filter, tap} from 'rxjs/operators';
import {BaseChartDirective} from 'ng2-charts';


interface Data {
  x: string;
  y: number;
}

interface DataSet {
  label: string;
  data: Data[];
  stack: string;
}

interface ChartJSData {
  datasets: DataSet[];
  labels?: string[];
}

interface Interval {
  label: string;
  value: string;
}

interface ContentType {
  id: number;
  name: string;
  detail: boolean;
}


@Component({
  selector: 'app-chart-js',
  templateUrl: './chart-js.component.html',
  styleUrls: ['./chart-js.component.scss']
})
export class ChartJSComponent implements OnInit {

  FORMATS = {
    datetime: 'MMM D, YYYY, h:mm:ss a',
    millisecond: 'h:mm:ss.SSS a',
    second: 'h:mm:ss a',
    minute: 'h:mm a',
    hour: 'hA',
    day: 'MMM D',
    week: 'll',
    month: 'MMM YYYY',
    quarter: '[Q]Q - YYYY',
    year: 'YYYY'
  };

  type: ChartType = 'bar';
  data: ChartJSData;
  options: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        stacked: true,
        type: 'time',
        time:
          {
            unit: 'month',
            tooltipFormat: 'MMM YYYY'
          },
        distribution: 'linear',
        ticks: {
          source: 'auto',
          autoSkip: true
        }
      }],
      yAxes: [{
        stacked: true,
        ticks: {
          min: 0,
          suggestedMin: 1
        }
      }]
    },
    tooltips: {
      mode: 'index',
      filter: this.tooltipfilter
    }
  };

  intervals: Interval[] = [
    {
      label: 'Jour',
      value: 'day',
    },
    {
      label: 'Semaine',
      value: 'week',
    },
    {
      label: 'Mois',
      value: 'month',
    },
    {
      label: 'Année',
      value: 'year',
    }

  ];

  contentTypes: ContentType[] = [];

  formControl: FormGroup;

  loading = false;

  @ViewChild(BaseChartDirective)
  public chart: BaseChartDirective;

  constructor(private orderLineService: OrderLineService,
              private fb: FormBuilder) {
  }

  ngOnInit() {

    this.orderLineService.product_list().subscribe((productList: ContentType[]) => {
      this.contentTypes = productList;
      this.initFormControl();
      this.load_data();
    });
  }

  initFormControl() {
    this.formControl = this.fb.group({
      contentTypes: [this.contentTypes],
      start: [],
      end: [new Date()],
      groupByObject: [false],
      interval: ['month']
    });

    this.formControl.valueChanges
      .pipe(
        debounceTime(500),
        filter(() => !this.loading),
        tap(() => this.loading = true)
      )
      .subscribe(() => {
        this.load_data();
      });
  }

  isSelectedDisable(contentType: ContentType): boolean {
    return (!contentType.detail && this.detailControl.value);
  }

  get isDetailDisable() {
    return this.contentTypesControl.value.filter((product: ContentType) => !product.detail).length > 0;
  }

  get detailDisabledErrorMessage() {

    const contentTypeNames = this.contentTypesControl.value
      .filter((product: ContentType) => !product.detail)
      .map(
        (contentType: ContentType) => contentType.name
      );

    const contentTypes = contentTypeNames.join(', ');

    const messagePlural = contentTypeNames.length > 1 ? 'contiennent' : 'contient';

    const message = `Le détail ne peut pas étre affiché
                      parce que ${contentTypes}
                      ${messagePlural} trop de données`;

    return message;
  }

  load_data() {

    if (this.contentTypesControl.value.length > 0) {


      this.orderLineService.chartjs(
        this.contentTypesControl.value.map((product: ContentType) => product.id),
        this.startControl.value,
        this.endControl.value,
        this.detailControl.value,
        this.intervalControl.value,
      ).subscribe(data => {
        this.data = this.addMissingZero(data);
        if (this.chart) {
          this.chart.chart.options.scales.xAxes[0].time.unit = this.intervalControl.value;
          this.chart.chart.options.scales.xAxes[0].time.tooltipFormat =
            this.FORMATS[this.intervalControl.value];
        }
        this.loading = false;
      });
    } else {
      this.loading = false;
    }
  }


  get contentTypesControl() {
    return this.formControl.get('contentTypes') as FormControl;
  }

  get startControl() {
    return this.formControl.get('start') as FormControl;
  }

  get endControl() {
    return this.formControl.get('end') as FormControl;
  }

  get detailControl() {
    return this.formControl.get('groupByObject') as FormControl;
  }

  get intervalControl() {
    return this.formControl.get('interval') as FormControl;
  }

  addMissingZero(chartJSData: ChartJSData): ChartJSData {
    chartJSData.datasets.forEach((dataset: DataSet) => {
      const newDatas: Data[] = [];
      let negativeOffset = 0;

      chartJSData.labels.forEach((label: string, index: number) => {
        const data: Data = dataset.data[index - negativeOffset];

        if (data && data.x === label) {
          newDatas.push(data);
        } else {
          negativeOffset += 1;
          newDatas.push({
            x: label,
            y: 0
          });
        }
      });

      dataset.data = newDatas;
    });

    return chartJSData;
  }

  tooltipfilter(tooltipItem: ChartTooltipItem, data): boolean {
    return +tooltipItem.value > 0;
  }
}
