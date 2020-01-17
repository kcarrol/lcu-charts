import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy
} from '@angular/core';
import { pie } from 'd3-shape';

@Component({
  selector: 'g[lcu-charts-pie-grid-series]',
  templateUrl: './pie-grid-series.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PieGridSeriesComponent implements OnChanges {
  @Input() colors;
  @Input() data;
  @Input() innerRadius = 70;
  @Input() outerRadius = 80;
  @Input() animations: boolean = true;

  @Output() select = new EventEmitter();
  @Output() activate = new EventEmitter();
  @Output() deactivate = new EventEmitter();

  element: HTMLElement;
  layout: any;
  arcs: any;

  constructor(element: ElementRef) {
    this.element = element.nativeElement;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.update();
  }

  update(): void {
    this.layout = pie<any, any>()
      .value(d => d.data.value)
      .sort(null);

    this.arcs = this.getArcs();
  }

  getArcs(): any[] {
    return this.layout(this.data).map((arc, index) => {
      const label = arc.data.data.name;
      const other = arc.data.data.other;

      if (index === 0) {
        arc.startAngle = 0;
      }

      const color = this.colors(label);
      return {
        data: arc.data.data,
        class: 'arc ' + 'arc' + index,
        fill: color,
        startAngle: other ? 0 : arc.startAngle,
        endAngle: arc.endAngle,
        animate: this.animations && !other,
        pointerEvents: !other
      };
    });
  }

  onClick(data): void {
    this.select.emit(this.data[0].data);
  }

  trackBy(index, item): string {
    return item.data.name;
  }

  label(arc): string {
    return arc.data.name;
  }

  color(arc): any {
    return this.colors(this.label(arc));
  }
}