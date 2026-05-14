/**
 * Thin re-export — severity/status logic lives in tag-picker.js.
 * This module exists so the service worker cache list resolves without 404.
 */

export { getSeverityDefault, getAutoStatus } from './tag-picker.js';
