import { LIQUID_METAL_BALL_DETAIL } from './liquid-metal-ball.data';
import { ATOMIC_NETWORK_DETAIL } from './atomic-network.data';
import { CHAOTIC_TYPOGRAPHY_DETAIL } from './chaotic-typography.data';
import { INFINITE_TUNNEL_DETAIL } from './infinite-tunnel.data';
import { GALACTIC_CORE_DETAIL } from './galactic-core.data';
import { HELIUM_BALLOON_DETAIL } from './helium-balloon.data';

export const ALL_EXPERIMENT_DETAILS = {
  'liquid-metal-ball': LIQUID_METAL_BALL_DETAIL,
  'atomic-network': ATOMIC_NETWORK_DETAIL,
  'chaotic-typography': CHAOTIC_TYPOGRAPHY_DETAIL,
  'infinite-tunnel': INFINITE_TUNNEL_DETAIL,
  'galactic-core': GALACTIC_CORE_DETAIL,
  'helium-balloon': HELIUM_BALLOON_DETAIL,
};

export type ExperimentDetailType = typeof HELIUM_BALLOON_DETAIL;
