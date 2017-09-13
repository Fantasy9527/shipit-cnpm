var utils = require('shipit-utils');
var chalk = require('chalk');
var sprintf = require('sprintf-js').sprintf;
var Bluebird = require('bluebird');

/**
 * Runs cnpm install
 */

module.exports = function (gruntOrShipit) {
  utils.registerTask(gruntOrShipit, 'cnpm:install', task);

  function task() {
    var shipit = utils.getShipit(gruntOrShipit);

    function install(remote) {

      shipit.log('Installing cnpm modules.');
      var method = remote ? 'remote' : 'local';
      var cdPath = remote ? shipit.releasePath || shipit.currentPath : shipit.config.workspace;

      if(!cdPath) {
        var msg = remote ? 'Please specify a deploy to path (shipit.config.deployTo)' : 'Please specify a workspace (shipit.config.workspace)'
        throw new Error(
          shipit.log(chalk.red(msg))
        );
      }

      var args = Array.isArray(shipit.config.cnpm.installArgs) ? shipit.config.cnpm.installArgs.join(' ') : shipit.config.cnpm.installArgs;
      var flags = Array.isArray(shipit.config.cnpm.installFlags) ? shipit.config.cnpm.installFlags.join(' ') : shipit.config.cnpm.installFlags;
      var AF = args ? flags ? args.concat(' ',flags) : args : flags ? flags : '';

      return shipit[method](
        sprintf('node -v && cd %s && cnpm i %s', cdPath, AF)
      );

    }

    if(shipit.cnpm_inited) {

      return install(shipit.config.cnpm.remote)
      .then(function () {
        shipit.log(chalk.green('cnpm install complete'));
      })
      .then(function () {
        shipit.emit('cnpm_installed')
      })
      .catch(function (e) {
        shipit.log(chalk.red(e));
      });

    }else {
      throw new Error(
        shipit.log(
          chalk.gray('try running cnpm:init before cnpm:install')
        )
      );
    }
  }
};
