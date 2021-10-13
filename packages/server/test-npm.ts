import { fetch } from 'undici';

const response = await fetch(`https://registry.npmjs.org/${encodeURIComponent('bob-tsm')}/latest`);

console.log(await response.json());
