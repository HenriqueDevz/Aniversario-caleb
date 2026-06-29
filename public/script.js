const API = '/api';

function showTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(section => section.classList.remove('active'));
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    document.getElementById(tab).classList.add('active');
    if (tab === 'resumo') loadResumo()
}
function openModal(id) {
    document.getElementById(id).classList.add('active')
}
function closeModal(id) {
    document.getElementById(id).classList.remove('active')
}

async function loadCompras () {
    const res = await fetch(`${API}/categories`);
    const categories = await res.json();
    const container = document.getElementById('lista-compras');
    container.innerHTML = ''
    const select = document.getElementById('select-categoria');
    select.innerHTML = '<option value="">Selecione uma categoria</option>'
    categories.forEach(category => {
        select.innerHTML += `<option value="${category.id}">${category.name}</option>`

        const itemsHTML = category.items.map(item => `
            <div class="item-row ${item.checked ? 'checked': ''}" id="item-${item.id}">
            <input type="checkbox" ${item.checked ? 'checked': ''} onchange="toggleItem(${item.id})">
            <span class="item-name">${item.name}</span>
            <span class="item-qty">x${item.quantity}</span>
            <button class="btn-delete" onclick="deleteItem(${item.id})">🗑️</button>
            </div>
            `).join('');
            container.innerHTML += `
            <div class="category-card">
                <div class="category-header">
                <span>🌿 ${category.name}</span>
                <button class="btn-delete" onclick="deleteCategoria(${category.id})">🗑️</button>
            </div>
            <div class="items-list">
             ${itemsHTML || '<p style="padding:12px;opacity:0.6">Nenhum item ainda</p>'}
            </div>
        </div>
        `
    })
}

async function addCategoria() {
    const name = document.getElementById('input-categoria').value.trim();
    if (!name)
        return alert('Digit name or category!')
    await fetch(`${API}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
    })
    document.getElementById('input-categoria').value = ''
    closeModal('modal-categoria')
    loadCompras()
}

async function deleteCategoria(id) {
    if (!confirm('Delete category and all its items'))
        return
    await fetch(`${API}/categories/${id}`, { method: 'DELETE'})
    loadCompras()
}

async function addItem() {
    const category_id = document.getElementById('select-categoria').value
    const name = document.getElementById('input-item').value.trim()
    const quantity = document.getElementById('input-quantidade').value
    const notes = document.getElementById('input-notes').value.trim()

    if(!category_id || !name)
        return alert('Select one category and digit or name a item')
    await fetch(`${API}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category_id, name, quantity, notes })
    })
        document.getElementById('select-categoria').value = ''
        document.getElementById('input-item').value = ''
        document.getElementById('input-quantidade').value = '1'
        document.getElementById('input-notes').value = ''
closeModal('modal-item')
loadCompras()
}

async function toggleItem(id) {
    await fetch(`${API}/items/${id}/check`,
        {method: 'PATCH' })
    loadCompras()
}

async function deleteItem(id) {
    if (!confirm('Delete is item?'))
        return
    await fetch(`${API}/items/${id}`,
        {method: 'DELETE' })
    loadCompras()
}

async function loadConvidados() {
    const res = await fetch(`${API}/guests`)
    const guests = await res.json()
    const container = document.getElementById('lista-convidados')
    container.innerHTML = ''
    guests.forEach(guest => {
        container.innerHTML += `
        <div class="guest-card">
        <span class="guest-name">👤 ${guest.name}</span>
        <span class="${guest.confirmed ? 'badge-confirmed' : 'badge-peding'}"
          onclick="toggleGuest(${guest.id})" style="cursor:pointer">
          ${guest.confirmed ? '✅ Confirmado' : '⏳ Pendente'}
        </span>
        <button class="btn-delete" onclick="deleteGuest(${guest.id})">🗑️</button>
        </div>
        `
    })
}

async function addConvidado() {
    const name = document.getElementById('input-convidado').value.trim()
    if(!name)
        return alert('Digit name or guest!')
    await fetch(`${API}/guests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
    })
    document.getElementById('input-convidado').value = ''
    closeModal('modal-convidado')
    loadConvidados()
}

async function toggleGuest(id) {
    await fetch(`${API}/guests/${id}/confirm`,
        {method: 'PATCH' })
    loadConvidados()
}

async function deleteGuest(id) {
    if(!confirm('Deleted or guest?'))
        return
    await fetch(`${API}/guests/${id}`,
        {method: 'DELETE'})
    loadConvidados()
}

async function loadResumo() {
    const [resCategories, resGuests] = await Promise.all([
        fetch(`${API}/categories`),
        fetch(`${API}/guests`)
    ])
    const categories = await resCategories.json()
    const guests = await resGuests.json()
    let totalItems = 0
    let checkedItems = 0
    categories.forEach(category => {
        totalItems += category.items.length
        checkedItems += category.items.filter(item => item.checked).length
    })
    const totalGuests = guests.length
    const confirmedGuests = guests.filter(g => g.confirmed).length
    const progress = totalItems > 0 ? Math.round((checkedItems / totalItems)* 100) : 0
    const container = document.getElementById('resumo-conteudo')
    container.innerHTML = `
    <div class="resumo-grid">
      <div class="resumo-card">
        <span>${checkedItems}/${totalItems}</span>
        <p>🛒 Itens Comprados</p>
      </div>
      <div class="resumo-card">
        <span>${confirmedGuests}/${totalGuests}</span>
        <p>👥 Convidados Confirmados</p>
      </div>
      <div class="resumo-card">
        <span>${categories.length}</span>
        <p>🌿 Categorias</p>
      </div>
      <div class="resumo-card">
        <span>${totalItems - checkedItems}</span>
        <p>⏳ Itens Faltando</p>
      </div>
    </div>
    <div class="progress-bar">
      <div class="progress-fill" style="width: ${progress}%"></div>
    </div>
    <p style="text-align:center; margin-top:10px; font-weight:700; color:#2D5016">
      ${progress}% das compras concluídas 🦁
    </p>
  `
}
document.addEventListener('DOMContentLoaded', () => {
    loadCompras()
    loadConvidados()
})