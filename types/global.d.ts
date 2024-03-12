// types/global.d.ts
import { Message } from 'ai/react'

type Timestamp = number;

interface MessageLog extends Message {
  createdAt: Timestamp;
}


interface ConversationInContext {
  context: Message[];           // clear context, for openai
  createdTime: Timestamp;
  messagesLog: MessageLog[];
}

interface Project {
  projectId: string;
  projectName: string;
  createdAt: Timestamp;
  lastEditedAt: Timestamp;
  context: Message[];
  conversations: ConversationInContext[];
}

declare global {
  interface Window {
    projects: Project[];
  }
}

export { MessageLog, ConversationInContext, Project };