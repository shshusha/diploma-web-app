# Safety Monitor - Emergency Alert System

A comprehensive real-time emergency monitoring and alert management system designed to enhance personal safety through intelligent detection, instant notifications, and emergency response coordination.

## 🚨 Overview

Safety Monitor is a modern web application that provides real-time monitoring and emergency alert management for individuals and organizations. The system combines location tracking, intelligent detection algorithms, and instant communication channels to ensure rapid response during emergencies.

## ✨ Key Features

### 🎯 Real-Time Monitoring

- **Location Tracking**: Continuous GPS monitoring with accuracy and speed data
- **Fall Detection**: AI-powered fall detection with configurable sensitivity
- **Immobility Detection**: Automatic alerts when users remain stationary for extended periods
- **Route Deviation**: Monitors for unexpected route changes or dangerous zone entries

### 🚨 Emergency Alert System

- **Multi-Channel Notifications**: Instant alerts via Telegram, with expandable notification channels
- **Severity Classification**: Six-level severity system (INFO, ADVISORY, WATCH, WARNING, EMERGENCY, CRITICAL)
- **Comprehensive Alert Types**: 20+ emergency categories including:
  - Natural disasters (weather, floods, earthquakes, tsunamis)
  - Civil emergencies (AMBER alerts, terrorism, infrastructure failures)
  - Health emergencies (public health, medical alerts)
  - Environmental hazards (wildfires, HAZMAT incidents)

### 👥 User Management

- **Multi-User Support**: Manage multiple users with individual profiles
- **Emergency Contacts**: Store and manage emergency contact information
- **Telegram Integration**: Direct messaging to users via Telegram bot
- **User Profiles**: Complete user profiles with contact information and preferences

### 🛡️ Safety Features

- **Detection Rules**: Customizable sensitivity settings for fall and immobility detection
- **Location History**: Track and analyze user movement patterns
- **Alert Resolution**: Mark alerts as resolved with timestamp tracking
- **Real-time Dashboard**: Live monitoring interface with automatic data refresh

### 📱 Modern Interface

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Updates**: Auto-refreshing dashboard with 30-second polling
- **Interactive Maps**: Visual location tracking and alert mapping
- **Dark/Light Theme**: User preference support with theme switching

## 🏗️ Technical Architecture

### Frontend

- **Next.js 15**: React-based full-stack framework
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Modern, utility-first styling
- **Radix UI**: Accessible component library
- **tRPC**: End-to-end type-safe APIs

## 🏗️ Technical Architecture

### System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Safety Monitor                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────┐ │
│  │   Frontend      │    │   Backend       │    │  Database   │ │
│  │   (Next.js)     │◄──►│   (tRPC)        │◄──►│ (PostgreSQL)│ │
│  └─────────────────┘    └─────────────────┘    └─────────────┘ │
│           │                       │                            │
│           │                       │                            │
│           ▼                       ▼                            │
│  ┌─────────────────┐    ┌─────────────────┐                    │
│  │   Telegram      │    │   External      │                    │
│  │   Bot API       │    │   Services      │                    │
│  └─────────────────┘    └─────────────────┘                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Frontend Architecture

#### **Next.js 15 App Router Structure**

```
app/
├── api/trpc/[trpc]/route.ts    # tRPC API endpoint
├── globals.css                 # Global styles
├── layout.tsx                  # Root layout with providers
└── page.tsx                    # Main dashboard page

components/
├── ui/                         # Reusable UI components (Radix UI)
├── enhanced-dashboard.tsx      # Main dashboard component
├── add-alert-modal.tsx         # Alert creation modal
├── location-picker.tsx         # Location selection component
├── maps/location-map.tsx       # Interactive map component
├── user-management.tsx         # User management interface
├── theme-provider.tsx          # Theme context provider
└── trpc-provider.tsx           # tRPC client provider
```

#### **Component Architecture**

- **Provider Pattern**: Theme and tRPC providers for global state
- **Composition Pattern**: Reusable UI components with Radix UI primitives
- **Container/Presentational**: Separation of business logic and presentation
- **Suspense Boundaries**: Loading states and error boundaries

#### **State Management**

- **Server State**: TanStack Query for API data with automatic polling
- **Client State**: React useState for local component state
- **Optimistic Updates**: Immediate UI feedback for better UX
- **Cache Management**: Automatic cache invalidation and refetching

### Backend Architecture

#### **tRPC API Layer**

```
server/routers/
├── _app.ts                     # Main router configuration
├── users.ts                    # User management endpoints
├── alerts.ts                   # Alert CRUD operations
├── emergency-contacts.ts       # Emergency contact management
└── detection-rules.ts          # Detection rule configuration
```

#### **API Design Patterns**

- **RESTful Design**: Resource-based endpoint structure
- **Type Safety**: Full TypeScript coverage with Zod validation
- **Error Handling**: Comprehensive error responses
- **Middleware**: Authentication and validation layers

#### **Database Layer**

```
lib/
├── prisma.ts                   # Prisma client configuration
├── trpc.ts                     # tRPC server setup
├── telegram.ts                 # Telegram service integration
└── utils.ts                    # Utility functions
```

### Database Architecture

#### **PostgreSQL Schema**

```sql
-- Core Entities
users (id, email, name, phone, telegram_chat_id, created_at, updated_at)
alerts (id, user_id, type, severity, message, latitude, longitude, is_resolved, resolved_at, created_at)
locations (id, user_id, latitude, longitude, accuracy, speed, heading, created_at)
emergency_contacts (id, user_id, name, phone, email, relation)
detection_rules (id, user_id, fall_sensitivity, immobility_timeout, is_active)

-- Relationships
users 1:N alerts
users 1:N locations
users 1:N emergency_contacts
users 1:1 detection_rules
```

#### **Data Flow**

1. **Location Data**: GPS coordinates → PostgreSQL → Alert triggers
2. **Alert Processing**: Detection → Database → Telegram notification
3. **User Management**: Profile updates → Database → UI refresh
4. **Real-time Updates**: Polling → tRPC → TanStack Query → UI

### Integration Architecture

#### **Telegram Bot Integration**

```typescript
// Service Pattern
class TelegramService {
  - sendAlertNotification()
  - sendWelcomeMessage()
  - testConnection()
  - formatAlertMessage()
}
```

#### **Notification Flow**

1. Alert triggered → Database storage
2. User lookup → Telegram chat ID retrieval
3. Message formatting → HTML/emoji formatting
4. Bot API call → Message delivery
5. Error handling → Fallback mechanisms

### Security Architecture

#### **Data Protection**

- **Type Safety**: Zod validation for all inputs
- **SQL Injection Prevention**: Prisma ORM with prepared statements
- **Environment Variables**: Secure configuration management
- **Input Sanitization**: XSS prevention in message formatting

#### **Authentication & Authorization**

- **API Security**: tRPC procedure-level access control
- **Data Isolation**: User-scoped data access
- **Rate Limiting**: Built-in Next.js API route protection

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Telegram Bot Token (for notifications)
- pnpm (recommended package manager)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd alarm-app
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env` file with:

   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/safety_monitor"
   TELEGRAM_BOT_TOKEN="your_telegram_bot_token"
   ```

4. **Database Setup**

   ```bash
   pnpm prisma:generate
   pnpm prisma:migrate
   pnpm seed
   ```

5. **Start Development Server**
   ```bash
   pnpm dev
   ```

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm prisma:studio` - Open Prisma Studio
- `pnpm reset-and-seed` - Reset and seed database
- `pnpm telegram` - Test Telegram bot connection

## 📊 Database Schema

### Core Entities

- **Users**: User profiles with contact information and Telegram integration
- **Alerts**: Emergency alerts with location, severity, and resolution tracking
- **Locations**: GPS tracking data with accuracy and movement metrics
- **Emergency Contacts**: Contact information for emergency situations
- **Detection Rules**: Configurable sensitivity settings for safety monitoring

### Alert Types

The system supports 20 different emergency categories including natural disasters, civil emergencies, health alerts, and infrastructure failures.

## 🔧 Configuration

### Detection Rules

- **Fall Sensitivity**: Adjustable from 0.1 to 1.0 (default: 0.8)
- **Immobility Timeout**: Configurable from 60 to 3600 seconds (default: 300)
- **Active Status**: Enable/disable detection rules per user

### Notification Settings

- **Telegram Integration**: Direct messaging to users
- **Severity Filtering**: Configure which alert levels trigger notifications
- **Location Data**: Include GPS coordinates in alerts

## 🛡️ Security Features

- **Type-safe APIs**: Full TypeScript coverage with tRPC
- **Input Validation**: Zod schema validation for all inputs
- **Database Security**: Prisma ORM with prepared statements
- **Environment Variables**: Secure configuration management

## 📈 Monitoring & Analytics

- **Real-time Dashboard**: Live monitoring of all users and alerts
- **Alert Statistics**: Track alert types, severity levels, and resolution times
- **User Activity**: Monitor user locations and movement patterns
- **System Health**: Automatic polling and data refresh

## 🔮 Future Enhancements

- **Mobile App**: Native iOS/Android applications
- **SMS Notifications**: Additional notification channels
- **AI Enhancement**: Machine learning for improved detection accuracy
- **Integration APIs**: Third-party emergency service integrations
- **Advanced Analytics**: Predictive analytics and trend analysis

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Safety Monitor** - Keeping you safe, one alert at a time. 🛡️
