<template>
  <q-page>
    <q-btn
      dense
      round
      color="primary"
      icon="medical_services"
      class="q-ml-md"
      size="lg"
      style="position: fixed; bottom: 76px; right: 36px"
    >
      <q-menu :offset="[-60, -10]">
        <q-card
          style="
            max-width: 350px;
            width: 350px;
            max-height: 500px;
            height: 500px;
          "
        >
          <q-card-section>
            <div class="row items-center justify-between no-wrap">
              <q-btn
                label="Reports"
                icon="medical_services"
                dense
                no-caps
                flat
                class="full-width"
                :class="based ? 'highlight_btn' : ''"
                square
                @click="based = true"
              />
              <q-separator vertical></q-separator>
              <q-btn
                square
                label="Announcement"
                icon="campaign"
                class="full-width"
                dense
                no-caps
                flat
                :class="based == false ? 'highlight_btn' : ''"
                @click="based = false"
              />
            </div>
            <div v-show="based == true">
              <div></div>
              <div></div>
            </div>
            <q-separator></q-separator>
          </q-card-section>
        </q-card>
      </q-menu>
    </q-btn>
  </q-page>
</template>
<script>
import { ref, defineComponent } from "vue";
export default defineComponent({
  name: "reportAnnouncementDialog",

  setup() {
    let based = ref(true);
    return {
      based,
    };
  },
});
</script>
<style
  lang="scss"
  scoped
  src="../pages/taara/style/reportAnnouncementDialog.scss"
></style>
