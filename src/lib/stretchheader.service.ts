import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class StretchHeaderService {
  data = [];
  mode: string = "ios";
  names: string[] = [];
  tabnames = [];
  scroll: any;

  constructor() {
    this.scroll = new Subject();
  }

  requestName() {
    const name = "page" + this.names.length;
    this.names.push(name);
    return name;
  }

  initiate(name) {
    const names = [];
    for (const key in this.data) {
      if (this.data[key].parent === name) {
        names.push(key);
      }
    }
    for (const n of names) {
      this.initiate2(n);
    }
    if (names.length === 0) {
      this.initiate2(name);
    }
  }

  initiate2(name) {
    if (
      !(
        (this.data[name] &&
          this.data[name].parent &&
          this.data[this.data[name].parent] &&
          this.data[this.data[name].parent].tabscontent &&
          this.data[name].content &&
          this.data[this.data[name].parent].header) ||
        (!this.data[name].parent &&
          this.data[name].content &&
          this.data[name].header)
      )
    ) {
      return false;
    }
    const parent = this.data[name].parent;
    const content = this.data[name].content;
    if (!this.data[name].lastscroll) {
      this.data[name].lastscroll = 0;
    }
    if (!this.data[name].guardEvents) {
      this.data[name].guardEvents = true;
    }
    content.scrollEvents = true;
    if (!parent) {
      const header = this.data[name].header;
      if (this.data[name].static) {
        this.data[name].static.forEach((el) => {
          el.nativeElement.style.position = "absolute";
          el.nativeElement.style.zIndex = 102;
        });
      }

      if (header) {
        const parentElem = header.nativeElement.parentNode;
        const elem = header.nativeElement;
        if (parentElem.getAttribute("init-expanded") === "true") {
          this.data[name].initExpanded = true;
        }
        const notchHeight = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--ion-safe-area-top"
          ),
          10
        );
        this.data[name].shrinkexpandheaderHeight =
          parseInt(parentElem.getAttribute("header-height"), 10) + notchHeight;
        this.data[name].opacityFactor = parseInt(
          parentElem.getAttribute("opacity-factor"),
          10
        );
        this.data[name].blurFactor = parseInt(
          parentElem.getAttribute("blur-factor"),
          10
        );
        parentElem.style.height =
          this.data[name].shrinkexpandheaderHeight + "px";
        parentElem.style.overflow = "hidden";
        parentElem.style.position = "absolute";
        elem.style.position = "absolute";
        parentElem.style.width = "100%";
        elem.style.width = "100%";
        this.waitforelem(
          name,
          "this.data[name].header.nativeElement.scrollHeight",
          "proceedShrinkExpand"
        );
      }
    } else if (parent) {
      const header = this.data[parent].header;
      if (this.data[parent].static) {
        this.data[parent].static.forEach((el) => {
          el.nativeElement.style.position = "absolute";
          el.nativeElement.style.zIndex = 102;
        });
      }

      if (header) {
        const parentElem = header.nativeElement.parentNode;
        const elem = header.nativeElement;
        if (parentElem.getAttribute("init-expanded") === "true") {
          this.data[name].initExpanded = true;
        }
        const notchHeight = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--ion-safe-area-top"
          ),
          10
        );
        this.data[name].shrinkexpandheaderHeight =
          parseInt(parentElem.getAttribute("header-height"), 10) + notchHeight;
        this.data[name].opacityFactor = parseInt(
          parentElem.getAttribute("opacity-factor"),
          10
        );
        this.data[name].blurFactor = parseInt(
          parentElem.getAttribute("blur-factor"),
          10
        );
        parentElem.style.height =
          this.data[name].shrinkexpandheaderHeight + "px";
        parentElem.style.overflow = "hidden";
        parentElem.style.position = "absolute";
        elem.style.position = "absolute";
        parentElem.style.width = "100%";
        elem.style.width = "100%";
        parentElem.style.zIndex = 101;
      }
    }
  }

  waitforelem(name, evaluate, func) {
    // eslint-disable-next-line no-eval
    const x = eval(evaluate);
    if (!{ x } || x < this.data[name].shrinkexpandheaderHeight) {
      window.requestAnimationFrame(
        this.waitforelem.bind(this, name, evaluate, func)
      );
    } else {
      this[func](name);
    }
  }

  proceedShrinkExpand(name) {
    const parentElem = this.data[name].header.nativeElement.parentNode;
    const elem = this.data[name].header.nativeElement;
    const overlay =
      this.data[name].header.nativeElement.parentNode.querySelector(".overlay");
    if (this.data[name].opacityFactor > 0) {
      overlay.style.setProperty("filter", "opacity(var(--opacity))");
      overlay.style.setProperty(
        "--opacity",
        this.data[name].opacityFactor / 10
      );
    }
    if (this.data[name].blurFactor > 0) {
      elem.style.setProperty("filter", "blur(var(--blur))");
      elem.style.setProperty("--blur", this.data[name].blurFactor / 10);
    }
    this.data[name].shrinkexpandHeight =
      this.data[name].shrinkexpandheaderHeight;
    this.data[name].shrinkexpandHeight =
      this.data[name].header.nativeElement.scrollHeight;
    elem.style.transform =
      "translate3d(0, " +
      -(
        (this.data[name].shrinkexpandHeight -
          this.data[name].shrinkexpandheaderHeight) /
        2
      ) +
      "px, 0)";
    this.data[name].content.getScrollElement().then((res) => {
      this.data[name].contentElem = res;
      this.data[name].paddingTop = parseInt(
        window.getComputedStyle(this.data[name].contentElem)["padding-top"],
        10
      );
      this.data[name].contentElem.style.paddingTop =
        this.data[name].shrinkexpandHeight + this.data[name].paddingTop + "px";
      const scrollDist = this.data[name].initExpanded
        ? 2
        : this.data[name].shrinkexpandHeight -
          this.data[name].shrinkexpandheaderHeight;
      this.data[name].content.scrollByPoint(0, scrollDist, 0).then(() => {
        this.data[name].contentHeight =
          this.data[name].contentEl.nativeElement.clientHeight;
        this.data[name].content.scrollEvents = true;
        this.data[name].content.ionScroll.subscribe((e) => {
          if (this.data[name].initExpanded) {
            this.data[name].content.scrollToPoint(0, 0, 0).then(() => {
              this.data[name].initExpanded = false;
            });
          }
          const height = Math.max(
            Math.min(
              this.data[name].shrinkexpandHeight,
              this.data[name].shrinkexpandHeight - e.detail.scrollTop
            ),
            this.data[name].shrinkexpandheaderHeight
          );
          elem.style.transform =
            "translate3d(0, " +
            -Math.max(
              Math.min(
                (this.data[name].shrinkexpandHeight -
                  this.data[name].shrinkexpandheaderHeight) /
                  2,
                e.detail.scrollTop / 2
              ),
              0
            ) +
            "px, 0)";
          parentElem.style.height = height + "px";
          const scrollFactor = Math.min(
            e.detail.scrollTop / (this.data[name].shrinkexpandHeight / 2),
            1
          );
          if (scrollFactor >= 0) {
            const currentValOpacity =
              overlay.style.getPropertyValue("--opacity");
            const newValOpacity =
              (this.data[name].opacityFactor / 10) * scrollFactor;
            if (currentValOpacity !== newValOpacity) {
              overlay.style.setProperty("--opacity", newValOpacity);
            }
            const currentValBlur = elem.style.getPropertyValue("--blur");
            const newValBlur = this.data[name].blurFactor * scrollFactor + "px";
            if (currentValBlur !== newValBlur) {
              elem.style.setProperty("--blur", newValBlur);
            }
          }
          // event emitter
          setTimeout(() => {
            this.data[name].guardEvents = false;
          }, 10);
          if (
            this.data[name].lastscroll !== height &&
            !this.data[name].guardEvents
          ) {
            this.scroll.next({
              name: this.data[name].parent ? this.data[name].parent : name,
              height,
            });
          }
          this.data[name].lastscroll = height;
        });
      });
    });
  }

  resetContent(name) {
    const parent = this.data[name].parent;
    const height = parseInt(
      this.data[parent].header.nativeElement.parentNode.style.height,
      10
    );
    if (
      (height <= this.data[name].shrinkexpandHeight &&
        height > this.data[name].shrinkexpandheaderHeight) ||
      (height === this.data[name].shrinkexpandheaderHeight &&
        this.data[name].contentElem.scrollTop <
          this.data[name].shrinkexpandHeight -
            this.data[name].shrinkexpandheaderHeight)
    ) {
      this.data[name].contentElem.scrollTop =
        this.data[name].shrinkexpandHeight - height;
    }
  }

  public expand(parent, duration = 200) {
    if (this.data[parent].content) {
      this.data[parent].content.scrollToPoint(0, 0, duration);
    } else {
      const names = [];
      for (const key in this.data) {
        if (this.data[key].parent === parent) {
          names.push(key);
        }
      }
      for (const name of names) {
        this.data[name].content.scrollToPoint(0, 0, duration);
      }
    }
  }

  public shrink(parent, duration = 200) {
    const height = parseInt(
      this.data[parent].header.nativeElement.parentNode.style.height,
      10
    );
    if (height > this.data[parent].shrinkexpandheaderHeight) {
      if (this.data[parent].content) {
        this.data[parent].content.scrollToPoint(
          0,
          this.data[parent].shrinkexpandHeight -
            this.data[parent].shrinkexpandheaderHeight,
          duration
        );
      } else {
        const names = [];
        for (const key in this.data) {
          if (this.data[key].parent === parent) {
            names.push(key);
          }
        }
        for (const name of names) {
          this.data[name].content.scrollToPoint(
            0,
            this.data[name].shrinkexpandHeight -
              this.data[name].shrinkexpandheaderHeight,
            duration
          );
        }
      }
    }
  }

  public toggle(parent, duration = 200) {
    if (this.data[parent].content) {
      const height = parseInt(
        this.data[parent].header.nativeElement.parentNode.style.height,
        10
      );
      if (height < this.data[parent].shrinkexpandHeight) {
        this.data[parent].content.scrollToPoint(0, 0, duration);
      } else {
        this.data[parent].content.scrollToPoint(
          0,
          this.data[parent].shrinkexpandHeight -
            this.data[parent].shrinkexpandheaderHeight,
          duration
        );
      }
    } else {
      const names = [];
      for (const key in this.data) {
        if (this.data[key].parent === parent) {
          names.push(key);
        }
      }
      const height = parseInt(
        this.data[parent].header.nativeElement.parentNode.style.height,
        10
      );
      for (const name of names) {
        if (height < this.data[name].shrinkexpandHeight) {
          this.data[name].content.scrollToPoint(0, 0, duration);
        } else {
          this.data[name].content.scrollToPoint(
            0,
            this.data[name].shrinkexpandHeight -
              this.data[name].shrinkexpandheaderHeight,
            duration
          );
        }
      }
    }
  }
}
