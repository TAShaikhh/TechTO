document.addEventListener('DOMContentLoaded', () => {
    // 0. View Navigation Logic
    const viewTriggers = document.querySelectorAll('[data-target]');
    const views = document.querySelectorAll('.view-section');
    const navItems = document.querySelectorAll('.main-nav .nav-item');

    viewTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = trigger.getAttribute('data-target');
            
            // If it's a main nav item, update active state
            if (trigger.classList.contains('nav-item')) {
                navItems.forEach(n => n.classList.remove('active'));
                trigger.classList.add('active');
            } else {
                // If clicking checkout from somewhere else, deselect main nav items
                navItems.forEach(n => n.classList.remove('active'));
            }

            // Show target view, hide others
            views.forEach(view => {
                if (view.id === targetId) {
                    view.classList.remove('hidden');
                } else {
                    view.classList.add('hidden');
                }
            });
        });
    });

    // 1. Category Filtering
    const categoryItems = document.querySelectorAll('.mini-cat');
    const tableRows = document.querySelectorAll('.sellers-table tbody tr.main-item-row');

    categoryItems.forEach(item => {
        item.addEventListener('click', () => {
            // Update active class
            categoryItems.forEach(c => c.classList.remove('active'));
            item.classList.add('active');

            const selectedCategory = item.getAttribute('data-category');

            // Filter rows
            tableRows.forEach(row => {
                const altRow = row.nextElementSibling;
                if (selectedCategory === 'all' || row.getAttribute('data-category') === selectedCategory) {
                    row.classList.remove('hidden');
                    if (altRow && altRow.classList.contains('alt-row')) altRow.classList.remove('hidden');
                } else {
                    row.classList.add('hidden');
                    if (altRow && altRow.classList.contains('alt-row')) altRow.classList.add('hidden');
                }
            });
        });
    });

    // 2. Search Functionality
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            
            tableRows.forEach(row => {
                const altRow = row.nextElementSibling;
                const itemName = row.querySelector('.name-cell span').textContent.toLowerCase();
                const brand = row.querySelector('.pref-tag.brand').textContent.toLowerCase();
                
                if (itemName.includes(searchTerm) || brand.includes(searchTerm)) {
                    row.classList.remove('hidden');
                    if (altRow && altRow.classList.contains('alt-row')) altRow.classList.remove('hidden');
                } else {
                    row.classList.add('hidden');
                    if (altRow && altRow.classList.contains('alt-row')) altRow.classList.add('hidden');
                }
            });
            
            // Reset categories to "All" when searching
            if (searchTerm !== '') {
                categoryItems.forEach(c => c.classList.remove('active'));
                document.querySelector('[data-category="all"]').classList.add('active');
            }
        });
    }

    // 3. Chat Functionality
    const chatInput = document.querySelector('.chat-input input');
    const chatBtn = document.querySelector('.chat-input button');
    const chatMessages = document.querySelector('.chat-messages');

    const scrollToBottom = () => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    const addMessage = (text, sender) => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `msg ${sender}`;
        msgDiv.textContent = text;
        chatMessages.appendChild(msgDiv);
        scrollToBottom();
    };

    const showTypingIndicator = () => {
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.id = 'typing-indicator';
        indicator.innerHTML = '<span></span><span></span><span></span>';
        chatMessages.appendChild(indicator);
        scrollToBottom();
    };

    const removeTypingIndicator = () => {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.remove();
    };

    const handleSend = () => {
        const text = chatInput.value.trim();
        if (text) {
            addMessage(text, 'user');
            chatInput.value = '';
            
            showTypingIndicator();
            
            // Simulate AI response
            setTimeout(() => {
                removeTypingIndicator();
                const responses = [
                    "I've updated your preferences.",
                    "Looking into that right now. I'll prioritize organic options.",
                    "Got it! I'll add that to the optimization queue.",
                    "I found a coupon that might apply to this order. I'll test it at checkout.",
                    "Understood. I'll make sure to avoid any substitutions for that item."
                ];
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                addMessage(randomResponse, 'ai');
            }, 1500 + Math.random() * 1000);
        }
    };

    chatBtn.addEventListener('click', handleSend);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });

    // 5. Simulate Live AI Activity
    const simulateAI = () => {
        // Find all rows that are currently "searching" and not hidden by filters
        const searchingBadges = document.querySelectorAll('.status-badge.searching');
        
        if (searchingBadges.length > 0) {
            // Pick a random one to "find"
            const badgeToUpdate = searchingBadges[Math.floor(Math.random() * searchingBadges.length)];
            const row = badgeToUpdate.closest('tr');
            const itemName = row.querySelector('.name-cell span').textContent;
            
            // Update badge to "found"
            badgeToUpdate.className = 'status-badge found';
            const platforms = ['Costco', 'Instacart', 'Uber Eats', 'DoorDash'];
            const randomPlatform = platforms[Math.floor(Math.random() * platforms.length)];
            const randomPrice = (Math.random() * 8 + 2).toFixed(2);
            badgeToUpdate.innerHTML = `<i class="fa-solid fa-check"></i> Found $${randomPrice} (${randomPlatform})`;

            // Add log entry to the AI Activity Panel
            const activityLog = document.querySelector('.activity-log');
            if (activityLog) {
                const logItems = activityLog.querySelectorAll('.log-item');
                logItems.forEach(item => item.classList.remove('active'));

                const newLog = document.createElement('div');
                newLog.className = 'log-item active';
                newLog.innerHTML = `
                    <div class="log-time">Just now</div>
                    <div class="log-content">
                        <strong>Found best deal for ${itemName}</strong>
                        <p>${randomPlatform} has it for $${randomPrice}. Added to pending cart.</p>
                    </div>
                `;
                activityLog.insertBefore(newLog, activityLog.firstChild);
            }
            
            // Update total items ready counter
            const readyBadge = document.querySelector('.badge-green');
            const match = readyBadge.textContent.match(/(\d+)\/(\d+)/);
            if (match) {
                const currentReady = parseInt(match[1]);
                const total = parseInt(match[2]);
                if (currentReady < total) {
                    readyBadge.textContent = `${currentReady + 1}/${total} Items Ready`;
                }
            }
        }
    };

    // Run simulation every 3-6 seconds to make the UI feel alive
    setInterval(simulateAI, 3000 + Math.random() * 3000);

    // 6. Manage List - Catalog Filtering
    const catalogPills = document.querySelectorAll('.catalog-categories .cat-pill');
    const catalogItems = document.querySelectorAll('.catalog-item');
    
    catalogPills.forEach(pill => {
        pill.addEventListener('click', () => {
            catalogPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            
            const cat = pill.getAttribute('data-cat');
            catalogItems.forEach(item => {
                if (item.getAttribute('data-cat') === cat) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });

    // 7. Manage List - Add from Catalog
    const catalogAddBtns = document.querySelectorAll('.catalog-item .add-btn');
    const savedItemsTable = document.querySelector('.saved-items-card tbody');
    
    const attachDeleteEvent = (btn) => {
        btn.addEventListener('click', (e) => {
            const row = e.target.closest('tr');
            // Check if it's a main row that has an alt-row next to it
            if (row.classList.contains('main-item-row') && row.nextElementSibling && row.nextElementSibling.classList.contains('alt-row')) {
                row.nextElementSibling.remove();
            }
            row.remove();
            updateItemCount();
        });
    };

    // Attach to existing delete buttons
    document.querySelectorAll('.saved-items-card .action-icon').forEach(attachDeleteEvent);

    // Attach delete to existing alt pills
    document.querySelectorAll('.alt-pill i.fa-xmark').forEach(icon => {
        icon.addEventListener('click', (e) => {
            e.target.closest('.alt-pill').remove();
        });
    });

    const updateItemCount = () => {
        const count = savedItemsTable.querySelectorAll('tr.main-item-row').length;
        document.querySelector('.saved-items-card h3').textContent = `My Standard Items (${count})`;
    };

    catalogAddBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const item = e.target.closest('.catalog-item');
            const itemName = item.querySelector('span').textContent;
            
            const trMain = document.createElement('tr');
            trMain.className = 'main-item-row';
            trMain.innerHTML = `
                <td>${itemName}</td>
                <td>Any</td>
                <td><span class="pref-tag brand">Standard</span></td>
                <td>Auto</td>
                <td><i class="fa-solid fa-trash text-red action-icon"></i></td>
            `;

            const trAlt = document.createElement('tr');
            trAlt.className = 'alt-row';
            trAlt.innerHTML = `
                <td colspan="5">
                    <div class="alt-container">
                        <span class="alt-label"><i class="fa-solid fa-shuffle"></i> Alts:</span>
                        <button class="add-alt-btn" title="Add Alternative"><i class="fa-solid fa-plus"></i></button>
                    </div>
                </td>
            `;

            savedItemsTable.insertBefore(trAlt, savedItemsTable.firstChild);
            savedItemsTable.insertBefore(trMain, trAlt);
            
            attachDeleteEvent(trMain.querySelector('.action-icon'));
            updateItemCount();
            
            // Show checkmark animation
            const icon = btn.querySelector('i');
            icon.className = 'fa-solid fa-check';
            setTimeout(() => {
                icon.className = 'fa-solid fa-plus';
            }, 1000);
        });
    });

    // 8. Manage List - Manual Add Form
    const manualAddBtn = document.querySelector('.add-item-form .btn-secondary');
    const manualInputs = document.querySelectorAll('.add-item-form input');
    
    manualAddBtn.addEventListener('click', () => {
        const name = manualInputs[0].value.trim();
        const brand = manualInputs[1].value.trim() || 'Any';
        const prefs = manualInputs[2].value.trim() || 'Standard';
        const price = manualInputs[3].value.trim() ? `$${parseFloat(manualInputs[3].value).toFixed(2)}` : 'Auto';
        
        if (name) {
            const trMain = document.createElement('tr');
            trMain.className = 'main-item-row';
            trMain.innerHTML = `
                <td>${name}</td>
                <td>${brand}</td>
                <td><span class="pref-tag dietary">${prefs}</span></td>
                <td>${price}</td>
                <td><i class="fa-solid fa-trash text-red action-icon"></i></td>
            `;

            const trAlt = document.createElement('tr');
            trAlt.className = 'alt-row';
            trAlt.innerHTML = `
                <td colspan="5">
                    <div class="alt-container">
                        <span class="alt-label"><i class="fa-solid fa-shuffle"></i> Alts:</span>
                        <button class="add-alt-btn" title="Add Alternative"><i class="fa-solid fa-plus"></i></button>
                    </div>
                </td>
            `;

            savedItemsTable.insertBefore(trAlt, savedItemsTable.firstChild);
            savedItemsTable.insertBefore(trMain, trAlt);
            
            attachDeleteEvent(trMain.querySelector('.action-icon'));
            updateItemCount();
            
            // Clear inputs
            manualInputs.forEach(input => input.value = '');
        }
    });

    // 9. Add Alternative Logic
    document.addEventListener('click', (e) => {
        // Handle clicking the Add Alt button
        if (e.target.closest('.add-alt-btn')) {
            const btn = e.target.closest('.add-alt-btn');
            const container = btn.parentElement;
            
            const altName = prompt("Enter an acceptable alternative (e.g., 'Any Organic Chicken'):");
            if (altName && altName.trim() !== '') {
                const pill = document.createElement('span');
                pill.className = 'alt-pill';
                pill.innerHTML = `${altName.trim()} <i class="fa-solid fa-xmark"></i>`;
                
                // Add delete listener to new pill
                pill.querySelector('i').addEventListener('click', (e) => {
                    e.target.closest('.alt-pill').remove();
                });
                
                container.insertBefore(pill, btn);
            }
        }
    });

    // 10. Sidebar Toggle Logic
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
    });

    // 11. Macro Calculator
    const calcBtn = document.getElementById('calc-btn');
    if (calcBtn) {
        calcBtn.addEventListener('click', () => {
            const age = parseFloat(document.getElementById('calc-age').value);
            const gender = document.getElementById('calc-gender').value;
            const weightLbs = parseFloat(document.getElementById('calc-weight').value);
            const heightIn = parseFloat(document.getElementById('calc-height').value);
            const activity = parseFloat(document.getElementById('calc-activity').value);

            if (age && weightLbs && heightIn) {
                // Convert to metric
                const weightKg = weightLbs * 0.453592;
                const heightCm = heightIn * 2.54;

                // Mifflin-St Jeor Equation
                let bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age);
                bmr += (gender === 'male') ? 5 : -161;

                const tdee = Math.round(bmr * activity);

                // Macros (e.g., 30% P, 40% C, 30% F)
                const protein = Math.round((tdee * 0.3) / 4);
                const carbs = Math.round((tdee * 0.4) / 4);
                const fat = Math.round((tdee * 0.3) / 9);

                document.getElementById('result-cals').textContent = tdee;
                document.getElementById('result-p').textContent = protein + 'g';
                document.getElementById('result-c').textContent = carbs + 'g';
                document.getElementById('result-f').textContent = fat + 'g';

                document.getElementById('macro-results').classList.remove('hidden');
            } else {
                alert("Please fill in Age, Weight, and Height to calculate macros.");
            }
        });
    }

    // 12. Budget Logic
    const budgetInput = document.getElementById('monthly-budget');
    if (budgetInput) {
        budgetInput.addEventListener('input', (e) => {
            const budget = parseFloat(e.target.value) || 0;
            const estSpend = 270; // Mock current spend
            const remaining = budget - estSpend;
            
            let fillPct = 0;
            if (budget > 0) {
                fillPct = Math.min((estSpend / budget) * 100, 100);
            }
            
            document.querySelector('.budget-fill').style.width = fillPct + '%';
            
            // Change color if over budget
            if (remaining < 0) {
                document.querySelector('.budget-fill').style.backgroundColor = 'var(--accent-red)';
            } else {
                document.querySelector('.budget-fill').style.backgroundColor = 'var(--accent-green)';
            }

            document.querySelector('.budget-stats span:last-child').textContent = `Remaining: $${remaining >= 0 ? remaining.toFixed(2) : '0.00'}`;
        });
        
        // Trigger initial calculation
        budgetInput.dispatchEvent(new Event('input'));
    }

    // 13. Expand List Logic
    const expandListBtn = document.getElementById('expand-list-btn');
    const shoppingListCard = document.getElementById('shopping-list-card');
    
    if (expandListBtn && shoppingListCard) {
        expandListBtn.addEventListener('click', () => {
            shoppingListCard.classList.toggle('fullscreen');
            
            // Update icon
            if (shoppingListCard.classList.contains('fullscreen')) {
                expandListBtn.classList.remove('fa-expand');
                expandListBtn.classList.add('fa-compress');
                expandListBtn.title = "Collapse List";
            } else {
                expandListBtn.classList.remove('fa-compress');
                expandListBtn.classList.add('fa-expand');
                expandListBtn.title = "Expand List";
            }
        });
    }
});