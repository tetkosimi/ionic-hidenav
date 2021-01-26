import { NgModule, Provider, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HidenavTabscontentDirective } from './hidenav-tabscontent.directive';
import { HidenavContentDirective } from './hidenav-content.directive';
import { HidenavHeaderDirective } from './hidenav-header.directive';
import { HidenavStretchheaderComponent } from './hidenav-stretchheader.component';
import { HidenavShContentDirective } from './hidenav-sh-content.directive';
import { HidenavShTabscontentDirective } from './hidenav-sh-tabscontent.directive';

declare module '@angular/core' {
	interface ModuleWithProviders<T = any> {
		ngModule: Type<T>;
		providers?: Provider[];
	}
}

@NgModule({
	imports: [
		CommonModule
	],
	declarations: [
		HidenavTabscontentDirective,
		HidenavContentDirective,
		HidenavHeaderDirective,
		HidenavStretchheaderComponent,
		HidenavShContentDirective,
		HidenavShTabscontentDirective
	],
	exports: [
		HidenavTabscontentDirective,
		HidenavContentDirective,
		HidenavHeaderDirective,
		HidenavStretchheaderComponent,
		HidenavShContentDirective,
		HidenavShTabscontentDirective
	]
})
export class HidenavModule {
}
