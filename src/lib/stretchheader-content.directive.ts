import { AfterViewInit, Directive, ElementRef, Host, Input, OnDestroy, Optional, Self } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { StretchHeaderService } from './stretchheader.service';

@Directive({
	selector: '[stretchheader-content]'
})
export class StretchHeaderContentDirective implements AfterViewInit, OnDestroy {

	name: string;

	constructor(@Host() @Self() @Optional() public el: IonContent, public contentElem: ElementRef, private globals: StretchHeaderService) {

	}

	ngAfterViewInit() {
			this.name = this.globals.requestName();
			this.contentElem.nativeElement.setAttribute('stretchheader-content',this.name);
			this.contentElem.nativeElement.parentElement.querySelector('stretchheader').setAttribute('stretchheader-header',this.name);
			this.start();
	}

	start() {
		if (this.name) {
			if (!this.globals.data[this.name]) {
				this.globals.data[this.name] = [];
			}
			this.globals.data[this.name].content = this.el;
			this.globals.data[this.name].contentEl = this.contentElem;
			this.globals.initiate(this.name);
		}
	}


	ngOnDestroy() {
		if (this.name) {
			delete this.globals.data[this.name].content;
		}
	}

}
