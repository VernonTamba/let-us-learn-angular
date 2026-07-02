# 🛢️ WITSML Well Data Dashboard - Angular Learning Project

## Project Overview

Sebuah **real-time well data monitoring dashboard** untuk industri Oil & Gas yang menggunakan **WITSML Data Standard**. Project ini dirancang sebagai comprehensive learning tool untuk menguasai Angular dari Basic hingga Advanced.

> **WITSML (Wellsite Information Transfer Standard Markup Language)** adalah standard industri untuk transfer data wellsite dalam operasi drilling & production Oil & Gas.

---

## 🎯 Learning Objectives

Setelah menyelesaikan project ini, kamu akan menguasai:

1. **Angular Fundamentals** - Components, Templates, Data Binding, Directives, Pipes
2. **Component Architecture** - Smart/Dumb components, Communication patterns
3. **Routing & Navigation** - Lazy loading, Guards, Resolvers
4. **Forms** - Template-driven & Reactive Forms dengan validasi kompleks
5. **HTTP & API** - HttpClient, Interceptors, Error handling
6. **State Management** - Services, NgRx Store, NgRx Signals
7. **RxJS Mastery** - Operators, Patterns, Real-time streams
8. **Angular Signals** - New reactivity model (Angular 16+)
9. **Performance Optimization** - OnPush, trackBy, lazy loading, bundle optimization
10. **Testing** - Unit tests, Integration tests, E2E concepts
11. **Best Practices** - Project structure, Coding standards, Security

---

## 📚 Learning Path (Roadmap)

### Phase 1: BASICS (Week 1-2)
| # | Topic | File Location | Status |
|---|-------|---------------|--------|
| 1 | Components & Templates | `src/app/learning/01-basics/components/` | 📖 |
| 2 | Data Binding (Interpolation, Property, Event, Two-way) | `src/app/learning/01-basics/data-binding/` | 📖 |
| 3 | Directives (Structural & Attribute) | `src/app/learning/01-basics/directives/` | 📖 |
| 4 | Pipes (Built-in & Custom) | `src/app/learning/01-basics/pipes/` | 📖 |
| 5 | Services & Dependency Injection | `src/app/learning/01-basics/services-di/` | 📖 |
| 6 | Basic Routing | `src/app/learning/01-basics/routing/` | 📖 |
| 7 | Template-Driven Forms | `src/app/learning/01-basics/forms/` | 📖 |
| 8 | Lifecycle Hooks | `src/app/learning/01-basics/lifecycle/` | 📖 |

### Phase 2: INTERMEDIATE (Week 3-4)
| # | Topic | File Location | Status |
|---|-------|---------------|--------|
| 1 | Reactive Forms (Advanced) | `src/app/learning/02-intermediate/reactive-forms/` | 📖 |
| 2 | HTTP Client & Interceptors | `src/app/learning/02-intermediate/http-client/` | 📖 |
| 3 | RxJS Operators & Patterns | `src/app/learning/02-intermediate/rxjs-patterns/` | 📖 |
| 4 | Component Communication | `src/app/learning/02-intermediate/component-comm/` | 📖 |
| 5 | Lazy Loading & Route Guards | `src/app/learning/02-intermediate/lazy-loading/` | 📖 |
| 6 | State Management (Service-based) | `src/app/learning/02-intermediate/state-management/` | 📖 |
| 7 | Custom Directives & Pipes | `src/app/learning/02-intermediate/custom-directives-pipes/` | 📖 |
| 8 | Error Handling Patterns | `src/app/learning/02-intermediate/error-handling/` | 📖 |

### Phase 3: ADVANCED (Week 5-6)
| # | Topic | File Location | Status |
|---|-------|---------------|--------|
| 1 | Angular Signals (New Reactivity) | `src/app/learning/03-advanced/signals/` | 📖 |
| 2 | New Control Flow (@if, @for, @switch) | `src/app/learning/03-advanced/control-flow/` | 📖 |
| 3 | Change Detection & OnPush Strategy | `src/app/learning/03-advanced/change-detection/` | 📖 |
| 4 | Dynamic Components | `src/app/learning/03-advanced/dynamic-components/` | 📖 |
| 5 | Content Projection (ng-content) | `src/app/learning/03-advanced/content-projection/` | 📖 |
| 6 | NgRx Store & Signals Store | `src/app/learning/03-advanced/ngrx/` | 📖 |
| 7 | Real-time WebSocket Streaming | `src/app/learning/03-advanced/websocket/` | 📖 |
| 8 | Performance Optimization | `src/app/learning/03-advanced/performance/` | 📖 |
| 9 | Standalone Components & New APIs | `src/app/learning/03-advanced/standalone/` | 📖 |
| 10 | Deferrable Views (@defer) | `src/app/learning/03-advanced/defer/` | 📖 |

---

## 🏗️ Project Structure

```
src/
├── app/
│   ├── app.component.ts          # Root component
│   ├── app.config.ts             # Application configuration (standalone)
│   ├── app.routes.ts             # Root routing configuration
│   │
│   ├── core/                     # Singleton services, guards, interceptors
│   │   ├── models/               # TypeScript interfaces & types
│   │   │   ├── well.model.ts
│   │   │   ├── witsml.model.ts
│   │   │   └── sensor-data.model.ts
│   │   ├── services/             # Application-wide services
│   │   │   ├── well-data.service.ts
│   │   │   ├── websocket.service.ts
│   │   │   ├── auth.service.ts
│   │   │   └── notification.service.ts
│   │   ├── interceptors/         # HTTP interceptors
│   │   │   ├── auth.interceptor.ts
│   │   │   └── error.interceptor.ts
│   │   └── guards/               # Route guards
│   │       ├── auth.guard.ts
│   │       └── role.guard.ts
│   │
│   ├── shared/                   # Shared/reusable components
│   │   ├── components/
│   │   │   ├── header/
│   │   │   ├── sidebar/
│   │   │   ├── loading-spinner/
│   │   │   ├── data-table/
│   │   │   └── chart-widget/
│   │   ├── directives/
│   │   │   ├── highlight.directive.ts
│   │   │   └── tooltip.directive.ts
│   │   ├── pipes/
│   │   │   ├── unit-conversion.pipe.ts
│   │   │   └── time-ago.pipe.ts
│   │   └── utils/
│   │       └── helpers.ts
│   │
│   ├── features/                 # Feature modules (real-world implementation)
│   │   ├── dashboard/            # Main dashboard with widgets
│   │   ├── well-monitoring/      # Real-time well monitoring
│   │   ├── data-streaming/       # WITSML data streaming
│   │   └── reports/              # Report generation
│   │
│   └── learning/                 # Learning modules with explanations
│       ├── 01-basics/
│       ├── 02-intermediate/
│       └── 03-advanced/
│
├── environments/
│   ├── environment.ts
│   └── environment.prod.ts
│
├── styles.scss                   # Global styles
├── index.html
└── main.ts                       # Application entry point

docs/                             # Documentation & study notes
├── 01-BASICS.md
├── 02-INTERMEDIATE.md
├── 03-ADVANCED.md
├── 04-SIGNALS-VS-RXJS.md
├── 05-BEST-PRACTICES.md
├── 06-OPTIMIZATION.md
├── 07-WITSML-CONCEPTS.md
└── 08-INTERVIEW-PREPARATION.md
```

---

## 🔄 Old vs New Angular Syntax Comparison

Project ini mendemonstrasikan perbandingan antara syntax lama dan baru:

| Concept | Old Way (Angular ≤15) | New Way (Angular 16+) |
|---------|----------------------|----------------------|
| Reactivity | RxJS BehaviorSubject | **Signals** (signal, computed, effect) |
| Control Flow | `*ngIf`, `*ngFor`, `[ngSwitch]` | **@if**, **@for**, **@switch** |
| Components | NgModule-based | **Standalone Components** |
| Lazy Loading | `loadChildren` with modules | `loadComponent` standalone |
| Injection | Constructor injection | **inject()** function |
| View Queries | `@ViewChild` decorator | **viewChild()** signal |
| Input/Output | `@Input()` / `@Output()` | **input()** / **output()** signals |
| Required Input | Manual validation | **input.required()** |
| Deferred Loading | Manual lazy logic | **@defer** blocks |

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
ng serve

# Navigate to
http://localhost:4200

# Run tests
npm test

# Build for production
npm run build:prod
```

---

## 🛢️ About WITSML in This Project

**WITSML** (Wellsite Information Transfer Standard Markup Language) digunakan dalam project ini sebagai konteks real-world:

- **Well Data**: Informasi tentang sumur minyak (depth, temperature, pressure)
- **Log Data**: Time-based dan depth-based logging data
- **Real-time Streaming**: Continuous data dari sensor di wellsite
- **Trajectories**: Data arah pengeboran (inclination, azimuth)
- **Mud Logs**: Data lumpur pengeboran

### Data Model yang Digunakan:
```typescript
interface WellData {
  uid: string;
  name: string;
  field: string;
  operator: string;
  status: 'drilling' | 'producing' | 'suspended' | 'abandoned';
  location: { latitude: number; longitude: number };
  depth: { current: number; planned: number; unit: string };
  logs: LogData[];
}
```

---

## 📋 Checklist Interview Preparation

- [ ] Explain Component Lifecycle Hooks
- [ ] Difference between `ngOnInit` vs `constructor`
- [ ] Change Detection strategies (Default vs OnPush)
- [ ] How Dependency Injection works
- [ ] RxJS operators (switchMap, mergeMap, concatMap, exhaustMap)
- [ ] Subject types (Subject, BehaviorSubject, ReplaySubject, AsyncSubject)
- [ ] Signals vs Observables - when to use which
- [ ] Route Guards (canActivate, canDeactivate, resolve)
- [ ] Lazy Loading benefits & implementation
- [ ] State Management patterns
- [ ] Angular Forms (Template-driven vs Reactive)
- [ ] HTTP Interceptors use cases
- [ ] Performance optimization techniques
- [ ] Standalone Components architecture
- [ ] New control flow syntax
- [ ] ViewEncapsulation modes
- [ ] Content Projection patterns
- [ ] Zone.js and Zoneless Angular

---

## 📖 Documentation

Lihat folder `docs/` untuk detailed study notes:

| File | Content |
|------|---------|
| [01-BASICS.md](docs/01-BASICS.md) | Angular fundamentals lengkap |
| [02-INTERMEDIATE.md](docs/02-INTERMEDIATE.md) | Konsep menengah & patterns |
| [03-ADVANCED.md](docs/03-ADVANCED.md) | Advanced topics & architecture |
| [04-SIGNALS-VS-RXJS.md](docs/04-SIGNALS-VS-RXJS.md) | Perbandingan Signals vs RxJS |
| [05-BEST-PRACTICES.md](docs/05-BEST-PRACTICES.md) | Coding standards & best practices |
| [06-OPTIMIZATION.md](docs/06-OPTIMIZATION.md) | Performance optimization guide |
| [07-WITSML-CONCEPTS.md](docs/07-WITSML-CONCEPTS.md) | WITSML data standard overview |
| [08-INTERVIEW-PREPARATION.md](docs/08-INTERVIEW-PREPARATION.md) | Interview Q&A lengkap |

---

## 🏷️ Technologies Used

- **Angular 18** - Frontend framework
- **Angular Material** - UI component library
- **NgRx** - State management
- **RxJS 7** - Reactive programming
- **Chart.js** - Data visualization
- **TypeScript 5.5** - Type-safe JavaScript
- **SCSS** - CSS preprocessor

---

## 💡 Tips Belajar

1. **Mulai dari `learning/01-basics/`** - Baca setiap file dari atas ke bawah
2. **Perhatikan komentar** - Setiap file memiliki penjelasan detail di komentar
3. **Bandingkan Old vs New** - Setiap konsep ada versi lama dan baru
4. **Jalankan project** - Lihat hasilnya langsung di browser
5. **Baca docs/** - Untuk pemahaman teori yang lebih dalam
6. **Practice** - Coba modifikasi code dan lihat hasilnya

---

*Happy Learning! 🚀 Good luck for your interview!*
