export const checkStrength = (pass: string) => {
  const requirements = [
    { regex: /.{8,}/, text: "At least 8 characters" },
    { regex: /[0-9]/, text: "At least 1 number" },
    { regex: /[a-z]/, text: "At least 1 lowercase letter" },
    { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
    { regex: /[^A-Za-z0-9]/, text: "At least 1 special character" },
  ];

  const strength = requirements.map((requirement) => ({
    text: requirement.text,
    valid: requirement.regex.test(pass),
  }));

  return strength;
};
