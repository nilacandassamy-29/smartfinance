export const schemes = {
 // --- SAVINGS SCHEMES ---
 sb: {
 id: 'sb',
 category: 'Savings',
 name: "Savings Account (SB)",
 risk: "Low",
 rate: "4.0% p.a.",
 interestRate: "4.0% p.a.",
 tenure: "Flexible",
 eligibility: "All Indian residents, minors with guardians, and HUFs. Requires basic KYC.",
 documents: "Aadhaar Card, PAN Card, Passport size photographs, Address proof.",
 benefits: "High liquidity, Instant access to funds, Debit card facilities, Safe and secure government/bank backing.",
 description: "A liquid capital storage account designed for daily liquidity and basic interest growth. Ideal for maintaining an emergency fund or managing daily transactions.",
 icon: 'Wallet',
 institutions: [
 { name: "State Bank of India (SBI)", type: "Public Sector Bank", contact: "1800 1234", website: "https://sbi.co.in" },
 { name: "HDFC Bank", type: "Private Bank", contact: "1800 202 6161", website: "https://hdfcbank.com" },
 { name: "ICICI Bank", type: "Private Bank", contact: "1800 1080", website: "https://icicibank.com" }
 ]
 },
 rd: {
 id: 'rd',
 category: 'Savings',
 name: "Recurring Deposit (RD)",
 risk: "Low",
 rate: "6.5% - 7.0% p.a.",
 interestRate: "6.5% - 7.0%",
 tenure: "6m - 10y",
 eligibility: "Individuals, joint accounts, and minors (via guardians). Suitable for disciplined savers.",
 documents: "Identity proof (Aadhaar/Voter ID), Address proof, Bank account details, PAN Card.",
 benefits: "Fixed returns unaffected by market, disciplines monthly saving habit, loan/overdraft facility available.",
 description: "A systematic monthly savings plan that allows you to deposit a fixed amount every month for a pre-determined tenure, yielding guaranteed returns.",
 icon: 'Landmark',
 institutions: [
 { name: "India Post", type: "Government Institution", contact: "1800 266 6868", website: "https://indiapost.gov.in" },
 { name: "Punjab National Bank", type: "Public Sector Bank", contact: "1800 180 2222", website: "https://www.pnbindia.in" },
 { name: "SBI", type: "Public Sector Bank", contact: "1800 1234", website: "https://sbi.co.in" }
 ]
 },
 td: {
 id: 'td',
 category: 'Savings',
 name: "Time Deposit (TD)",
 risk: "Low",
 rate: "6.9% - 7.5% p.a.",
 interestRate: "6.9% - 7.5%",
 tenure: "1y - 5y",
 eligibility: "Indian residents (Single or Joint), Trust funds, and Minors above 10 years.",
 documents: "Post Office KYC documents, Aadhaar Card, PAN Card, 2 Photographs.",
 benefits: "Sovereign guarantee (Post Office), Multiple tenure options (1-5 years), quarterly compounding.",
 description: "Post Office Time Deposits offer fixed interest rates and complete safety of capital with the backing of the Government of India.",
 icon: 'Clock',
 institutions: [
 { name: "India Post", type: "Government Institution", contact: "1800 266 6868", website: "https://indiapost.gov.in" }
 ]
 },
 fd: {
 id: 'fd',
 category: 'Savings',
 name: "Fixed Deposit (FD)",
 risk: "Low",
 rate: "7.2% - 8.0% p.a.",
 interestRate: "7.2% - 8.0%",
 tenure: "7d - 10y",
 eligibility: "Individuals, NRIs (NRE/NRO FD), HUF, and Senior Citizens (extra 0.5% interest).",
 documents: "PAN Card (Mandatory for > ₹50k), Identity and Address Proof, Bank account linkage.",
 benefits: "Highest interest among fixed income, flexible liquidity (partial withdrawal), tax-saving options (under 80C).",
 description: "A one-time deposit of a lump sum amount for a fixed period. It is the most popular choice for capital protection and steady income.",
 icon: 'ShieldCheck',
 institutions: [
 { name: "HDFC Bank", type: "Private Bank", contact: "1800 202 6161", website: "https://hdfcbank.com" },
 { name: "ICICI Bank", type: "Private Bank", contact: "1800 1080", website: "https://icicibank.com" },
 { name: "Axis Bank", type: "Private Bank", contact: "1860 419 5555", website: "https://www.axisbank.com" }
 ]
 },

 // --- GOVERNMENT SCHEMES ---
 ppf: {
 id: 'ppf',
 category: 'Government',
 name: "Public Provident Fund (PPF)",
 risk: "Very Low",
 rate: "7.1% p.a.",
 interestRate: "7.1%",
 tenure: "15y+",
 eligibility: "All Indian citizens. Only one account per person. Minors can open through parents.",
 documents: "Aadhaar Card, PAN Card, PPF Account Opening Form, Photographs.",
 benefits: "Triple tax benefit (EEE), 15-year tenure for long-term compounding, completely safe investment.",
 description: "A long-term retirement planning tool backed by the Government of India, offering compounding interest and excellent tax savings.",
 icon: 'ShieldCheck',
 institutions: [
 { name: "India Post", type: "Government Institution", contact: "1800 266 6868", website: "https://indiapost.gov.in" },
 { name: "SBI", type: "Public Sector Bank", contact: "1800 1234", website: "https://sbi.co.in" },
 { name: "ICICI Bank", type: "Private Bank", contact: "1800 1080", website: "https://icicibank.com" }
 ]
 },
 ssy: {
 id: 'ssy',
 category: 'Government',
 name: "Sukanya Samriddhi Yojana (SSY)",
 risk: "Very Low",
 rate: "8.2% p.a.",
 interestRate: "8.2%",
 tenure: "Up to 21y",
 eligibility: "Parents/Guardians of girl children below 10 years. Maximum 2 accounts per family.",
 documents: "Birth certificate of girl child, KYC documents of parent/guardian, Address proof.",
 benefits: "Higher interest rate than other savings, dedicated for higher education/marriage, tax-free returns.",
 description: "A small deposit scheme for the girl child launched as a part of the 'Beti Bachao Beti Padhao' campaign.",
 icon: 'Heart',
 institutions: [
 { name: "India Post", type: "Government Institution", contact: "1800 266 6868", website: "https://indiapost.gov.in" },
 { name: "Canara Bank", type: "Public Sector Bank", contact: "1800 425 0018", website: "https://www.canarabank.bank.in/" }
 ]
 },
 scss: {
 id: 'scss',
 category: 'Government',
 name: "Senior Citizen Savings Scheme (SCSS)",
 risk: "Very Low",
 rate: "8.2% p.a.",
 interestRate: "8.2%",
 tenure: "5y+",
 eligibility: "Individuals aged 60+ or retirees aged 55-60 (under VRS).",
 documents: "Retirement proof, KYC documents, PAN Card, Passport photographs.",
 benefits: "Regular quarterly income, sovereign guarantee, tax benefits under Section 80C.",
 description: "A government-backed savings instrument offering steady income and safety for senior citizens after retirement.",
 icon: 'UserCircle',
 institutions: [
 { name: "India Post", type: "Government Institution", contact: "1800 266 6868", website: "https://indiapost.gov.in" },
 { name: "SBI", type: "Public Sector Bank", contact: "1800 1234", website: "https://sbi.co.in" }
 ]
 },
 nps: {
 id: 'nps',
 category: 'Government',
 name: "National Pension System (NPS)",
 risk: "Low-Medium",
 rate: "9% - 12% p.a.",
 interestRate: "9% - 12%",
 tenure: "Up to age 70",
 eligibility: "All citizens between 18-70 years. Resident and Non-Resident Indians.",
 documents: "PRAN application form, Aadhaar, PAN, Bank account details, Photograph.",
 benefits: "Lowest cost pension product, extra ₹50k tax deduction (80CCD), portable across jobs and locations.",
 description: "A voluntary retirement savings scheme designed to provide social security and pension income after retirement.",
 icon: 'TrendingUp',
 institutions: [
 { name: "PFRDA", type: "Government Regulator", contact: "1800 110 708", website: "https://pfrda.org.in/" },
 { name: "HDFC Pension", type: "PFM", contact: "1800 202 6161", website: "https://hdfcpension.com" }
 ]
 },
 kvp: {
 id: 'kvp',
 category: 'Government',
 name: "Kisan Vikas Patra (KVP)",
 risk: "Very Low",
 rate: "7.5% p.a.",
 interestRate: "7.5%",
 tenure: "115 months",
 eligibility: "Any adult, joint accounts, or trust. Specifically designed for rural/farmer savings.",
 documents: "KVP Application Form, KYC documents, Address proof.",
 benefits: "Guaranteed doubling of money, transferable from one person to another, loan facility available.",
 description: "A certificate-based savings scheme that doubles your investment over a fixed period, offering absolute safety.",
 icon: 'FileText',
 institutions: [
 { name: "India Post", type: "Government Institution", contact: "1800 266 6868", website: "https://indiapost.gov.in" }
 ]
 },
 pmsby: {
 id: 'pmsby',
 category: 'Insurance',
 name: "PM Suraksha Bima Yojana (PMSBY)",
 risk: "Very Low",
 rate: "₹20/year",
 interestRate: "N/A",
 tenure: "Renewable Yearly",
 eligibility: "Individuals aged 18-70 years with a bank account.",
 documents: "Auto-debit consent form, Aadhaar linkage, Bank account details.",
 benefits: "₹2 Lakh accidental death/disability cover, extremely affordable, automatic renewal.",
 description: "A government-backed accidental insurance scheme providing financial security at a nominal cost.",
 icon: 'ShieldCheck',
 institutions: [
 { name: "All Nationalized Banks", type: "Public Sector", contact: "1800 180 1111", website: "https://jansuraksha.gov.in" }
 ]
 },
 pmjjby: {
 id: 'pmjjby',
 category: 'Insurance',
 name: "PM Jeevan Jyoti Bima Yojana (PMJJBY)",
 risk: "Very Low",
 rate: "₹436/year",
 interestRate: "N/A",
 tenure: "Renewable Yearly",
 eligibility: "Individuals aged 18-50 years with a bank account.",
 documents: "Auto-debit consent, Basic KYC, Bank account details.",
 benefits: "₹2 Lakh life insurance cover for any cause of death, simplified enrollment without medical checkup.",
 description: "A one-year life insurance scheme providing life cover to the poor and underprivileged at a low premium.",
 icon: 'HeartHandshake',
 institutions: [
 { name: "LIC of India", type: "Government Insurance", contact: "022 6827 6827", website: "https://licindia.in" },
 { name: "SBI Life", type: "Private Insurance", contact: "1800 267 9090", website: "https://sbilife.co.in" }
 ]
 },
 apy: {
 id: 'apy',
 category: 'Government',
 name: "Atal Pension Yojana (APY)",
 risk: "Very Low",
 rate: "₹1k-5k Pension",
 interestRate: "Fixed Pension",
 tenure: "Post retirement",
 eligibility: "Unorganized sector workers aged 18-40. Must not be an income tax payer.",
 documents: "APY registration form, Aadhaar Card, Bank account for auto-debit.",
 benefits: "Guaranteed minimum pension, government co-contribution (for eligible), pension to spouse after death.",
 description: "A pension scheme aimed at providing a steady income stream to workers in the unorganized sector post-retirement.",
 icon: 'Umbrella',
 institutions: [
 { name: "SBI", type: "Public Sector Bank", contact: "1800 1234", website: "https://sbi.co.in/web/personal-banking/investments-and-insurance/government-schemes/atal-pension-yojana" },
 { name: "HDFC Bank", type: "Private Bank", contact: "1800 202 6161", website: "https://www.hdfc.bank.in/social-security-schemes/atal-pension-yojana" },
 { name: "Canara Bank", type: "Public Sector Bank", contact: "1800 425 0018", website: "https://canarabank.in/User_page.aspx?menuid=1005" },
 { name: "Punjab National Bank", type: "Public Sector Bank", contact: "1800 180 2222", website: "https://www.pnbindia.in/atal-pension-yojana.html" },
 { name: "Bank of Baroda", type: "Public Sector Bank", contact: "1800 5700", website: "https://www.bankofbaroda.in/personal-banking/investments/government-scheme/atal-pension-yojana" },
 { name: "PFRDA", type: "Government Regulator", contact: "1800 110 708", website: "https://www.pfrda.org.in/index1.cshtml?lngId=27" }
 ]
 },
 'health-insurance': {
 id: 'health-insurance',
 category: 'Insurance',
 name: "Health Insurance (Mediclaim)",
 risk: "Low",
 rate: "Variable",
 interestRate: "N/A",
 tenure: "Flexible",
 eligibility: "Individuals/Families. Pre-policy medical checkup based on age/sum insured.",
 documents: "Previous medical history (if any), KYC documents, Age proof, Proposal form.",
 benefits: "Cashless hospitalization, covers surgery/diagnostics/ambulance, tax deduction under 80D.",
 description: "Insurance coverage that pays for medical and surgical expenses incurred by the insured during hospitalization.",
 icon: 'HeartPulse',
 institutions: [
 { name: "Star Health", type: "Private Insurance", contact: "1800 425 2255", website: "https://starhealth.in" },
 { name: "HDFC ERGO", type: "Private Insurance", contact: "1800 266 0341", website: "https://hdfcergo.com" },
 { name: "New India Assurance", type: "Public Insurance", contact: "1800 209 1415", website: "https://newindia.co.in" }
 ]
 },
 'life-insurance': {
 id: 'life-insurance',
 category: 'Insurance',
 name: "Life Insurance",
 risk: "Low",
 rate: "Variable",
 interestRate: "N/A",
 tenure: "Up to age 85",
 eligibility: "Any individual with earning capacity. Policy term depends on age.",
 documents: "Income proof (ITR/Salary), Medical reports, KYC documents, Age proof.",
 benefits: "Financial security for dependents, life cover (Sum Assured), maturity benefits (for endowment).",
 description: "A contract between an insurer and a policyholder where the insurer guarantees payment of a death benefit to named beneficiaries.",
 icon: 'Activity',
 institutions: [
 { name: "LIC of India", type: "Public Insurance", contact: "022 6827 6827", website: "https://licindia.in" },
 { name: "Max Life Insurance", type: "Private Insurance", contact: "1860 120 5577", website: "https://maxlifeinsurance.com" },
 { name: "Tata AIA", type: "Private Insurance", contact: "1860 266 9966", website: "https://tataaia.com" }
 ]
 },

 // --- INVESTMENT SCHEMES ---
 mutual: {
 id: 'mutual',
 category: 'Investments',
 name: "Mutual Funds (SIP)",
 risk: "Moderate to High",
 rate: "12% - 15% p.a.",
 interestRate: "12% - 15%",
 tenure: "Flexible",
 eligibility: "Everyone. Requires KYC (PAN & Aadhaar linkage to bank). Suitable for all goals.",
 documents: "PAN Card, Aadhaar Card, Bank account details, One-time KYC completion.",
 benefits: "Professional management, diversification, systematic investment (SIP), high potential for wealth creation.",
 description: "A pool of money managed by professionals that invests in stocks, bonds, or other securities to generate wealth over time.",
 icon: 'TrendingUp',
 institutions: [
 { name: "SBI Mutual Fund", type: "AMC", contact: "1800 209 3333", website: "https://sbimf.com" },
 { name: "HDFC Mutual Fund", type: "AMC", contact: "1800 3010 6767", website: "https://hdfcfund.com" },
 { name: "ICICI Prudential", type: "AMC", contact: "1800 222 999", website: "https://icicipruamc.com" }
 ]
 },
 sgb: {
 id: 'sgb',
 category: 'Investments',
 name: "Gold Bonds (SGB)",
 risk: "Low",
 rate: "2.5% + Capital gain",
 interestRate: "2.5% p.a.",
 tenure: "8y",
 eligibility: "Resident Indians, HUFs, Trusts, Universities, and Charitable Institutions.",
 documents: "PAN Card (Mandatory), Aadhaar Card, Bank account details.",
 benefits: "No making charges/storage risk, tax-free capital gains on maturity, fixed annual interest.",
 description: "Government securities denominated in grams of gold. They are a safe substitute for holding physical gold.",
 icon: 'Gem',
 institutions: [
 { name: "Reserve Bank of India (RBI)", type: "Central Bank", contact: "1800 1234", website: "https://rbi.org.in" }
 ]
 },
 stocks: {
 id: 'stocks',
 category: 'Investments',
 name: "Direct Equity (Stocks)",
 risk: "High",
 rate: "Variable",
 interestRate: "Market dependent",
 tenure: "Flexible",
 eligibility: "Requires a Demat and Trading account. Suitable for informed investors.",
 documents: "PAN, Aadhaar, Cancelled cheque, Photograph, Income proof (for F&O).",
 benefits: "Highest growth potential, dividend income, ownership in companies, high liquidity.",
 description: "Direct investment in shares of companies listed on stock exchanges like NSE and BSE.",
 icon: 'LineChart',
 institutions: [
 { name: "Zerodha", type: "Discount Broker", contact: "080 4718 1888", website: "https://zerodha.com" },
 { name: "Upstox", type: "Discount Broker", contact: "022 4179 2999", website: "https://upstox.com" },
 { name: "Angel One", type: "Full Service Broker", contact: "1800 1020", website: "https://angelone.in" }
 ]
 }
};
