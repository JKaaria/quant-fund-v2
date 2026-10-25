import {loadDataset} from '../lib/publication.mjs';
const data=loadDataset();
console.log(JSON.stringify({status:'PASS',schema:data.manifest.schema_version,observations:data.observations.length,strategies:data.strategies.length}));
