import React from "react";

interface PasswordStrengthMeterProps {
  password: string;
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  password,
}) => {
  // Helper functions for "three of each" checks
  const hasThreeUppercase = (pass: string) =>
    (pass.match(/[A-Z]/g) || []).length >= 3;
  const hasThreeLowercase = (pass: string) =>
    (pass.match(/[a-z]/g) || []).length >= 3;
  const hasThreeDigits = (pass: string) =>
    (pass.match(/[0-9]/g) || []).length >= 3;
  const hasThreeSpecials = (pass: string) =>
    (pass.match(/[^A-Za-z0-9]/g) || []).length >= 3;

  // Base scoring
  const calculateStrength = (pass: string): number => {
    let score = 0;
    if (!pass) return 0;

    // Length points
    score += Math.min(pass.length * 4, 40); // up to 40 points

    // Criteria bonuses
    if (/[A-Z]/.test(pass)) score += 10;
    if (/[a-z]/.test(pass)) score += 10;
    if (/[0-9]/.test(pass)) score += 10;
    if (/[^A-Za-z0-9]/.test(pass)) score += 15;

    // Extra variety bonus
    if (
      pass.length >= 12 &&
      /[A-Z]/.test(pass) &&
      /[a-z]/.test(pass) &&
      /[0-9]/.test(pass) &&
      /[^A-Za-z0-9]/.test(pass)
    ) {
      score += 15;
    }

    return Math.min(score, 100);
  };

  let strength = calculateStrength(password);

  // Apply strict "three of each" rule for top tiers
  const meetsThreeOfEach =
    hasThreeUppercase(password) &&
    hasThreeLowercase(password) &&
    hasThreeDigits(password) &&
    hasThreeSpecials(password);

  if (password.length < 8) {
    strength = Math.min(strength, 39); // Force Weak
  } else if (meetsThreeOfEach) {
    if (password.length > 20) {
      strength = 100; // Extremely Secure
    } else if (password.length > 16) {
      strength = 90; // Very Strong
    }
  } else {
    // Can't exceed "Strong" without meeting three-of-each rule
    strength = Math.min(strength, 75);
  }

  // Strength bar color
  const getColor = () => {
    if (strength >= 95) return "bg-green-700"; // Extremely Secure
    if (strength >= 85) return "bg-green-500"; // Very Strong
    if (strength >= 70) return "bg-lime-500"; // Strong
    if (strength >= 55) return "bg-amber-500"; // Medium
    if (strength >= 40) return "bg-orange-500"; // Weak
    return "bg-red-500"; // Very Weak
  };

  // Tip text
  const getTip = () => {
    if (!password) return "Minimum 8 characters";
    if (password.length < 8) return "Password too short";
    if (strength >= 95) return "Extremely secure password";
    if (strength >= 85) return "Very strong password";
    if (strength >= 70) return "Strong password";
    if (strength >= 55) return "Medium strength password";
    if (strength >= 40) return "Weak password – add more variety";
    return "Very weak password – add length and mix of characters";
  };

  return (
    <div>
      {/* Strength Bar */}
      <div className="mt-1 h-1 w-full bg-gray-200 rounded-full">
        <div
          className={`h-full rounded-full transition-all duration-300 ${getColor()}`}
          style={{ width: `${strength}%` }}
        />
      </div>

      {/* Tip */}
      <p className="text-xs text-gray-500 mt-1">{getTip()}</p>
    </div>
  );
};

export default PasswordStrengthMeter;
