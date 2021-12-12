import { AfterViewInit, Directive, ElementRef, Host, Input, OnDestroy, Optional, Self } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { HidenavService } from './hidenav-service.service';
import $ from 'jquery';

@Directive({
	selector: '[hidenav-content]'
})
export class HidenavContentDirective implements AfterViewInit, OnDestroy {

	name: any;
	parent: any;

	@Input('hidenav-tabspage') hntb: any;

	constructor(@Host() @Self() @Optional() public el: IonContent, public contentElem: ElementRef, private globals: HidenavService) {

	}

	ngAfterViewInit() {
		if (!this.contentElem.nativeElement.hasAttribute('hidenav-tabspage')) {
			this.name = this.globals.requestName();
			$(this.contentElem.nativeElement).attr('hidenav-content', this.name);
			$('[hidenav-header]', $(this.contentElem.nativeElement).parents().get().find(itm => $(itm).find('[hidenav-header]').length)).attr('hidenav-header', this.name);
			this.start();
		} else {
			let counter = 0;
			const int = setInterval(() => {
				const x = $(this.contentElem.nativeElement).closest('[hidenav-tabscontent]').attr('hidenav-tabscontent');
				counter++;
				if (x && x.length > 0) {
					this.parent = $(this.contentElem.nativeElement).closest('[hidenav-tabscontent]').attr('hidenav-tabscontent');
					this.name = this.globals.requestTabName(this.parent);
					$(this.contentElem.nativeElement).attr('hidenav-content', this.name);
					$(this.contentElem.nativeElement).attr('hidenav-tabspage', this.parent);
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
			this.globals.data[this.name].contentElem = this.contentElem;
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
