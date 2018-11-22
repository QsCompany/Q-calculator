import { attributes, Processor } from "../../../../lib/q/sys/Dom";
import { component, stringifyClass, templateWrapper } from "../../component";
import { UI, bind } from "../../../../lib/q/Core";

export class cardMedia extends component {
    @attributes.ComponentHandler("md-card-media", templateWrapper({ templateName: "md-card-media" }))
    static _builder(e: attributes.ComponentEventArgs) {
        e.node.e.Control = new cardMedia(e.node.Dom as HTMLElement);
    }

    @bind.property<String, cardMedia>(String, void 0, void 0, cardMedia.prototype._resetMediaClasses)
    mdRatio: String;
    @bind.property<boolean, cardMedia>(Boolean, void 0, void 0, cardMedia.prototype._resetMediaClasses)
    mdMedium: boolean;
    @bind.property<boolean, cardMedia>(Boolean, void 0, void 0, cardMedia.prototype._resetMediaClasses)
    mdBig: boolean;
    mediaClasses: string;
    _resetMediaClasses() {
        let classes = {}
        if (this.mdRatio) {
            const ratio = this.getAspectRatio()
            if (ratio) {
                const [horiz, vert] = ratio
                classes[`md-ratio-${horiz}-${vert}`] = true
            }
        }
        if (this.mdMedium || this.mdBig) {
            classes = {
                'md-medium': this.mdMedium,
                'md-big': this.mdBig
            }
        }
        return this.mediaClasses = stringifyClass(classes);
    }
    getAspectRatio() {
        let ratio = []
        if (this.mdRatio.indexOf(':') !== -1) {
            ratio = this.mdRatio.split(':')
        } else if (this.mdRatio.indexOf('/') !== -1) {
            ratio = this.mdRatio.split('/')
        } else if (this.mdRatio.indexOf('-') !== -1) {
            ratio = this.mdRatio.split('-')
        }
        return ratio.length === 2 ? ratio : null
    }
    initialize() {
        super.initialize();
        this._resetMediaClasses();
    }
}