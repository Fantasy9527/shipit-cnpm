var utils = require('shipit-utils');

/**
 * Register cnpm tasks.
 * - cnpm
 * - cnpm:install
 * - cnpm:run
 */

module.exports = function (gruntOrShipit) {
  var shipit = utils.getShipit(gruntOrShipit);

  require('./init')(gruntOrShipit);
  require('./install')(gruntOrShipit);
  require('./cmd')(gruntOrShipit);

  utils.registerTask(gruntOrShipit, 'cnpm:run', [
    'cnpm:init',
    'cnpm:cmd'
  ]);

  shipit.on('deploy', function () {
    shipit.start('cnpm:init');

    shipit.on('cnpm_inited', function () {
      if (shipit.config.cnpm.triggerEvent) {
        shipit.on(shipit.config.cnpm.triggerEvent, function () {
          shipit.start('cnpm:install');
        });
      }
    });

  });
};
