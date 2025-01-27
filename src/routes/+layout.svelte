<script lang="ts">
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';

  let isAuthenticated = false;
  let password = '';
  let error = '';

  onMount(() => {
    if (browser) {
      isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    }
  });

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });

    if (response.ok) {
      isAuthenticated = true;
      localStorage.setItem('isAuthenticated', 'true');
      error = '';
    } else {
      error = 'Invalid password';
      password = '';
    }
  }
</script>

{#if isAuthenticated}
  <slot />
{:else}
  <div class="auth-container">
    <form on:submit={handleSubmit} class="auth-form">
      <h2>Password Required</h2>
      {#if error}
        <p class="error">{error}</p>
      {/if}
      <input
        type="password"
        bind:value={password}
        placeholder="Enter password"
        required
      />
      <button type="submit">Submit</button>
    </form>
  </div>
{/if}

<style>
  .auth-container {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f8fafc;
  }

  .auth-form {
    background: white;
    padding: 2rem;
    border-radius: 0.75rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
    text-align: center;
  }

  h2 {
    margin: 0 0 1.5rem 0;
    color: #1e293b;
  }

  input {
    width: 100%;
    padding: 0.75rem;
    margin-bottom: 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    font-size: 1rem;
  }

  button {
    width: 100%;
    padding: 0.75rem;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  button:hover {
    background-color: #2563eb;
  }

  .error {
    color: #dc2626;
    margin-bottom: 1rem;
  }
</style> 