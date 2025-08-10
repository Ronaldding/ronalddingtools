# Data Configuration Files

This folder contains JSON configuration files for the application's content management.

## Files Structure

### `tools.json`
Contains all available tools with their metadata:
```json
{
  "id": "unique-identifier",
  "to": "/route-path",
  "title": "Display Title",
  "subtitle": "Short description",
  "iconEmoji": "HTML icon or emoji",
  "category": "tool-category",
  "description": "Detailed description"
}
```

### `games.json`
Contains all available games with their metadata:
```json
{
  "id": "unique-identifier",
  "to": "/route-path",
  "title": "Game Title",
  "subtitle": "Game description",
  "iconEmoji": "HTML icon or emoji",
  "category": "game-category",
  "description": "Detailed game description"
}
```

### `articles.json`
Contains all available articles with their metadata:
```json
{
  "id": 1,
  "to": "/article/id/1",
  "title": "Article Title",
  "subtitle": "Article subtitle",
  "iconEmoji": "📚",
  "section": "Category | Subcategory",
  "readMinutes": 5,
  "publishedAt": "2025-01-01 12:00",
  "category": "article-category",
  "description": "Article description"
}
```

## Adding New Content

### To add a new tool:
1. Add a new entry to `tools.json`
2. Ensure the `to` field matches your route in `App.tsx`
3. The tool will automatically appear on the Tools page and Homepage

### To add a new game:
1. Add a new entry to `games.json`
2. Ensure the `to` field matches your route in `App.tsx`
3. The game will automatically appear on the Games page and Homepage

### To add a new article:
1. Add a new entry to `articles.json`
2. Ensure the `to` field matches your route in `App.tsx`
3. The article will automatically appear on the Articles page and Homepage

## Benefits of This Approach

- **Centralized Management**: All content is managed in one place
- **Easy Updates**: Change descriptions, titles, or icons without touching code
- **Consistent Structure**: All pages use the same data format
- **Scalable**: Easy to add new items without code changes
- **Type Safety**: TypeScript interfaces ensure data consistency

## Notes

- The `iconEmoji` field can contain either HTML (for Bootstrap icons) or emoji characters
- The `category` field is used for future filtering and organization features
- All routes must be defined in `App.tsx` for the links to work properly 