# Hide Navigation Bar for Ionic 5+

With this module you can:
- implement an expansible header that stretches when pulling the page down

[![NPM version][npm-image]][npm-url]

### 🔥 ..Also works with Supertabs 🔥

![](https://github.com/heidji/readme-content/blob/master/ionic4stretchheader.gif?raw=true)

Check out the [example](https://github.com/heidji/ionic4-stretchheader-example)


## Installation

```
npm i @tetkosimi/ionic-stretchheader
```

## Implementation

Create (or modify if you already have) a **shared.module.ts** in your project root folder:

```typescript
import { NgModule } from '@angular/core';
import { StretchHeaderModule } from '@tetkosimi/ionic-stretchheader';

@NgModule({
    imports: [StretchHeaderModule],
    exports: [StretchHeaderModule]
})
export class SharedModule { }
```
and import the SharedModule on every page you intend to use this plugin:

```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HomePage } from './home.page';
import { SharedModule } from '../shared.module';

const routes: Routes = [
    {
        path: '',
        component: HomePage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        SharedModule
    ],
    declarations: [HomePage]
})
export class HomePageModule {
}
```
---

## Part 1: Expansible header
This is a custom component defined using this HTML tag:
```html
<stretchheader></stretchheader>
```
This component must be defined outside of `<ion-content>` and comes with required and optional child DOM elements:

## Creating the expansible header element

**home.page.html**

`#shrinkexpand`: This is the element that will shrink and expand with scrolling the page
`#static`: Element(s) with this tag will be left alone. You can use these to create buttons on your header for example.

```html
<stretchheader header-height="50">
    <div #shrinkexpand><!-- Expanding DOM element --></div>
    <div #static><!-- Title --></div>
    <div #static><!-- Nav button --></div>
</stretchheader>
```

Inputs for `<stretchheader>`:

| input             | type                         | Description                                                                    |
| ----------------- | ---------------------------- | ------------------------------------------------------------------------------ |
| `header-height`   | **required**                 | height to which the header shrinks to                                          |
| `opacity-factor`  | optional / default = 0       | `1 - 10` opacity of shrunk header overlay                                      |
| `opacity-color`   | optional / default = black   | accepts any css color description (name, rgb, # ..)                            |
| `blur-factor`     | optional / default = 0       | the maximum blur when the header is collapsed (accepts integer)                |
| `init-expanded`   | optional / default = false   | set to `true` if you want the header to initiate expanded                      |
| `no-border`       | optional / default = false   | set to `true` if you want to remove the bottom styling of the header           |


### Adding your Header to a simple page: 
add the `stretchheader-content` directive to your `<ion-content>`
````html
<stretchheader header-height="50">
    <div #shrinkexpand>...</div>
</stretchheader>
<ion-content stretchheader-content>
    ....
</ion-content>
````

[npm-url]: https://npmjs.org/package/@tetkosimi/ionic-stretchheader
[npm-image]: https://img.shields.io/npm/v/@tetkosimi/ionic-stretchheader/latest
 
