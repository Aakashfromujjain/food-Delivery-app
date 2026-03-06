// 1. Data Array
const allDishes = [
    { id: 1, name: "Hyderabadi Chicken Biryani", category: "Biryani", tags: "Authentic, Spiced", rating: "4.9", price: "₹350", isVeg: false, protein: 25, fiber: 2, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&q=80" },
    { id: 2, name: "Butter Chicken & Naan", category: "North Indian", tags: "Curry, Rich", rating: "4.8", price: "₹420", isVeg: false, protein: 30, fiber: 4, image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&q=80" },
    { id: 3, name: "Crispy Masala Dosa", category: "South Indian", tags: "Breakfast, Light", rating: "4.7", price: "₹180", isVeg: true, protein: 8, fiber: 5, image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&q=80" },
    { id: 4, name: "Spicy Pani Puri", category: "North Indian", tags: "Street Food, Chaat", rating: "4.6", price: "₹80", isVeg: true, protein: 3, fiber: 2, image: "https://images.unsplash.com/photo-1601050690597-df0568a70950?w=500&q=80" },
    { id: 5, name: "Paneer Tikka Masala", category: "North Indian", tags: "Vegetarian, Tandoor", rating: "4.5", price: "₹320", isVeg: true, protein: 18, fiber: 6, image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&q=80" },
    { id: 6, name: "Mutton Rogan Josh", category: "North Indian", tags: "Curry, Meat", rating: "4.8", price: "₹450", isVeg: false, protein: 35, fiber: 3, image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&q=80" },
    { id: 7, name: "Hot Gulab Jamun", category: "Desserts", tags: "Sweets, Warm", rating: "4.9", price: "₹120", isVeg: true, protein: 4, fiber: 0, image: "https://images.unsplash.com/photo-1593701461250-d7b228f2eb37?w=500&q=80" },
    { id: 8, name: "Idli Sambar", category: "South Indian", tags: "Breakfast, Healthy", rating: "4.6", price: "₹140", isVeg: true, protein: 10, fiber: 8, image: "https://images.unsplash.com/photo-1589301760014-d929f39ce9b0?w=500&q=80" },
    { id: 9, name: "Vegetable Biryani", category: "Biryani", tags: "Aromatic, Mixed Veg", rating: "4.4", price: "₹250", isVeg: true, protein: 12, fiber: 9, image: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=500&q=80" }
];

// 2. Global State
let cartItems = 0;
let totalProtein = 0;
let totalFiber = 0;
let currentCategory = 'All';
let searchQuery = '';
let isVegOnly = false;

// 3. Flawless Filtering Logic
function applyFilters() {
    // Start with all dishes
    let filteredDishes = allDishes;

    // A. Apply Veg Filter FIRST
    if (isVegOnly) {
        filteredDishes = filteredDishes.filter(dish => dish.isVeg === true);
    }

    // B. Apply Category Filter SECOND
    if (currentCategory !== 'All') {
        filteredDishes = filteredDishes.filter(dish => dish.category === currentCategory);
    }

    // C. Apply Text Search THIRD
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredDishes = filteredDishes.filter(dish => 
            dish.name.toLowerCase().includes(query) || 
            dish.tags.toLowerCase().includes(query)
        );
    }

    renderDishes(filteredDishes);
}

// 4. Interaction Handlers
function handleSearch() {
    searchQuery = document.getElementById('search-input').value;
    applyFilters();
}

function handleVegToggle() {
    isVegOnly = document.getElementById('veg-toggle').checked;
    applyFilters();
}

function setCategory(categoryName) {
    currentCategory = categoryName;
    document.getElementById('current-page-title').innerText = categoryName === 'All' ? 'Top dishes near you' : `${categoryName} Dishes`;
    
    // Update active UI state on category chips
    const buttons = document.querySelectorAll('.category-chip');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if(btn.innerText === categoryName) btn.classList.add('active');
    });

    applyFilters();
}

function resetFilters() {
    document.getElementById('search-input').value = '';
    document.getElementById('veg-toggle').checked = false;
    searchQuery = '';
    isVegOnly = false;
    setCategory('All');
}

// 5. Macro Animations & Cart Logic
function animateMacro(elementId) {
    const el = document.getElementById(elementId);
    // Remove class and trigger a reflow to restart the animation
    el.classList.remove('pop-anim');
    void el.offsetWidth; 
    el.classList.add('pop-anim');
}

function addToCart(event, dishId) {
    event.stopPropagation();
    
    const dish = allDishes.find(d => d.id === dishId);
    
    // Update State
    cartItems++;
    totalProtein += dish.protein;
    totalFiber += dish.fiber;

    // Update DOM
    document.getElementById('cart-count').innerText = cartItems;
    document.getElementById('protein-count').innerText = totalProtein;
    document.getElementById('fiber-count').innerText = totalFiber;
    
    // Trigger CSS Pop Animation
    animateMacro('protein-count');
    animateMacro('fiber-count');
    
    // Button Feedback
    const btn = event.target;
    const originalText = btn.innerText;
    btn.innerText = "Added!";
    btn.style.backgroundColor = "var(--primary-purple)";
    btn.style.color = "white";
    
    setTimeout(() => {
        btn.innerText = originalText;
        btn.style.backgroundColor = "white";
        btn.style.color = "var(--primary-purple)";
    }, 1000);
}

// 6. Rendering Logic
function renderDishes(dishesToRender) {
    const grid = document.getElementById('dish-grid');
    const noResults = document.getElementById('no-results');
    grid.innerHTML = ''; 

    if (dishesToRender.length === 0) {
        noResults.style.display = 'block';
        return;
    } else {
        noResults.style.display = 'none';
    }

    dishesToRender.forEach(dish => {
        const iconClass = dish.isVeg ? 'veg-icon' : 'nonveg-icon';
        
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div style="overflow: hidden;">
                <img src="${dish.image}" alt="${dish.name}" class="card-img">
            </div>
            <div class="card-content">
                <h3 class="card-title">
                    <span class="diet-icon ${iconClass}"></span>
                    ${dish.name}
                </h3>
                <p class="card-tags">${dish.tags}</p>
                <div style="margin-bottom: 15px;">
                    <span class="macro-tag">${dish.protein}g Protein</span>
                    <span class="macro-tag">${dish.fiber}g Fiber</span>
                </div>
                <div class="card-footer">
                    <span class="price">${dish.price}</span>
                    <button class="add-btn" onclick="addToCart(event, ${dish.id})">Add</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Initialize
window.onload = () => applyFilters();