<script lang="ts">
  import { marked } from 'marked';
  let messages = $state<Array<{ role: string; content: string }>>([]);
  let input = $state('');
  let isLoading = $state(false);

  async function handleSubmit(event: Event) {
    event.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    input = '';
    isLoading = true;

    try {
      const response = await fetch('/api/deepseek', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMessage }]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      messages = data.messages;
    } catch (error) {
      console.error('Error:', error);
      messages = [...messages, { 
        role: 'assistant', 
        content: 'Sorry, there was an error processing your request.' 
      }];
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="container">
  <h1>DeepSeek R1 Chat</h1>
  
  <div class="messages">
    {#each messages as message}
      <div class="message {message.role}">
        <p class="sender">{message.role === 'user' ? 'You' : 'DeepSeek R1'}</p>
        <p class="content">{@html marked(message.content)}</p>
      </div>
    {/each}
    {#if isLoading}
      <div class="loading">
        <p>DeepSeek R1 is thinking...</p>
      </div>
    {/if}
  </div>

  <form onsubmit={handleSubmit} class="input-form">
    <input
      bind:value={input}
      placeholder="Ask DeepSeek R1 something..."
      disabled={isLoading}
    />
    <button 
      type="submit" 
      disabled={isLoading}
    >
      Send
    </button>
  </form>
</div>

<style>
  :global(body) {
    margin: 0;
    font-family: system-ui, -apple-system, sans-serif;
  }

  .container {
    max-width: 42rem;
    margin: 0 auto;
    padding: 1rem;
  }

  h1 {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }

  .messages {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .message {
    padding: 1rem;
    border-radius: 0.5rem;
  }

  .message.user {
    background-color: #e6f3ff;
  }

  .message.assistant {
    background-color: #f3f4f6;
  }

  .sender {
    font-weight: 600;
  }

  .content {
    white-space: pre-wrap;
  }

  .content :global(p) {
    margin: 0.5em 0;
  }

  .content :global(pre) {
    background: #f4f4f4;
    padding: 1em;
    border-radius: 4px;
    overflow-x: auto;
  }

  .content :global(code) {
    background: #f4f4f4;
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-size: 0.9em;
  }

  .loading {
    padding: 1rem;
    border-radius: 0.5rem;
    background-color: #f9fafb;
  }

  .loading p {
    font-weight: 600;
    color: #6b7280;
  }

  .input-form {
    display: flex;
    gap: 0.5rem;
  }

  input {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
  }

  button {
    padding: 0.5rem 1rem;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
  }

  button:hover {
    background-color: #2563eb;
  }

  button:disabled {
    background-color: #93c5fd;
    cursor: not-allowed;
  }
</style>
