define(["require", "exports", "./svgLoader/svg-loader", "./component", "./app/app", "./button/button", "./ripple/ripple", "./icon/icon", "./content/content", "./card/card", "./card/card-actions", "./card/card-content", "./card/area/card-area", "./card/expand/card-expand", "./card/expand/card-expand-content", "./card/expand/card-expand-trigger", "./card/header/card-header", "./card/header/card-header-text", "./card/media/md-card-media", "./card/media/md-card-media-cover", "./card/media/md-card-media-cover", "./badge/md-badge", "./badge/md-badge-standalone", "./avatar/avatar"], function (require, exports, svg_loader_1, component_1, app_1, button_1, ripple_1, icon_1, content_1, card_1, card_actions_1, card_content_1, card_area_1, card_expand_1, card_expand_content_1, card_expand_trigger_1, card_header_1, card_header_text_1, md_card_media_1, md_card_media_cover_1, md_card_media_cover_2, md_badge_1, md_badge_standalone_1, avatar_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(svg_loader_1);
    __export(component_1);
    __export(app_1);
    __export(button_1);
    __export(ripple_1);
    __export(icon_1);
    __export(content_1);
    __export(card_1);
    __export(card_actions_1);
    __export(card_content_1);
    __export(card_area_1);
    __export(card_expand_1);
    __export(card_expand_content_1);
    __export(card_expand_trigger_1);
    __export(card_header_1);
    __export(card_header_text_1);
    __export(md_card_media_1);
    __export(md_card_media_cover_1);
    __export(md_card_media_cover_2);
    __export(md_badge_1);
    __export(md_badge_standalone_1);
    __export(avatar_1);
    function loadMDResources() {
        var res = ["/src/md/style/md.css"];
        for (var _i = 0, res_1 = res; _i < res_1.length; _i++) {
            var r = res_1[_i];
            require("style|" + r);
        }
    }
    exports.loadMDResources = loadMDResources;
});
//# sourceMappingURL=md.js.map