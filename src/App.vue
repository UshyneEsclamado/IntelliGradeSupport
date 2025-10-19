<template>
  <div id="app">
    <header class="app-header">
      <div class="container">
        <div class="header-content">
          <div class="logo">
            <h1>IntelliGrade Support</h1>
            <p>We're here to help</p>
          </div>
        </div>
      </div>
    </header>

    <main>
      <RouterView />
    </main>

    <footer class="app-footer">
      <div class="container">
        <p>&copy; 2025 IntelliGrade. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
</script>

<style scoped>
.app-header {
  background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
  color: white;
  padding: 24px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo h1 {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 4px;
}

.logo p {
  font-size: 14px;
  opacity: 0.9;
}

main {
  min-height: calc(100vh - 180px);
  padding: 40px 0;
}

.app-footer {
  background-color: var(--primary);
  color: white;
  padding: 20px 0;
  text-align: center;
  margin-top: 40px;
}

.app-footer p {
  font-size: 14px;
  opacity: 0.9;
}
</style>