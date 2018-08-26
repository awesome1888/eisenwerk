import Util from '../../common/lib/util/index.js';

export default class DragNDrop {
    props = {};
    _item = null;
    _handle = null;
    _zones = new Map();

    _coords = {x: 0, y: 0};
    _knownZones = null;
    _dragging = false;

    constructor(props) {
        this.props = props || {};

        this.ensureFunction('canDrop', null);
        this.ensureFunction('canDrag', null);
        this.ensureFunction('onDragStart');
        this.ensureFunction('onDragSuccess');
        this.ensureFunction('onDragFail');
        this.ensureFunction('onDragEnd');
        this.ensureFunction('onZoneEnter');
        this.ensureFunction('onZoneLeave');

        this.bindEvents();
    }

    onDragStart(item) {
        this.props.onDragStart(item);
    }

    onDragSuccess(item, zone) {
        // console.dir('Drag made');
        this.props.onDragSuccess(item, zone);
    }

    onDragFail(item) {
        // console.dir('Drag cancelled');
        this.props.onDragFail(item);
    }

    onDragEnd(item) {
        this.props.onDragEnd(item);
    }

    onZoneEnter(item, zone) {
        // console.dir('Enter');
        this.props.onZoneEnter(item, zone);
    }

    onZoneLeave(item, zone) {
        // console.dir('Leave');
        this.props.onZoneLeave(item, zone);
    }

    ensureFunction(name, def = () => {}) {
        this.props[name] = _.isFunction(this.props[name]) ? this.props[name] : def;
    }

    getDropAcceptor() {
        return this.props.canDrop;
    }

    getDragAcceptor() {
        return this.props.canDrag;
    }

    bindEvents() {
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onTouchStart = this.onTouchStart.bind(this);

        $(document).on('mousedown', this.onMouseDown);
        $(document).on('touchstart', this.onTouchStart);
        $(document).on('touchend mouseup', this.onMouseUp);

        this.bindMouseMove();
    }

    unBindEvents() {
        $(document).off('mousedown', this.onMouseDown);
        $(document).on('touchstart', this.onTouchStart);
        $(document).off('touchend mouseup', this.onMouseUp);

        this.unBindMouseMove();
    }

    bindMouseMove() {
        this.onMouseMove = this.onMouseMove.bind(this);

        $(document).on('touchmove mousemove', this.onMouseMove);
    }

    unBindMouseMove() {
        $(document).off('touchmove mousemove', this.onMouseMove);
    }

    setMouseCoordinates(coords) {
        this._coords = coords;
    }

    getMouseCoordinates() {
        return this._coords;
    }

    onMouseDown(e) {
        this.tryDragStart(e);
    }

    onTouchStart(e) {
        let source = e;
        if (e.originalEvent && e.originalEvent.touches) {
            source = e.originalEvent.touches[0];
        }

        const coords = {
            // coordinates relative to the window scroll
            xClient: source.clientX,
            yClient: source.clientY,
            // coordinates absolute
            x: source.pageX,
            y: source.pageY,
        };

        // console.dir('(rel) x='+coords.xClient+' y='+coords.yClient+' (abs) x='+coords.x+' y='+coords.y);

        this.setMouseCoordinates(coords);
        this.tryDragStart(e);
    }

    tryDragStart(e) {
        const handle = Util.findClosestParent(e.target, '[data-dnd-item-handle="true"]');
        if (handle) { // we clicked on a handle
            const item = Util.findClosestParent(handle, '[data-dnd-item="true"]');
            if (item) { // handle was inside of some item
                let can = true;
                const acceptor = this.getDragAcceptor();
                if (acceptor) {
                    can = acceptor(item);
                }

                if (can) {
                    this.setItem(item, handle);
                    this.onDragStart(item);
                    this._dragging = true;
                }
            }
        }
    }

    onMouseUp(e) {
        if (this._item) {
            const zone = this.getSuitableZone(this._item, e.target);

            let can = true;
            if (zone) {
                const acceptor = this.getDropAcceptor();
                if (acceptor) {
                    can = acceptor(this._item, zone);
                }

                if (can) {
                    this.onDragSuccess(this._item, zone);
                }
            } else {
                can = false;
            }

            if (!can) {
                this.onDragFail(this._item);
            }

            this.onDragEnd(this._item);
        }

        this._dragging = false;
        this.clearItemReferences();
        this.clearZoneSet();
    }

    onMouseMove(e) {
        // console.dir(e);

        let source = e;
        if (e.originalEvent && e.originalEvent.touches) {
            source = e.originalEvent.touches[0];
        }

        const coords = {
            // coordinates relative to the window scroll
            xClient: source.clientX,
            yClient: source.clientY,
            // coordinates absolute
            x: source.pageX,
            y: source.pageY,
        };

        // console.dir('(rel) x='+coords.xClient+' y='+coords.yClient+' (abs) x='+coords.x+' y='+coords.y);

        this.setMouseCoordinates(coords);
        this.processZoneEvents();
    }

    processZoneEvents() {
        if (!this._dragging) {
            return;
        }

        const map = this.getZoneMap();
        const mouse = this.getMouseCoordinates();

        // const zone = map[0];
        // console.dir(zone.x+' <> '+mouse.x+', '+zone.y+' <> '+mouse.y);

        map.forEach((zone) => {
            const isIn = this.isInZone(zone, mouse);

            if (this._zones.has(zone.zNative)) {
                if (!isIn) {
                    this._zones.delete(zone.zNative);
                    this.onZoneLeave(this.getItem(), zone);
                }
            } else {
                if (isIn) {
                    this._zones.set(zone.zNative, zone);
                    this.onZoneEnter(this.getItem(), zone);
                }
            }
        });
    }

    isInZone(zone, mouse) {
        return (
            (mouse.x >= zone.x && mouse.y >= zone.y)
            &&
            (mouse.x <= (zone.x + zone.width) && mouse.y <= (zone.y + zone.height))
        );
    }

    getZoneMap() {
        const zones = [];
        this.getKnownZones().each((i, zone) => {
            const z = $(zone);

            const coords = this.getBounds(z);
            coords.zNative = zone;
            coords.zone = z;

            // in absolute values
            zones.push(coords);
        });

        return zones;
    }

    getBounds(item) {
        const offset = item.offset();
        return {
            width: item.width(),
            height: item.height(),
            x: offset.left,
            y: offset.top,
        };
    }

    /**
     * Todo: cache here, may be pre-register
     * @returns {jQuery|HTMLElement}
     */
    getKnownZones() {
        const cached = this.getCachedZones();
        if (cached !== null) {
            return cached;
        }

        return [];
        // return $('[data-dnd-zone="true"]', this.getScope());
    }

    getCachedZones() {
        if (this._knownZones === null) {
            if (_.isArrayNotEmpty(this.props.zones)) {
                let zones = $([]);
                this.props.zones.forEach((zone) => {
                    zones = zones.add(zone);
                });
                this._knownZones = zones;
            } else {
                this._knownZones = [];
            }
        }

        return this._knownZones.length ? this._knownZones : null;
    }

    // getScope() {
    //     return this.props.scope || null;
    // }

    /**
     * By default, the drop event occurs when the mouse was released above the dropzone,
     * but it *could* be not always so...
     * @returns {*}
     */
    getSuitableZone() {
        return this.getBottomZone();
        // return Util.findClosestParent(e.target, '[data-dnd-zone="true"]');
    }

    getBottomZone() {
        if (this._zones.size) {
            let found = null;

            this._zones.forEach((z) => {
                if (found === null) {
                    found = z;
                }
            });

            return found;
        }

        return null;
    }

    setItem(item, handle) {
        this._item = item;
        this._handle = handle;
    }

    clearItemReferences() {
        this._item = null;
        this._handle = null;
    }

    clearZoneReferences() {
        this._knownZones = null;
        this.clearZoneSet();
    }

    clearZoneSet() {
        this._zones.clear();
    }

    clearReferences() {
        this.clearItemReferences();
        this.clearZoneReferences();
    }

    destroy() {
        this.clearReferences();
        this.unBindEvents();
        this.props = null;
    }

    getItem() {
        return this._item || null;
    }

    getHandle() {
        return this._handle;
    }
}
