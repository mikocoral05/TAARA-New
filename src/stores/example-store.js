import { defineStore } from "pinia";

export const useCounterStore = defineStore("counter", {
  state: () => ({
    rescueReport: null,
    announcement: null,
    notif: 0,
    search: 0,
    showDialog: false,
    showReportAnnouncementDialog: false,
    specificAnimalId: 0,
    manageAnimal: 0,
    donChart: null,
    headerColor: "",
    scrollToDiv: 0,
    donationDialog: false,
  }),
  getters: {
    doubleCount: (state) => state.counter * 2,
  },

  actions: {
    increment() {
      this.counter++;
    },
    incrementFooter() {
      this.scrollToDiv++;
    },
    changeReport(payload) {
      this.rescueReport = payload;
    },
    changeAnnounce(payload) {
      this.announcement = payload;
    },
    changeNotif(p) {
      this.notif = p;
    },
    ChangeSearchValue() {
      this.search++;
    },
    incrementid() {
      this.specificAnimalId++;
    },
  },
});
