// passenger_entry.js
// Namecheap cPanel Passenger startup file. It boots JITI to run server.ts on the fly.
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const jiti = require('jiti')(import.meta.url);
jiti('./server.ts');
