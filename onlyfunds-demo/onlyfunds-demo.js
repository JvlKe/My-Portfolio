const startingTransactions = [
  {
    title: "Monthly Allowance",
    amount: 12000,
    type: "income",
    category: "Income/Allowance"
  },
  {
    title: "Lunch Meal",
    amount: 180,
    type: "expense",
    category: "Food"
  },
  {
    title: "Jeepney Fare",
    amount: 120,
    type: "expense",
    category: "Transportation"
  },
  {
    title: "School Supplies",
    amount: 3200,
    type: "expense",
    category: "School Expenses"
  }
];

let transactions = [...startingTransactions];

const peso = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0
});

const form = document.getElementById("transactionForm");
const resetBtn = document.getElementById("resetBtn");
const list = document.getElementById("transactionList");
const phoneList = document.getElementById("phoneList");

function getTotals() {
  const income = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const expense = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  return {
    income,
    expense,
    balance: income - expense
  };
}

function updateInsight(income, expense) {
  const insightText = document.getElementById("insightText");

  if (expense === 0) {
    insightText.textContent = "No expenses yet. Add a transaction to generate a simple financial insight.";
    return;
  }

  const spendingRate = Math.round((expense / income) * 100);

  if (spendingRate >= 70) {
    insightText.textContent = `You already used ${spendingRate}% of your income. Try reducing non-essential spending.`;
  } else if (spendingRate >= 40) {
    insightText.textContent = `You used ${spendingRate}% of your income. Your budget is still manageable.`;
  } else {
    insightText.textContent = `Great job. You only used ${spendingRate}% of your income so far.`;
  }
}

function render() {
  const { income, expense, balance } = getTotals();

  document.getElementById("balanceValue").textContent = peso.format(balance);
  document.getElementById("incomeValue").textContent = peso.format(income);
  document.getElementById("expenseValue").textContent = peso.format(expense);

  document.getElementById("phoneBalance").textContent = peso.format(balance);
  document.getElementById("phoneIncome").textContent = peso.format(income);
  document.getElementById("phoneExpense").textContent = peso.format(expense);

  updateInsight(income, expense);

  list.innerHTML = transactions
    .slice()
    .reverse()
    .map((transaction) => {
      const sign = transaction.type === "income" ? "+" : "-";

      return `
        <div class="transaction-row">
          <div>
            <div class="transaction-title">${transaction.title}</div>
            <div class="transaction-meta">
              ${transaction.category} · ${transaction.type === "income" ? "Income" : "Expense"}
            </div>
          </div>

          <div class="transaction-amount ${transaction.type}">
            ${sign}${peso.format(transaction.amount)}
          </div>
        </div>
      `;
    })
    .join("");

  phoneList.innerHTML = transactions
    .slice(-4)
    .reverse()
    .map((transaction) => {
      const sign = transaction.type === "income" ? "+" : "-";

      return `
        <div class="phone-item">
          <div>
            <span>${transaction.title}</span>
            <small>${transaction.category}</small>
          </div>

          <strong class="${transaction.type}">
            ${sign}${peso.format(transaction.amount)}
          </strong>
        </div>
      `;
    })
    .join("");
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = document.getElementById("titleInput").value.trim();
  const amount = Number(document.getElementById("amountInput").value);
  const type = document.getElementById("typeInput").value;
  const category = document.getElementById("categoryInput").value;

  transactions.push({
    title,
    amount,
    type,
    category
  });

  form.reset();
  render();
});

resetBtn.addEventListener("click", () => {
  transactions = [...startingTransactions];
  render();
});

render();