export interface FormState {
  // 1. Applicant Details
  fullName: string;
  guardianName: string;
  dob: string;
  gender: string;
  phone: string;
  email: string;
  aadhaarLast4: string;
  address: string;
  pinCode: string;

  // 2. Educational Details
  course: string;
  institution: string;
  boardUniversity: string;
  grade: string;
  lastExamPassed: string;
  percentageCgpa: string;

  // 3. Financial Information
  familyAnnualIncome: string;
  parentOccupation: string;

  // 4. Assistance Required
  assistanceScholarship: boolean;
  assistanceTuition: boolean;
  assistanceBooks: boolean;
  assistanceCoaching: boolean;
  assistanceHostel: boolean;
  assistanceDigital: boolean;
  assistanceOther: string;

  // 5. Statement of Need
  statementOfNeed: string;

  // 6. Documents Attached
  docAadhaar: boolean;
  docPhoto: boolean;
  docIncome: boolean;
  docAdmission: boolean;
  docCaste: boolean;
  docPassbook: boolean;

  // 7. Bank Details
  bankHolderName: string;
  bankName: string;
  bankAccountNumber: string;
  bankIfscCode: string;

  // 8. Sign-off
  signatureTyped: string;

  // Backward compatibility fields for legacy structure
  fees: boolean;
  books: boolean;
  hostel: boolean;
}

export interface GalleryImage {
  url: string;
  title: string;
  desc: string;
}
