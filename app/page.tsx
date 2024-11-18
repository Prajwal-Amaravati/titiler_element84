// app/page.tsx
import ChatInterface from './components/chatter_interface';

export default function Home() {
  return (
    <div className="flex-grow flex flex-col">
      <ChatInterface />
    </div>
  );
}