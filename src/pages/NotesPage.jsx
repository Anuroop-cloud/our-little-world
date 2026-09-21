import Header from '../components/Layout/Header';
import Notes from '../components/Notes/Notes';

export default function NotesPage() {
  return (
    <div className="min-h-screen bg-paper">
      <Header />
      <div className="pt-24">
        <Notes />
      </div>
    </div>
  );
}
