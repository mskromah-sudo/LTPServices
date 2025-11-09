export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'Email is required';
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
  if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
  if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return 'Password must contain at least one special character';
  }
  return null;
};

export const validatePasswordMatch = (password: string, confirmPassword: string): string | null => {
  if (password !== confirmPassword) return 'Passwords do not match';
  return null;
};

export const validateFullName = (fullName: string): string | null => {
  if (!fullName) return 'Full name is required';
  if (fullName.trim().length < 2) return 'Full name must be at least 2 characters';
  if (fullName.length > 100) return 'Full name must be less than 100 characters';
  return null;
};

export const getPasswordStrength = (password: string): number => {
  let strength = 0;
  if (password.length >= 8) strength += 20;
  if (password.length >= 12) strength += 10;
  if (/[a-z]/.test(password)) strength += 20;
  if (/[A-Z]/.test(password)) strength += 20;
  if (/[0-9]/.test(password)) strength += 15;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength += 15;
  return Math.min(strength, 100);
};

export const getPasswordStrengthLabel = (strength: number): string => {
  if (strength < 30) return 'Weak';
  if (strength < 60) return 'Fair';
  if (strength < 80) return 'Good';
  return 'Strong';
};

export const getPasswordStrengthColor = (strength: number): string => {
  if (strength < 30) return 'bg-red-500';
  if (strength < 60) return 'bg-yellow-500';
  if (strength < 80) return 'bg-blue-500';
  return 'bg-green-500';
};
