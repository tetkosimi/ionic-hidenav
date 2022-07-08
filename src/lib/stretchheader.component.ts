import {
  AfterViewInit,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  Output,
} from "@angular/core";
import { StretchHeaderService } from "./stretchheader.service";

@Component({
  selector: "stretchheader",
  template: `
    <style>
      :host {
        --border-color-rgb: 90, 94, 99;
        --overlay-background: black;
      }
      .overlay {
        position: absolute;
        height: inherit;
        width: inherit;
        z-index: 101;
        pointer-events: none;
        background-color: var(--overlay-background);
        filter: opacity(0);
        --opacity: 0;
      }

      :host {
        --blur: 0;
        z-index: 1;
      }

      :host.md {
        -webkit-box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.53);
        -moz-box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.53);
        box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.53);
      }

      :host.ios {
        border-bottom: 1px solid rgba(var(--border-color-rgb), var(--opacity));
      }
    </style>
    <div class="overlay"></div>
    <ng-content></ng-content>
  `,
})
export class StretchHeaderComponent implements OnDestroy, AfterViewInit {
  @ContentChild("shrinkexpand", { read: ElementRef }) header: ElementRef;
  @ContentChildren("static", { read: ElementRef }) static: any;

  @Input() border: boolean = true;
  @Input() headerHeight: string | number;
  @Input() initExpanded: boolean;
  @Input() opacityFactor: number;
  @Input() blurFactor: number;

  @HostBinding("class") class: string;
  name: string;

  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() scroll: EventEmitter<number> = new EventEmitter<number>();

  constructor(public el: ElementRef, public globals: StretchHeaderService) {}

  ngAfterViewInit() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(() => {
        if (
          this.el.nativeElement.getAttribute("stretchheader-header").length > 0
        ) {
          this.name = this.el.nativeElement.getAttribute(
            "stretchheader-header"
          );
          this.start();
          observer.disconnect();
        }
      });
    });
    observer.observe(this.el.nativeElement, {
      attributes: true,
    });
  }

  start() {
    if (this.name) {
      if (!this.globals.data[this.name]) {
        this.globals.data[this.name] = [];
      }
      this.globals.data[this.name].header = this.header;
      this.globals.data[this.name].static = this.static;
      this.globals.initiate(this.name);
      this.globals.scroll.subscribe((res) => {
        if (res.name === this.name) {
          this.scroll.emit(res.height);
        }
      });
      if (!!this.border) {
        const mode = document.querySelector("html").getAttribute("mode");
        setTimeout(() => {
          if (!this.class) {
            this.class = mode;
          } else {
            this.class += " " + mode;
          }
        }, 0);
      }
    }
  }

  expand(duration = 200) {
    this.globals.expand(this.name, duration);
  }

  shrink(duration = 200) {
    this.globals.shrink(this.name, duration);
  }

  toggle(duration = 200) {
    this.globals.toggle(this.name, duration);
  }

  ngOnDestroy() {
    if (this.name) {
      delete this.globals.data[this.name].header;
    }
  }
}
