const app = require('./app');
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

if (!process.env.EMBED_ID || !process.env.CLIENT_ID || !process.env.CLIENT_SECRET || !process.env.EMBED_TYPE || !process.env.AUTH_DATASET_ID) {
    console.log('The following variables must be declared in your .env file: EMBED_ID, CLIENT_ID, CLIENT_SECRET, EMBED_TYPE, AUTH_DATASET_ID.');
    process.exit(1);
}

app.listen(argv.port, () => {
    console.log(`Server is running on port ${argv.port}`);
});