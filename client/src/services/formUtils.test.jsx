import { validateForm } from './formUtils';

describe('validateForm', () => {
  const baseData = {
    firstName: 'John',
    lastName: 'Doe',
    companyName: 'ACME Corp',
    phoneNumber: '1234567890',
    workEmail: 'john.doe@example.com',
    reason: 'General Inquiry',
    message: 'Test message',
  };

  it('returns no errors when all required fields are present', () => {
    expect(validateForm(baseData)).toEqual({});
  });

  it('returns errors for missing required fields', () => {
    const incomplete = { ...baseData, firstName: '', lastName: '', workEmail: '' };
    const errors = validateForm(incomplete);
    expect(errors).toEqual({
      firstName: 'First name is required.',
      lastName: 'Last name is required.',
      workEmail: 'Email is required.',
    });
  });

  it('returns errors for invalid email', () => {
    const invalidEmail = { ...baseData, workEmail: 'invalid-email' };
    const errors = validateForm(invalidEmail);
    expect(errors).toEqual({
      workEmail: 'Please enter a valid email address.',
    });
  });

  it('ignores optional fields like phoneNumber and message', () => {
    const minimal = { ...baseData, phoneNumber: '', message: '' };
    expect(validateForm(minimal)).toEqual({});
  });

  it('returns error for invalid phoneNumber if provided', () => {
    const invalidPhone = { ...baseData, phoneNumber: '123' };
    const errors = validateForm(invalidPhone);
    expect(errors).toEqual({
      phoneNumber: 'Please enter a valid 10-digit phone number.',
    });
  });

  it('handles empty object input', () => {
    const errors = validateForm({});
    expect(errors).toEqual({
      firstName: 'First name is required.',
      lastName: 'Last name is required.',
      workEmail: 'Email is required.',
      reason: 'Reason for contact is required.',
    });
  });
});