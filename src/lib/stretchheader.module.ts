import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StretchHeaderContentDirective } from './stretchheader-content.directive';
import { StretchHeaderComponent } from './stretchheader.component';

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
		StretchHeaderContentDirective,
		StretchHeaderComponent
	],
	exports: [
		StretchHeaderContentDirective,
		StretchHeaderComponent
	]
})
export class StretchHeaderModule {
}
