const stock = loadStockFromLocalStorage();
const removedItems = loadRemovedItemsFromLocalStorage(); // Carrega itens retirados

function saveStockToLocalStorage() {
    localStorage.setItem('stock', JSON.stringify(stock));
}

function saveRemovedItemsToLocalStorage() {
    localStorage.setItem('removedItems', JSON.stringify(removedItems));
}

function loadStockFromLocalStorage() {
    const savedStock = localStorage.getItem('stock');
    return savedStock ? JSON.parse(savedStock) : [];
}

function loadRemovedItemsFromLocalStorage() {
    const savedRemovedItems = localStorage.getItem('removedItems');
    return savedRemovedItems ? JSON.parse(savedRemovedItems) : [];
}

function addItem() {
    const itemName = document.getElementById('item-name').value;
    const itemQuantity = parseInt(document.getElementById('item-quantity').value);
    const entryDate = new Date().toLocaleDateString();

    if (itemName === '' || isNaN(itemQuantity) || itemQuantity <= 0) {
        alert('Por favor, preencha todos os campos corretamente.');
        return;
    }

    const itemIndex = stock.findIndex(item => item.name.toLowerCase() === itemName.toLowerCase());

    if (itemIndex === -1) {
        stock.push({
            name: itemName,
            totalQuantity: itemQuantity,
            entryDate: entryDate,
            exitQuantity: 0,
            exitDate: 'N/A'
        });
    } else {
        stock[itemIndex].totalQuantity += itemQuantity;
        stock[itemIndex].entryDate = entryDate; // Atualiza a data de entrada
    }

    saveStockToLocalStorage();
    clearAddItemFields(); // Limpa os campos após adicionar
    updateStockTable();
}

function removeItem() {
    const itemName = document.getElementById('remove-item-name').value;
    const removeQuantity = parseInt(document.getElementById('remove-item-quantity').value);
    const exitDate = new Date().toLocaleDateString();

    if (itemName === '' || isNaN(removeQuantity) || removeQuantity <= 0) {
        alert('Por favor, preencha todos os campos corretamente.');
        return;
    }

    const itemIndex = stock.findIndex(item => item.name.toLowerCase() === itemName.toLowerCase());

    if (itemIndex !== -1 && stock[itemIndex].totalQuantity >= removeQuantity) {
        stock[itemIndex].totalQuantity -= removeQuantity;
        stock[itemIndex].exitQuantity = removeQuantity;
        stock[itemIndex].exitDate = exitDate;

        // Adiciona o item retirado à lista de itens retirados
        removedItems.push({
            name: itemName,
            quantity: removeQuantity,
            date: exitDate
        });

        if (stock[itemIndex].totalQuantity === 0) {
            stock.splice(itemIndex, 1);
        }

        saveStockToLocalStorage();
        saveRemovedItemsToLocalStorage(); // Salva itens retirados
        clearRemoveItemFields(); // Limpa os campos após remover
        updateStockTable();
        updateRemovedItemsTable(); // Atualiza tabela de itens retirados
    } else {
        alert('Quantidade insuficiente em estoque ou item não encontrado.');
    }
}

function updateStockTable() {
    const tableBody = document.getElementById('stock-table-body');
    tableBody.innerHTML = ''; // Limpa a tabela antes de atualizar

    stock.forEach((item) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.totalQuantity}</td>
            <td>${item.entryDate}</td>
            <td>${item.exitQuantity}</td>
            <td>${item.exitDate}</td>
        `;
        tableBody.appendChild(row);
    });
}

function updateRemovedItemsTable() {
    const removedTableBody = document.getElementById('removed-items-table-body');
    removedTableBody.innerHTML = ''; // Limpa a tabela antes de atualizar

    removedItems.forEach((item) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>${item.date}</td>
        `;
        removedTableBody.appendChild(row);
    });
}

// Limpa os campos de entrada após adicionar um item
function clearAddItemFields() {
    document.getElementById('item-name').value = '';
    document.getElementById('item-quantity').value = '';
}

// Limpa os campos de remoção após remover um item
function clearRemoveItemFields() {
    document.getElementById('remove-item-name').value = '';
    document.getElementById('remove-item-quantity').value = '';
}

// Carregar os dados do estoque e itens retirados ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    updateStockTable();
    updateRemovedItemsTable(); // Atualiza tabela de itens retirados
});
