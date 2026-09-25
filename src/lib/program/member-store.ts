"use client";

import { useSyncExternalStore } from "react";
import type { PlacementAnswers } from "./placement";

/**
 * Member data kept in localStorage for the first version, alongside the
 * mock auth token. When a real backend arrives, these functions are the
 * seam to replace.
 */
export const PROFILE_STORAGE_KEY = "member_profile_v1";
export const SESSIONS_STORAGE_KEY = "member_sessions_v1";

export const TRIAL_LENGTH_DAYS = 14;

export type Feeling = "comfortable" | "justRight" | "tooMuch";

export interface MemberProfile {
  programId: string;
  answers: PlacementAnswers;
  trialStartedAt: string;
  /** Program exercise id → the easier/harder exercise chosen in its place. */
  swaps: Record<string, string>;
}

export interface CompletedSession {
  completedAt: string;
  programId: string;
  feeling: Feeling;
}

type Listener = () => void;
let listeners: Listener[] = [];

function subscribe(listener: Listener) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function notify() {
  listeners.forEach((l) => l());
}

// useSyncExternalStore needs a stable snapshot, so parsed values are cached
// against the raw string they came from.
const parseCache = new Map<string, unknown>();

function read<T>(key: string, fallback: T): T {
  const raw = window.localStorage.getItem(key);
  if (raw === null) return fallback;
  if (!parseCache.has(raw)) {
    try {
      parseCache.set(raw, JSON.parse(raw));
    } catch {
      return fallback;
    }
  }
  return parseCache.get(raw) as T;
}

function write(key: string, value: unknown) {
  window.localStorage.setItem(key, JSON.stringify(value));
  notify();
}

const NO_SESSIONS: CompletedSession[] = [];

export function readProfile(): MemberProfile | null {
  return read<MemberProfile | null>(PROFILE_STORAGE_KEY, null);
}

export function readSessions(): CompletedSession[] {
  return read<CompletedSession[]>(SESSIONS_STORAGE_KEY, NO_SESSIONS);
}

export function saveProfile(profile: MemberProfile) {
  write(PROFILE_STORAGE_KEY, profile);
}

export function saveSwap(originalId: string, chosenId: string) {
  const profile = readProfile();
  if (!profile) return;
  const swaps = { ...profile.swaps };
  if (chosenId === originalId) {
    delete swaps[originalId];
  } else {
    swaps[originalId] = chosenId;
  }
  saveProfile({ ...profile, swaps });
}

export function recordSession(session: CompletedSession) {
  write(SESSIONS_STORAGE_KEY, [...readSessions(), session]);
}

export function useMemberProfile(): MemberProfile | null {
  return useSyncExternalStore(subscribe, readProfile, () => null);
}

export function useCompletedSessions(): CompletedSession[] {
  return useSyncExternalStore(subscribe, readSessions, () => NO_SESSIONS);
}

export function trialDaysLeft(
  profile: MemberProfile,
  now = new Date(),
): number {
  const started = new Date(profile.trialStartedAt).getTime();
  const elapsedDays = Math.floor((now.getTime() - started) / 86_400_000);
  return Math.max(0, TRIAL_LENGTH_DAYS - elapsedDays);
}

/** Sessions completed since Monday of the current week. */
export function sessionsThisWeek(
  sessions: CompletedSession[],
  now = new Date(),
): number {
  const monday = new Date(now);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  return sessions.filter((s) => new Date(s.completedAt) >= monday).length;
}

/**
 * A gentle nudge based on how the last two sessions felt. Two "comfortable"
 * in a row suggests trying a harder option; "too much" suggests easing off.
 */
export function progressNudge(
  sessions: CompletedSession[],
): "tryHarder" | "easeOff" | null {
  const last = sessions.at(-1);
  if (!last) return null;
  if (last.feeling === "tooMuch") return "easeOff";
  const previous = sessions.at(-2);
  if (last.feeling === "comfortable" && previous?.feeling === "comfortable") {
    return "tryHarder";
  }
  return null;
}
