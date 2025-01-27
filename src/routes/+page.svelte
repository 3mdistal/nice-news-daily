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
  :global(*) {
    box-sizing: border-box;
  }

  :global(body) {
    margin: 0;
    font-family: system-ui, -apple-system, sans-serif;
    background-color: #f8fafc;
    height: 100vh;
  }

  .container {
    max-width: 42rem;
    margin: 0 auto;
    padding: 1rem 2rem;
    height: 100vh;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
  }

  h1 {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
    text-align: center;
    color: #1e293b;
  }

  .messages {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1rem;
    overflow-y: auto;
    padding: 0.5rem;
  }

  .message {
    padding: 1.25rem;
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .message.user {
    background-color: white;
    border: 1px solid #e2e8f0;
    align-self: flex-end;
    max-width: 80%;
  }

  .message.assistant {
    background-color: azure;
    border: 1px solid #e2e8f0;
    align-self: flex-start;
    max-width: 80%;
  }

  .sender {
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #1e293b;
  }

  .content {
    line-height: 1.5;

    & :global(li) {
      margin-bottom: 0.5rem;
    }
  }

  .loading {
    padding: 1rem;
    border-radius: 0.5rem;
    background-color: white;
    border: 1px solid #e2e8f0;
    text-align: center;
  }

  .loading p {
    font-weight: 600;
    color: #64748b;
  }

  .input-form {
    display: flex;
    gap: 0.75rem;
    padding: 1rem;
    background-color: white;
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border: 1px solid #e2e8f0;
  }

  input {
    flex: 1;
    padding: 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.75rem;
    font-size: 1rem;
  }

  input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  button {
    padding: 0.75rem 1.5rem;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 0.75rem;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s;
  }

  button:hover {
    background-color: #2563eb;
    transform: translateY(-1px);
  }

  button:active {
    transform: translateY(0);
  }

  button:disabled {
    background-color: #93c5fd;
    cursor: not-allowed;
    transform: none;
  }
</style>
