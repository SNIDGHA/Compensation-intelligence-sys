export interface SalarySubmissionInput {
  company: string;
  title: string;
  level: string;
  location: string;
  baseSalary: number;
  stockGrant?: number;
  bonus?: number;
}

export interface ValidationError {
  field: string;
  message: string;
}

export function validateSalarySubmission(input: Partial<SalarySubmissionInput>): {
  isValid: boolean;
  errors: ValidationError[];
  validatedData?: SalarySubmissionInput;
} {
  const errors: ValidationError[] = [];

  // Required String Fields Validation
  const validateString = (field: keyof SalarySubmissionInput, label: string) => {
    const val = input[field];
    if (typeof val !== 'string' || !val.trim()) {
      errors.push({ field, message: `${label} is required.` });
      return '';
    }
    const cleanVal = val.trim();
    if (cleanVal.length > 100) {
      errors.push({ field, message: `${label} must be less than 100 characters.` });
    }
    return cleanVal;
  };

  const company = validateString('company', 'Company');
  const title = validateString('title', 'Job Title');
  const level = validateString('level', 'Level');
  const location = validateString('location', 'Location');

  // Numeric Fields Validation
  const validateNumber = (val: any, field: string, label: string, isRequired = false): number => {
    if (val === undefined || val === null || val === '') {
      if (isRequired) {
        errors.push({ field, message: `${label} is required.` });
      }
      return 0;
    }

    const num = Number(val);
    if (isNaN(num)) {
      errors.push({ field, message: `${label} must be a valid number.` });
      return 0;
    }

    if (num < 0) {
      errors.push({ field, message: `${label} cannot be negative.` });
      return 0;
    }

    return num;
  };

  const baseSalary = validateNumber(input.baseSalary, 'baseSalary', 'Base Salary', true);
  const stockGrant = validateNumber(input.stockGrant, 'stockGrant', 'Stock Grant');
  const bonus = validateNumber(input.bonus, 'bonus', 'Bonus');

  // Outlier detection checks
  if (baseSalary > 0) {
    if (baseSalary < 5000) {
      errors.push({ field: 'baseSalary', message: 'Annual base salary must be at least $5,000.' });
    }
    if (baseSalary > 5000000) {
      errors.push({ field: 'baseSalary', message: 'Annual base salary cannot exceed $5,000,000.' });
    }
  }

  if (stockGrant > 100000000) {
    errors.push({ field: 'stockGrant', message: 'Total 4-year stock grant cannot exceed $100,000,000.' });
  }

  if (bonus > 10000000) {
    errors.push({ field: 'bonus', message: 'Annual bonus cannot exceed $10,000,000.' });
  }

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  return {
    isValid: true,
    errors: [],
    validatedData: {
      company,
      title,
      level,
      location,
      baseSalary,
      stockGrant,
      bonus,
    },
  };
}
