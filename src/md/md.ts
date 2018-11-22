
export * from "./svgLoader/svg-loader";
export * from "./component";
export * from "./app/app";
export * from "./button/button";
export * from "./ripple/ripple";
export * from "./icon/icon";
export * from "./content/content";
export * from "./card/card";
export * from "./card/card-actions";
export * from "./card/card-content";
export * from "./card/area/card-area";
export * from "./card/expand/card-expand";
export * from "./card/expand/card-expand-content";
export * from "./card/expand/card-expand-trigger";
export * from "./card/header/card-header";
export * from "./card/header/card-header-text";
export * from "./card/media/md-card-media";
export * from "./card/media/md-card-media-cover";
export * from "./card/media/md-card-media-cover";

export * from "./badge/md-badge";
export * from "./badge/md-badge-standalone";
export * from "./avatar/avatar";


export function loadMDResources() {
    var res = ["/src/md/style/md.css"];
    for (const r of res) {
        require("style|" + r);
    }
}
