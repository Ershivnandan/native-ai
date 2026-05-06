# Project Context

This is a fully offline AI Chat Mobile Application built using React Native and Expo. The goal of this project is to create a ChatGPT-like experience (similar to ChatterUI) that runs entirely on-device without relying on any backend or external APIs.

The application uses local LLMs via react-native-ai to provide AI responses directly on the user's device, ensuring privacy, low latency, and zero server dependency.

---

# About the Project

This app provides a conversational AI interface where users can:

* Chat with an AI assistant locally (offline-first)
* Store and manage multiple chat conversations
* Experience fast responses using on-device models
* Switch between dark and light themes
* Use AI features without any API keys or backend services

The goal is to replicate a modern AI chat UI while ensuring everything runs locally on the device.

---

# Core Principles

* Fully offline-first architecture (no backend, no API calls)
* Privacy-focused (user data never leaves device)
* Optimized for mobile performance (low memory usage)
* Modular and scalable architecture
* Clean and minimal UI inspired by modern AI apps

---

# Tech Stack

* React Native (Expo)
* NativeWind (Tailwind CSS for React Native)
* react-native-ai (on-device LLM support)
* Zustand or Redux Toolkit (state management)
* AsyncStorage / MMKV (local persistence)
* TypeScript

---

# Features

## AI Features

* Local LLM chat (Phi / Llama small models)
* Streaming responses (if supported)
* Conversation context handling
* Token limit handling (truncate intelligently)

## Chat System

* Multi-chat support (like ChatGPT)
* Create / delete / rename chats
* Message history persistence
* Smooth scrolling and streaming UI

## UI/UX

* Dark / Light theme toggle
* Chat bubbles (user / AI)
* Typing indicator
* Markdown support (optional)
* Code block rendering (optional)

## Performance

* Lazy loading for messages
* Optimized re-renders
* Model loading state handling
* Memory-safe architecture

---

# Rules

* Always keep the app fully offline (no external API calls)
* Do not introduce backend dependencies
* Keep AI model lightweight (mobile-compatible)
* Optimize for performance over heavy features
* Maintain clean and reusable component structure
* Follow consistent theming using NativeWind
* Avoid unnecessary re-renders in chat UI
* Use TypeScript for type safety

---

# AI Behavior Guidelines

* Keep responses concise and useful
* Avoid hallucinations where possible
* Maintain conversational tone
* Support basic formatting (lists, code, etc.)
* Handle edge cases like empty input or long prompts

---

# Project Structure

ai-chat-native/
│
├── app/                          # Expo Router (if used)
│   ├── (tabs)/
│   ├── chat/
│   └── settings/
│
├── components/
│   ├── ui/
│   ├── chat/
│   ├── common/
│
├── hooks/
│   ├── useAI.ts
│   ├── useChat.ts
│   └── useTheme.ts
│
├── lib/
│   ├── ai/                       # react-native-ai integration
│   ├── storage/                  # AsyncStorage/MMKV helpers
│   └── utils/
│
├── store/
│   ├── chatStore.ts
│   └── settingsStore.ts
│
├── types/
│   ├── chat.ts
│   └── ai.ts
│
├── constants/
│   └── theme.ts
│
├── assets/
│
├── app.json
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md

---

# Development Guidelines

## Chat Flow

1. User sends message
2. Message stored locally
3. Pass input to local LLM via react-native-ai
4. Stream or receive response
5. Append response to chat
6. Persist updated conversation

## Performance Optimization

* Limit context length (last N messages)
* Avoid storing unnecessary tokens
* Debounce user input if needed
* Use FlatList for chat rendering

## Theming

* Use NativeWind for styling
* Support system theme detection
* Maintain consistent color tokens

---

# Future Improvements

* Voice input (Speech-to-Text)
* Offline Text-to-Speech
* Multiple AI personalities
* File-based context (PDF/chat memory)
* On-device embeddings for search
* Plugin system (tools inside app)

---

# Constraints

* No cloud AI APIs (OpenAI, Claude, etc.)
* No server/database dependency
* Must work in airplane mode
* Must support mid-range Android devices

---

# Goal

Build a production-level offline AI chat app that can serve as:

* A portfolio-level project
* A base for future AI startups
* A privacy-first ChatGPT alternative

---
