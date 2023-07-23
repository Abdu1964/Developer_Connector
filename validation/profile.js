const Validator = require('validator');
const isEmpty = require('./isempty');

module.exports = function validateProfileInput(data) {
  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.handle = !isEmpty(data.handle) ? data.handle : '';
  data.status = !isEmpty(data.status) ? data.status : '';
  data.skills = !isEmpty(data.skills) ? data.skills : '';

  // Handle checks
  if (!Validator.isLength(data.handle, { min: 2, max: 40 })) {
    errors.handle = 'Handle must be between 2 and 40 characters';
  }
  if (Validator.isEmpty(data.handle)) {
    errors.handle = 'Profile handle is required';
  }

  // Status checks
  if (Validator.isEmpty(data.status)) {
    errors.status = 'Status field is required';
  }

  // Skills checks
  if (Validator.isEmpty(data.skills)) {
    errors.skills = 'Skills field is required';
  }

  // Website checks
  if (!isEmpty(data.website) && !Validator.isURL(data.website)) {
    errors.website = 'Not a valid URL';
  }

  // Social media checks
  if (!isEmpty(data.youtube) && !Validator.isURL(data.youtube)) {
    errors.youtube = 'Not a valid URL';
  }
  if (!isEmpty(data.twitter) && !Validator.isURL(data.twitter)) {
    errors.twitter = 'Not a valid URL';
  }
  if (!isEmpty(data.facebook) && !Validator.isURL(data.facebook)) {
    errors.facebook = 'Not a valid URL';
  }
  if (!isEmpty(data.linkedin) && !Validator.isURL(data.linkedin)) {
    errors.linkedin = 'Not a valid URL';
  }
  if (!isEmpty(data.instagram) && !Validator.isURL(data.instagram)) {
    errors.instagram = 'Not a valid URL';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};