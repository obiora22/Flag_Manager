# Feature Flags Management UI - Implementation Guide

## Overview

This implementation provides a production-ready feature flags management interface that displays all flags belonging to a project with advanced filtering, sorting, and quick actions.

## Key Features

### 1. **Comprehensive Flag Display**

- **List View**: All flags in a clean, scannable card layout
- **Status Indicators**: Visual icons for active/inactive/archived states
- **Type Badges**: Color-coded badges for boolean/string/number/json types
- **Metadata Display**: Rules count, environments, evaluations, timestamps
- **Tags**: Visual tag display with filtering capability

### 2. **Advanced Filtering System**

#### Search

- Full-text search across flag key, name, and description
- Real-time filtering as you type
- Debounced for performance

#### Status Filter

- All flags
- Active only (enabled, not archived)
- Inactive only (disabled, not archived)
- Archived only

#### Type Filter

- All types
- Boolean flags
- String flags
- Number flags
- JSON flags

#### Tag Filter

- Multi-select tag filtering
- Shows all unique tags across flags
- Combines with other filters (AND logic)

#### Filter UI

- Collapsible filter panel
- Visual badge showing active filter count
- One-click clear all filters
- Persistent state during session

### 3. **Quick Actions**

#### Inline Toggle

- One-click enable/disable without dropdown
- Visual feedback (green for enabled, gray for disabled)
- Loading state during API call
- Optimistic UI updates

#### Dropdown Menu Actions

- View Details
- Edit Flag
- Duplicate Flag
- Toggle Enable/Disable
- Archive (for non-archived flags)
- Delete (disabled for permanent flags)

### 4. **Flag Card Design**

```
┌─────────────────────────────────────────────────────────┐
│ [Status Icon] Flag Name                    [PERMANENT]   │
│ flag_key                      [TYPE]                     │
│ Description text...                                      │
│                                                           │
│ • 3 rules  • 4 environments  • 1.2k evals  • Updated... │
│ [tag1] [tag2]                                           │
│                                           [Toggle] [•••] │
└─────────────────────────────────────────────────────────┘
```

**Visual Design:**

- Status icon (CheckCircle2/MinusCircle/Archive)
- Color-coded type badge (blue/purple/green/orange)
- Permanent flag warning badge
- Metadata icons with counts
- Tag pills
- Quick toggle button
- Dropdown menu

### 5. **Stats Dashboard**

Four stat cards at the top:

1. **Total Flags** - All flags in project
2. **Active** - Enabled, non-archived flags
3. **Inactive** - Disabled, non-archived flags
4. **Archived** - Archived flags

### 6. **State Management**

#### Loading States

- Skeleton screens during initial load
- Spinner on refresh button
- Spinner on individual flag actions
- Loading indicator in toggle button

#### Error Handling

- Centralized error banner at top
- Per-action error display
- User-friendly error messages
- Dismissible error notifications

#### Optimistic Updates

- Toggle state updates immediately
- Reverts on error
- Smooth UX without waiting for server

### 7. **Empty States**

#### No Flags Yet

- Shown when project has no flags
- Prominent "Create Flag" CTA
- Helpful messaging

#### No Results

- Shown when filters return no results
- "Clear all filters" action
- Search/filter adjustment suggestions

## File Structure

```
app/(dashboard)/projects/[projectId]/flags/
├── page.tsx                    # Server Component
├── actions.ts                  # Server Actions
├── new/
│   └── page.tsx                # Create flag form
└── [flagId]/
    ├── page.tsx                # Flag detail view
    ├── edit/
    │   └── page.tsx            # Edit flag
    └── rules/
        └── page.tsx            # Manage rules

components/flags/
├── flags-list-page.tsx         # Main client component
├── flag-card.tsx               # Individual flag card
├── flag-filters.tsx            # Filter panel
└── empty-states.tsx            # Empty/no results states

packages/contracts/src/
└── flags.ts                    # Zod schemas for flags
```

## Data Flow

### Initial Load

```
Server Component (page.tsx)
    ↓ Fetch via apiClient
API (/api/v1/projects/:id/flags)
    ↓ Query database with Prisma
Client Component (flags-list-page.tsx)
    ↓ Render with initial data
```

### User Toggles Flag

```
User clicks toggle button
    ↓ Optimistic update
UI updates immediately
    ↓ Call Server Action
toggleFlag(projectId, flagId, enabled)
    ↓ API call via apiClient
API updates database
    ↓ Revalidate path
Next.js re-renders with fresh data
```

### User Searches/Filters

```
User types in search box
    ↓ Update local state
filteredFlags recalculated
    ↓ React re-renders
UI shows filtered results
(No server round-trip needed)
```

## API Contract

### List Flags

```typescript
GET /api/v1/projects/:projectId/flags
Query params:
  - includeArchived: boolean
  - enabled: boolean
  - tags: string[] (comma-separated)
  - search: string
  - page: number
  - pageSize: number

Response:
{
  flags: FlagWithStats[],
  pagination?: {
    total: number,
    page: number,
    pageSize: number
  }
}
```

### Toggle Flag

```typescript
POST /api/v1/projects/:projectId/flags/:flagId/toggle
Body:
{
  enabled: boolean
}

Response:
{
  flag: Flag
}
```

## Zod Schema Highlights

### Flag Schema

```typescript
const FlagSchema = z.object({
  id: z.string(),
  key: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  type: z.enum(["boolean", "string", "number", "json"]),
  defaultValue: z.union([z.boolean(), z.string(), z.number(), z.record(z.unknown())]),
  enabled: z.boolean(),
  archived: z.boolean(),
  permanent: z.boolean(),
  tags: z.array(z.string()),
  // ... timestamps
});
```

### Flag with Stats

```typescript
const FlagWithStatsSchema = FlagSchema.extend({
  _count: z.object({
    rules: z.number(),
    environments: z.number(),
  }),
  stats: z
    .object({
      evaluations24h: z.number().optional(),
      lastEvaluated: z.string().datetime().nullable().optional(),
    })
    .optional(),
});
```

## Performance Considerations

### 1. **Client-Side Filtering**

- All filtering happens in-browser
- No server round-trips for filter changes
- Instant feedback

### 2. **Optimistic Updates**

- Toggle actions update UI immediately
- Perceived performance improvement
- Graceful error handling

### 3. **Server-Side Rendering**

- Initial data fetched on server
- Faster initial page load
- SEO-friendly

### 4. **Selective Revalidation**

```typescript
// Only revalidate affected paths
revalidatePath(`/projects/${projectId}/flags`);
revalidatePath(`/projects/${projectId}/flags/${flagId}`);
```

## Advanced Features

### 1. **Bulk Operations** (Server Actions included)

```typescript
bulkEnableFlags(projectId, flagIds[])
bulkDisableFlags(projectId, flagIds[])
bulkArchiveFlags(projectId, flagIds[])
bulkDeleteFlags(projectId, flagIds[])
```

### 2. **Flag Duplication**

```typescript
duplicateFlag(projectId, flagId);
// Creates copy with "_copy" suffix
// Preserves rules and settings
// Never marks as permanent
```

### 3. **Permanent Flags**

- Cannot be deleted (prevents tech debt)
- Visual indicator badge
- Delete action disabled in UI
- Server enforces restriction

### 4. **Analytics Preview**

- 24-hour evaluation count
- Last evaluated timestamp
- Trending indicator
- Links to full analytics page

## Security Features

### 1. **Authorization**

- All actions check session
- Organization-scoped queries
- JWT validation on every request

### 2. **Input Validation**

- Zod schemas validate all inputs
- Type-safe at runtime
- Prevents injection attacks

### 3. **Soft Deletes**

- Archive instead of delete by default
- Permanent delete requires explicit confirmation
- Permanent flags cannot be deleted at all

## Testing Strategy

### Unit Tests

```typescript
describe("FlagCard", () => {
  it("displays flag information correctly", () => {
    // Test rendering
  });

  it("calls onToggle with correct params", () => {
    // Test interaction
  });
});
```

### Integration Tests

```typescript
describe("toggleFlag server action", () => {
  it("toggles flag and revalidates", async () => {
    const result = await toggleFlag("proj-1", "flag-1", true);
    expect(result.success).toBe(true);
  });
});
```

### E2E Tests

```typescript
test("user can toggle flag", async ({ page }) => {
  await page.goto("/projects/123/flags");
  await page.click('[data-testid="toggle-flag-456"]');
  await expect(page.locator(".flag-status")).toHaveClass(/enabled/);
});
```

## Common Patterns

### 1. **Dropdown Management**

```typescript
const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

// Close on outside click
useEffect(() => {
  const handleClickOutside = () => setActiveDropdown(null);
  if (activeDropdown) {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }
}, [activeDropdown]);

// Stop propagation on dropdown
<div onClick={(e) => e.stopPropagation()}>
```

### 2. **Optimistic Updates with Rollback**

```typescript
const handleToggle = async (flagId: string, currentEnabled: boolean) => {
  // Optimistic update
  setFlags((prev) => prev.map((f) => (f.id === flagId ? { ...f, enabled: !currentEnabled } : f)));

  // Server action
  const result = await toggleFlag(projectId, flagId, !currentEnabled);

  // Rollback on error
  if (!result.success) {
    setFlags((prev) => prev.map((f) => (f.id === flagId ? { ...f, enabled: currentEnabled } : f)));
    setError(result.error);
  }
};
```

### 3. **Complex Filtering Logic**

```typescript
const filteredFlags = flags.filter(flag => {
  const matchesSearch = !searchQuery ||
    flag.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
    flag.name.toLowerCase().includes(searchQuery.toLowerCase());

  const matchesTags = selectedTags.length === 0 ||
    selectedTags.some(tag => flag.tags.includes(tag));

  const matchesStatus =
    statusFilter === 'all' ||
    (statusFilter === 'active' && flag.enabled && !flag.archived) ||
    // ...

  return matchesSearch && matchesTags && matchesStatus && matchesType;
});
```

## Accessibility Considerations

- **Keyboard Navigation**: All interactive elements accessible via keyboard
- **ARIA Labels**: Dropdown menus and buttons have proper labels
- **Focus Management**: Modal/dropdown focus trapping
- **Color Contrast**: All text meets WCAG AA standards
- **Screen Readers**: Semantic HTML and status announcements

## Next Steps

1. **Flag Detail Page**: View/edit individual flag with rules
2. **Rule Builder**: Visual editor for creating complex targeting rules
3. **Environment Overrides**: Per-environment flag configuration
4. **Analytics Dashboard**: Evaluation metrics and charts
5. **Audit Log**: Track all flag changes over time
6. **Webhooks**: Notify external systems on flag changes
7. **API Key Management**: Generate SDK keys per environment
8. **Bulk Import/Export**: CSV/JSON import/export functionality

---

This implementation provides a solid foundation for comprehensive feature flag management while respecting your architectural principles.
