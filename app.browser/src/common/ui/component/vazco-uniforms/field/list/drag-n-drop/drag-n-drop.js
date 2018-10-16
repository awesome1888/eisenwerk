import DragNDrop from '../../../../../../lib/util/drag-n-drop/drag-n-drop.js';

import './style.less';

export default class DragNDropVList extends DragNDrop {

    _cornerOffset = {x: 0, y: 0};
    _dumb = null;
    _currentAfter = null;
    _topZone = null;
    _afterItem = null;

    constructor(props) {
        super(props);

        this.ensureFunction('onReorder');
    }

    onDragStart(item) {
        this.updateCornerOffset(item);

        // make "dumb" item after the real one
        this.getDumb(item);

        // stick the item to the mouse cursor
        this.stickItem(item);

        super.onDragStart(item);
    }

    onDragEnd(item) {
        // place item after dumb, unstick it
        this.unStickItem(item);
        $(item).insertAfter(this.getDumb());
        this.removeDumb();
        this.props.onReorder($(item), this._afterItem ? $(this._afterItem) : null);

        this.clearTopZone();
        this.clearAfter();

        super.onDragEnd(item);
    }

    onZoneEnter(item, zone) {
        this._topZone = zone;
        super.onZoneEnter(item, zone);
    }

    onZoneLeave(item, zone) {
        this.clearTopZone();
        super.onZoneLeave(item, zone);
    }

    getTopZone() {
        return this._topZone;
    }

    clearTopZone() {
        this._topZone = null;
    }

    clearAfter() {
        this._afterItem = null;
    }

    onMouseMove(e) {
        super.onMouseMove(e);

        if (this._dragging && this._item) {
            this.pointToMouse(this._item);

            // if we entered some zone
            if (this._topZone) {
                this.maybeRelocateDumb();
            }
        }
    }

    maybeRelocateDumb() {
        const cItem = this.getItem();

        let after = null;
        let found = false;

        this.getItems().each((i, item) => {
            // if the item is not the current item
            if (item !== cItem) {
                // we need to find an item we insert our dumb block after
                // so then we need to find the first block our cursor is ABOVE

                if (!found) {
                    if (this.isAbove(item)) {
                        found = true;
                    } else {
                        after = item;
                    }
                }
            }
        });

        if (after) {
            this._afterItem = after;
            this.getDumb().insertAfter($(after));
        } else {
            this._afterItem = null;
            this.getDumb().prependTo(this.getTopZone().zone);
        }
    }

    isAbove(item) {
        const mCoords = this.getMouseCoordinates();
        const bounds = this.getBounds($(item));

        return (mCoords.y <= bounds.y + (bounds.height / 4));
    }

    getItems() {
        return this._topZone.zone.find('[data-dnd-item="true"]');
    }

    isInZone(zone, mouse) {
        return (
            (mouse.y >= zone.y)
            &&
            (mouse.y <= (zone.y + zone.height))
        );
    }

    stickItem(item) {
        const i = $(item);
        i.css({
            width: `${i.width()}px`,
            height: `${i.height()}px`,
        });
        this.pointToMouse(item);
        i.addClass('drag-n-drop__item_flying');
    }

    unStickItem(item) {
        const i = $(item);
        i.removeClass('drag-n-drop__item_flying');
        i.css({
            top: 'auto',
            left: 'auto',
            width: 'auto',
            height: 'auto',
        });
    }

    pointToMouse(item) {
        const i = $(item);
        const coords = this.getMouseCoordinates();
        const w = i.width();

        const o = this.getCornerOffset();

        i.css({
            top: `${(coords.yClient - o.y)}px`,
            left: `${(coords.xClient - w - o.x)}px`,
            // top: `${(coords.yClient)}px`,
            // left: `${(coords.xClient - w)}px`,
        });
    }

    getCornerOffset() {
        return this._cornerOffset;
    }

    updateCornerOffset(item) {
        const coords = this.getMouseCoordinates();
        const bounds = this.getBounds($(item));

        this._cornerOffset = {
            x: coords.x - bounds.x - bounds.width,
            y: coords.y - bounds.y,
        };
    }

    getDumb(item) {
        if (!this._dumb) {
            const i = $(item);
            const h = i.height();
            const w = i.width();

            const dumb = $(`<div class="drag-n-drop__dumb" style="width: ${w}px; height: ${h}px;" />`);
            dumb.insertAfter(i);

            this._dumb = dumb;
        }

        return this._dumb;
    }

    removeDumb() {
        if (this._dumb) {
            this._dumb.remove();
            this._dumb = null;
        }
    }

    destroy() {
        this.removeDumb();
        this.clearTopZone();
        this.clearAfter();
        this._currentAfter = null;
        super.destroy();
    }
}
