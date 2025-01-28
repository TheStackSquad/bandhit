// src/utils/passwordUtils.js
export const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[^\w]/.test(password)) strength++;
    return strength;
  };
  
  export const getPasswordStrengthColor = (strength) => {
    switch (strength) {
      case 0:
      case 1:
        return 'bg-red-500';
      case 2:
      case 3:
        return 'bg-yellow-500';
      case 4:
      case 5:
        return 'bg-green-500';
      default:
        return 'bg-gray-200';
    }
  };


export const generatePassword = (length = 12) => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  const allChars = uppercase + lowercase + numbers + symbols;
  
  const generateChar = (charSet) => 
    charSet[Math.floor(Math.random() * charSet.length)];
  
  const password = [
    generateChar(uppercase),
    generateChar(lowercase),
    generateChar(numbers),
    generateChar(symbols),
    ...Array.from({ length: length - 4 }, () => 
      generateChar(allChars))
  ];
  
  // Shuffle the password array
  return password.sort(() => Math.random() - 0.5).join('');
};