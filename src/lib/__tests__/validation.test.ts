import { describe, it, expect } from 'vitest';
import {
  emailSchema,
  usernameSchema,
  passwordSchema,
  chatMessageSchema,
  bookingSchema,
  wellnessEntrySchema,
  symptomTrackingSchema,
  supportPlanLogSchema,
  wisdomGuideRequestSchema,
  bookingEmailRequestSchema,
  validateInput,
  truncateText,
} from '../validation';

// ============================================
// emailSchema
// ============================================
describe('emailSchema', () => {
  it('accepts a valid email', () => {
    expect(emailSchema.safeParse('test@example.com').success).toBe(true);
  });

  it('trims whitespace', () => {
    const result = emailSchema.safeParse('  user@example.com  ');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe('user@example.com');
    }
  });

  it('rejects an invalid email', () => {
    expect(emailSchema.safeParse('not-an-email').success).toBe(false);
  });

  it('rejects an empty string', () => {
    expect(emailSchema.safeParse('').success).toBe(false);
  });
});

// ============================================
// usernameSchema
// ============================================
describe('usernameSchema', () => {
  it('accepts a valid username', () => {
    expect(usernameSchema.safeParse('Mumtaz').success).toBe(true);
  });

  it('rejects a username shorter than 3 chars', () => {
    expect(usernameSchema.safeParse('ab').success).toBe(false);
  });

  it('rejects a username longer than 50 chars', () => {
    expect(usernameSchema.safeParse('a'.repeat(51)).success).toBe(false);
  });

  it('trims whitespace', () => {
    const result = usernameSchema.safeParse('  hello  ');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe('hello');
    }
  });
});

// ============================================
// passwordSchema
// ============================================
describe('passwordSchema', () => {
  it('accepts a password with 6 or more characters', () => {
    expect(passwordSchema.safeParse('secure123').success).toBe(true);
  });

  it('rejects a password shorter than 6 characters', () => {
    expect(passwordSchema.safeParse('short').success).toBe(false);
  });
});

// ============================================
// chatMessageSchema
// ============================================
describe('chatMessageSchema', () => {
  it('accepts a valid message', () => {
    const result = chatMessageSchema.safeParse({ content: 'Hello!' });
    expect(result.success).toBe(true);
  });

  it('trims and rejects an empty message', () => {
    expect(chatMessageSchema.safeParse({ content: '   ' }).success).toBe(false);
  });

  it('rejects a message exceeding 2000 chars', () => {
    const result = chatMessageSchema.safeParse({ content: 'x'.repeat(2001) });
    expect(result.success).toBe(false);
  });
});

// ============================================
// bookingSchema
// ============================================
describe('bookingSchema', () => {
  it('accepts a valid booking', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    const result = bookingSchema.safeParse({
      service_id: '550e8400-e29b-41d4-a716-446655440000',
      booking_date: futureDate.toISOString(),
    });
    expect(result.success).toBe(true);
  });

  it('rejects a past booking date', () => {
    const result = bookingSchema.safeParse({
      service_id: '550e8400-e29b-41d4-a716-446655440000',
      booking_date: '2020-01-01T00:00:00.000Z',
    });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid service_id', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    const result = bookingSchema.safeParse({
      service_id: 'not-a-uuid',
      booking_date: futureDate.toISOString(),
    });
    expect(result.success).toBe(false);
  });
});

// ============================================
// wellnessEntrySchema
// ============================================
describe('wellnessEntrySchema', () => {
  it('accepts empty optional fields', () => {
    expect(wellnessEntrySchema.safeParse({}).success).toBe(true);
  });

  it('accepts valid emotional and pain scores', () => {
    const result = wellnessEntrySchema.safeParse({
      emotional_score: 7,
      pain_level: 3,
      trimester: 2,
    });
    expect(result.success).toBe(true);
  });

  it('rejects pain_level above 10', () => {
    const result = wellnessEntrySchema.safeParse({ pain_level: 11 });
    expect(result.success).toBe(false);
  });

  it('rejects emotional_score above 10', () => {
    const result = wellnessEntrySchema.safeParse({ emotional_score: 11 });
    expect(result.success).toBe(false);
  });

  it('rejects trimester above 3', () => {
    const result = wellnessEntrySchema.safeParse({ trimester: 4 });
    expect(result.success).toBe(false);
  });

  it('rejects emotional_state exceeding 100 chars', () => {
    const result = wellnessEntrySchema.safeParse({
      emotional_state: 'x'.repeat(101),
    });
    expect(result.success).toBe(false);
  });
});

// ============================================
// symptomTrackingSchema
// ============================================
describe('symptomTrackingSchema', () => {
  it('accepts a valid condition tracking entry', () => {
    const result = symptomTrackingSchema.safeParse({
      condition_type: 'pcos',
      pain_level: 5,
      notes: 'Feeling some discomfort today',
      symptoms: ['bloating', 'fatigue'],
    });
    expect(result.success).toBe(true);
  });

  it('rejects an invalid condition_type', () => {
    const result = symptomTrackingSchema.safeParse({
      condition_type: 'unknown',
      pain_level: 3,
    });
    expect(result.success).toBe(false);
  });

  it('validates all condition types', () => {
    const validTypes = ['pcos', 'endometriosis', 'pmdd', 'irregular', 'arthritis', 'general'];
    for (const type of validTypes) {
      expect(
        symptomTrackingSchema.safeParse({ condition_type: type, pain_level: 1 }).success
      ).toBe(true);
    }
  });
});

// ============================================
// supportPlanLogSchema
// ============================================
describe('supportPlanLogSchema', () => {
  it('accepts a valid support plan log', () => {
    const result = supportPlanLogSchema.safeParse({
      recommendation_title: 'Morning Pranayama',
      recommendation_type: 'breathing',
      support_rating: 4,
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing title', () => {
    const result = supportPlanLogSchema.safeParse({
      recommendation_type: 'breathing',
    });
    expect(result.success).toBe(false);
  });

  it('rejects support_rating outside 1-5', () => {
    expect(
      supportPlanLogSchema.safeParse({
        recommendation_title: 'Test',
        recommendation_type: 'yoga',
        support_rating: 6,
      }).success
    ).toBe(false);

    expect(
      supportPlanLogSchema.safeParse({
        recommendation_title: 'Test',
        recommendation_type: 'yoga',
        support_rating: 0,
      }).success
    ).toBe(false);
  });
});

// ============================================
// wisdomGuideRequestSchema
// ============================================
describe('wisdomGuideRequestSchema', () => {
  it('accepts a valid wisdom guide request', () => {
    const result = wisdomGuideRequestSchema.safeParse({
      messages: [
        { role: 'user', content: 'How can I support my digestion?' },
      ],
      userName: 'Mumtaz',
      primaryDosha: 'vata',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid message roles', () => {
    const result = wisdomGuideRequestSchema.safeParse({
      messages: [
        { role: 'admin', content: 'test' },
      ],
    });
    expect(result.success).toBe(false);
  });

  it('rejects more than 50 messages', () => {
    const messages = Array.from({ length: 51 }, (_, i) => ({
      role: 'user' as const,
      content: `Message ${i}`,
    }));
    const result = wisdomGuideRequestSchema.safeParse({ messages });
    expect(result.success).toBe(false);
  });

  it('validates dosha values', () => {
    expect(
      wisdomGuideRequestSchema.safeParse({
        messages: [{ role: 'user', content: 'hi' }],
        primaryDosha: 'invalid',
      }).success
    ).toBe(false);
  });
});

// ============================================
// bookingEmailRequestSchema
// ============================================
describe('bookingEmailRequestSchema', () => {
  it('accepts a valid booking email request', () => {
    const result = bookingEmailRequestSchema.safeParse({
      type: 'confirmed',
      bookingId: '550e8400-e29b-41d4-a716-446655440000',
      userEmail: 'user@example.com',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid type', () => {
    const result = bookingEmailRequestSchema.safeParse({
      type: 'unknown',
      bookingId: '550e8400-e29b-41d4-a716-446655440000',
      userEmail: 'user@example.com',
    });
    expect(result.success).toBe(false);
  });
});

// ============================================
// validateInput helper
// ============================================
describe('validateInput', () => {
  it('returns success for valid data', () => {
    const result = validateInput(emailSchema, 'test@example.com');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe('test@example.com');
    }
  });

  it('returns error message for invalid data', () => {
    const result = validateInput(emailSchema, 'not-email');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeTruthy();
    }
  });
});

// ============================================
// truncateText helper
// ============================================
describe('truncateText', () => {
  it('returns null for null input', () => {
    expect(truncateText(null, 10)).toBeNull();
  });

  it('returns null for undefined input', () => {
    expect(truncateText(undefined, 10)).toBeNull();
  });

  it('returns text unchanged if under max length', () => {
    expect(truncateText('hello', 10)).toBe('hello');
  });

  it('truncates text exceeding max length', () => {
    expect(truncateText('hello world', 5)).toBe('hello');
  });

  it('returns text at exactly max length unchanged', () => {
    expect(truncateText('exact', 5)).toBe('exact');
  });
});
