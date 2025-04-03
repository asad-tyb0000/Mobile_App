import { useState, useEffect } from "react";
import { Home, User, Settings, Plus, Search, List } from "lucide-react";
import "./App.css";
import MainPicPopup from "./components/MainPicPopup";

// Sample recipe data
const recipeDatabase = [
  {
    id: 1,
    name: "Miso-Butter Roast Chicken With Acorn Squash Panzanella",
    ingredients: [
      "whole chicken",
      "kosher salt",
      "acorn squash",
      "sage",
      "rosemary",
      "unsalted butter",
      "allspice",
      "red pepper flakes",
      "black pepper",
      "white bread",
      "apples",
      "olive oil",
      "red onion",
      "apple cider vinegar",
      "white miso"
    ],
    instructions: "Pat chicken dry...",
    prepTime: "1 hour 30 minutes"
  },
  // Add more recipes here if needed
];

export default function App() {
  const [activeTab, setActiveTab] = useState("Home");
  const [showPopup, setShowPopup] = useState(true);
  const [myIngredients, setMyIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState('');
  const [availableRecipes, setAvailableRecipes] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  useEffect(() => {
    const filteredRecipes = recipeDatabase.filter(recipe => {
      const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase());
      const hasIngredients = recipe.ingredients.every(ingredient => 
        myIngredients.some(myIng => 
          myIng.toLowerCase().includes(ingredient.toLowerCase()) ||
          ingredient.toLowerCase().includes(myIng.toLowerCase())
        )
      );
      return activeTab === 'Home' ? matchesSearch : hasIngredients && matchesSearch;
    });
    setAvailableRecipes(filteredRecipes);
  }, [myIngredients, searchQuery, activeTab]);

  const addIngredient = () => {
    if (newIngredient.trim() !== '') {
      setMyIngredients([...myIngredients, newIngredient.trim()]);
      setNewIngredient('');
    }
  };

  const removeIngredient = (index) => {
    const updatedIngredients = [...myIngredients];
    updatedIngredients.splice(index, 1);
    setMyIngredients(updatedIngredients);
  };

  const generateShoppingList = (recipe) => {
    const missingIngredients = recipe.ingredients.filter(ingredient => 
      !myIngredients.some(myIng => 
        myIng.toLowerCase().includes(ingredient.toLowerCase()) ||
        ingredient.toLowerCase().includes(myIng.toLowerCase())
      )
    );
    setShoppingList(missingIngredients);
    setActiveTab('Profile');
  };

  return (
    <div className="container">
      {showPopup && <MainPicPopup onClose={handleClosePopup} />}
      <div className="mobile-screen bordered">
        <div className="header">
          {activeTab === 'Home' ? (
            <div className="search-bar">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          ) : (
            activeTab
          )}
        </div>

        <div className="content">
          {activeTab === "Home" && (
            <div className="recipes-container">
              {availableRecipes.length > 0 ? (
                availableRecipes.map(recipe => (
                  <div key={recipe.id} className="recipe-card">
                    <h3>{recipe.name}</h3>
                    <p><strong>Ingredients:</strong> {recipe.ingredients.slice(0, 3).join(', ')}...</p>
                    <p><strong>Prep Time:</strong> {recipe.prepTime}</p>
                    <button 
                      onClick={() => generateShoppingList(recipe)}
                      className="shopping-list-btn"
                    >
                      <List size={16} /> Generate Shopping List
                    </button>
                  </div>
                ))
              ) : (
                <p>No recipes found. Try adding more ingredients.</p>
              )}
            </div>
          )}

          {activeTab === "Profile" && (
            <div className="shopping-list">
              <h3>Shopping List</h3>
              {shoppingList.length > 0 ? (
                <ul>
                  {shoppingList.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>No items in shopping list</p>
              )}
            </div>
          )}

          {activeTab === "Settings" && (
            <div className="my-ingredients">
              <h3>My Ingredients</h3>
              <div className="add-ingredient">
                <input
                  type="text"
                  value={newIngredient}
                  onChange={(e) => setNewIngredient(e.target.value)}
                  placeholder="Add an ingredient..."
                />
                <button onClick={addIngredient} className="add-btn">
                  <Plus size={18} />
                </button>
              </div>
              <ul className="ingredients-list">
                {myIngredients.map((ingredient, index) => (
                  <li key={index}>
                    {ingredient}
                    <button 
                      onClick={() => removeIngredient(index)}
                      className="remove-btn"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="bottom-nav">
          <NavItem 
            icon={<Home />} 
            label="Home" 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />
          <NavItem 
            icon={<List />} 
            label="Profile" 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />
          <NavItem 
            icon={<Settings />} 
            label="Settings" 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon, label, activeTab, setActiveTab }) {
  return (
    <button 
      onClick={() => setActiveTab(label)}
      className={`nav-item ${activeTab === label ? "active" : ""}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}