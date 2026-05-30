<script setup lang="ts">
const quotes = [
  { text: '代码写一次，读无限次。', author: 'Unknown' },
  { text: 'Talk is cheap. Show me the code.', author: 'Linus Torvalds' },
  { text: '简单是可靠的先决条件。', author: 'Edsger Dijkstra' },
  { text: 'The only way to learn a new programming language is by writing programs in it.', author: 'Dennis Ritchie' },
  { text: '先把事情做对，再把事情做好。', author: 'Unknown' },
  { text: 'Programs must be written for people to read, and only incidentally for machines to execute.', author: 'Harold Abelson' },
  { text: '知之者不如好之者，好之者不如乐之者。', author: '孔子' },
  { text: 'Make it work, make it right, make it fast.', author: 'Kent Beck' },
  { text: '路漫漫其修远兮，吾将上下而求索。', author: '屈原' },
  { text: 'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.', author: 'Martin Fowler' },
  { text: '不积跬步，无以至千里。', author: '荀子' },
  { text: 'First, solve the problem. Then, write the code.', author: 'John Johnson' },
  { text: 'Stay hungry, stay foolish.', author: 'Steve Jobs' },
  { text: '工欲善其事，必先利其器。', author: '孔子' },
  { text: 'The best error message is the one that never shows up.', author: 'Thomas Fuchs' },
]

const todayQuote = computed(() => {
  const today = new Date()
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
  return quotes[seed % quotes.length]!
})
</script>

<template>
  <article class="daily-quote card">
    <header class="daily-quote__header">
      <span class="daily-quote__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5 3.871 3.871 0 0 1-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5 3.871 3.871 0 0 1-2.748-1.179z" />
        </svg>
      </span>
      <h2 class="daily-quote__title">
        今日名言
      </h2>
    </header>

    <blockquote class="daily-quote__text">
      {{ todayQuote.text }}
    </blockquote>

    <p class="daily-quote__author">
      — {{ todayQuote.author }}
    </p>
  </article>
</template>

<style scoped>
.card {
  background: rgb(255 255 255 / 70%);
  backdrop-filter: blur(14px);
  border-radius: 22px;
  border: 1px solid rgb(255 255 255 / 80%);
  box-shadow: 0 6px 24px var(--home-shadow);
}

.daily-quote {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  padding: 0.85rem 0.95rem 0.9rem;
  min-height: 7.5rem;
  box-sizing: border-box;
}

.daily-quote__header {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.daily-quote__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.35rem;
  height: 1.35rem;
  border-radius: 8px;
  background: var(--home-accent-light);
  color: var(--home-accent-dark);
  flex-shrink: 0;
}

.daily-quote__icon svg {
  width: 0.75rem;
  height: 0.75rem;
}

.daily-quote__title {
  margin: 0;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: #9ca3af;
  text-transform: uppercase;
}

.daily-quote__text {
  margin: 0;
  flex: 1;
  font-size: 0.78rem;
  line-height: 1.55;
  color: #374151;
  font-weight: 500;
}

.daily-quote__author {
  margin: 0;
  font-size: 0.68rem;
  color: #9ca3af;
  text-align: right;
  font-style: italic;
}
</style>
