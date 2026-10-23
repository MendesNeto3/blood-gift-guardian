import { describe, expect, test } from 'bun:test';
import { isDemoSlotAvailable, isDemoDocumentAllowed, type DemoRequest } from './donor-demo';
describe('Isolated donor prototype', () => {
  const date = '2099-01-15';
  test('an active personal request blocks the same center, date and hour', () => {
    const request: DemoRequest = { id: 'demo', center: 'Central', date, time: '09:00', status: 'solicitado' };
    expect(isDemoSlotAvailable('Central', date, '09:00', [request])).toBe(false);
    expect(isDemoSlotAvailable('Norte', date, '09:00', [request])).toBe(true);
    expect(isDemoSlotAvailable('Central', date, '09:00', [{ ...request, status: 'cancelado' }])).toBe(true);
  });
  test('past and fictional occupied slots cannot be requested', () => {
    expect(isDemoSlotAvailable('Central', '2020-01-01', '09:00', [])).toBe(false);
    expect(isDemoSlotAvailable('Central', date, '10:00', [])).toBe(false);
    expect(isDemoSlotAvailable('Central', date, '09:00', [])).toBe(true);
  });
  test('only PDF, JPEG and PNG up to 10 MB are accepted', () => {
    expect(isDemoDocumentAllowed({ type: 'application/pdf', size: 10 * 1024 * 1024 })).toBe(true);
    expect(isDemoDocumentAllowed({ type: 'image/jpeg', size: 100 })).toBe(true);
    expect(isDemoDocumentAllowed({ type: 'image/png', size: 100 })).toBe(true);
    expect(isDemoDocumentAllowed({ type: 'application/pdf', size: 10 * 1024 * 1024 + 1 })).toBe(false);
    expect(isDemoDocumentAllowed({ type: 'text/plain', size: 100 })).toBe(false);
  });
});