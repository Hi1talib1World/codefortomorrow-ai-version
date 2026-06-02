import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Shield, ChevronRight, ExternalLink, Mail, ArrowUp } from 'lucide-react';

const sections = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'information-we-collect', label: 'Information We Collect' },
  { id: 'how-we-use', label: 'How We Use Your Information' },
  { id: 'cookies', label: 'Cookies & Tracking' },
  { id: 'data-sharing', label: 'Data Sharing & Third Parties' },
  { id: 'data-security', label: 'Data Security' },
  { id: 'data-retention', label: 'Data Retention' },
  { id: 'children-privacy', label: "Children's Privacy" },
  { id: 'your-rights', label: 'Your Rights' },
  { id: 'changes', label: 'Changes to This Policy' },
  { id: 'contact', label: 'Contact Us' },
];

const PrivacyPolicyScreen: React.FC = () => {
  const { language } = useLanguage();
  const isRtl = language === 'ar';
  const [activeSection, setActiveSection] = useState('introduction');
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollContainer = document.querySelector('[data-privacy-scroll]');
      if (!scrollContainer) return;
      setShowScrollTop(scrollContainer.scrollTop > 300);

      const sectionEls = scrollContainer.querySelectorAll('[data-section]');
      let current = 'introduction';
      sectionEls.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 200) {
          current = el.getAttribute('data-section') || current;
        }
      });
      setActiveSection(current);
    };

    const scrollContainer = document.querySelector('[data-privacy-scroll]');
    scrollContainer?.addEventListener('scroll', handleScroll);
    return () => scrollContainer?.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const scrollContainer = document.querySelector('[data-privacy-scroll]');
    const el = scrollContainer?.querySelector(`[data-section="${id}"]`);
    if (el && scrollContainer) {
      const containerTop = scrollContainer.getBoundingClientRect().top;
      const elTop = el.getBoundingClientRect().top;
      scrollContainer.scrollTop += elTop - containerTop - 24;
    }
  };

  const scrollToTop = () => {
    const scrollContainer = document.querySelector('[data-privacy-scroll]');
    scrollContainer?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const effectiveDate = 'June 1, 2026';
  const lastUpdated = 'June 1, 2026';

  return (
    <div className={`max-w-7xl mx-auto ${isRtl ? 'text-right' : 'text-left'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Effective: {effectiveDate} · Last updated: {lastUpdated}
            </p>
          </div>
        </div>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
          At Code for Tomorrow, your privacy matters. This policy explains how we collect, use, and protect your personal information when you use our platform.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Table of Contents — Desktop */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-4">
            <div className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-5 backdrop-blur-sm">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">
                On this page
              </h3>
              <nav className="space-y-1">
                {sections.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => scrollToSection(s.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                      activeSection === s.id
                        ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/40 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/50 backdrop-blur-sm overflow-hidden">
            <div className="p-6 md:p-10 space-y-12">

              {/* Introduction */}
              <section data-section="introduction">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/15 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-sm font-bold">1</span>
                  Introduction
                </h2>
                <div className="prose dark:prose-invert prose-slate max-w-none">
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    Welcome to <strong>Code for Tomorrow</strong> ("we", "our", or "us"). This Privacy Policy describes how we collect, use, disclose, and safeguard your information when you visit our website, mobile application, and related services (collectively, the "Platform").
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-3">
                    By accessing or using the Platform, you agree to the terms of this Privacy Policy. If you do not agree with the terms of this policy, please do not access the Platform.
                  </p>
                </div>
              </section>

              <hr className="border-slate-100 dark:border-slate-700/50" />

              {/* Information We Collect */}
              <section data-section="information-we-collect">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/15 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-sm font-bold">2</span>
                  Information We Collect
                </h2>
                <div className="space-y-6">
                  <div className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-5 border border-slate-100 dark:border-slate-600/30">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-indigo-500" />
                      Personal Data
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                      When you register for an account, we may collect personally identifiable information such as your name, email address, profile picture, and role (student or teacher). If you sign in through third-party services (e.g., Google, GitHub), we receive basic profile information from those providers.
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-5 border border-slate-100 dark:border-slate-600/30">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-indigo-500" />
                      Usage Data
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                      We automatically collect certain information when you access the Platform, including your IP address, browser type, operating system, referring URLs, pages viewed, time spent on pages, and other diagnostic data. This helps us understand how the Platform is used and improve the user experience.
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-5 border border-slate-100 dark:border-slate-600/30">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-indigo-500" />
                      Learning Progress Data
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                      We store your lesson progress, quiz scores, streaks, XP points, earned badges, and completed courses. This data is essential for providing personalized learning paths and tracking your educational journey.
                    </p>
                  </div>
                </div>
              </section>

              <hr className="border-slate-100 dark:border-slate-700/50" />

              {/* How We Use */}
              <section data-section="how-we-use">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/15 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-sm font-bold">3</span>
                  How We Use Your Information
                </h2>
                <ul className="space-y-3">
                  {[
                    'Provide, maintain, and improve the Platform and its features',
                    'Personalize your learning experience and recommend courses',
                    'Track your progress, award badges, and maintain streaks',
                    'Send you notifications about your account, updates, and new features',
                    'Respond to your inquiries and provide customer support',
                    'Monitor and analyze usage patterns and trends to improve the Platform',
                    'Detect, prevent, and address technical issues and security threats',
                    'Comply with applicable laws and regulations',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-300 text-sm">
                      <span className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-500/15 flex items-center justify-center shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      </span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <hr className="border-slate-100 dark:border-slate-700/50" />

              {/* Cookies */}
              <section data-section="cookies">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/15 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-sm font-bold">4</span>
                  Cookies & Tracking Technologies
                </h2>
                <div className="text-slate-600 dark:text-slate-300 text-sm space-y-4 leading-relaxed">
                  <p>
                    We use cookies and similar tracking technologies to track activity on our Platform and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier.
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="bg-slate-100 dark:bg-slate-700/40">
                          <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-300 rounded-tl-lg">Type</th>
                          <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Purpose</th>
                          <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-300 rounded-tr-lg">Duration</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-700/40">
                        <tr>
                          <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-200">Essential</td>
                          <td className="px-4 py-3">Authentication, session management, security</td>
                          <td className="px-4 py-3">Session</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-200">Preferences</td>
                          <td className="px-4 py-3">Language, theme, and display preferences</td>
                          <td className="px-4 py-3">1 year</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-200">Analytics</td>
                          <td className="px-4 py-3">Usage statistics, performance monitoring</td>
                          <td className="px-4 py-3">2 years</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p>
                    You can instruct your browser to refuse all cookies or indicate when a cookie is being sent. However, some parts of the Platform may not function properly without cookies.
                  </p>
                </div>
              </section>

              <hr className="border-slate-100 dark:border-slate-700/50" />

              {/* Data Sharing */}
              <section data-section="data-sharing">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/15 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-sm font-bold">5</span>
                  Data Sharing & Third Parties
                </h2>
                <div className="text-slate-600 dark:text-slate-300 text-sm space-y-4 leading-relaxed">
                  <p>We do not sell your personal information to third parties. We may share your information in the following limited circumstances:</p>
                  <div className="grid gap-4 md:grid-cols-2">
                    {[
                      { title: 'Service Providers', desc: 'We may share data with third-party vendors who perform services on our behalf, such as hosting, analytics, and email delivery.' },
                      { title: 'Legal Compliance', desc: 'We may disclose your information if required by law or in response to valid legal processes such as subpoenas or court orders.' },
                      { title: 'Business Transfers', desc: 'In connection with a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction.' },
                      { title: 'With Your Consent', desc: 'We may share your information for any other purpose with your explicit consent.' },
                    ].map((item, i) => (
                      <div key={i} className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-4 border border-slate-100 dark:border-slate-600/30">
                        <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">{item.title}</h4>
                        <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <hr className="border-slate-100 dark:border-slate-700/50" />

              {/* Data Security */}
              <section data-section="data-security">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/15 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-sm font-bold">6</span>
                  Data Security
                </h2>
                <div className="text-slate-600 dark:text-slate-300 text-sm space-y-3 leading-relaxed">
                  <p>
                    We implement industry-standard security measures to protect your personal information, including encryption (TLS/SSL), secure database storage, access controls, and regular security audits.
                  </p>
                  <p>
                    However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your data, we cannot guarantee absolute security.
                  </p>
                </div>
              </section>

              <hr className="border-slate-100 dark:border-slate-700/50" />

              {/* Data Retention */}
              <section data-section="data-retention">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/15 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-sm font-bold">7</span>
                  Data Retention
                </h2>
                <div className="text-slate-600 dark:text-slate-300 text-sm space-y-3 leading-relaxed">
                  <p>
                    We retain your personal information for as long as your account is active or as needed to provide you services. We will retain and use your information as necessary to comply with our legal obligations, resolve disputes, and enforce our agreements.
                  </p>
                  <p>
                    If you wish to delete your account and associated data, please contact us at the email address provided below. We will process your request within 30 days.
                  </p>
                </div>
              </section>

              <hr className="border-slate-100 dark:border-slate-700/50" />

              {/* Children's Privacy */}
              <section data-section="children-privacy">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/15 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-sm font-bold">8</span>
                  Children's Privacy
                </h2>
                <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-5">
                  <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                    Our Platform is designed to be used by learners of all ages, including children. We are committed to complying with applicable children's privacy laws (such as COPPA). For users under 13, we require parental or guardian consent before collecting any personal information. We do not knowingly collect personal information from children under 13 without verifiable parental consent.
                  </p>
                  <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mt-3">
                    If you are a parent or guardian and believe we have collected information about your child without your consent, please contact us immediately so we can take appropriate action.
                  </p>
                </div>
              </section>

              <hr className="border-slate-100 dark:border-slate-700/50" />

              {/* Your Rights */}
              <section data-section="your-rights">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/15 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-sm font-bold">9</span>
                  Your Rights
                </h2>
                <div className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  <p className="mb-4">Depending on your location, you may have the following rights regarding your personal data:</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      { right: 'Access', desc: 'Request a copy of the personal data we hold about you.' },
                      { right: 'Rectification', desc: 'Request correction of inaccurate or incomplete data.' },
                      { right: 'Erasure', desc: 'Request deletion of your personal data.' },
                      { right: 'Portability', desc: 'Receive your data in a structured, machine-readable format.' },
                      { right: 'Restriction', desc: 'Request limitation of processing of your data.' },
                      { right: 'Objection', desc: 'Object to the processing of your personal data.' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3 bg-slate-50 dark:bg-slate-700/30 rounded-xl p-4 border border-slate-100 dark:border-slate-600/30">
                        <span className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/15 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xs font-bold shrink-0">
                          {item.right.charAt(0)}
                        </span>
                        <div>
                          <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{item.right}</h4>
                          <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4">
                    To exercise any of these rights, please contact us using the information provided below.
                  </p>
                </div>
              </section>

              <hr className="border-slate-100 dark:border-slate-700/50" />

              {/* Changes */}
              <section data-section="changes">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/15 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-sm font-bold">10</span>
                  Changes to This Policy
                </h2>
                <div className="text-slate-600 dark:text-slate-300 text-sm space-y-3 leading-relaxed">
                  <p>
                    We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top. Significant changes will be communicated through a notice on the Platform or via email.
                  </p>
                  <p>
                    You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
                  </p>
                </div>
              </section>

              <hr className="border-slate-100 dark:border-slate-700/50" />

              {/* Contact */}
              <section data-section="contact">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/15 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-sm font-bold">11</span>
                  Contact Us
                </h2>
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10 rounded-xl p-6 border border-indigo-100 dark:border-indigo-500/20">
                  <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-4">
                    If you have any questions or concerns about this Privacy Policy or our data practices, please reach out to us:
                  </p>
                  <div className="space-y-3">
                    <a href="mailto:privacy@codefortomorrow.org" className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400 font-medium text-sm hover:underline">
                      <Mail className="w-4 h-4" />
                      privacy@codefortomorrow.org
                    </a>
                    <a href="https://codefortomorrow.org" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400 font-medium text-sm hover:underline">
                      <ExternalLink className="w-4 h-4" />
                      codefortomorrow.org
                    </a>
                  </div>
                </div>
              </section>

            </div>
          </div>
        </main>
      </div>

      {/* Scroll to top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 md:bottom-8 md:right-8 w-10 h-10 rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 flex items-center justify-center hover:bg-indigo-700 transition-all active:scale-90 z-40"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default PrivacyPolicyScreen;
