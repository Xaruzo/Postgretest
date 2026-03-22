const itemForm = document.getElementById('itemForm');
const itemNameInput = document.getElementById('itemName');
const itemList = document.getElementById('itemList');

// Fetch items from API
async function fetchItems() {
  try {
    const response = await fetch('/api/items');
    const items = await response.json();
    
    itemList.innerHTML = '';
    items.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item.name;
      itemList.appendChild(li);
    });
  } catch (err) {
    console.error('Error fetching items:', err);
  }
}

// Add item to API
itemForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = itemNameInput.value.trim();
  console.log('Attempting to add item:', name);
  if (!name) return;

  try {
    const response = await fetch('/api/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name })
    });
    
    if (response.ok) {
      itemNameInput.value = '';
      fetchItems();
    } else {
      const errorData = await response.json();
      alert('Error adding item: ' + (errorData.error || 'Unknown error'));
      console.error('Failed to add item:', errorData);
    }
  } catch (err) {
    alert('Network error adding item. Check if server is running.');
    console.error('Error adding item:', err);
  }
});

// Initial fetch
fetchItems();
