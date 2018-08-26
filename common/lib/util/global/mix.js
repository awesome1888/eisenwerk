class MixinBuilder {
    constructor(superclass) {
        this.superclass = superclass;
    }

    with(...mixins) {
        return mixins.reduce((c, mixin) => mixin(c), this.superclass);
    }
}

const mix = superclass => new MixinBuilder(superclass);

module.exports = mix;
module.exports.default = mix;
