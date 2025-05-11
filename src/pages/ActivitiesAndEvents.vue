<template>
  <q-page>
    <div class="subcontent">
      <div class="row no-wrap justify-between items-center">
        <div class="row q-gutter-sm items-center q-mb-md">
          <q-btn
            class="q-px-md"
            label="Today"
            color="primary"
            dense
            @click="onToday"
            no-caps
            unelevated
          />
          <q-btn icon="chevron_left" @click="onPrev" dense unelevated class="bg-white" />
          <q-btn icon="chevron_right" @click="onNext" dense unelevated class="bg-white" />
        </div>
        <div class="row no-wrap items-center">
          <q-btn
            icon="sym_r_add"
            @click="showDialog = !showDialog"
            dense
            unelevated
            class="bg-white q-mr-md q-pr-md"
            label="Add"
            no-caps
          />
          <q-btn
            icon="sym_r_edit_note"
            label="Edit"
            no-caps
            @click="onNext"
            dense
            unelevated
            class="bg-white q-pr-md"
          />
        </div>
      </div>
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
            :day-height="110"
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
    <q-dialog position="right" maximized full-height v-model="showDialog">
      <q-card style="min-width: 750px; height: 500px" class="text-black column no-wrap">
        <q-form @submit="saveFn()" class="full-height column justify-between no-wrap">
          <div class="column no-wrap">
            <q-card-section class="q-py-md row no-wrap justify-between items-center">
              <div class="text-body1">{{ mode }} Activities And Events</div>
              <q-icon name="close" size="1.2rem" @click="showDialog = !showDialog" />
            </q-card-section>
            <q-separator />
            <q-card-section>
              <div class="text-grey-7" style="font-size: 12px">
                <span class="text-negative">*</span>All fields are mandatory, except mentioned as
                (optional).
              </div>
            </q-card-section>
            <q-card-section>
              <div class="row no-wrap">
                <div class="column no-wrap q-mr-md">
                  <div class="text-capitalize">
                    Title<span class="text-grey-7 text-caption">(optional)</span>
                  </div>
                  <q-input
                    outlined
                    v-model="dataStorage.title"
                    dense
                    class="q-mt-sm"
                    placeholder="Reporter Name"
                    style="width: 600px"
                    :readonly="mode == 'View'"
                    :rules="[(val) => !!val || 'Title is requried!']"
                  />
                </div>
              </div>
              <div class="row no-wrap items-end">
                <div class="column no-wrap q-mr-md">
                  <div class="text-capitalize">Date.<span class="text-negative">*</span></div>
                  <q-input
                    dense
                    v-model="dataStorage.date"
                    class="q-mt-sm"
                    outlined
                    :rules="[(val) => !!val || 'Date is requried!']"
                  >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                          <q-date v-model="dataStorage.date" mask="YYYY-MM-DD HH:mm">
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="Close" color="primary" flat />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
                <div class="column no-wrap q-mr-md">
                  <div class="text-capitalize">Time.<span class="text-negative">*</span></div>
                  <q-input
                    dense
                    v-model="dataStorage.time"
                    class="q-mt-sm"
                    outlined
                    hint="what time it will start?"
                    :rules="[(val) => !!val || 'Time is requried!']"
                  >
                    <template v-slot:append>
                      <q-icon name="access_time" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                          <q-time v-model="dataStorage.time" mask="HH:mm:ss" format24h>
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="Close" color="primary" flat />
                            </div>
                          </q-time>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
                <q-file
                  v-model="dataStorage.file"
                  dense
                  outlined
                  :readonly="mode == 'View'"
                  hint="Upload one image (click the other icon to view image)"
                  :label="dataStorage.image_path"
                  style="min-width: 200px"
                  @update:model-value="imageFnUpdate"
                >
                  <template v-slot:prepend> <q-icon name="sym_r_add_photo_alternate" /></template>
                  <template v-slot:after>
                    <q-icon name="sym_r_photo_library" @click="showImage = !showImage"
                  /></template>
                </q-file>
                <ImageViewer v-model="showImage" :imageUrl="previewImage" />
              </div>
              <div class="row no-wrap q-mt-sm">
                <div class="column no-wrap q-mr-md">
                  <div class="text-capitalize">Duration<span class="text-negative">*</span></div>

                  <q-select
                    outlined
                    v-model="dataStorage.status"
                    class="q-mt-sm"
                    :options="reportStatusOption"
                    emit-value
                    map-options
                    dense
                    :readonly="mode == 'View'"
                    style="width: 280px"
                    :rules="[(val) => !!val || '']"
                    hide-bottom-space
                    behavior="menu"
                    hint="Default to Pending"
                  />
                </div>

                <div class="column no-wrap q-mr-md">
                  <div class="text-capitalize">
                    Days<span class="text-grey-7 text-caption q-ml-sm">(optional)</span>
                  </div>
                  <q-input
                    outlined
                    v-model="dataStorage.days"
                    dense
                    type="number"
                    class="q-mt-sm"
                    placeholder="Days"
                    style="width: 300px"
                    :readonly="mode == 'View'"
                    hint="Only input days if event or activities is more than 1 day?"
                  />
                </div>
              </div>
              <div class="column no-wrap q-mt-md">
                <div class="text-capitalize">Details</div>
                <q-input
                  :rules="[(val) => !!val || 'Details is required!']"
                  outlined
                  :readonly="mode == 'View'"
                  type="textarea"
                  v-model="dataStorage.description"
                  dense
                  class="q-mt-sm"
                />
              </div>
            </q-card-section>
          </div>
          <q-card-section>
            <q-btn
              outline
              label="Cancel"
              v-close-popup
              color="primary"
              no-caps
              class="q-mr-md"
              style="width: 180px"
            />
            <q-btn
              label="Confirm"
              unelevated
              color="primary"
              no-caps
              style="width: 180px"
              type="submit"
            />
          </q-card-section>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
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
import ImageViewer from 'src/components/ImageViewer.vue'
import { getActivitiesAndEvents } from 'src/composable/latestComposable'
import { ref, reactive, computed, onMounted } from 'vue'

export default {
  components: {
    QCalendarMonth,
    ImageViewer,
  },
  setup() {
    const CURRENT_DAY = new Date()
    const showDialog = ref(true)
    const mode = ref('Add')
    const dataStorage = ref({})
    const getCurrentDay = (day) => {
      const newDay = new Date(CURRENT_DAY)
      newDay.setDate(day)
      const tm = parseDate(newDay)
      return tm && tm.date
    }

    const calendar = ref(null)
    const selectedDate = ref(today())

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

    const badgeClasses = (event) => {
      return {
        'text-white': true,
        [`bg-${event.bgcolor}`]: true,
        'q-calendar__ellipsis': true,
      }
    }

    const badgeStyles = () => {
      return {}
    }

    const onToday = () => {
      calendar.value && calendar.value.moveToToday()
    }

    const onPrev = () => {
      calendar.value && calendar.value.prev()
    }

    const onNext = () => {
      calendar.value && calendar.value.next()
    }

    const onMoved = (data) => {
      console.info('onMoved', data)
    }

    const onChange = (data) => {
      console.info('onChange', data)
    }

    const onClickDate = (data) => {
      console.info('onClickDate', data)
    }

    const onClickDay = (data) => {
      console.info('onClickDay', data)
    }

    const onClickWorkweek = (data) => {
      console.info('onClickWorkweek', data)
    }

    const onClickHeadDay = (data) => {
      console.info('onClickHeadDay', data)
    }

    const onClickHeadWorkweek = (data) => {
      console.info('onClickHeadWorkweek', data)
    }

    const events = reactive([])
    onMounted(() => {
      getActivitiesAndEvents().then((response) => {
        events.splice(0, events.length, ...response) // replaces the contents
      })
    })
    return {
      mode,
      getCurrentDay,
      dataStorage,
      showDialog,
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
