import { motion, AnimatePresence } from "motion/react";
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  MapPin, 
  Phone, 
  Mail, 
  Scale,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  Award,
  Globe
} from "lucide-react";
import { useState, useEffect } from "react";

// --- Components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2 text-slate-900 border-b border-slate-100' : 'bg-transparent py-4 text-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-2 border-accent overflow-hidden transition-colors ${scrolled ? 'bg-white' : 'bg-white'}`}>
               <img src="https://vrfacwizigigcpowkrye.supabase.co/storage/v1/object/public/General/ngo-logo.png" alt="ABET Logo" className="w-full  object-contain" referrerPolicy="no-referrer" />
            </div>
            <div className="flex flex-col">
              <span className={`font-bold text-lg leading-tight uppercase tracking-tight transition-colors ${scrolled ? 'text-primary' : 'text-white'}`}>ABET</span>
              <span className={`text-[10px] uppercase font-bold tracking-widest leading-tight ${scrolled ? 'text-slate-500' : 'text-white/80'}`}>Est. 2026</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#home" className="hover:text-accent transition-colors font-medium">Home</a>
            <a href="#about" className="hover:text-accent transition-colors font-medium">About Us</a>
            <a href="#trustees" className="hover:text-accent transition-colors font-medium">Trustees</a>
            <a href="#objectives" className="hover:text-accent transition-colors font-medium">Objectives</a>
            <a href="#apply" className="hover:text-accent transition-colors font-medium">Apply</a>
            <a href="#contact" className="hover:text-accent transition-colors font-medium">Contact</a>
            <button className="btn-accent px-6 py-2 text-sm shadow-xl shadow-accent/20">Donate Now</button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="hover:text-accent transition-colors">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-100 px-4 pb-6 flex flex-col gap-2 shadow-xl overflow-hidden"
          >
            <a href="#home" onClick={() => setIsOpen(false)} className="text-slate-800 font-medium py-3 border-b border-slate-50">Home</a>
            <a href="#about" onClick={() => setIsOpen(false)} className="text-slate-800 font-medium py-3 border-b border-slate-50">About Us</a>
            <a href="#trustees" onClick={() => setIsOpen(false)} className="text-slate-800 font-medium py-3 border-b border-slate-50">Trustees</a>
            <a href="#objectives" onClick={() => setIsOpen(false)} className="text-slate-800 font-medium py-3 border-b border-slate-50">Objectives</a>
            <a href="#apply" onClick={() => setIsOpen(false)} className="text-slate-800 font-medium py-3 border-b border-slate-50">Apply</a>
            <a href="#contact" onClick={() => setIsOpen(false)} className="text-slate-800 font-medium py-3">Contact</a>
            <button className="btn-accent w-full mt-4">Donate Now</button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    "https://images.pexels.com/photos/18012456/pexels-photo-18012456.jpeg",
    "https://images.pexels.com/photos/35558791/pexels-photo-35558791.jpeg",
    "https://images.pexels.com/photos/3079978/pexels-photo-3079978.jpeg"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section id="home" className="relative min-h-[100vh] lg:min-h-screen flex items-center overflow-hidden bg-slate-900 pt-32 pb-24 lg:pt-40 lg:pb-32 selection:bg-accent/40 selection:text-white">
      {/* Background Slider */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            <img 
              src={slides[currentSlide]} 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer"
              alt="Slider background"
            />
          </motion.div>
        </AnimatePresence>
        {/* Overlays for readability */}
        <div className="absolute inset-0 bg-slate-900/70 lg:bg-slate-900/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent md:block hidden" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent lg:hidden block" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Content Column */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-6 lg:mb-10 shadow-xl shadow-accent/20">
              <Globe size={14} />
              <span>Serving marginalized Communities</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6 tracking-tight">
              Building <span className="text-accent italic font-serif">Begumpura</span> Through Education
            </h1>
            
            <p className="text-base sm:text-lg lg:text-xl text-slate-200 mb-8 lg:mb-10 leading-relaxed max-w-xl border-l-4 border-accent pl-4 lg:pl-6">
              Empowering Scheduled Caste students and first-generation learners through impactful scholarships and comprehensive academic support.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 lg:gap-5 w-full sm:w-auto">
              <a href="#apply" className="btn-accent px-8 lg:px-10 py-4 lg:py-5 text-center text-base lg:text-lg flex items-center justify-center gap-3 shadow-2xl">
                Apply for Scholarship <ChevronRight size={20} />
              </a>
              <a href="#about" className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md px-8 lg:px-10 py-4 lg:py-5 text-center text-base lg:text-lg font-bold rounded-lg border border-white/20 transition-all active:scale-95">
                Our Mission
              </a>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-8 lg:gap-12 mt-12 lg:mt-16 pt-8 lg:pt-10 border-t border-white/10 w-full">
               <div className="flex flex-col">
                  <div className="text-3xl lg:text-4xl font-bold text-accent">500+</div>
                  <div className="text-[9px] lg:text-[10px] text-slate-400 uppercase font-black tracking-[0.2em] mt-1 lg:mt-2">Students Supported</div>
               </div>
               <div className="w-px h-10 lg:h-12 bg-white/10" />
               <div className="flex flex-col">
                  <div className="text-3xl lg:text-4xl font-bold text-accent">2026</div>
                  <div className="text-[9px] lg:text-[10px] text-slate-400 uppercase font-black tracking-[0.2em] mt-1 lg:mt-2">Trust Established</div>
               </div>
            </div>
          </motion.div>

          {/* Portrait Column */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="lg:col-span-5 flex justify-center mt-12 lg:mt-0"
          >
            <div className="relative group p-4 sm:p-0">
              {/* Dr. Ambedkar Portrait Card */}
              <div className="relative z-10 w-64 sm:w-72 md:w-80 bg-white rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.5)] p-3 sm:p-4 border-t-8 border-accent transform -rotate-2 sm:-rotate-3 transition-transform group-hover:rotate-0 duration-500">
                <div className="rounded-xl overflow-hidden mb-4 sm:mb-6 aspect-[4/5] bg-slate-100 shadow-inner">
                   <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Dr._Bhimrao_Ambedkar.jpg/500px-Dr._Bhimrao_Ambedkar.jpg" 
                      alt="Dr. B.R. Ambedkar" 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                      referrerPolicy="no-referrer"
                    />
                </div>
                <div className="text-center pb-2">
                  <h4 className="text-slate-900 font-extrabold text-sm sm:text-base uppercase tracking-widest">Dr. B.R. Ambedkar</h4>
                  <div className="h-0.5 sm:h-1 w-12 sm:w-16 bg-accent mx-auto my-2 sm:my-3 rounded-full" />
                  <p className="text-[10px] sm:text-xs text-primary font-bold uppercase italic tracking-tight">The Source of Inspiration</p>
                </div>
              </div>
              
              {/* Background Shapes */}
              <div className="absolute -top-4 -right-4 sm:-top-8 sm:-right-8 w-full h-full border-2 border-white/20 rounded-2xl -z-10 rotate-3 sm:rotate-6" />
              <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 w-full h-full bg-accent/20 rounded-2xl -z-10 -rotate-1 sm:-rotate-2 backdrop-blur-sm" />
            </div>
          </motion.div>

        </div>
      </div>

      {/* Slider Indicators */}
      {/* <div className="absolute bottom-6 lg:bottom-12 left-1/2 -translate-x-1/2 flex gap-3 lg:gap-4 z-20">
         {slides.map((_, i) => (
           <button 
             key={i} 
             onClick={() => setCurrentSlide(i)}
             className={`h-1.5 lg:h-2 transition-all duration-300 rounded-full ${currentSlide === i ? 'w-8 lg:w-12 bg-accent' : 'w-4 lg:w-6 bg-white/20 hover:bg-white/40'}`}
           />
         ))}
      </div> */}
    </section>
  );
};

const SectionHeader = ({ title, subtitle, centered = false }: { title: string; subtitle?: string; centered?: boolean }) => (
  <div className={`mb-12 lg:mb-16 ${centered ? 'text-center' : ''}`}>
    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight mb-4 tracking-tight uppercase underline-offset-8 decoration-accent/30 decoration-4 underline">{title}</h2>
    {subtitle && <p className={`text-slate-500 text-base sm:text-lg max-w-2xl ${centered ? 'mx-auto' : ''}`}>{subtitle}</p>}
    <div className={`h-1.5 w-20 bg-accent mt-6 ${centered ? 'mx-auto' : ''}`} />
  </div>
);

const Trustees = () => {
  const members = [
    {
      name: "Mr. Hemant Rao",
      title: "IAS (Retd)",
      role: "Settlor & President",
      image: "https://vrfacwizigigcpowkrye.supabase.co/storage/v1/object/public/General/ngo-team-1.png"
    },
    {
      name: "Mr. Dhiraj Kumar",
      title: "Suptd Engg (Retd)",
      role: "Trustee",
      image: "https://images.pexels.com/photos/4088732/pexels-photo-4088732.jpeg"
    },
    {
      name: "Mr. Mahender Prakash",
      title: "Director of Horticulture (Retd)",
      role: "Trustee",
      image: "https://images.pexels.com/photos/37272895/pexels-photo-37272895.png"
    }
  ];

  return (
    <section id="trustees" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader 
          title="Distinguished Trustees" 
          subtitle="Our trust is guided by veteran administrative professionals committed to social justice and educational excellence."
          centered
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-12">
          {members.map((member, i) => (
            <motion.div 
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="card text-center group p-6 sm:p-8"
            >
              <div className="relative mb-6 inline-block">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden mx-auto border-4 border-slate-50 shadow-md transform group-hover:scale-105 transition-transform duration-300">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-primary text-white p-1.5 sm:p-2 rounded-full shadow-lg">
                  <ShieldCheck size={18} className="sm:w-5 sm:h-5" />
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 uppercase tracking-tight">{member.name}</h3>
              <p className="text-primary font-semibold mb-1 text-xs sm:text-sm">{member.title}</p>
              <p className="text-slate-500 text-xs italic">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Objectives = () => {
  const items = [
    {
      icon: GraduationCap,
      title: "Scholarships",
      desc: "Financial aid for school, college, and technical courses."
    },
    {
      icon: BookOpen,
      title: "Study Resources",
      desc: "Assistance with books, digital tools, and examination fees."
    },
    {
      icon: Scale,
      title: "Social Equality",
      desc: "Promoting constitutional values of dignity and liberty."
    },
    {
      icon: MapPin,
      title: "Regional Focus",
      desc: "Priority given to students from NCT of Delhi, particularly Karol Bagh and Dev Nagar."
    }
  ];

  return (
    <section id="objectives" className="py-16 lg:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader 
          title="Our Key Objectives" 
          subtitle="A holistic framework designed to bridge the educational gap and foster long-term community upliftment."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {items.map((item, i) => (
            <motion.div 
              key={item.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="card group hover:border-accent/30 p-6"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/5 text-primary rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-all duration-300 shadow-sm border border-primary/5">
                <item.icon size={24} className="sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-3 tracking-tight">{item.title}</h3>
              <p className="text-slate-500 leading-relaxed text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ApplicationForm = () => {
  return (
    <section id="apply" className="py-16 lg:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card p-6 sm:p-8 md:p-12 shadow-2xl relative overflow-hidden backdrop-blur-sm border-slate-100">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 -mr-16 -mt-16 rounded-full" />
          
          <SectionHeader 
            title="Assistance Application" 
            subtitle="Please provide accurate information for the Board’s evaluation. Incomplete applications may be delayed."
            centered
          />

          <form className="space-y-6 sm:space-y-8" onSubmit={(e) => e.preventDefault()}>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-semibold text-slate-700">Full Name</label>
                <input type="text" className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm" placeholder="Enter student name" />
              </div>
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-semibold text-slate-700">Phone Number</label>
                <input type="tel" className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm" placeholder="+91 XXXXX XXXXX" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-semibold text-slate-700">Permanent Address (Delhi verification required)</label>
              <textarea rows={3} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm" placeholder="Street address, colony, and pin code" />
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-semibold text-slate-700">Institution Name</label>
                <input type="text" className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm" placeholder="School or College name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-slate-700">Course</label>
                  <input type="text" className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm" placeholder="Degree/Diploma" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-slate-700">Current Grade</label>
                  <input type="text" className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm" placeholder="Year/Class" />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <label className="text-xs sm:text-sm font-bold text-slate-900 block mb-2 underline underline-offset-4 decoration-accent">Support Required For:</label>
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-4 sm:gap-6">
                {["Tuition Fees", "Books", "Hostel"].map(item => (
                  <label key={item} className="flex items-center gap-2 sm:gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 sm:w-5 sm:h-5 rounded border-slate-300 text-primary focus:ring-primary group-hover:border-primary transition-all" />
                    <span className="text-slate-600 font-medium text-xs sm:text-sm">{item}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-6 pt-4 border-t border-slate-100">
               <label className="text-xs sm:text-sm font-bold text-slate-900 block mb-4">Required Documents (PDF/JPG):</label>
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {["Caste Certificate", "ID Proof", "Income Certificate"].map(doc => (
                    <div key={doc} className="space-y-2">
                      <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{doc}</div>
                      <label className="border-2 border-dashed border-slate-200 hover:border-primary/50 hover:bg-primary/5 rounded-lg p-3 sm:p-4 flex flex-col items-center justify-center gap-1 sm:gap-2 cursor-pointer transition-all bg-slate-50/50">
                        <Users size={18} className="text-slate-400" />
                        <span className="text-[9px] font-black text-slate-600 tracking-tighter">UPLOAD</span>
                        <input type="file" className="hidden" />
                      </label>
                    </div>
                  ))}
               </div>
            </div>

            <button type="submit" className="btn-accent w-full py-4 sm:py-5 text-base sm:text-lg shadow-xl shadow-accent/20 active:scale-95 transition-transform">
              Submit for Board Review
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer id="contact" className="bg-slate-900 text-white pt-16 lg:pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-16">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-accent overflow-hidden">
                 <img src="https://vrfacwizigigcpowkrye.supabase.co/storage/v1/object/public/General/ngo-logo.png" alt="ABET Logo" className="w-full object-contain" referrerPolicy="no-referrer" />
              </div>
              <span className="font-bold text-lg sm:text-xl tracking-tight">ABET</span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm mb-6 leading-relaxed">
              Empowering the youth through education and constitutional values. Registered Trust No: 100/2026.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-base sm:text-lg mb-6 border-b border-white/10 pb-2 inline-block uppercase tracking-widest text-accent">Quick Links</h4>
            <ul className="space-y-3 sm:space-y-4 text-slate-400 text-sm">
              <li><a href="#" className="hover:text-accent transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Terms of Use</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">FAQ</a></li>
              {/* <li><a href="#" className="hover:text-accent transition-colors">Career</a></li> */}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-base sm:text-lg mb-6 border-b border-white/10 pb-2 inline-block uppercase tracking-widest text-accent">Information</h4>
            <ul className="space-y-3 sm:space-y-4 text-slate-400 text-sm">
               <li><a href="#about" className="hover:text-accent transition-colors">About Mission</a></li>
               <li><a href="#trustees" className="hover:text-accent transition-colors">Board of Trustees</a></li>
               <li><a href="#apply" className="hover:text-accent transition-colors">Scholarship Criteria</a></li>
               <li><a href="#objectives" className="hover:text-accent transition-colors">Strategic Goals</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-base sm:text-lg mb-6 border-b border-white/10 pb-2 inline-block uppercase tracking-widest text-accent">Contact Info</h4>
            <ul className="space-y-3 sm:space-y-4 text-slate-400">
              <li className="flex gap-3">
                <MapPin className="text-accent shrink-0" size={18} />
                <span className="text-xs sm:text-sm">B-119, Sector-50, Noida, Gautam Buddha Nagar, U.P.</span>
              </li>
              <li className="flex gap-3 text-sm">
                <Phone className="text-accent shrink-0" size={18} />
                <span>+91 98119 87695</span>
              </li>
              <li className="flex gap-3 text-sm">
                <Mail className="text-accent shrink-0" size={18} />
                <span className="break-all">info@ambedkar-begumpura.org</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-[10px] sm:text-xs text-center md:text-left">
          <p>© 2026 Ambedkar Begumpura Education Trust. Inspired by Dr. B.R. Ambedkar.</p>
          {/* <p className="font-bold uppercase tracking-widest text-slate-600">Designed for Social Upliftment</p> */}
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-accent/30">
      <Navbar />
      <main>
        <Hero />
        <Trustees />
        <Objectives />
        <ApplicationForm />
      </main>
      <Footer />
    </div>
  );
}
