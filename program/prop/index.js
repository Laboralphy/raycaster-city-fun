/**
 * This function will allow easy building of jquery like method
 * class XXX {
 *      myproperty(x) {
 *          return prop(this, '_myproperty', x);
 *      }
 * }
 *
 * let x = new XXX();
 * x.myproperty(444); // will set x._myproperty to 444. plus this method is chainable;
 * x.myproperty(); // will return 444
 *
 * @param oInstance {*}
 * @param sProperty {string}
 * @param value {*}
 * @return {*}
 */

const SB = require('../o876/SpellBook');

module.exports = SB.prop;