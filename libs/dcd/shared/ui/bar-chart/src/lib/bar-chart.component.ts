// @ts-nocheck
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
//import { PlaytimePipe } from '../../../../../dcd/shared/utils/pipes/src/lib/playtime';

//import {pla} from '@dcd/shared/utils/pipes';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexLegend,
  ApexPlotOptions,
  ApexStroke,
  ApexTheme,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis
} from 'ng-apexcharts';
import { compare } from '@dcd/shared/utils';
import { PlaytimePipe } from '@dcd/shared/utils/pipes';
export interface BarChartUnit {
  date: string;
  seconds: number;
}

@Component({
    selector: 'lib-bar-chart',
    template: `
    <apx-chart
      [series]="series"
      [chart]="chart"
      [dataLabels]="dataLabels"
      [plotOptions]="plotOptions"
      [yaxis]="yaxis"
      [legend]="legend"
      [fill]="fill"
      [colors]="colors"
      [stroke]="stroke"
      [tooltip]="tooltip"
      [xaxis]="xaxis"
      [theme]="{
        mode: colorTheme
      }"
    ></apx-chart>
  `,
    styleUrls: ['./bar-chart.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class BarChartComponent implements OnInit {
  formatPipe = new PlaytimePipe();
  // (window:resize)=”onResize($event)”
  @Input()
  convertTo: string = 'Minutes';

  @Input()
  colorTheme: 'light' | 'dark';

  @Input()
  barColor: string = '#3399FF';
  //color: string = '#000';

  _events;
  @Input()
  get events(): BarChartUnit[] {
    return this._events;
  }

  set events(value: BarChartUnit[]) {
    if (value && value.length && value !== this._events) {
      this._events = value;
      this.updateChart(this._events);
    }
  }

  series: ApexAxisChartSeries = [];
  chart: ApexChart = { type: 'bar', height: 400, zoom: { enabled: false }, toolbar: { tools: { download: false } } };
  yaxis: ApexYAxis;
  theme: ApexTheme;

  xaxis: ApexXAxis;
  legend: ApexLegend = {};

  plotOptions: ApexPlotOptions = {
    bar: {
      horizontal: false,
      columnWidth: '75%'
      // endingShape: 'rounded'
    }
  };
  dataLabels: ApexDataLabels = {
    enabled: false
  };
  fill: ApexFill = {
    opacity: 1
  };
  stroke: ApexStroke = {
    show: true,
    width: 2,
    colors: ['transparent']
  };
  tooltip: ApexTooltip = {
    y: {
      formatter: (val) => {
        let convertedVal = 0;
        if (this.convertTo === 'Minutes') {
          convertedVal = val * 60;
        } else if (this.convertTo === 'Hours') {
          convertedVal = val * 60 * 60;
        }
        return `${this.formatPipe.transform(convertedVal)}`;
      }
    }
  };
  colors;
  // private changeSubject = new Subject<any>();

  constructor(private elRef: ElementRef, private cd: ChangeDetectorRef, private zone: NgZone) {}

  private updateChart(eventData) {
    // if (!this.svg) {
    //   this.createChart(eventData);
    //   return;
    // }

    this.processData(this.events);
  }

  ngOnInit(): void {
    this.colors = [this.barColor];
    this.yaxis = {
      title: {
        text: this.convertTo
      },
      labels: {
        formatter: (x) => {
          return x.toString();
        }
      }
    };
    this.theme = {
      mode: this.colorTheme
    };
  }

  private processData(sourceData) {
    if (sourceData) {
      let cleanedData = [];
      const firstData = sourceData[0].date;

      if (firstData instanceof Date) {
        this.xaxis = {
          type: 'datetime'
        };
        cleanedData = this.prepDateData(sourceData, true);
      } else {
        this.xaxis = {
          type: 'category'
        };
        cleanedData = this.prepDateData(sourceData, false);
      }
      this.series = [
        {
          name: '',
          data: cleanedData
        }
      ];
    }
  }

  private prepDateData(sourceData, sort) {
    const preppedData = [];
    sourceData.forEach((data) => {
      let convertedSeconds = 0;
      if (this.convertTo === 'Minutes') {
        convertedSeconds = Math.floor(data.seconds / 60);
      } else if (this.convertTo === 'Hours') {
        convertedSeconds = data.seconds / 60 / 60;
      }

      preppedData.push({ x: data.date, y: convertedSeconds });
    });

    if (!sort) {
      return preppedData;
    }

    return preppedData.sort((a, b) => {
      return compare(a.x, b.x);
    });
  }
}
