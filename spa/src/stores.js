import { writable } from 'svelte/store';

/**
 * The current authenticated user
 */
export const AuthUser = writable(null);