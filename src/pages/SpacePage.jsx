import Header from '../components/Layout/Header';
import OurSpace from '../components/OurSpace/OurSpace';

export default function SpacePage() {
  return (
    <div className="min-h-screen bg-paper">
      <Header />
      <div className="pt-24">
        <OurSpace />
      </div>
    </div>
  );
}
