# PZMK technical task

## Getting Started

### Requirements

- Node
- PNPM

### Usage

```bash
# create .env from .env.example

# install dependencies
pnpm install

# running dev mode
pnpm dev

# production build
pnpm build

# running production
pnpm start
```

## Comments

### Mock DB

The application uses a simple file-based mock database implementation (`src/lib/db.ts`) that loads data from `src/data.json`. The MockDB class provides basic CRUD operations:

- **Data Loading**: Reads GeoJSON data from a local JSON file on server startup
- **Query Methods**: `getAll()` returns all items, `getById(id)` finds specific items by `kn_id`

This approach simulates a real database while keeping the setup simple for development and testing.

### Show polygons based on zoom level

The application implements intelligent map visualization that adapts based on the current zoom level:

- **Zoom Threshold**: Uses `ZOOM_THRESHOLD = 13` as the cutoff point for switching visualization modes
- **Low Zoom (< 13)**: Shows clustered point markers using MapLibre's built-in clustering
  - Points are grouped into clusters with different colors and sizes based on density
  - Reduces visual clutter when viewing large areas
- **High Zoom (≥ 13)**: Displays actual polygon geometries with detailed boundaries
  - Shows blue fill with red borders for better visibility
  - Enables detailed inspection of individual parcels/areas
- **Bounding Box Filtering**: Only loads data visible in the current map viewport to optimize performance

This progressive disclosure approach ensures good performance while providing appropriate detail levels.

### Data caching

The application implements efficient client-side caching using TanStack Query (React Query):

- **Query Keys**: Cache is keyed by `["map", lat, lng, zoom]` to cache data per viewport
- **Automatic Invalidation**: Cache automatically updates when map position or zoom changes

### Future Work and Personal Comments

Given more time, I would implement a tileset approach, which would be significantly better than the current caching implementation. However, due to time constraints, I opted for the simplest viable solution that demonstrates the core functionality.

I focused most of my development time on showcasing proper code structure, comprehensive commenting, and modular architecture while delivering as many features as possible. The current implementation prioritizes:

- Clean separation of concerns
- Reusable component architecture
- Proper error handling and loading states
- Modern React patterns and hooks
