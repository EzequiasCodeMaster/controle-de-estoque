const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const dataFilePath = './estoque.json';

// Função para carregar os dados do arquivo JSON
function loadData() {
    if (fs.existsSync(dataFilePath)) {
        const data = fs.readFileSync(dataFilePath, 'utf-8');
        return JSON.parse(data);
    }
    return [];
}

// Função para salvar os dados no arquivo JSON
function saveData(data) {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

// Endpoint para obter os dados do estoque
app.get('/estoque', (req, res) => {
    const data = loadData();
    res.json(data);
});

// Endpoint para adicionar um item ao estoque
app.post('/estoque', (req, res) => {
    const { name, totalQuantity, entryDate } = req.body;
    if (!name || isNaN(totalQuantity) || totalQuantity <= 0) {
        return res.status(400).json({ message: 'Dados inválidos para adicionar o item.' });
    }

    let data = loadData();
    const itemIndex = data.findIndex(item => item.name.toLowerCase() === name.toLowerCase());

    if (itemIndex === -1) {
        data.push({ name, totalQuantity, entryDate, exitQuantity: 0, exitDate: 'N/A' });
    } else {
        data[itemIndex].totalQuantity += totalQuantity;
        data[itemIndex].entryDate = entryDate;
    }

    saveData(data);
    res.status(201).json({ message: 'Item adicionado com sucesso!' });
});

// Endpoint para remover um item do estoque
app.post('/estoque/remover', (req, res) => {
    const { name, removeQuantity, exitDate } = req.body;
    if (!name || isNaN(removeQuantity) || removeQuantity <= 0) {
        return res.status(400).json({ message: 'Dados inválidos para remover o item.' });
    }

    let data = loadData();
    const itemIndex = data.findIndex(item => item.name.toLowerCase() === name.toLowerCase());

    if (itemIndex !== -1 && data[itemIndex].totalQuantity >= removeQuantity) {
        data[itemIndex].totalQuantity -= removeQuantity;
        data[itemIndex].exitQuantity = removeQuantity;
        data[itemIndex].exitDate = exitDate;

        if (data[itemIndex].totalQuantity === 0) {
            data.splice(itemIndex, 1);
        }

        saveData(data);
        res.status(200).json({ message: 'Item removido com sucesso!' });
    } else {
        res.status(400).json({ message: 'Quantidade insuficiente ou item não encontrado.' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
