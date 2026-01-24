// Storage keys for localStorage
const STORAGE_KEY = 'foodTrackerData';
const CUSTOM_FOODS_KEY = 'foodTrackerCustomFoods';
const SEEDED_ENTRIES_KEY = 'foodTrackerSeededEntryIds';

// Get DOM elements
const foodForm = document.getElementById('food-form');
const dateInput = document.getElementById('date');
const mealTypeInput = document.getElementById('meal-type');
const foodNameInput = document.getElementById('food-name');
const caloriesInput = document.getElementById('calories');
const proteinInput = document.getElementById('protein');
const carbsInput = document.getElementById('carbs');
const fatInput = document.getElementById('fat');
const sodiumInput = document.getElementById('sodium');
const numServingsInput = document.getElementById('num-servings');
const servingSizeInput = document.getElementById('serving-size');
const gramsInput = document.getElementById('grams');
const entriesContainer = document.getElementById('entries-container');

// Store base nutrition values (per 1 serving) for multiplier calculation
let baseNutritionValues = null;
const filterDateInput = document.getElementById('filter-date');
const clearFilterBtn = document.getElementById('clear-filter');
const exportDataBtn = document.getElementById('export-data-btn');
const importDataBtn = document.getElementById('import-data-btn');
const importFileInput = document.getElementById('import-file-input');
const seedDataBtn = document.getElementById('seed-data-btn');
const toggleDetailsBtn = document.getElementById('toggle-details-btn');
const foodDetailsSection = document.getElementById('food-details-section');
const searchBtn = document.getElementById('search-btn');
const myFoodsBtn = document.getElementById('my-foods-btn');
const searchModal = document.getElementById('search-modal');
const closeModalBtn = document.getElementById('close-modal');
const searchResultsContainer = document.getElementById('search-results');
const modalTitle = document.getElementById('modal-title');
const customFoodsSearch = document.getElementById('custom-foods-search');
const customFoodsSearchInput = document.getElementById('custom-foods-search-input');
const saveCustomFoodCheckbox = document.getElementById('save-custom-food');
const layoutToggle = document.getElementById('layout-toggle');

// Edit modal elements
const editModal = document.getElementById('edit-modal');
const closeEditModalBtn = document.getElementById('close-edit-modal');
const cancelEditBtn = document.getElementById('cancel-edit');
const editForm = document.getElementById('edit-form');
const editDateInput = document.getElementById('edit-date');
const editMealTypeInput = document.getElementById('edit-meal-type');
const editFoodNameInput = document.getElementById('edit-food-name');
const editCaloriesInput = document.getElementById('edit-calories');
const editProteinInput = document.getElementById('edit-protein');
const editCarbsInput = document.getElementById('edit-carbs');
const editFatInput = document.getElementById('edit-fat');
const editSodiumInput = document.getElementById('edit-sodium');
const editNumServingsInput = document.getElementById('edit-num-servings');
const editServingSizeInput = document.getElementById('edit-serving-size');
const editGramsInput = document.getElementById('edit-grams');

let currentEditId = null;
let editBaseNutritionValues = null;
let customFoodsQuery = '';

// Initialize app
let foodEntries = loadEntries();
let customFoods = loadCustomFoods();
let currentFilter = null;
saveEntries();

// Layout toggle
const LAYOUT_KEY = 'foodTrackerLayout';
const DEFAULT_LAYOUT = 'compact';
const HERO_BACKGROUND_IMAGES = [
    'main_background/background_01.jpg',
    'main_background/background_02.jpg',
    'main_background/background_03.jpg',
    'main_background/background_04.jpg',
    'main_background/background_05.jpg',
    'main_background/background_07.jpg',
    'main_background/background_08.jpg',
    'main_background/background_09.jpg',
    'main_background/Hood_to_coast_01.jpg'
];

function applyLayout(layout) {
    const isSpacious = layout === 'spacious';
    document.body.classList.toggle('is-spacious', isSpacious);
    if (layoutToggle) {
        layoutToggle.checked = !isSpacious;
    }
}

function initializeLayoutToggle() {
    if (!layoutToggle) return;

    const savedLayout = localStorage.getItem(LAYOUT_KEY) || DEFAULT_LAYOUT;
    applyLayout(savedLayout);

    layoutToggle.addEventListener('change', () => {
        const layout = layoutToggle.checked ? 'compact' : 'spacious';
        localStorage.setItem(LAYOUT_KEY, layout);
        applyLayout(layout);
    });
}

function initializeHeroBackgroundRotation() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const layers = hero.querySelectorAll('.hero-background');
    const dotsContainer = hero.querySelector('.hero-dots');
    if (!HERO_BACKGROUND_IMAGES.length) return;

    let currentIndex = 0;
    let activeLayer = 0;
    let autoSlideInterval;
    const transitionDuration = 1000;

    const setLayerImage = (layerIndex, imageIndex) => {
        if (!layers[layerIndex]) return;
        layers[layerIndex].style.backgroundImage = `url('${HERO_BACKGROUND_IMAGES[imageIndex]}')`;
    };

    const updateDots = () => {
        if (!dotsContainer) return;
        dotsContainer.querySelectorAll('.hero-dot').forEach((dot, index) => {
            dot.classList.toggle('is-active', index === currentIndex);
        });
    };

    const goToBackground = (index) => {
        currentIndex = index;
        slideToCurrent();
    };

    const changeBackground = () => {
        currentIndex = (currentIndex + 1) % HERO_BACKGROUND_IMAGES.length;
        slideToCurrent();
    };

    const slideToCurrent = () => {
        if (!layers.length) return;

        const nextLayer = (activeLayer + 1) % layers.length;
        setLayerImage(nextLayer, currentIndex);

        layers[nextLayer].classList.remove('is-reset');
        layers[nextLayer].classList.remove('is-exit');
        layers[nextLayer].classList.remove('is-active');

        void layers[nextLayer].offsetWidth;
        layers[nextLayer].classList.add('is-active');

        layers[activeLayer].classList.remove('is-active');
        layers[activeLayer].classList.add('is-exit');

        const previousLayer = activeLayer;
        activeLayer = nextLayer;

        window.setTimeout(() => {
            if (layers[previousLayer]) {
                layers[previousLayer].classList.add('is-reset');
                layers[previousLayer].classList.remove('is-exit');
                layers[previousLayer].classList.remove('is-active');
                void layers[previousLayer].offsetWidth;
                layers[previousLayer].classList.remove('is-reset');
            }
        }, transitionDuration);

        updateDots();
        resetAutoSlide();
    };

    const resetAutoSlide = () => {
        clearInterval(autoSlideInterval);
        if (HERO_BACKGROUND_IMAGES.length < 2) return;
        autoSlideInterval = setInterval(changeBackground, 6000);
    };

    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        HERO_BACKGROUND_IMAGES.forEach((image, index) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'hero-dot';
            dot.setAttribute('aria-label', `Show background ${index + 1}`);
            dot.addEventListener('click', () => goToBackground(index));
            dotsContainer.appendChild(dot);
        });
    }

    if (layers.length) {
        setLayerImage(activeLayer, currentIndex);
        layers[activeLayer].classList.add('is-active');
    }

    updateDots();
    resetAutoSlide();
}

// Set default date to today
dateInput.valueAsDate = new Date();

// Event listeners
foodForm.addEventListener('submit', handleAddFood);
filterDateInput.addEventListener('change', handleFilterChange);
clearFilterBtn.addEventListener('click', handleClearFilter);
const clearFormBtn = document.getElementById('clear-form-btn');
clearFormBtn.addEventListener('click', handleClearForm);
exportDataBtn.addEventListener('click', handleExportData);
importDataBtn.addEventListener('click', () => importFileInput.click());
importFileInput.addEventListener('change', handleImportData);
seedDataBtn.addEventListener('click', seedRandomEntries);
toggleDetailsBtn.addEventListener('click', handleToggleDetails);
searchBtn.addEventListener('click', handleSearchNutrition);
myFoodsBtn.addEventListener('click', showMyFoods);
closeModalBtn.addEventListener('click', closeModal);
searchModal.addEventListener('click', (e) => {
    if (e.target === searchModal) closeModal();
});
closeEditModalBtn.addEventListener('click', closeEditModal);
cancelEditBtn.addEventListener('click', closeEditModal);
editModal.addEventListener('click', (e) => {
    if (e.target === editModal) closeEditModal();
});
editForm.addEventListener('submit', handleEditSubmit);
customFoodsSearchInput.addEventListener('input', handleCustomFoodsSearch);

// Add event listeners for serving multiplier
numServingsInput.addEventListener('input', handleServingMultiplierChange);
editNumServingsInput.addEventListener('input', handleEditServingMultiplierChange);

// Load entries from localStorage
function loadEntries() {
    const data = localStorage.getItem(STORAGE_KEY);
    const entries = data ? JSON.parse(data) : [];
    return normalizeEntries(entries);
}

// Save entries to localStorage
function saveEntries() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(foodEntries));
}

// Load custom foods from localStorage
function loadCustomFoods() {
    const data = localStorage.getItem(CUSTOM_FOODS_KEY);
    return data ? JSON.parse(data) : [];
}

// Save custom foods to localStorage
function saveCustomFoods() {
    localStorage.setItem(CUSTOM_FOODS_KEY, JSON.stringify(customFoods));
}

// Load seeded entry ids from localStorage
function loadSeededEntryIds() {
    const data = localStorage.getItem(SEEDED_ENTRIES_KEY);
    return data ? JSON.parse(data) : [];
}

// Save seeded entry ids to localStorage
function saveSeededEntryIds(ids) {
    localStorage.setItem(SEEDED_ENTRIES_KEY, JSON.stringify(ids));
}

function normalizeDateString(dateValue) {
    if (!dateValue) return '';

    if (typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
        return dateValue;
    }

    const parsed = new Date(dateValue);
    if (Number.isNaN(parsed.getTime())) {
        return '';
    }

    return getLocalDateString(parsed);
}

function normalizeEntries(entries) {
    if (!Array.isArray(entries)) return [];

    return entries.map(entry => {
        if (!entry || typeof entry !== 'object') return entry;
        const normalizedDate = normalizeDateString(entry.date);
        if (!normalizedDate || entry.date === normalizedDate) {
            return entry;
        }
        return {
            ...entry,
            date: normalizedDate
        };
    });
}

// Handle form submission
function handleAddFood(e) {
    e.preventDefault();
    
    const newEntry = {
        id: Date.now().toString(),
        date: normalizeDateString(dateInput.value),
        mealType: mealTypeInput.value,
        foodName: foodNameInput.value.trim(),
        numServings: parseFloat(numServingsInput.value) || 1,
        servingSize: servingSizeInput.value.trim(),
        grams: gramsInput.value ? parseFloat(gramsInput.value) : null,
        calories: parseFloat(caloriesInput.value),
        protein: parseFloat(proteinInput.value),
        carbs: parseFloat(carbsInput.value),
        fat: parseFloat(fatInput.value),
        sodium: parseFloat(sodiumInput.value)
    };
    
    foodEntries.push(newEntry);
    saveEntries();
    
    // Save as custom food if checkbox is checked
    if (saveCustomFoodCheckbox.checked) {
        const customFood = {
            id: Date.now().toString(),
            name: newEntry.foodName,
            servingSize: newEntry.servingSize,
            grams: newEntry.grams,
            calories: newEntry.calories,
            protein: newEntry.protein,
            carbs: newEntry.carbs,
            fat: newEntry.fat,
            sodium: newEntry.sodium
        };
        
        // Check if already exists
        const exists = customFoods.some(f => f.name.toLowerCase() === customFood.name.toLowerCase());
        if (!exists) {
            customFoods.push(customFood);
            saveCustomFoods();
            showNotification('Food entry added and saved to My Foods!');
        } else {
            showNotification('Food entry added successfully!');
        }
    } else {
        showNotification('Food entry added successfully!');
    }
    
    renderEntries();
    
    // Reset form
    foodForm.reset();
    dateInput.valueAsDate = new Date();
}

// Handle serving multiplier change
function handleServingMultiplierChange() {
    if (!baseNutritionValues) return;
    
    const multiplier = parseFloat(numServingsInput.value) || 1;
    caloriesInput.value = Math.round(baseNutritionValues.calories * multiplier);
    proteinInput.value = Math.round(baseNutritionValues.protein * multiplier * 10) / 10;
    carbsInput.value = Math.round(baseNutritionValues.carbs * multiplier * 10) / 10;
    fatInput.value = Math.round(baseNutritionValues.fat * multiplier * 10) / 10;
    sodiumInput.value = Math.round(baseNutritionValues.sodium * multiplier);
    
    if (baseNutritionValues.grams) {
        gramsInput.value = Math.round(baseNutritionValues.grams * multiplier * 10) / 10;
    }
}

// Handle edit serving multiplier change
function handleEditServingMultiplierChange() {
    if (!editBaseNutritionValues) return;
    
    const multiplier = parseFloat(editNumServingsInput.value) || 1;
    editCaloriesInput.value = Math.round(editBaseNutritionValues.calories * multiplier);
    editProteinInput.value = Math.round(editBaseNutritionValues.protein * multiplier * 10) / 10;
    editCarbsInput.value = Math.round(editBaseNutritionValues.carbs * multiplier * 10) / 10;
    editFatInput.value = Math.round(editBaseNutritionValues.fat * multiplier * 10) / 10;
    editSodiumInput.value = Math.round(editBaseNutritionValues.sodium * multiplier);
    
    if (editBaseNutritionValues.grams) {
        editGramsInput.value = Math.round(editBaseNutritionValues.grams * multiplier * 10) / 10;
    }
}

// Delete entry
function deleteEntry(id) {
    if (confirm('Are you sure you want to delete this entry?')) {
        foodEntries = foodEntries.filter(entry => entry.id !== id);
        saveEntries();
        renderEntries();
        showNotification('Entry deleted successfully!');
    }
}

// Delete all entries for a date
function deleteEntriesByDate(date) {
    const dateLabel = formatDate(date);
    if (confirm(`Delete all entries for ${dateLabel}?`)) {
        foodEntries = foodEntries.filter(entry => entry.date !== date);
        saveEntries();
        renderEntries();
        showNotification('All entries for the day deleted.');
    }
}

// Handle toggle details
function handleToggleDetails() {
    const isCollapsed = foodDetailsSection.classList.contains('collapsed');
    
    if (isCollapsed) {
        foodDetailsSection.classList.remove('collapsed');
        toggleDetailsBtn.textContent = '▲ Hide Details';
    } else {
        foodDetailsSection.classList.add('collapsed');
        toggleDetailsBtn.textContent = '▼ Show Details';
    }
}

// Handle filter change
function handleFilterChange() {
    currentFilter = filterDateInput.value;
    renderEntries();
}

// Handle clear filter
function handleClearFilter() {
    currentFilter = null;
    filterDateInput.value = '';
    renderEntries();
}

// Handle clear form
function handleClearForm() {
    // Clear all input fields except date and meal type
    foodNameInput.value = '';
    numServingsInput.value = 1;
    servingSizeInput.value = '';
    gramsInput.value = '';
    caloriesInput.value = '';
    proteinInput.value = '';
    carbsInput.value = '';
    fatInput.value = '';
    sodiumInput.value = '';
    saveCustomFoodCheckbox.checked = false;
    
    // Reset base nutrition values
    baseNutritionValues = null;
    
    showNotification('Form cleared');
}

// Handle export data
function handleExportData() {
    const exportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        foodEntries: foodEntries,
        customFoods: customFoods
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `food-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showNotification('Data exported successfully!');
}

// Seed random entries for last 7 days
function seedRandomEntries() {
    if (!confirm('This will add random entries for the last 7 days. Continue?')) return;

    // Remove previously seeded entries
    const seededIds = loadSeededEntryIds();
    if (seededIds.length > 0) {
        foodEntries = foodEntries.filter(entry => !seededIds.includes(entry.id));
    }
    foodEntries = foodEntries.filter(entry => entry.seedTag !== 'seed-7-days');

    const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
    const sampleFoods = [
        { name: 'Oatmeal', servingSize: '1 bowl', grams: 250 },
        { name: 'Chicken Salad', servingSize: '1 plate', grams: 300 },
        { name: 'Turkey Sandwich', servingSize: '1 sandwich', grams: 220 },
        { name: 'Greek Yogurt', servingSize: '1 cup', grams: 200 },
        { name: 'Protein Shake', servingSize: '1 bottle', grams: 330 },
        { name: 'Salmon Bowl', servingSize: '1 bowl', grams: 320 },
        { name: 'Pasta', servingSize: '1 plate', grams: 280 },
        { name: 'Fruit Snack', servingSize: '1 cup', grams: 180 },
        { name: 'Eggs & Toast', servingSize: '2 eggs + toast', grams: 200 },
        { name: 'Veggie Wrap', servingSize: '1 wrap', grams: 210 }
    ];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const newSeededIds = [];

    for (let i = 0; i < 7; i++) {
        const dateObj = new Date(today);
        dateObj.setDate(today.getDate() - i);
        const dateStr = getLocalDateString(dateObj);

        const dailyTarget = getRandomInt(1600, 2000);
        const mealsForDay = mealTypes.map(type => ({
            type,
            calories: 0
        }));

        // Allocate calories across meals
        const baseCalories = dailyTarget - 200; // leave room for randomness
        const distribution = [0.25, 0.3, 0.3, 0.15];
        mealsForDay.forEach((meal, idx) => {
            const jitter = getRandomInt(-50, 50);
            meal.calories = Math.max(200, Math.round(baseCalories * distribution[idx] + jitter));
        });

        // Normalize total to target range
        let total = mealsForDay.reduce((sum, m) => sum + m.calories, 0);
        const diff = dailyTarget - total;
        mealsForDay[2].calories += diff; // adjust dinner

        mealsForDay.forEach(meal => {
            const food = sampleFoods[getRandomInt(0, sampleFoods.length - 1)];
            const calories = meal.calories;
            const protein = Math.round(calories * 0.25 / 4); // ~25% cals
            const carbs = Math.round(calories * 0.45 / 4);   // ~45% cals
            const fat = Math.round(calories * 0.30 / 9);     // ~30% cals
            const sodium = getRandomInt(200, 900);

            const entryId = Date.now().toString() + Math.random().toString(36).slice(2, 7);
            foodEntries.push({
                id: entryId,
                date: dateStr,
                mealType: meal.type,
                foodName: food.name,
                numServings: 1,
                servingSize: food.servingSize,
                grams: food.grams,
                calories,
                protein,
                carbs,
                fat,
                sodium,
                seedTag: 'seed-7-days'
            });
            newSeededIds.push(entryId);
        });
    }

    saveEntries();
    saveSeededEntryIds(newSeededIds);
    renderEntries();
    showNotification('Random entries added for last 7 days.');
}

function getLocalDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Handle import data
function handleImportData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const importData = JSON.parse(e.target.result);
            
            // Validate data structure
            if (!importData.foodEntries || !Array.isArray(importData.foodEntries)) {
                throw new Error('Invalid data format');
            }
            
            // Confirm before overwriting
            const confirmMsg = `This will replace all current data.\n\nCurrent entries: ${foodEntries.length}\nImporting entries: ${importData.foodEntries.length}\n\nContinue?`;
            
            if (!confirm(confirmMsg)) {
                importFileInput.value = ''; // Reset file input
                return;
            }
            
            // Import data
            foodEntries = normalizeEntries(importData.foodEntries);
            customFoods = importData.customFoods || [];
            
            // Save to localStorage
            saveEntries();
            saveCustomFoods();
            
            // Refresh display
            renderEntries();
            
            showNotification(`Data imported successfully! ${foodEntries.length} entries restored.`);
            
        } catch (error) {
            console.error('Import error:', error);
            alert('Failed to import data. Please ensure the file is a valid Food Tracker backup.');
        }
        
        // Reset file input
        importFileInput.value = '';
    };
    
    reader.readAsText(file);
}

// Search for nutrition information
async function handleSearchNutrition() {
    const foodName = foodNameInput.value.trim();
    
    if (!foodName) {
        alert('Please enter a food name first');
        return;
    }
    
    searchBtn.disabled = true;
    searchBtn.textContent = '🔍 Searching...';
    
    try {
        const results = await searchFoodNutrition(foodName);
        displaySearchResults(results);
        openModal();
    } catch (error) {
        console.error('Search error:', error);
        alert('Failed to search nutrition data. Please try again.');
    } finally {
        searchBtn.disabled = false;
        searchBtn.textContent = '🔍 Search Nutrition';
    }
}

// Search USDA FoodData Central API
async function searchFoodNutrition(foodName) {
    const apiUrl = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(foodName)}&pageSize=5&api_key=DEMO_KEY`;
    
    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error('API request failed');
    }
    
    const data = await response.json();
    return data.foods || [];
}

// Display search results in modal
function displaySearchResults(foods) {
    modalTitle.textContent = 'Select Nutritional Information';
    customFoodsSearch.classList.add('is-hidden');
    customFoodsSearchInput.value = '';
    customFoodsQuery = '';
    
    if (foods.length === 0) {
        searchResultsContainer.innerHTML = `
            <div class="no-results">
                <strong>No results found</strong>
                <p>This might be a branded product or supplement not in the USDA database.</p>
                <p><strong>Tip:</strong> Close this window, manually enter the nutrition info from the product label, and check "Save as custom food" to reuse it later!</p>
            </div>
        `;
        return;
    }
    
    searchResultsContainer.innerHTML = foods.map(food => {
        const nutrients = extractNutrients(food);
        return `
            <div class="search-result-item" data-food='${JSON.stringify(nutrients).replace(/'/g, "&apos;")}'>
                <div class="result-food-name">${food.description}</div>
                <div class="result-macros">
                    <div class="result-macro"><strong>Calories:</strong> ${nutrients.calories}</div>
                    <div class="result-macro"><strong>Protein:</strong> ${nutrients.protein}g</div>
                    <div class="result-macro"><strong>Carbs:</strong> ${nutrients.carbs}g</div>
                    <div class="result-macro"><strong>Fat:</strong> ${nutrients.fat}g</div>
                    <div class="result-macro"><strong>Sodium:</strong> ${nutrients.sodium}mg</div>
                </div>
            </div>
        `;
    }).join('');
    
    // Add click handlers
    document.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => {
            const foodData = JSON.parse(item.dataset.food);
            fillNutritionFields(foodData);
            closeModal();
        });
    });
}

// Extract nutrients from API response
function extractNutrients(food) {
    const nutrients = food.foodNutrients || [];
    
    const findNutrient = (names) => {
        const nutrient = nutrients.find(n => 
            names.some(name => n.nutrientName && n.nutrientName.toLowerCase().includes(name.toLowerCase()))
        );
        return nutrient ? Math.round(nutrient.value * 10) / 10 : 0;
    };
    
    return {
        name: food.description,
        calories: findNutrient(['Energy', 'Calories']) || Math.round((findNutrient(['Protein']) * 4) + (findNutrient(['Carbohydrate']) * 4) + (findNutrient(['Total lipid', 'Fat']) * 9)),
        protein: findNutrient(['Protein']),
        carbs: findNutrient(['Carbohydrate']),
        fat: findNutrient(['Total lipid', 'Fat']),
        sodium: findNutrient(['Sodium'])
    };
}

// Fill nutrition fields with selected data
function fillNutritionFields(foodData) {
    // Store base nutrition values for multiplier calculations
    baseNutritionValues = {
        calories: foodData.calories,
        protein: foodData.protein,
        carbs: foodData.carbs,
        fat: foodData.fat,
        sodium: foodData.sodium || 0,
        grams: foodData.grams || null
    };
    
    // Reset to 1 serving and fill fields
    numServingsInput.value = 1;
    if (foodData.servingSize) servingSizeInput.value = foodData.servingSize;
    if (foodData.grams) gramsInput.value = foodData.grams;
    caloriesInput.value = foodData.calories;
    proteinInput.value = foodData.protein;
    carbsInput.value = foodData.carbs;
    fatInput.value = foodData.fat;
    sodiumInput.value = foodData.sodium || 0;
    
    showNotification('Nutrition data loaded! Adjust "Number of Servings" to multiply macros.');
}

// Open modal
function openModal() {
    searchModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    searchModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Open edit modal
function openEditModal(id) {
    const entry = foodEntries.find(e => e.id === id);
    if (!entry) return;
    
    currentEditId = id;
    
    // Calculate base values (divide by num servings to get per-serving values)
    const numServings = entry.numServings || 1;
    editBaseNutritionValues = {
        calories: Math.round(entry.calories / numServings),
        protein: Math.round((entry.protein / numServings) * 10) / 10,
        carbs: Math.round((entry.carbs / numServings) * 10) / 10,
        fat: Math.round((entry.fat / numServings) * 10) / 10,
        sodium: Math.round(entry.sodium / numServings),
        grams: entry.grams ? Math.round((entry.grams / numServings) * 10) / 10 : null
    };
    
    editDateInput.value = entry.date;
    editMealTypeInput.value = entry.mealType;
    editFoodNameInput.value = entry.foodName;
    editNumServingsInput.value = numServings;
    editServingSizeInput.value = entry.servingSize || '';
    editGramsInput.value = entry.grams || '';
    editCaloriesInput.value = entry.calories;
    editProteinInput.value = entry.protein;
    editCarbsInput.value = entry.carbs;
    editFatInput.value = entry.fat;
    editSodiumInput.value = entry.sodium;
    
    editModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close edit modal
function closeEditModal() {
    editModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    currentEditId = null;
}

// Handle edit form submission
function handleEditSubmit(e) {
    e.preventDefault();
    
    const entryIndex = foodEntries.findIndex(e => e.id === currentEditId);
    if (entryIndex === -1) return;
    
    // Update the entry
    foodEntries[entryIndex] = {
        id: currentEditId,
        date: normalizeDateString(editDateInput.value),
        mealType: editMealTypeInput.value,
        foodName: editFoodNameInput.value.trim(),
        numServings: parseFloat(editNumServingsInput.value) || 1,
        servingSize: editServingSizeInput.value.trim(),
        grams: editGramsInput.value ? parseFloat(editGramsInput.value) : null,
        calories: parseFloat(editCaloriesInput.value),
        protein: parseFloat(editProteinInput.value),
        carbs: parseFloat(editCarbsInput.value),
        fat: parseFloat(editFatInput.value),
        sodium: parseFloat(editSodiumInput.value)
    };
    
    saveEntries();
    renderEntries();
    closeEditModal();
    showNotification('Food entry updated successfully!');
}

// Show custom foods
function showMyFoods() {
    modalTitle.textContent = 'My Custom Foods';
    customFoodsSearchInput.value = '';
    customFoodsQuery = '';
    
    if (customFoods.length === 0) {
        customFoodsSearch.classList.add('is-hidden');
        searchResultsContainer.innerHTML = `
            <div class="no-results">
                <strong>No custom foods yet</strong>
                <p>Save your frequently used foods (supplements, protein powders, etc.) by checking "Save as custom food" when adding them!</p>
            </div>
        `;
        openModal();
        return;
    }

    customFoodsSearch.classList.remove('is-hidden');
    renderCustomFoodsList(customFoods);
    openModal();
}

function handleCustomFoodsSearch() {
    customFoodsQuery = customFoodsSearchInput.value.trim().toLowerCase();
    const filteredFoods = customFoods.filter(food =>
        food.name.toLowerCase().includes(customFoodsQuery)
    );
    renderCustomFoodsList(filteredFoods);
}

function renderCustomFoodsList(foods) {
    if (foods.length === 0) {
        searchResultsContainer.innerHTML = customFoods.length === 0 ? `
            <div class="no-results">
                <strong>No custom foods yet</strong>
                <p>Save your frequently used foods (supplements, protein powders, etc.) by checking "Save as custom food" when adding them!</p>
            </div>
        ` : `
            <div class="no-results">
                <strong>No matches found</strong>
                <p>Try a different search term.</p>
            </div>
        `;
        return;
    }
    
    searchResultsContainer.innerHTML = foods.map(food => `
        <div class="search-result-item custom-food-item" data-food='${JSON.stringify(food).replace(/'/g, "&apos;")}'>
            <button class="delete-custom-food" data-id="${food.id}">Delete</button>
            <div class="result-food-name">${food.name}</div>
            ${food.servingSize ? `<div class="result-serving">${food.servingSize}${food.grams ? ` (${food.grams}g)` : ''}</div>` : ''}
            <div class="result-macros">
                <div class="result-macro"><strong>Calories:</strong> ${food.calories}</div>
                <div class="result-macro"><strong>Protein:</strong> ${food.protein}g</div>
                <div class="result-macro"><strong>Carbs:</strong> ${food.carbs}g</div>
                <div class="result-macro"><strong>Fat:</strong> ${food.fat}g</div>
                <div class="result-macro"><strong>Sodium:</strong> ${food.sodium || 0}mg</div>
            </div>
        </div>
    `).join('');
    
    // Add click handlers for selecting
    document.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', (e) => {
            // Don't trigger if clicking delete button
            if (e.target.classList.contains('delete-custom-food')) return;
            
            const foodData = JSON.parse(item.dataset.food);
            fillNutritionFields(foodData);
            closeModal();
        });
    });
    
    // Add delete handlers
    document.querySelectorAll('.delete-custom-food').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = btn.dataset.id;
            deleteCustomFood(id);
        });
    });
}

// Delete custom food
function deleteCustomFood(id) {
    if (confirm('Delete this custom food?')) {
        customFoods = customFoods.filter(f => f.id !== id);
        saveCustomFoods();
        showMyFoods(); // Refresh the list
        showNotification('Custom food deleted');
    }
}

// Render all entries
function renderEntries() {
    let entriesToDisplay = [...foodEntries];
    
    // Apply filter if set
    if (currentFilter) {
        entriesToDisplay = entriesToDisplay.filter(entry => entry.date === currentFilter);
    }
    
    if (entriesToDisplay.length === 0) {
        entriesContainer.innerHTML = '<div class="empty-state">No food entries yet. Start tracking your meals!</div>';
        return;
    }
    
    // Group entries by date
    const groupedByDate = groupByDate(entriesToDisplay);
    
    // Sort dates in descending order (newest first)
    const sortedDates = Object.keys(groupedByDate).sort((a, b) => new Date(b) - new Date(a));
    
    entriesContainer.innerHTML = sortedDates.map(date => {
        const dateEntries = groupedByDate[date];
        const mealOrder = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
        const groupedByMeal = groupByMealType(dateEntries);
        
        // Calculate daily totals
        const dailyTotals = calculateTotals(dateEntries);
        
        return `
            <div class="date-group">
                <div class="date-header">
                    <span>${formatDate(date)}</span>
                    <button class="btn-delete-day" data-date="${date}">Delete Day</button>
                </div>
                <div class="date-summary">
                    <div class="summary-item"><strong>Total Calories:</strong> ${dailyTotals.calories}</div>
                    <div class="summary-item"><strong>Protein:</strong> ${dailyTotals.protein}g</div>
                    <div class="summary-item"><strong>Carbs:</strong> ${dailyTotals.carbs}g</div>
                    <div class="summary-item"><strong>Fat:</strong> ${dailyTotals.fat}g</div>
                    <div class="summary-item"><strong>Sodium:</strong> ${dailyTotals.sodium}mg</div>
                </div>
                ${mealOrder.map(mealType => {
                    if (groupedByMeal[mealType] && groupedByMeal[mealType].length > 0) {
                        return renderMealGroup(mealType, groupedByMeal[mealType]);
                    }
                    return '';
                }).join('')}
            </div>
        `;
    }).join('');
    
    // Attach edit event listeners
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            openEditModal(id);
        });
    });
    
    // Attach delete event listeners
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            deleteEntry(id);
        });
    });

    // Attach delete-day event listeners
    document.querySelectorAll('.btn-delete-day').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const date = e.target.dataset.date;
            deleteEntriesByDate(date);
        });
    });
}

// Group entries by date
function groupByDate(entries) {
    return entries.reduce((groups, entry) => {
        const date = entry.date;
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(entry);
        return groups;
    }, {});
}

// Group entries by meal type
function groupByMealType(entries) {
    return entries.reduce((groups, entry) => {
        const mealType = entry.mealType;
        if (!groups[mealType]) {
            groups[mealType] = [];
        }
        groups[mealType].push(entry);
        return groups;
    }, {});
}

// Render meal group
function renderMealGroup(mealType, entries) {
    return `
        <div class="meal-group">
            <div class="meal-type">${mealType}</div>
            <div class="meal-entries">
                ${entries.map(entry => `
                    <div class="food-item">
                        <div class="food-info">
                            <div class="food-name">${entry.foodName}</div>
                            <div class="food-serving">${entry.numServings && entry.numServings !== 1 ? `${entry.numServings}x ` : ''}${entry.servingSize}${entry.grams ? ` (${entry.grams}g)` : ''}</div>
                            <div class="food-macros">
                                <div class="macro">
                                    <span class="macro-label">Cal:</span>
                                    <span>${entry.calories}</span>
                                </div>
                                <div class="macro">
                                    <span class="macro-label">P:</span>
                                    <span>${entry.protein}g</span>
                                </div>
                                <div class="macro">
                                    <span class="macro-label">C:</span>
                                    <span>${entry.carbs}g</span>
                                </div>
                                <div class="macro">
                                    <span class="macro-label">F:</span>
                                    <span>${entry.fat}g</span>
                                </div>
                                <div class="macro">
                                    <span class="macro-label">Na:</span>
                                    <span>${entry.sodium}mg</span>
                                </div>
                            </div>
                        </div>
                        <div class="food-actions">
                            <button class="btn-edit" data-id="${entry.id}">Edit</button>
                            <button class="btn-delete" data-id="${entry.id}">Delete</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Calculate totals for entries
function calculateTotals(entries) {
    return entries.reduce((totals, entry) => {
        totals.calories += entry.calories;
        totals.protein += entry.protein;
        totals.carbs += entry.carbs;
        totals.fat += entry.fat;
        totals.sodium += entry.sodium || 0;
        return totals;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0, sodium: 0 });
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const entryDate = new Date(date);
    entryDate.setHours(0, 0, 0, 0);
    
    if (entryDate.getTime() === today.getTime()) {
        return 'Today - ' + date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    } else if (entryDate.getTime() === yesterday.getTime()) {
        return 'Yesterday - ' + date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    } else if (entryDate.getTime() === tomorrow.getTime()) {
        return 'Tomorrow - ' + date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    } else {
        return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }
}

// Show notification
function showNotification(message) {
    // Simple alert for now - could be enhanced with a toast notification
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initial render
renderEntries();
initializeLayoutToggle();
initializeHeroBackgroundRotation();

// ===== STATS FUNCTIONALITY =====
let caloriesChart = null;
let macrosChart = null;
let weeklyChart = null;

function initializeCharts() {
    const caloriesCtx = document.getElementById('calories-chart');
    const macrosCtx = document.getElementById('macros-chart');
    const weeklyCtx = document.getElementById('weekly-chart');

    if (!caloriesCtx || !macrosCtx || !weeklyCtx) {
        console.log('Chart canvases not found, retrying...');
        setTimeout(initializeCharts, 200);
        return;
    }

    console.log('Initializing charts...');

    // Chart.js default configuration
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                labels: {
                    font: {
                        family: "'Inter', sans-serif",
                        weight: 700,
                        size: 12
                    },
                    color: '#000000'
                }
            }
        }
    };

    // Daily Calories Bar Chart
    caloriesChart = new Chart(caloriesCtx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Calories',
                data: [],
                backgroundColor: '#d7392e',
                borderColor: '#000000',
                borderWidth: 2
            }]
        },
        options: {
            ...chartOptions,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#e5e5e5'
                    },
                    ticks: {
                        font: {
                            family: "'Inter', sans-serif",
                            weight: 600
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: "'Inter', sans-serif",
                            weight: 600
                        }
                    }
                }
            }
        }
    });

    // Macros Pie Chart
    macrosChart = new Chart(macrosCtx, {
        type: 'doughnut',
        data: {
            labels: ['Protein', 'Carbs', 'Fat'],
            datasets: [{
                data: [0, 0, 0],
                backgroundColor: ['#d7392e', '#ec6533', '#000000'],
                borderColor: '#ffffff',
                borderWidth: 3
            }]
        },
        options: {
            ...chartOptions,
            cutout: '60%'
        }
    });

    // Weekly Overview Line Chart
    weeklyChart = new Chart(weeklyCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Calories',
                    data: [],
                    borderColor: '#d7392e',
                    backgroundColor: 'rgba(215, 57, 46, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    yAxisID: 'y'
                },
                {
                    label: 'Protein (g)',
                    data: [],
                    borderColor: '#ec6533',
                    backgroundColor: 'rgba(236, 101, 51, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            ...chartOptions,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#e5e5e5'
                    },
                    ticks: {
                        font: {
                            family: "'Inter', sans-serif",
                            weight: 600
                        }
                    },
                    title: {
                        display: true,
                        text: 'Calories',
                        font: {
                            family: "'Inter', sans-serif",
                            weight: 700
                        },
                        color: '#000000'
                    }
                },
                y1: {
                    beginAtZero: true,
                    position: 'right',
                    grid: {
                        drawOnChartArea: false
                    },
                    ticks: {
                        font: {
                            family: "'Inter', sans-serif",
                            weight: 600
                        }
                    },
                    title: {
                        display: true,
                        text: 'Protein (g)',
                        font: {
                            family: "'Inter', sans-serif",
                            weight: 700
                        },
                        color: '#000000'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: "'Inter', sans-serif",
                            weight: 600
                        }
                    }
                }
            }
        }
    });

    console.log('Charts initialized successfully');
    updateStats();
}

function updateStats() {
    const entries = loadEntries();
    
    console.log('Updating stats with entries:', entries);
    
    if (!entries || entries.length === 0) {
        console.log('No entries found');
        // Set default values for empty state
        document.getElementById('avg-calories').textContent = '0';
        document.getElementById('total-protein').textContent = '0g';
        document.getElementById('total-entries').textContent = '0';
        document.getElementById('best-day').textContent = '—';
        return;
    }
    
    // Get last 7 days of data
    const last7Days = getLast7DaysData(entries);
    const todayData = getTodayData(entries);
    
    console.log('Last 7 days data:', last7Days);
    console.log('Today data:', todayData);
    
    // Update Daily Calories Chart
    updateCaloriesChart(last7Days);
    
    // Update Macros Breakdown (Today)
    updateMacrosChart(todayData);
    
    // Update Weekly Overview
    updateWeeklyChart(last7Days);
    
    // Update Quick Stats
    updateQuickStats(entries, last7Days);
    
    console.log('Stats updated:', { entries: entries.length, last7Days });
}

function getLast7DaysData(entries) {
    const today = new Date();
    const last7Days = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = getLocalDateString(date);
        
        const dayEntries = entries.filter(entry => entry.date === dateStr);
        const totals = calculateDayTotals(dayEntries);
        
        last7Days.push({
            date: dateStr,
            label: formatDateLabel(date),
            ...totals
        });
    }
    
    return last7Days;
}

function getTodayData(entries) {
    const today = getLocalDateString(new Date());
    const todayEntries = entries.filter(entry => entry.date === today);
    return calculateDayTotals(todayEntries);
}

function calculateDayTotals(entries) {
    return entries.reduce((totals, entry) => {
        totals.calories += entry.calories || 0;
        totals.protein += entry.protein || 0;
        totals.carbs += entry.carbs || 0;
        totals.fat += entry.fat || 0;
        return totals;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
}

function formatDateLabel(date) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[date.getDay()]} ${months[date.getMonth()]} ${date.getDate()}`;
}

function updateCaloriesChart(last7Days) {
    if (!caloriesChart) return;
    
    caloriesChart.data.labels = last7Days.map(day => day.label);
    caloriesChart.data.datasets[0].data = last7Days.map(day => day.calories);
    caloriesChart.update();
}


function updateMacrosChart(todayData) {
    if (!macrosChart) return;
    
    const { protein, carbs, fat } = todayData;
    
    // Convert to calories (protein: 4 cal/g, carbs: 4 cal/g, fat: 9 cal/g)
    const proteinCals = protein * 4;
    const carbsCals = carbs * 4;
    const fatCals = fat * 9;

    const totalCals = proteinCals + carbsCals + fatCals;
    if (totalCals === 0) {
        macrosChart.data.datasets[0].data = [1, 1, 1];
        macrosChart.data.datasets[0].backgroundColor = ['#e5e5e5', '#e5e5e5', '#e5e5e5'];
        macrosChart.data.datasets[0].borderColor = '#ffffff';
    } else {
        macrosChart.data.datasets[0].data = [proteinCals, carbsCals, fatCals];
        macrosChart.data.datasets[0].backgroundColor = ['#d7392e', '#ec6533', '#000000'];
        macrosChart.data.datasets[0].borderColor = '#ffffff';
    }
    macrosChart.update();
}

function updateWeeklyChart(last7Days) {
    if (!weeklyChart) return;
    
    weeklyChart.data.labels = last7Days.map(day => day.label);
    weeklyChart.data.datasets[0].data = last7Days.map(day => day.calories);
    weeklyChart.data.datasets[1].data = last7Days.map(day => day.protein);
    weeklyChart.update();
}

function updateQuickStats(entries, last7Days) {
    // Average daily calories (last 7 days)
    const avgCalories = Math.round(
        last7Days.reduce((sum, day) => sum + day.calories, 0) / 7
    );
    document.getElementById('avg-calories').textContent = avgCalories;
    
    // Total protein (last 7 days)
    const totalProtein = Math.round(
        last7Days.reduce((sum, day) => sum + day.protein, 0)
    );
    document.getElementById('total-protein').textContent = `${totalProtein}g`;
    
    // Total entries
    document.getElementById('total-entries').textContent = entries.length;
    
    // Most energy intake (highest total calories day)
    const dayCalories = {};
    entries.forEach(entry => {
        dayCalories[entry.date] = (dayCalories[entry.date] || 0) + (entry.calories || 0);
    });

    let bestDay = '—';
    let maxCalories = 0;
    for (const [date, totalCalories] of Object.entries(dayCalories)) {
        if (totalCalories > maxCalories) {
            maxCalories = totalCalories;
            const dateObj = new Date(date + 'T00:00:00');
            bestDay = formatDateLabel(dateObj);
        }
    }
    document.getElementById('best-day').textContent = bestDay;
}

// Initialize charts when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initializeCharts, 100);
    });
} else {
    setTimeout(initializeCharts, 100);
}

// Override renderEntries to update stats
const _originalRenderEntries = renderEntries;
window.renderEntries = function() {
    _originalRenderEntries.call(this);
    if (caloriesChart && macrosChart && weeklyChart) {
        updateStats();
    }
};

// Also listen for storage changes
window.addEventListener('storage', function(e) {
    if (e.key === STORAGE_KEY && (caloriesChart && macrosChart && weeklyChart)) {
        updateStats();
    }
});
