import { ulid } from 'ulid';
import crypto from 'crypto';
import type { Rule } from '@/types';

export function deterministicULID(inputs: string[]): string {
  const hash = crypto.createHash('sha256')
    .update(inputs.join('|'))
    .digest();
  
  const entropy = () => hash.readUInt8(Math.floor(Math.random() * 10));
  return ulid(Date.now(), entropy);
}

export function generateRuleResourceId(policyId: string, rule: Rule): string {
  const inputs = [
    policyId,
    rule.id,
    rule.kind,
  ];

  switch (rule.kind) {
    case 'forum':
      inputs.push(JSON.stringify(rule.config || {}));
      break;
    case 'service':
      inputs.push(JSON.stringify(rule.config || {}));
      break;
    case 'policy':
      inputs.push(JSON.stringify(rule.reference));
      break;
  }

  return deterministicULID(inputs);
}