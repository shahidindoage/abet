import { motion, AnimatePresence } from "motion/react";
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  MapPin, 
  Phone, 
  Mail, 
  Menu, 
  X, 
  ChevronRight, 
  ChevronLeft,
  ShieldCheck, 
  Heart, 
  Award, 
  Globe,
  Monitor,
  HeartHandshake,
  CheckCircle,
  FileText,
  Upload,
  Coins,
  Compass
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, Routes, Route, Link } from "react-router-dom";
import { FormState } from "./types";
import ApplyPage from "./pages/ApplyPage";
import { Facebook, Twitter, Linkedin, Youtube } from "lucide-react";

// 1. Create an icon lookup map outside of your component render
const SOCIAL_ICONS = {
  facebook: Facebook,
  twitter: Twitter,
  linkedin: Linkedin,
  youtube: Youtube,
} as const;
// --- Types & Constants ---

interface FormState {
  fullName: string;
  phone: string;
  address: string;
  institution: string;
  course: string;
  grade: string;
  fees: boolean;
  books: boolean;
  hostel: boolean;
}

const INITIAL_FORM: FormState = {
  fullName: "",
  phone: "",
  address: "",
  institution: "",
  course: "",
  grade: "",
  fees: false,
  books: false,
  hostel: false,
};

// Beautiful gallery images of education/community work in India
const GALLERY_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=800&auto=format&fit=crop",
    title: "Primary Digital Learning Drive",
    desc: "Empowering children with contemporary classroom technology."
  },
  {
    url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=800&auto=format&fit=crop",
    title: "Library Resource Distribution",
    desc: "Free textbooks and competitive preparation guides."
  },
  {
    url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop",
    title: "Mentorship & Guidance Camp",
    desc: "Specialized IAS/IPS career pathways counseling."
  },
  {
    url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop",
    title: "University Level Scholarship Ceremony",
    desc: "Assisting SC scholars in pursuing masters and engineering."
  },
  {
    url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop",
    title: "Begumpura Evening Coaching Center",
    desc: "Safe spaces for study and dialogue after primary school classes."
  },
  {
    url: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=800&auto=format&fit=crop",
    title: "Writers and Thinkers Symposium",
    desc: "Constitutional value seminars inspired by Babasaheb."
  }
];

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Modal states
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number | null>(null);
  
  // Mobile nav state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Current view toggle based on the path
  const currentView = location.pathname === "/apply" ? "apply" : "home";

  // Navigation active tab indicator (for desktop line effect)
  const [activeAnchor, setActiveAnchor] = useState("#home");

  // Form states (for section-level fallback or local states)
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: string }>({});
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [applicationRef, setApplicationRef] = useState("");
  
  // Temporary states to capture external form submissions for success modal rendering
  const [submittedApplicantName, setSubmittedApplicantName] = useState("");
  const [submittedApplicantPhone, setSubmittedApplicantPhone] = useState("");

  // Donation form details state
  const [donationAmount, setDonationAmount] = useState("5000");
  const [customAmount, setCustomAmount] = useState("");
  const [donationCause, setDonationCause] = useState("Scholarship Fund");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorPan, setDonorPan] = useState("");
  const [donationSuccess, setDonationSuccess] = useState(false);

  // Focus reference for scholarship application
  const fullNameInputRef = useRef<HTMLInputElement>(null);

  // Monitor scroll for navigation active link & header compact state
  const [scrolled, setScrolled] = useState(false);

  // Synchronize path and hash with page scrolling and active state indicators
  useEffect(() => {
    if (location.pathname === "/apply") {
      setActiveAnchor("#apply");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (location.pathname === "/") {
      if (location.hash) {
        setActiveAnchor(location.hash);
        const cleanId = location.hash.replace("#", "");
        const targetId = cleanId === "about" ? "about-section" : cleanId;
        
        const timer = setTimeout(() => {
          const el = document.getElementById(targetId);
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }, 150);
        return () => clearTimeout(timer);
      } else {
        setActiveAnchor("#home");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);

      // Determine active anchor based on scroll position (only active if current view is home)
      if (currentView === "home") {
        const sections = ["home", "about-section", "trustees", "objectives", "gallery", "apply", "contact"];
        for (const section of sections) {
          const el = document.getElementById(section);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= 140 && rect.bottom >= 140) {
              setActiveAnchor(`#${section === "about-section" || section === "trustees" ? "about" : section}`);
              break;
            }
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentView]);

  // Handler to seamlessly open dedicated Apply Page
  const handleScrollToApply = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/apply");
    setIsMobileMenuOpen(false);
  };

  const handleScrollToSection = (anchor: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    if (anchor === "#apply") {
      navigate("/apply");
      return;
    }

    if (location.pathname !== "/") {
      navigate(`/${anchor}`);
    } else {
      setActiveAnchor(anchor);
      const cleanId = anchor.replace("#", "");
      const targetId = cleanId === "about" ? "about-section" : cleanId;
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  // Simulate document upload
  const handleSimulatedUpload = (field: string) => {
    setUploadingField(field);
    setTimeout(() => {
      setUploadedFiles(prev => ({
        ...prev,
        [field]: `Doc_Submitted_${Math.floor(Math.random() * 900 + 100)}.pdf`
      }));
      setUploadingField(null);
    }, 1200);
  };

  // Handle application form submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.phone || !form.address) {
      alert("Please fill in the required fields (Full Name, Phone Number, and Address)");
      return;
    }
    
    // Generate simulated Application Reference number
    const code = Math.floor(100000 + Math.random() * 900000);
    setApplicationRef(`ABET/2026/ASSIST-${code}`);
    setSubmittedApplicantName(form.fullName);
    setSubmittedApplicantPhone(form.phone);
    setShowSuccessModal(true);
  };

  // Callback handler from dedicated Apply Page component
  const handleApplyPageSubmitSuccess = (refCode: string, fullName: string, phone: string) => {
    setApplicationRef(refCode);
    setSubmittedApplicantName(fullName);
    setSubmittedApplicantPhone(phone);
    setShowSuccessModal(true);
  };

  // Clear application form
  const resetForm = () => {
    setForm(INITIAL_FORM);
    setUploadedFiles({});
    setSubmittedApplicantName("");
    setSubmittedApplicantPhone("");
    setShowSuccessModal(false);
  };

  // Handle Donation submit
  const handleDonationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName || !donorEmail) {
      alert("Please enter your name and email address to continue.");
      return;
    }
    setDonationSuccess(true);
  };

  // Reset donation state when closing
  const closeDonationModal = () => {
    setShowDonateModal(false);
    setDonationSuccess(false);
    setDonorName("");
    setDonorEmail("");
    setDonorPan("");
    setCustomAmount("");
  };
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-accent/30 selection:text-slate-900 flex flex-col justify-between">
      
      {/* HEADER SYSTEM */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 transition-all duration-300">
        
  {/* Top Deck for high-profile Actions (Hidden when severely scrolled for neat readability) */}
  {/* <div className={`hidden lg:block border-b border-slate-100 bg-slate-50 px-4 sm:px-6 lg:px-8 transition-all duration-300 ${scrolled ? 'h-0 overflow-hidden opacity-0' : 'py-2 opacity-100'}`}> */}
    {/* <div className="max-w-7xl mx-auto flex justify-between items-center text-xs text-slate-500">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5"><MapPin size={12} className="text-accent" /> Delhi & Noida NCR</span>
        <span className="h-3 w-px bg-slate-200" />
        <span className="flex items-center gap-1.5"><Mail size={12} className="text-secondary" /> info@ambedkarbegumpura.org</span>
      </div>
      
      <div className="flex items-center gap-3"> */}
        {/* Top High-profile Action buttons matching exact design screen */}
        {/* <button 
          onClick={handleScrollToApply} 
          className="bg-[#1e3a8a] text-white font-bold px-4 py-1.5 rounded text-[11px] uppercase tracking-wider hover:bg-blue-900 transition-colors flex items-center gap-1.5"
        > */}
          {/* <GraduationCap size={13} />
          Apply for Scholarship
        </button>
        
        <button 
          onClick={() => setShowDonateModal(true)} 
          className="bg-accent text-white font-bold px-4 py-1.5 rounded text-[11px] uppercase tracking-wider hover:bg-amber-700 transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Heart size={13} className="fill-white" />
          Donate Now
        </button>
      </div>
    </div>
  </div> */}

  {/* Brand Identity & Primary Menu bar */}
  <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between lg:items-end items-center py-3 lg:py-4">
      
      {/* Logo and Brand block */}
      {/* <div 
        className="flex items-center gap-2 sm:gap-3 cursor-pointer relative shrink-0" 
        onClick={() => {
          navigate("/");
          setActiveAnchor("#home");
          window.scrollTo({top: 0, behavior: "smooth"});
        }}
      >
        <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-26 lg:h-26 xl:w-28 xl:h-28 rounded-full flex items-center justify-center overflow-hidden shrink-0 ">
          <img 
            src="https://vrfacwizigigcpowkrye.supabase.co/storage/v1/object/public/General/ngo-logo.png" 
            alt="ABET Logo" 
            className="w-full h-full object-contain" 
            referrerPolicy="no-referrer" 
          />
        </div>
        <div className="flex flex-col text-left justify-center">
          <span className="font-bold text-[12px] sm:text-[16px] md:text-[20px] lg:text-[26px] xl:text-[34px] leading-tight uppercase tracking-tight text-[#1e3a8a]">
            Ambedkar Begumpura
          </span>
          <span className="font-bold text-[12px] sm:text-[16px] md:text-[20px] lg:text-[26px] xl:text-[34px] leading-none tracking-tight text-[#1e3a8a] uppercase">
            Education Trust
          </span>
          <span className="text-[7px] sm:text-[9px] md:text-[10px] lg:text-[11px] xl:text-[13px] font-bold tracking-widest leading-none text-slate-500 mt-1 sm:mt-1.5 lg:mt-2">
            Education • Equality • Empowerment
          </span>
        </div>
      </div> */}
      <div
  className="flex items-center gap-4 cursor-pointer shrink-0"
  onClick={() => {
    navigate("/");
    setActiveAnchor("#home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }}
>
  <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden shrink-0">
    <img
      src="https://vrfacwizigigcpowkrye.supabase.co/storage/v1/object/public/General/ngo-logo.png"
      alt="ABET Logo"
      className="w-full h-full object-contain"
      referrerPolicy="no-referrer"
    />
  </div>

  <div className="flex flex-col justify-center">
    {/* Single Row Title */}
    <span className="font-bold text-[12px] sm:text-[16px] md:text-[20px] lg:text-[24px] xl:text-[30px] leading-none uppercase tracking-tight text-[#1e3a8a] whitespace-nowrap">
      Ambedkar Begumpura Education Trust
    </span>

    {/* Tagline */}
    <span className="text-[7px] sm:text-[9px] md:text-[10px] lg:text-[11px] xl:text-[13px] font-bold tracking-[0.25em] text-slate-500 mt-2">
      Education • Equality • Empowerment
    </span>
  </div>
</div>
<div className="hidden lg:flex flex-col items-end flex-1">
  <nav className="flex items-center gap-4 xl:gap-5 mt-4 whitespace-nowrap">
    {[
      { label: "Home", anchor: "#home" },
      { label: "About Us", anchor: "#about" },
      { label: "Programmes", anchor: "#programmes" },
      { label: "Scholarships", anchor: "#scholarships" },
      { label: "Apply", anchor: "#apply" },
      { label: "Gallery", anchor: "#gallery" },
      { label: "Contact", anchor: "#contact" }
    ].map((item) => (
      <Link
        key={item.anchor}
        to={item.anchor === "#apply" ? "/apply" : `/${item.anchor}`}
        onClick={handleScrollToSection(item.anchor)}
        className={`text-[13px] font-bold uppercase py-2 whitespace-nowrap transition-all border-b-2 hover:border-accent hover:text-accent ${
          activeAnchor === item.anchor
            ? "border-accent text-accent"
            : "border-transparent text-slate-700"
        }`}
      >
        {item.label}
      </Link>
    ))}
  </nav>
</div>

      {/* Main Nav Items */}
      {/* <nav className="hidden lg:flex items-center gap-6 lg:gap-8">
        {[
          { label: "Home", anchor: "#home" },
          { label: "About Us", anchor: "#about" },
          { label: "Programmes", anchor: "#programmes" },
          { label: "Scholarships", anchor: "#scholarships" },
          { label: "Apply", anchor: "#apply" },
          { label: "Gallery", anchor: "#gallery" },
          { label: "Contact", anchor: "#contact" }
        ].map((item) => (
          <Link 
            key={item.anchor} 
            to={item.anchor === "#apply" ? "/apply" : `/${item.anchor}`}
            onClick={handleScrollToSection(item.anchor)}
            className={`text-[10px] tracking-wide font-bold uppercase py-2 transition-all border-b-2 hover:border-accent hover:text-accent ${activeAnchor === item.anchor ? 'border-accent text-accent' : 'border-transparent text-slate-700'}`}
          >
            {item.label}
          </Link>
        ))} */}
        {/* neha */}
        
        
        {/* Condensed scrolling CTA button for donate */}
        {/* {scrolled && (
          <button 
            onClick={() => setShowDonateModal(true)} 
            className="bg-accent text-white font-bold px-4 py-1.5 rounded text-xs uppercase tracking-wider hover:bg-amber-700 transition-all shadow active:scale-95 ease-in text-center flex items-center gap-1.5"
          >
            <Heart size={12} className="fill-white" />
            Donate
          </button>
        )} */}
      {/* </nav> */}
      
      {/* Mobile burger toggle */}
      <div className="lg:hidden">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="text-slate-700 hover:text-accent p-2 transition-colors"
          id="mobile-menu-btn"
        >
          {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

    </div>
  </div>

  {/* Interactive Mobile Nav Drawer */}
  <AnimatePresence>
    {isMobileMenuOpen && (
      <motion.div 
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="lg:hidden bg-white border-t border-slate-100 px-4 pb-6 flex flex-col gap-1 shadow-xl overflow-hidden"
      >
        {[
          { label: "Home", anchor: "#home" },
          { label: "About Us", anchor: "#about" },
          { label: "Objectives", anchor: "#objectives" },
          { label: "Apply", anchor: "#apply" },
          { label: "Gallery", anchor: "#gallery" },
          { label: "Contact", anchor: "#contact" }
        ].map((item) => (
          <Link 
            key={item.anchor} 
            to={item.anchor === "#apply" ? "/apply" : `/${item.anchor}`}
            onClick={handleScrollToSection(item.anchor)} 
            className={`font-semibold py-3 border-b border-slate-50 transition-colors ${activeAnchor === item.anchor ? 'text-accent pl-2 border-l-2 border-l-accent' : 'text-slate-800'}`}
          >
            {item.label}
          </Link>
        ))}

        {/* <div className="grid grid-cols-2 gap-4 mt-4">
          <button 
            onClick={handleScrollToApply} 
            className="bg-[#1e3a8a] text-white py-3 rounded text-xs font-bold uppercase tracking-wider text-center"
          >
            Scholarship
          </button>
          <button 
            onClick={() => { setShowDonateModal(true); setIsMobileMenuOpen(false); }} 
            className="bg-accent text-white py-3 rounded text-xs font-bold uppercase tracking-wider text-center"
          >
            Donate Now
          </button>
        </div> */}
      </motion.div>
    )}
  </AnimatePresence>
</header>

      {/* BODY CONTENT */}
      <main className="flex-grow pt-[72px] md:pt-[110px]">
        <Routes>

 <Route 
            path="/apply" 
            element={
              <ApplyPage 
                onBackToHome={() => {
                  navigate("/");
                }}
                onSubmitSuccess={handleApplyPageSubmitSuccess}
              />
            }
          />

<Route 
            path="*" 
            element={
              <>
        {/* HERO BANNER SECTION - EXACT AS DESIGN SCREEN SPLIT MATCH */}
       <Hero/>

        {/* SECTION 1: ABOUT THE TRUST TWO COLS VIEW */}
        <section id="about-section" className="py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column: Image with Students */}
              <div className="lg:col-span-5 relative">
                <div className="relative z-10 rounded-xl overflow-hidden shadow-xl border-4 border-white">
                  <img 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop" 
                    alt="Marginalized students study together in university settings" 
                    className="w-full h-[320px] sm:h-[380px] object-cover" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  
                  {/* Floating badge inside picture */}
                  {/* <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md px-4 py-3 rounded-lg flex items-center gap-3 shadow">
                    <div className="w-10 h-10 bg-[#1e3a8a] text-white rounded-full flex items-center justify-center shrink-0">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase text-slate-900 tracking-wider">Registered Trust</h4>
                      <p className="text-[10px] text-slate-500 font-bold uppercase leading-none mt-0.5">Government Regn. No. DL-100/2026</p>
                    </div>
                  </div> */}
                </div>

                {/* Aesthetic offset border */}
                <div className="absolute -inset-2 border-2 border-dashed border-slate-200 rounded-2xl -z-10 translate-x-3 translate-y-3" />
              </div>

              {/* Right Column: Descriptions strictly matching text patterns in JPG */}
              <div className="lg:col-span-7 flex flex-col justify-center text-left">
                
                {/* Small indicator */}
                <span className="text-xs font-bold uppercase text-accent tracking-[0.2em] mb-2 block">
                  Mission Statement
                </span>
                
                {/* Major heading */}
                <h2 className="text-3xl md:text-4xl font-extrabold text-[#1e3a8a] leading-tight mb-6">
                
              Ambedkar Begumpura Education Trust
                </h2>

                <p className="text-slate-600 text-base leading-relaxed mb-4 font-medium">
                  To empower economically and socially marginalised communities through quality education, scholarships, academic support, and skill development, inspired by Dr. B. R. Ambedkar’s vision of equality, dignity, and social justice.
                </p>

                <p className="text-slate-500 text-sm leading-relaxed mb-8">
              
            
The Trust is committed to creating inclusive educational opportunities that enable every student to learn, grow, and achieve a life of self-respect and independence.
                </p>
                {/* Reading button opening a rich contextual popup modal */}
                <div>
                  <button 
                    // onClick={() => setShowAboutModal(true)}
                    className="bg-[#1e3a8a] hover:bg-blue-900 text-white font-extrabold uppercase text-xs tracking-widest px-6 py-3 rounded shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
                  >
                    Read More About Us
                    <ChevronRight size={14} />
                  </button>
                </div>

              </div>

            </div>
          </div>
        </section>


         {/* TRUSTEES SECTION */}
        <section id="trustees" className="py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase text-accent tracking-[0.2em] mb-2 block">
                Governing Board
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#1e3a8a] tracking-tight uppercase">
                Distinguished Trustees
              </h2>
              <div className="h-1 w-20 bg-accent mx-auto mt-4 rounded-full" />
              <p className="text-slate-500 text-sm sm:text-base mt-4 max-w-lg mx-auto leading-relaxed">
                Our trust is guided by veteran administrative professionals committed to social justice and educational excellence.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* Trustee Card 1 */}
              <div className="bg-white rounded-xl border border-slate-100 hover:border-blue-100 hover:shadow-md transition-all duration-300 p-8 text-center flex flex-col items-center">
                <div className="relative mb-6">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-slate-50 shadow-md">
                    <img 
                      src="https://vrfacwizigigcpowkrye.supabase.co/storage/v1/object/public/General/ngo-team-1.png" 
                      alt="Hemant Rao" 
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300" 
                    />
                  </div>
                  <div className="absolute bottom-1 right-1 bg-[#1e3a8a] text-white p-1.5 rounded-full shadow">
                    <ShieldCheck size={18} />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 uppercase tracking-tight">Mr. Hemant Rao</h3>
                <span className="text-accent font-extrabold tracking-wider text-xs uppercase my-1">President & Settlor</span>
                <p className="text-xs text-[#1e3a8a] font-bold uppercase tracking-tight">IAS (Retd)</p>
                <div className="h-0.5 w-10 bg-slate-200 my-4" />
                {/* <p className="text-slate-500 text-xs italic leading-relaxed">
                  Deeply passionate about bridging access barriers to top institutional education for Scheduled Caste students.
                </p> */}
              </div>

              {/* Trustee Card 2 */}
              <div className="bg-white rounded-xl border border-slate-100 hover:border-blue-100 hover:shadow-md transition-all duration-300 p-8 text-center flex flex-col items-center">
                <div className="relative mb-6">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-slate-50 shadow-md">
                    <img 
                      src="https://images.pexels.com/photos/4088732/pexels-photo-4088732.jpeg" 
                      alt="Dhiraj Kumar" 
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300" 
                    />
                  </div>
                  <div className="absolute bottom-1 right-1 bg-[#1e3a8a] text-white p-1.5 rounded-full shadow">
                    <ShieldCheck size={18} />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 uppercase tracking-tight">Mr. Dhiraj Kumar</h3>
                <span className="text-accent font-extrabold tracking-wider text-xs uppercase my-1">Trustee Treasurer</span>
                <p className="text-xs text-[#1e3a8a] font-bold uppercase tracking-tight">Suptd. Engg (Retd)</p>
                <div className="h-0.5 w-10 bg-slate-200 my-4" />
                {/* <p className="text-slate-500 text-xs italic leading-relaxed">
                  Steers operational transparency, ensuring maximum resource efficiency for remote educational settlements.
                </p> */}
              </div>

              {/* Trustee Card 3 */}
              <div className="bg-white rounded-xl border border-slate-100 hover:border-blue-100 hover:shadow-md transition-all duration-300 p-8 text-center flex flex-col items-center">
                <div className="relative mb-6">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-slate-50 shadow-md">
                    <img 
                      src="https://images.pexels.com/photos/37272895/pexels-photo-37272895.png" 
                      alt="Mahender Prakash" 
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300" 
                    />
                  </div>
                  <div className="absolute bottom-1 right-1 bg-[#1e3a8a] text-white p-1.5 rounded-full shadow">
                    <ShieldCheck size={18} />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 uppercase tracking-tight">Mr. Mahender Prakash</h3>
                <span className="text-accent font-extrabold tracking-wider text-xs uppercase my-1">Trust Trustee</span>
                <p className="text-xs text-[#1e3a8a] font-bold uppercase tracking-tight">Director of Horticulture (Retd)</p>
                <div className="h-0.5 w-10 bg-slate-200 my-4" />
                {/* <p className="text-slate-500 text-xs italic leading-relaxed">
                  Formulates rural education outreach camps, taking strategic mentorship directly to first-generation schoolgoers.
                </p> */}
              </div>

            </div>

          </div>
        </section>

        {/* SECTION 2: FOCUS AREAS / WHAT WE DO */}
        <section id="objectives" className="py-16 md:py-20 bg-slate-50 border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Centered Heading header */}
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase text-accent tracking-[0.2em] mb-2 block">
                What We Do
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#1e3a8a] tracking-tight uppercase">
                Our Key Focus Areas
              </h2>
              <div className="h-1 w-20 bg-accent mx-auto mt-4 rounded-full" />
            </div>

            {/* Grid display for four items */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Item 1 */}
              <div className="bg-white rounded-xl border border-slate-100 p-6 md:p-8 hover:border-blue-200 hover:shadow-md transition-all duration-300 group flex flex-col justify-between">
                <div>
                  <div className="w-14 h-14 bg-blue-50 text-[#1e3a8a] group-hover:bg-[#1e3a8a] group-hover:text-white rounded-xl flex items-center justify-center mb-6 transition-colors duration-300 shadow-sm border border-blue-50">
                    <GraduationCap size={28} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-3 uppercase tracking-tight">
                    Scholarships
                  </h3>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                    Providing financial assistance to deserving students to pursue their education without barriers.
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-50">
                  <Link to="/apply" className="text-xs font-bold uppercase text-[#1e3a8a] hover:text-accent tracking-wider inline-flex items-center gap-1">
                    Apply scholarship
                    <ChevronRight size={12} />
                  </Link>
                </div>
              </div>

              {/* Item 2 */}
              <div className="bg-white rounded-xl border border-slate-100 p-6 md:p-8 hover:border-blue-200 hover:shadow-md transition-all duration-300 group flex flex-col justify-between">
                <div>
                  <div className="w-14 h-14 bg-blue-50 text-[#1e3a8a] group-hover:bg-[#1e3a8a] group-hover:text-white rounded-xl flex items-center justify-center mb-6 transition-colors duration-300 shadow-sm border border-blue-50">
                    <Monitor size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-3 uppercase tracking-tight">
                    Digital Learning Support
                  </h3>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                    Promoting access to digital education and technology for a better learning experience.
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-50">
                  <span className="text-[10px] font-black uppercase text-accent tracking-widest">Digital Hubs</span>
                </div>
              </div>

              {/* Item 3 */}
              <div className="bg-white rounded-xl border border-slate-100 p-6 md:p-8 hover:border-blue-200 hover:shadow-md transition-all duration-300 group flex flex-col justify-between">
                <div>
                  <div className="w-14 h-14 bg-blue-50 text-[#1e3a8a] group-hover:bg-[#1e3a8a] group-hover:text-white rounded-xl flex items-center justify-center mb-6 transition-colors duration-300 shadow-sm border border-blue-50">
                    <BookOpen size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-3 uppercase tracking-tight">
                    Books & Study Material
                  </h3>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                    Distributing books and study materials to support academic excellence and growth.
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-50">
                  <span className="text-[10px] font-black uppercase text-accent tracking-widest">Library Centers</span>
                </div>
              </div>

              {/* Item 4 */}
              <div className="bg-white rounded-xl border border-slate-100 p-6 md:p-8 hover:border-blue-200 hover:shadow-md transition-all duration-300 group flex flex-col justify-between">
                <div>
                  <div className="w-14 h-14 bg-blue-50 text-[#1e3a8a] group-hover:bg-[#1e3a8a] group-hover:text-white rounded-xl flex items-center justify-center mb-6 transition-colors duration-300 shadow-sm border border-blue-50">
                    <Compass size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-3 uppercase tracking-tight">
                    Career & Academic Guidance
                  </h3>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                    Offering mentoring and guidance to help students achieve their academic and career goals.
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-50">
                  <span className="text-[10px] font-black uppercase text-accent tracking-widest">Mentorship Programs</span>
                </div>
              </div>

            </div>

          </div>
        </section>


         {/* GALLERY SECTION */}
        {/* <section id="gallery" className="py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase text-accent tracking-[0.2em] mb-2 block">
                Educational Action
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#1e3a8a] tracking-tight uppercase">
                Trust Activity Gallery
              </h2>
              <div className="h-1 w-20 bg-accent mx-auto mt-4 rounded-full" />
              <p className="text-slate-500 text-sm sm:text-base mt-4 max-w-lg mx-auto leading-relaxed">
                Experience real impact through book donation activities, scholarship distribution, and mentorship programs in Scheduled Caste regional zones.
              </p>
            </div>

           
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {GALLERY_IMAGES.map((img, i) => (
                <div 
                  key={i} 
                  onClick={() => setActiveGalleryIndex(i)}
                  className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-lg border border-slate-50 bg-slate-100 cursor-pointer transition-all duration-300"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img 
                      src={img.url} 
                      alt={img.title} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500" 
                    />
                  </div>
                  
                 
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5 text-left">
                    <span className="text-accent font-black uppercase text-[10px] tracking-widest mb-1">
                      ABET Drive
                    </span>
                    <h4 className="text-white font-bold text-sm tracking-tight mb-1">
                      {img.title}
                    </h4>
                    <p className="text-slate-300 text-[11px] leading-snug">
                      {img.desc}
                    </p>
                  </div>

               
                  <div className="bg-slate-50 px-4 py-3 border-t border-slate-100 flex justify-between items-center group-hover:bg-slate-100 transition-colors">
                    <span className="text-xs font-bold text-slate-700 truncate pr-2">{img.title}</span>
                    <span className="text-[10px] font-black uppercase text-[#1e3a8a] shrink-0">View Drive</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section> */}

        {/* SECTION 3: DOUBLE CALL TO ACTION CARDS (BLUE & PEACH SPLIT) */}
        <section className="py-12 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* <div className="grid md:grid-cols-2 gap-8"> */}
              <div className="grid">
              
              {/* Sky Blue Assistance Card */}
              {/* <div className="bg-[#f0f7ff] rounded-2xl p-6 sm:p-8 border border-blue-100 shadow-sm hover:shadow transition-shadow flex flex-col sm:flex-row gap-5 items-start text-left">
                <div className="w-12 h-12 bg-blue-100 text-[#1e3a8a] rounded-full flex items-center justify-center shrink-0 shadow-inner">
                  <FileText size={22} />
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-extrabold text-[#111827] uppercase tracking-tight mb-2">
                    Need Educational Support?
                  </h3>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    If you are a student and need financial assistance for your education, we are here to support you. 
                  </p>
                  <Link
                    to="/apply" 
                    onClick={handleScrollToApply}
                    className="inline-flex items-center gap-1.5 bg-[#1e3a8a] hover:bg-blue-900 text-white font-extrabold text-xs uppercase tracking-wider px-5 py-2.5 rounded shadow-sm transition-colors"
                  >
                    Apply for Assistance
                    <ChevronRight size={14} />
                  </Link>
                </div>
              </div> */}

              {/* Saffron Peach Donation Card */}
              <div className="bg-[#fff7ed] rounded-2xl p-6 sm:p-8 border border-amber-100 shadow-sm hover:shadow transition-shadow flex flex-col sm:flex-row gap-5 items-start text-left">
                <div className="w-12 h-12 bg-amber-100 text-[#ea580c] rounded-full flex items-center justify-center shrink-0 shadow-inner">
                  <HeartHandshake size={22} className="text-accent" />
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-extrabold text-[#111827] uppercase tracking-tight mb-2">
                    Make a Difference
                  </h3>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    Your contribution can help a student continue education with dignity and build a better future. 
                  </p>
                  <button 
                    onClick={() => setShowDonateModal(true)}
                    className="inline-flex items-center gap-1.5 bg-accent hover:bg-amber-700 text-white font-extrabold text-xs uppercase tracking-wider px-5 py-2.5 rounded shadow-sm transition-colors"
                  >
                    Donate Now 🧡
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>

       
  </>
            }
          />
       
</Routes>
      </main>

      {/* FOOTER AREA - EXACTLY AS DEPICTED IN THE IMAGE */}
      <footer id="contact" className="bg-[#0f172a] text-slate-300 pt-16 md:pt-20 pb-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16 text-left">
            
            {/* Box 1: NGO Identity and Motto */}
            <div className="sm:col-span-2 lg:col-span-5">
              <div 
                className="flex items-center gap-3 mb-6 cursor-pointer"
                onClick={() => {
                  navigate("/");
                  setActiveAnchor("#home");
                  window.scrollTo({top: 0, behavior: "smooth"});
                }}
              >
                <div className="lg:w-26 w-20 lg:h-26 h-20 bg-white rounded-full flex items-center justify-center p-0.5 overflow-hidden shrink-0">
                  <img 
                    src="https://vrfacwizigigcpowkrye.supabase.co/storage/v1/object/public/General/ngo-logo.png" 
                    alt="ABET Logo" 
                    className="w-full h-full object-contain" 
                  />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-bold text-white tracking-tight text-base md:text-[28px] leading-tight uppercase">
                    Ambedkar Begumpura
                  </span>
                  <span className="font-bold text-white tracking-tight text-base md:text-[28px] leading-none uppercase">
                    Education Trust
                  </span>
                  <span className="lg:text-[14px] text-[10px] font-bold tracking-widest leading-none text-slate-400 mt-2">
                    Education • Equality • Empowerment
                  </span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mb-6 leading-relaxed max-w-sm">
                Empowering the youth through education and constitutional values. Registered Trust No: 100/2026.
              </p>
              
              {/* Social Buttons */}
              <div className="flex items-center gap-3.5 pt-2">
                {Object.keys(SOCIAL_ICONS).map((social) => {
                  // Dynamically look up the right component
                  const IconComponent = SOCIAL_ICONS[social as keyof typeof SOCIAL_ICONS];

                  return (
                    <button 
                      key={social} 
                      aria-label={`Visit our ${social} page`}
                      className="w-8 h-8 rounded bg-slate-800 inline-flex items-center justify-center hover:bg-[#f59e0b] hover:text-slate-900 text-slate-400 transition-colors"
                    >
                      <IconComponent size={16} strokeWidth={2.25} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Box 2: Quick links */}
            <div className="sm:col-span-1 lg:col-span-2">
              <h4 className="font-bold text-base uppercase text-[#f59e0b] tracking-widest mb-6 pb-2 border-b border-slate-800">
                Quick Links
              </h4>
              <ul className="space-y-3.5 text-xs sm:text-sm text-slate-400">
                <li><a href="#home" onClick={handleScrollToSection("#home")} className="hover:text-accent transition-colors font-medium">Home</a></li>
                <li><a href="#about" onClick={handleScrollToSection("#about")} className="hover:text-accent transition-colors font-medium">About Us</a></li>
                <li><a href="#programmes" onClick={handleScrollToSection("#programmes")} className="hover:text-accent transition-colors font-medium">Programmes</a></li>
                <li><a href="#scholarships" onClick={handleScrollToSection("#scholarships")} className="hover:text-accent transition-colors font-medium">Scholarships</a></li>
                <li><a href="#apply" onClick={handleScrollToSection("#apply")} className="hover:text-accent transition-colors font-medium"> Apply</a></li>
                <li><a href="#gallery" onClick={handleScrollToSection("#gallery")} className="hover:text-accent transition-colors font-medium">Gallery</a></li>
                <li><a href="#contact" onClick={handleScrollToSection("#contact")} className="hover:text-accent transition-colors font-medium">Contact Us</a></li>
              </ul>
            </div>

            {/* Box 3: Strategic Programs */}
            <div className="sm:col-span-1 lg:col-span-2">
              <h4 className="font-bold text-base uppercase text-[#f59e0b] tracking-widest mb-6 pb-2 border-b border-slate-800">
                Our Programs
              </h4>
              <ul className="space-y-3.5 text-xs sm:text-sm text-slate-400">
                <li><a href="#scholarships" onClick={handleScrollToSection("#scholarships")} className="hover:text-accent transition-colors font-medium">Scholarships</a></li>
                <li><a href="#objectives" onClick={handleScrollToSection("#objectives")} className="hover:text-accent font-medium">Digital Learning Support</a></li>
                <li><a href="#objectives" onClick={handleScrollToSection("#objectives")} className="hover:text-[#f59e0b] font-medium">Books & Study Material</a></li>
                <li><a href="#objectives" onClick={handleScrollToSection("#objectives")} className="hover:text-[#f59e0b] font-medium">Career Guidance</a></li>
                <li><a href="#objectives" onClick={handleScrollToSection("#objectives")} className="hover:text-[#f59e0b] font-medium">Mentorship</a></li>
              </ul>
            </div>

            {/* Box 4: Actual coordinates matching target NGO */}
            <div className="sm:col-span-2 lg:col-span-3">
              <h4 className="font-bold text-base uppercase text-[#f59e0b] tracking-widest mb-6 pb-2 border-b border-slate-800">
                Contact Us
              </h4>
              <ul className="space-y-4 text-xs sm:text-sm text-slate-400">
                <li className="flex gap-3">
                  <MapPin className="text-[#f59e0b] shrink-0" size={18} />
                  <span>123, Ambedkar Road, New Delhi - 110001, India</span>
                </li>
                <li className="flex gap-3">
                  <Phone className="text-[#f59e0b] shrink-0" size={18} />
                  <span>+91 98765 43210</span>
                </li>
                <li className="flex gap-3">
                  <Mail className="text-[#f59e0b] shrink-0" size={18} />
                  <span className="break-all">info@ambedkarbegumpura.org</span>
                </li>
                <li className="flex gap-3">
                  <Globe className="text-[#f59e0b] shrink-0" size={18} />
                  <span>www.ambedkarbegumpura.org</span>
                </li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-center items-center gap-4 text-slate-500 text-[10px] sm:text-base text-center md:text-left">
            <p>© 2026 Ambedkar Begumpura Education Trust. All Rights Reserved.</p>
            {/* <p className="font-bold uppercase tracking-widest text-slate-600">Equality • Liberty • Fraternity • Justice</p> */}
          </div>

        </div>
      </footer>

      {/* --- INTEGRATED HIGH-FIDELITY INTERACTIVE MODALS --- */}

      {/* 1. READ MORE ABOUT US / DETAILED STORY MODAL */}
      <AnimatePresence>
        {showAboutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay bg */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAboutModal(false)}
              className="absolute inset-0 bg-slate-900/85 backdrop-blur-sm"
            />
            
            {/* Modal Body */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-2xl shadow-2xl relative max-w-2xl w-full max-h-[85vh] overflow-y-auto z-10 text-left border border-slate-100 flex flex-col"
            >
              <div className="border-b border-slate-100 p-5 flex justify-between items-center sticky top-0 bg-white z-10">
                <div className="flex items-center gap-2">
                  <Globe className="text-[#1e3a8a]" size={20} />
                  <h3 className="font-extrabold text-lg text-[#1e3a8a] uppercase tracking-wide">
                    About Ambedkar Begumpura Trust
                  </h3>
                </div>
                <button 
                  onClick={() => setShowAboutModal(false)}
                  className="rounded-full hover:bg-slate-100 p-1 text-slate-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <h4 className="text-xs font-black uppercase text-accent tracking-widest mb-2">The Concept of Begumpura</h4>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    Begumpura is an architectural utopia coined by Guru Ravidas, depicting a land without distress, sorrow, or discrimination, where everyone is guaranteed equality and dignity. Babasaheb Dr. B.R. Ambedkar spent his entire lifework building constitutional realities of equality, liberty, and social justice. ABET Trust acts on these principles to ensure educational keys are handed straight to Scheduled Caste students.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                  <div>
                    <h5 className="font-extrabold text-[#1e3a8a] text-xs uppercase tracking-wider mb-2">Core Trust Vision</h5>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      To empower every first-generation SC scholar with adequate financial shielding, digital laptops, competitive text kits, and IAS mentorship pipelines.
                    </p>
                  </div>
                  <div>
                    <h5 className="font-extrabold text-[#1e3a8a] text-xs uppercase tracking-wider mb-2">Core Trust Values</h5>
                    <ul className="text-slate-500 text-xs space-y-1">
                      <li>• Transparency & Govt Compliance</li>
                      <li>• Education for Social Dignity</li>
                      <li>• Unrestricted Equal Opportunity</li>
                      <li>• Individual Student Tracking</li>
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 bg-slate-50 p-4 rounded-lg">
                  <h5 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-accent" />
                    Board Certification & Audits
                  </h5>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    ABET is recognized as a fully transparent Trust. 100% of donations are immediately processed and updated with digitized government certificates. Registered under PAN and Section 80G tax exemptions of the Income Tax Act.
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-100 p-4 bg-slate-50 flex justify-end">
                <button 
                  onClick={() => setShowAboutModal(false)}
                  className="bg-[#1e3a8a] text-white px-5 py-2 text-xs font-bold uppercase rounded hover:bg-blue-900 transition-colors"
                >
                  Close Window
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. REAL INTERACTIVE DONATION FORM & CAUSE SELECTION MODAL */}
      <AnimatePresence>
        {showDonateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDonationModal}
              className="absolute inset-0 bg-slate-900/85 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-2xl shadow-2xl relative max-w-lg w-full max-h-[90vh] overflow-y-auto z-10 text-left border border-slate-100 flex flex-col"
            >
              <div className="border-b border-slate-100 p-5 flex justify-between items-center sticky top-0 bg-white z-10">
                <div className="flex items-center gap-2">
                  <Coins className="text-accent" size={20} />
                  <h3 className="font-extrabold text-lg text-[#1e3a8a] uppercase tracking-wide">
                    Support ABET Scholars
                  </h3>
                </div>
                <button 
                  onClick={closeDonationModal}
                  className="rounded-full hover:bg-slate-100 p-1 text-slate-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 sm:p-8 space-y-6 flex-grow">
                
                {donationSuccess ? (
                  /* Success Frame */
                  <div className="text-center py-6 space-y-4">
                    <div className="w-16 h-16 bg-blue-50 text-[#1e3a8a] rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100">
                      <CheckCircle size={36} className="fill-blue-50 text-[#1e3a8a]" />
                    </div>
                    <h3 className="text-xl font-extrabold text-[#1e3a8a] uppercase tracking-tight">
                      Thank You, Noble Citizen!
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed max-w-sm mx-auto">
                      Your simulated support of <strong className="text-slate-900">₹{customAmount || donationAmount}</strong> has been registered underneath the <strong className="text-slate-950">{donationCause}</strong>. 
                    </p>
                    
                    <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 text-xs font-semibold space-y-2 text-left text-slate-700">
                      <div><span className="text-slate-500 uppercase font-bold text-[9px] block">Donor Name:</span> {donorName}</div>
                      <div><span className="text-slate-500 uppercase font-bold text-[9px] block">Receipt Reference:</span> ABET/2026/DON-MOCK-{Math.floor(1000 + Math.random() * 9000)}</div>
                      <div><span className="text-slate-500 uppercase font-bold text-[9px] block">80G Tax Exemption Status:</span> Active (Verified)</div>
                    </div>
                    
                    <p className="text-[10px] text-slate-400">
                      This is a simulated verification. ABET thanks you for exploring this design prototype with deep care and social pride!
                    </p>
                    
                    <button 
                      onClick={closeDonationModal}
                      className="bg-accent text-white px-6 py-2.5 font-bold uppercase rounded text-xs transition-colors hover:bg-amber-700 w-full"
                    >
                      Done and Close
                    </button>
                  </div>
                ) : (
                  /* Form Frame */
                  <form onSubmit={handleDonationSubmit} className="space-y-5 text-left">
                    
                    {/* Exemption Notice */}
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded text-[11px] text-[#1e3a8a] leading-normal flex gap-2">
                      <ShieldCheck size={16} className="shrink-0 text-[#1e3a8a]" />
                      <span>All donations are eligible for 100% Tax Exemption certificate details. (Sec 80G ABET Certificate ID verified).</span>
                    </div>

                    {/* Choose Amount */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-700 block uppercase tracking-wider">Select Support Contribution</span>
                      <div className="grid grid-cols-4 gap-2">
                        {["1000", "2500", "5000", "10000"].map(val => (
                          <button
                            type="button"
                            key={val}
                            onClick={() => { setDonationAmount(val); setCustomAmount(""); }}
                            className={`py-2 rounded font-black text-xs transition-all border ${donationAmount === val && !customAmount ? 'bg-accent border-accent text-white shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'}`}
                          >
                            ₹{val}
                          </button>
                        ))}
                      </div>
                      
                      <div className="relative mt-2">
                        <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">Custom Amount (₹):</span>
                        <input 
                          type="number"
                          value={customAmount}
                          onChange={e => { setCustomAmount(e.target.value); setDonationAmount(""); }}
                          className="w-full pl-36 pr-4 py-2 text-sm rounded bg-slate-50 focus:bg-white border border-slate-200 outline-none focus:border-accent"
                          placeholder="Or type custom rupee value"
                        />
                      </div>
                    </div>

                    {/* Choose Cause */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-700 block uppercase tracking-wider">Allocate Contribution To:</span>
                      <select 
                        value={donationCause}
                        onChange={e => setDonationCause(e.target.value)}
                        className="w-full px-3 py-2.5 rounded bg-slate-50 focus:bg-white border border-slate-200 outline-none text-xs sm:text-sm font-semibold"
                      >
                        <option value="Scholarship Fund">Dr. Ambedkar Scholarship Fund (Fees)</option>
                        <option value="Digital Tech Support">Digital Classroom & Computer Drive</option>
                        <option value="Books Distribution">Primary Free Study Books Program</option>
                        <option value="General Support">General Community Upliftment Programs</option>
                      </select>
                    </div>

                    {/* Donor Credentials */}
                    <div className="space-y-3.5 pt-2 border-t border-slate-100">
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-600 uppercase block">Full Name *</label>
                          <input 
                            type="text" required value={donorName} onChange={e => setDonorName(e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded bg-slate-50 border border-slate-200 outline-none focus:border-accent" placeholder="Enter name"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-600 uppercase block">Email address *</label>
                          <input 
                            type="email" required value={donorEmail} onChange={e => setDonorEmail(e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded bg-slate-50 border border-slate-200 outline-none focus:border-accent" placeholder="info@example.com"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-600 uppercase block flex items-center justify-between">PAN Number <span className="text-slate-400 font-normal italic">(80G Claim)</span></label>
                          <input 
                            type="text" value={donorPan} onChange={e => setDonorPan(e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded bg-slate-50 border border-slate-200 outline-none focus:border-accent uppercase" placeholder="ABCDE1234F"
                          />
                        </div>
                        
                        <div className="bg-slate-50 border border-slate-200 rounded p-2.5 flex items-center justify-center text-center">
                          <div className="text-[10px] text-slate-500 leading-tight">
                            <span className="font-extrabold uppercase text-xs block text-slate-800">State Bank of India</span>
                            ABET Ref Code: SBIN0000607
                          </div>
                        </div>
                      </div>

                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-[#1e3a8a] text-white font-extrabold text-xs uppercase py-3.5 tracking-wider rounded transition-all hover:bg-blue-900 mt-4 shadow"
                    >
                      Confirm Simulated Donation of ₹{customAmount || donationAmount} ➔
                    </button>

                  </form>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. APPLICATION SUCCESS REFERENCE ACCORDION MODAL */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/85 backdrop-blur-sm"
              onClick={resetForm}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-2xl shadow-2xl relative max-w-lg w-full z-10 text-left border border-slate-100 overflow-hidden flex flex-col"
            >
              <div className="bg-[#f0f7ff] p-6 text-center border-b border-blue-100">
                <div className="w-14 h-14 bg-white text-[#1e3a8a] rounded-full flex items-center justify-center mx-auto mb-3 shadow shadow-blue-100">
                  <CheckCircle size={28} className="text-secondary" />
                </div>
                <h3 className="text-xl font-extrabold text-[#1e3a8a] uppercase tracking-tight">
                  Application Filed Successfully
                </h3>
                <span className="inline-block mt-2 font-mono text-xs bg-white text-[#1e3a8a] border border-blue-200 px-3 py-1 rounded font-black">
                  {applicationRef}
                </span>
              </div>

              <div className="p-6 space-y-4 text-xs sm:text-sm text-slate-600">
                <p className="leading-relaxed">
                  Thank you, <strong className="text-slate-900">{form.fullName}</strong>. Your educational financial assistance file has been cataloged onto ABET core servers.
                </p>

                <div className="bg-slate-50 rounded pl-4 pr-3 py-3 border-l-4 border-accent space-y-1.5 font-medium text-slate-700">
                  <div className="uppercase text-[9px] font-bold text-slate-400 leading-none mb-1">Board Review Steps:</div>
                  <div>1. Geographic Residential Audit (Delhi Address Check)</div>
                  <div>2. Scheduled Caste validation checking (Certificate check)</div>
                  <div>3. Direct Fund routing determination directly to institution</div>
                </div>

                <div className="bg-slate-50 rounded p-3 text-[10px] text-slate-400 leading-normal">
                  * Please save your reference code <strong className="text-slate-600">{applicationRef}</strong> for communication queries with the Settlor Board. A physical confirmation notice is routed to +91 {form.phone}.
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                <button 
                  onClick={resetForm}
                  className="bg-[#1e3a8a] hover:bg-blue-900 text-white font-bold uppercase text-xs px-5 py-2.5 rounded transition-colors"
                >
                  Close & Refresh Form
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. GALLERY LIGHTBOX MODAL WITH PAGINATION */}
      <AnimatePresence>
        {activeGalleryIndex !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveGalleryIndex(null)}
              className="absolute inset-0 bg-slate-950/95"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-4xl w-full z-10 flex flex-col gap-4 text-left pointer-events-none"
            >
              {/* Lightbox Header */}
              <div className="flex justify-between items-center text-white pb-2 border-b border-white/10 pointer-events-auto">
                <div>
                  <span className="text-[10px] text-accent uppercase font-black tracking-widest block">
                    Community Impact Drive
                  </span>
                  <h3 className="font-extrabold text-sm sm:text-base leading-tight tracking-tight uppercase">
                    {GALLERY_IMAGES[activeGalleryIndex].title}
                  </h3>
                </div>
                <button 
                  onClick={() => setActiveGalleryIndex(null)}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Lightbox Media viewport */}
              <div className="relative aspect-[4/3] max-h-[60vh] rounded-lg overflow-hidden bg-slate-900 flex justify-center items-center pointer-events-auto shadow-2xl border border-white/10">
                <img 
                  src={GALLERY_IMAGES[activeGalleryIndex].url} 
                  alt={GALLERY_IMAGES[activeGalleryIndex].title} 
                  className="w-full h-full object-contain" 
                  referrerPolicy="no-referrer"
                />

                {/* Left navigation arrow */}
                <button 
                  onClick={() => setActiveGalleryIndex(prev => (prev !== null ? (prev === 0 ? GALLERY_IMAGES.length - 1 : prev - 1) : null))}
                  className="absolute left-3 p-2 bg-slate-900/60 hover:bg-slate-900/90 text-white rounded-full transition-colors flex items-center justify-center border border-white/10 active:scale-90"
                >
                  <ChevronLeft size={20} />
                </button>

                {/* Right navigation arrow */}
                <button 
                  onClick={() => setActiveGalleryIndex(prev => (prev !== null ? (prev === GALLERY_IMAGES.length - 1 ? 0 : prev + 1) : null))}
                  className="absolute right-3 p-2 bg-slate-900/60 hover:bg-[#d97706]/90 text-white rounded-full transition-colors flex items-center justify-center border border-white/10 active:scale-90"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Lightbox description details */}
              <div className="bg-slate-900 p-4 rounded-lg pointer-events-auto border border-white/5">
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-semibold">
                  {GALLERY_IMAGES[activeGalleryIndex].desc}
                </p>
                <div className="flex justify-between items-center text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-2">
                  <span>Ambedkar Begumpura Education Trust (ABET)</span>
                  <span>{activeGalleryIndex + 1} of {GALLERY_IMAGES.length}</span>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}



const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    "https://images.pexels.com/photos/3231359/pexels-photo-3231359.jpeg", // Main classroom image
    // "https://images.pexels.com/photos/35558791/pexels-photo-35558791.jpeg",
    // "https://images.pexels.com/photos/3079978/pexels-photo-3079978.jpeg"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section id="home" className="relative w-full min-h-[600px] lg:min-h-[500px] lg:h-[500px] flex items-center bg-[#101630] overflow-hidden font-sans select-none">
      
      {/* LAYER 1: Full-width Background Image Slider */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0 w-full h-full"
          >
            <img 
              src={slides[currentSlide]} 
              className="w-full h-full object-cover object-[center_20%] lg:object-[right_center]" 
              referrerPolicy="no-referrer"
              alt="Students in classroom"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* LAYER 2: Exact Left-to-Right Dark Blue Gradient Overlay */}
      {/* This creates the dark canvas on the left while perfectly exposing the right side */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#111634] via-[#111634]/90 sm:via-[#111634]/80 to-transparent via-[40%] lg:via-[45%] md:block hidden" />
      
      {/* Mobile fallback vertical gradient */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#111634] via-[#111634]/90 to-[#111634]/40 md:hidden block" />

      {/* LAYER 3: Blended Dr. Ambedkar Portrait on the Left */}
      <div 
        className="absolute bottom-0 left-0 top-15 w-full md:w-[45%] z-20 pointer-events-none opacity-[0.22] mix-blend-luminosity bg-no-repeat bg-left-bottom bg-contain hidden md:block"
        style={{ 
          backgroundImage: `url('Dr._Bhimrao_Ambedkar.png')`,
          maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)'
        }}
      />

      {/* LAYER 4: Foreground Content Layer */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 relative z-30 w-full header-content-wrapper">
        <div className="max-w-xl lg:max-w-2xl text-left">
          
          {/* Main Typography Header */}
          <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6 tracking-tight">
              Education for <br/><span className="text-accent italic font-serif">Dignity and Equality</span> 
            </h1>
            
            <p className="text-base sm:text-lg lg:text-xl text-slate-200 mb-6 lg:mb-8 leading-relaxed max-w-xl border-l-4 border-accent pl-4 lg:pl-6">
             Supporting students from economically and socially marginalised communities through scholarships, educational resources, and academic guidance.
            </p>
          
          {/* Styled CTA Button matching the image design */}
           <div className="flex flex-col sm:flex-row gap-4 lg:gap-5 w-full sm:w-auto">
              <Link to="/apply" className="btn-accent px-8 lg:px-10 py-4 lg:py-5 text-center text-base lg:text-lg flex items-center justify-center gap-3 shadow-2xl">
                Apply for Assitance <ChevronRight size={20} />
              </Link>
              <a href="#about" className="bg-transparent hover:bg-white/20 text-transparent  px-8 lg:px-10 py-4 lg:py-5 text-center text-base lg:text-lg font-bold rounded-lg  transition-all active:scale-95">
                Our Mission
              </a>
            </div>

        </div>
      </div>

    </section>
  );
};


