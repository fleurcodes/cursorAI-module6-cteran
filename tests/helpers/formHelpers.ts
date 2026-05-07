import type { Step1Fields, Step2Fields } from '../../pages/RegistrationPage';

// ---------------------------------------------------------------------------
// Valid test data generators
// ---------------------------------------------------------------------------

export function validStep1(overrides: Partial<Step1Fields> = {}): Step1Fields {
  return {
    fullName: 'Jane Doe',
    email: 'jane.doe@example.com',
    password: 'Secure@123',
    confirmPassword: 'Secure@123',
    ...overrides,
  };
}

export function validStep2(overrides: Partial<Step2Fields> = {}): Step2Fields {
  return {
    username: 'jane_doe',
    bio: 'Hello world!',
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Invalid / boundary test values
// ---------------------------------------------------------------------------

export const INVALID_EMAILS = [
  'user@',
  '@domain.com',
  'nodomain',
  'missing@.com',
  'spaces in@email.com',
];

export const VALID_EMAILS = [
  'user@domain.com',
  'user+tag@sub.domain.org',
  'a@b.co',
];

export const INVALID_PASSWORDS = [
  'short1!',           // < 8 chars
  'alllowercase1!',    // no uppercase
  'ALLUPPERCASE1!',    // no lowercase — passes uppercase but no lowercase rule
  'NoSpecialChar1',    // no special char
  'NoNumber!A',        // no number
];

export const VALID_PASSWORD = 'Secure@123';

export const BOUNDARY_FULL_NAME = {
  tooShort: 'A',             // 1 char — below min (2)
  minValid: 'AB',            // 2 chars — exactly min
  maxValid: 'A'.repeat(50),  // 50 chars — exactly max
  tooLong: 'A'.repeat(51),   // 51 chars — above max
};

export const BOUNDARY_USERNAME = {
  tooShort: 'ab',             // 2 chars — below min (3)
  minValid: 'abc',            // 3 chars — exactly min
  maxValid: 'a'.repeat(20),   // 20 chars — exactly max
  tooLong: 'a'.repeat(21),    // 21 chars — above max
};

export const BOUNDARY_BIO = {
  maxValid: 'a'.repeat(160),   // 160 chars — exactly max
  tooLong: 'a'.repeat(161),    // 161 chars — above max
};

// ---------------------------------------------------------------------------
// Validation utilities (client-side, mirrored from validators.ts logic)
// ---------------------------------------------------------------------------

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPassword(password: string): boolean {
  return (
    password.length >= 8 &&
    password.length <= 64 &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
  );
}
