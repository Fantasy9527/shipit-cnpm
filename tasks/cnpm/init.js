var utils = require('shipit-utils');
var path = require('path');
/**
 * Init task.
 * - Emit cnpm_inited event.
 */

module.exports = function (gruntOrShipit) {
  utils.registerTask(gruntOrShipit, 'cnpm:init', task);

  function task() {
    var shipit = utils.getShipit(gruntOrShipit);

    shipit.config = shipit.config || {};
    shipit.currentPath = shipit.config.deployTo ? path.join(shipit.config.deployTo, 'current') : undefined;
    shipit.config.cnpm = shipit.config.cnpm || {};
    shipit.config.cnpm.remote = shipit.config.cnpm.remote !== false;
    shipit.config.cnpm.installArgs = shipit.config.cnpm.installArgs || [];
    shipit.config.cnpm.installFlags = shipit.config.cnpm.installFlags || [];

    var triggerEvent = shipit.config.cnpm.remote ? 'updated' : 'fetched';
    shipit.config.cnpm.triggerEvent = shipit.config.cnpm.triggerEvent !== undefined ? shipit.config.cnpm.triggerEvent : triggerEvent;

    shipit.cnpm_inited = true;
    shipit.emit('cnpm_inited');
  }
};
