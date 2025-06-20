import { generate } from 'otp-generator';

export const generateToken = (len = 6) => {
  const otpToken = generate(len, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });
  return otpToken;
};
