import type { CountyConnector } from './types';
import { snohomishConnector } from './snohomish';

const connectors: Record<string, CountyConnector> = {
  [snohomishConnector.county]: snohomishConnector
};

export function getConnector(county: string): CountyConnector {
  const c = connectors[county];
  if (!c) throw new Error(`No connector registered for county: ${county}`);
  return c;
}

export function listCounties(): string[] {
  return Object.keys(connectors);
}
