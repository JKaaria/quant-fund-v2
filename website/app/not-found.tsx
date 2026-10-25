import {publicHref} from '../lib/deployment.mjs';
export default function NotFound(){return <main className="not-found"><p className="eyebrow">404 / Unpublished route</p><h1>No public record at this address.</h1><p>Only the frozen seven strategies and published observation dates have report pages.</p><a className="button" href={publicHref("/")}>Return to the overview</a></main>;}
