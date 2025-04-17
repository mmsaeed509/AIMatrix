# AI Matrix - Futuristic AI Tools Directory

A modern, futuristic website with a Sci-Fi style that showcases various AI tools categorized by their functionality. The website allows users to browse all tools or filter them by specific categories.

![AI Matrix Screenshot](https://via.placeholder.com/800x400?text=AI+Matrix+Screenshot)

## Features

- **Futuristic Sci-Fi Design**: Dark theme with glowing elements, animations, and a high-tech feel
- **Category Filtering**: Filter tools by their categories (AI Agent IDEs, AI Terminals, etc.)
- **Responsive Layout**: Works on desktop and mobile devices
- **Dynamic Content**: All tool data is loaded from YAML files

## Implementation Details

### File Structure

- `index.html` - Main HTML structure
- `styles.css` - Futuristic Sci-Fi styling
- `script.js` - JavaScript for loading and displaying tools
- `*.yaml` - YAML files containing tool data
- `icons/` - Directory containing tool icons
- `fonts/` - Directory containing the Squares font family

### Technologies Used

- HTML5
- CSS3 (with animations and modern styling)
- JavaScript (ES6+)
- [js-yaml](https://github.com/nodeca/js-yaml) - For parsing YAML files

### Data Structure

The website loads tool data from multiple YAML files, each representing a category. Each YAML file follows this general structure:

```yaml
categoryName: Category Name
tools:
  - id: 1
    name: Tool Name
    description: Tool description
    websiteUrl: https://example.com
    iconUrl: icons/tool-icon.png
```

The JavaScript code handles variations in the data structure across different files.

## How to Use

1. Clone the repository
2. Open `index.html` in a web browser
3. Browse all tools or filter by category using the buttons at the top

## Adding New Tools

To add a new tool:

1. Identify the appropriate category YAML file
2. Add a new entry to the `tools` array with the required fields:
   - `id`: A unique identifier
   - `name`: The name of the tool
   - `description`: A brief description
   - `websiteUrl`: URL to the tool's website
   - `iconUrl`: Path to the tool's icon (preferably in the `icons/` directory)

## Creating a New Category

To create a new category:

1. Create a new YAML file named after the category (e.g., `new_category.yaml`)
2. Follow the structure of existing YAML files
3. Add tools to the new category
4. The website will automatically detect and display the new category

## Browser Compatibility

The website is compatible with modern browsers:
- Brave (latest)
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open source and available under the [MIT License](LICENSE).