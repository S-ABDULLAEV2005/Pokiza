import {spawn} from 'node:child_process';
const preview=process.argv.includes('--host');
const child=preview?spawn('python3',['-m','http.server','4173','--bind','0.0.0.0','--directory','out'],{stdio:'inherit'}):spawn('node',['node_modules/next/dist/bin/next','dev'],{stdio:'inherit'});
child.on('exit',code=>process.exit(code??0));
