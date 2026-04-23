import { person } from 'emdash';
import { cloudflare } from 'emdash/adapter/cloudflare';

export const ALL = person({
  adapter: cloudflare(),
});
