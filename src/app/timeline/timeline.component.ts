import { Component, Input } from '@angular/core';
@Component({
  selector: 'timeline',
  templateUrl: 'timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent {
  @Input('endIcon') endIcon = "ionic";
  constructor() {
}
}
@Component({
  selector: 'timeline-item',
  template: '<ng-content></ng-content>'
})
export class TimelineItemComponent{
  constructor(){
}
}
@Component({
  selector:'timeline-time',
  template: '<span>{{time.subtitle}}</span> <span>{{time.title}}</span>'
})
export class TimelineTimeComponent{
  @Input('time') time = {
    subtitle: '',
    title: '',
  };
  constructor(){
}
}