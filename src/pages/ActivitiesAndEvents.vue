<template>
  <div class="subcontent">
    <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />

    <div class="row justify-center">
      <div style="display: flex; max-width: 100%; width: 100%">
        <q-calendar-month
          ref="calendar"
          v-model="selectedDate"
          animated
          bordered
          focusable
          hoverable
          no-active-date
          :day-min-height="60"
          :day-height="120"
          @change="onChange"
          @moved="onMoved"
          @click-date="onClickDate"
          @click-day="onClickDay"
          @click-workweek="onClickWorkweek"
          @click-head-workweek="onClickHeadWorkweek"
          @click-head-day="onClickHeadDay"
        >
          <template #day="{ scope: { timestamp } }">
            <template v-for="event in eventsMap[timestamp.date]" :key="event.id">
              <div
                :class="badgeClasses(event, 'day')"
                :style="badgeStyles(event, 'day')"
                class="row justify-start items-center no-wrap my-event"
              >
                <q-icon v-if="event?.icon" :name="event.icon" class="q-mr-xs"></q-icon>
                <div class="title q-calendar__ellipsis">
                  {{ event.title + (event.time ? ' - ' + event.time : '') }}
                  <q-tooltip>{{ event.details }}</q-tooltip>
                </div>
              </div>
            </template>
          </template>
        </q-calendar-month>
      </div>
    </div>
  </div>
</template>
<script>
import {
  QCalendarMonth,
  addToDate,
  parseDate,
  parseTimestamp,
  today,
} from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/index.css'

import { ref, reactive, computed } from 'vue'

export default {
  components: {
    QCalendarMonth,
  },
  setup() {
    const CURRENT_DAY = new Date()

    function getCurrentDay(day) {
      const newDay = new Date(CURRENT_DAY)
      newDay.setDate(day)
      const tm = parseDate(newDay)
      return tm && tm.date
    }

    const calendar = ref(null)
    const selectedDate = ref(today())

    const events = reactive([
      {
        id: 1,
        title: '1st of the Month',
        details: 'Everything is funny as long as it is happening to someone else',
        date: getCurrentDay(1),
        bgcolor: 'orange',
      },
      {
        id: 2,
        title: 'Sisters Birthday',
        details: 'Buy a nice present',
        date: getCurrentDay(4),
        bgcolor: 'green',
        icon: 'fas fa-birthday-cake',
      },
      {
        id: 3,
        title: 'Meeting',
        details: 'Time to pitch my idea to the company',
        date: getCurrentDay(10),
        time: '10:00',
        duration: 120,
        bgcolor: 'red',
        icon: 'fas fa-handshake',
      },
      {
        id: 4,
        title: 'Lunch',
        details: 'Company is paying!',
        date: getCurrentDay(10),
        time: '11:30',
        duration: 90,
        bgcolor: 'teal',
        icon: 'fas fa-hamburger',
      },
      {
        id: 5,
        title: 'Visit mom',
        details: 'Always a nice chat with mom',
        date: getCurrentDay(20),
        time: '17:00',
        duration: 90,
        bgcolor: 'grey',
        icon: 'fas fa-car',
      },
      {
        id: 6,
        title: 'Conference',
        details: 'Teaching Javascript 101',
        date: getCurrentDay(22),
        time: '08:00',
        duration: 540,
        bgcolor: 'blue',
        icon: 'fas fa-chalkboard-teacher',
      },
      {
        id: 7,
        title: 'Girlfriend',
        details: 'Meet GF for dinner at Swanky Restaurant',
        date: getCurrentDay(22),
        time: '19:00',
        duration: 180,
        bgcolor: 'teal',
        icon: 'fas fa-utensils',
      },
      {
        id: 8,
        title: 'Rowing',
        details: 'Stay in shape!',
        date: getCurrentDay(27),
        bgcolor: 'purple',
        icon: 'rowing',
        days: 2,
      },
      {
        id: 9,
        title: 'Fishing',
        details: 'Time for some weekend R&R',
        date: getCurrentDay(27),
        bgcolor: 'purple',
        icon: 'fas fa-fish',
        days: 2,
      },
      {
        id: 10,
        title: 'Vacation',
        details: "Trails and hikes, going camping! Don't forget to bring bear spray!",
        date: getCurrentDay(29),
        bgcolor: 'purple',
        icon: 'fas fa-plane',
        days: 5,
      },
    ])

    const eventsMap = computed(() => {
      const map = {}
      events.forEach((event) => {
        if (!map[event.date]) {
          map[event.date] = []
        }
        map[event.date].push(event)

        if (event.days) {
          let timestamp = parseTimestamp(event.date)
          let daysLeft = event.days
          while (--daysLeft > 0) {
            timestamp = addToDate(timestamp, { day: 1 })
            if (!map[timestamp.date]) {
              map[timestamp.date] = []
            }
            map[timestamp.date].push(event)
          }
        }
      })
      return map
    })

    function badgeClasses(event) {
      return {
        'text-white': true,
        [`bg-${event.bgcolor}`]: true,
        'q-calendar__ellipsis': true,
      }
    }

    function badgeStyles() {
      return {}
    }

    function onToday() {
      calendar.value && calendar.value.moveToToday()
    }

    function onPrev() {
      calendar.value && calendar.value.prev()
    }

    function onNext() {
      calendar.value && calendar.value.next()
    }

    function onMoved(data) {
      console.info('onMoved', data)
    }

    function onChange(data) {
      console.info('onChange', data)
    }

    function onClickDate(data) {
      console.info('onClickDate', data)
    }

    function onClickDay(data) {
      console.info('onClickDay', data)
    }

    function onClickWorkweek(data) {
      console.info('onClickWorkweek', data)
    }

    function onClickHeadDay(data) {
      console.info('onClickHeadDay', data)
    }

    function onClickHeadWorkweek(data) {
      console.info('onClickHeadWorkweek', data)
    }

    return {
      calendar,
      selectedDate,
      eventsMap,
      badgeClasses,
      badgeStyles,
      onToday,
      onPrev,
      onNext,
      onMoved,
      onChange,
      onClickDate,
      onClickDay,
      onClickWorkweek,
      onClickHeadDay,
      onClickHeadWorkweek,
    }
  },
}
</script>
<style lang="scss" scoped>
.my-event {
  position: relative;
  font-size: 12px;
  width: 100%;
  max-width: 100%;
  margin: 1px 0 0 0;
  padding: 0 2px;
  justify-content: start;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  cursor: pointer;
}

.title {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  max-width: 100%;
}

.text-white {
  color: white;
}

.bg-blue {
  background: blue;
}

.bg-green {
  background: green;
}

.bg-orange {
  background: orange;
}

.bg-red {
  background: red;
}

.bg-teal {
  background: teal;
}

.bg-grey {
  background: grey;
}

.bg-purple {
  background: purple;
}

.rounded-border {
  border-radius: 2px;
}
</style>
