<script setup lang="ts">
const now = ref(new Date())

const year = computed(() => now.value.getFullYear())
const month = computed(() => now.value.getMonth())

const weekdayName = computed(() => {
  const names = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return names[now.value.getDay()]
})

const dateLabel = computed(() => {
  const y = now.value.getFullYear()
  const m = now.value.getMonth() + 1
  const d = now.value.getDate()
  return `${y}/${m}/${d}`
})

const weekdays = ['一', '二', '三', '四', '五', '六', '日']

const calendarDays = computed(() => {
  const firstDayRaw = new Date(year.value, month.value, 1).getDay()
  const firstDay = firstDayRaw === 0 ? 6 : firstDayRaw - 1
  const daysInMonth = new Date(year.value, month.value + 1, 0).getDate()
  const daysInPrevMonth = new Date(year.value, month.value, 0).getDate()

  const cells: Array<{ day: number; current: boolean; today: boolean; weekend: boolean }> = []

  for (let i = firstDay - 1; i >= 0; i--) {
    const idx = cells.length
    cells.push({
      day: daysInPrevMonth - i,
      current: false,
      today: false,
      weekend: idx % 7 >= 5,
    })
  }

  const todayDate = now.value.getDate()
  for (let d = 1; d <= daysInMonth; d++) {
    const idx = cells.length
    cells.push({
      day: d,
      current: true,
      today: d === todayDate,
      weekend: idx % 7 >= 5,
    })
  }

  while (cells.length % 7 !== 0) {
    const idx = cells.length
    cells.push({
      day: cells.length - daysInMonth - firstDay + 1,
      current: false,
      today: false,
      weekend: idx % 7 >= 5,
    })
  }

  return cells
})
</script>

<template>
  <div class="calendar card">
    <div class="calendar__head">
      <span class="calendar__title">{{ dateLabel }}</span>
      <span class="calendar__weekday">{{ weekdayName }}</span>
    </div>

    <div class="calendar__weekdays">
      <span
        v-for="(w, i) in weekdays"
        :key="w"
        :class="{ 'calendar__weekday--weekend': i >= 5 }"
      >{{ w }}</span>
    </div>

    <div class="calendar__grid">
      <span
        v-for="(cell, i) in calendarDays"
        :key="i"
        class="calendar__day"
        :class="{
          'calendar__day--muted': !cell.current,
          'calendar__day--today': cell.today,
          'calendar__day--weekend': cell.weekend && cell.current && !cell.today,
        }"
      >
        {{ cell.day }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.card {
  background: rgb(255 255 255 / 70%);
  backdrop-filter: blur(14px);
  border-radius: 22px;
  border: 1px solid rgb(255 255 255 / 80%);
  box-shadow: 0 6px 24px var(--home-shadow);
}

.calendar {
  padding: 1rem 1.1rem 1.1rem;
}

.calendar__head {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 0.7rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px dashed rgb(20 184 166 / 25%);
}

.calendar__title {
  font-size: 0.85rem;
  font-weight: 700;
  color: #1a1a1a;
}

.calendar__weekday {
  font-size: 0.75rem;
  color: #6b7280;
}

.calendar__weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.15rem;
  margin-bottom: 0.4rem;
  text-align: center;
  font-size: 0.72rem;
  font-weight: 600;
  color: #6b7280;
}

.calendar__weekday--weekend {
  color: var(--home-accent-dark);
}

.calendar__grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.15rem;
}

.calendar__day {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.78rem;
  font-weight: 500;
  color: #374151;
  border-radius: 50%;
}

.calendar__day--muted {
  color: #d1d5db;
}

.calendar__day--weekend {
  color: var(--home-accent-dark);
}

.calendar__day--today {
  background: var(--home-accent);
  color: #fff;
  font-weight: 700;
  box-shadow: 0 3px 10px rgb(20 184 166 / 45%);
}
</style>
