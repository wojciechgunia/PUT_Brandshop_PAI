import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-select-box',
  templateUrl: './select-box.component.html',
  styleUrls: ['./select-box.component.scss'],
})
export class SelectBoxComponent implements OnInit {
  @Input() selected!: EventEmitter<string>;
  @Input() uid!: string;
  @Input() name!: string;
  @Input() price: number = -0.01;
  @Input() imgUrl!: string;
  @Output() selecting = new EventEmitter<string>();

  BGColor = 'transparent';
  Color = 'var(--text-accent-color)';

  select() {
    this.selecting.emit(this.uid);
  }

  ngOnInit(): void {
    this.selected.subscribe((value) => {
      if (value == this.uid) {
        this.BGColor = 'var(--primary-color)';
        this.Color = 'white';
      } else {
        this.BGColor = 'transparent';
        this.Color = 'var(--text-accent-color)';
      }
    });
  }
}
