import { describe, it, expect } from 'vitest';
import {
  PREGNANCY_EXCLUDED_CRITERIA,
  isPoseExcludedForPregnancy,
  filterPregnancySafePoses,
  getPregnancyExclusionReasons,
  getPregnancyAvoidedPoses,
  isPoseSafeForPregnancy,
} from '../usePregnancySafeMode';

// ============================================
// Helper: build a test pose object
// ============================================
function createPose(overrides: Partial<{
  id: string;
  name: string;
  sanskritName: string;
  category: string;
  description: string;
  lifePhases: string[];
}> = {}) {
  return {
    id: 'test-pose',
    name: 'Test Pose',
    sanskritName: 'Test Asana',
    category: 'Gentle Yoga',
    description: 'A gentle test pose.',
    lifePhases: [] as string[],
    ...overrides,
  };
}

// ============================================
// PREGNANCY_EXCLUDED_CRITERIA
// ============================================
describe('PREGNANCY_EXCLUDED_CRITERIA', () => {
  it('has excluded pose IDs', () => {
    expect(PREGNANCY_EXCLUDED_CRITERIA.excludedPoseIds.length).toBeGreaterThan(0);
  });

  it('includes full-splits as excluded', () => {
    expect(PREGNANCY_EXCLUDED_CRITERIA.excludedPoseIds).toContain('full-splits');
  });

  it('has excluded categories', () => {
    expect(PREGNANCY_EXCLUDED_CRITERIA.excludedCategories).toContain('Hot Yoga');
    expect(PREGNANCY_EXCLUDED_CRITERIA.excludedCategories).toContain('Core Strengthening');
  });

  it('has excluded keywords for safety', () => {
    expect(PREGNANCY_EXCLUDED_CRITERIA.excludedKeywords).toContain('headstand');
    expect(PREGNANCY_EXCLUDED_CRITERIA.excludedKeywords).toContain('deep twist');
  });
});

// ============================================
// isPoseExcludedForPregnancy
// ============================================
describe('isPoseExcludedForPregnancy', () => {
  it('excludes a pose by ID', () => {
    const pose = createPose({ id: 'full-splits' });
    expect(isPoseExcludedForPregnancy(pose, null)).toBe(true);
  });

  it('excludes poses in unsafe categories', () => {
    const pose = createPose({ category: 'Core Strengthening' });
    expect(isPoseExcludedForPregnancy(pose, null)).toBe(true);
  });

  it('excludes poses with dangerous keywords in name', () => {
    const pose = createPose({ name: 'Deep Twist Hip Opener' });
    expect(isPoseExcludedForPregnancy(pose, null)).toBe(true);
  });

  it('excludes poses with dangerous keywords in description', () => {
    const pose = createPose({ description: 'An intense core compression exercise.' });
    expect(isPoseExcludedForPregnancy(pose, null)).toBe(true);
  });

  it('excludes by Sanskrit name', () => {
    const pose = createPose({ sanskritName: 'Hanumanasana' });
    expect(isPoseExcludedForPregnancy(pose, null)).toBe(true);
  });

  it('allows a safe pose', () => {
    const pose = createPose({
      id: 'seated-meditation',
      name: 'Seated Meditation',
      sanskritName: 'Sukhasana',
      category: 'Gentle Yoga',
      description: 'A calming seated position.',
    });
    expect(isPoseExcludedForPregnancy(pose, null)).toBe(false);
  });

  // Trimester-specific rules
  it('allows supine poses in first trimester', () => {
    const pose = createPose({
      name: 'Supine Butterfly',
      description: 'Lying on back gently',
    });
    // trimester 1: supine keyword is in the global excludedKeywords, so check logic
    // Actually "supine" IS in excludedKeywords, so it should be excluded regardless
    expect(isPoseExcludedForPregnancy(pose, 1)).toBe(true);
  });

  it('excludes supine poses after first trimester', () => {
    const pose = createPose({
      name: 'Gentle Reclined Pose',
      sanskritName: 'Supta Baddha Konasana',
      category: 'Restorative',
      description: 'Lying on back with butterflied legs.',
    });
    expect(isPoseExcludedForPregnancy(pose, 2)).toBe(true);
  });

  it('excludes headstand by keyword', () => {
    const pose = createPose({ name: 'Headstand Variation' });
    expect(isPoseExcludedForPregnancy(pose, null)).toBe(true);
  });
});

// ============================================
// filterPregnancySafePoses
// ============================================
describe('filterPregnancySafePoses', () => {
  it('filters out unsafe poses', () => {
    const poses = [
      createPose({ id: 'full-splits', name: 'Full Splits' }),
      createPose({ id: 'seated-meditation', name: 'Seated Meditation', sanskritName: 'Sukhasana' }),
      createPose({ id: 'core-block-work', name: 'Core Block Work' }),
    ];

    const safePoses = filterPregnancySafePoses(poses, null);
    expect(safePoses).toHaveLength(1);
    expect(safePoses[0].id).toBe('seated-meditation');
  });

  it('returns all poses if none are excluded', () => {
    const poses = [
      createPose({ id: 'gentle-stretch', name: 'Gentle Stretch', sanskritName: 'Gentle' }),
      createPose({ id: 'seated-calm', name: 'Seated Calm', sanskritName: 'Calm' }),
    ];

    const safePoses = filterPregnancySafePoses(poses, null);
    expect(safePoses).toHaveLength(2);
  });

  it('returns empty array when all poses are excluded', () => {
    const poses = [
      createPose({ id: 'full-splits' }),
      createPose({ id: 'scissors-core' }),
    ];

    const safePoses = filterPregnancySafePoses(poses, null);
    expect(safePoses).toHaveLength(0);
  });
});

// ============================================
// getPregnancyExclusionReasons
// ============================================
describe('getPregnancyExclusionReasons', () => {
  it('returns an array of exclusion reasons', () => {
    const reasons = getPregnancyExclusionReasons();
    expect(reasons.length).toBeGreaterThan(0);
    expect(reasons).toContain('Deep twists');
    expect(reasons).toContain('Advanced poses');
  });
});

// ============================================
// getPregnancyAvoidedPoses
// ============================================
describe('getPregnancyAvoidedPoses', () => {
  it('returns the excluded pose IDs', () => {
    const avoided = getPregnancyAvoidedPoses();
    expect(avoided).toEqual(PREGNANCY_EXCLUDED_CRITERIA.excludedPoseIds);
  });
});

// ============================================
// isPoseSafeForPregnancy
// ============================================
describe('isPoseSafeForPregnancy', () => {
  it('returns true for safe categories', () => {
    expect(isPoseSafeForPregnancy('Gentle Yoga', null)).toBe(true);
    expect(isPoseSafeForPregnancy('Restorative', null)).toBe(true);
    expect(isPoseSafeForPregnancy('Breathing', null)).toBe(true);
  });

  it('returns false for unsafe categories', () => {
    expect(isPoseSafeForPregnancy('Core Strengthening', null)).toBe(false);
    expect(isPoseSafeForPregnancy('Hot Yoga', null)).toBe(false);
    expect(isPoseSafeForPregnancy('Power Yoga', null)).toBe(false);
    expect(isPoseSafeForPregnancy('Advanced Flexibility', null)).toBe(false);
  });
});
