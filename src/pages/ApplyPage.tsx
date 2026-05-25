import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  FileText, 
  Upload, 
  CheckCircle, 
  ShieldCheck, 
  ArrowLeft,
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  BookOpen, 
  Compass, 
  Award,
  AlertCircle,
  Calendar,
  User,
  Users,
  DollarSign,
  Briefcase,
  Building2,
  Lock,
  CreditCard,
  PenTool,
  CheckCheck,
  FileCheck
} from "lucide-react";
import { FormState } from "../types";

interface ApplyPageProps {
  onBackToHome: () => void;
  onSubmitSuccess: (refCode: string, fullName: string, phone: string) => void;
}

const INITIAL_FORM: FormState = {
  fullName: "",
  guardianName: "",
  dob: "",
  gender: "",
  phone: "",
  email: "",
  aadhaarLast4: "",
  address: "",
  pinCode: "",
  course: "",
  institution: "",
  boardUniversity: "",
  grade: "",
  lastExamPassed: "",
  percentageCgpa: "",
  familyAnnualIncome: "",
  parentOccupation: "",
  assistanceScholarship: false,
  assistanceTuition: false,
  assistanceBooks: false,
  assistanceCoaching: false,
  assistanceHostel: false,
  assistanceDigital: false,
  assistanceOther: "",
  statementOfNeed: "",
  docAadhaar: false,
  docPhoto: false,
  docIncome: false,
  docAdmission: false,
  docCaste: false,
  docPassbook: false,
  bankHolderName: "",
  bankName: "",
  bankAccountNumber: "",
  bankIfscCode: "",
  signatureTyped: "",
  fees: false,
  books: false,
  hostel: false,
};

const STEPS = [
  { id: 1, name: "Applicant Identity", subtitle: "Personal Details" },
  { id: 2, name: "Educational Path", subtitle: "Academics & Income" },
  { id: 3, name: "Support Statement", subtitle: "Requirements" },
  { id: 4, name: "Bank & Attachments", subtitle: "Verification & Payee" },
  { id: 5, name: "Sign & Preview", subtitle: "Application Code" }
];

export default function ApplyPage({ onBackToHome, onSubmitSuccess }: ApplyPageProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: string }>({});
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const downloadApplicationPDF = (refCode: string, applicantName: string) => {
    return new Promise<void>((resolve) => {
      const executeDownload = () => {
        try {
          const { jsPDF } = (window as any).jspdf;
          if (!jsPDF) {
            console.error("jsPDF not found on window");
            resolve();
            return;
          }

          const doc = new jsPDF();
          
          // Draw standard page border
          doc.setDrawColor(30, 58, 138); // Navy blue border
          doc.setLineWidth(1);
          doc.rect(5, 5, 200, 287);
          doc.rect(6, 6, 198, 285);

          // Header Title
          doc.setFont("helvetica", "bold");
          doc.setFontSize(16);
          doc.setTextColor(30, 58, 138); // Navy Blue
          doc.text("AMBEDKAR BEGUMPURA EDUCATION TRUST", 105, 20, { align: "center" });

          doc.setFontSize(10);
          doc.setTextColor(100, 116, 139); // Slate-500
          doc.text("Education * Equality * Empowerment", 105, 26, { align: "center" });
          doc.text("Registered Trust No: 100/2026", 105, 31, { align: "center" });

          // Divider Line
          doc.setDrawColor(226, 232, 240); // slate-200
          doc.line(15, 38, 195, 38);

          // Receipt Subtitle
          doc.setFontSize(14);
          doc.setTextColor(217, 119, 6); // Accent Gold (#d97706)
          doc.text("OFFICIAL SCHOLARSHIP APPLICATION RECEIPT", 105, 48, { align: "center" });

          // Reference Code Box
          doc.setFillColor(240, 247, 255); // light blue
          doc.rect(40, 55, 130, 12, "F");
          doc.setDrawColor(191, 219, 254); // blue-200
          doc.rect(40, 55, 130, 12, "D");
          doc.setFont("helvetica", "bold");
          doc.setFontSize(11);
          doc.setTextColor(30, 58, 138);
          doc.text(`Reference ID: ${refCode}`, 105, 62, { align: "center" });

          // 1. Applicant Identity Block
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.setTextColor(147, 51, 234); // Purple-600
          doc.text("1. PERSONAL IDENTITY PROFILE", 15, 78);
          doc.setDrawColor(226, 232, 240);
          doc.line(15, 80, 195, 80);

          doc.setFont("helvetica", "normal");
          doc.setTextColor(51, 65, 85); // Slate-700
          doc.text(`Full Legal Name: ${form.fullName.toUpperCase()}`, 15, 87);
          doc.text(`Parent / Guardian Name: ${form.guardianName.toUpperCase()}`, 15, 93);
          doc.text(`Date of Birth: ${form.dob}`, 15, 99);
          doc.text(`Gender: ${form.gender}`, 110, 99);
          doc.text(`Mobile Phone Number: +91 ${form.phone}`, 15, 105);
          doc.text(`Email Address: ${form.email || "N/A"}`, 110, 105);
          doc.text(`Aadhaar Card (Last 4 Digits): XXXX-XXXX-${form.aadhaarLast4}`, 15, 111);
          doc.text(`Mailing Address: ${form.address} - PIN ${form.pinCode}`, 15, 117);

          // 2. Educational & Financial Path
          doc.setFont("helvetica", "bold");
          doc.setTextColor(147, 51, 234);
          doc.text("2. ACADEMIC & FINANCIAL CONTEXT", 15, 130);
          doc.line(15, 132, 195, 132);

          doc.setFont("helvetica", "normal");
          doc.setTextColor(51, 65, 85);
          doc.text(`Current Course / Class: ${form.course.toUpperCase()}`, 15, 139);
          doc.text(`Year / Semester: ${form.grade.toUpperCase()}`, 110, 139);
          doc.text(`Institution / School / College: ${form.institution.toUpperCase()}`, 15, 145);
          doc.text(`Board / University: ${form.boardUniversity.toUpperCase()}`, 15, 151);
          doc.text(`Last Exam Passed: ${form.lastExamPassed.toUpperCase()}`, 15, 157);
          doc.text(`Percentage / CGPA Obtained: ${form.percentageCgpa}`, 110, 157);
          doc.text(`Family Annual Income: INR ${form.familyAnnualIncome}`, 15, 163);
          doc.text(`Parent / Guardian Occupation: ${form.parentOccupation.toUpperCase()}`, 110, 163);

          // 3. Support Matrix
          doc.setFont("helvetica", "bold");
          doc.setTextColor(147, 51, 234);
          doc.text("3. SUPPORT MATRIX SELECTION & STATEMENT", 15, 176);
          doc.line(15, 178, 195, 178);

          doc.setFont("helvetica", "normal");
          doc.setTextColor(51, 65, 85);
          const activeSupports: string[] = [];
          if (form.assistanceScholarship) activeSupports.push("Scholarship");
          if (form.assistanceTuition) activeSupports.push("Tuition Fees");
          if (form.assistanceBooks) activeSupports.push("Books & Materials");
          if (form.assistanceCoaching) activeSupports.push("Coaching prep");
          if (form.assistanceHostel) activeSupports.push("Hostel allowances");
          if (form.assistanceDigital) activeSupports.push("Digital Laptop Support");
          if (form.assistanceOther) activeSupports.push(`Other: ${form.assistanceOther}`);
          
          doc.text(`Requested Assistance: ${activeSupports.join(", ")}`, 15, 185);

          // Wrap long Statement of Need text
          doc.text("Statement of Need:", 15, 191);
          doc.setFont("helvetica", "italic");
          const splitStatement = doc.splitTextToSize(`"${form.statementOfNeed}"`, 175);
          doc.text(splitStatement, 15, 197);

          // 4. Payee Routing
          doc.setFont("helvetica", "bold");
          doc.setTextColor(147, 51, 234);
          doc.text("4. PAYEE BANK ROUTING DETAILS", 15, 220);
          doc.line(15, 222, 195, 222);

          doc.setFont("helvetica", "normal");
          doc.setTextColor(51, 65, 85);
          doc.text(`Account Payee Name: ${form.bankHolderName.toUpperCase()}`, 15, 229);
          doc.text(`Official Bank Name: ${form.bankName.toUpperCase()}`, 110, 229);
          doc.text(`Account Number: •••• •••• ${form.bankAccountNumber.slice(-4) || "XXXX"}`, 15, 235);
          doc.text(`IFS Routing Code: ${form.bankIfscCode}`, 110, 235);

          // Stamp & Legal Seal
          doc.setFillColor(248, 250, 252); // grey background
          doc.rect(15, 245, 180, 24, "F");
          doc.setDrawColor(226, 232, 240);
          doc.rect(15, 245, 180, 24, "D");

          doc.setFont("helvetica", "bold");
          doc.setFontSize(8);
          doc.setTextColor(30, 58, 138);
          doc.text("[ STABILIZER DESK SECURITY SEALS ]", 20, 251);
          
          doc.setFont("helvetica", "normal");
          doc.setTextColor(100, 116, 139);
          doc.text("STATUS: DIGITAL DRAFT SIGNED", 20, 256);
          doc.text("AUDIT STAMP: PENDING TRUSTEE AUDIT", 20, 261);
          doc.text("COMPLIANCE SEAL: SECURE SSL-256 REGISTERED", 20, 266);

          // Cursive Typed Signature
          doc.setFont("courier", "bolditalic");
          doc.setFontSize(11);
          doc.setTextColor(16, 185, 129); // Emerald signature
          doc.text(`Signed by: ${form.signatureTyped}`, 115, 256);
          doc.setFont("helvetica", "italic");
          doc.setFontSize(8);
          doc.setTextColor(148, 163, 184);
          doc.text("(Applicant Digital Assent Seal)", 115, 261);

          // Bottom Footer
          doc.setFont("helvetica", "bold");
          doc.setFontSize(8);
          doc.setTextColor(148, 163, 184);
          doc.text("© 2026 Ambedkar Begumpura Education Trust. universal equality registry record.", 105, 280, { align: "center" });

          // Save the PDF
          const filename = `ABET_Application_${applicantName.replace(/\s+/g, "_")}_${refCode.replace(/\//g, "_")}.pdf`;
          doc.save(filename);
          resolve();
        } catch (err) {
          console.error("PDF generation failed:", err);
          resolve();
        }
      };

      if ((window as any).jspdf) {
        executeDownload();
      } else {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
        script.onload = () => {
          executeDownload();
        };
        script.onerror = () => {
          console.error("Failed to load jsPDF library from CDN.");
          resolve();
        };
        document.body.appendChild(script);
      }
    });
  };

  // Auto Scroll helper inside the form
  const formTopRef = useRef<HTMLDivElement>(null);

  const scrollToFormTop = () => {
    formTopRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Mock doc upload helper
  const handleUploadedDocument = (field: string) => {
    setUploadingField(field);
    setErrorMsg(null);
    setTimeout(() => {
      const generatedName = `ABET_Doc_Certified_${field.toUpperCase()}_${Math.floor(100 + Math.random() * 900)}.pdf`;
      setUploadedFiles(prev => ({
        ...prev,
        [field]: generatedName
      }));
      setForm(prev => ({
        ...prev,
        [`doc${field.charAt(0).toUpperCase() + field.slice(1)}` as keyof FormState]: true as any
      }));
      setUploadingField(null);
    }, 850);
  };

  // Toggle checklist checkboxes manually too
  const toggleAttachedDocCheck = (field: string) => {
    const docKey = `doc${field.charAt(0).toUpperCase() + field.slice(1)}` as keyof FormState;
    const isCurrentlyChecked = !!form[docKey];
    
    setForm(prev => ({
      ...prev,
      [docKey]: !isCurrentlyChecked as any
    }));

    if (!isCurrentlyChecked && !uploadedFiles[field]) {
      // automatically simulate high-quality mock filename upload
      setUploadedFiles(prev => ({
        ...prev,
        [field]: `ABET_Attached_${field.toUpperCase()}_SelfSigned.pdf`
      }));
    } else if (isCurrentlyChecked) {
      // remove upload state
      setUploadedFiles(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Safe Step Navigation & Step Validation
  const validateStep = (step: number): boolean => {
    setErrorMsg(null);

    if (step === 1) {
      if (!form.fullName.trim()) {
        setErrorMsg("Full Name is required.");
        return false;
      }
      if (!form.guardianName.trim()) {
        setErrorMsg("Father's / Mother's / Guardian's Name is required.");
        return false;
      }
      if (!form.dob) {
        setErrorMsg("Date of Birth is required.");
        return false;
      }
      if (!form.gender) {
        setErrorMsg("Please select your gender.");
        return false;
      }
      if (!form.phone.trim()) {
        setErrorMsg("Mobile number is required.");
        return false;
      }
      if (!form.aadhaarLast4.trim() || form.aadhaarLast4.length !== 4 || isNaN(Number(form.aadhaarLast4))) {
        setErrorMsg("Please enter exactly the last 4 digits of your Aadhaar Card number for security validation.");
        return false;
      }
      if (!form.address.trim()) {
        setErrorMsg("Current Residential Address is required.");
        return false;
      }
      if (!form.pinCode.trim() || form.pinCode.length < 6) {
        setErrorMsg("Please provide a valid 6-digit residential area PIN Code.");
        return false;
      }
    }

    if (step === 2) {
      if (!form.course.trim()) {
        setErrorMsg("Please specify your Current Course / Class.");
        return false;
      }
      if (!form.institution.trim()) {
        setErrorMsg("Institution / School / College name is required.");
        return false;
      }
      if (!form.boardUniversity.trim()) {
        setErrorMsg("Board / University name is required.");
        return false;
      }
      if (!form.grade.trim()) {
        setErrorMsg("Year / Semester indicator is required.");
        return false;
      }
      if (!form.lastExamPassed.trim()) {
        setErrorMsg("Please provide the Last Examination details.");
        return false;
      }
      if (!form.percentageCgpa.trim()) {
        setErrorMsg("Please indicate Percentage or CGPA obtained.");
        return false;
      }
      if (!form.familyAnnualIncome.trim()) {
        setErrorMsg("Family Annual Income threshold must be provided.");
        return false;
      }
      if (!form.parentOccupation.trim()) {
        setErrorMsg("Parent / Guardian occupation is required.");
        return false;
      }
    }

    if (step === 3) {
      const anyAssistance = 
        form.assistanceScholarship || 
        form.assistanceTuition || 
        form.assistanceBooks || 
        form.assistanceCoaching || 
        form.assistanceHostel || 
        form.assistanceDigital || 
        form.assistanceOther.trim();

      if (!anyAssistance) {
        setErrorMsg("Please check/select at least one assistance category required from the Trust.");
        return false;
      }

      if (!form.statementOfNeed.trim() || form.statementOfNeed.split(/\s+/).filter(Boolean).length < 10) {
        setErrorMsg("Please write a statement of need (minimum 10 words) explaining why you require Trust support.");
        return false;
      }
    }

    if (step === 4) {
      // Valid documents checkbox rule
      const anyDocs = form.docAadhaar || form.docPhoto || form.docIncome || form.docAdmission || form.docCaste || form.docPassbook;
      if (!anyDocs) {
        setErrorMsg("Under Trust administrative regulations, you must attach/check at least one verification credential to continue.");
        return false;
      }

      if (!form.bankHolderName.trim()) {
        setErrorMsg("Account Holder Name is required.");
        return false;
      }
      if (!form.bankName.trim()) {
        setErrorMsg("Bank Name is required.");
        return false;
      }
      if (!form.bankAccountNumber.trim() || form.bankAccountNumber.length < 8) {
        setErrorMsg("Please provide a valid Bank Account Number.");
        return false;
      }
      if (!form.bankIfscCode.trim() || form.bankIfscCode.length !== 11) {
        setErrorMsg("Please provide an 11-digit alphanumeric Bank IFSC Code (e.g., SBIN0001234).");
        return false;
      }
    }

    return true;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      scrollToFormTop();
    }
  };

  const handlePrevStep = () => {
    setErrorMsg(null);
    setCurrentStep(prev => prev - 1);
    scrollToFormTop();
  };

  // Submit complete multi-step form
  const handleApplyFormSubmitFinal = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.signatureTyped.trim()) {
      setErrorMsg("Please render a valid Typed Signature block down below to act as legal assent.");
      return;
    }

    setErrorMsg(null);
    setIsSubmitting(true);

    // Mock final submission and trigger main page success modal
    const code = Math.floor(100000 + Math.random() * 900000);
    const refCode = `ABET/2026/ASSIST-${code}`;
    
    // Automatically download the PDF document
    await downloadApplicationPDF(refCode, form.fullName);

    // Trigger parent callback
    onSubmitSuccess(refCode, form.fullName, form.phone);
    
    // Reset Everything
    setForm(INITIAL_FORM);
    setUploadedFiles({});
    setCurrentStep(1);
    setIsSubmitting(false);
    onBackToHome();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-14 text-left"
    >
      <div ref={formTopRef} className="scroll-mt-5" />

      {/* Return Navigation bar */}
      {/* <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <button 
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 group text-xs font-black text-[#1e3a8a] transition-all hover:text-[#9333ea] uppercase tracking-widest self-start"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1.5 transition-transform text-[#9333ea]" />
          Back to Trust Home Page
        </button>
        <span className="text-[10px] uppercase font-black tracking-widest text-slate-500 bg-slate-100 rounded-md px-3 py-1.5 inline-flex items-center gap-1.5 self-start sm:self-center select-none border border-slate-200/50">
          <FileText size={12} className="text-[#10b981]" /> Digital Application Node: SECURE-SSL-256
        </span>
      </div> */}

      {/* Hero Banner header block */}
      <div className="lg:mt-10 mb-10 text-center max-w-4xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-[#1e3a8a] border border-blue-100 rounded-full text-[10px] uppercase font-black tracking-widest mb-4">
          <ShieldCheck size={12} className="text-[#9333ea]" /> Ambedkar Begumpura Education Trust (ABET)
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight uppercase mb-4">
          Scholarship &amp; Educational Assistance Desk
        </h1>
        {/* <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Establish academic, social, and economic coordinates to register for direct-to-college supportive tuition credits guided by Guru Ravidas philosophy of universal equality.
        </p> */}
        <div className="h-1 w-20 bg-[#9333ea] mx-auto mt-4 rounded-full" />
      </div>

      {/* STEP ENGINE BAR CONTAINER */}
      <div className="mb-12 max-w-5xl mx-auto px-2">
        <div className="hidden md:flex justify-between items-center relative">
          {/* Background line indicator */}
          <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-slate-100 -translate-y-1/2 -z-10" />
          {/* Active progress line fill */}
          <div 
            className="absolute left-0 top-1/2 h-0.5 bg-gradient-to-r from-[#1e3a8a] to-[#9333ea] -translate-y-1/2 -z-10 transition-all duration-500 ease-out"
            style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
          />

         {STEPS.map((step) => {
  const isActive = step.id === currentStep;
  const isCompleted = step.id < currentStep;

  return (
    <div key={step.id} className="flex flex-col items-center shrink-0 w-28 text-center bg-transparent">
      <button
        type="button"
        // FIXED: Only disable stepping forward past the immediate next step 
        // to prevent premature validation state changes during render.
        disabled={step.id > currentStep + 1}
        onClick={() => {
          if (step.id < currentStep) {
            // Moving backward is always safe and shouldn't trigger error messages
            setErrorMsg(null);
            setCurrentStep(step.id);
          } else if (step.id > currentStep) {
            // Verify all layout requirements step-by-step going forward
            let valid = true;
            for (let i = currentStep; i < step.id; i++) {
              if (!validateStep(i)) {
                valid = false;
                break;
              }
            }
            if (valid) setCurrentStep(step.id);
          }
        }}
        className={`z-10 w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all duration-300
          ${isCompleted 
            ? 'bg-gradient-to-br from-[#1e3a8a] to-[#9333ea] border-transparent text-white shadow-sm' 
            : isActive 
              ? 'bg-white border-[#1e3a8a] text-[#1e3a8a] scale-110 ring-4 ring-blue-50' 
              : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}
      >
        {isCompleted ? <CheckCheck size={16} /> : step.id}
      </button>
      <span className={`text-[10px] font-black uppercase tracking-wider mt-2.5 transition-colors duration-300 ${isActive ? 'text-[#1e3a8a]' : 'text-slate-400'}`}>
        {step.name}
      </span>
      <span className="text-[9px] text-slate-400 font-semibold leading-none">{step.subtitle}</span>
    </div>
  );
})}
        </div>

        {/* Mobile simple progress summary */}
        <div className="md:hidden flex items-center justify-between bg-slate-50 rounded-xl p-4 border border-slate-200/70">
          <div>
            <div className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Step {currentStep} of {STEPS.length}</div>
            <h4 className="text-sm font-extrabold text-slate-800 uppercase tracking-tight">{STEPS[currentStep - 1].name}</h4>
            <span className="text-xs text-slate-400 leading-none">{STEPS[currentStep - 1].subtitle}</span>
          </div>
          <div className="flex gap-1.5">
            {STEPS.map((step) => (
              <span 
                key={step.id} 
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  step.id === currentStep 
                    ? 'w-6 bg-[#1e3a8a]' 
                    : step.id < currentStep 
                      ? 'bg-[#9333ea]' 
                      : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* CORE WORKSPACE GRID */}
      <div className="grid lg:grid-cols-12 gap-10 items-start">
        
        {/* LEFT COMPACT INFO PANEL */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Stats Panel for active step */}
          <div className="bg-[#1e3a8a] text-white rounded-2xl p-6 relative overflow-hidden shadow-md">
            <div className="absolute right-0 bottom-0 w-32 h-32 bg-blue-800/30 -mr-10 -mb-10 rounded-full" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-accent mb-1">ABET Support Hub</h3>
            <h2 className="text-xl font-extrabold tracking-tight uppercase mb-3">Multi-Step Audit</h2>
            <p className="text-blue-100 text-xs leading-relaxed mb-4">
              All submitted parameters are cross-checked against educational registries. Please file the sections accurately with correct signatures to prevent return notes.
            </p>
            <div className="space-y-2 text-[11px] font-bold uppercase tracking-wide bg-blue-900/40 p-3 rounded-lg border border-blue-800/30">
              <div className="flex justify-between">
                <span className="text-blue-200">Current Step:</span>
                <span>{currentStep}. {STEPS[currentStep - 1].name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200">Mandatory Checks:</span>
                <span className="text-accent">YES</span>
              </div>
            </div>
          </div>

          {/* Contextual Guidance Notes based on step */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <h4 className="font-extrabold text-slate-800 uppercase text-xs tracking-wider mb-3.5 pb-2 border-b border-slate-50 flex items-center gap-1.5">
              <Award size={15} className="text-[#9333ea]" /> Phase Directives
            </h4>

            {currentStep === 1 && (
              <div className="space-y-2.5 text-xs text-slate-500 leading-normal">
                <p>• Verify that your <strong>Full Name</strong> matches your official Aadhaar enrollment record exactly.</p>
                <p>• Only provide the <strong>last 4 digits</strong> of Aadhaar. ABET strictly adheres to encryption frameworks and never requests full numbers online.</p>
                <p>• State residential area PIN Code to trigger regional eligibility matrices.</p>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-2.5 text-xs text-slate-500 leading-normal">
                <p>• Mention your school or college official name. Supportive funds are routed straight to registrar desks.</p>
                <p>• Annual family income is scrutinized. High audit rates apply for classes requesting tuition support above INR 1.5 Lakhs.</p>
                <p>• Keep previous year gradesheet records ready for digital upload checks in Step 4.</p>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-2.5 text-xs text-slate-500 leading-normal">
                <p>• Check multiple assistance options if you require tuition support, free books, and hostel allowances.</p>
                <p>• Your personal statement helps the Trustee Board evaluate critical immediate allocations. Be clear and specific about your household conditions.</p>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-2.5 text-xs text-slate-500 leading-normal">
                <p>• The direct routing bank account should ideally match the applicant&apos;s name or their immediate parent.</p>
                <p>• Input 11-character bank codes (IFS Codes) accurately to ensure flawless central electronic transfers.</p>
                <p>• Check the documents checklist to self-sign copies of the required certificates.</p>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-2.5 text-xs text-slate-500 leading-normal">
                <p>• Review all sections collectively. This represents the final physical hardcopy print render.</p>
                <p>• Verify bank numbers to prevent payment declines.</p>
                <p>• Typing your signature acts as a legal binding seal certifying correct parameters.</p>
              </div>
            )}
          </div>

          {/* Quick Trustee Assistance Desk */}
          <div className="bg-slate-50/50 rounded-2xl border border-slate-200/50 p-6">
            <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider mb-2.5">Help &amp; Inquiries</h4>
            <div className="space-y-2 text-[11px] sm:text-xs">
              <div className="flex gap-2 items-center text-slate-600 font-medium">
                <Phone size={13} className="text-[#9333ea]" /> +91 98765 43210
              </div>
              <div className="flex gap-2 items-center text-slate-600 font-medium">
                <Mail size={13} className="text-[#9333ea]" /> info@ambedkarbegumpura.org
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: INTERACTIVE FORM CONTAINER */}
        <div className="lg:col-span-8">
          
          <div className="bg-white rounded-3xl shadow-md border border-slate-100 p-6 sm:p-8 md:p-10 relative overflow-hidden">
            
            {/* Visual Step Banner */}
            <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase text-accent tracking-widest block mb-0.5">
                  AMBEDKAR BEGUMPURA EDUCATION TRUST
                </span>
                <span className="text-xs font-semibold text-slate-400">Section {currentStep} of {STEPS.length}</span>
              </div>
              <div className="text-right">
                <span className="inline-flex bg-purple-50 text-[#9333ea] font-extrabold text-[10px] py-1 px-2.5 rounded-full uppercase tracking-wider border border-purple-100">
                  {STEPS[currentStep - 1].name}
                </span>
              </div>
            </div>

            {/* Error Message banner */}
            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl text-xs sm:text-sm leading-relaxed flex gap-3 items-start select-none"
              >
                <AlertCircle size={18} className="shrink-0 text-red-600 mt-0.5" />
                <div>
                  <span className="font-bold block text-red-900 uppercase text-[10px] tracking-widest mb-0.5">Missing Required Fields</span>
                  {errorMsg}
                </div>
              </motion.div>
            )}

            {/* FORM CONTAINER WITH ANIMATED SLIDE STATE TRANSITION */}
            <form onSubmit={(e) => { e.preventDefault(); }} className="space-y-6">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* --- STEP 1: APPLICANT IDENTITY DETAILS --- */}
                  {currentStep === 1 && (
                    <div className="space-y-5 text-left">
                      <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/50 mb-6 flex items-center gap-3">
                        <User className="text-[#1e3a8a] shrink-0" size={20} />
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-tight">Step 1: Parent &amp; Personal Information</h4>
                          <p className="text-[10px] text-slate-500">Provide personal identity variables exactly as certified in state IDs.</p>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                          Full Legal Name <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="text"
                          required
                          value={form.fullName}
                          onChange={e => setForm(prev => ({ ...prev, fullName: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] outline-none transition-all text-xs sm:text-sm bg-slate-50/55" 
                          placeholder="Applicant's block letters name" 
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                          Father&apos;s / Mother&apos;s / Guardian&apos;s Name <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="text"
                          required
                          value={form.guardianName}
                          onChange={e => setForm(prev => ({ ...prev, guardianName: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] outline-none transition-all text-xs sm:text-sm bg-slate-50/55" 
                          placeholder="Parent or official guardian name" 
                        />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                            Date of Birth <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <input 
                              type="date"
                              required
                              value={form.dob}
                              onChange={e => setForm(prev => ({ ...prev, dob: e.target.value }))}
                              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] outline-none transition-all text-xs sm:text-sm bg-slate-50/55" 
                            />
                            <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                            Gender <span className="text-red-500">*</span>
                          </label>
                          <div className="grid grid-cols-3 gap-2.5">
                            {["Male", "Female", "Other"].map(g => (
                              <button
                                key={g}
                                type="button"
                                onClick={() => setForm(prev => ({ ...prev, gender: g }))}
                                className={`py-2 p-1 border rounded-lg text-xs font-bold uppercase tracking-wider transition-all
                                  ${form.gender === g 
                                    ? 'bg-[#1e3a8a] border-transparent text-white shadow-sm' 
                                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                              >
                                {g}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                            Mobile Number <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <input 
                              type="tel"
                              required
                              value={form.phone}
                              maxLength={12}
                              onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
                              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] outline-none transition-all text-xs sm:text-sm bg-slate-50/55" 
                              placeholder="10-digit mobile number" 
                            />
                            <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                            Email ID
                          </label>
                          <div className="relative">
                            <input 
                              type="email"
                              value={form.email}
                              onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] outline-none transition-all text-xs sm:text-sm bg-slate-50/55" 
                              placeholder="email@example.com" 
                            />
                            <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                          Aadhaar Number (Last 4 Digits Only) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input 
                            type="text"
                            maxLength={4}
                            required
                            value={form.aadhaarLast4}
                            onChange={e => {
                              const v = e.target.value.replace(/\D/g, "");
                              setForm(prev => ({ ...prev, aadhaarLast4: v }));
                            }}
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] outline-none transition-all text-xs sm:text-sm bg-slate-50/55 tracking-widest font-bold" 
                            placeholder="XXXX" 
                          />
                          <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                        <p className="text-[10px] text-slate-400">Security Rule: Never share your full 12-digit UID for online digital sandbox checks.</p>
                      </div>

                      <div className="grid sm:grid-cols-4 gap-4">
                        <div className="sm:col-span-3 space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                            Current Address <span className="text-red-500">*</span>
                          </label>
                          <input 
                            type="text"
                            required
                            value={form.address}
                            onChange={e => setForm(prev => ({ ...prev, address: e.target.value }))}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] outline-none transition-all text-xs sm:text-sm bg-slate-50/55" 
                            placeholder="Current residence details" 
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                            PIN Code <span className="text-red-500">*</span>
                          </label>
                          <input 
                            type="text"
                            maxLength={6}
                            required
                            value={form.pinCode}
                            onChange={e => {
                              const v = e.target.value.replace(/\D/g, "");
                              setForm(prev => ({ ...prev, pinCode: v }));
                            }}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] outline-none transition-all text-xs sm:text-sm bg-slate-50/55 tracking-wider font-semibold" 
                            placeholder="110001" 
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* --- STEP 2: EDUCATIONAL DETAILS & FINANCIALS --- */}
                  {currentStep === 2 && (
                    <div className="space-y-5 text-left">
                      <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/50 mb-4 flex items-center gap-3">
                        <GraduationCap className="text-[#1e3a8a] shrink-0" size={20} />
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-tight">Step 2: Educational Context &amp; Family Income</h4>
                          <p className="text-[10px] text-slate-500">Document active academic performance thresholds and financial index rules.</p>
                        </div>
                      </div>

                      <div className="border-b border-slate-100 pb-1 flex items-center gap-1">
                        <span className="text-[11px] font-black uppercase text-[#9333ea] tracking-wider">Education Parameters</span>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                            Current Course / Class <span className="text-red-500">*</span>
                          </label>
                          <input 
                            type="text"
                            required
                            value={form.course}
                            onChange={e => setForm(prev => ({ ...prev, course: e.target.value }))}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] outline-none transition-all text-xs sm:text-sm bg-slate-50/55" 
                            placeholder="e.g., B.A. Hons, Class XI, Poly Diploma" 
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                            Year / Semester <span className="text-red-500">*</span>
                          </label>
                          <input 
                            type="text"
                            required
                            value={form.grade}
                            onChange={e => setForm(prev => ({ ...prev, grade: e.target.value }))}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] outline-none transition-all text-xs sm:text-sm bg-slate-50/55" 
                            placeholder="e.g., Year 1, Semester IV, Final" 
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                          School / College / Institution Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input 
                            type="text"
                            required
                            value={form.institution}
                            onChange={e => setForm(prev => ({ ...prev, institution: e.target.value }))}
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] outline-none transition-all text-xs sm:text-sm bg-slate-50/55" 
                            placeholder="Official name of school or institute" 
                          />
                          <Building2 size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                          Board / University <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="text"
                          required
                          value={form.boardUniversity}
                          onChange={e => setForm(prev => ({ ...prev, boardUniversity: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] outline-none transition-all text-xs sm:text-sm bg-slate-50/55" 
                          placeholder="e.g., Delhi University (DU), CBSE, GGSIPU" 
                        />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                            Last Examination Passed <span className="text-red-500">*</span>
                          </label>
                          <input 
                            type="text"
                            required
                            value={form.lastExamPassed}
                            onChange={e => setForm(prev => ({ ...prev, lastExamPassed: e.target.value }))}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] outline-none transition-all text-xs sm:text-sm bg-slate-50/55" 
                            placeholder="e.g., Graduation Semester I, Class XII CBSE" 
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                            Percentage / CGPA Obtained <span className="text-red-500">*</span>
                          </label>
                          <input 
                            type="text"
                            required
                            value={form.percentageCgpa}
                            onChange={e => setForm(prev => ({ ...prev, percentageCgpa: e.target.value }))}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] outline-none transition-all text-xs sm:text-sm bg-slate-50/55" 
                            placeholder="e.g., 84.5% or 8.2 CGPA" 
                          />
                        </div>
                      </div>

                      <div className="border-b border-slate-100 pb-1 mt-6">
                        <span className="text-[11px] font-black uppercase text-[#9333ea] tracking-wider">Financial Household Index</span>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                            Family Annual Income (₹) <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <input 
                              type="text"
                              required
                              value={form.familyAnnualIncome}
                              onChange={e => setForm(prev => ({ ...prev, familyAnnualIncome: e.target.value }))}
                              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] outline-none transition-all text-xs sm:text-sm bg-slate-50/55 font-bold text-[#1e3a8a]" 
                              placeholder="e.g., ₹ 1,20,000" 
                            />
                            <DollarSign size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                            Occupation of Parent / Guardian <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <input 
                              type="text"
                              required
                              value={form.parentOccupation}
                              onChange={e => setForm(prev => ({ ...prev, parentOccupation: e.target.value }))}
                              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] outline-none transition-all text-xs sm:text-sm bg-slate-50/55" 
                              placeholder="e.g., Daily wage earner, Farmer, Clerk" 
                            />
                            <Briefcase size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* --- STEP 3: ASSISTANCE SPECIFICATION & PERSONAL STATEMENT --- */}
                  {currentStep === 3 && (
                    <div className="space-y-6 text-left">
                      <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/50 mb-4 flex items-center gap-3">
                        <Compass className="text-[#1e3a8a] shrink-0" size={20} />
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-tight">Step 3: Support Selection &amp; Personal Statement</h4>
                          <p className="text-[10px] text-slate-500">Pick assistance categories and contextualize your household social requirements.</p>
                        </div>
                      </div>

                      <div className="space-y-2.5">
                        <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                          Assistance Support Required <span className="text-slate-400 font-bold lowercase">(Select at least one)</span>
                        </label>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {[
                            { key: "assistanceScholarship", label: "Scholarship", icon: <Award size={16} /> },
                            { key: "assistanceTuition", label: "Tuition Fee Support", icon: <GraduationCap size={16} /> },
                            { key: "assistanceBooks", label: "Books / Study Material", icon: <BookOpen size={16} /> },
                            { key: "assistanceCoaching", label: "Coaching Assistance", icon: <Compass size={16} /> },
                            { key: "assistanceHostel", label: "Hostel Support", icon: <MapPin size={16} /> },
                            { key: "assistanceDigital", label: "Digital Learning", icon: <CheckCircle size={16} /> }
                          ].map(item => (
                            <label 
                              key={item.key} 
                              className={`flex flex-col items-center justify-center p-3 rounded-xl border cursor-pointer select-none transition-all gap-1.5 text-center font-bold uppercase tracking-tight
                                ${form[item.key as keyof FormState] 
                                  ? 'bg-[#1e3a8a]/5 border-[#1e3a8a] text-[#1e3a8a] shadow-sm' 
                                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100/70'}`}
                            >
                              <input 
                                type="checkbox" 
                                className="hidden"
                                checked={!!form[item.key as keyof FormState]}
                                onChange={(e) => setForm(prev => ({ ...prev, [item.key]: e.target.checked }))}
                              />
                              <span className={`${form[item.key as keyof FormState] ? 'text-[#9333ea]' : 'text-slate-400'}`}>
                                {item.icon}
                              </span>
                              <span className="text-[10px] leading-snug">{item.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                          Other Specified Category (Optional)
                        </label>
                        <input 
                          type="text"
                          value={form.assistanceOther}
                          onChange={e => setForm(prev => ({ ...prev, assistanceOther: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] outline-none transition-all text-xs sm:text-sm bg-slate-50/55" 
                          placeholder="e.g. Competitive preparation exam fees, medical support" 
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                          Statement by Applicant <span className="text-red-500">*</span>
                        </label>
                        <p className="text-[10px] text-[#9333ea] leading-tight font-semibold uppercase">
                          Write briefly why and what, are your requirements from the Trust:
                        </p>
                        <textarea 
                          rows={5}
                          required
                          value={form.statementOfNeed}
                          onChange={e => setForm(prev => ({ ...prev, statementOfNeed: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] outline-none transition-all text-xs sm:text-sm bg-slate-50/55 leading-relaxed" 
                          placeholder="Please convey your requirements, current economic situation, or specific academic aspirations clearly so our trustees can catalog your file with prioritizing tags." 
                        />
                        <div className="flex justify-between items-center text-[10px] text-slate-400 px-1">
                          <span>Kindly be precise and truthful.</span>
                          <span className="font-bold uppercase">Min 10 words</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* --- STEP 4: DETAILED BANK DETAILS AND DIGITAL DOCUMENT CHECKLIST --- */}
                  {currentStep === 4 && (
                    <div className="space-y-6 text-left">
                      <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/50 mb-4 flex items-center gap-3">
                        <CreditCard className="text-[#1e3a8a] shrink-0" size={20} />
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-tight">Step 4: Certified Bank Account Routing &amp; Credentials Attachment</h4>
                          <p className="text-[10px] text-slate-500">Enable accurate direct college electronic payments to pre-authorized bank names.</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="border-b border-slate-100 pb-1">
                          <span className="text-[11px] font-black uppercase text-[#9333ea] tracking-wider">Government Documents (Check attached or click Browse)</span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {[
                            { key: "aadhaar", label: "Aadhaar Copy", icon: <Lock size={12} /> },
                            { key: "photo", label: "Passport Photograph", icon: <User size={12} /> },
                            { key: "income", label: "Income Certificate", icon: <DollarSign size={12} /> },
                            { key: "admission", label: "Admission Receipt", icon: <GraduationCap size={12} /> },
                            { key: "caste", label: "Caste Certificate", icon: <Award size={12} /> },
                            { key: "passbook", label: "Bank Passbook Copy", icon: <CreditCard size={12} /> }
                          ].map(doc => {
                            const isSelected = !!form[`doc${doc.key.charAt(0).toUpperCase() + doc.key.slice(1)}` as keyof FormState];
                            const currentFile = uploadedFiles[doc.key];

                            return (
                              <div key={doc.key} className="p-3 bg-slate-50 rounded-xl border border-slate-200 relative flex flex-col justify-between">
                                <div className="flex items-start justify-between gap-1 mb-2">
                                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 block leading-tight truncate">
                                    {doc.label}
                                  </span>
                                  <input 
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => toggleAttachedDocCheck(doc.key)}
                                    className="w-3.5 h-3.5 accent-[#1e3a8a]"
                                  />
                                </div>

                                {currentFile ? (
                                  <div className="bg-emerald-50 rounded p-1.5 border border-emerald-200 text-[9px] text-emerald-800 font-bold flex items-center justify-between mt-1 select-none">
                                    <span className="truncate pr-1 group-hover:underline block">{currentFile}</span>
                                    <CheckCheck size={12} className="text-secondary shrink-0" />
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    disabled={uploadingField === doc.key}
                                    onClick={() => handleUploadedDocument(doc.key)}
                                    className="w-full flex items-center justify-center gap-1 py-1.5 bg-white border border-dashed border-slate-200 rounded-md hover:bg-blue-50/30 hover:border-[#1e3a8a] transition-all group disabled:opacity-50 mt-1"
                                  >
                                    <Upload size={10} className="text-slate-400 group-hover:text-[#1e3a8a]" />
                                    <span className="text-[9px] font-bold uppercase text-slate-600 tracking-wider">
                                      {uploadingField === doc.key ? "Filing..." : "Browse File"}
                                    </span>
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        <p className="text-[10px] text-slate-400 leading-snug">
                          * Attaching mock verification docs directly uploads sandbox files. You must check or attach at least one certificate above.
                        </p>
                      </div>

                      <div className="space-y-4 pt-3">
                        <div className="border-b border-slate-100 pb-1">
                          <span className="text-[11px] font-black uppercase text-[#9333ea] tracking-wider">Applicant / Parent Payee Account Details</span>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-5">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                              Account Holder Name <span className="text-red-500">*</span>
                            </label>
                            <input 
                              type="text"
                              required
                              value={form.bankHolderName}
                              onChange={e => setForm(prev => ({ ...prev, bankHolderName: e.target.value }))}
                              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] outline-none transition-all text-xs sm:text-sm bg-slate-50/55" 
                              placeholder="Name as registered on Bank Passbook" 
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                              Bank Name <span className="text-red-500">*</span>
                            </label>
                            <input 
                              type="text"
                              required
                              value={form.bankName}
                              onChange={e => setForm(prev => ({ ...prev, bankName: e.target.value }))}
                              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] outline-none transition-all text-xs sm:text-sm bg-slate-50/55" 
                              placeholder="e.g. State Bank of India, PNB, ICICI" 
                            />
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-5">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                              Account Number <span className="text-red-500">*</span>
                            </label>
                            <input 
                              type="password"
                              required
                              value={form.bankAccountNumber}
                              onChange={e => {
                                const v = e.target.value.replace(/\D/g, "");
                                setForm(prev => ({ ...prev, bankAccountNumber: v }));
                              }}
                              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] outline-none transition-all text-xs sm:text-sm bg-slate-50/55 tracking-widest font-bold" 
                              placeholder="XXXXXXXXXX" 
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                              Bank IFSC Code <span className="text-red-500">*</span>
                            </label>
                            <input 
                              type="text"
                              maxLength={11}
                              required
                              value={form.bankIfscCode}
                              onChange={e => {
                                const v = e.target.value.toUpperCase();
                                setForm(prev => ({ ...prev, bankIfscCode: v }));
                              }}
                              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] outline-none transition-all text-xs sm:text-sm bg-slate-50/55 tracking-wider font-extrabold text-[#10b981]" 
                              placeholder="e.g. SBIN0001234" 
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* --- STEP 5: PRE-CONSOLIDATED RENDER & OFFICE ASSESSMENT SHEET --- */}
                  {currentStep === 5 && (
                    <div className="space-y-6 text-left">
                      
                      <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl border border-emerald-100 flex items-center gap-3">
                        <FileCheck className="text-emerald-600 shrink-0" size={20} />
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider">APPLICATION REVIEW DRAFT</h4>
                          <p className="text-[10px] text-emerald-700 leading-snug">The registry has formulated a digitized hardcopy layout. Please review details before signing below.</p>
                        </div>
                      </div>

                      {/* PHYSICAL PRINT COPY MOCKUP */}
                      <div id="application-review-draft" className="border-4 border-slate-200 bg-slate-50/40 p-4 sm:p-6 rounded-2xl relative overflow-hidden text-xs text-slate-600 leading-relaxed font-sans shadow-inner">
                        {/* Draft Watermark */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04] select-none scale-150 rotate-12">
                          <span className="text-[5rem] font-black uppercase text-slate-900 tracking-widest">ABET COPIED</span>
                        </div>

                        {/* Document Header */}
                        <div className="border-b-2 border-slate-350 pb-3 text-center mb-5">
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#1e3a8a] block">OFFICIAL RECORD SYSTEM</span>
                          <h3 className="text-sm font-extrabold uppercase text-slate-800 tracking-tight">AMBEDKAR BEGUMPURA EDUCATION TRUST</h3>
                          <span className="text-[8px] text-slate-400 font-bold uppercase">Assistance Scheme Audit Form // State Territory Delhi NCR</span>
                        </div>

                        {/* Grid details block */}
                        <div className="space-y-4 text-[11px]">
                          {/* Segment 1 */}
                          <div>
                            <span className="text-[9px] font-extrabold uppercase text-[#9333ea] tracking-wider block mb-1 border-b border-slate-200">1. Applicant Details</span>
                            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5 text-slate-700">
                              <div><strong>FullName:</strong> <span className="uppercase">{form.fullName}</span></div>
                              <div><strong>Parent/Guardian:</strong> <span className="uppercase">{form.guardianName}</span></div>
                              <div><strong>Date of Birth:</strong> <span>{form.dob}</span> | <strong>Gender:</strong> <span>{form.gender}</span></div>
                              <div><strong>Mobile Phone:</strong> <span>+91 {form.phone}</span></div>
                              <div><strong>Email Address:</strong> <span className="lowercase">{form.email || "N/A"}</span></div>
                              <div><strong>Aadhaar Endorsement:</strong> <span>XXXX XXXX {form.aadhaarLast4}</span></div>
                              <div className="sm:col-span-2"><strong>Mailing Address:</strong> <span className="uppercase">{form.address} - PIN {form.pinCode}</span></div>
                            </div>
                          </div>

                          {/* Segment 2 */}
                          <div>
                            <span className="text-[9px] font-extrabold uppercase text-[#9333ea] tracking-wider block mb-1 border-b border-slate-200">2. Educational Details</span>
                            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5 text-slate-700">
                              <div><strong>Course &amp; Sem:</strong> <span className="uppercase">{form.course} ({form.grade})</span></div>
                              <div><strong>School/College:</strong> <span className="uppercase">{form.institution}</span></div>
                              <div><strong>Affiliated Board/University:</strong> <span className="uppercase">{form.boardUniversity}</span></div>
                              <div><strong>Last Exam / Score:</strong> <span className="uppercase">{form.lastExamPassed} ({form.percentageCgpa})</span></div>
                            </div>
                          </div>

                          {/* Segment 3 */}
                          <div>
                            <span className="text-[9px] font-extrabold uppercase text-[#9333ea] tracking-wider block mb-1 border-b border-slate-200">3. Household Financials</span>
                            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5 text-slate-700">
                              <div><strong>Annual Family Income:</strong> <span className="font-bold text-[#1e3a8a]">{form.familyAnnualIncome}</span></div>
                              <div><strong>Guardian Occupation:</strong> <span className="uppercase">{form.parentOccupation}</span></div>
                            </div>
                          </div>

                          {/* Segment 4 */}
                          <div>
                            <span className="text-[9px] font-extrabold uppercase text-[#9333ea] tracking-wider block mb-1 border-b border-slate-200">4. Support Matrix Outlines</span>
                            <div className="flex flex-wrap gap-2 py-0.5 text-slate-700">
                              {form.assistanceScholarship && <span className="bg-white px-2 py-0.5 rounded border border-slate-200">✓ Scholarship</span>}
                              {form.assistanceTuition && <span className="bg-white px-2 py-0.5 rounded border border-slate-200">✓ Tuition Fee Support</span>}
                              {form.assistanceBooks && <span className="bg-white px-2 py-0.5 rounded border border-slate-200">✓ Books Study Material</span>}
                              {form.assistanceCoaching && <span className="bg-white px-2 py-0.5 rounded border border-slate-200">✓ Coaching Prep Support</span>}
                              {form.assistanceHostel && <span className="bg-white px-2 py-0.5 rounded border border-slate-200">✓ Hostel Support</span>}
                              {form.assistanceDigital && <span className="bg-white px-2 py-0.5 rounded border border-slate-200">✓ Digital Device Class</span>}
                              {form.assistanceOther && <span className="bg-white px-2 py-0.5 rounded border border-slate-200">✓ Other: {form.assistanceOther}</span>}
                            </div>
                            <div className="mt-1.5 italic text-slate-400 bg-white p-2 rounded border border-slate-150 leading-relaxed text-[10px]">
                              &ldquo;{form.statementOfNeed}&rdquo;
                            </div>
                          </div>

                          {/* Segment 5 */}
                          <div>
                            <span className="text-[9px] font-extrabold uppercase text-[#9333ea] tracking-wider block mb-1 border-b border-slate-200">5. Payee Routing Coordinates</span>
                            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5 text-slate-700">
                              <div><strong>Account Payee Name:</strong> <span className="uppercase">{form.bankHolderName}</span></div>
                              <div><strong>Official Bank:</strong> <span className="uppercase">{form.bankName}</span></div>
                              <div><strong>Account Index No:</strong> <span>•••• •••• {form.bankAccountNumber.slice(-4) || "XXXX"}</span></div>
                              <div><strong>Bank IFS Routing Code:</strong> <span className="font-mono text-emerald-700 font-bold">{form.bankIfscCode}</span></div>
                            </div>
                          </div>
                        </div>

                        {/* STYLISH OFFICE USE STAMP */}
                        <div className="mt-6 border-t-2 border-dashed border-slate-300 pt-4 bg-purple-50/30 p-4 rounded-xl border border-purple-100">
                          <span className="text-[10px] font-black uppercase text-[#1e3a8a] block mb-2 tracking-widest text-center sm:text-left">
                            [ FOR OFFICE USE ONLY - REGISTER STABILIZER ]
                          </span>
                          <div className="grid sm:grid-cols-3 gap-3 text-[10px] text-slate-500 uppercase font-bold">
                            <div className="bg-white p-2 rounded.5 border border-slate-200">
                              <span className="block text-slate-400 text-[8px]">APPLICATION STATUS:</span>
                              <span className="text-[#9333ea]">DRAFT FILE PREPARED</span>
                            </div>
                            <div className="bg-white p-2 rounded.5 border border-slate-200">
                              <span className="block text-slate-400 text-[8px]">AUDIT RECOMMENDATION:</span>
                              <span className="text-amber-600">PENDING TRUSTEE REVIEW</span>
                            </div>
                            <div className="bg-white p-2 rounded.5 border border-slate-200">
                              <span className="block text-slate-400 text-[8px]">COMPLIANCE CLEARANCE:</span>
                              <span className="text-emerald-600">SECURE SIGNATURE TO FILE</span>
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* SIGNATURE SECTION */}
                      <div className="space-y-2 pt-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                          Legal Sign-off Signature <span className="text-red-500">*</span>
                        </label>
                        <p className="text-[10px] text-slate-500 leading-snug">
                          Please type your legal full name in the box below. This acts as your certified electronic signature declaring that all attached variables are completely valid.
                        </p>
                        
                        <div className="relative">
                          <input 
                            type="text"
                            required
                            value={form.signatureTyped}
                            onChange={e => setForm(prev => ({ ...prev, signatureTyped: e.target.value }))}
                            className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-[#1e3a8a] outline-none text-xs sm:text-sm font-handwriting bg-slate-50 placeholder-slate-400" 
                            style={{ fontFamily: "'Dancing Script', 'Courier New', cursive, sans-serif" }}
                            placeholder="Type full legal name to bind digital copy..." 
                          />
                          <PenTool size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1e3a8a] pointer-events-none" />
                        </div>
                      </div>

                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* ACTION TOGGLES BAR */}
              <div className="pt-8 border-t border-slate-100 flex items-center justify-between gap-4">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold uppercase text-xs rounded-xl tracking-wider transition-all"
                  >
                    Back Phase
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onBackToHome}
                    className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold uppercase text-xs rounded-xl tracking-wider transition-all"
                  >
                    Cancel Form
                  </button>
                )}

                {currentStep < STEPS.length ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="flex items-center gap-1.5 px-6 py-2.5 bg-[#1e3a8a] hover:bg-blue-900 text-white font-extrabold uppercase text-xs rounded-xl tracking-wider transition-all shadow-sm shadow-[#1e3a8a]/20"
                  >
                    Next Phase ➔
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleApplyFormSubmitFinal}
                    className="flex items-center gap-1.5 px-7 py-3 bg-gradient-to-br from-[#1e3a8a] to-[#9333ea] hover:shadow-lg text-white font-black uppercase text-xs rounded-xl tracking-widest transition-all shadow-md active:scale-95 duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>Transmitting &amp; Downloading PDF... <Upload size={14} className="animate-spin ml-1" /></>
                    ) : (
                      <>Transmit Finished Registry File ✓</>
                    )}
                  </button>
                )}
              </div>

            </form>

          </div>

        </div>

      </div>

    </motion.div>
  );
}
