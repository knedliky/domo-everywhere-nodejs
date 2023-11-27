const app = require('./app.js');
const yargs = require('yargs');

const argv = yargs
    .option('port', {
        alias: 'p',
        description: 'Specify which port to listen on',
        default: 3001,
        type: 'number',
    })
    .help()
    .alias('help', 'h')
    .argv;

app.listen(argv.port, () => console.log(`Example app listening on port ${argv.port}!`))
