import { batch } from "solid-js";
import type { Client } from "stoat.js";
import { brand } from "./brand";

const key = "peakcut.requested-public-community.v1";
const lifetime = 60 * 60 * 1000;
type Entry = { server: string; expires: number };
let memory: Entry | undefined;
// Preserve an explicitly selected public region through registration, including
// verification in another tab. Never capture arbitrary/private invitation codes.
const selected = location.pathname.match(/^\/invite\/([A-Z0-9]{26})\/?$/)?.[1];
if (selected && brand.regionalServers?.includes(selected)) {
  memory = { server: selected, expires: Date.now() + lifetime };
  try { localStorage.setItem(key, JSON.stringify(memory)); } catch { /* memory fallback */ }
}

function requestedRegion(): string | undefined {
  let request = memory;
  try { request = JSON.parse(localStorage.getItem(key) || "null") || request; } catch { /* memory fallback */ }
  if (request && request.expires > Date.now() && brand.regionalServers?.includes(request.server))
    return request.server;
  return undefined;
}

/** Native join only: bans and channel/role permissions are always server-owned. */
async function join(client: Client, target: string) {
  if (client.servers.has(target)) return false;
  const result = await client.api.post(`/invites/${target as ""}`);
  if (result.type !== "Server" || result.server._id !== target)
    throw new Error("The public community could not be opened.");
  batch(() => {
    for (const channel of result.channels)
      client.channels.getOrCreate(channel._id, channel);
    client.servers.getOrCreate(result.server._id, result.server, true);
  });
  return true;
}

export async function prepareCommunityEntry(client: Client, layout: { setLastActivePath(path: string): void }) {
  if (!client.user) return undefined;
  const mainJoined = brand.communityServer ? await join(client, brand.communityServer) : false;
  const region = requestedRegion();
  if (region) {
    try { await join(client, region); }
    finally {
      // Consume one explicit request even if rejected; a region ban must not
      // leave every later login retry trapped in the same regional join.
      memory = undefined;
      try { localStorage.removeItem(key); } catch { /* memory fallback */ }
    }
    const path = `/server/${region}`;
    layout.setLastActivePath(path);
    return path;
  }
  if (mainJoined) {
    layout.setLastActivePath(brand.communityPath);
    return brand.communityPath;
  }
  return undefined;
}
