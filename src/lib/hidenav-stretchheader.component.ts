import { AfterViewInit, Component, ContentChild, ContentChildren, ElementRef, EventEmitter, HostBinding, Input, OnDestroy, Output } from '@angular/core';
import { HidenavShService } from './hidenav-sh-service.service';

@Component({
    selector: 'hidenav-stretchheader',
    template: `
        <style>
            .overlay {
                position: absolute;
                height: inherit;
                width: inherit;
                z-index: 101;
                pointer-events: none;
                /*opacity: var(--opacity);*/
                background: var(--color);
                filter: opacity(0);
                --opacity: 0;
                --color: black;
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
                border-bottom: 1px solid #5a5e63;
            }
        </style>
        <div class="overlay"></div>
        <ng-content></ng-content>
    `
})
export class HidenavStretchheaderComponent implements OnDestroy, AfterViewInit {
    @ContentChild('shrinkexpand', {read: ElementRef}) header: ElementRef;
    @ContentChildren('static', {read: ElementRef}) static: any;
    @HostBinding('class') class: any;
    name: any;
    @Input('no-border') noBorder: string;
    @Input('header-height') headerHeight: any;
    @Input('init-expanded') initExpanded: any;
    @Input('opacity-color') opacityColor: any;
    @Input('opacity-factor') opacityFactor: any;
    @Input('blur-factor') blurFactor: any;
    @Input('preserve-header') preserveHeader: any;

    // eslint-disable-next-line @angular-eslint/no-output-native
    @Output() scroll: EventEmitter<number> = new EventEmitter<number>();

    constructor(public el: ElementRef, public globals: HidenavShService) {
    }

    ngAfterViewInit() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(() => {
                if (this.el.nativeElement.getAttribute('hidenav-sh-header').length > 0) {
                    this.name = this.el.nativeElement.getAttribute('hidenav-sh-header');
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
            this.globals.scroll.subscribe(res => {
                if (res.name === this.name) {
                    this.scroll.emit(res.height);
                }
            });
            if (this.noBorder !== 'true') {
                const mode = document.querySelector('html').getAttribute('mode');
                setTimeout(() => {
                    if (!this.class) {
                        this.class = mode;
                    } else {
                        this.class += ' ' + mode;
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
