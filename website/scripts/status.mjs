import {loadDataset} from '../lib/publication.mjs';
const d=loadDataset();console.log(JSON.stringify({status:'VALIDATED_PUBLIC_DATA',schema:d.manifest.schema_version,
 observations:d.observations.length,inception:d.fund.forward_inception_date,inception_timing:d.observations[0].observation_timing,
 latest_observation:d.latest.date,nav:d.latest.nav,cumulative_return:d.latest.cumulative_return,external_publication:'NOT_CONFIGURED'},null,2));
