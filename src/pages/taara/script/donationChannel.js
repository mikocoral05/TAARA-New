import taaraFooter from "src/components/taaraFooter.vue";
import donationDialog from "src/components/donationDialog.vue";
import { useCounterStore } from "src/stores/example-store";
import {
  encodeAnimalId,
  wordifyDate,
  formatNumber,
} from "src/composable/simpleComposable";
import {
  getWishlistFood,
  getWishlistMedicine,
  getWishlistSupplies,
  wishlistFoodData,
  wishlistMedicineData,
  wishlistSuppliesData,
  getDonators,
  donatorsData,
} from "../../../composable/taaraComposable";
import { onMounted, ref } from "vue";
export default {
  components: {
    taaraFooter,
    donationDialog,
  },
  setup() {
    const counterStore = useCounterStore();
    const filterDonator = (amount) => {
      return donatorsData.value.filter((obj) => obj.donation_amount === amount);
    };
    const filterOtherDonator = () => {
      let arr = [500, 1000, 1500];
      return donatorsData.value.filter(
        (obj) => !arr.includes(obj.donation_amount)
      );
    };
    const countOtherDonator = () => {
      let arr = [500, 1000, 1500];
      let result = donatorsData.value.filter(
        (obj) => !arr.includes(obj.donation_amount)
      ).length;
      if (result > 5) {
        return "+" + (result - 5);
      }
    };
    const countDonators = (amount) => {
      let result = donatorsData.value.filter(
        (obj) => obj.donation_amount === amount
      ).length;
      if (result > 9) {
        return "+" + (result - 9);
      }
    };
    const cuttedDonors = (cutNum) => {
      let startIndex = cutNum - 4;
      let endIndex = cutNum;
      return donatorsData.value.slice(startIndex, endIndex);
    };
    const countUniqueDonators = () => {
      const uniqueDonatorIds = new Set();
      const uniqueWalkInIds = new Set();

      donatorsData.value.forEach((obj) => {
        if (obj.donators_id) {
          uniqueDonatorIds.add(obj.donators_id);
        }
        if (obj.walk_in_id) {
          uniqueWalkInIds.add(obj.walk_in_id);
        }
      });

      const uniqueDonatorsCount = uniqueDonatorIds.size;
      const uniqueWalkInCount = uniqueWalkInIds.size;

      return uniqueDonatorsCount + uniqueWalkInCount;
    };

    // Example usage:

    onMounted(() => {
      getWishlistFood();
      getWishlistMedicine();
      getWishlistSupplies();
      getDonators();
    });
    return {
      countUniqueDonators,
      formatNumber,
      wordifyDate,
      cuttedDonors,
      autoplay: ref(true),
      slide: ref(1),
      countOtherDonator,
      countDonators,
      filterOtherDonator,
      filterDonator,
      donatorsData,
      encodeAnimalId,
      counterStore,
      wishlistFoodData,
      wishlistMedicineData,
      wishlistSuppliesData,

      thumbStyle: {
        right: "2px",
        borderRadius: "5px",
        backgroundColor: "#e0e0e0",
        width: "5px",
        opacity: "0.75",
      },
    };
  },
};
