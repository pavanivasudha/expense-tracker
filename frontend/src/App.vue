<script setup>
import { ref, computed, onMounted } from "vue";

const API = "http://localhost:3000/expenses";

const expenses = ref([]);
const categoryFilter = ref("");
const loading = ref(false);
const error = ref("");

const form = ref({
  amount: "",
  category: "",
  description: "",
  date: "",
});

const fetchExpenses = async () => {
  loading.value = true;
  const params = new URLSearchParams();
  if (categoryFilter.value) params.append("category", categoryFilter.value);
  params.append("sort", "date_desc");

  const res = await fetch(`${API}?${params}`);
  expenses.value = await res.json();
  loading.value = false;
};

onMounted(fetchExpenses);

const submitExpense = async () => {
  error.value = "";

  const payload = {
    ...form.value,
    amount: Number(form.value.amount),
    clientRequestId: crypto.randomUUID(),
  };

  try {
    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    form.value = { amount: "", category: "", description: "", date: "" };
    fetchExpenses();
  } catch {
    error.value = "Failed to save expense";
  }
};

const total = computed(
  () => expenses.value.reduce((sum, e) => sum + e.amount, 0) / 100,
);
</script>

<template>
  <h2>Expense Tracker</h2>

  <form @submit.prevent="submitExpense">
    <input v-model="form.amount" type="number" placeholder="Amount" required />
    <input v-model="form.category" placeholder="Category" required />
    <input v-model="form.description" placeholder="Description" />
    <input v-model="form.date" type="date" required />
    <button>Add Expense</button>
  </form>

  <p v-if="error" style="color: red">{{ error }}</p>

  <hr />

  <label>
    Filter by category:
    <input v-model="categoryFilter" @input="fetchExpenses" />
  </label>

  <p>
    <strong>Total: ₹{{ total }}</strong>
  </p>

  <p v-if="loading">Loading...</p>

  <table border="1" cellpadding="6">
    <tr>
      <th>Date</th>
      <th>Category</th>
      <th>Description</th>
      <th>Amount</th>
    </tr>
    <tr v-for="e in expenses" :key="e.id">
      <td>{{ e.date }}</td>
      <td>{{ e.category }}</td>
      <td>{{ e.description }}</td>
      <td>₹{{ e.amount / 100 }}</td>
    </tr>
  </table>
</template>
