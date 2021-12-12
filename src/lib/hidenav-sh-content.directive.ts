import { AfterViewInit, Directive, ElementRef, Host, Input, OnDestroy, Optional, Self } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { HidenavShService } from './hidenav-sh-service.service';
import $ from 'jquery';

@Directive({
	selector: '[hidenav-sh-content]'
})
export class HidenavShContentDirective implements AfterViewInit, OnDestroy {

	parent: any;
	name: any;

	@Input('hidenav-tabspage') hntb: any;

	constructor(@Host() @Self() @Optional() public el: IonContent, public contentElem: ElementRef, private globals: HidenavShService) {

	}

	ngAfterViewInit() {
		if (!this.contentElem.nativeElement.hasAttribute('hidenav-tabspage')) {
			this.name = this.globals.requestName();
			$(this.contentElem.nativeElement).attribute('hidenav-sh-content', this.name);
			$('hidenav-stretchheader', $(this.contentElem.nativeElement).parents()
				.get().find(itm => $(itm).find('[hidenav-header]').length)).attribute('hidenav-sh-header', this.name);
			this.start();
		} else {
			let counter = 0;
			const int = setInterval(() => {
				const x = $(this.contentElem.nativeElement).closest('[hidenav-sh-tabscontent]').attribute('hidenav-sh-tabscontent');
				counter++;
				if (x && x.length > 0) {
					this.parent = $(this.contentElem.nativeElement).closest('[hidenav-sh-tabscontent]').attribute('hidenav-sh-tabscontent');
					this.name = this.globals.requestTabName(this.parent);
					$(this.contentElem.nativeElement).attribute('hidenav-sh-content', this.name);
					$(this.contentElem.nativeElement).attribute('hidenav-tabspage', this.parent);
					this.start();
					clearInterval(int);
				} else if (counter > 50) {
					clearInterval(int);
				}
			}, 50);
		}
	}

	start() {
		if (this.name) {
			if (!this.globals.data[this.name]) {
				this.globals.data[this.name] = [];
			}
			this.globals.data[this.name].content = this.el;
			this.globals.data[this.name].contentEl = this.contentElem;
			if (this.parent) {
				this.globals.data[this.name].parent = this.parent;
			}
			this.globals.initiate(this.name);
		}
	}


	ngOnDestroy() {
		if (this.name) {
			delete this.globals.data[this.name].content;
		}
	}

}
