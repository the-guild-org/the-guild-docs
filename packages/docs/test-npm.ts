import { fetch } from 'undici';

const response1 = await fetch(`https://registry.npmjs.org/${encodeURIComponent('bob-tsm')}`);

console.log(await response1.json());

const response2 = await fetch(`https://api.npmjs.org/downloads/point/last-week/${encodeURIComponent('bob-tsm')}`);

console.log(await response2.json());
