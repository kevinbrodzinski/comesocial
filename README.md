# Nightli Nova Vibes

A comprehensive React TypeScript social planning application for nightlife and social activities.

## 🚀 Features

- **Social Planning**: Create and manage plans with friends
- **Real-time Collaboration**: Live draft planning with real-time updates
- **AI-Powered Assistant**: Nova AI for intelligent suggestions and assistance
- **Map Integration**: Google Maps integration for venue discovery
- **Friend Management**: Comprehensive friend system with proximity features
- **Messaging**: Built-in chat and messaging system
- **Mobile-First Design**: Responsive design optimized for mobile devices
- **Supabase Backend**: Modern backend with real-time capabilities

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Maps**: Google Maps API
- **AI**: OpenAI integration for Nova AI assistant
- **State Management**: Zustand stores
- **Testing**: Vitest

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kevinbrodzinski/comesocial.git
   cd comesocial
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file with:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   VITE_OPENAI_API_KEY=your_openai_api_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── ai/             # AI-related components
│   ├── chat/           # Chat and messaging
│   ├── coplan/         # Collaborative planning
│   ├── feed/           # Social feed
│   ├── friends/        # Friend management
│   ├── map/            # Map components
│   ├── messages/       # Messaging system
│   ├── plan/           # Planning features
│   └── ui/             # Reusable UI components
├── hooks/              # Custom React hooks
├── services/           # API and service layer
├── stores/             # Zustand state management
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## 🔧 Development

- **Linting**: `npm run lint`
- **Type checking**: `npm run type-check`
- **Testing**: `npm run test`
- **Build**: `npm run build`

## 🚀 Deployment

The project is configured for deployment on Vercel, Netlify, or any static hosting platform.

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions, please open an issue on GitHub.
