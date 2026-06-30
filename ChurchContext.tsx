import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type Member = {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  joinedDate: string;
  photo: string;
};

export type ChatMessage = {
  id: string;
  from: string;
  to: string;
  text: string;
  time: number;
};

export type EventItem = {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  image: string;
  type: 'service' | 'event';
};

export type Branch = {
  id: string;
  name: string;
  address: string;
  pastor: string;
  phone: string;
  image: string;
};

export type MediaItem = {
  id: string;
  title: string;
  url: string;
  platform: 'youtube' | 'tiktok' | 'instagram';
  thumbnail: string;
};

export type OrphanageImage = { id: string; src: string; caption: string };
export type BuildingImage = { id: string; src: string; caption: string };
export type BibleImage = { id: string; src: string; caption: string };
export type Book = {
  id: string;
  title: string;
  author: string;
  cover: string;
  description: string;
  price: number;
  currency: string;
  buyLink: string;
};
export type Testimony = {
  id: string;
  title: string;
  author: string;
  videoUrl: string;
  description: string;
  submittedAt: number;
};
export type Founder = {
  name: string;
  title: string;
  image: string;
  bio: string;
  signature: string;
  yearsInMinistry: number;
  quote: string;
};
export type PartnershipSubmission = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  partnershipType: string;
  affirmation: string[];
  message: string;
  submittedAt: number;
};
export type StreamPlatform = 'youtube' | 'facebook' | 'twitch' | 'instagram' | 'tiktok' | 'local' | 'custom';
export type NotificationRecord = {
  id: string;
  memberName: string;
  memberPhone: string;
  method: 'sms' | 'whatsapp';
  message: string;
  sentAt: number;
};
export type OnlineMember = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  joinedAt: number;
};
export type NotifySubscriber = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  subscribedAt: number;
  permissionGranted: boolean;
};
export type LiveOffering = {
  id: string;
  fullName: string;
  amount: number;
  reference: string;
  message: string;
  submittedAt: number;
};
export type CrusadeDonation = {
  id: string;
  fullName: string;
  email: string;
  amount: number;
  paymentMethod: string;
  message: string;
  submittedAt: number;
};
export type BibleSchoolEnrollment = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  age: string;
  education: string;
  motivation: string;
  submittedAt: number;
};
export type BuildingDonation = {
  id: string;
  fullName: string;
  email: string;
  amount: number;
  paymentMethod: string;
  message: string;
  submittedAt: number;
};
export type OrphanageDonation = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  donationType: string;
  amount: number;
  itemDescription: string;
  message: string;
  submittedAt: number;
};
export type BookPurchaseItem = {
  bookId: string;
  bookTitle: string;
  quantity: number;
  price: number;
};
export type BookPurchase = {
  id: string;
  items: BookPurchaseItem[];
  // Legacy single-book fields (for backward compatibility)
  bookId?: string;
  bookTitle?: string;
  quantity?: number;
  totalPrice: number;
  fullName: string;
  email: string;
  phone: string;
  shippingAddress: string;
  paymentMethod: string;
  message: string;
  submittedAt: number;
};

export type ChurchData = {
  partnerSubmissions: PartnershipSubmission[];
  adminPin: string;
  name: string;
  motto: string;
  logo: string;
  heroVideoUrl: string;
  livestreamUrl: string;
  givingTitle: string;
  givingDescription: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  paypalLink: string;
  members: Member[];
  events: EventItem[];
  branches: Branch[];
  media: MediaItem[];
  testimonies: Testimony[];
  orphanageImages: OrphanageImage[];
  buildingImages: BuildingImage[];
  bibleImages: BibleImage[];
  bibleSchoolDescription: string;
  bibleSchoolName: string;
  bibleSchoolImage: string;
  bibleEnrollments: BibleSchoolEnrollment[];
  buildingProjectDescription: string;
  orphanageName: string;
  orphanageDescription: string;
  orphanageHomeImage: string;
  pastorName: string;
  pastorBio: string;
  founder: Founder;
  books: Book[];
  partnershipNote: string;
  partnershipAffirmation: string;
  isLive: boolean;
  onlineMembers: OnlineMember[];
  notifySubscribers: NotifySubscriber[];
  liveNotificationTitle: string;
  liveNotificationMessage: string;
  streamUrl: string;
  streamPlatform: StreamPlatform;
  broadcastEnabled: boolean;
  broadcastPeerId: string;
  notificationRecords: NotificationRecord[];
  momoNumber: string;
  momoName: string;
  momoNetwork: string;
  paymentLink: string;
  liveOfferings: LiveOffering[];
  crusadeTruckImage: string;
  crusadeTruckGoal: number;
  crusadeTruckRaised: number;
  crusadeTruckDescription: string;
  crusadeDonations: CrusadeDonation[];
  buildingAuditoriumImage: string;
  buildingAuditoriumGoal: number;
  buildingAuditoriumRaised: number;
  buildingAuditoriumDescription: string;
  buildingDonations: BuildingDonation[];
  orphanageDonations: OrphanageDonation[];
  bookPurchases: BookPurchase[];
  homeGallery: { id: string; src: string; caption: string }[];
  contactAddress: string;
  contactPhone: string;
  contactEmail: string;
};

const DEFAULT_DATA: ChurchData = {
  name: 'Grace Covenant Church',
  motto: 'Rooted in Faith, Growing in Love',
  logo: '⛪',
  heroVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
  livestreamUrl: 'https://www.youtube.com/embed/jfKfPfyJRdk',
  givingTitle: 'Give Cheerfully',
  givingDescription: 'Your generous offerings and tithes help us spread the gospel, support our orphanage, and continue the building of our new sanctuary. God loves a cheerful giver — 2 Corinthians 9:7',
  bankName: 'First Grace Bank',
  accountNumber: '0123456789',
  accountName: 'Grace Covenant Church',
  paypalLink: 'https://paypal.me/gracecovenant',
  pastorName: 'Pastor James & Mary Okonkwo',
  pastorBio: 'Pastor James has led Grace Covenant Church for over 18 years, alongside his wife Mary. Together they shepherd a vibrant community of believers committed to worship, discipleship, and service.',
  founder: {
    name: 'Apostle James Okonkwo',
    title: 'Founder & Senior Pastor',
    image: '/images/founder.jpg',
    bio: 'Apostle James Okonkwo is a seasoned man of God with over 30 years of ministerial experience. A dynamic preacher, author, and mentor, he has planted churches across the nation and raised a generation of leaders for Christ. His life is devoted to preaching the unsearchable riches of Christ and building a people zealous for good works.',
    signature: '— Apostle James Okonkwo',
    yearsInMinistry: 30,
    quote: 'My calling is not just to preach the gospel, but to see every believer walk in the fullness of their destiny in Christ Jesus.',
  },
  partnershipNote: 'Partnering with Grace Covenant Church means you are sowing into a vision that is transforming lives, planting churches, caring for orphans, and advancing the gospel to the ends of the earth. When you partner with us, you are not just supporting a ministry — you are joining a family committed to seeing God\'s kingdom come on earth. Every seed you give, every prayer you pray, and every hour you serve is a living offering unto the Lord. "For I know the plans I have for you," declares the LORD, "plans to prosper you and not to harm you, plans to give you hope and a future." — Jeremiah 29:11',
  partnershipAffirmation: 'I affirm before God and men that I am joining Grace Covenant Church as a covenant partner. I believe in the vision, I stand with the leadership, and I commit to pray, give, and serve for the advancement of the gospel. I decree that as I partner in faith, God will open the windows of heaven and pour out a blessing I will not have room enough to receive (Malachi 3:10). My seed shall not fail, my prayers shall be answered, and my life shall be a testimony of God\'s faithfulness. In Jesus\' mighty name, Amen.',
  isLive: false,
  onlineMembers: [],
  notifySubscribers: [],
  liveNotificationTitle: '🔴 We are LIVE now!',
  liveNotificationMessage: 'Grace Covenant Church is streaming right now. Join us in worship!',
  streamUrl: 'https://www.youtube.com/embed/jfKfPfyJRdk',
  streamPlatform: 'youtube',
  broadcastEnabled: false,
  broadcastPeerId: '',
  notificationRecords: [],
  momoNumber: '+233 24 123 4567',
  momoName: 'Grace Covenant Church',
  momoNetwork: 'MTN MoMo',
  paymentLink: 'https://paystack.com/pay/gracecovenant',
  liveOfferings: [],
  crusadeTruckImage: '/images/crusade-truck.jpg',
  crusadeTruckGoal: 75000,
  crusadeTruckRaised: 18450,
  crusadeTruckDescription: 'The Crusade Truck is our mobile evangelism platform — a fully-equipped vehicle with a raised stage, professional sound system, and lighting that can be set up in any town, village, or open field to preach the gospel to thousands at a time. This truck will carry the presence of God to unreached communities, bringing salvation, healing, and deliverance to souls who have never heard the name of Jesus. Your seed is helping us take the gospel beyond the four walls of the church and into the highways and byways. "Go into all the world and preach the gospel to every creature." — Mark 16:15',
  crusadeDonations: [],
  buildingAuditoriumImage: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200',
  buildingAuditoriumGoal: 250000,
  buildingAuditoriumRaised: 87500,
  buildingAuditoriumDescription: 'We are building a 2,000-seat auditorium with a prayer tower, children\'s wing, and community hall — a permanent home for our growing family of believers. This sanctuary will host weekly worship services, crusades, conferences, and community outreach for generations to come. Every brick is a testimony of faith. "Unless the LORD builds the house, the builders labor in vain." — Psalm 127:1',
  buildingDonations: [],
  orphanageDonations: [],
  bookPurchases: [],
  homeGallery: [
    { id: 'hg1', src: '/images/gallery1.jpg', caption: 'Sunday Worship Service' },
    { id: 'hg2', src: '/images/gallery2.jpg', caption: 'Community Fellowship' },
    { id: 'hg3', src: '/images/gallery3.jpg', caption: 'Choir in Praise' },
    { id: 'hg4', src: '/images/gallery4.jpg', caption: 'Prayer Meeting' },
  ],
  partnerSubmissions: [],
  adminPin: '7771',
  books: [
    {
      id: 'bk1',
      title: 'Daily Bread',
      author: 'Apostle James Okonkwo',
      cover: '/images/book1.jpg',
      description: 'A 365-day devotional journey filled with scriptural wisdom, prayers, and prophetic declarations for every season of your life.',
      price: 180,
      currency: '₵',
      buyLink: '/books',
    },
    {
      id: 'bk2',
      title: 'Walking in Authority',
      author: 'Apostle James Okonkwo',
      cover: '/images/book2.jpg',
      description: 'Discover the power you carry as a believer. A powerful teaching on spiritual authority, warfare, and dominion in Christ.',
      price: 220,
      currency: '₵',
      buyLink: '/books',
    },
    {
      id: 'bk3',
      title: 'Covenant Love',
      author: 'Apostle James Okonkwo & Mary Okonkwo',
      cover: '/images/book3.jpg',
      description: 'A God-given blueprint for marriages and families. Build a home that honors God and raises a godly generation.',
      price: 160,
      currency: '₵',
      buyLink: '/books',
    },
    {
      id: 'bk4',
      title: 'On Your Knees',
      author: 'Apostle James Okonkwo',
      cover: '/images/book4.jpg',
      description: 'The leader\'s secret weapon. A powerful guide to the place of prayer in leadership, ministry, and personal breakthrough.',
      price: 200,
      currency: '₵',
      buyLink: '/books',
    },
  ],
  contactAddress: '12 Kingdom Avenue, Grace City',
  contactPhone: '+1 (555) 010-2024',
  contactEmail: 'hello@gracecovenant.org',
  bibleSchoolDescription: 'Our Bible School equips believers with deep understanding of the Word of God. Classes run every Saturday from 9am to 1pm, covering Old Testament, New Testament, Systematic Theology, Christian Living, and Evangelism. Join us and grow deeper in faith.',
  bibleSchoolName: 'Act Of Faith Bible School',
  bibleSchoolImage: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=1200',
  bibleEnrollments: [],
  buildingProjectDescription: 'We are building a new 2,000-seat sanctuary with a dedicated prayer tower, children\'s wing, and community hall. Your support makes this dream possible — every brick is a testimony.',
  orphanageName: 'Act Of Faith Orphanage Home',
  orphanageDescription: 'Act Of Faith Orphanage Home is a sanctuary of love, housing over 45 beautiful children who receive care, education, and the Gospel daily. Every child deserves a home, a family, and a future in Christ. Your support changes lives eternally.',
  orphanageHomeImage: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200',
  members: [
    { id: 'm1', name: 'David Okafor', role: 'Choir Director', phone: '+1 555-0101', email: 'david@church.org', joinedDate: '2018-03-12', photo: 'https://i.pravatar.cc/150?img=12' },
    { id: 'm2', name: 'Sarah Johnson', role: 'Youth Leader', phone: '+1 555-0102', email: 'sarah@church.org', joinedDate: '2019-07-04', photo: 'https://i.pravatar.cc/150?img=47' },
    { id: 'm3', name: 'Michael Adeyemi', role: 'Usher', phone: '+1 555-0103', email: 'michael@church.org', joinedDate: '2020-01-22', photo: 'https://i.pravatar.cc/150?img=33' },
    { id: 'm4', name: 'Grace Williams', role: 'Prayer Warrior', phone: '+1 555-0104', email: 'grace@church.org', joinedDate: '2017-11-30', photo: 'https://i.pravatar.cc/150?img=45' },
    { id: 'm5', name: 'Peter Okoro', role: 'Media Team', phone: '+1 555-0105', email: 'peter@church.org', joinedDate: '2021-05-18', photo: 'https://i.pravatar.cc/150?img=60' },
    { id: 'm6', name: 'Rebecca Thomas', role: 'Children Ministry', phone: '+1 555-0106', email: 'rebecca@church.org', joinedDate: '2019-09-09', photo: 'https://i.pravatar.cc/150?img=44' },
  ],
  events: [
    { id: 'e1', title: 'Sunday Worship Service', date: '2026-03-02', time: '9:00 AM', description: 'Weekly worship service with praise, worship, and the Word of God.', image: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800', type: 'service' },
    { id: 'e2', title: 'Wednesday Bible Study', date: '2026-03-05', time: '6:30 PM', description: 'Mid-week deep dive into the Scriptures with Pastor James.', image: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800', type: 'service' },
    { id: 'e3', title: 'Annual Revival Conference', date: '2026-04-15', time: '5:00 PM', description: 'Three days of power, miracles, and revival. Guest ministers from across the nation.', image: 'https://images.unsplash.com/photo-1519491050282-cf00c82424cb?w=800', type: 'event' },
    { id: 'e4', title: 'Youth Outreach', date: '2026-03-22', time: '2:00 PM', description: 'Taking the gospel to the streets and schools.', image: 'https://images.unsplash.com/photo-1529070538774-178fbcb2c71f?w=800', type: 'event' },
  ],
  branches: [
    { id: 'b1', name: 'Grace Covenant - Main Campus', address: '12 Kingdom Avenue, Grace City', pastor: 'Pastor James Okonkwo', phone: '+1 555-0100', image: 'https://images.unsplash.com/photo-1519491050282-cf00c82424cb?w=800' },
    { id: 'b2', name: 'Grace Covenant - North Branch', address: '45 Faith Road, North District', pastor: 'Pastor Samuel Ade', phone: '+1 555-0110', image: 'https://images.unsplash.com/photo-1510936111840-65e151ad71bb?w=800' },
    { id: 'b3', name: 'Grace Covenant - East Branch', address: '78 Hope Street, East Side', pastor: 'Pastor Rachel Ben', phone: '+1 555-0120', image: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=800' },
    { id: 'b4', name: 'Grace Covenant - West Branch', address: '23 Mercy Lane, West Valley', pastor: 'Pastor Daniel Cole', phone: '+1 555-0130', image: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800' },
  ],
  media: [
    { id: 'md1', title: 'Sunday Sermon - Walking in Faith', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', platform: 'youtube', thumbnail: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=400' },
    { id: 'md2', title: 'Praise & Worship Highlights', url: 'https://www.youtube.com/embed/jfKfPfyJRdk', platform: 'youtube', thumbnail: 'https://images.unsplash.com/photo-1519491050282-cf00c82424cb?w=400' },
    { id: 'md3', title: 'Youth Ministry Dance', url: 'https://www.tiktok.com/embed', platform: 'tiktok', thumbnail: 'https://images.unsplash.com/photo-1529070538774-178fbcb2c71f?w=400' },
    { id: 'md4', title: 'Church Life on Instagram', url: 'https://www.instagram.com/', platform: 'instagram', thumbnail: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=400' },
  ],
  testimonies: [
    {
      id: 't1',
      title: 'Healed After Years of Sickness',
      author: 'Sister Mary Johnson',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      description: 'After 7 years of battling chronic illness, God touched me during the midnight prayer service. I am completely healed!',
      submittedAt: Date.now() - 86400000 * 3,
    },
    {
      id: 't2',
      title: 'Financial Breakthrough',
      author: 'Brother Peter Adeyemi',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      description: 'I was unemployed for 2 years. After partnering with the crusade truck campaign, I received a job offer within a week!',
      submittedAt: Date.now() - 86400000 * 7,
    },
    {
      id: 't3',
      title: 'Marriage Restored',
      author: 'David & Sarah Okonkwo',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      description: 'Our marriage was on the brink of divorce. Through the Covenant Love teachings, God restored our relationship completely.',
      submittedAt: Date.now() - 86400000 * 14,
    },
  ],
  orphanageImages: [
    { id: 'o1', src: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800', caption: 'Children learning together' },
    { id: 'o2', src: 'https://images.unsplash.com/photo-1594708767771-a5e9d3012f67?w=800', caption: 'Playtime with friends' },
    { id: 'o3', src: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800', caption: 'Meal time at Grace Haven' },
    { id: 'o4', src: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800', caption: 'Smiles that light up our day' },
    { id: 'o5', src: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=800', caption: 'Bible class at the orphanage' },
    { id: 'o6', src: 'https://images.unsplash.com/photo-1445251836269-d158eaa028a6?w=800', caption: 'Our beautiful family' },
  ],
  buildingImages: [
    { id: 'bd1', src: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800', caption: 'Foundation laid in faith' },
    { id: 'bd2', src: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800', caption: 'Structure rising' },
    { id: 'bd3', src: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800', caption: 'Construction progress' },
    { id: 'bd4', src: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800', caption: 'Architect\'s vision' },
    { id: 'bd5', src: 'https://images.unsplash.com/photo-1473177104440-ffee2f376098?w=800', caption: 'The new sanctuary design' },
    { id: 'bd6', src: 'https://images.unsplash.com/photo-1590725140246-20acdee442be?w=800', caption: 'Workers on site' },
  ],
  bibleImages: [
    { id: 'bs1', src: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800', caption: 'Bible Study Class' },
    { id: 'bs2', src: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=800', caption: 'Graduation Day' },
    { id: 'bs3', src: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800', caption: 'Scripture in Focus' },
    { id: 'bs4', src: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800', caption: 'Classroom Fellowship' },
    { id: 'bs5', src: 'https://images.unsplash.com/photo-1455849318743-b2233052fcff?w=800', caption: 'Teaching the Word' },
    { id: 'bs6', src: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800', caption: 'Students of the Word' },
  ],
};

type ChurchContextType = {
  data: ChurchData;
  setData: (d: ChurchData) => void;
  updateField: <K extends keyof ChurchData>(key: K, value: ChurchData[K]) => void;
  messages: ChatMessage[];
  sendMessage: (from: string, to: string, text: string) => void;
  submitPartnership: (submission: Omit<PartnershipSubmission, 'id' | 'submittedAt'>) => void;
  joinOnlineMember: (submission: Omit<OnlineMember, 'id' | 'joinedAt'>) => void;
  subscribeToNotifications: (submission: Omit<NotifySubscriber, 'id' | 'subscribedAt' | 'permissionGranted'>) => Promise<boolean>;
  setLive: (isLive: boolean) => void;
  broadcastLiveNotification: () => void;
  sendNotification: (memberId: string, method: 'sms' | 'whatsapp', message: string) => void;
  submitLiveOffering: (submission: Omit<LiveOffering, 'id' | 'submittedAt'>) => void;
  submitCrusadeDonation: (submission: Omit<CrusadeDonation, 'id' | 'submittedAt'>) => void;
  submitBuildingDonation: (submission: Omit<BuildingDonation, 'id' | 'submittedAt'>) => void;
  submitBibleEnrollment: (submission: Omit<BibleSchoolEnrollment, 'id' | 'submittedAt'>) => void;
  submitOrphanageDonation: (submission: Omit<OrphanageDonation, 'id' | 'submittedAt'>) => void;
  submitBookPurchase: (submission: Omit<BookPurchase, 'id' | 'submittedAt'>, cartItems: BookPurchaseItem[]) => void;
};

const ChurchContext = createContext<ChurchContextType | null>(null);

export function ChurchProvider({ children }: { children: ReactNode }) {
  const [data, setDataState] = useState<ChurchData>(() => {
    try {
      const saved = localStorage.getItem('churchData');
      return saved ? { ...DEFAULT_DATA, ...JSON.parse(saved) } : DEFAULT_DATA;
    } catch {
      return DEFAULT_DATA;
    }
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('churchMessages');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('churchData', JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    localStorage.setItem('churchMessages', JSON.stringify(messages));
  }, [messages]);

  const setData = (d: ChurchData) => setDataState(d);
  const updateField = <K extends keyof ChurchData>(key: K, value: ChurchData[K]) => {
    setDataState(prev => ({ ...prev, [key]: value }));
  };

  const sendMessage = (from: string, to: string, text: string) => {
    setMessages(prev => [...prev, {
      id: crypto.randomUUID(),
      from, to, text,
      time: Date.now(),
    }]);
  };

  const submitPartnership = (submission: Omit<PartnershipSubmission, 'id' | 'submittedAt'>) => {
    const full: PartnershipSubmission = {
      ...submission,
      id: crypto.randomUUID(),
      submittedAt: Date.now(),
    };
    setDataState(prev => ({ ...prev, partnerSubmissions: [...prev.partnerSubmissions, full] }));
  };

  const joinOnlineMember = (submission: Omit<OnlineMember, 'id' | 'joinedAt'>) => {
    const full: OnlineMember = {
      ...submission,
      id: crypto.randomUUID(),
      joinedAt: Date.now(),
    };
    setDataState(prev => ({
      ...prev,
      onlineMembers: prev.onlineMembers.some(m => m.email === full.email)
        ? prev.onlineMembers
        : [...prev.onlineMembers, full],
    }));
  };

  const subscribeToNotifications = async (submission: Omit<NotifySubscriber, 'id' | 'subscribedAt' | 'permissionGranted'>): Promise<boolean> => {
    let permissionGranted = false;
    if (typeof Notification !== 'undefined') {
      if (Notification.permission === 'granted') {
        permissionGranted = true;
      } else if (Notification.permission !== 'denied') {
        const result = await Notification.requestPermission();
        permissionGranted = result === 'granted';
      }
    }
    const full: NotifySubscriber = {
      ...submission,
      id: crypto.randomUUID(),
      subscribedAt: Date.now(),
      permissionGranted,
    };
    setDataState(prev => ({
      ...prev,
      notifySubscribers: prev.notifySubscribers.some(s => s.email === full.email)
        ? prev.notifySubscribers
        : [...prev.notifySubscribers, full],
    }));
    return permissionGranted;
  };

  const setLive = (isLive: boolean) => {
    setDataState(prev => {
      const next = { ...prev, isLive };
      if (isLive && typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        try {
          new Notification(prev.liveNotificationTitle, {
            body: prev.liveNotificationMessage,
            icon: prev.logo && (prev.logo.startsWith('data:image/') || prev.logo.startsWith('http')) ? prev.logo : undefined,
          });
        } catch {
          // ignore
        }
      }
      return next;
    });
  };

  const broadcastLiveNotification = () => {
    if (typeof Notification === 'undefined') return;
    if (Notification.permission === 'granted') {
      try {
        new Notification(data.liveNotificationTitle, {
          body: data.liveNotificationMessage,
          icon: data.logo && (data.logo.startsWith('data:image/') || data.logo.startsWith('http')) ? data.logo : undefined,
        });
      } catch {
        // ignore
      }
    }
  };

  const sendNotification = (memberId: string, method: 'sms' | 'whatsapp', message: string) => {
    const member = data.members.find(m => m.id === memberId);
    if (!member) return;

    const record: NotificationRecord = {
      id: crypto.randomUUID(),
      memberName: member.name,
      memberPhone: member.phone,
      method,
      message,
      sentAt: Date.now(),
    };

    setDataState(prev => ({
      ...prev,
      notificationRecords: [...prev.notificationRecords, record],
    }));

    // Open SMS or WhatsApp link
    const cleanPhone = member.phone.replace(/[\s\-\(\)]/g, '');
    const encodedMessage = encodeURIComponent(message);

    if (method === 'whatsapp') {
      window.open(`https://wa.me/${cleanPhone}?text=${encodedMessage}`, '_blank');
    } else {
      window.open(`sms:${cleanPhone}?body=${encodedMessage}`, '_blank');
    }
  };

  const submitLiveOffering = (submission: Omit<LiveOffering, 'id' | 'submittedAt'>) => {
    const full: LiveOffering = {
      ...submission,
      id: crypto.randomUUID(),
      submittedAt: Date.now(),
    };
    setDataState(prev => ({ ...prev, liveOfferings: [...prev.liveOfferings, full] }));
  };

  const submitBibleEnrollment = (submission: Omit<BibleSchoolEnrollment, 'id' | 'submittedAt'>) => {
    const full: BibleSchoolEnrollment = {
      ...submission,
      id: crypto.randomUUID(),
      submittedAt: Date.now(),
    };
    setDataState(prev => ({ ...prev, bibleEnrollments: [...prev.bibleEnrollments, full] }));
  };

  const submitCrusadeDonation = (submission: Omit<CrusadeDonation, 'id' | 'submittedAt'>) => {
    const full: CrusadeDonation = {
      ...submission,
      id: crypto.randomUUID(),
      submittedAt: Date.now(),
    };
    setDataState(prev => ({
      ...prev,
      crusadeDonations: [...prev.crusadeDonations, full],
      crusadeTruckRaised: prev.crusadeTruckRaised + (full.amount || 0),
    }));
  };

  const submitBuildingDonation = (submission: Omit<BuildingDonation, 'id' | 'submittedAt'>) => {
    const full: BuildingDonation = {
      ...submission,
      id: crypto.randomUUID(),
      submittedAt: Date.now(),
    };
    setDataState(prev => ({
      ...prev,
      buildingDonations: [...prev.buildingDonations, full],
      buildingAuditoriumRaised: prev.buildingAuditoriumRaised + (full.amount || 0),
    }));
  };

  const submitOrphanageDonation = (submission: Omit<OrphanageDonation, 'id' | 'submittedAt'>) => {
    const full: OrphanageDonation = {
      ...submission,
      id: crypto.randomUUID(),
      submittedAt: Date.now(),
    };
    setDataState(prev => ({ ...prev, orphanageDonations: [...prev.orphanageDonations, full] }));
  };

  const submitBookPurchase = (submission: Omit<BookPurchase, 'id' | 'submittedAt'>, cartItems: BookPurchaseItem[]) => {
    const full: BookPurchase = {
      ...submission,
      items: cartItems,
      // Set legacy fields from first item for backward compatibility
      bookId: cartItems[0]?.bookId,
      bookTitle: cartItems[0]?.bookTitle,
      quantity: cartItems.reduce((a, b) => a + b.quantity, 0),
      id: crypto.randomUUID(),
      submittedAt: Date.now(),
    };
    setDataState(prev => ({ ...prev, bookPurchases: [...prev.bookPurchases, full] }));
  };

  return (
    <ChurchContext.Provider value={{
      data, setData, updateField, messages, sendMessage, submitPartnership,
      joinOnlineMember, subscribeToNotifications, setLive, broadcastLiveNotification,
      submitLiveOffering, submitCrusadeDonation, submitBuildingDonation, submitOrphanageDonation, submitBookPurchase, submitBibleEnrollment, sendNotification,
    }}>
      {children}
    </ChurchContext.Provider>
  );
}

export function useChurch() {
  const ctx = useContext(ChurchContext);
  if (!ctx) throw new Error('useChurch must be used within ChurchProvider');
  return ctx;
}
