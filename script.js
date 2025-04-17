// Main JavaScript for AI Matrix website

document.addEventListener('DOMContentLoaded', async function() {
    // Get references to DOM elements
    const toolsContainer = document.getElementById('tools-container');
    const categoryFilters = document.querySelector('.category-filters');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    // List of all YAML files to load
    const yamlFiles = [
        'YAML/ai_agent_ides.yaml',
        'YAML/ai_terminals.yaml',
        'YAML/ai_agent.yaml',
        'YAML/privacy_tools.yaml',
        'YAML/business_productivity.yaml',
        'YAML/local_ai.yaml',
        'YAML/cli_ai.yaml',
        'YAML/language_models.yaml',
        'YAML/ai_platforms.yaml',
        'YAML/image_generation.yaml',
        'YAML/content_creation.yaml',
        'YAML/development_tools.yaml'
    ];

    // Store all tools and categories
    let allTools = [];
    let categories = new Set(['All']);

    try {
        // Load all YAML files
        for (const file of yamlFiles) {
            const response = await fetch(file);
            if (!response.ok) {
                console.warn(`Failed to load ${file}: ${response.status} ${response.statusText}`);
                continue;
            }

            const yamlText = await response.text();
            const data = jsyaml.load(yamlText);

            // Extract category name from file or data
            let categoryName = getCategoryFromFileName(file);
            if (data.categoryName) {
                categoryName = data.categoryName;
            }

            // Add category to the set
            categories.add(categoryName);

            // Process tools from this file
            if (data.tools && Array.isArray(data.tools)) {
                data.tools.forEach(tool => {
                    // Normalize tool data structure
                    const normalizedTool = normalizeTool(tool, categoryName);
                    allTools.push(normalizedTool);
                });
            }
        }

        // Create category filter buttons
        createCategoryFilters(Array.from(categories));

        // Display all tools initially
        displayTools(allTools);

        // Add event listeners to filter buttons
        setupFilterListeners();

    } catch (error) {
        console.error('Error loading or parsing YAML files:', error);
        toolsContainer.innerHTML = `
            <div class="error">
                <p>Error loading AI Matrix data. Please try again later.</p>
                <p class="error-details">${error.message}</p>
            </div>
        `;
    }

    // Function to extract category name from file name
    function getCategoryFromFileName(fileName) {
        // Remove file extension and replace underscores with spaces
        const baseName = fileName.replace('.yaml', '').replace(/_/g, ' ');

        // Capitalize each word
        return baseName.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    // Function to normalize tool data structure
    function normalizeTool(tool, category) {
        // Create a normalized tool object
        const normalizedTool = {
            id: null,
            name: tool.name || 'Unknown Tool',
            description: tool.description || '',
            category: tool.category || category,
            websiteUrl: tool.websiteUrl || '#',
            iconUrl: tool.iconUrl || 'icons/default-icon.svg'
        };

        // Find the ID field (could be named differently in different files)
        for (const key in tool) {
            if (key.toLowerCase().includes('id') && typeof tool[key] === 'number') {
                normalizedTool.id = tool[key];
                break;
            }
        }

        // If no ID was found, generate a random one
        if (normalizedTool.id === null) {
            normalizedTool.id = Math.floor(Math.random() * 10000);
        }

        return normalizedTool;
    }

    // Function to create category filter buttons
    function createCategoryFilters(categories) {
        categories.forEach(category => {
            if (category === 'All') return; // Skip 'All' as it's already in HTML

            const button = document.createElement('button');
            button.className = 'filter-btn';
            button.setAttribute('data-category', category);
            button.textContent = category;
            categoryFilters.appendChild(button);
        });
    }

    // Function to display tools in the container
    function displayTools(tools) {
        // Clear loading indicator
        toolsContainer.innerHTML = '';

        if (tools.length === 0) {
            toolsContainer.innerHTML = '<div class="no-results">No tools found for this category.</div>';
            return;
        }

        // Create and append tool cards
        tools.forEach(tool => {
            const toolCard = document.createElement('div');
            toolCard.className = 'tool-card';
            toolCard.setAttribute('data-category', tool.category);

            // Special case for OnionGPT - redirect to instructions page instead of direct onion link
            const linkHref = tool.name === 'OnionGPT' ? 'oniongpt.html' : tool.websiteUrl;
            const linkText = tool.name === 'OnionGPT' ? 'Access Instructions' : 'Visit Website';
            const linkTarget = tool.name === 'OnionGPT' ? '_self' : '_blank';

            toolCard.innerHTML = `
                <div class="tool-card-content">
                    <img src="${tool.iconUrl}" alt="${tool.name} icon" class="tool-icon" onerror="this.src='icons/default-icon.svg'">
                    <h3 class="tool-name">${tool.name}</h3>
                    <p class="tool-description">${tool.description}</p>
                </div>
                <div class="tool-card-actions">
                    <button class="action-btn share-btn" data-tool="${tool.name}">Share</button>
                    <a href="${linkHref}" target="${linkTarget}" rel="noopener noreferrer" class="action-btn visit-btn">${linkText}</a>
                </div>
            `;

            toolsContainer.appendChild(toolCard);
        });
    }

    // Function to setup filter button event listeners
    function setupFilterListeners() {
        const filterButtons = document.querySelectorAll('.filter-btn');

        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));

                // Add active class to clicked button
                this.classList.add('active');

                const category = this.getAttribute('data-category');

                // Clear search input when changing categories
                searchInput.value = '';

                // Filter tools based on selected category
                if (category === 'All') {
                    displayTools(allTools);
                } else {
                    const filteredTools = allTools.filter(tool => 
                        tool.category === category
                    );
                    displayTools(filteredTools);
                }
            });
        });

        // Setup share button event delegation
        toolsContainer.addEventListener('click', function(e) {
            if (e.target.classList.contains('share-btn')) {
                const toolName = e.target.getAttribute('data-tool');
                const tool = allTools.find(t => t.name === toolName);

                if (tool) {
                    const shareText = `Check out ${tool.name}: ${tool.description} - ${tool.websiteUrl}`;

                    // Create a temporary input element
                    const tempInput = document.createElement('input');
                    tempInput.value = shareText;
                    document.body.appendChild(tempInput);
                    tempInput.select();
                    document.execCommand('copy');
                    document.body.removeChild(tempInput);

                    // Show feedback
                    const originalText = e.target.textContent;
                    e.target.textContent = 'Copied!';
                    setTimeout(() => {
                        e.target.textContent = originalText;
                    }, 2000);
                }
            }
        });

        // Setup search functionality
        searchButton.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    // Function to perform search
    function performSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();

        if (searchTerm === '') {
            // If search is empty, show all tools or current category
            const activeCategory = document.querySelector('.filter-btn.active').getAttribute('data-category');
            if (activeCategory === 'All') {
                displayTools(allTools);
            } else {
                const filteredTools = allTools.filter(tool => 
                    tool.category === activeCategory
                );
                displayTools(filteredTools);
            }
            return;
        }

        // Filter tools based on search term
        const searchResults = allTools.filter(tool => 
            tool.name.toLowerCase().includes(searchTerm) || 
            tool.description.toLowerCase().includes(searchTerm) ||
            tool.category.toLowerCase().includes(searchTerm)
        );

        // Display search results
        displayTools(searchResults);

        // Update UI to show we're in search mode
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector('.filter-btn[data-category="All"]').classList.add('active');
    }
});
