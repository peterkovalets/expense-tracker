'use strict';

const addExpenseForm = document.querySelector('#add-expense');
const table = document.querySelector('#table');

let expenses = [];

class Expense {
  constructor(name, date, amount) {
    this.id = Date.now();
    this.name = name;
    this.date = date;
    this.amount = Number(amount);
  }
}

function renderTable(data) {
  if (data.length === 0) {
    table.innerHTML = '';
    return;
  }

  table.innerHTML = `
    <thead>
      <tr>
        <th scope="col">Name</th>
        <th scope="col">Date</th>
        <th scope="col">Amount</th>
        <th scope="col"></th>
      </tr>
    </thead>
  `;
  const tbody = document.createElement('tbody');
  data.forEach((obj) => {
    const tr = document.createElement('tr');
    const { id, ...newObj } = obj;
    Object.values(newObj).forEach((value) => {
      const markup = `<td class="align-middle">${
        typeof value === 'number' ? '$' + value : value
      }</td>`;
      tr.insertAdjacentHTML('beforeend', markup);
    });
    const removeBtnMarkup = `
      <th>
        <button data-remove="${id}" type="button" class="btn btn-outline-dark">X</button>
      </th>
    `;
    tr.insertAdjacentHTML('beforeend', removeBtnMarkup);
    tbody.insertAdjacentElement('afterbegin', tr);
  });
  table.append(tbody);
}

function saveToLocalStorage(data) {
  localStorage.setItem('expenses', JSON.stringify(data));
}

function loadFromLocalStorage() {
  if (localStorage.getItem('expenses')) {
    const data = JSON.parse(localStorage.getItem('expenses'));
    expenses = data;
  }
}

function handleSubmit(e) {
  e.preventDefault();

  const data = Object.fromEntries(new FormData(addExpenseForm));
  let isRender = true;
  Object.values(data).forEach((el) => {
    if (!el) {
      isRender = false;
    }
  });

  if (isRender) {
    const newExpense = new Expense(data.name, data.date, data.amount);
    expenses.push(newExpense);
    saveToLocalStorage(expenses);
    renderTable(expenses);
    addExpenseForm.reset();
  }
}

function removeExpense(e) {
  if (!e.target.dataset.remove) {
    return;
  }

  const newExpenses = expenses.filter(
    (expense) => expense.id !== Number(e.target.dataset.remove)
  );
  expenses = newExpenses;
  saveToLocalStorage(expenses);
  renderTable(expenses);
}

loadFromLocalStorage();
renderTable(expenses);

addExpenseForm.addEventListener('submit', handleSubmit);
table.addEventListener('click', removeExpense);
