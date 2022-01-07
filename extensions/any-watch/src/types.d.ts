import { Icon } from '@raycast/api'

export type JqExpression = string

export type Endpoint = {
  title: string;
  description: string;
  url: string;
  
  icon?: Icon | string;
  subTitle?: string;
  status?: string;
  accessoryIcon?: Icon | string;

  summary?: string;

  refreshInterval: number; // in seconds
  lastFetchedAt?: number;

  renderedResults?: {
    subTitle?: string;
    status?: string;
    summary?: string;
  };
}

export interface Preferences {
  jqPath: string
}


// An example Endpoint structure may look as follows:

/*

const endpoint = {
  title: 'ETH Gas price',
  url: 'https://ethgasstation.info/json/ethgasAPI.json',

  icon: '💸',
  subTitle: 'ETH',
  accessoryTitle: 'Average {{ .average }} Gwei',
  accessoryIcon: '💰',

  summary: 'The current ETH gas price is {{ .average }} Gwei',
  refreshInterval: 60,
}

*/