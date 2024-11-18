import { Message } from '../llm_message/core';

export default function MessageList({ messages }: { messages: Message[] }) {
  return (
    <div className="flex-grow overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`p-2 rounded-lg ${
            message.role === 'user' ? 'bg-blue-100 ml-auto' : 'bg-gray-100'
          } max-w-[70%]`}
        >
          <p>{message.content}</p>
          <small className="text-gray-500">
            {message.timestamp.toLocaleTimeString()}
          </small>
        </div>
      ))}
    </div>
  );
}
