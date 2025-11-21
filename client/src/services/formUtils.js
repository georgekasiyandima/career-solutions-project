export const validateForm = (formData = {}) => {
  const errors = {};

  // Default to empty strings to avoid undefined errors
  const { firstName = '', lastName = '', phoneNumber = '', workEmail = '', reason = '' } = formData;

  if (!firstName.trim()) {
    errors.firstName = "First name is required.";
  }
  if (!lastName.trim()) {
    errors.lastName = "Last name is required.";
  }
  // phoneNumber is now optional
  if (phoneNumber && !/^\d{10}$/.test(phoneNumber.trim())) {
    errors.phoneNumber = "Please enter a valid 10-digit phone number.";
  }
  if (!workEmail.trim()) {
    errors.workEmail = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(workEmail)) {
    errors.workEmail = "Please enter a valid email address.";
  }
  if (!reason) {
    errors.reason = "Reason for contact is required.";
  }

  return errors;
};