import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Language } from '../../types';

export type Lang = 'en' | 'ar';

interface I18nContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

const I18nContext = createContext<I18nContextType>({
  lang: 'en',
  setLang: () => {},
  t: (key: string) => key,
  dir: 'ltr',
});

export const useI18n = () => useContext(I18nContext);

const translations: Record<string, Record<Lang, string>> = {
  // ── DashboardLayout: Navigation ──
  'nav.general': { en: 'General', ar: 'عام' },
  'nav.community': { en: 'Community', ar: 'المجتمع' },
  'nav.myDashboard': { en: 'My Dashboard', ar: 'لوحتي' },
  'nav.home': { en: 'Home', ar: 'الرئيسية' },
  'nav.aiRepos': { en: 'AI Repos', ar: 'مستودعات الذكاء الاصطناعي' },
  'nav.hackRepos': { en: 'Hack Repos', ar: 'مستودعات الهاك' },
  'nav.hotNow': { en: 'Hot Now', ar: 'الأكثر رواجاً' },
  'nav.goodFirstIssues': { en: 'Good First Issues', ar: 'مشاكل للمبتدئين' },
  'nav.topContributors': { en: 'Top Contributors', ar: 'أفضل المساهمين' },
  'nav.starterKits': { en: 'Starter Kits', ar: 'حزم البداية' },
  'nav.earnAndCode': { en: 'Earn & Code', ar: 'اكسب وبرمج' },
  'nav.mySaved': { en: 'My Saved', ar: 'المحفوظات' },
  'nav.backToMainApp': { en: '← Back to Main App', ar: '← العودة للتطبيق الرئيسي' },

  // ── DashboardLayout: Header ──
  'header.premium': { en: 'Premium', ar: 'بريميوم' },
  'header.followOnX': { en: 'Follow on X', ar: 'تابعنا على X' },
  'header.signIn': { en: 'Sign In', ar: 'تسجيل الدخول' },
  'header.logout': { en: 'Logout', ar: 'تسجيل الخروج' },

  // ── ProjectFeed ──
  'feed.title': { en: 'Trending Repos', ar: 'المستودعات الرائجة' },
  'feed.searchPlaceholder': { en: 'Search projects...', ar: 'ابحث عن مشاريع...' },
  'feed.allLanguages': { en: 'All Languages', ar: 'كل اللغات' },
  'feed.sort': { en: 'Sort', ar: 'ترتيب' },
  'feed.mostStars': { en: 'Most stars', ar: 'الأكثر نجوماً' },
  'feed.mostForks': { en: 'Most forks', ar: 'الأكثر تفريعاً' },
  'feed.recentlyUpdated': { en: 'Recently updated', ar: 'محدّث مؤخراً' },
  'feed.noResults': { en: 'No repositories match your search.', ar: 'لا توجد مستودعات تطابق بحثك.' },
  'feed.stars': { en: 'Stars', ar: 'نجوم' },
  'feed.forks': { en: 'Forks', ar: 'تفريعات' },
  'feed.share': { en: 'Share', ar: 'مشاركة' },
  'feed.legendary': { en: 'Legendary', ar: 'أسطوري' },
  'feed.popular': { en: 'Popular', ar: 'شائع' },
  'feed.rising': { en: 'Rising', ar: 'صاعد' },
  'feed.noDescription': { en: 'No description provided.', ar: 'لا يوجد وصف.' },

  // ── GoodFirstIssues ──
  'issues.title': { en: 'Good First Issues', ar: 'مشاكل مناسبة للمبتدئين' },
  'issues.subtitle': { en: 'Browse open issues labeled for beginners across active GitHub repositories.', ar: 'تصفح المشاكل المفتوحة المخصصة للمبتدئين في مستودعات GitHub النشطة.' },
  'issues.searchPlaceholder': { en: 'Search a topic or repository...', ar: 'ابحث عن موضوع أو مستودع...' },
  'issues.anyLanguage': { en: 'Any Language', ar: 'أي لغة' },
  'issues.mostComments': { en: 'Most comments', ar: 'الأكثر تعليقاً' },
  'issues.newest': { en: 'Newest', ar: 'الأحدث' },
  'issues.noResults': { en: 'No matching issues found.', ar: 'لم يتم العثور على مشاكل مطابقة.' },
  'issues.comments': { en: 'comments', ar: 'تعليقات' },
  'issues.noDescription': { en: 'No description available.', ar: 'لا يوجد وصف متاح.' },

  // ── Leaderboard ──
  'leaderboard.title': { en: 'Top Contributors', ar: 'أفضل المساهمين' },
  'leaderboard.subtitle': { en: 'Ranked by followers across the open source ecosystem. Filtering by', ar: 'مرتبون حسب المتابعين في منظومة المصدر المفتوح. التصفية حسب' },
  'leaderboard.searchCountry': { en: 'Search country...', ar: 'ابحث عن دولة...' },
  'leaderboard.arabWorld': { en: ' Arab World', ar: ' العالم العربي' },
  'leaderboard.europe': { en: ' Europe', ar: ' أوروبا' },
  'leaderboard.other': { en: ' Other', ar: ' أخرى' },
  'leaderboard.noCountries': { en: 'No countries found', ar: 'لم يتم العثور على دول' },
  'leaderboard.viewProfile': { en: 'View Profile', ar: 'عرض الملف' },
  'leaderboard.rank': { en: 'Rank', ar: 'الترتيب' },
  'leaderboard.noData': { en: 'No contributors found for this location.', ar: 'لم يتم العثور على مساهمين لهذا الموقع.' },

  // ── AIRepos ──
  'aiRepos.title': { en: 'AI Repositories', ar: 'مستودعات الذكاء الاصطناعي' },
  'aiRepos.subtitle': { en: 'Curated open-source AI & ML projects. Click to read the full article.', ar: 'مشاريع ذكاء اصطناعي وتعلم آلي مفتوحة المصدر. انقر لقراءة المقال الكامل.' },
  'aiRepos.searchPlaceholder': { en: 'Search AI repos...', ar: 'ابحث عن مستودعات الذكاء الاصطناعي...' },

  // ── HackRepos ──
  'hackRepos.title': { en: 'Hack Repos', ar: 'مستودعات الهاك' },
  'hackRepos.subtitle': { en: 'Essential open-source tools for ethical hacking & cybersecurity. Click to read the full article.', ar: 'أدوات مفتوحة المصدر أساسية للاختراق الأخلاقي والأمن السيبراني. انقر لقراءة المقال الكامل.' },
  'hackRepos.searchPlaceholder': { en: 'Search hack repos...', ar: 'ابحث عن مستودعات الهاك...' },
  'hackRepos.viewArticle': { en: 'View Article', ar: 'عرض المقال' },
  'hackRepos.viewOnGithub': { en: 'View on GitHub', ar: 'عرض على GitHub' },
  'hackRepos.noResults': { en: 'No repositories match your search.', ar: 'لا توجد مستودعات تطابق بحثك.' },

  // ── ResourcesHub ──
  'resources.title': { en: 'Resources Hub', ar: 'مركز الموارد' },
  'resources.subtitle': { en: 'A curated collection of essential tools, libraries, and frameworks powering the modern deep tech stack.', ar: 'مجموعة مختارة من الأدوات والمكتبات وأطر العمل الأساسية التي تدعم البنية التقنية الحديثة.' },
  'resources.frontend': { en: 'Frontend Ecosystem', ar: 'منظومة الواجهة الأمامية' },
  'resources.backend': { en: 'Backend & Infrastructure', ar: 'الخلفية والبنية التحتية' },
  'resources.design': { en: 'Design & UI/UX', ar: 'التصميم وتجربة المستخدم' },
  'resources.security': { en: 'Security & DevOps', ar: 'الأمان وDevOps' },

  // ── BountiesHub ──
  'bounties.title': { en: 'Earn & Code', ar: 'اكسب وبرمج' },
  'bounties.subtitle': { en: 'A quick guide to open source bounties, hackathon opportunities, and paid issues.', ar: 'دليل سريع لمكافآت المصدر المفتوح وفرص الهاكاثون والمشاكل المدفوعة.' },
  'bounties.topPlatforms': { en: 'Top platforms to find paid work', ar: 'أفضل المنصات للعمل المدفوع' },
  'bounties.gitcoin': { en: 'discover grants and bounty projects supported by open source sponsors.', ar: 'اكتشف المنح ومشاريع المكافآت المدعومة من رعاة المصدر المفتوح.' },
  'bounties.issuehunt': { en: 'earn rewards by fixing issues in active repositories.', ar: 'اكسب مكافآت بإصلاح المشاكل في المستودعات النشطة.' },
  'bounties.bountysource': { en: 'browse open source issues that offer cash prizes.', ar: 'تصفح مشاكل المصدر المفتوح التي تقدم جوائز نقدية.' },
  'bounties.hackathons': { en: 'join competitions that pay for winning or sponsoring contributions.', ar: 'شارك في المسابقات التي تدفع مقابل الفوز أو رعاية المساهمات.' },
  'bounties.maximizePayout': { en: 'How to maximize your payout', ar: 'كيف تزيد أرباحك' },
  'bounties.tip1': { en: 'Focus on repos with active maintainers and clear contribution guidelines.', ar: 'ركز على المستودعات التي لديها مشرفين نشطين وإرشادات مساهمة واضحة.' },
  'bounties.tip2': { en: 'Submit small, high-quality PRs first to establish trust before taking larger issues.', ar: 'قدّم طلبات سحب صغيرة وعالية الجودة أولاً لبناء الثقة قبل تناول مشاكل أكبر.' },
  'bounties.tip3': { en: 'Keep your profile updated and link previous open source work.', ar: 'حدّث ملفك الشخصي واربط أعمالك السابقة في المصدر المفتوح.' },
  'bounties.tip4': { en: 'Use issue filters like', ar: 'استخدم فلاتر المشاكل مثل' },

  // ── MySaved ──
  'saved.title': { en: 'My Saved Repositories', ar: 'المستودعات المحفوظة' },
  'saved.loading': { en: 'Loading...', ar: 'جاري التحميل...' },
  'saved.empty': { en: 'No saved repositories yet.', ar: 'لا توجد مستودعات محفوظة بعد.' },

  // ── RepoDetails ──
  'details.back': { en: '← Back to Feed', ar: '← العودة للقائمة' },
  'details.readme': { en: 'README', ar: 'اقرأني' },
  'details.readArticle': { en: 'Read Article', ar: 'اقرأ المقال' },
  'details.viewOnGithub': { en: 'View on GitHub', ar: 'عرض على GitHub' },
  'details.aiBeginnerGuide': { en: 'AI Beginner Guide', ar: 'دليل الذكاء الاصطناعي للمبتدئين' },
  'details.fullReadme': { en: 'Full README', ar: 'ملف README الكامل' },
  'details.share': { en: 'Share', ar: 'مشاركة' },
  'details.save': { en: 'Save', ar: 'حفظ' },
  'details.saved': { en: 'Saved', ar: 'تم الحفظ' },
  'details.generatingGuide': { en: 'AI is generating a beginner-friendly setup guide...', ar: 'يقوم الذكاء الاصطناعي بإنشاء دليل إعداد مبسط للمبتدئين...' },
  'details.noReadme': { en: 'No README found for this repository.', ar: 'لم يتم العثور على ملف README لهذا المستودع.' },
  'details.failedFetchGuide': { en: 'Failed to fetch AI Setup Guide', ar: 'فشل في جلب دليل إعداد الذكاء الاصطناعي' },
  'details.failedFetchReadme': { en: 'Failed to fetch README', ar: 'فشل في جلب ملف README' },
  'details.errorGuide': { en: 'An error occurred while fetching the setup guide.', ar: 'حدث خطأ أثناء جلب دليل الإعداد.' },
  'details.errorReadme': { en: 'An error occurred while fetching the documentation.', ar: 'حدث خطأ أثناء جلب الوثائق.' },
  'details.shareTitle': { en: 'Share Repository', ar: 'مشاركة المستودع' },
  'details.copyLink': { en: 'Copy Link', ar: 'نسخ الرابط' },
  'details.copy': { en: 'Copy', ar: 'نسخ' },
};

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  let globalLangContext: any;
  try {
    globalLangContext = useLanguage();
  } catch (e) {
    // Ignore error if used outside provider (e.g. in tests)
  }
  const currentLanguage = globalLangContext ? globalLangContext.language : undefined;

  const [lang, setLangState] = useState<Lang>(() => {
    if (currentLanguage === Language.AR) return 'ar';
    const saved = localStorage.getItem('cftos-lang');
    return (saved === 'ar' || saved === 'en') ? saved : 'en';
  });

  // Sync state if global language changes
  useEffect(() => {
    if (currentLanguage) {
      setLangState(currentLanguage === Language.AR ? 'ar' : 'en');
    }
  }, [currentLanguage]);

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem('cftos-lang', newLang);
    if (globalLangContext) {
      globalLangContext.setLanguage(newLang === 'ar' ? Language.AR : Language.EN);
    }
  };

  const t = (key: string): string => {
    return translations[key]?.[lang] || key;
  };

  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  // Apply direction to the CFTOS container
  useEffect(() => {
    const cftosRoot = document.getElementById('cftos-root');
    if (cftosRoot) {
      cftosRoot.dir = dir;
      if (lang === 'ar') {
        cftosRoot.style.fontFamily = "'Cairo', 'Inter', system-ui, sans-serif";
      } else {
        cftosRoot.style.fontFamily = '';
      }
    }
  }, [lang, dir]);

  return (
    <I18nContext.Provider value={{ lang, setLang, t, dir }}>
      {children}
    </I18nContext.Provider>
  );
};
