import { Shield, Lock, Bug, Wifi, Terminal, Database, Globe, Cpu } from 'lucide-react';
import { RepoData } from './aiReposData';

export const HACK_REPOS_DATA: RepoData[] = [
  {
    id: 1, slug: 'payloadsallthethings', name: 'PayloadsAllTheThings', full_name: 'swisskyrepo/PayloadsAllTheThings',
    description: 'Useful payloads and bypass for Web Application Security and Pentest/CTF.',
    description_ar: 'حمولة مفيدة وتجاوزات لأمان تطبيقات الويب واختبار الاختراق/CTF.',
    stargazers_count: 63000, forks_count: 14800, language: 'Python',
    html_url: 'https://github.com/swisskyrepo/PayloadsAllTheThings',
    category: 'Web Security', icon: Globe, topics: ['payloads', 'pentesting', 'web-security'],
    owner: { avatar_url: 'https://avatars.githubusercontent.com/u/11music?v=4' },
    article: { title: 'PayloadsAllTheThings: The Ultimate Security Cheat Sheet', readTime: '5 min read', date: 'May', sections: [
      { heading: 'What is It?', content: 'PayloadsAllTheThings is a massive community-maintained collection of security payloads, techniques, and bypasses. It covers SQL Injection, XSS, SSRF, XXE, and dozens more vulnerability classes.\n\nThink of it as a living encyclopedia for penetration testers — constantly updated with new techniques.' },
      { heading: 'How to Use It', content: 'Clone the repo: git clone https://github.com/swisskyrepo/PayloadsAllTheThings\n\nBrowse by vulnerability type. Each folder contains:\n- README with methodology and explanation\n- Payload files organized by technique\n- Bypass techniques for WAFs\n- Intruder lists for Burp Suite\n\nUse during CTFs, bug bounties, or security audits. Copy payloads directly into your testing tools.' },
      { heading: 'What You Will Find', content: 'SQL Injection payloads for MySQL, PostgreSQL, MSSQL, Oracle. XSS payloads including filter bypass and CSP bypass. SSRF techniques for cloud metadata, internal scanning. File inclusion (LFI/RFI) with log poisoning. Command injection for Linux and Windows. WAF bypass for Cloudflare, AWS WAF, Akamai.' },
      { heading: 'Practice Safely', content: 'Set up DVWA, WebGoat, or HackTheBox to practice. Never test on systems without authorization. Use these payloads to understand how vulnerabilities work, then learn how to defend against them. Understanding the attack is the first step to building secure applications.' },
    ]}
  },
  {
    id: 2, slug: 'metasploit', name: 'metasploit-framework', full_name: 'rapid7/metasploit-framework',
    description: 'The world\'s most used penetration testing framework.',
    description_ar: 'إطار عمل اختبار الاختراق الأكثر استخداماً في العالم.',
    stargazers_count: 34500, forks_count: 14200, language: 'Ruby',
    html_url: 'https://github.com/rapid7/metasploit-framework',
    category: 'Exploitation', icon: Bug, topics: ['metasploit', 'exploit', 'pentest'],
    owner: { avatar_url: 'https://avatars.githubusercontent.com/u/509878?v=4' },
    article: { title: 'Metasploit: Professional Penetration Testing', readTime: '6 min read', date: 'May', sections: [
      { heading: 'What is Metasploit?', content: 'Metasploit is the industry-standard penetration testing framework with 2,300+ exploits and 500+ payloads. Used by security professionals worldwide to find vulnerabilities and validate defenses.' },
      { heading: 'How to Use It', content: 'Install via Kali Linux (pre-installed) or: curl https://raw.githubusercontent.com/rapid7/metasploit-omnibus/master/config/templates/metasploit-framework-wrappers/msfupdate.erb > msfinstall && chmod 755 msfinstall && ./msfinstall\n\nBasic workflow:\nmsfconsole (start the console)\nsearch type:exploit name:apache (find exploits)\nuse exploit/multi/http/apache_mod_cgi_bash_env_exec\nset RHOSTS target_ip\nset PAYLOAD linux/x86/meterpreter/reverse_tcp\nexploit\n\nAlways use on authorized targets only.' },
      { heading: 'Key Components', content: 'Exploits target specific vulnerabilities. Payloads define post-exploitation actions. Auxiliary modules handle scanning and fuzzing. Post modules for privilege escalation. Meterpreter gives you an advanced shell on compromised systems.' },
      { heading: 'Learning Path', content: 'Start with Metasploitable VM for safe practice. Learn msfconsole basics. Study the module database. Progress to writing your own modules in Ruby. Try HackTheBox and TryHackMe challenges.' },
    ]}
  },
  {
    id: 3, slug: 'nmap', name: 'nmap', full_name: 'nmap/nmap',
    description: 'Nmap — the Network Mapper for discovery and security auditing.',
    description_ar: 'Nmap — مخطط الشبكة لاكتشاف الأجهزة وفحص الأمان.',
    stargazers_count: 10500, forks_count: 2400, language: 'C',
    html_url: 'https://github.com/nmap/nmap',
    category: 'Network', icon: Wifi, topics: ['network-scanner', 'security-audit', 'reconnaissance'],
    owner: { avatar_url: 'https://avatars.githubusercontent.com/u/63385?v=4' },
    article: { title: 'Nmap: The Network Mapper Every Hacker Needs', readTime: '5 min read', date: 'May', sections: [
      { heading: 'What is Nmap?', content: 'Nmap is the gold standard for network discovery and security auditing. It discovers hosts, services, operating systems, and vulnerabilities across entire networks in seconds.' },
      { heading: 'How to Use It', content: 'Install: apt install nmap (Linux) or download from nmap.org\n\nEssential commands:\nnmap target_ip (basic scan)\nnmap -sV target_ip (version detection)\nnmap -O target_ip (OS fingerprinting)\nnmap -sC target_ip (default NSE scripts)\nnmap -A target_ip (aggressive — all above)\nnmap --script vuln target_ip (vulnerability scan)\nnmap -p 1-65535 target_ip (all ports)\n\nStart simple, add flags as needed.' },
      { heading: 'NSE Scripts', content: 'The Nmap Scripting Engine has 600+ scripts. Categories include: auth (authentication testing), brute (brute force), vuln (vulnerability detection), discovery (network discovery), exploit (active exploitation).\n\nRun specific scripts: nmap --script http-enum target_ip\nRun categories: nmap --script "vuln and safe" target_ip' },
      { heading: 'Projects and Practice', content: 'Scan your home network to understand what is exposed. Map out network topology. Identify unnecessary open services. Practice on HackTheBox or TryHackMe labs. Build a network monitoring dashboard using Nmap output.' },
    ]}
  },
  {
    id: 4, slug: 'owasp-wstg', name: 'OWASP Testing Guide', full_name: 'OWASP/wstg',
    description: 'The comprehensive guide to testing web application security.',
    description_ar: 'الدليل الشامل لاختبار أمان تطبيقات الويب.',
    stargazers_count: 7400, forks_count: 1500, language: 'Markdown',
    html_url: 'https://github.com/OWASP/wstg',
    category: 'Web Security', icon: Shield, topics: ['owasp', 'security-testing', 'guide'],
    owner: { avatar_url: 'https://avatars.githubusercontent.com/u/5765908?v=4' },
    article: { title: 'OWASP Testing Guide: The Bible of Web Security', readTime: '5 min read', date: 'May', sections: [
      { heading: 'What is OWASP WSTG?', content: 'The OWASP Web Security Testing Guide is the most comprehensive, peer-reviewed guide for testing web application security. It provides methodology that security testers worldwide rely on.\n\nCovers everything from information gathering to business logic testing.' },
      { heading: 'How to Use It', content: 'Read online at owasp.org/www-project-web-security-testing-guide or clone the repo for offline access.\n\nFollow the testing methodology chapter by chapter:\n1. Information Gathering — fingerprint the target\n2. Configuration Testing — check misconfigurations\n3. Identity Management — test auth flows\n4. Input Validation — SQL injection, XSS, etc.\n5. Error Handling — information leakage\n6. Cryptography — weak encryption\n\nEach test has: description, objectives, how to test, and remediation.' },
      { heading: 'For Developers', content: 'Understanding how attackers test your application helps you build secure code from the start. Each test case includes the vulnerability, how to find it, and how to fix it. It bridges the gap between development and security teams.' },
      { heading: 'Complementary Tools', content: 'Use alongside OWASP ZAP (automated scanner), Burp Suite (manual testing), and OWASP Top 10 (risk awareness). Together they form a complete web security toolkit.' },
    ]}
  },
  {
    id: 5, slug: 'sqlmap', name: 'sqlmap', full_name: 'sqlmapproject/sqlmap',
    description: 'Automatic SQL injection and database takeover tool.',
    description_ar: 'أداة تلقائية لحقن SQL والسيطرة على قواعد البيانات.',
    stargazers_count: 33000, forks_count: 5700, language: 'Python',
    html_url: 'https://github.com/sqlmapproject/sqlmap',
    category: 'Database', icon: Database, topics: ['sql-injection', 'database-security', 'automation'],
    owner: { avatar_url: 'https://avatars.githubusercontent.com/u/735926?v=4' },
    article: { title: 'SQLMap: Automated SQL Injection Testing', readTime: '5 min read', date: 'May', sections: [
      { heading: 'What is SQLMap?', content: 'SQLMap is the most powerful tool for detecting and exploiting SQL injection. It automates detection to data extraction, supporting MySQL, PostgreSQL, Oracle, MSSQL, SQLite, and more.' },
      { heading: 'How to Use It', content: 'Install: pip install sqlmap (or clone from GitHub)\n\nBasic usage:\nsqlmap -u "http://target.com/page?id=1" (test a URL)\nsqlmap -u "http://target.com/page?id=1" --dbs (list databases)\nsqlmap -u "http://target.com/page?id=1" -D dbname --tables (list tables)\nsqlmap -u "http://target.com/page?id=1" -D dbname -T users --dump (extract data)\n\nAdvanced: sqlmap -r request.txt (use saved HTTP request from Burp)' },
      { heading: 'Detection Techniques', content: 'Boolean-based blind injection. Error-based injection. UNION query injection. Stacked queries. Time-based blind injection. Each technique is tried automatically. Supports tamper scripts to bypass WAFs.' },
      { heading: 'Defensive Lessons', content: 'Understanding SQL injection helps you prevent it. Always use parameterized queries. Never concatenate user input into SQL. Use an ORM. Implement least-privilege database accounts. Regular security testing with tools like SQLMap catches issues early.' },
    ]}
  },
  {
    id: 6, slug: 'burp-extensions', name: 'Burp Extensions', full_name: 'snoopysecurity/awesome-burp-extensions',
    description: 'Curated list of amazing Burp Extensions for web security testing.',
    description_ar: 'قائمة مختارة من إضافات Burp الرائعة لاختبار أمان الويب.',
    stargazers_count: 3200, forks_count: 680, language: 'Markdown',
    html_url: 'https://github.com/snoopysecurity/awesome-burp-extensions',
    category: 'Web Security', icon: Globe, topics: ['burp-suite', 'extensions', 'web-proxy'],
    owner: { avatar_url: 'https://avatars.githubusercontent.com/u/15834932?v=4' },
    article: { title: 'Awesome Burp Extensions: Supercharge Web Testing', readTime: '4 min read', date: 'May', sections: [
      { heading: 'What is This?', content: 'Burp Suite is the standard web app security testing tool. This repo curates the best community extensions that add powerful capabilities beyond the defaults.' },
      { heading: 'How to Use It', content: 'Install Burp Suite Community Edition (free) from portswigger.net.\nOpen Extender > BApp Store in Burp.\nBrowse and install with one click.\n\nTop must-install extensions:\n- Autorize — test authorization automatically\n- Logger++ — enhanced request logging\n- Param Miner — discover hidden parameters\n- Turbo Intruder — high-speed attacks\n- Retire.js — find vulnerable JS libraries\n- HUNT — spot common vuln patterns' },
      { heading: 'Workflow Tips', content: 'Set up Burp as your browser proxy. Browse the target application normally. Burp captures all requests. Use Spider to map the application. Run Scanner for automated testing. Use Intruder for parameter fuzzing. Check Logger++ for interesting responses.' },
      { heading: 'Getting Started', content: 'Start with Burp Academy (free labs). Practice on DVWA and WebGoat. Install Logger++ and Autorize first. Learn the Repeater and Intruder tools. Progress to writing custom extensions in Java or Python.' },
    ]}
  },
  {
    id: 7, slug: 'john-the-ripper', name: 'John the Ripper', full_name: 'openwall/john',
    description: 'Advanced offline password cracker supporting hundreds of hash types.',
    description_ar: 'برنامج متقدم لكسر كلمات المرور دون اتصال يدعم مئات أنواع التجزئة.',
    stargazers_count: 10800, forks_count: 2400, language: 'C',
    html_url: 'https://github.com/openwall/john',
    category: 'Cryptography', icon: Lock, topics: ['password-cracker', 'hash', 'cryptography'],
    owner: { avatar_url: 'https://avatars.githubusercontent.com/u/287092?v=4' },
    article: { title: 'John the Ripper: Password Security Analysis', readTime: '5 min read', date: 'May', sections: [
      { heading: 'What is John the Ripper?', content: 'JtR is one of the most well-known password auditing tools. It cracks password hashes using dictionary attacks, brute force, and rule-based mutations. Supports 300+ hash types from Unix crypt to bcrypt.' },
      { heading: 'How to Use It', content: 'Install: apt install john (Linux) or build from source.\n\nBasic workflow:\njohn --wordlist=rockyou.txt hashes.txt (dictionary attack)\njohn --incremental hashes.txt (brute force)\njohn --show hashes.txt (show cracked passwords)\n\nIdentify hash type: john --list=formats | grep -i md5\nUse rules: john --wordlist=rockyou.txt --rules hashes.txt\n\nThe rockyou.txt wordlist is the standard starting point.' },
      { heading: 'Attack Modes', content: 'Single mode — uses login info and variations. Wordlist mode — tests from dictionary files with mangling rules. Incremental mode — brute-force with configurable character sets. External mode — custom algorithms. Markov mode — statistical smart brute-force.' },
      { heading: 'Defensive Value', content: 'Organizations use JtR to audit password policies, find weak passwords before attackers do, and validate hashing algorithms. If John can crack it, so can an attacker. Use it to enforce stronger passwords and better hashing.' },
    ]}
  },
  {
    id: 8, slug: 'ghidra', name: 'Ghidra', full_name: 'NationalSecurityAgency/ghidra',
    description: 'Software reverse engineering framework by NSA.',
    description_ar: 'إطار عمل الهندسة العكسية للبرمجيات من وكالة الأمن القومي (NSA).',
    stargazers_count: 53000, forks_count: 5900, language: 'Java',
    html_url: 'https://github.com/NationalSecurityAgency/ghidra',
    category: 'Reverse Engineering', icon: Cpu, topics: ['reverse-engineering', 'decompiler', 'binary-analysis'],
    owner: { avatar_url: 'https://avatars.githubusercontent.com/u/311093?v=4' },
    article: { title: 'Ghidra: NSA\'s Reverse Engineering Powerhouse', readTime: '6 min read', date: 'May', sections: [
      { heading: 'What is Ghidra?', content: 'Ghidra is a free, open-source reverse engineering suite by the NSA. It analyzes compiled code across 20+ architectures. Released in 2019, it rivals the $2,500 IDA Pro.' },
      { heading: 'How to Use It', content: 'Download from ghidra-sre.org. Requires Java 17+.\nExtract and run: ./ghidraRun\n\nWorkflow:\n1. Create a new project\n2. Import a binary (File > Import File)\n3. Auto-analyze when prompted (accept defaults)\n4. Browse the disassembly in the Listing window\n5. Check the Decompiler window for C-like pseudocode\n6. Use the Symbol Tree to navigate functions\n7. Rename variables and add comments as you understand the code' },
      { heading: 'Key Features', content: 'Disassembly and decompilation to C pseudocode. x86, ARM, MIPS, PowerPC support. Graph-based control flow visualization. Scripting in Java and Python. Collaborative analysis. Version tracking for binary diffs. Built-in debugger.' },
      { heading: 'Practice', content: 'Start with CrackMe challenges from crackmes.one. Try reverse engineering simple C programs you compiled yourself. Work through CTF reversing challenges. Analyze open-source malware samples from MalwareBazaar (in a VM!).' },
    ]}
  },
  {
    id: 9, slug: 'katoolin', name: 'Kali Linux Tools', full_name: 'LionSec/katoolin',
    description: 'Install Kali Linux tools on any Debian-based distro.',
    description_ar: 'تثبيت أدوات Kali Linux على أي توزيعة مبنية على Debian.',
    stargazers_count: 2400, forks_count: 510, language: 'Python',
    html_url: 'https://github.com/LionSec/katoolin',
    category: 'Toolkit', icon: Terminal, topics: ['kali-linux', 'security-tools', 'automation'],
    owner: { avatar_url: 'https://avatars.githubusercontent.com/u/8225154?v=4' },
    article: { title: 'Katoolin: Kali Tools on Any Linux Distro', readTime: '4 min read', date: 'May', sections: [
      { heading: 'What is Katoolin?', content: 'Katoolin installs Kali\'s 300+ security tools on any Debian-based distribution (Ubuntu, Mint, etc.) without switching your OS. It adds Kali repositories and provides a menu-driven installer.' },
      { heading: 'How to Use It', content: 'Install:\ngit clone https://github.com/LionSec/katoolin\ncd katoolin\nsudo python3 katoolin.py\n\nThe menu shows categories:\n1) Add Kali repositories\n2) View categories\n3) Install specific tools\n4) Install everything\n\nSelect a category, then pick individual tools or install all. Recommended: install only what you need to keep your system clean.' },
      { heading: 'Tool Categories', content: 'Information Gathering — Nmap, Maltego, Recon-ng. Vulnerability Analysis — OpenVAS, Nikto. Web Application — Burp, ZAP, SQLMap. Password Attacks — John, Hashcat, Hydra. Wireless — Aircrack-ng, Kismet. Exploitation — Metasploit, BeEF. Sniffing — Wireshark, Ettercap.' },
      { heading: 'When to Use It', content: 'You want specific Kali tools without a full Kali install. You prefer your current desktop but need security tools. Setting up a custom testing environment. Always use tools responsibly and only on authorized systems.' },
    ]}
  },
];
