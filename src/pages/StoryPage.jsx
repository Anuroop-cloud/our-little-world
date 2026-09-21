import Header from '../components/Layout/Header';
import MemoryLane from '../components/MemoryLane/MemoryLane';

export default function StoryPage() {
  return (
    <div className="min-h-screen bg-paper">
      <Header />
      <div className="pt-24">
        <MemoryLane />
      </div>
    </div>
  );
}
