import { useState } from 'react';
import Header from '../components/Layout/Header';
import BirthdaySection from '../components/Birthday/BirthdaySection';
import FinalPage from '../components/Birthday/FinalPage';

export default function BirthdayPage() {
  const [showFinal, setShowFinal] = useState(false);
  return (
    <div className="min-h-screen bg-paper">
      <Header />
      <div className="pt-24">
        {!showFinal
          ? <BirthdaySection onNext={() => setShowFinal(true)} />
          : <FinalPage onBack={() => setShowFinal(false)} />
        }
      </div>
    </div>
  );
}
