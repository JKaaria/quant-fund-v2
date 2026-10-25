import {loadDataset} from '../lib/publication.mjs';
import type {Dataset} from '../lib/types';
import {PlatformPage} from '../components/Pages';
export default function Page(){return <PlatformPage data={loadDataset() as Dataset} path="/"/>;}
