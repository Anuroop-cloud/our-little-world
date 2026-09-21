import Header from '../components/Layout/Header';
import Chat from '../components/Chat/Chat';

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <Header />
      <div className="flex-1 pt-24 flex flex-col overflow-hidden">
        <Chat />
      </div>
    </div>
  );
}
