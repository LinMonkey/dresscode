import type { ComponentMeta } from "../types"

const meta: ComponentMeta = {
  name: "chat",
  title: "Chat",
  description:
    "The parts of a chat UI: a message list that follows the newest message, messages with avatars, times and read receipts, bubbles for text, files, images and code, a typing indicator, quick replies and a composer that grows as you type. For AI assistants, support chats, inboxes and help widgets.",
  keywords: ["shadcn chat", "react chat component", "shadcn ai chat", "tailwind chat ui"],
  variants: [
    {
      id: "ai-assistant",
      title: "AI assistant",
      description: "Suggestions when empty, answers that stream in word by word with lists and code, copy, regenerate and a model picker.",
      height: 720,
    },
    {
      id: "support",
      title: "Support conversation",
      description: "A chat with a support agent: read receipts, an image you can open full size, typing, and a rating once it's solved.",
      height: 720,
    },
    {
      id: "inbox",
      title: "Inbox",
      description: "Conversations with search, unread counts and online dots beside the open thread; separate screens on phones.",
      height: 720,
    },
    {
      id: "floating-widget",
      title: "Floating widget",
      description: "A launcher in the corner that opens a compact chat with a greeting, office hours, quick replies and email follow-up.",
      height: 700,
    },
    {
      id: "prompt-input",
      title: "Prompt input",
      description: "A composer on its own: files and images with progress and remove, a mode toggle, voice input, a character limit and stop.",
      height: 420,
    },
  ],
}

export default meta
