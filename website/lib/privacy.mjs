/** Concrete leak indicators. Ordinary research terms such as accounting are permitted. */
export const rules = [
  ['ACCOUNT_IDENTIFIER', /\b(?:DU|U)\d{4,}\b/g],
  ['PRIVATE_PATH', /[/](?:Users|home|private|tmp|Volumes)[/][^\s"<>]+/g],
  ['BROKER_CONNECTION', /\b74(?:96|97)\b|["'](?:client_id|clientId|tws_port|ibkr_host|account_id)["']\s*:/g],
  ['PRIVATE_CONFIGURATION', /local[.]json|["'](?:password|api_key|access_token|client_secret|credentials)["']\s*[:=]\s*["'][^"']+/gi],
  ['ASSIGNED_CREDENTIAL', /\b(?:password|passwd|secret|api[_-]?key|access[_-]?token)\s*[:=]\s*["'][^"']{4,}["']/gi],
  ['PRIVATE_IMPORT', /(?:from|import\s*\()\s*["'][^"']*(?:minimum_fund|ibkr_paper|quant_publication|production_|\/results\/|\/config\/)/g],
];
export function scanBytes(bytes, name = 'artifact') {
  const text = bytes.toString('utf8');
  if (name.endsWith('.csv') || (name.endsWith('.json') && !name.endsWith('package.json') && !name.endsWith('package-lock.json') && !name.endsWith('tsconfig.json'))) {
    if (/\b(?:password|passwd|secret|token|api[_-]?key|access[_-]?token)\s*[:=]\s*["']?[A-Za-z0-9_+\/=-]{4,}/i.test(text)) throw new Error('PRIVATE_DATA_CREDENTIAL:'+name);
    if (/localhost|127[.]0[.]0[.]1|\bclient_id\b|\.env\b/.test(text)) throw new Error('PRIVATE_DATA_CONNECTION:'+name);
  }
  for (const [rule, expression] of rules) {
    expression.lastIndex = 0;
    if (expression.test(text)) throw new Error(`PUBLIC_PRIVACY_FAILURE:${rule}:${name}`);
  }
}
