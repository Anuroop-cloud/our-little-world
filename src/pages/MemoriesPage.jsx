import Header from '../components/Layout/Header';
import Gallery from '../components/Gallery/Gallery';

export default function MemoriesPage() {
  return (
    <div className="min-h-screen bg-paper">
      <Header />
      <div className="pt-24">
        <Gallery />
      </div>
    </div>
  );
}
