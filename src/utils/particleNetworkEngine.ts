export interface NetworkParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseSpeed: number;
  wanderAngle: number;
  wanderRate: number;
  radius: number;
  isAccent: boolean;
  searchBoostUntil: number;
  nextBreakAllowedAt: number;
}

export interface NetworkConnection {
  key: string;
  a: number;
  b: number;
  opacity: number;
  state: 'active' | 'fading';
  cooldownUntil: number;
}

export interface PointerState {
  x: number;
  y: number;
  active: boolean;
}

export interface NetworkConfig {
  connectionDistance: number;
  disconnectDistance: number;
  maxConnectionsPerParticle: number;
  repulsionRadius: number;
  maxRepelForce: number;
  maxSpeed: number;
  particleBreakRadius: number;
  lineBreakRadius: number;
  reconnectCooldownMs: number;
  particleBreakCooldownMs: number;
  searchBoostDurationMs: number;
}

export interface ParticleNetworkState {
  width: number;
  height: number;
  particles: NetworkParticle[];
  connections: NetworkConnection[];
  connectionMap: Map<string, NetworkConnection>;
  pairCooldowns: Map<string, number>;
  config: NetworkConfig;
}

export function makePairKey(a: number, b: number): string {
  return a < b ? `${a}:${b}` : `${b}:${a}`;
}

/**
 * Computes squared shortest distance from point (px, py) to finite line segment (ax, ay)-(bx, by),
 * plus which endpoint index/flag is closer.
 */
export function pointToSegmentDistanceSq(
  px: number,
  py: number,
  ax: number,
  ay: number,
  bx: number,
  by: number
): number {
  const abx = bx - ax;
  const aby = by - ay;
  const abLenSq = abx * abx + aby * aby;
  if (abLenSq <= 0.0001) {
    const dx = px - ax;
    const dy = py - ay;
    return dx * dx + dy * dy;
  }
  const apx = px - ax;
  const apy = py - ay;
  let t = (apx * abx + apy * aby) / abLenSq;
  if (t < 0) t = 0;
  else if (t > 1) t = 1;
  const closestX = ax + t * abx;
  const closestY = ay + t * aby;
  const dx = px - closestX;
  const dy = py - closestY;
  return dx * dx + dy * dy;
}

export function resolveResponsiveConfig(width: number, height: number): {
  particleCount: number;
  config: NetworkConfig;
} {
  const safeW = Math.max(320, width);
  const safeH = Math.max(320, height);
  const area = safeW * safeH;

  let particleCount: number;
  let connectionDistance: number;
  let repulsionRadius: number;

  if (safeW < 640) {
    particleCount = Math.max(24, Math.min(34, Math.floor(area / 16000)));
    connectionDistance = 112;
    repulsionRadius = 110;
  } else if (safeW < 1024) {
    particleCount = Math.max(36, Math.min(48, Math.floor(area / 15500)));
    connectionDistance = 132;
    repulsionRadius = 130;
  } else {
    particleCount = Math.max(48, Math.min(72, Math.floor(area / 15500)));
    connectionDistance = 148;
    repulsionRadius = 148;
  }

  return {
    particleCount,
    config: {
      connectionDistance,
      disconnectDistance: connectionDistance * 1.12,
      maxConnectionsPerParticle: 4,
      repulsionRadius,
      maxRepelForce: 0.42,
      maxSpeed: 3.4,
      particleBreakRadius: repulsionRadius * 0.62,
      lineBreakRadius: 22,
      reconnectCooldownMs: 1700,
      particleBreakCooldownMs: 280,
      searchBoostDurationMs: 2400,
    },
  };
}

function createParticle(id: number, width: number, height: number): NetworkParticle {
  const wanderAngle = Math.random() * Math.PI * 2;
  const baseSpeed = 0.28 + Math.random() * 0.34;
  return {
    id,
    x: 16 + Math.random() * Math.max(20, width - 32),
    y: 16 + Math.random() * Math.max(20, height - 32),
    vx: Math.cos(wanderAngle) * baseSpeed,
    vy: Math.sin(wanderAngle) * baseSpeed,
    baseSpeed,
    wanderAngle,
    wanderRate: (Math.random() - 0.5) * 0.028,
    radius: id % 5 === 0 ? 2.5 : 1.5 + Math.random() * 0.7,
    isAccent: id % 4 === 0,
    searchBoostUntil: 0,
    nextBreakAllowedAt: 0,
  };
}

export function createParticleNetworkState(
  width: number,
  height: number
): ParticleNetworkState {
  const safeW = Math.max(320, width);
  const safeH = Math.max(320, height);
  const { particleCount, config } = resolveResponsiveConfig(safeW, safeH);

  const particles: NetworkParticle[] = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push(createParticle(i, safeW, safeH));
  }

  const state: ParticleNetworkState = {
    width: safeW,
    height: safeH,
    particles,
    connections: [],
    connectionMap: new Map(),
    pairCooldowns: new Map(),
    config,
  };

  // Seed initial equilibrium proximity links cleanly
  reorganizeConnections(state, 0, true);
  return state;
}

export function resizeParticleNetworkState(
  state: ParticleNetworkState,
  newWidth: number,
  newHeight: number
): void {
  const safeW = Math.max(320, newWidth);
  const safeH = Math.max(320, newHeight);
  const prevW = state.width || safeW;
  const prevH = state.height || safeH;
  const scaleX = safeW / prevW;
  const scaleY = safeH / prevH;

  state.width = safeW;
  state.height = safeH;

  const { particleCount, config } = resolveResponsiveConfig(safeW, safeH);
  state.config = config;

  // Proportionally preserve existing particle layout while clamping safely inside bounds
  for (let i = 0; i < state.particles.length; i++) {
    const p = state.particles[i];
    p.x = Math.min(safeW - 8, Math.max(8, p.x * scaleX));
    p.y = Math.min(safeH - 8, Math.max(8, p.y * scaleY));
  }

  if (state.particles.length < particleCount) {
    const startId = state.particles.length;
    for (let i = startId; i < particleCount; i++) {
      state.particles.push(createParticle(i, safeW, safeH));
    }
  } else if (state.particles.length > particleCount) {
    state.particles.length = particleCount;
    // Remove edges pointing to truncated particle indices
    for (let i = state.connections.length - 1; i >= 0; i--) {
      const edge = state.connections[i];
      if (edge.a >= particleCount || edge.b >= particleCount) {
        state.connectionMap.delete(edge.key);
        state.connections.splice(i, 1);
      }
    }
  }
}

/**
 * Updates autonomous motion, smooth boundary redirection, and cursor repulsion.
 */
export function updateParticleMotion(
  state: ParticleNetworkState,
  pointer: PointerState,
  dtFactor: number
): void {
  const { particles, width, height, config } = state;
  const pad = 10;
  const repelRadiusSq = config.repulsionRadius * config.repulsionRadius;

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];

    // Subtle unpredictable organic wander drift
    p.wanderRate += (Math.random() - 0.5) * 0.004 * dtFactor;
    if (p.wanderRate > 0.032) p.wanderRate = 0.032;
    else if (p.wanderRate < -0.032) p.wanderRate = -0.032;
    p.wanderAngle += p.wanderRate * dtFactor;

    const targetVx = Math.cos(p.wanderAngle) * p.baseSpeed;
    const targetVy = Math.sin(p.wanderAngle) * p.baseSpeed;

    // Ease back toward autonomous cruise velocity
    const ease = Math.min(0.12, 0.035 * dtFactor);
    p.vx += (targetVx - p.vx) * ease;
    p.vy += (targetVy - p.vy) * ease;

    // Smooth inverse-distance magnetic repulsion (never attraction)
    if (pointer.active) {
      const dx = p.x - pointer.x;
      const dy = p.y - pointer.y;
      const distSq = dx * dx + dy * dy;

      if (distSq < repelRadiusSq) {
        const dist = Math.sqrt(distSq);
        const norm = 1 - dist / config.repulsionRadius;
        const force = norm * norm * config.maxRepelForce * dtFactor;

        let nx = 0;
        let ny = 0;
        if (dist > 0.001) {
          nx = dx / dist;
          ny = dy / dist;
        } else {
          nx = Math.cos(p.wanderAngle);
          ny = Math.sin(p.wanderAngle);
        }

        p.vx += nx * force;
        p.vy += ny * force;

        // Steer wander angle away smoothly so particle swims away cleanly
        if (norm > 0.25) {
          p.wanderAngle = Math.atan2(p.vy, p.vx);
        }
      }
    }

    // Clamp max velocity for stability
    const speedSq = p.vx * p.vx + p.vy * p.vy;
    if (speedSq > config.maxSpeed * config.maxSpeed) {
      const s = config.maxSpeed / Math.sqrt(speedSq);
      p.vx *= s;
      p.vy *= s;
    }

    p.x += p.vx * dtFactor;
    p.y += p.vy * dtFactor;

    // Gentle boundary bounce & inward redirection
    if (p.x < pad) {
      p.x = pad;
      p.vx = Math.abs(p.vx);
      p.wanderAngle = Math.atan2(p.vy, p.vx);
    } else if (p.x > width - pad) {
      p.x = width - pad;
      p.vx = -Math.abs(p.vx);
      p.wanderAngle = Math.atan2(p.vy, p.vx);
    }

    if (p.y < pad) {
      p.y = pad;
      p.vy = Math.abs(p.vy);
      p.wanderAngle = Math.atan2(p.vy, p.vx);
    } else if (p.y > height - pad) {
      p.y = height - pad;
      p.vy = -Math.abs(p.vy);
      p.wanderAngle = Math.atan2(p.vy, p.vx);
    }
  }
}

function breakEdge(
  state: ParticleNetworkState,
  edge: NetworkConnection,
  nowMs: number,
  affectedIndex: number | null
): void {
  if (edge.state === 'fading') return;
  edge.state = 'fading';
  edge.cooldownUntil = nowMs + state.config.reconnectCooldownMs;
  state.pairCooldowns.set(edge.key, edge.cooldownUntil);

  if (affectedIndex !== null) {
    const p = state.particles[affectedIndex];
    if (p) {
      p.searchBoostUntil = nowMs + state.config.searchBoostDurationMs;
      p.nextBreakAllowedAt = nowMs + state.config.particleBreakCooldownMs;
    }
  }
}

/**
 * Applies Rule 4 (break ONLY nearest connection when approaching multi-linked particle)
 * and Rule 5 (direct line-segment interaction breaking & endpoint neighbor search).
 */
export function applyPointerConnectionBreaking(
  state: ParticleNetworkState,
  pointer: PointerState,
  nowMs: number
): void {
  if (!pointer.active) return;

  const { particles, connections, config } = state;
  const particleBreakRadiusSq = config.particleBreakRadius * config.particleBreakRadius;
  const lineBreakRadiusSq = config.lineBreakRadius * config.lineBreakRadius;

  // 1. Direct Line-Segment Interaction (Rule 5)
  for (let i = 0; i < connections.length; i++) {
    const edge = connections[i];
    if (edge.state !== 'active') continue;

    const pA = particles[edge.a];
    const pB = particles[edge.b];
    const segDistSq = pointToSegmentDistanceSq(
      pointer.x,
      pointer.y,
      pA.x,
      pA.y,
      pB.x,
      pB.y
    );

    if (segDistSq <= lineBreakRadiusSq) {
      const dASq = (pA.x - pointer.x) ** 2 + (pA.y - pointer.y) ** 2;
      const dBSq = (pB.x - pointer.x) ** 2 + (pB.y - pointer.y) ** 2;
      const closerIdx = dASq <= dBSq ? edge.a : edge.b;
      breakEdge(state, edge, nowMs, closerIdx);
    }
  }

  // 2. Nearest-Connection-Only Breaking near multi-connected particles (Rule 4)
  for (let idx = 0; idx < particles.length; idx++) {
    const p = particles[idx];
    if (nowMs < p.nextBreakAllowedAt) continue;

    const distSq = (p.x - pointer.x) ** 2 + (p.y - pointer.y) ** 2;
    if (distSq > particleBreakRadiusSq) continue;

    // Collect active edges attached to particle idx
    let activeCount = 0;
    let nearestEdge: NetworkConnection | null = null;
    let nearestEdgeDistSq = Infinity;

    for (let eIdx = 0; eIdx < connections.length; eIdx++) {
      const edge = connections[eIdx];
      if (edge.state !== 'active') continue;
      if (edge.a !== idx && edge.b !== idx) continue;

      activeCount++;
      const pA = particles[edge.a];
      const pB = particles[edge.b];
      const segDistSq = pointToSegmentDistanceSq(
        pointer.x,
        pointer.y,
        pA.x,
        pA.y,
        pB.x,
        pB.y
      );

      if (segDistSq < nearestEdgeDistSq) {
        nearestEdgeDistSq = segDistSq;
        nearestEdge = edge;
      }
    }

    // Break ONLY if this particle has multiple connections; leave all others untouched
    if (activeCount > 1 && nearestEdge) {
      breakEdge(state, nearestEdge, nowMs, idx);
      p.nextBreakAllowedAt = nowMs + config.particleBreakCooldownMs;
    }
  }
}

/**
 * Updates connection opacities, fades disconnected/broken edges smoothly,
 * purges expired cooldowns, and forms new proximity links (prioritizing
 * endpoints actively seeking reconnection after a break).
 */
export function reorganizeConnections(
  state: ParticleNetworkState,
  nowMs: number,
  instantSeed = false,
  dtFactor = 1
): void {
  const { particles, connections, connectionMap, pairCooldowns, config } = state;
  const connectDistSq = config.connectionDistance * config.connectionDistance;
  const disconnectDistSq = config.disconnectDistance * config.disconnectDistance;

  // Purge expired cooldown pairs cleanly
  for (const [key, until] of pairCooldowns.entries()) {
    if (nowMs >= until) {
      pairCooldowns.delete(key);
    }
  }

  // Track active degree per particle
  const activeCounts = new Int16Array(particles.length);

  // Update existing connections (fade or smooth distance opacity)
  for (let i = connections.length - 1; i >= 0; i--) {
    const edge = connections[i];
    const pA = particles[edge.a];
    const pB = particles[edge.b];
    const dx = pA.x - pB.x;
    const dy = pA.y - pB.y;
    const distSq = dx * dx + dy * dy;

    if (edge.state === 'active') {
      if (distSq > disconnectDistSq) {
        edge.state = 'fading';
      } else {
        activeCounts[edge.a]++;
        activeCounts[edge.b]++;
        const dist = Math.sqrt(distSq);
        const targetOpacity = Math.max(0.05, 1 - dist / config.connectionDistance);
        if (instantSeed) {
          edge.opacity = targetOpacity;
        } else {
          edge.opacity += (targetOpacity - edge.opacity) * Math.min(1, 0.16 * dtFactor);
        }
      }
    }

    if (edge.state === 'fading') {
      edge.opacity -= 0.055 * dtFactor;
      if (edge.opacity <= 0.01) {
        connectionMap.delete(edge.key);
        connections.splice(i, 1);
      }
    }
  }

  // Phase A: Boosted particles (that recently lost a link) search for their nearest eligible neighbor first
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    if (nowMs >= p.searchBoostUntil) continue;
    if (activeCounts[i] >= config.maxConnectionsPerParticle) continue;

    let bestPartner = -1;
    let bestDistSq = connectDistSq;

    for (let j = 0; j < particles.length; j++) {
      if (i === j) continue;
      if (activeCounts[j] >= config.maxConnectionsPerParticle) continue;

      const key = makePairKey(i, j);
      if (connectionMap.has(key)) continue;
      const cooldownUntil = pairCooldowns.get(key);
      if (cooldownUntil !== undefined && nowMs < cooldownUntil) continue;

      const other = particles[j];
      const dx = p.x - other.x;
      const dy = p.y - other.y;
      const dSq = dx * dx + dy * dy;
      if (dSq <= bestDistSq) {
        bestDistSq = dSq;
        bestPartner = j;
      }
    }

    if (bestPartner !== -1) {
      const a = i < bestPartner ? i : bestPartner;
      const b = i < bestPartner ? bestPartner : i;
      const key = `${a}:${b}`;
      const edge: NetworkConnection = {
        key,
        a,
        b,
        opacity: 0.04,
        state: 'active',
        cooldownUntil: 0,
      };
      connections.push(edge);
      connectionMap.set(key, edge);
      activeCounts[a]++;
      activeCounts[b]++;
      p.searchBoostUntil = 0;
    }
  }

  // Phase B: Standard proximity connection discovery across remaining eligible pairs
  for (let i = 0; i < particles.length; i++) {
    if (activeCounts[i] >= config.maxConnectionsPerParticle) continue;
    const pA = particles[i];

    for (let j = i + 1; j < particles.length; j++) {
      if (activeCounts[i] >= config.maxConnectionsPerParticle) break;
      if (activeCounts[j] >= config.maxConnectionsPerParticle) continue;

      const key = `${i}:${j}`;
      if (connectionMap.has(key)) continue;
      const cooldownUntil = pairCooldowns.get(key);
      if (cooldownUntil !== undefined && nowMs < cooldownUntil) continue;

      const pB = particles[j];
      const dx = pA.x - pB.x;
      const dy = pA.y - pB.y;
      const dSq = dx * dx + dy * dy;

      if (dSq <= connectDistSq) {
        const dist = Math.sqrt(dSq);
        const edge: NetworkConnection = {
          key,
          a: i,
          b: j,
          opacity: instantSeed ? Math.max(0.05, 1 - dist / config.connectionDistance) : 0.03,
          state: 'active',
          cooldownUntil: 0,
        };
        connections.push(edge);
        connectionMap.set(key, edge);
        activeCounts[i]++;
        activeCounts[j]++;
      }
    }
  }
}

export function stepParticleNetwork(
  state: ParticleNetworkState,
  pointer: PointerState,
  nowMs: number,
  dtFactor = 1
): void {
  updateParticleMotion(state, pointer, dtFactor);
  applyPointerConnectionBreaking(state, pointer, nowMs);
  reorganizeConnections(state, nowMs, false, dtFactor);
}
