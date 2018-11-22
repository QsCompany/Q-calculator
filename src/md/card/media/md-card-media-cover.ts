import { attributes, Processor } from "../../../../lib/q/sys/Dom";
import { component, stringifyClass, wrapTemplate, stringifyStyle, templateWrapper } from "../../component";
import { UI, bind } from "../../../../lib/q/Core";
import { template } from "template|../../../../src/md/card/card.html";


export class cardMediaCover extends component {
    @attributes.ComponentHandler("md-card-media-cover", templateWrapper({ templateName: "md-card-media-cover" }))
    static _builder(e: attributes.ComponentEventArgs) {
        e.node.e.Control = <any>new cardMediaCover(e.node.Dom as any);
    }

    setName(name: string, dom: HTMLElement, cnt: UI.JControl, e: bind.IJobScop) {
        if (name == 'backdrop')
            this.backdrop = dom as any;
        return true;
    }

    initialize() {
        const applyBackground = (darkness = 0.6) => {
            if (this.mdTextScrim) {
                this.applyScrimColor(darkness)
            } else if (this.mdSolid) {
                this.applySolidColor(darkness)
            }
        }
        let image = this._view.querySelector('img')
        if (image && (this.mdTextScrim || this.mdSolid)) {
            this.getImageLightness(image, (lightness) => {
                let limit = 256
                let darkness = (Math.abs(limit - lightness) * 100 / limit + 15) / 100
                if (darkness >= 0.7) {
                    darkness = 0.7
                }
                applyBackground(darkness)
            }, applyBackground)
        }
    }
    @bind.property(String)
    coverClasses: string;
    @bind.property(String)
    coverStyles: string;
    _coverClasses() {
        return this.coverClasses = stringifyClass({
            'md-text-scrim': this.mdTextScrim,
            'md-solid': this.mdSolid
        });
    }
    _coverStyles() {
        return this.coverStyles = stringifyStyle({
            background: this.backdropBackground
        });
    }
    applyScrimColor(darkness) {
        if (this.backdrop) {
            this.backdropBackground = `linear-gradient(to bottom, rgba(0, 0, 0, 0) 20%, rgba(0, 0, 0, ${darkness / 2}) 66%, rgba(0, 0, 0, ${darkness}) 100%)`
        }
    }
    applySolidColor(darkness) {
        let area = this._view.querySelector('.md-card-area') as HTMLElement;
        if (area) {
            area.style.background = `rgba(0, 0, 0, ${darkness})`
        }
    }
    getImageLightness(image, onLoad, onError) {
        let canvas = document.createElement('canvas')
        image.crossOrigin = 'Anonymous'
        image.onload = function () {
            let colorSum = 0
            let ctx
            let imageData
            let imageMetadata
            let r
            let g
            let b
            let average
            canvas.width = this.width
            canvas.height = this.height
            ctx = canvas.getContext('2d')
            ctx.drawImage(this, 0, 0)
            imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
            imageMetadata = imageData.data
            for (let x = 0, len = imageMetadata.length; x < len; x += 4) {
                r = imageMetadata[x]
                g = imageMetadata[x + 1]
                b = imageMetadata[x + 2]
                average = Math.floor((r + g + b) / 3)
                colorSum += average
            }
            onLoad(Math.floor(colorSum / (this.width * this.height)))
        }
        image.onerror = onError
    }


    @bind.property<boolean, cardMediaCover>(Boolean, void 0, void 0, cardMediaCover.prototype._coverClasses)
    mdTextScrim: boolean;

    @bind.property<boolean, cardMediaCover>(Boolean, void 0, void 0, cardMediaCover.prototype._coverClasses)
    mdSolid: boolean;

    @bind.property<string, cardMediaCover>(String, "", void 0, cardMediaCover.prototype._coverStyles)
    backdropBackground: string;
    backdrop: HTMLDivElement;
    // Add(child: Node | UI.JControl) {
    //     super.Add(child, 'backdrop');// { nextSible: this.backdrop, parent: this.backdrop && this.backdrop.parentNode });
    // }
}