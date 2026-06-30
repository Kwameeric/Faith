import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ChurchProvider } from './context/ChurchContext';
import { CurrencyProvider } from './context/CurrencyContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import Home from './pages/Home';
import LiveStream from './pages/LiveStream';
import Members from './pages/Members';
import Media from './pages/Media';
import Give from './pages/Give';
import Orphanage from './pages/Orphanage';
import Building from './pages/Building';
import Events from './pages/Events';
import Branches from './pages/Branches';
import BibleSchool from './pages/BibleSchool';
import Partner from './pages/Partner';
import CrusadeTruck from './pages/CrusadeTruck';
import Books from './pages/Books';
import Enroll from './pages/Enroll';
import Admin from './pages/Admin';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <ChatWidget />
    </div>
  );
}

export default function App() {
  return (
    <ChurchProvider>
      <CurrencyProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/livestream" element={<LiveStream />} />
            <Route path="/members" element={<Members />} />
            <Route path="/media" element={<Media />} />
            <Route path="/give" element={<Give />} />
            <Route path="/orphanage" element={<Orphanage />} />
            <Route path="/building" element={<Building />} />
            <Route path="/events" element={<Events />} />
            <Route path="/branches" element={<Branches />} />
            <Route path="/bible-school" element={<BibleSchool />} />
            <Route path="/enroll" element={<Enroll />} />
            <Route path="/partner" element={<Partner />} />
            <Route path="/crusade-truck" element={<CrusadeTruck />} />
            <Route path="/books" element={<Books />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </CurrencyProvider>
    </ChurchProvider>
  );
}
