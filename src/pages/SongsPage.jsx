import Header from '../components/Layout/Header';
import Songs from '../components/Music/Songs';

export default function SongsPage() {
  return (
    <div className="min-h-screen bg-paper">
      <Header />
      <div className="pt-24">
        <Songs />
      </div>
    </div>
  );
}
