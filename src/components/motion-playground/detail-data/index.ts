import { ORBITING_BALLS_DETAIL } from './orbiting-balls.data';
import { BOUNCING_BALL_DETAIL } from './bouncing-ball.data';
import { KINETIC_TYPOGRAPHY_DETAIL } from './kinetic-typography.data';
import { MAGNETIC_BUTTON_DETAIL } from './magnetic-button.data';
import { FLOATING_SPHERE_DETAIL } from './floating-sphere.data';
import { PARTICLE_FIELD_DETAIL } from './particle-field.data';

export const ALL_EXPERIMENT_DETAILS = {
  'orbiting-balls': ORBITING_BALLS_DETAIL,
  'bouncing-ball': BOUNCING_BALL_DETAIL,
  'kinetic-typography': KINETIC_TYPOGRAPHY_DETAIL,
  'magnetic-button': MAGNETIC_BUTTON_DETAIL,
  'floating-sphere-3d': FLOATING_SPHERE_DETAIL,
  'floating-sphere': FLOATING_SPHERE_DETAIL, // Alias
  'particle-field': PARTICLE_FIELD_DETAIL,
};

export type ExperimentDetailType = typeof ORBITING_BALLS_DETAIL;
