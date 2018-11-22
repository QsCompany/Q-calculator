import { attributes } from "../../../lib/q/sys/Dom";
import { component, templateWrapper } from "../component";
import { bind, PaintThread } from "../../../lib/q/Core";
import { Promise } from "../../Promise";


let mdSVGStore = {};
@attributes.Event({ name: 'click' })
export class svgLoader extends component {
    @attributes.ComponentHandler("md-svg-loader", templateWrapper({ templateName: "md-svg-loader" }))
    static _builder(e: attributes.ComponentEventArgs) {
        e.node.e.Control = new svgLoader(e.node.Dom as HTMLElement as HTMLElement);
    }
    @bind.property1(String, {
        changed: function (this: svgLoader) {
            this.html = null
            this.loadSVG()
        }
    }) mdSrc: string;
    @bind.property(String) html: string;
    @bind.property(String) error: string;

    isSVG(mimetype) {
        return mimetype.indexOf('svg') >= 0
    }
    setHtml() {
        if (!this.mdSrc) this.html = "";
        else mdSVGStore[this.mdSrc].then((html) => {
            this.html = html;
            PaintThread.OnPaint({ args: ['md-loaded'], method: this.$emit, owner: this });
        });
    }
    unexpectedError(reject) {
        this.error = `Something bad happened trying to fetch ${this.mdSrc}.`
        reject(this.error)
    }
    loadSVG() {
        if ((!!this.mdSrc) && !mdSVGStore.hasOwnProperty(this.mdSrc)) {
            mdSVGStore[this.mdSrc] = new Promise((resolve, reject) => {
                const request = new XMLHttpRequest()
                request.open('GET', this.mdSrc, true)
                request.onload = () => {
                    const mimetype = request.getResponseHeader('content-type')
                    if (request.status === 200) {
                        if (this.isSVG(mimetype)) {
                            resolve(request.response)
                            this.setHtml()
                        } else {
                            this.error = `The file ${this.mdSrc} is not a valid SVG.`
                            reject(this.error)
                        }
                    } else if (request.status >= 400 && request.status < 500) {
                        this.error = `The file ${this.mdSrc} do not exists.`
                        reject(this.error)
                    } else {
                        this.unexpectedError(reject)
                    }
                }
                request.onerror = () => this.unexpectedError(reject)
                request.onabort = () => this.unexpectedError(reject)
                request.send()
            })
        } else {
            this.setHtml()
        }
    }
    initialize() {
        super.initialize();
        this.loadSVG();
    }

}