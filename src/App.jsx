import React, { useState, useMemo } from 'react';
import {
  LayoutGrid,
  Inbox,
  Kanban,
  Users,
  Clock,
  Package,
  BarChart2,
  Settings,
  Search,
  Plus,
  Check,
  X,
  ArrowUpDown,
  Filter,
  ExternalLink,
  Copy,
  FileText,
  Phone,
  MapPin,
  AtSign,
  Hash,
  Calendar,
  CreditCard,
  Truck,
  AlertCircle,
  ChevronLeft,
  ChevronDown,
  SlidersHorizontal,
  Send,
  RefreshCw,
  ShoppingBag,
  User,
  DollarSign,
  Percent,
  Layers,
  MessageSquare,
  CheckSquare,
  Square,
  MoreHorizontal,
  ArrowLeft,
  Printer,
  QrCode
} from 'lucide-react';

// ==========================================
// توابع کمکی اعداد فارسی و فرمت مبالغ (Tabular)
// ==========================================
const toPersianDigits = (val) => {
  if (val === null || val === undefined) return '';
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(val).replace(/\d/g, (d) => persianDigits[parseInt(d, 10)]);
};

const toEnglishDigits = (str) => {
  if (!str) return '';
  return String(str)
    .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
    .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
};

const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return '۰';
  const isNegative = amount < 0;
  const absVal = Math.abs(Math.round(amount));
  const formatted = absVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '،');
  return isNegative ? `${toPersianDigits(formatted)}-` : toPersianDigits(formatted);
};

// ==========================================
// پیکربندی مراحل پایپ‌لاین (Attio Status Pattern)
// فقط یک نقطه ۶ پیکسلی رنگ معنایی دارد؛ پس‌زمینه کاملاً خنثی است
// ==========================================
const PIPELINE_STAGES = [
  { id: 'new_order', label: 'سفارش جدید', dot: '#2563EB' },
  { id: 'awaiting_response', label: 'در انتظار پاسخ', dot: '#D97706' },
  { id: 'order_confirmation', label: 'تایید سفارش', dot: '#71717A' },
  { id: 'awaiting_payment', label: 'در انتظار پرداخت', dot: '#D97706' },
  { id: 'completed', label: 'تکمیل‌شده', dot: '#059669' },
  { id: 'cancelled', label: 'لغوشده', dot: '#DC2626' }
];

const STAGE_MAP = PIPELINE_STAGES.reduce((acc, s) => {
  acc[s.id] = s;
  return acc;
}, {});

// کامپوننت سلول وضعیت به سبک Attio CRM
function StatusChip({ dotColor = '#71717A', label }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded-[4px] bg-[#F4F4F5] border border-[#E6E6E9] text-[11px] font-medium text-[#141416] whitespace-nowrap">
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ backgroundColor: dotColor }}
      />
      <span>{label}</span>
    </span>
  );
}

// ==========================================
// داده‌های اولیه منطبق با پرونده تحقیقاتی «شمع نورا»
// ==========================================
const INITIAL_PRODUCTS = [
  {
    id: 'p1',
    sku: 'NRA-400',
    name: 'شمع بزرگ ۴۰۰ گرمی (دو فتیله‌ای)',
    category: 'مدل ثابت',
    scentDefault: 'وانیل و چوب صندل',
    waxGrams: 400,
    jarCost: 85000,
    essenceAndWickCost: 78000,
    packagingAndLaborCost: 40000,
    price: 420000, // قیمت فعلی که منجر به ۲۳،۰۰۰ تومان ضرر خالص در هر شمع شده
    suggestedPrice: 650000
  },
  {
    id: 'p2',
    sku: 'NRA-200',
    name: 'شمع کوچک ۲۰۰ گرمی (کلاسیک)',
    category: 'مدل ثابت',
    scentDefault: 'دارچین و قهوه',
    waxGrams: 200,
    jarCost: 22000,
    essenceAndWickCost: 13000,
    packagingAndLaborCost: 10000,
    price: 260000,
    suggestedPrice: 290000
  },
  {
    id: 'p3',
    sku: 'NRA-GIFT',
    name: 'ست هدیه دو تایی (شمع + عود دست‌ساز)',
    category: 'باکس هدیه',
    scentDefault: 'اسطوخودوس و بهارنارنج',
    waxGrams: 250,
    jarCost: 65000,
    essenceAndWickCost: 55000,
    packagingAndLaborCost: 40000,
    price: 490000,
    suggestedPrice: 520000
  }
];

const INITIAL_CUSTOMERS = [
  {
    id: 'CUST-101',
    name: 'تینا صادقی',
    instagram: '@tina_7_s',
    phone: '09123456789',
    city: 'تهران',
    address: 'تهران، سعادت‌آباد، بالاتر از میدان کاج، خیابان ۱۲، پلاک ۳۴، واحد ۸',
    postalCode: '1998765432',
    favoriteScent: 'دارچین و قهوه',
    totalOrders: 4,
    totalSpending: 2450000,
    lastInteraction: '۱۰ دقیقه پیش',
    daysSinceLastOrder: 42,
    status: 'نیاز به یادآوری',
    statusDot: '#D97706',
    followUpDate: '۱۴۰۵/۰۶/۲۵',
    assignedTo: 'نورا',
    notes: 'مشتری وفادار؛ همیشه بسته‌بندی کادویی سفارش می‌دهد.',
    interactions: [
      { date: '۱۴۰۵/۰۶/۱۸', text: 'ارسال پیام در دایرکت برای سفارش مجدد ست هدیه' },
      { date: '۱۴۰۵/۰۵/۰۲', text: 'ثبت سفارش شمع کوچک دارچین و ارسال کد رهگیری پستی' }
    ]
  },
  {
    id: 'CUST-102',
    name: 'سارا محمدی',
    instagram: '@sara.mohammadi',
    phone: '09121112233',
    city: 'شیراز',
    address: 'شیراز، خیابان قصرالدشت، کوچه ۱۲، پلاک ۸، واحد ۳',
    postalCode: '7193654321',
    favoriteScent: 'اسطوخودوس و بهارنارنج',
    totalOrders: 3,
    totalSpending: 3890000,
    lastInteraction: '۱ ساعت پیش',
    daysSinceLastOrder: 5,
    status: 'مشتری وفادار',
    statusDot: '#059669',
    followUpDate: '۱۴۰۵/۰۷/۱۵',
    assignedTo: 'نورا',
    notes: 'خرید ست هدیه سه عددی با ارسال رایگان.',
    interactions: [
      { date: '۱۴۰۵/۰۶/۱۴', text: 'تایید خودکار فیش واریزی توسط OCR و ثبت در پایپ‌لاین' }
    ]
  },
  {
    id: 'CUST-103',
    name: 'پریسا ملکی',
    instagram: '@parisa.maleki',
    phone: '09352221199',
    city: 'اصفهان',
    address: 'اصفهان، خیابان چهارباغ بالا، مجتمع پارک، طبقه ۲، واحد ۱۰۴',
    postalCode: '8165432198',
    favoriteScent: 'وانیل و چوب صندل',
    totalOrders: 2,
    totalSpending: 1040000,
    lastInteraction: 'دیروز',
    daysSinceLastOrder: 48,
    status: 'نیاز به یادآوری',
    statusDot: '#D97706',
    followUpDate: '۱۴۰۵/۰۶/۲۰',
    assignedTo: 'نورا',
    notes: 'حساس به زمان ارسال؛ کد رهگیری سریع پیامک شود.',
    interactions: [
      { date: '۱۴۰۵/۰۵/۰۱', text: 'ارسال مرسوله پستی با کد رهگیری ۲۴۸۹۱۰۴۹۵۸۲۷۱۶۴۰۰۹۱۲' }
    ]
  },
  {
    id: 'CUST-104',
    name: 'مهسا جعفری',
    instagram: '@mahsa_jafari_art',
    phone: '09129998877',
    city: 'تهران',
    address: 'تهران، خیابان شریعتی، نرسیده به تجریش، کوچه مهر، پلاک ۹',
    postalCode: '1934567891',
    favoriteScent: 'وانیل و چوب صندل',
    totalOrders: 5,
    totalSpending: 4120000,
    lastInteraction: '۲۰ دقیقه پیش',
    daysSinceLastOrder: 38,
    status: 'مشتری وفادار',
    statusDot: '#059669',
    followUpDate: '۱۴۰۵/۰۶/۲۸',
    assignedTo: 'نورا',
    notes: 'علاقه‌مند به شمع‌های بزرگ ۴۰۰ گرمی دو فتیله‌ای.',
    interactions: [
      { date: '۱۴۰۵/۰۶/۱۸', text: 'ثبت سفارش ۲ عدد شمع بزرگ ۴۰۰ گرمی از طریق دایرکت' }
    ]
  },
  {
    id: 'CUST-105',
    name: 'الهام کریمی',
    instagram: '@elham.karimi88',
    phone: '09361112233',
    city: 'کرج',
    address: 'کرج، عظیمیه، بلوار شریعتی، کوچه نسترن، پلاک ۲۲، واحد ۵',
    postalCode: '3155678901',
    favoriteScent: 'دارچین و قهوه',
    totalOrders: 1,
    totalSpending: 1010000,
    lastInteraction: '۳ ساعت پیش',
    daysSinceLastOrder: 2,
    status: 'مشتری جدید',
    statusDot: '#2563EB',
    followUpDate: '۱۴۰۵/۰۷/۲۰',
    assignedTo: 'نورا',
    notes: 'سفارش کادوی تولد با کارت تبریک سفارشی.',
    interactions: [
      { date: '۱۴۰۵/۰۶/۱۷', text: 'ورود اطلاعات از طریق لینک ویترین ۱ دقیقه‌ای' }
    ]
  }
];

const INITIAL_ORDERS = [
  {
    id: 'ORD-1092',
    customerId: 'CUST-104',
    customerName: 'مهسا جعفری',
    instagram: '@mahsa_jafari_art',
    phone: '09129998877',
    address: 'تهران، خیابان شریعتی، نرسیده به تجریش، کوچه مهر، پلاک ۹',
    postalCode: '1934567891',
    items: [{ productId: 'p1', count: 2, note: 'رایحه وانیل و صندل - لیبل تبریک تولد' }],
    stage: 'new_order',
    paymentStatus: 'فیش تایید شده (OCR)',
    receiptRef: '۸۳۹۲۰۱',
    lastInteraction: '۱۰ دقیقه پیش',
    assignedTo: 'نورا',
    source: 'استخراج AI دایرکت',
    trackingCode: '',
    notes: 'ارسال فوری برای فردا صبح هماهنگ شود.'
  },
  {
    id: 'ORD-1091',
    customerId: 'CUST-101',
    customerName: 'تینا صادقی',
    instagram: '@tina_7_s',
    phone: '09123456789',
    address: 'تهران، سعادت‌آباد، بالاتر از میدان کاج، خیابان ۱۲، پلاک ۳۴، واحد ۸',
    postalCode: '1998765432',
    items: [
      { productId: 'p2', count: 2, note: 'رایحه دارچین برای هدیه' },
      { productId: 'p1', count: 1, note: 'رایحه وانیل' }
    ],
    stage: 'order_confirmation',
    paymentStatus: 'پرداخت آنلاین ویترین',
    receiptRef: '۹۹۴۱۲۰',
    lastInteraction: '۱ ساعت پیش',
    assignedTo: 'نورا',
    source: 'ویترین ۱ دقیقه‌ای',
    trackingCode: '',
    notes: 'بسته‌بندی کادویی انجام شد؛ آماده تحویل به پست.'
  },
  {
    id: 'ORD-1090',
    customerId: 'CUST-105',
    customerName: 'الهام کریمی',
    instagram: '@elham.karimi88',
    phone: '09361112233',
    address: 'کرج، عظیمیه، بلوار شریعتی، کوچه نسترن، پلاک ۲۲، واحد ۵',
    postalCode: '3155678901',
    items: [
      { productId: 'p3', count: 1, note: 'کارت: تولدت مبارک مریم جان' },
      { productId: 'p2', count: 2, note: 'رایحه دارچین' }
    ],
    stage: 'awaiting_payment',
    paymentStatus: 'در انتظار بررسی فیش',
    receiptRef: '۹۱۲۸۳۷',
    lastInteraction: '۲ ساعت پیش',
    assignedTo: 'نورا',
    source: 'استخراج AI دایرکت',
    trackingCode: '',
    notes: 'تصویر فیش پایا ارسال شده و نیاز به تایید نهایی دارد.'
  },
  {
    id: 'ORD-1089',
    customerId: 'CUST-102',
    customerName: 'سارا محمدی',
    instagram: '@sara.mohammadi',
    phone: '09121112233',
    address: 'شیراز، خیابان قصرالدشت، کوچه ۱۲، پلاک ۸، واحد ۳',
    postalCode: '7193654321',
    items: [{ productId: 'p3', count: 3, note: 'بسته‌بندی ویژه' }],
    stage: 'awaiting_response',
    paymentStatus: 'فیش تایید شده (OCR)',
    receiptRef: '۴۸۲۹۱۰',
    lastInteraction: '۳ ساعت پیش',
    assignedTo: 'نورا',
    source: 'ویترین ۱ دقیقه‌ای',
    trackingCode: '',
    notes: 'سوال در مورد تغییر رایحه یکی از ست‌ها.'
  },
  {
    id: 'ORD-1088',
    customerId: 'CUST-103',
    customerName: 'پریسا ملکی',
    instagram: '@parisa.maleki',
    phone: '09352221199',
    address: 'اصفهان، خیابان چهارباغ بالا، مجتمع پارک، طبقه ۲، واحد ۱۰۴',
    postalCode: '8165432198',
    items: [{ productId: 'p2', count: 2, note: 'رایحه قهوه' }],
    stage: 'completed',
    paymentStatus: 'پرداخت آنلاین ویترین',
    receiptRef: '۷۷۱۲۰۴',
    lastInteraction: 'دیروز',
    assignedTo: 'نورا',
    source: 'ویترین ۱ دقیقه‌ای',
    trackingCode: '24891049582716400912',
    notes: 'کد رهگیری پستی به صورت خودکار پیامک شد.'
  }
];

const INBOX_THREADS = [
  {
    id: 'MSG-01',
    senderName: 'مینا رادمرد',
    instagram: '@mina_rad_design',
    time: '۴ دقیقه پیش',
    unread: true,
    tag: 'فینگلیش + فیش واریزی',
    rawText: `salam azizam خسته نباشید 2ta sham bozorg 400g ba rayehe vanil mikham.
esmam Mina Radmard tel 09124456677
adres: tehran shahrak gharb فاز ۲ خیابان هرمزان کوچه چهارم پلاک ۱۴ واحد ۶
کدپستی 1466789111
مبلغ ۸۴۰ تومن کارت به کارت کردم پیگیری 773829`,
    extracted: {
      customerName: 'مینا رادمرد',
      instagram: '@mina_rad_design',
      phone: '09124456677',
      city: 'تهران',
      address: 'تهران، شهرک غرب، فاز ۲، خیابان هرمزان، کوچه چهارم، پلاک ۱۴، واحد ۶',
      postalCode: '1466789111',
      productId: 'p1',
      count: 2,
      note: 'رایحه وانیل (برگردان خودکار از فینگلیش)',
      receiptRef: '۷۷۳۸۲۹',
      receiptVerified: true
    }
  },
  {
    id: 'MSG-02',
    senderName: 'نگین موسوی',
    instagram: '@negin.mousavi.art',
    time: '۲۵ دقیقه پیش',
    unread: true,
    tag: 'سفارش چندآیتمی',
    rawText: `سلام وقت بخیر نورا جان، نگین موسوی هستم.
یه دونه ست هدیه دو تایی می‌خواستم با رایحه اسطوخودوس برای کادو تولد.
آدرسم: تهران، یوسف‌آباد، خیابان فتحی شقاقی، پلاک ۴۸، واحد ۱۲. کد پستی ۱۴۳۳۶۷۸۹۱۱
شماره تماس: ۰۹۱۲۸۸۸۴۴۳۳
مبلغ ۴۹۰,۰۰۰ تومان واریز شد شماره پیگیری ۶۶۱۹۰۲.`,
    extracted: {
      customerName: 'نگین موسوی',
      instagram: '@negin.mousavi.art',
      phone: '09128884433',
      city: 'تهران',
      address: 'تهران، یوسف‌آباد، خیابان فتحی شقاقی، پلاک ۴۸، واحد ۱۲',
      postalCode: '1433678911',
      productId: 'p3',
      count: 1,
      note: 'رایحه اسطوخودوس - کادو تولد',
      receiptRef: '۶۶۱۹۰۲',
      receiptVerified: true
    }
  },
  {
    id: 'MSG-03',
    senderName: 'تینا صادقی',
    instagram: '@tina_7_s',
    time: '۱ ساعت پیش',
    unread: false,
    tag: 'مشتری قبلی (فراخوانی از CRM)',
    rawText: `سلام عزیزم تینا صادقی هستم شماره ۰۹۱۲۳۴۵۶۷۸۹.
دو تا ست هدیه دو تایی می‌خوام با همون رایحه دارچین همیشگی. بفرستید به همون آدرس قبلیم توی سعادت‌آباد!
فیش ۹۸۰ هزار تومانی رو فرستادم کد پیگیری ۵۵۴۴۳۳.`,
    extracted: {
      customerName: 'تینا صادقی',
      instagram: '@tina_7_s',
      phone: '09123456789',
      city: 'تهران',
      address: 'تهران، سعادت‌آباد، بالاتر از میدان کاج، خیابان ۱۲، پلاک ۳۴، واحد ۸',
      postalCode: '1998765432',
      productId: 'p3',
      count: 2,
      note: 'رایحه دارچین و قهوه (فراخوانی خودکار آدرس از پرونده CRM)',
      receiptRef: '۵۵۴۴۳۳',
      receiptVerified: true
    }
  }
];

const INITIAL_FOLLOW_UPS = [
  {
    id: 'FLW-01',
    customerId: 'CUST-101',
    customerName: 'تینا صادقی',
    instagram: '@tina_7_s',
    phone: '09123456789',
    category: 'overdue',
    reason: 'پایان چرخه مصرف ۴۰ روزه شمع دارچین',
    daysElapsed: 42,
    dueDate: 'امروز',
    estimatedValue: 520000,
    status: 'pending'
  },
  {
    id: 'FLW-02',
    customerId: 'CUST-103',
    customerName: 'پریسا ملکی',
    instagram: '@parisa.maleki',
    phone: '09352221199',
    category: 'overdue',
    reason: '۴۸ روز از آخرین خرید شمع ۲۰۰ گرمی گذشته',
    daysElapsed: 48,
    dueDate: '۲ روز پیش',
    estimatedValue: 520000,
    status: 'pending'
  },
  {
    id: 'FLW-03',
    customerId: 'CUST-104',
    customerName: 'مهسا جعفری',
    instagram: '@mahsa_jafari_art',
    phone: '09129998877',
    category: 'upcoming',
    reason: 'یادآوری شارژ مجدد شمع وانیل و صندل (چرخه ۴۵ روزه)',
    daysElapsed: 38,
    dueDate: '۷ روز دیگر',
    estimatedValue: 650000,
    status: 'pending'
  }
];

export default function App() {
  // ==========================================
  // Stateهای اصلی محیط کاربری
  // ==========================================
  const [workspaceMode, setWorkspaceMode] = useState('crm'); // 'crm' | 'storefront'
  const [activeNav, setActiveNav] = useState('overview'); // 'overview' | 'inbox' | 'pipeline' | 'customers' | 'followups' | 'products' | 'analytics' | 'settings'
  const [globalSearch, setGlobalSearch] = useState('');

  // داده‌های زنده
  const [waxPricePerKg, setWaxPricePerKg] = useState(600000); // ۶۰۰،۰۰۰ تومان (۲۰٪ تورم موم سویا)
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [inboxThreads, setInboxThreads] = useState(INBOX_THREADS);
  const [followUps, setFollowUps] = useState(INITIAL_FOLLOW_UPS);
  const [activityLog, setActivityLog] = useState([
    { id: 'a1', time: '۱۰ دقیقه پیش', text: 'استخراج خودکار سفارش ORD-1092 از دایرکت @mahsa_jafari_art' },
    { id: 'a2', time: '۱ ساعت پیش', text: 'تایید پرداخت آنلاین ORD-1091 از طریق لینک ویترین' },
    { id: 'a3', time: 'دیروز', text: 'ارسال خودکار پیامک کد رهگیری پستی برای پریسا ملکی' }
  ]);

  // پنل بازرسی رکورد در سمت چپ (Attio Record Inspector Drawer)
  const [inspectedRecord, setInspectedRecord] = useState({
    type: 'order', // 'order' | 'customer' | null
    id: 'ORD-1092'
  });

  // وضعیت‌های صفحه پایپ‌لاین و مشتریان
  const [pipelineView, setPipelineView] = useState('table'); // 'table' | 'kanban'
  const [pipelineStageFilter, setPipelineStageFilter] = useState('all');
  const [customerStatusFilter, setCustomerStatusFilter] = useState('all');
  const [customerSortBy, setCustomerSortBy] = useState('spending'); // 'spending' | 'orders'
  const [selectedOrderRows, setSelectedOrderRows] = useState([]);

  // وضعیت‌های صفحه صندوق ورودی (Inbox & AI Parser)
  const [selectedThreadId, setSelectedThreadId] = useState('MSG-01');
  const [customDmText, setCustomDmText] = useState('');
  const [isCustomDmMode, setIsCustomDmMode] = useState(false);

  // فیلدهای موقت در پنل Inspector
  const [trackingInput, setTrackingInput] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // وضعیت‌های ویترین ۱ دقیقه‌ای مشتری
  const [storefrontPhone, setStorefrontPhone] = useState('');
  const [recognizedBuyer, setRecognizedBuyer] = useState(null);
  const [buyerName, setBuyerName] = useState('');
  const [buyerInsta, setBuyerInsta] = useState('');
  const [buyerAddress, setBuyerAddress] = useState('');
  const [buyerPostal, setBuyerPostal] = useState('');
  const [storefrontCart, setStorefrontCart] = useState({ p1: 1, p2: 0, p3: 0 });
  const [storefrontScent, setStorefrontScent] = useState('وانیل و چوب صندل');
  const [storefrontSubmitted, setStorefrontSubmitted] = useState(null);

  const notify = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  const logActivity = (text) => {
    setActivityLog((prev) => [{ id: `act-${Date.now()}`, time: 'همین الان', text }, ...prev]);
  };

  // ==========================================
  // محاسبات زنده بهای تمام‌شده (COGS) و حاشیه سود
  // ==========================================
  const computedProducts = useMemo(() => {
    return products.map((p) => {
      const waxCost = Math.round((p.waxGrams / 1000) * waxPricePerKg);
      const otherCosts = p.jarCost + p.essenceAndWickCost + p.packagingAndLaborCost;
      const totalCogs = waxCost + otherCosts;
      const netProfit = p.price - totalCogs;
      const marginPct = p.price > 0 ? Math.round((netProfit / p.price) * 1000) / 10 : 0;
      const isLoss = netProfit < 0;
      return {
        ...p,
        waxCost,
        otherCosts,
        totalCogs,
        netProfit,
        marginPct,
        isLoss
      };
    });
  }, [products, waxPricePerKg]);

  const computedOrders = useMemo(() => {
    return orders.map((o) => {
      let totalValue = 0;
      let totalCogs = 0;
      let hasLossItem = false;

      const detailedItems = o.items.map((it) => {
        const prod = computedProducts.find((p) => p.id === it.productId) || computedProducts[0];
        const lineValue = prod.price * it.count;
        const lineCogs = prod.totalCogs * it.count;
        const lineProfit = lineValue - lineCogs;
        if (lineProfit < 0) hasLossItem = true;
        totalValue += lineValue;
        totalCogs += lineCogs;
        return {
          ...it,
          productName: prod.name,
          sku: prod.sku,
          unitPrice: prod.price,
          lineValue,
          lineCogs,
          lineProfit
        };
      });

      const netProfit = totalValue - totalCogs;
      const marginPct = totalValue > 0 ? Math.round((netProfit / totalValue) * 100) : 0;
      const primaryProductLabel =
        detailedItems.length === 1
          ? `${toPersianDigits(detailedItems[0].count)}× ${detailedItems[0].productName}`
          : `${toPersianDigits(detailedItems[0].count)}× ${detailedItems[0].productName} (+${toPersianDigits(detailedItems.length - 1)})`;

      return {
        ...o,
        detailedItems,
        primaryProductLabel,
        totalValue,
        totalCogs,
        netProfit,
        marginPct,
        hasLossItem
      };
    });
  }, [orders, computedProducts]);

  // خلاصه شاخص‌های عملیاتی برای Overview
  const operationalMetrics = useMemo(() => {
    const requiringAttention = computedOrders.filter(
      (o) => o.stage === 'new_order' || o.stage === 'awaiting_payment' || o.hasLossItem
    ).length;
    const awaitingResponse = computedOrders.filter((o) => o.stage === 'awaiting_response').length;
    const pendingPayment = computedOrders.filter((o) => o.stage === 'awaiting_payment').length;
    const completedCount = computedOrders.filter((o) => o.stage === 'completed').length;
    const totalSales = computedOrders.reduce((s, o) => s + o.totalValue, 0);
    const totalNetProfit = computedOrders.reduce((s, o) => s + o.netProfit, 0);
    const lossProduct = computedProducts.find((p) => p.isLoss);

    return {
      requiringAttention,
      awaitingResponse,
      pendingPayment,
      completedCount,
      totalSales,
      totalNetProfit,
      lossProduct
    };
  }, [computedOrders, computedProducts]);

  // رکوردهای بازرسی‌شده فعلی در پنل سمت چپ
  const activeInspectedOrder = useMemo(() => {
    if (inspectedRecord?.type !== 'order') return null;
    return computedOrders.find((o) => o.id === inspectedRecord.id) || null;
  }, [inspectedRecord, computedOrders]);

  const activeInspectedCustomer = useMemo(() => {
    if (inspectedRecord?.type !== 'customer') return null;
    return customers.find((c) => c.id === inspectedRecord.id) || null;
  }, [inspectedRecord, customers]);

  // ==========================================
  // اکشن‌های عملیاتی CRM
  // ==========================================
  const handleFixProductPrice = (productId, newPrice) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, price: newPrice } : p))
    );
    logActivity(`اصلاح قیمت محصول به ${formatCurrency(newPrice)} تومان (توقف ضرر خالص)`);
    notify(`قیمت محصول به ${formatCurrency(newPrice)} تومان بروزرسانی شد.`);
  };

  const handleUpdateOrderStage = (orderId, newStage) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, stage: newStage, lastInteraction: 'همین الان' } : o
      )
    );
    const stLabel = STAGE_MAP[newStage]?.label || newStage;
    logActivity(`تغییر وضعیت سفارش ${orderId} به «${stLabel}»`);
    notify(`وضعیت سفارش ${toPersianDigits(orderId)} به «${stLabel}» تغییر یافت.`);
  };

  const handleVerifyOrderReceipt = (orderId) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              stage: 'order_confirmation',
              paymentStatus: 'فیش تایید شده (OCR)',
              lastInteraction: 'همین الان'
            }
          : o
      )
    );
    logActivity(`تایید فیش واریزی سفارش ${orderId}`);
    notify(`فیش واریزی سفارش ${toPersianDigits(orderId)} تایید شد.`);
  };

  const handleAssignTrackingCode = (orderId, customCode) => {
    const code =
      customCode?.trim() ||
      '248910' + Math.floor(10000000000000 + Math.random() * 89999999999999).toString();
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              stage: 'completed',
              trackingCode: code,
              lastInteraction: 'همین الان'
            }
          : o
      )
    );
    setTrackingInput('');
    logActivity(`ثبت بارکد پستی ${toPersianDigits(code)} برای ${orderId} و ارسال خودکار پیامک`);
    notify(`کد رهگیری پستی ثبت و پیامک اطلاع‌رسانی برای مشتری ارسال شد.`);
  };

  const handleCreateOrderFromInbox = (extractedData, threadId) => {
    const newId = `ORD-${1093 + orders.length}`;
    const newOrder = {
      id: newId,
      customerId: `CUST-${106 + customers.length}`,
      customerName: extractedData.customerName,
      instagram: extractedData.instagram,
      phone: extractedData.phone,
      address: extractedData.address,
      postalCode: extractedData.postalCode,
      items: [
        {
          productId: extractedData.productId,
          count: Number(extractedData.count) || 1,
          note: extractedData.note
        }
      ],
      stage: 'new_order',
      paymentStatus: 'فیش تایید شده (OCR)',
      receiptRef: extractedData.receiptRef || '۷۷۳۸۲۹',
      lastInteraction: 'همین الان',
      assignedTo: 'نورا',
      source: 'استخراج AI دایرکت',
      trackingCode: '',
      notes: 'ایجاد شده به صورت خودکار از صندوق ورودی دایرکت'
    };

    setOrders((prev) => [newOrder, ...prev]);

    // بروزرسانی یا افزودن مشتری در جدول Customers
    const prod = computedProducts.find((p) => p.id === extractedData.productId) || computedProducts[0];
    const orderAmount = prod.price * (Number(extractedData.count) || 1);

    setCustomers((prev) => {
      const idx = prev.findIndex(
        (c) => toEnglishDigits(c.phone) === toEnglishDigits(extractedData.phone)
      );
      if (idx > -1) {
        const copy = [...prev];
        copy[idx] = {
          ...copy[idx],
          totalOrders: copy[idx].totalOrders + 1,
          totalSpending: copy[idx].totalSpending + orderAmount,
          lastInteraction: 'همین الان',
          daysSinceLastOrder: 0,
          status: 'مشتری وفادار',
          statusDot: '#059669'
        };
        return copy;
      }
      return [
        {
          id: newOrder.customerId,
          name: extractedData.customerName,
          instagram: extractedData.instagram,
          phone: extractedData.phone,
          city: extractedData.city || 'تهران',
          address: extractedData.address,
          postalCode: extractedData.postalCode,
          favoriteScent: prod.scentDefault,
          totalOrders: 1,
          totalSpending: orderAmount,
          lastInteraction: 'همین الان',
          daysSinceLastOrder: 0,
          status: 'مشتری جدید',
          statusDot: '#2563EB',
          followUpDate: '۱۴۰۵/۰۷/۲۵',
          assignedTo: 'نورا',
          notes: 'اضافه شده به صورت خودکار از طریق پردازش پیام دایرکت',
          interactions: [{ date: 'امروز', text: `ثبت سفارش ${newId} از طریق استخراج هوشمند دایرکت` }]
        },
        ...prev
      ];
    });

    if (threadId) {
      setInboxThreads((prev) =>
        prev.map((t) => (t.id === threadId ? { ...t, unread: false } : t))
      );
    }

    setInspectedRecord({ type: 'order', id: newId });
    logActivity(`تبدیل پیام دایرکت ${extractedData.instagram} به رکورد سفارش ${newId}`);
    notify(`رکورد سفارش ${toPersianDigits(newId)} در پایپ‌لاین فروش ایجاد شد.`);
  };

  // پردازش متن سفارشی در صندوق ورودی
  const parsedCustomDm = useMemo(() => {
    if (!customDmText.trim()) return null;
    const norm = toEnglishDigits(customDmText);
    const phoneMatch = norm.match(/09\d{9}/);
    const postalMatch = norm.match(/\b\d{10}\b/);
    const instaMatch = norm.match(/@[a-zA-Z0-9_.]+/);
    const existingCust = phoneMatch
      ? customers.find((c) => toEnglishDigits(c.phone) === phoneMatch[0])
      : null;

    return {
      customerName: existingCust ? existingCust.name : 'خریدار دایرکت اینستاگرام',
      instagram: existingCust ? existingCust.instagram : instaMatch ? instaMatch[0] : '@insta_customer',
      phone: phoneMatch ? phoneMatch[0] : '09123334455',
      city: existingCust ? existingCust.city : 'تهران',
      address: existingCust ? existingCust.address : customDmText.slice(0, 75),
      postalCode: postalMatch ? postalMatch[0] : existingCust?.postalCode || '1456789012',
      productId: norm.includes('کوچک') || norm.includes('200') ? 'p2' : 'p1',
      count: norm.includes('2') || norm.includes('دو') ? 2 : 1,
      note: 'استخراج خودکار از متن دایرکت',
      receiptRef: '۸۸۴۱۲۰',
      receiptVerified: true
    };
  }, [customDmText, customers]);

  // ==========================================
  // منطق ویترین ۱ دقیقه‌ای مشتری (Auto-Fill)
  // ==========================================
  const handleStorefrontPhoneInput = (val) => {
    const clean = toEnglishDigits(val).replace(/[^0-9]/g, '').slice(0, 11);
    setStorefrontPhone(clean);
    if (clean.length === 11) {
      const found = customers.find((c) => toEnglishDigits(c.phone) === clean);
      if (found) {
        setRecognizedBuyer(found);
        setBuyerName(found.name);
        setBuyerInsta(found.instagram);
        setBuyerAddress(found.address);
        setBuyerPostal(found.postalCode);
        setStorefrontScent(found.favoriteScent);
        notify(`اطلاعات آدرس و کد پستی «${found.name}» به صورت خودکار فراخوانی شد.`);
      } else {
        setRecognizedBuyer(null);
      }
    } else {
      setRecognizedBuyer(null);
    }
  };

  const handleSubmitStorefrontOrder = (e) => {
    e.preventDefault();
    const items = Object.entries(storefrontCart)
      .filter(([, count]) => count > 0)
      .map(([productId, count]) => ({
        productId,
        count,
        note: `رایحه: ${storefrontScent}`
      }));

    if (items.length === 0 || !buyerName.trim() || !buyerAddress.trim()) {
      notify('لطفاً محصول و آدرس پستی را وارد نمایید.');
      return;
    }

    const newId = `ORD-${1093 + orders.length}`;
    const newOrder = {
      id: newId,
      customerId: recognizedBuyer ? recognizedBuyer.id : `CUST-${106 + customers.length}`,
      customerName: buyerName,
      instagram: buyerInsta || '@storefront_buyer',
      phone: storefrontPhone || '09120001122',
      address: buyerAddress,
      postalCode: buyerPostal || '۱۹۹۸۷۶۵۴۳۲',
      items,
      stage: 'new_order',
      paymentStatus: 'پرداخت آنلاین ویترین',
      receiptRef: toPersianDigits(Math.floor(100000 + Math.random() * 899999)),
      lastInteraction: 'همین الان',
      assignedTo: 'نورا',
      source: 'ویترین ۱ دقیقه‌ای',
      trackingCode: '',
      notes: 'ثبت شده توسط مشتری از طریق لینک بایو بدون فیلترشکن'
    };

    setOrders((prev) => [newOrder, ...prev]);
    setStorefrontSubmitted(newOrder);
    setInspectedRecord({ type: 'order', id: newId });
    logActivity(`ثبت سفارش جدید ${newId} از طریق لینک ویترین ۱ دقیقه‌ای مشتری`);
    notify(`سفارش ${toPersianDigits(newId)} ثبت شد و به پایپ‌لاین فروش اضافه گردید.`);
  };

  // فیلتر رکوردهای پایپ‌لاین و مشتریان
  const filteredPipelineOrders = useMemo(() => {
    return computedOrders.filter((o) => {
      const matchesStage = pipelineStageFilter === 'all' || o.stage === pipelineStageFilter;
      const matchesQuery =
        !globalSearch.trim() ||
        o.customerName.includes(globalSearch) ||
        o.instagram.toLowerCase().includes(globalSearch.toLowerCase()) ||
        o.id.toLowerCase().includes(globalSearch.toLowerCase());
      return matchesStage && matchesQuery;
    });
  }, [computedOrders, pipelineStageFilter, globalSearch]);

  const filteredCustomersList = useMemo(() => {
    const list = customers.filter((c) => {
      const matchesStatus = customerStatusFilter === 'all' || c.status === customerStatusFilter;
      const matchesQuery =
        !globalSearch.trim() ||
        c.name.includes(globalSearch) ||
        c.instagram.toLowerCase().includes(globalSearch.toLowerCase()) ||
        c.phone.includes(toEnglishDigits(globalSearch));
      return matchesStatus && matchesQuery;
    });

    return [...list].sort((a, b) =>
      customerSortBy === 'spending'
        ? b.totalSpending - a.totalSpending
        : b.totalOrders - a.totalOrders
    );
  }, [customers, customerStatusFilter, customerSortBy, globalSearch]);

  // عنوان صفحه فعلی در هدر بالا
  const currentNavMeta = {
    overview: { title: 'پیشخوان عملیات', icon: LayoutGrid },
    inbox: { title: 'صندوق ورودی و استخراج دایرکت', icon: Inbox },
    pipeline: { title: 'پایپ‌لاین فروش', icon: Kanban },
    customers: { title: 'مشتریان', icon: Users },
    followups: { title: 'پیگیری‌ها و بازگشت مشتری', icon: Clock },
    products: { title: 'محصولات و بهای تمام‌شده (BOM)', icon: Package },
    analytics: { title: 'گزارش عملکرد', icon: BarChart2 },
    settings: { title: 'تنظیمات محیط کار', icon: Settings }
  }[activeNav];

  const CurrentHeaderIcon = currentNavMeta?.icon || LayoutGrid;

  return (
    <div
      dir="rtl"
      className="h-screen w-screen overflow-hidden flex flex-col bg-[#FFFFFF] text-[#141416] antialiased select-none"
      style={{
        fontFamily: "'Vazirmatn', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
      }}
    >
      {/* فونت استاندارد وزیرمتن و اینتر + تنظیم اعداد Tabular */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Vazirmatn:wght@400;500;600;700&display=swap');
        .tabular-nums {
          font-variant-numeric: tabular-nums;
        }
        ::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: #DCDCE0;
          border-radius: 3px;
        }
      `}</style>

      {/* اعلان مونوکروم در پایین صفحه (Linear Toast) */}
      {toastMessage && (
        <div className="fixed bottom-4 left-4 z-50 bg-[#141416] text-[#FFFFFF] px-3.5 py-2 rounded-[6px] border border-[#27272A] shadow-sm flex items-center gap-2 text-[12px] font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* نمای ویترین ۱ دقیقه‌ای مشتری (Storefront Preview Mode)    */}
      {/* ========================================================= */}
      {workspaceMode === 'storefront' ? (
        <div className="flex-1 flex flex-col overflow-y-auto bg-[#FBFBFB]">
          {/* نوار بالای بازگشت به محیط CRM */}
          <div className="h-11 border-b border-[#E6E6E9] bg-[#FFFFFF] px-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 text-[12px]">
              <span className="font-semibold text-[#141416]">پیش‌نمایش ویترین مشتری (بدون فیلترشکن)</span>
              <span className="text-[#9CA0AA]">/</span>
              <span dir="ltr" className="font-mono text-[11px] text-[#6F727A]">
                noora.ordr.ir
              </span>
            </div>
            <button
              onClick={() => setWorkspaceMode('crm')}
              className="h-7 px-3 rounded-[5px] bg-[#141416] hover:bg-[#27272A] text-[#FFFFFF] text-[12px] font-medium flex items-center gap-1.5 transition-colors duration-150"
            >
              <span>بازگشت به محیط CRM فروشنده</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* بدنه فرم ۱ دقیقه‌ای مشتری با معماری خط‌کشی شده مونوکروم */}
          <div className="max-w-2xl w-full mx-auto my-8 bg-[#FFFFFF] border border-[#E6E6E9] rounded-[6px]">
            <div className="p-5 border-b border-[#E6E6E9] flex items-center justify-between">
              <div>
                <h1 className="text-[15px] font-semibold text-[#141416]">
                  فروشگاه رسمی شمع دست‌ساز نورا
                </h1>
                <p className="text-[12px] text-[#6F727A] mt-0.5">
                  ثبت مستقیم سفارش در ۱ دقیقه و دریافت خودکار کد رهگیری پستی از طریق پیامک
                </p>
              </div>
              <span dir="ltr" className="text-[11px] font-mono text-[#6F727A] border border-[#E6E6E9] px-2 py-1 rounded-[4px] bg-[#FBFBFB]">
                @noora.candle
              </span>
            </div>

            {storefrontSubmitted ? (
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-2 text-[14px] font-semibold text-[#141416]">
                  <span className="w-2 h-2 rounded-full bg-[#059669]" />
                  <span>سفارش شما با شناسه {toPersianDigits(storefrontSubmitted.id)} ثبت شد.</span>
                </div>
                <p className="text-[12.5px] text-[#6F727A] leading-relaxed">
                  اطلاعات سفارش شما مستقیماً در پایپ‌لاین آماده‌سازی شمع نورا قرار گرفت. به محض تحویل مرسوله به پست، کد رهگیری ۲۰ رقمی برایتان پیامک خواهد شد.
                </p>
                <div className="border border-[#E6E6E9] rounded-[5px] divide-y divide-[#E6E6E9] text-[12px]">
                  <div className="px-3 py-2 flex justify-between">
                    <span className="text-[#6F727A]">نام خریدار</span>
                    <span className="font-medium text-[#141416]">{storefrontSubmitted.customerName}</span>
                  </div>
                  <div className="px-3 py-2 flex justify-between">
                    <span className="text-[#6F727A]">تلفن همراه</span>
                    <span className="font-mono text-[#141416]">{toPersianDigits(storefrontSubmitted.phone)}</span>
                  </div>
                  <div className="px-3 py-2 flex justify-between">
                    <span className="text-[#6F727A]">آدرس ارسال</span>
                    <span className="text-[#141416]">{storefrontSubmitted.address}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => {
                      setStorefrontSubmitted(null);
                      setWorkspaceMode('crm');
                      setActiveNav('pipeline');
                    }}
                    className="h-8 px-3.5 rounded-[5px] bg-[#141416] text-[#FFFFFF] text-[12px] font-medium"
                  >
                    مشاهده این سفارش در پایپ‌لاین CRM
                  </button>
                  <button
                    onClick={() => setStorefrontSubmitted(null)}
                    className="h-8 px-3.5 rounded-[5px] bg-[#FFFFFF] border border-[#DCDCE0] text-[#141416] text-[12px] font-medium"
                  >
                    ثبت سفارش جدید
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitStorefrontOrder} className="divide-y divide-[#E6E6E9]">
                {/* بخش ۱: شناسایی خودکار مشتری قبلی از طریق شماره موبایل */}
                <div className="p-5 space-y-3 bg-[#FBFBFB]">
                  <div className="flex items-center justify-between">
                    <label className="text-[12px] font-medium text-[#141416]">
                      ۱. شماره موبایل (فراخوانی خودکار آدرس برای مشتریان قبلی)
                    </label>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-[#6F727A]">تست سریع:</span>
                      <button
                        type="button"
                        onClick={() => handleStorefrontPhoneInput('09123456789')}
                        className="px-2 py-0.5 text-[11px] bg-[#FFFFFF] border border-[#DCDCE0] rounded-[4px] text-[#141416] hover:bg-[#F6F6F7]"
                      >
                        تینا صادقی (۰۹۱۲۳۴۵۶۷۸۹)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStorefrontPhoneInput('09121112233')}
                        className="px-2 py-0.5 text-[11px] bg-[#FFFFFF] border border-[#DCDCE0] rounded-[4px] text-[#141416] hover:bg-[#F6F6F7]"
                      >
                        سارا محمدی
                      </button>
                    </div>
                  </div>
                  <input
                    type="tel"
                    dir="ltr"
                    value={toPersianDigits(storefrontPhone)}
                    onChange={(e) => handleStorefrontPhoneInput(e.target.value)}
                    placeholder="09123456789"
                    className="w-full h-9 px-3 bg-[#FFFFFF] border border-[#DCDCE0] focus:border-[#141416] rounded-[5px] text-[13px] font-mono text-left outline-none"
                  />
                  {recognizedBuyer && (
                    <div className="flex items-center justify-between px-3 py-2 bg-[#FFFFFF] border border-[#E6E6E9] rounded-[5px] text-[12px]">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
                        <span className="text-[#141416] font-medium">
                          خوش آمدید {recognizedBuyer.name}؛ آدرس، کد پستی و رایحه پیش‌فرض شما از حافظه CRM پر شد.
                        </span>
                      </div>
                      <span className="text-[11px] text-[#6F727A]">
                        سابقه: {toPersianDigits(recognizedBuyer.totalOrders)} خرید
                      </span>
                    </div>
                  )}
                </div>

                {/* بخش ۲: انتخاب محصول */}
                <div className="p-5 space-y-3">
                  <div className="text-[12px] font-medium text-[#141416]">۲. انتخاب محصولات</div>
                  <div className="border border-[#E6E6E9] rounded-[5px] divide-y divide-[#E6E6E9]">
                    {computedProducts.map((p) => {
                      const count = storefrontCart[p.id] || 0;
                      return (
                        <div
                          key={p.id}
                          className="px-3.5 py-2.5 flex items-center justify-between hover:bg-[#F6F6F7]"
                        >
                          <div>
                            <div className="text-[12.5px] font-medium text-[#141416]">{p.name}</div>
                            <div className="text-[11px] text-[#6F727A] tabular-nums">
                              {formatCurrency(p.price)} تومان · رایحه پیش‌فرض: {p.scentDefault}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setStorefrontCart((prev) => ({
                                  ...prev,
                                  [p.id]: Math.max(0, (prev[p.id] || 0) - 1)
                                }))
                              }
                              className="w-6 h-6 rounded-[4px] border border-[#DCDCE0] bg-[#FFFFFF] text-[#141416] text-[12px] flex items-center justify-center"
                            >
                              -
                            </button>
                            <span className="w-5 text-center text-[12.5px] font-medium tabular-nums">
                              {toPersianDigits(count)}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setStorefrontCart((prev) => ({
                                  ...prev,
                                  [p.id]: (prev[p.id] || 0) + 1
                                }))
                              }
                              className="w-6 h-6 rounded-[4px] bg-[#141416] text-[#FFFFFF] text-[12px] flex items-center justify-center"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* بخش ۳: مشخصات و آدرس پستی */}
                <div className="p-5 space-y-3">
                  <div className="text-[12px] font-medium text-[#141416]">۳. مشخصات گیرنده و آدرس پستی</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-[#6F727A] mb-1">نام و نام خانوادگی</label>
                      <input
                        type="text"
                        required
                        value={buyerName}
                        onChange={(e) => setBuyerName(e.target.value)}
                        className="w-full h-8 px-2.5 bg-[#FFFFFF] border border-[#DCDCE0] rounded-[5px] text-[12.5px] outline-none focus:border-[#141416]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#6F727A] mb-1">نام کاربری اینستاگرام</label>
                      <input
                        type="text"
                        dir="ltr"
                        value={buyerInsta}
                        onChange={(e) => setBuyerInsta(e.target.value)}
                        placeholder="@username"
                        className="w-full h-8 px-2.5 bg-[#FFFFFF] border border-[#DCDCE0] rounded-[5px] text-[12.5px] text-left font-mono outline-none focus:border-[#141416]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#6F727A] mb-1">آدرس دقیق پستی</label>
                    <input
                      type="text"
                      required
                      value={buyerAddress}
                      onChange={(e) => setBuyerAddress(e.target.value)}
                      className="w-full h-8 px-2.5 bg-[#FFFFFF] border border-[#DCDCE0] rounded-[5px] text-[12.5px] outline-none focus:border-[#141416]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-[#6F727A] mb-1">کد پستی ۱۰ رقمی</label>
                      <input
                        type="text"
                        dir="ltr"
                        value={toPersianDigits(buyerPostal)}
                        onChange={(e) => setBuyerPostal(toEnglishDigits(e.target.value))}
                        className="w-full h-8 px-2.5 bg-[#FFFFFF] border border-[#DCDCE0] rounded-[5px] text-[12.5px] text-left font-mono outline-none focus:border-[#141416]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#6F727A] mb-1">رایحه انتخابی</label>
                      <select
                        value={storefrontScent}
                        onChange={(e) => setStorefrontScent(e.target.value)}
                        className="w-full h-8 px-2.5 bg-[#FFFFFF] border border-[#DCDCE0] rounded-[5px] text-[12px] outline-none"
                      >
                        <option value="وانیل و چوب صندل">وانیل و چوب صندل</option>
                        <option value="دارچین و قهوه">دارچین و قهوه</option>
                        <option value="اسطوخودوس و بهارنارنج">اسطوخودوس و بهارنارنج</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* دکمه ثبت نهایی */}
                <div className="p-4 bg-[#FBFBFB] flex items-center justify-between">
                  <div className="text-[12px] text-[#6F727A]">
                    مبلغ قابل پرداخت:{' '}
                    <strong className="text-[#141416] font-semibold tabular-nums">
                      {formatCurrency(
                        computedProducts.reduce(
                          (acc, p) => acc + p.price * (storefrontCart[p.id] || 0),
                          0
                        )
                      )}{' '}
                      تومان
                    </strong>
                  </div>
                  <button
                    type="submit"
                    className="h-8 px-4 rounded-[5px] bg-[#141416] hover:bg-[#27272A] text-[#FFFFFF] text-[12px] font-medium"
                  >
                    پرداخت و ثبت مستقیم در CRM
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      ) : (
        /* ========================================================= */
        /* محیط اصلی B2B SaaS CRM (Attio / Twenty / Linear Clone)    */
        /* ========================================================= */
        <div className="flex-1 flex overflow-hidden">
          {/* ۱. سایدبار سمت راست (۲۲۰ پیکسل، مونوکروم #FBFBFB) */}
          <aside className="w-[220px] shrink-0 bg-[#FBFBFB] border-l border-[#E6E6E9] flex flex-col justify-between">
            <div>
              {/* انتخابگر محیط کاری (Workspace Switcher) */}
              <div className="h-11 px-3 border-b border-[#E6E6E9] flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-5 h-5 rounded-[4px] bg-[#141416] text-[#FFFFFF] flex items-center justify-center text-[11px] font-semibold shrink-0">
                    N
                  </div>
                  <div className="truncate">
                    <span className="text-[12.5px] font-semibold text-[#141416] block truncate">
                      شمع نورا
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-[#6F727A] bg-[#F4F4F5] border border-[#E6E6E9] px-1.5 py-0.5 rounded-[4px]">
                  FREE
                </span>
              </div>

              {/* دکمه جستجوی سریع در سایدبار */}
              <div className="p-2 border-b border-[#E6E6E9]">
                <div className="relative flex items-center">
                  <Search className="w-3.5 h-3.5 text-[#9CA0AA] absolute right-2.5 pointer-events-none" />
                  <input
                    type="text"
                    value={globalSearch}
                    onChange={(e) => setGlobalSearch(e.target.value)}
                    placeholder="جستجو در رکوردها..."
                    className="w-full h-7 pr-8 pl-7 bg-[#FFFFFF] border border-[#E6E6E9] focus:border-[#141416] rounded-[5px] text-[11.5px] text-[#141416] placeholder-[#9CA0AA] outline-none"
                  />
                  <span className="absolute left-2 text-[10px] font-mono text-[#9CA0AA]">⌘K</span>
                </div>
              </div>

              {/* ۸ آیتم ناوبری اصلی منطبق با ساختار CRM */}
              <div className="p-2 space-y-0.5">
                <div className="px-2 py-1 text-[10px] font-medium text-[#9CA0AA]">
                  فضای کاری فروش
                </div>
                {[
                  {
                    id: 'overview',
                    label: 'پیشخوان عملیات',
                    icon: LayoutGrid,
                    count: operationalMetrics.requiringAttention
                  },
                  {
                    id: 'inbox',
                    label: 'صندوق ورودی دایرکت',
                    icon: Inbox,
                    count: inboxThreads.filter((t) => t.unread).length
                  },
                  {
                    id: 'pipeline',
                    label: 'پایپ‌لاین فروش',
                    icon: Kanban,
                    count: computedOrders.length
                  },
                  {
                    id: 'customers',
                    label: 'مشتریان',
                    icon: Users,
                    count: customers.length
                  },
                  {
                    id: 'followups',
                    label: 'پیگیری‌ها',
                    icon: Clock,
                    count: followUps.filter((f) => f.status === 'pending').length
                  },
                  {
                    id: 'products',
                    label: 'محصولات و بهای تمام‌شده',
                    icon: Package,
                    dot: operationalMetrics.lossProduct ? '#DC2626' : null
                  },
                  {
                    id: 'analytics',
                    label: 'گزارش عملکرد',
                    icon: BarChart2
                  },
                  {
                    id: 'settings',
                    label: 'تنظیمات',
                    icon: Settings
                  }
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeNav === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveNav(item.id)}
                      className={`w-full h-8 px-2.5 rounded-[5px] flex items-center justify-between text-[12.5px] transition-colors duration-150 ${
                        isActive
                          ? 'bg-[#EFEFF1] text-[#141416] font-medium'
                          : 'text-[#6F727A] hover:bg-[#F6F6F7] hover:text-[#141416]'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Icon
                          className={`w-3.5 h-3.5 shrink-0 ${
                            isActive ? 'text-[#141416]' : 'text-[#9CA0AA]'
                          }`}
                          strokeWidth={1.75}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {item.dot && (
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: item.dot }}
                          />
                        )}
                        {item.count !== undefined && item.count > 0 && (
                          <span className="text-[11px] text-[#6F727A] tabular-nums">
                            {toPersianDigits(item.count)}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* فوتر سایدبار: مصرف Freemium و لینک ویترین مشتری */}
            <div className="p-2.5 border-t border-[#E6E6E9] space-y-2">
              <div className="px-2 py-1.5 bg-[#FFFFFF] border border-[#E6E6E9] rounded-[5px]">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#6F727A]">سقف رایگان ماهانه</span>
                  <span className="font-medium text-[#141416] tabular-nums">
                    {toPersianDigits(computedOrders.length + 14)} / ۳۰
                  </span>
                </div>
                <div className="w-full h-1 bg-[#EFEFF1] rounded-full mt-1.5 overflow-hidden">
                  <div className="h-full bg-[#141416] w-[63%]" />
                </div>
              </div>

              <button
                onClick={() => setWorkspaceMode('storefront')}
                className="w-full h-7 px-2.5 rounded-[5px] bg-[#FFFFFF] border border-[#DCDCE0] hover:bg-[#F6F6F7] text-[#141416] text-[11.5px] font-medium flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5 text-[#6F727A]" />
                  <span>ویترین ثبت سفارش مشتری</span>
                </span>
                <ExternalLink className="w-3 h-3 text-[#9CA0AA]" />
              </button>
            </div>
          </aside>

          {/* ۲. ستون میانی: فضای کاری اصلی (Full-Bleed White Surface) */}
          <main className="flex-1 flex flex-col min-w-0 bg-[#FFFFFF] overflow-hidden">
            {/* هدر بالای صفحه (۴۴ پیکسل - Top Navigation Bar) */}
            <header className="h-11 border-b border-[#E6E6E9] bg-[#FFFFFF] px-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <CurrentHeaderIcon className="w-4 h-4 text-[#6F727A]" strokeWidth={1.75} />
                <h1 className="text-[13.5px] font-semibold text-[#141416]">
                  {currentNavMeta?.title}
                </h1>
                <span className="text-[#E6E6E9]">|</span>
                <span dir="ltr" className="text-[11px] font-mono text-[#6F727A]">
                  @noora.candle
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveNav('inbox')}
                  className="h-7 px-2.5 rounded-[5px] bg-[#FFFFFF] border border-[#DCDCE0] hover:bg-[#F6F6F7] text-[#141416] text-[11.5px] font-medium flex items-center gap-1.5"
                >
                  <Inbox className="w-3.5 h-3.5 text-[#6F727A]" />
                  <span>استخراج از دایرکت</span>
                </button>
                <button
                  onClick={() => {
                    setActiveNav('pipeline');
                    setInspectedRecord({ type: 'order', id: computedOrders[0]?.id });
                  }}
                  className="h-7 px-2.5 rounded-[5px] bg-[#141416] hover:bg-[#27272A] text-[#FFFFFF] text-[11.5px] font-medium flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ثبت سفارش</span>
                </button>
              </div>
            </header>

            {/* ===================================================== */}
            {/* صفحه ۱: پیشخوان عملیات (Overview)                     */}
            {/* ===================================================== */}
            {activeNav === 'overview' && (
              <div className="flex-1 flex flex-col overflow-y-auto">
                {/* نوار متریک‌های عملیاتی با خطوط عمودی ۱ پیکسلی (بدون کارت شناور) */}
                <div className="grid grid-cols-5 border-b border-[#E6E6E9] divide-x divide-x-reverse divide-[#E6E6E9] bg-[#FFFFFF] shrink-0">
                  <div className="p-3.5">
                    <div className="flex items-center justify-between text-[11px] text-[#6F727A]">
                      <span>سفارش‌های نیازمند اقدام</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                    </div>
                    <div className="mt-1 text-[18px] font-semibold text-[#141416] tabular-nums">
                      {toPersianDigits(operationalMetrics.requiringAttention)}
                    </div>
                    <div className="text-[11px] text-[#6F727A] mt-0.5">
                      بررسی فیش یا ثبت بارکد پستی
                    </div>
                  </div>

                  <div className="p-3.5">
                    <div className="flex items-center justify-between text-[11px] text-[#6F727A]">
                      <span>مشتریان منتظر پاسخ</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                    </div>
                    <div className="mt-1 text-[18px] font-semibold text-[#141416] tabular-nums">
                      {toPersianDigits(
                        operationalMetrics.awaitingResponse +
                          inboxThreads.filter((t) => t.unread).length
                      )}
                    </div>
                    <div className="text-[11px] text-[#6F727A] mt-0.5">
                      میانگین زمان پاسخ: ۱۲ دقیقه
                    </div>
                  </div>

                  <div className="p-3.5">
                    <div className="flex items-center justify-between text-[11px] text-[#6F727A]">
                      <span>در انتظار تایید پرداخت</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#71717A]" />
                    </div>
                    <div className="mt-1 text-[18px] font-semibold text-[#141416] tabular-nums">
                      {toPersianDigits(operationalMetrics.pendingPayment)}
                    </div>
                    <div className="text-[11px] text-[#6F727A] mt-0.5">
                      تطبیق خودکار فیش با OCR
                    </div>
                  </div>

                  <div className="p-3.5">
                    <div className="flex items-center justify-between text-[11px] text-[#6F727A]">
                      <span>خریدهای تکمیل‌شده</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
                    </div>
                    <div className="mt-1 text-[18px] font-semibold text-[#141416] tabular-nums">
                      {toPersianDigits(operationalMetrics.completedCount)}
                    </div>
                    <div className="text-[11px] text-[#6F727A] mt-0.5">
                      ۰٪ سفارش فراموش‌شده
                    </div>
                  </div>

                  <div className="p-3.5">
                    <div className="flex items-center justify-between text-[11px] text-[#6F727A]">
                      <span>فروش فعال / سود خالص</span>
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          backgroundColor:
                            operationalMetrics.totalNetProfit >= 0 ? '#059669' : '#DC2626'
                        }}
                      />
                    </div>
                    <div className="mt-1 text-[16px] font-semibold text-[#141416] tabular-nums">
                      {formatCurrency(operationalMetrics.totalSales)}{' '}
                      <span className="text-[11px] font-normal text-[#6F727A]">تومان</span>
                    </div>
                    <div className="text-[11px] text-[#6F727A] mt-0.5 tabular-nums">
                      سود خالص: {formatCurrency(operationalMetrics.totalNetProfit)} تومان
                    </div>
                  </div>
                </div>

                {/* سطر هشدار مونوکروم بهای تمام‌شده (Cost Guard Row) - بدون رنگ پس‌زمینه */}
                {operationalMetrics.lossProduct && (
                  <div className="px-4 py-2.5 border-b border-[#E6E6E9] bg-[#FBFBFB] flex items-center justify-between gap-4 shrink-0">
                    <div className="flex items-center gap-2.5 text-[12px]">
                      <span className="w-2 h-2 rounded-full bg-[#DC2626] shrink-0" />
                      <span className="font-semibold text-[#141416]">
                        هشدار حاشیه سود منفی ({operationalMetrics.lossProduct.name}):
                      </span>
                      <span className="text-[#6F727A]">
                        با نرخ موم سویا ({formatCurrency(waxPricePerKg)} تومان/کیلو)، بهای تمام‌شده{' '}
                        <strong className="text-[#141416] font-medium tabular-nums">
                          {formatCurrency(operationalMetrics.lossProduct.totalCogs)} تومان
                        </strong>{' '}
                        و قیمت فروش فعلی{' '}
                        <strong className="text-[#141416] font-medium tabular-nums">
                          {formatCurrency(operationalMetrics.lossProduct.price)} تومان
                        </strong>{' '}
                        است ({formatCurrency(Math.abs(operationalMetrics.lossProduct.netProfit))} تومان زیان در هر عدد).
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() =>
                          handleFixProductPrice(
                            operationalMetrics.lossProduct.id,
                            operationalMetrics.lossProduct.suggestedPrice
                          )
                        }
                        className="h-7 px-3 rounded-[5px] bg-[#141416] hover:bg-[#27272A] text-[#FFFFFF] text-[11.5px] font-medium whitespace-nowrap"
                      >
                        اصلاح قیمت به {formatCurrency(operationalMetrics.lossProduct.suggestedPrice)} تومان
                      </button>
                      <button
                        onClick={() => setActiveNav('products')}
                        className="h-7 px-2.5 rounded-[5px] bg-[#FFFFFF] border border-[#DCDCE0] hover:bg-[#F6F6F7] text-[#141416] text-[11.5px] font-medium"
                      >
                        جدول BOM
                      </button>
                    </div>
                  </div>
                )}

                {/* بخش دو ستونی پایین پیشخوان: صف اقدام فوری (۸ ستون) + جریان فعالیت‌ها (۴ ستون) */}
                <div className="flex-1 grid grid-cols-12 divide-x divide-x-reverse divide-[#E6E6E9] min-h-0">
                  {/* ستون راست: جدول سفارش‌های نیازمند توجه فوری */}
                  <div className="col-span-8 flex flex-col min-w-0">
                    <div className="h-9 px-4 border-b border-[#E6E6E9] bg-[#FBFBFB] flex items-center justify-between">
                      <span className="text-[12px] font-medium text-[#141416]">
                        صف سفارش‌های نیازمند اقدام (Action Queue)
                      </span>
                      <button
                        onClick={() => setActiveNav('pipeline')}
                        className="text-[11px] text-[#6F727A] hover:text-[#141416]"
                      >
                        مشاهده کل پایپ‌لاین ←
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-right">
                        <thead>
                          <tr className="bg-[#FAFAFA] border-b border-[#E6E6E9] text-[11px] text-[#6F727A] font-medium">
                            <th className="h-8 px-3 border-l border-[#E6E6E9] font-medium">سفارش / مشتری</th>
                            <th className="h-8 px-3 border-l border-[#E6E6E9] font-medium">محصول</th>
                            <th className="h-8 px-3 border-l border-[#E6E6E9] font-medium">مبلغ / سود</th>
                            <th className="h-8 px-3 border-l border-[#E6E6E9] font-medium">مرحله فعلی</th>
                            <th className="h-8 px-3 font-medium">اقدام بعدی</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E6E6E9] text-[12.5px]">
                          {computedOrders.map((ord) => {
                            const st = STAGE_MAP[ord.stage] || STAGE_MAP.new_order;
                            const isSelected =
                              inspectedRecord?.type === 'order' && inspectedRecord?.id === ord.id;
                            return (
                              <tr
                                key={ord.id}
                                onClick={() => setInspectedRecord({ type: 'order', id: ord.id })}
                                className={`h-10 cursor-pointer transition-colors ${
                                  isSelected ? 'bg-[#EFEFF1]' : 'hover:bg-[#F6F6F7]'
                                }`}
                              >
                                <td className="px-3 border-l border-[#E6E6E9]">
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="font-medium text-[#141416]">
                                      {ord.customerName}
                                    </span>
                                    <span dir="ltr" className="text-[11px] font-mono text-[#6F727A]">
                                      {ord.instagram}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-3 border-l border-[#E6E6E9] text-[#141416] truncate max-w-[190px]">
                                  {ord.primaryProductLabel}
                                </td>
                                <td className="px-3 border-l border-[#E6E6E9] tabular-nums">
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-[#141416]">{formatCurrency(ord.totalValue)}</span>
                                    <span className="text-[11px] text-[#6F727A] flex items-center gap-1">
                                      <span
                                        className="w-1.5 h-1.5 rounded-full"
                                        style={{
                                          backgroundColor: ord.netProfit >= 0 ? '#059669' : '#DC2626'
                                        }}
                                      />
                                      {formatCurrency(ord.netProfit)}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-3 border-l border-[#E6E6E9]">
                                  <StatusChip dotColor={st.dot} label={st.label} />
                                </td>
                                <td
                                  className="px-3"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {ord.stage === 'awaiting_payment' && (
                                    <button
                                      onClick={() => handleVerifyOrderReceipt(ord.id)}
                                      className="h-6 px-2 rounded-[4px] bg-[#141416] text-[#FFFFFF] text-[11px] font-medium"
                                    >
                                      تایید فیش OCR
                                    </button>
                                  )}
                                  {ord.stage === 'new_order' && (
                                    <button
                                      onClick={() =>
                                        handleUpdateOrderStage(ord.id, 'order_confirmation')
                                      }
                                      className="h-6 px-2 rounded-[4px] bg-[#FFFFFF] border border-[#DCDCE0] hover:bg-[#F6F6F7] text-[#141416] text-[11px] font-medium"
                                    >
                                      تایید سفارش
                                    </button>
                                  )}
                                  {ord.stage === 'order_confirmation' && (
                                    <button
                                      onClick={() => handleAssignTrackingCode(ord.id)}
                                      className="h-6 px-2 rounded-[4px] bg-[#141416] text-[#FFFFFF] text-[11px] font-medium"
                                    >
                                      ثبت بارکد پستی
                                    </button>
                                  )}
                                  {ord.stage === 'awaiting_response' && (
                                    <button
                                      onClick={() =>
                                        handleUpdateOrderStage(ord.id, 'order_confirmation')
                                      }
                                      className="h-6 px-2 rounded-[4px] bg-[#FFFFFF] border border-[#DCDCE0] text-[#141416] text-[11px] font-medium"
                                    >
                                      ثبت پاسخ دایرکت
                                    </button>
                                  )}
                                  {ord.stage === 'completed' && (
                                    <span className="text-[11px] text-[#6F727A] font-mono">
                                      ارسال‌شده ✓
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* ستون چپ: پیگیری‌های امروز و تایم‌لاین رخدادها */}
                  <div className="col-span-4 flex flex-col divide-y divide-[#E6E6E9]">
                    <div className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-medium text-[#141416]">
                          مشتریان نیازمند پیگیری (چرخه مصرف)
                        </span>
                        <button
                          onClick={() => setActiveNav('followups')}
                          className="text-[11px] text-[#6F727A] hover:text-[#141416]"
                        >
                          همه ({toPersianDigits(followUps.length)})
                        </button>
                      </div>
                      <div className="divide-y divide-[#E6E6E9] border border-[#E6E6E9] rounded-[5px]">
                        {followUps.map((f) => (
                          <div
                            key={f.id}
                            className="p-2.5 flex items-center justify-between hover:bg-[#F6F6F7]"
                          >
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span
                                  className="w-1.5 h-1.5 rounded-full"
                                  style={{
                                    backgroundColor:
                                      f.status === 'done'
                                        ? '#059669'
                                        : f.category === 'overdue'
                                        ? '#D97706'
                                        : '#71717A'
                                  }}
                                />
                                <span className="text-[12px] font-medium text-[#141416]">
                                  {f.customerName}
                                </span>
                                <span className="text-[11px] text-[#6F727A]">
                                  ({toPersianDigits(f.daysElapsed)} روز)
                                </span>
                              </div>
                              <div className="text-[11px] text-[#6F727A] truncate mt-0.5">
                                {f.reason}
                              </div>
                            </div>
                            {f.status === 'pending' ? (
                              <button
                                onClick={() => {
                                  setFollowUps((prev) =>
                                    prev.map((item) =>
                                      item.id === f.id ? { ...item, status: 'done' } : item
                                    )
                                  );
                                  logActivity(`ارسال پیامک یادآوری خرید مجدد برای ${f.customerName}`);
                                  notify(`لینک خرید مجدد برای ${f.customerName} پیامک شد.`);
                                }}
                                className="h-6 px-2 rounded-[4px] bg-[#FFFFFF] border border-[#DCDCE0] hover:bg-[#F6F6F7] text-[#141416] text-[11px] font-medium shrink-0"
                              >
                                ارسال یادآوری
                              </button>
                            ) : (
                              <span className="text-[11px] text-[#6F727A]">ارسال شد</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 flex-1">
                      <div className="text-[12px] font-medium text-[#141416] mb-3">
                        تایم‌لاین فعالیت‌های سیستم
                      </div>
                      <div className="relative pr-3 border-r border-[#E6E6E9] space-y-3">
                        {activityLog.slice(0, 6).map((act) => (
                          <div key={act.id} className="relative">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#9CA0AA] absolute -right-[15.5px] top-1.5" />
                            <div className="text-[12px] text-[#141416] leading-snug">
                              {act.text}
                            </div>
                            <div className="text-[10.5px] text-[#9CA0AA] mt-0.5">{act.time}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ===================================================== */}
            {/* صفحه ۲: صندوق ورودی و استخراج هوشمند دایرکت (Inbox)   */}
            {/* ===================================================== */}
            {activeNav === 'inbox' && (
              <div className="flex-1 grid grid-cols-12 divide-x divide-x-reverse divide-[#E6E6E9] overflow-hidden">
                {/* ستون راست: لیست گفتگوهای دایرکت (۴ ستون) */}
                <div className="col-span-4 flex flex-col bg-[#FBFBFB] overflow-y-auto">
                  <div className="h-9 px-3 border-b border-[#E6E6E9] flex items-center justify-between">
                    <span className="text-[11.5px] font-medium text-[#6F727A]">
                      پیام‌های دریافتی دایرکت ({toPersianDigits(inboxThreads.length)})
                    </span>
                    <button
                      onClick={() => setIsCustomDmMode(!isCustomDmMode)}
                      className="h-6 px-2 rounded-[4px] bg-[#FFFFFF] border border-[#DCDCE0] text-[11px] font-medium text-[#141416]"
                    >
                      {isCustomDmMode ? 'لیست پیام‌ها' : '+ چسباندن متن دلخواه'}
                    </button>
                  </div>

                  <div className="divide-y divide-[#E6E6E9]">
                    {inboxThreads.map((t) => {
                      const active = !isCustomDmMode && selectedThreadId === t.id;
                      return (
                        <button
                          key={t.id}
                          onClick={() => {
                            setIsCustomDmMode(false);
                            setSelectedThreadId(t.id);
                          }}
                          className={`w-full text-right p-3.5 transition-colors ${
                            active ? 'bg-[#EFEFF1]' : 'hover:bg-[#F6F6F7]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              {t.unread && (
                                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                              )}
                              <span className="text-[12.5px] font-semibold text-[#141416]">
                                {t.senderName}
                              </span>
                            </div>
                            <span className="text-[11px] text-[#9CA0AA]">{t.time}</span>
                          </div>
                          <div dir="ltr" className="text-[11px] font-mono text-[#6F727A] text-right mt-0.5">
                            {t.instagram}
                          </div>
                          <p className="text-[11.5px] text-[#6F727A] line-clamp-2 mt-1.5 leading-relaxed">
                            {t.rawText}
                          </p>
                          <div className="mt-2">
                            <StatusChip dotColor="#71717A" label={t.tag} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ستون چپ: متن خام پیام + جدول ساختاریافته استخراج‌شده با AI (۸ ستون) */}
                <div className="col-span-8 flex flex-col bg-[#FFFFFF] overflow-y-auto">
                  {(() => {
                    const currentThread =
                      inboxThreads.find((t) => t.id === selectedThreadId) || inboxThreads[0];
                    const extracted = isCustomDmMode
                      ? parsedCustomDm
                      : currentThread.extracted;
                    const matchedProd =
                      computedProducts.find((p) => p.id === extracted?.productId) ||
                      computedProducts[0];
                    const lineTotal = matchedProd.price * (extracted?.count || 1);
                    const lineProfit =
                      (matchedProd.price - matchedProd.totalCogs) * (extracted?.count || 1);

                    return (
                      <div className="divide-y divide-[#E6E6E9]">
                        {/* بخش بالایی: پیام خام دایرکت */}
                        <div className="p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <MessageSquare className="w-4 h-4 text-[#6F727A]" />
                              <span className="text-[12.5px] font-semibold text-[#141416]">
                                {isCustomDmMode
                                  ? 'ورود دستی متن چت دایرکت (پشتیبانی از فارسی و فینگلیش)'
                                  : `پیام دایرکت از ${currentThread.senderName} (${currentThread.instagram})`}
                              </span>
                            </div>
                            <StatusChip dotColor="#059669" label="موتور NLP و فیش‌خوان OCR آماده" />
                          </div>

                          {isCustomDmMode ? (
                            <textarea
                              rows={4}
                              value={customDmText}
                              onChange={(e) => setCustomDmText(e.target.value)}
                              placeholder="متن پیام مشتری در دایرکت را اینجا Paste کنید..."
                              className="w-full p-3 bg-[#FBFBFB] border border-[#DCDCE0] focus:border-[#141416] rounded-[5px] text-[12.5px] text-[#141416] outline-none leading-relaxed"
                            />
                          ) : (
                            <div className="p-3.5 bg-[#FBFBFB] border border-[#E6E6E9] rounded-[5px] text-[12.5px] text-[#141416] whitespace-pre-line leading-relaxed">
                              {currentThread.rawText}
                            </div>
                          )}
                        </div>

                        {/* بخش پایینی: جدول فیلدهای استخراج‌شده به سبک Attio Property Sheet */}
                        {extracted ? (
                          <div className="p-4 space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-[13px] font-semibold text-[#141416]">
                                  فیلدهای ساختاریافته استخراج‌شده از پیام
                                </h3>
                                <p className="text-[11.5px] text-[#6F727A]">
                                  حذف کامل تایپ دستی در اکسل؛ آماده تبدیل به رکورد رسمی در پایپ‌لاین فروش
                                </p>
                              </div>
                              <button
                                onClick={() =>
                                  handleCreateOrderFromInbox(
                                    extracted,
                                    isCustomDmMode ? null : currentThread.id
                                  )
                                }
                                className="h-8 px-3.5 rounded-[5px] bg-[#141416] hover:bg-[#27272A] text-[#FFFFFF] text-[12px] font-medium flex items-center gap-1.5"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>ایجاد رکورد در پایپ‌لاین فروش</span>
                              </button>
                            </div>

                            <div className="border border-[#E6E6E9] rounded-[5px] divide-y divide-[#E6E6E9] text-[12.5px]">
                              <div className="grid grid-cols-12 h-9 items-center">
                                <div className="col-span-4 px-3 h-full flex items-center gap-2 bg-[#FAFAFA] border-l border-[#E6E6E9] text-[11.5px] text-[#6F727A]">
                                  <User className="w-3.5 h-3.5 text-[#9CA0AA]" />
                                  <span>نام مشتری</span>
                                </div>
                                <div className="col-span-8 px-3 font-medium text-[#141416]">
                                  {extracted.customerName}
                                </div>
                              </div>

                              <div className="grid grid-cols-12 h-9 items-center">
                                <div className="col-span-4 px-3 h-full flex items-center gap-2 bg-[#FAFAFA] border-l border-[#E6E6E9] text-[11.5px] text-[#6F727A]">
                                  <AtSign className="w-3.5 h-3.5 text-[#9CA0AA]" />
                                  <span>نام کاربری و موبایل</span>
                                </div>
                                <div className="col-span-8 px-3 flex items-center gap-3 font-mono text-[12px]">
                                  <span dir="ltr">{extracted.instagram}</span>
                                  <span className="text-[#E6E6E9]">|</span>
                                  <span>{toPersianDigits(extracted.phone)}</span>
                                </div>
                              </div>

                              <div className="grid grid-cols-12 min-h-[38px] items-center">
                                <div className="col-span-4 px-3 py-2 h-full flex items-center gap-2 bg-[#FAFAFA] border-l border-[#E6E6E9] text-[11.5px] text-[#6F727A]">
                                  <MapPin className="w-3.5 h-3.5 text-[#9CA0AA]" />
                                  <span>آدرس پستی استاندارد</span>
                                </div>
                                <div className="col-span-8 px-3 py-2 text-[#141416]">
                                  {extracted.address}
                                </div>
                              </div>

                              <div className="grid grid-cols-12 h-9 items-center">
                                <div className="col-span-4 px-3 h-full flex items-center gap-2 bg-[#FAFAFA] border-l border-[#E6E6E9] text-[11.5px] text-[#6F727A]">
                                  <Hash className="w-3.5 h-3.5 text-[#9CA0AA]" />
                                  <span>کد پستی ۱۰ رقمی</span>
                                </div>
                                <div className="col-span-8 px-3 font-mono text-[#141416]">
                                  {toPersianDigits(extracted.postalCode)}
                                </div>
                              </div>

                              <div className="grid grid-cols-12 h-9 items-center">
                                <div className="col-span-4 px-3 h-full flex items-center gap-2 bg-[#FAFAFA] border-l border-[#E6E6E9] text-[11.5px] text-[#6F727A]">
                                  <Package className="w-3.5 h-3.5 text-[#9CA0AA]" />
                                  <span>محصول و تعداد</span>
                                </div>
                                <div className="col-span-8 px-3 font-medium text-[#141416]">
                                  {toPersianDigits(extracted.count)} عدد {matchedProd.name} ({extracted.note})
                                </div>
                              </div>

                              <div className="grid grid-cols-12 h-9 items-center">
                                <div className="col-span-4 px-3 h-full flex items-center gap-2 bg-[#FAFAFA] border-l border-[#E6E6E9] text-[11.5px] text-[#6F727A]">
                                  <CreditCard className="w-3.5 h-3.5 text-[#9CA0AA]" />
                                  <span>تطبیق فیش واریزی (OCR)</span>
                                </div>
                                <div className="col-span-8 px-3 flex items-center justify-between">
                                  <StatusChip
                                    dotColor="#059669"
                                    label={`تایید شده · کد پیگیری ${extracted.receiptRef}`}
                                  />
                                  <span className="font-semibold tabular-nums">
                                    {formatCurrency(lineTotal)} تومان
                                  </span>
                                </div>
                              </div>

                              <div className="grid grid-cols-12 h-9 items-center">
                                <div className="col-span-4 px-3 h-full flex items-center gap-2 bg-[#FAFAFA] border-l border-[#E6E6E9] text-[11.5px] text-[#6F727A]">
                                  <DollarSign className="w-3.5 h-3.5 text-[#9CA0AA]" />
                                  <span>سود خالص این سفارش</span>
                                </div>
                                <div className="col-span-8 px-3 flex items-center gap-2 tabular-nums">
                                  <StatusChip
                                    dotColor={lineProfit >= 0 ? '#059669' : '#DC2626'}
                                    label={
                                      lineProfit >= 0
                                        ? `${formatCurrency(lineProfit)}+ تومان سود خالص`
                                        : `${formatCurrency(lineProfit)} تومان زیان خالص (نیازمند اصلاح قیمت)`
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="p-8 text-center text-[12px] text-[#6F727A]">
                            متن پیام دایرکت را در کادر بالا وارد کنید تا فیلدها استخراج شوند.
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* ===================================================== */}
            {/* صفحه ۳: پایپ‌لاین فروش (Sales Pipeline - Table/Kanban) */}
            {/* ===================================================== */}
            {activeNav === 'pipeline' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* نوار ابزار ویو و فیلتر (Sub-header Bar) */}
                <div className="h-9 px-4 border-b border-[#E6E6E9] bg-[#FBFBFB] flex items-center justify-between gap-2 shrink-0">
                  <div className="flex items-center gap-2 overflow-x-auto">
                    {/* سوییچر جدول / کانبان */}
                    <div className="flex items-center bg-[#EFEFF1] p-0.5 rounded-[5px] border border-[#E6E6E9]">
                      <button
                        onClick={() => setPipelineView('table')}
                        className={`px-2 py-0.5 rounded-[4px] text-[11px] font-medium ${
                          pipelineView === 'table'
                            ? 'bg-[#FFFFFF] text-[#141416] shadow-2xs'
                            : 'text-[#6F727A]'
                        }`}
                      >
                        نمای جدول (Attio)
                      </button>
                      <button
                        onClick={() => setPipelineView('kanban')}
                        className={`px-2 py-0.5 rounded-[4px] text-[11px] font-medium ${
                          pipelineView === 'kanban'
                            ? 'bg-[#FFFFFF] text-[#141416] shadow-2xs'
                            : 'text-[#6F727A]'
                        }`}
                      >
                        برد کانبان (Linear)
                      </button>
                    </div>

                    <div className="h-4 w-[1px] bg-[#E6E6E9]" />

                    {/* فیلتر مراحل پایپ‌لاین */}
                    <button
                      onClick={() => setPipelineStageFilter('all')}
                      className={`px-2 py-0.5 rounded-[4px] text-[11px] font-medium ${
                        pipelineStageFilter === 'all'
                          ? 'bg-[#141416] text-[#FFFFFF]'
                          : 'text-[#6F727A] hover:bg-[#EFEFF1]'
                      }`}
                    >
                      همه ({toPersianDigits(computedOrders.length)})
                    </button>
                    {PIPELINE_STAGES.map((st) => {
                      const cnt = computedOrders.filter((o) => o.stage === st.id).length;
                      return (
                        <button
                          key={st.id}
                          onClick={() => setPipelineStageFilter(st.id)}
                          className={`px-2 py-0.5 rounded-[4px] text-[11px] font-medium flex items-center gap-1 whitespace-nowrap ${
                            pipelineStageFilter === st.id
                              ? 'bg-[#EFEFF1] text-[#141416] border border-[#DCDCE0]'
                              : 'text-[#6F727A] hover:bg-[#F6F6F7]'
                          }`}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: st.dot }}
                          />
                          <span>{st.label}</span>
                          <span className="text-[10.5px] text-[#9CA0AA] tabular-nums">
                            {toPersianDigits(cnt)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* نمای اول: جدول تمام‌صفحه به سبک Attio CRM */}
                {pipelineView === 'table' ? (
                  <div className="flex-1 overflow-auto">
                    <table className="w-full border-collapse text-right">
                      <thead className="sticky top-0 z-10 bg-[#FAFAFA] border-b border-[#E6E6E9] text-[11px] text-[#6F727A]">
                        <tr>
                          <th className="w-8 h-8 px-2.5 border-l border-[#E6E6E9] text-center">
                            <input
                              type="checkbox"
                              className="accent-[#141416] rounded-[3px]"
                              checked={
                                selectedOrderRows.length === filteredPipelineOrders.length &&
                                filteredPipelineOrders.length > 0
                              }
                              onChange={(e) =>
                                setSelectedOrderRows(
                                  e.target.checked ? filteredPipelineOrders.map((o) => o.id) : []
                                )
                              }
                            />
                          </th>
                          <th className="h-8 px-3 border-l border-[#E6E6E9] font-medium">
                            <div className="flex items-center gap-1.5">
                              <User className="w-3 h-3 text-[#9CA0AA]" />
                              <span>نام مشتری</span>
                            </div>
                          </th>
                          <th className="h-8 px-3 border-l border-[#E6E6E9] font-medium">
                            <div className="flex items-center gap-1.5">
                              <AtSign className="w-3 h-3 text-[#9CA0AA]" />
                              <span>آیدی اینستاگرام</span>
                            </div>
                          </th>
                          <th className="h-8 px-3 border-l border-[#E6E6E9] font-medium">
                            <div className="flex items-center gap-1.5">
                              <Package className="w-3 h-3 text-[#9CA0AA]" />
                              <span>محصول</span>
                            </div>
                          </th>
                          <th className="h-8 px-3 border-l border-[#E6E6E9] font-medium">
                            <div className="flex items-center gap-1.5">
                              <DollarSign className="w-3 h-3 text-[#9CA0AA]" />
                              <span>مبلغ سفارش</span>
                            </div>
                          </th>
                          <th className="h-8 px-3 border-l border-[#E6E6E9] font-medium">
                            <div className="flex items-center gap-1.5">
                              <Percent className="w-3 h-3 text-[#9CA0AA]" />
                              <span>سود خالص</span>
                            </div>
                          </th>
                          <th className="h-8 px-3 border-l border-[#E6E6E9] font-medium">
                            <div className="flex items-center gap-1.5">
                              <Layers className="w-3 h-3 text-[#9CA0AA]" />
                              <span>وضعیت فعلی</span>
                            </div>
                          </th>
                          <th className="h-8 px-3 border-l border-[#E6E6E9] font-medium">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3 h-3 text-[#9CA0AA]" />
                              <span>آخرین تعامل</span>
                            </div>
                          </th>
                          <th className="h-8 px-3 font-medium">مسئول</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E6E6E9] text-[12.5px]">
                        {filteredPipelineOrders.map((ord) => {
                          const st = STAGE_MAP[ord.stage] || STAGE_MAP.new_order;
                          const isSelected =
                            inspectedRecord?.type === 'order' && inspectedRecord?.id === ord.id;
                          return (
                            <tr
                              key={ord.id}
                              onClick={() => setInspectedRecord({ type: 'order', id: ord.id })}
                              className={`h-9 cursor-pointer transition-colors ${
                                isSelected ? 'bg-[#EFEFF1]' : 'hover:bg-[#F6F6F7]'
                              }`}
                            >
                              <td
                                className="px-2.5 border-l border-[#E6E6E9] text-center"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <input
                                  type="checkbox"
                                  className="accent-[#141416]"
                                  checked={selectedOrderRows.includes(ord.id)}
                                  onChange={(e) =>
                                    setSelectedOrderRows((prev) =>
                                      e.target.checked
                                        ? [...prev, ord.id]
                                        : prev.filter((id) => id !== ord.id)
                                    )
                                  }
                                />
                              </td>
                              <td className="px-3 border-l border-[#E6E6E9] font-medium text-[#141416] whitespace-nowrap">
                                <div className="flex items-center justify-between gap-2">
                                  <span>{ord.customerName}</span>
                                  <span className="text-[10.5px] font-mono text-[#9CA0AA]">
                                    {toPersianDigits(ord.id)}
                                  </span>
                                </div>
                              </td>
                              <td
                                dir="ltr"
                                className="px-3 border-l border-[#E6E6E9] font-mono text-[11.5px] text-[#6F727A] text-right whitespace-nowrap"
                              >
                                {ord.instagram}
                              </td>
                              <td className="px-3 border-l border-[#E6E6E9] text-[#141416] truncate max-w-[220px]">
                                {ord.primaryProductLabel}
                              </td>
                              <td className="px-3 border-l border-[#E6E6E9] font-medium text-[#141416] tabular-nums whitespace-nowrap">
                                {formatCurrency(ord.totalValue)} ت
                              </td>
                              <td className="px-3 border-l border-[#E6E6E9] tabular-nums whitespace-nowrap">
                                <span className="inline-flex items-center gap-1.5 text-[12px]">
                                  <span
                                    className="w-1.5 h-1.5 rounded-full"
                                    style={{
                                      backgroundColor: ord.netProfit >= 0 ? '#059669' : '#DC2626'
                                    }}
                                  />
                                  <span>{formatCurrency(ord.netProfit)} ت</span>
                                </span>
                              </td>
                              <td className="px-3 border-l border-[#E6E6E9] whitespace-nowrap">
                                <StatusChip dotColor={st.dot} label={st.label} />
                              </td>
                              <td className="px-3 border-l border-[#E6E6E9] text-[11.5px] text-[#6F727A] whitespace-nowrap">
                                {ord.lastInteraction}
                              </td>
                              <td className="px-3 text-[11.5px] text-[#6F727A] whitespace-nowrap">
                                {ord.assignedTo}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  /* نمای دوم: برد کانبان به سبک Linear */
                  <div className="flex-1 overflow-x-auto flex divide-x divide-x-reverse divide-[#E6E6E9] bg-[#FBFBFB]">
                    {PIPELINE_STAGES.map((stage) => {
                      const stageOrders = filteredPipelineOrders.filter(
                        (o) => o.stage === stage.id
                      );
                      const stageSum = stageOrders.reduce((s, o) => s + o.totalValue, 0);
                      return (
                        <div
                          key={stage.id}
                          className="w-[265px] shrink-0 flex flex-col h-full"
                        >
                          <div className="h-9 px-3 border-b border-[#E6E6E9] bg-[#FAFAFA] flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: stage.dot }}
                              />
                              <span className="text-[12px] font-semibold text-[#141416]">
                                {stage.label}
                              </span>
                              <span className="text-[11px] text-[#9CA0AA] tabular-nums">
                                {toPersianDigits(stageOrders.length)}
                              </span>
                            </div>
                            <span className="text-[10.5px] text-[#6F727A] tabular-nums">
                              {formatCurrency(stageSum)} ت
                            </span>
                          </div>

                          <div className="p-2 space-y-2 overflow-y-auto flex-1">
                            {stageOrders.map((ord) => {
                              const isSelected =
                                inspectedRecord?.type === 'order' &&
                                inspectedRecord?.id === ord.id;
                              return (
                                <div
                                  key={ord.id}
                                  onClick={() =>
                                    setInspectedRecord({ type: 'order', id: ord.id })
                                  }
                                  className={`p-3 rounded-[5px] bg-[#FFFFFF] border cursor-pointer transition-colors ${
                                    isSelected
                                      ? 'border-[#141416]'
                                      : 'border-[#E6E6E9] hover:border-[#DCDCE0]'
                                  }`}
                                >
                                  <div className="flex items-center justify-between text-[11px] text-[#6F727A] mb-1">
                                    <span className="font-mono">{toPersianDigits(ord.id)}</span>
                                    <span dir="ltr" className="font-mono">
                                      {ord.instagram}
                                    </span>
                                  </div>
                                  <div className="text-[12.5px] font-semibold text-[#141416]">
                                    {ord.customerName}
                                  </div>
                                  <div className="text-[11.5px] text-[#6F727A] mt-1 line-clamp-1">
                                    {ord.primaryProductLabel}
                                  </div>
                                  <div className="mt-2.5 pt-2 border-t border-[#E6E6E9] flex items-center justify-between text-[11.5px] tabular-nums">
                                    <span className="font-medium text-[#141416]">
                                      {formatCurrency(ord.totalValue)} ت
                                    </span>
                                    <span className="flex items-center gap-1 text-[#6F727A]">
                                      <span
                                        className="w-1.5 h-1.5 rounded-full"
                                        style={{
                                          backgroundColor:
                                            ord.netProfit >= 0 ? '#059669' : '#DC2626'
                                        }}
                                      />
                                      سود: {formatCurrency(ord.netProfit)}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ===================================================== */}
            {/* صفحه ۴: مدیریت مشتریان (Customers Table)              */}
            {/* ===================================================== */}
            {activeNav === 'customers' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* نوار فیلتر و مرتب‌سازی مشتریان */}
                <div className="h-9 px-4 border-b border-[#E6E6E9] bg-[#FBFBFB] flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-1.5">
                    {['all', 'مشتری وفادار', 'نیاز به یادآوری', 'مشتری جدید'].map((st) => (
                      <button
                        key={st}
                        onClick={() => setCustomerStatusFilter(st)}
                        className={`px-2.5 py-0.5 rounded-[4px] text-[11px] font-medium ${
                          customerStatusFilter === st
                            ? 'bg-[#141416] text-[#FFFFFF]'
                            : 'text-[#6F727A] hover:bg-[#EFEFF1]'
                        }`}
                      >
                        {st === 'all' ? 'همه مشتریان' : st}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-[#6F727A]">
                    <span>مرتب‌سازی بر اساس:</span>
                    <button
                      onClick={() =>
                        setCustomerSortBy(
                          customerSortBy === 'spending' ? 'orders' : 'spending'
                        )
                      }
                      className="h-6 px-2 rounded-[4px] bg-[#FFFFFF] border border-[#DCDCE0] text-[#141416] font-medium flex items-center gap-1"
                    >
                      <ArrowUpDown className="w-3 h-3 text-[#6F727A]" />
                      <span>
                        {customerSortBy === 'spending' ? 'مجموع خرید (LTV)' : 'تعداد سفارش'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* جدول مشتریان به سبک Attio People Grid */}
                <div className="flex-1 overflow-auto">
                  <table className="w-full border-collapse text-right">
                    <thead className="sticky top-0 z-10 bg-[#FAFAFA] border-b border-[#E6E6E9] text-[11px] text-[#6F727A]">
                      <tr>
                        <th className="h-8 px-3 border-l border-[#E6E6E9] font-medium">نام مشتری</th>
                        <th className="h-8 px-3 border-l border-[#E6E6E9] font-medium">آیدی اینستاگرام</th>
                        <th className="h-8 px-3 border-l border-[#E6E6E9] font-medium">اطلاعات تماس</th>
                        <th className="h-8 px-3 border-l border-[#E6E6E9] font-medium">تعداد سفارش</th>
                        <th className="h-8 px-3 border-l border-[#E6E6E9] font-medium">مجموع خرید (LTV)</th>
                        <th className="h-8 px-3 border-l border-[#E6E6E9] font-medium">آخرین تعامل</th>
                        <th className="h-8 px-3 border-l border-[#E6E6E9] font-medium">وضعیت مشتری</th>
                        <th className="h-8 px-3 font-medium">تاریخ پیگیری</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E6E6E9] text-[12.5px]">
                      {filteredCustomersList.map((c) => {
                        const isSelected =
                          inspectedRecord?.type === 'customer' && inspectedRecord?.id === c.id;
                        return (
                          <tr
                            key={c.id}
                            onClick={() => setInspectedRecord({ type: 'customer', id: c.id })}
                            className={`h-9 cursor-pointer transition-colors ${
                              isSelected ? 'bg-[#EFEFF1]' : 'hover:bg-[#F6F6F7]'
                            }`}
                          >
                            <td className="px-3 border-l border-[#E6E6E9] font-medium text-[#141416]">
                              {c.name}
                            </td>
                            <td
                              dir="ltr"
                              className="px-3 border-l border-[#E6E6E9] font-mono text-[11.5px] text-[#6F727A] text-right"
                            >
                              {c.instagram}
                            </td>
                            <td className="px-3 border-l border-[#E6E6E9] text-[12px] text-[#6F727A] tabular-nums">
                              {toPersianDigits(c.phone)} · {c.city}
                            </td>
                            <td className="px-3 border-l border-[#E6E6E9] tabular-nums">
                              {toPersianDigits(c.totalOrders)} سفارش
                            </td>
                            <td className="px-3 border-l border-[#E6E6E9] font-medium text-[#141416] tabular-nums">
                              {formatCurrency(c.totalSpending)} تومان
                            </td>
                            <td className="px-3 border-l border-[#E6E6E9] text-[11.5px] text-[#6F727A]">
                              {c.lastInteraction}
                            </td>
                            <td className="px-3 border-l border-[#E6E6E9]">
                              <StatusChip dotColor={c.statusDot} label={c.status} />
                            </td>
                            <td className="px-3 text-[11.5px] text-[#6F727A] tabular-nums">
                              {c.followUpDate}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ===================================================== */}
            {/* صفحه ۵: پیگیری‌ها و بازگشت مشتری (Follow-ups)          */}
            {/* ===================================================== */}
            {activeNav === 'followups' && (
              <div className="flex-1 flex flex-col overflow-y-auto">
                <div className="h-9 px-4 border-b border-[#E6E6E9] bg-[#FBFBFB] flex items-center justify-between">
                  <span className="text-[12px] font-medium text-[#141416]">
                    برنامه پیگیری مشتریان بر اساس چرخه مصرف ۴۰ روزه شمع
                  </span>
                  <span className="text-[11px] text-[#6F727A]">
                    سهم مشتریان تکراری از کل فروش: ۵۵.۶٪
                  </span>
                </div>

                <table className="w-full border-collapse text-right">
                  <thead>
                    <tr className="bg-[#FAFAFA] border-b border-[#E6E6E9] text-[11px] text-[#6F727A]">
                      <th className="h-8 px-3 border-l border-[#E6E6E9] font-medium">مشتری</th>
                      <th className="h-8 px-3 border-l border-[#E6E6E9] font-medium">علت پیگیری</th>
                      <th className="h-8 px-3 border-l border-[#E6E6E9] font-medium">زمان سپری‌شده</th>
                      <th className="h-8 px-3 border-l border-[#E6E6E9] font-medium">ارزش تخمینی سفارش</th>
                      <th className="h-8 px-3 border-l border-[#E6E6E9] font-medium">وضعیت</th>
                      <th className="h-8 px-3 font-medium">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E6E6E9] text-[12.5px]">
                    {followUps.map((f) => (
                      <tr key={f.id} className="h-10 hover:bg-[#F6F6F7]">
                        <td className="px-3 border-l border-[#E6E6E9] font-medium text-[#141416]">
                          <div className="flex items-center justify-between">
                            <span>{f.customerName}</span>
                            <span dir="ltr" className="text-[11px] font-mono text-[#6F727A]">
                              {f.instagram}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 border-l border-[#E6E6E9] text-[#141416]">
                          {f.reason}
                        </td>
                        <td className="px-3 border-l border-[#E6E6E9] tabular-nums text-[#6F727A]">
                          {toPersianDigits(f.daysElapsed)} روز پیش ({f.dueDate})
                        </td>
                        <td className="px-3 border-l border-[#E6E6E9] tabular-nums font-medium">
                          {formatCurrency(f.estimatedValue)} تومان
                        </td>
                        <td className="px-3 border-l border-[#E6E6E9]">
                          <StatusChip
                            dotColor={
                              f.status === 'done'
                                ? '#059669'
                                : f.category === 'overdue'
                                ? '#D97706'
                                : '#71717A'
                            }
                            label={
                              f.status === 'done'
                                ? 'پیامک ارسال شد'
                                : f.category === 'overdue'
                                ? 'سررسید گذشته'
                                : 'برنامه‌ریزی شده'
                            }
                          />
                        </td>
                        <td className="px-3">
                          {f.status === 'pending' ? (
                            <button
                              onClick={() => {
                                setFollowUps((prev) =>
                                  prev.map((item) =>
                                    item.id === f.id ? { ...item, status: 'done' } : item
                                  )
                                );
                                notify(
                                  `لینک خرید مجدد با آدرس پیش‌فرض برای ${f.customerName} پیامک شد.`
                                );
                              }}
                              className="h-6 px-2.5 rounded-[4px] bg-[#141416] text-[#FFFFFF] text-[11px] font-medium"
                            >
                              ارسال لینک خرید مجدد (SMS)
                            </button>
                          ) : (
                            <span className="text-[11px] text-[#6F727A]">انجام شد ✓</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* ===================================================== */}
            {/* صفحه ۶: محصولات و بهای تمام‌شده (Products & BOM)       */}
            {/* ===================================================== */}
            {activeNav === 'products' && (
              <div className="flex-1 flex flex-col overflow-y-auto">
                {/* نوار تنظیم نرخ ماده اولیه (موم سویا) */}
                <div className="px-4 py-3 border-b border-[#E6E6E9] bg-[#FBFBFB] flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-[12px] font-medium text-[#141416]">
                      نرخ روز هر کیلوگرم موم سویا (مبنای محاسبه بهای تمام‌شده):
                    </span>
                    <input
                      type="range"
                      min={450000}
                      max={900000}
                      step={25000}
                      value={waxPricePerKg}
                      onChange={(e) => setWaxPricePerKg(Number(e.target.value))}
                      className="w-44 accent-[#141416] cursor-pointer"
                    />
                    <span className="px-2 py-0.5 bg-[#FFFFFF] border border-[#DCDCE0] rounded-[4px] text-[12px] font-semibold tabular-nums">
                      {formatCurrency(waxPricePerKg)} تومان
                    </span>
                  </div>
                  <button
                    onClick={() => setWaxPricePerKg(600000)}
                    className="h-7 px-2.5 rounded-[5px] bg-[#FFFFFF] border border-[#DCDCE0] text-[11px] text-[#6F727A] hover:text-[#141416]"
                  >
                    بازنشانی به نرخ پرونده (۶۰۰,۰۰۰ ت)
                  </button>
                </div>

                {/* جدول ساختاریافته BOM و حاشیه سود */}
                <table className="w-full border-collapse text-right">
                  <thead>
                    <tr className="bg-[#FAFAFA] border-b border-[#E6E6E9] text-[11px] text-[#6F727A]">
                      <th className="h-8 px-3 border-l border-[#E6E6E9] font-medium">کد / نام محصول</th>
                      <th className="h-8 px-3 border-l border-[#E6E6E9] font-medium">مصرف موم</th>
                      <th className="h-8 px-3 border-l border-[#E6E6E9] font-medium">هزینه موم</th>
                      <th className="h-8 px-3 border-l border-[#E6E6E9] font-medium">ظرف، اسانس و جعبه</th>
                      <th className="h-8 px-3 border-l border-[#E6E6E9] font-medium">بهای تمام‌شده (COGS)</th>
                      <th className="h-8 px-3 border-l border-[#E6E6E9] font-medium">قیمت فروش فعلی</th>
                      <th className="h-8 px-3 border-l border-[#E6E6E9] font-medium">سود خالص (حاشیه)</th>
                      <th className="h-8 px-3 font-medium">اقدام اصلاح قیمت</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E6E6E9] text-[12.5px] tabular-nums">
                    {computedProducts.map((p) => (
                      <tr key={p.id} className="h-10 hover:bg-[#F6F6F7]">
                        <td className="px-3 border-l border-[#E6E6E9]">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-medium text-[#141416]">{p.name}</span>
                            <span className="text-[10.5px] font-mono text-[#9CA0AA]">{p.sku}</span>
                          </div>
                        </td>
                        <td className="px-3 border-l border-[#E6E6E9] text-[#6F727A]">
                          {toPersianDigits(p.waxGrams)} گرم
                        </td>
                        <td className="px-3 border-l border-[#E6E6E9] text-[#6F727A]">
                          {formatCurrency(p.waxCost)} ت
                        </td>
                        <td className="px-3 border-l border-[#E6E6E9] text-[#6F727A]">
                          {formatCurrency(p.otherCosts)} ت
                        </td>
                        <td className="px-3 border-l border-[#E6E6E9] font-medium text-[#141416]">
                          {formatCurrency(p.totalCogs)} تومان
                        </td>
                        <td className="px-3 border-l border-[#E6E6E9] font-semibold text-[#141416]">
                          {formatCurrency(p.price)} تومان
                        </td>
                        <td className="px-3 border-l border-[#E6E6E9]">
                          <StatusChip
                            dotColor={p.isLoss ? '#DC2626' : '#059669'}
                            label={`${formatCurrency(p.netProfit)} ت (${toPersianDigits(p.marginPct)}٪)`}
                          />
                        </td>
                        <td className="px-3">
                          {p.isLoss ? (
                            <button
                              onClick={() => handleFixProductPrice(p.id, p.suggestedPrice)}
                              className="h-6 px-2.5 rounded-[4px] bg-[#141416] text-[#FFFFFF] text-[11px] font-medium"
                            >
                              اعمال قیمت {formatCurrency(p.suggestedPrice)} ت
                            </button>
                          ) : p.id === 'p1' && p.price !== 420000 ? (
                            <button
                              onClick={() => handleFixProductPrice('p1', 420000)}
                              className="text-[11px] text-[#6F727A] hover:text-[#141416] underline"
                            >
                              بازگردانی به قیمت ضررده (۴۲۰,۰۰۰)
                            </button>
                          ) : (
                            <span className="text-[11px] text-[#6F727A]">حاشیه سود امن ✓</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* ===================================================== */}
            {/* صفحه ۷: گزارش عملکرد (Analytics)                       */}
            {/* ===================================================== */}
            {activeNav === 'analytics' && (
              <div className="flex-1 flex flex-col overflow-y-auto divide-y divide-[#E6E6E9]">
                <div className="p-4 bg-[#FBFBFB]">
                  <h2 className="text-[13px] font-semibold text-[#141416]">
                    سنجش تاثیر استقرار سیستم (مقایسه خط پایه پرونده با عملکرد فعلی محیط کار)
                  </h2>
                  <p className="text-[11.5px] text-[#6F727A] mt-0.5">
                    مبتنی بر داده‌های ۲۰۰ پرسشنامه، ۳۱۵ پیام دایرکت و دفاتر مالی شمع نورا
                  </p>
                </div>

                <table className="w-full border-collapse text-right">
                  <thead>
                    <tr className="bg-[#FAFAFA] border-b border-[#E6E6E9] text-[11px] text-[#6F727A]">
                      <th className="h-8 px-4 border-l border-[#E6E6E9] font-medium">شاخص کلیدی عملکرد (KPI)</th>
                      <th className="h-8 px-4 border-l border-[#E6E6E9] font-medium">وضعیت سنتی در پرونده (Baseline)</th>
                      <th className="h-8 px-4 border-l border-[#E6E6E9] font-medium">عملکرد پس از استقرار اوردرینو</th>
                      <th className="h-8 px-4 font-medium">مکانیسم حل مسئله</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E6E6E9] text-[12.5px]">
                    <tr className="h-10">
                      <td className="px-4 border-l border-[#E6E6E9] font-medium">زمان روزانه پاسخ به دایرکت</td>
                      <td className="px-4 border-l border-[#E6E6E9] text-[#6F727A]">۳.۴ ساعت در روز (۶۴٪ شبانه بعد از ساعت ۲۲)</td>
                      <td className="px-4 border-l border-[#E6E6E9]">
                        <StatusChip dotColor="#059669" label="۴۲ دقیقه در روز (۷۸٪ کاهش)" />
                      </td>
                      <td className="px-4 text-[#6F727A]">حذف ۴.۳ پیام رفت‌وبرگشتی با لینک ویترین</td>
                    </tr>
                    <tr className="h-10">
                      <td className="px-4 border-l border-[#E6E6E9] font-medium">نرخ گم‌شدن و فراموشی سفارش</td>
                      <td className="px-4 border-l border-[#E6E6E9] text-[#6F727A]">۶۵.۵٪ (حتی در کاربران اکسل ۶۵.۰٪)</td>
                      <td className="px-4 border-l border-[#E6E6E9]">
                        <StatusChip dotColor="#059669" label="۰٪ سفارش گم‌شده" />
                      </td>
                      <td className="px-4 text-[#6F727A]">حذف انتقال دستی و ثبت مستقیم از فرم و AI</td>
                    </tr>
                    <tr className="h-10">
                      <td className="px-4 border-l border-[#E6E6E9] font-medium">پوشش دیتابیس مشتریان و فروش مجدد</td>
                      <td className="px-4 border-l border-[#E6E6E9] text-[#6F727A]">۸۳٪ بدون لیست مشتری (۴۶.۲٪ فروش تکراری)</td>
                      <td className="px-4 border-l border-[#E6E6E9]">
                        <StatusChip dotColor="#059669" label="۱۰۰٪ ثبت پروفایل · ۶۴٪ فروش تکراری" />
                      </td>
                      <td className="px-4 text-[#6F727A]">ذخیره خودکار آدرس و یادآوری چرخه مصرف</td>
                    </tr>
                    <tr className="h-10">
                      <td className="px-4 border-l border-[#E6E6E9] font-medium">کنترل حاشیه سود و بهای تمام‌شده</td>
                      <td className="px-4 border-l border-[#E6E6E9] text-[#6F727A]">۸۱.۵٪ بدون محاسبه دقیق (۲۳,۰۰۰ ت ضرر هر شمع بزرگ)</td>
                      <td className="px-4 border-l border-[#E6E6E9]">
                        <StatusChip dotColor="#059669" label="شفافیت ۱۰۰٪ سود لحظه‌ای هر سفارش" />
                      </td>
                      <td className="px-4 text-[#6F727A]">محاسبه پویای BOM بر اساس نرخ روز مواد اولیه</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* ===================================================== */}
            {/* صفحه ۸: تنظیمات محیط کار (Settings)                    */}
            {/* ===================================================== */}
            {activeNav === 'settings' && (
              <div className="flex-1 p-5 overflow-y-auto space-y-5 max-w-2xl">
                <div className="border border-[#E6E6E9] rounded-[5px] divide-y divide-[#E6E6E9]">
                  <div className="p-3.5 bg-[#FBFBFB] font-semibold text-[12.5px]">
                    تنظیمات لینک ویترین ۱ دقیقه‌ای (بدون نیاز به فیلترشکن)
                  </div>
                  <div className="p-3.5 flex items-center justify-between gap-3">
                    <span dir="ltr" className="font-mono text-[12.5px] text-[#141416]">
                      https://noora.ordr.ir
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => notify('لینک ویترین در کلیپ‌بورد کپی شد.')}
                        className="h-7 px-2.5 rounded-[5px] bg-[#FFFFFF] border border-[#DCDCE0] text-[11.5px] font-medium"
                      >
                        کپی لینک
                      </button>
                      <button
                        onClick={() => setWorkspaceMode('storefront')}
                        className="h-7 px-2.5 rounded-[5px] bg-[#141416] text-[#FFFFFF] text-[11.5px] font-medium"
                      >
                        باز کردن ویترین
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border border-[#E6E6E9] rounded-[5px] divide-y divide-[#E6E6E9]">
                  <div className="p-3.5 bg-[#FBFBFB] font-semibold text-[12.5px]">
                    قالب پاسخ آماده دایرکت (Instagram Quick Reply)
                  </div>
                  <div className="p-3.5 space-y-2">
                    <p className="text-[12px] text-[#6F727A] leading-relaxed">
                      سلام وقت بخیر، موجودی و قیمت روز شمع‌ها رو می‌تونید بدون نیاز به فیلترشکن در لینک زیر ببینید و در ۱ دقیقه سفارشتون رو ثبت کنید (کد رهگیری پستی خودکار براتون پیامک می‌شه): https://noora.ordr.ir
                    </p>
                    <button
                      onClick={() => notify('متن پاسخ آماده کپی شد.')}
                      className="h-7 px-2.5 rounded-[5px] bg-[#FFFFFF] border border-[#DCDCE0] text-[11.5px] font-medium"
                    >
                      کپی متن پاسخ آماده
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>

          {/* ۳. پنل بازرسی رکورد در سمت چپ (Attio Record Inspector Drawer - 350px) */}
          {(activeInspectedOrder || activeInspectedCustomer) && (
            <aside className="w-[350px] shrink-0 bg-[#FFFFFF] border-r border-[#E6E6E9] flex flex-col overflow-y-auto">
              {/* هدر پنل بازرسی */}
              <div className="h-11 px-3.5 border-b border-[#E6E6E9] bg-[#FBFBFB] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-semibold text-[#141416]">
                    {activeInspectedOrder
                      ? `پرونده سفارش ${toPersianDigits(activeInspectedOrder.id)}`
                      : `پرونده مشتری ${activeInspectedCustomer?.name}`}
                  </span>
                </div>
                <button
                  onClick={() => setInspectedRecord(null)}
                  className="w-6 h-6 rounded-[4px] hover:bg-[#EFEFF1] flex items-center justify-center text-[#6F727A]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* محتوای بازرسی سفارش */}
              {activeInspectedOrder && (
                <div className="divide-y divide-[#E6E6E9] text-[12px]">
                  {/* تغییر سریع مرحله پایپ‌لاین */}
                  <div className="p-3.5 space-y-2">
                    <div className="text-[11px] text-[#6F727A]">مرحله پایپ‌لاین فروش</div>
                    <select
                      value={activeInspectedOrder.stage}
                      onChange={(e) =>
                        handleUpdateOrderStage(activeInspectedOrder.id, e.target.value)
                      }
                      className="w-full h-8 px-2.5 bg-[#FFFFFF] border border-[#DCDCE0] rounded-[5px] text-[12px] font-medium text-[#141416] outline-none"
                    >
                      {PIPELINE_STAGES.map((st) => (
                        <option key={st.id} value={st.id}>
                          {st.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* جدول ویژگی‌ها (Attio Key-Value Properties) */}
                  <div className="divide-y divide-[#E6E6E9]">
                    <div className="px-3.5 py-2 flex items-center justify-between">
                      <span className="text-[#6F727A]">مشتری</span>
                      <button
                        onClick={() =>
                          setInspectedRecord({
                            type: 'customer',
                            id: activeInspectedOrder.customerId
                          })
                        }
                        className="font-medium text-[#141416] hover:underline"
                      >
                        {activeInspectedOrder.customerName}
                      </button>
                    </div>
                    <div className="px-3.5 py-2 flex items-center justify-between">
                      <span className="text-[#6F727A]">اینستاگرام</span>
                      <span dir="ltr" className="font-mono text-[#141416]">
                        {activeInspectedOrder.instagram}
                      </span>
                    </div>
                    <div className="px-3.5 py-2 flex items-center justify-between">
                      <span className="text-[#6F727A]">تلفن همراه</span>
                      <span className="font-mono text-[#141416]">
                        {toPersianDigits(activeInspectedOrder.phone)}
                      </span>
                    </div>
                    <div className="px-3.5 py-2 flex items-center justify-between">
                      <span className="text-[#6F727A]">کد پستی</span>
                      <span className="font-mono text-[#141416]">
                        {toPersianDigits(activeInspectedOrder.postalCode)}
                      </span>
                    </div>
                    <div className="px-3.5 py-2">
                      <div className="text-[#6F727A] mb-1">آدرس ارسال</div>
                      <div className="text-[#141416] leading-relaxed">
                        {activeInspectedOrder.address}
                      </div>
                    </div>
                    <div className="px-3.5 py-2 flex items-center justify-between">
                      <span className="text-[#6F727A]">وضعیت پرداخت</span>
                      <span className="text-[#141416]">{activeInspectedOrder.paymentStatus}</span>
                    </div>
                    <div className="px-3.5 py-2 flex items-center justify-between tabular-nums">
                      <span className="text-[#6F727A]">مبلغ کل سفارش</span>
                      <span className="font-semibold text-[#141416]">
                        {formatCurrency(activeInspectedOrder.totalValue)} تومان
                      </span>
                    </div>
                    <div className="px-3.5 py-2 flex items-center justify-between tabular-nums">
                      <span className="text-[#6F727A]">سود خالص واقعی</span>
                      <StatusChip
                        dotColor={
                          activeInspectedOrder.netProfit >= 0 ? '#059669' : '#DC2626'
                        }
                        label={`${formatCurrency(activeInspectedOrder.netProfit)} تومان`}
                      />
                    </div>
                  </div>

                  {/* اقلام سفارش */}
                  <div className="p-3.5 space-y-2">
                    <div className="text-[11px] text-[#6F727A]">اقلام سفارش</div>
                    <div className="border border-[#E6E6E9] rounded-[5px] divide-y divide-[#E6E6E9]">
                      {activeInspectedOrder.detailedItems.map((it, idx) => (
                        <div key={idx} className="p-2.5 space-y-1">
                          <div className="flex justify-between font-medium text-[#141416]">
                            <span>
                              {toPersianDigits(it.count)}× {it.productName}
                            </span>
                            <span className="tabular-nums">{formatCurrency(it.lineValue)} ت</span>
                          </div>
                          {it.note && (
                            <div className="text-[11px] text-[#6F727A]">{it.note}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ثبت بارکد پستی ۲۰ رقمی و ارسال خودکار پیامک */}
                  <div className="p-3.5 space-y-2">
                    <div className="text-[11px] text-[#6F727A]">
                      کد رهگیری پستی (ارسال خودکار SMS به مشتری)
                    </div>
                    {activeInspectedOrder.trackingCode ? (
                      <div className="p-2.5 bg-[#FBFBFB] border border-[#E6E6E9] rounded-[5px] flex items-center justify-between">
                        <span className="font-mono text-[11.5px] text-[#141416]">
                          {toPersianDigits(activeInspectedOrder.trackingCode)}
                        </span>
                        <span className="text-[11px] text-[#059669]">پیامک شد ✓</span>
                      </div>
                    ) : (
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          dir="ltr"
                          value={trackingInput}
                          onChange={(e) => setTrackingInput(e.target.value)}
                          placeholder="بارکد ۲۰ رقمی پست..."
                          className="flex-1 h-7 px-2 bg-[#FFFFFF] border border-[#DCDCE0] rounded-[4px] text-[11.5px] font-mono text-left outline-none"
                        />
                        <button
                          onClick={() =>
                            handleAssignTrackingCode(activeInspectedOrder.id, trackingInput)
                          }
                          className="h-7 px-2.5 rounded-[4px] bg-[#141416] text-[#FFFFFF] text-[11px] font-medium shrink-0"
                        >
                          ثبت و پیامک
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* محتوای بازرسی پرونده مشتری (Customer Detail View) */}
              {activeInspectedCustomer && (
                <div className="divide-y divide-[#E6E6E9] text-[12px]">
                  <div className="p-3.5 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-[13.5px] text-[#141416]">
                        {activeInspectedCustomer.name}
                      </div>
                      <div dir="ltr" className="font-mono text-[11px] text-[#6F727A] text-right">
                        {activeInspectedCustomer.instagram}
                      </div>
                    </div>
                    <StatusChip
                      dotColor={activeInspectedCustomer.statusDot}
                      label={activeInspectedCustomer.status}
                    />
                  </div>

                  <div className="divide-y divide-[#E6E6E9]">
                    <div className="px-3.5 py-2 flex justify-between">
                      <span className="text-[#6F727A]">تلفن همراه</span>
                      <span className="font-mono">
                        {toPersianDigits(activeInspectedCustomer.phone)}
                      </span>
                    </div>
                    <div className="px-3.5 py-2 flex justify-between tabular-nums">
                      <span className="text-[#6F727A]">تعداد کل سفارش‌ها</span>
                      <span className="font-medium">
                        {toPersianDigits(activeInspectedCustomer.totalOrders)} نوبت
                      </span>
                    </div>
                    <div className="px-3.5 py-2 flex justify-between tabular-nums">
                      <span className="text-[#6F727A]">مجموع خرید (LTV)</span>
                      <span className="font-semibold">
                        {formatCurrency(activeInspectedCustomer.totalSpending)} تومان
                      </span>
                    </div>
                    <div className="px-3.5 py-2 flex justify-between">
                      <span className="text-[#6F727A]">رایحه محبوب</span>
                      <span>{activeInspectedCustomer.favoriteScent}</span>
                    </div>
                    <div className="px-3.5 py-2 flex justify-between">
                      <span className="text-[#6F727A]">تاریخ پیگیری بعدی</span>
                      <span className="tabular-nums">{activeInspectedCustomer.followUpDate}</span>
                    </div>
                    <div className="px-3.5 py-2">
                      <div className="text-[#6F727A] mb-1">آدرس ذخیره شده در CRM</div>
                      <div className="text-[#141416] leading-relaxed">
                        {activeInspectedCustomer.address} (کد پستی:{' '}
                        {toPersianDigits(activeInspectedCustomer.postalCode)})
                      </div>
                    </div>
                  </div>

                  {/* یادداشت‌های داخلی فروشنده */}
                  <div className="p-3.5 space-y-2">
                    <div className="text-[11px] text-[#6F727A]">یادداشت داخلی</div>
                    <div className="p-2.5 bg-[#FBFBFB] border border-[#E6E6E9] rounded-[5px] text-[#141416]">
                      {activeInspectedCustomer.notes}
                    </div>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={noteInput}
                        onChange={(e) => setNoteInput(e.target.value)}
                        placeholder="افزودن یادداشت جدید..."
                        className="flex-1 h-7 px-2 bg-[#FFFFFF] border border-[#DCDCE0] rounded-[4px] text-[11.5px] outline-none"
                      />
                      <button
                        onClick={() => {
                          if (!noteInput.trim()) return;
                          setCustomers((prev) =>
                            prev.map((c) =>
                              c.id === activeInspectedCustomer.id
                                ? {
                                    ...c,
                                    notes: noteInput,
                                    interactions: [
                                      { date: 'امروز', text: `یادداشت: ${noteInput}` },
                                      ...c.interactions
                                    ]
                                  }
                                : c
                            )
                          );
                          setNoteInput('');
                          notify('یادداشت در پرونده مشتری ثبت شد.');
                        }}
                        className="h-7 px-2.5 rounded-[4px] bg-[#141416] text-[#FFFFFF] text-[11px] font-medium"
                      >
                        ثبت
                      </button>
                    </div>
                  </div>

                  {/* تایم‌لاین تعاملات مشتری */}
                  <div className="p-3.5 space-y-2.5">
                    <div className="text-[11px] text-[#6F727A]">تاریخچه تعاملات و سفارش‌ها</div>
                    <div className="relative pr-3 border-r border-[#E6E6E9] space-y-2.5">
                      {activeInspectedCustomer.interactions.map((it, idx) => (
                        <div key={idx} className="relative">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#9CA0AA] absolute -right-[15.5px] top-1.5" />
                          <div className="text-[11.5px] text-[#141416]">{it.text}</div>
                          <div className="text-[10px] text-[#9CA0AA]">{it.date}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </aside>
          )}
        </div>
      )}
    </div>
  );
}