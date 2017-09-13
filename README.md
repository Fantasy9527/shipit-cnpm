# shipit-cnpm

A set of tasks for [Shipit](https://github.com/shipitjs/shipit) used for [cnpm](https://docs.cnpmjs.com/) specific tasks on deploy.

Inspired by the [capistrano/composer](https://github.com/capistrano/composer/) extension.


**Features:**

- Triggered on the `updated` or `fetched` event from [shipit-deploy](https://github.com/shipitjs/shipit-deploy)
- Has a direct pass though task to [cnpm cli](https://cnpmjs.org)
- Works via [shipit-cli](https://github.com/shipitjs/shipit) and [grunt-shipit](https://github.com/shipitjs/grunt-shipit)

## Install

```
npm install shipit-cnpm
```

## Usage

Just simply run: (This triggers the `cnpm` task on the deploy `updated` or `fetched` event. No additional config necessary.)

```
shipit staging deploy

```

Or you can run the tasks separatly :

```
shipit staging cnpm:init cnpm:install
shipit staging cnpm:run --cmd "update"

```


## Options `shipit.config.cnpm`

### `cnpm.remote`

Type: `Boolean`
Default: `true`

A Boolean to determine whether to run the task in local workspace or on the remote.

### `cnpm.installArgs`

Type: `Array` or `String`
Default: []

An array or string specifying cnpm args passed to the [cnpm install](https://docs.cnpmjs.com/cli/install) cmd.

### `cnpm.installFlags`

Type: `Array` or `String`
Default: []

An array or string specifying cnpm flags passed to the [cnpm install](https://docs.cnpmjs.com/cli/install) cmd.

### `cnpm.triggerEvent`

Type: `String`,`Boolean`
Default: `updated` or `fetched` (depending on `cnpm.remote` value)

An event name that triggers `cnpm:install`. Can be set to false to prevent the `cnpm:install` task from listening to any events.


### Example `shipitfile.js` options usage

```js
module.exports = function (shipit) {
  require('shipit-deploy')(shipit);
  require('shipit-cnpm')(shipit);

  shipit.initConfig({
    default: {
      cnpm: {
        remote: false,
        installArgs: ['gulp'],
        installFlags: ['-g']
      }
    }
  });
};
```

## Workflow tasks

- cnpm
  - cnpm:init
      - Emit event "cnpm_inited".
  - cnpm:install
    - Runs cnpm install (with any Args `cnpm.installArgs` or Flags `cnpm.installFlags` defined in options)
    - Emit event "cnpm_installed"
  - cnpm:run
      - Runs cnpm command.

##### Event flow:

- on Event "deploy" (shipit-deploy initialized)
  - Runs *cnpm:init*
  - on Event "cnpm_inited"
    - Runs *cnpm:install* (Triggered on the `updated` or `fetched` event from [shipit-deploy](https://github.com/shipitjs/shipit-deploy) or by a custom `cnpm.triggerEvent` as mentioned above.)

## License

MIT
