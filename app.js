const translations = {
  en: {
    heroEyebrow: 'Stay healthy with natural soil care',
    heroTitle: 'Professional soil testing and biofertilizer support for Indian farmers.',
    heroDescription: 'Organo Farms brings science-backed soil analysis, crop recommendations, and farmer-friendly guidance for better yield.',
    heroAction1: 'Book Soil Testing',
    heroAction2: 'View Products',
    heroPanel1: 'Reduce chemical fertilizer cost',
    heroPanel2: 'Boost soil health incrementally',
    heroPanel3: 'Better crop output with smart advice',
    productsTitle: 'Our Biofertilizer Products',
    productsDescription: 'Three clean solutions to restore nutrients naturally and protect your crop health.',
    productAzotobacterTitle: 'Azotobacter',
    productAzotobacterDesc: 'Fixes atmospheric nitrogen to reduce urea and improve soil fertility.',
    productAzotobacter1: 'Fixes soil nitrogen naturally',
    productAzotobacter2: 'Strengthens root development',
    productAzotobacter3: 'Reduces chemical fertilizer need',
    productAzotobacter4: '100 ml per acre with irrigation',
    productPSBTitle: 'PSB',
    productPSBDesc: 'Solubilizes soil phosphorus for healthier plants and higher yield.',
    productPSB1: 'Releases bound phosphorus',
    productPSB2: 'Improves nutrient uptake',
    productPSB3: 'Supports stronger stems',
    productPSB4: '100 ml per acre with water',
    productKMBTitle: 'KMB',
    productKMBDesc: 'Mobilizes potassium in soil to build stronger crops and reduce disease.',
    productKMB1: 'Mobilizes fixed potassium',
    productKMB2: 'Builds crop strength',
    productKMB3: 'Improves disease resistance',
    productKMB4: '100 ml per acre via drip',
    benefitsTitle: 'Benefits for Farmers',
    benefitsDescription: 'Practical support that focuses on soil strength, yield, and cost control.',
    benefit1Title: 'Higher Yield',
    benefit1Desc: 'Better nutrient balance leads to stronger, more productive crops.',
    benefit2Title: 'Lower Cost',
    benefit2Desc: 'Use less chemical fertilizer and save on farming inputs.',
    benefit3Title: 'Healthier Soil',
    benefit3Desc: 'Microbial support restores soil biology and long-term fertility.',
    benefit4Title: 'Easier Farming',
    benefit4Desc: 'Simple application and clear recommendations for every farmer.',
    bookingTitle: 'Free Soil Testing Booking',
    bookingDescription: 'Schedule a free soil test and receive a farmer-friendly report.',
    labelFarmerName: 'Farmer Full Name',
    labelMobile: 'Mobile Number',
    labelVillage: 'Village',
    labelTaluka: 'Taluka',
    labelDistrict: 'District',
    labelCrop: 'Crop Name',
    labelSoilIssue: 'Soil Issue',
    bookingButton: 'Submit Booking',
    surveyTitle: 'Farmer Soil Health Survey',
    surveyDescription: 'Share your farm details so we can give better recommendations.',
    surveyQuestion1: '1. Which crop do you grow?',
    surveySelectCrop: 'Select a crop',
    cropSugarcane: 'Sugarcane',
    cropWheat: 'Wheat',
    cropRice: 'Rice',
    cropMaize: 'Maize',
    cropBajra: 'Bajra',
    cropJowar: 'Jowar',
    surveyQuestion2: '2. What is your current soil condition?',
    soilLowFertility: 'Low Fertility',
    soilSalinity: 'Salinity Problem',
    soilPoorGrowth: 'Poor Growth',
    soilGoodHealth: 'Good Soil Health',
    surveyQuestion3: '3. Do you use biofertilizers?',
    surveyYes: 'Yes',
    surveyNo: 'No',
    surveyQuestion4: '4. Which irrigation method do you use?',
    surveySelectIrrigation: 'Select irrigation',
    irrigationDrip: 'Drip Irrigation',
    irrigationFlood: 'Flood Irrigation',
    irrigationSprinkler: 'Sprinkler Irrigation',
    surveyProblemLabel: '5. Describe your farming problem',
    surveyButton: 'Submit Survey',
    submissionTitle: 'Sample Submission Address',
    submissionDescription: 'Send your soil sample to the nearest Organo Farms collection center.',
    submissionLine1: 'Collection Center:',
    submissionLine2: 'Address:',
    submissionLine3: 'Phone:',
    submissionLine4: 'Pack your soil sample in a clean container and deliver it at your earliest convenience.',
    adminLoginTitle: 'Admin Login',
    adminLoginDescription: 'Access dashboard controls for soil reports and farmer bookings.',
    adminUsernameLabel: 'Username',
    adminPasswordLabel: 'Password',
    adminLoginButton: 'Login',
    dashboardTitle: 'Admin Dashboard',
    dashboardDescription: 'Manage bookings, reports, and recommendations from a single panel.',
    adminLogout: 'Logout',
    statFarmers: 'Farmers',
    statBookings: 'Bookings',
    statReports: 'Soil Reports',
    bookingManagement: 'Booking Management',
    surveyManagement: 'Survey Responses',
    soilReportManagement: 'Soil Report Management',
    reportPreviewTitle: 'Soil Report Preview',
    adminWelcome: 'Welcome back, Admin',
    reportNoData: 'No report data available.',
    loginError: 'Invalid admin credentials.',
    bookingSuccess: 'Booking submitted successfully.',
    surveySuccess: 'Survey submitted successfully.',
    reportReady: 'Soil report is ready',
    reportAdvice: 'Soil looks low in nitrogen; recommend Azotobacter + PSB.',
  },
  mr: {
    heroEyebrow: 'नैसर्गिक माती काळजीने निरोगी शेती',
    heroTitle: 'भारतीय शेतकऱ्यांसाठी व्यावसायिक माती तपासणी आणि जैवखत मदत.',
    heroDescription: 'ऑर्गॅनो फार्म्स वैज्ञानिक माती विश्लेषण, पिकानुसार शिफारस आणि शेत�[...]'
  },
};

const defaultLanguage = 'en';
const languageSelect = document.getElementById('languageSelect');
const bookingForm = document.getElementById('bookingForm');
const surveyForm = document.getElementById('surveyForm');
const adminLoginForm = document.getElementById('adminLoginForm');
const adminDashboard = document.getElementById('adminDashboard');
const logoutAdminBtn = document.getElementById('logoutAdmin');
const toastEl = document.getElementById('toast');
const bookingList = document.getElementById('bookingList');
const surveyList = document.getElementById('surveyList');
const reportPreview = document.getElementById('reportPreview');
const statFarmers = document.getElementById('statFarmers');
const statBookings = document.getElementById('statBookings');
const statReports = document.getElementById('statReports');
const siteHeader = document.querySelector('.site-header');

let activeLanguage = defaultLanguage;
let bookingData = [];
let surveyData = [];
let reportData = [];
let lastScrollY = window.scrollY;
let headerRevealTimer;

function tr(key) {
  return translations[activeLanguage][key] || translations[defaultLanguage][key] || key;
}

function updateText() {
  document.querySelectorAll('[data-i18n]').forEach((node) => {
    const key = node.getAttribute('data-i18n');
    const text = tr(key);
    if (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA' || node.tagName === 'SELECT') {
      node.setAttribute('placeholder', text);
    } else if (node.tagName === 'LABEL' && node.querySelector('input, textarea, select')) {
      const textNode = Array.from(node.childNodes).find((child) => child.nodeType === Node.TEXT_NODE);
      if (textNode) textNode.textContent = `${text}\n              `;
    } else {
      node.textContent = text;
    }
  });
}

function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add('show');
  window.setTimeout(() => toastEl.classList.remove('show'), 3000);
}

function scrollToSection(event) {
  const target = event.target.closest('[data-scroll]');
  if (!target) return;
  const section = document.querySelector(target.dataset.scroll);
  if (section) section.scrollIntoView({ behavior: 'smooth' });
}

function handleHeaderVisibility() {
  if (!siteHeader) return;

  const currentY = window.scrollY;
  const atTop = currentY <= 24;
  const scrollingDown = currentY > lastScrollY;

  window.clearTimeout(headerRevealTimer);

  if (atTop) {
    siteHeader.classList.remove('header-hidden');
  } else if (scrollingDown) {
    siteHeader.classList.add('header-hidden');
  } else {
    siteHeader.classList.remove('header-hidden');
    headerRevealTimer = window.setTimeout(() => {
      if (window.scrollY > 24) siteHeader.classList.add('header-hidden');
    }, 1400);
  }

  lastScrollY = currentY;
}

function renderAdminStats() {
  statFarmers.textContent = bookingData.length;
  statBookings.textContent = bookingData.length;
  statReports.textContent = reportData.length;
}

function renderTable(container, rows, columns) {
  if (!rows.length) {
    container.innerHTML = `<p>${tr('reportNoData')}</p>`;
    return;
  }

  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const trHead = document.createElement('tr');

  columns.forEach((col) => {
    const th = document.createElement('th');
    th.textContent = col.label;
    trHead.appendChild(th);
  });
  thead.appendChild(trHead);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  rows.forEach((row) => {
    const tr = document.createElement('tr');
    columns.forEach((col) => {
      const td = document.createElement('td');
      td.textContent = row[col.key] || '-';
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  container.innerHTML = '';
  container.appendChild(table);
}

function renderReports() {
  reportPreview.innerHTML = '';

  if (!reportData.length) {
    const empty = document.createElement('p');
    empty.textContent = tr('reportNoData');
    reportPreview.appendChild(empty);
    return;
  }

  reportData.forEach((report, index) => {
    const card = document.createElement('div');
    card.className = 'report-item';
    card.innerHTML = `
      <h4>${tr('reportReady')} (${index + 1})</h4>
      <p><strong>${tr('submissionLine1')}</strong> ${report.farmerName}</p>
      <ul>
        <li>${tr('labelCrop')}: ${report.crop}</li>
        <li>${tr('labelSoilIssue')}: ${report.soilIssue}</li>
        <li>${tr('benefit3Title')}: ${report.analysis || tr('reportAdvice')}</li>
      </ul>
    `;
    reportPreview.appendChild(card);
  });
}

function bookingColumns() {
  return [
    { label: tr('labelFarmerName'), key: 'farmerName' },
    { label: tr('labelMobile'), key: 'mobile' },
    { label: tr('labelCrop'), key: 'crop' },
    { label: tr('labelDistrict'), key: 'district' },
  ];
}

function surveyColumns() {
  return [
    { label: tr('surveyQuestion1'), key: 'cropType' },
    { label: tr('surveyQuestion2'), key: 'soilCondition' },
    { label: tr('surveyQuestion3'), key: 'bioUse' },
  ];
}

function setLanguage(lang) {
  activeLanguage = translations[lang] ? lang : defaultLanguage;
  document.documentElement.lang = activeLanguage;
  languageSelect.value = activeLanguage;
  updateText();
  renderTable(bookingList, bookingData, bookingColumns());
  renderTable(surveyList, surveyData, surveyColumns());
  renderReports();
}

function processBooking(formData) {
  const booking = {
    farmerName: formData.get('farmerName'),
    mobile: formData.get('mobile'),
    village: formData.get('village'),
    taluka: formData.get('taluka'),
    district: formData.get('district'),
    crop: formData.get('crop'),
    soilIssue: formData.get('soilIssue'),
    createdAt: new Date().toLocaleString(),
  };
  bookingData.push(booking);
  reportData.push({ ...booking, analysis: tr('reportAdvice') });
  renderTable(bookingList, bookingData, bookingColumns());
  renderReports();
  renderAdminStats();
  showToast(tr('bookingSuccess'));
}

function processSurvey(formData) {
  const survey = {
    cropType: formData.get('cropType'),
    soilCondition: formData.get('soilCondition'),
    bioUse: formData.get('bioUse'),
    irrigation: formData.get('irrigation'),
    surveyProblem: formData.get('surveyProblem'),
    submittedAt: new Date().toLocaleString(),
  };
  surveyData.push(survey);
  renderTable(surveyList, surveyData, surveyColumns());
  showToast(tr('surveySuccess'));
}

function createBookingTable() {
  renderTable(bookingList, bookingData, bookingColumns());
}

function createSurveyTable() {
  renderTable(surveyList, surveyData, surveyColumns());
}

function handleAdminLogin(event) {
  event.preventDefault();
  const formData = new FormData(adminLoginForm);
  const username = formData.get('username');
  const password = formData.get('password');

  if (username === 'admin' && password === 'organo123') {
    adminLoginForm.classList.add('hidden');
    adminDashboard.classList.remove('hidden');
    showToast(tr('adminWelcome'));
    createBookingTable();
    createSurveyTable();
    renderReports();
    renderAdminStats();
  } else {
    showToast(tr('loginError'));
  }
}

function handleLogout() {
  adminLoginForm.classList.remove('hidden');
  adminDashboard.classList.add('hidden');
}

languageSelect.addEventListener('change', (event) => setLanguage(event.target.value));
bookingForm.addEventListener('submit', (event) => {
  event.preventDefault();
  processBooking(new FormData(bookingForm));
  bookingForm.reset();
});
surveyForm.addEventListener('submit', (event) => {
  event.preventDefault();
  processSurvey(new FormData(surveyForm));
  surveyForm.reset();
});
adminLoginForm.addEventListener('submit', handleAdminLogin);
logoutAdminBtn.addEventListener('click', handleLogout);

document.addEventListener('click', scrollToSection);
window.addEventListener('scroll', handleHeaderVisibility, { passive: true });
setLanguage(defaultLanguage);
