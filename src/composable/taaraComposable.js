import { ref, computed } from 'vue'
import * as XLSX from 'xlsx/xlsx.mjs'
import {
  calculateAge,
  wordifySex,
  // getAge,
  // switchCaseSize,
  // goodWith,
  wordifyCurrentState,
  // wordifyGoodWith,
  // dateToday,
  // timeNow,
} from 'src/composable/simpleComposable'
import { api } from 'src/boot/axios'
let dearUserName = ref(null)
let dearUserEmail = ref(null)
let dearUserPhoneNumber = ref(null)

let userData = ref([])
let featuredData = ref([])
let allAnimalData = ref([])
let allAnimalBackUp = ref([])
let allAnimalManagementBackUp = ref([])
let allAnimalData6 = ref([])
let allAnimalData12 = ref([])
let specificAnimalId = ref([])
let annoucementData = ref([])
let adoptionRequest = ref([])
let logInDetails = ref([])
let originalObject = ref([])
let originalDatadopted = ref([])
let originalFoodInventory = ref([])
let originalDataRescuedStray = ref([])
let originalDataDeceased = ref([])
let originalReportRescueData = ref([])
let originalDataSurrendered = ref([])
let originalDataallInKind = ref([])
let originalDataDonationTracker = ref([])
let originalDatafundsAndExpenses = ref([])
let specificAnimal6OriginalObject = ref([])

let allUserId = ref()
let adoptedAnimalOnProgress = ref([])
let voluteerFormData = ref([])
let getReportRescueData = ref([])
let imageURL = ref([])
let wrongUserOrPass = ref(null)

let updateModalCtrl = ref(false)
let successModalCtrl = ref(false)
let mainDisplayCtrl = ref(true)
let addModalCtrl = ref(false)
let deleteModalCtrl = ref(false)
let animalDataBackUp = ref()
animalDataBackUp.value = JSON.parse(localStorage.getItem('allAnimal'))

const getFeaturedAnimals = () => {
  //unused
  return new Promise((resolve, reject) => {
    api
      .get('api.php', { params: { featured: 'yes' } })
      .then((response) => {
        for (var i = 0; i < response.data.data.length; i++) {
          featuredData.value.push(response.data.data[i])
        }
        console.log(featuredData.value)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
let shuffleOne = ref()
const getAllAnimals = () => {
  return new Promise((resolve, reject) => {
    api
      .get('api.php', { params: { all_animals: 'all_animals' } })
      .then((response) => {
        console.log(response.data.data)

        allAnimalBackUp.value = response.data.data
        allAnimalData.value = response.data.data
        allAnimalData.value.forEach((obj) => {
          obj.age = calculateAge(obj.age)
        })
        const shuffled1 = [...response.data.data].sort(() => 0.5 - Math.random()).slice(0, 1)
        localStorage.setItem('one', JSON.stringify(shuffled1))
        shuffleOne.value = JSON.parse(localStorage.getItem('one'))
      })
      .catch((error) => {
        reject(error)
      })
  })
}

specificAnimal6OriginalObject.value = JSON.parse(localStorage.getItem('specificAnimal6'))
allAnimalData6.value = specificAnimal6OriginalObject.value
let wishlistPriority = ref([])
const getWishlistPriority = () => {
  return new Promise((resolve, reject) => {
    api
      .get('api.php', { params: { get_wishlist_priority: '' } })
      .then((response) => {
        if (response.data.status == 'success') {
          wishlistPriority.value = response.data.data
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}

let allAnimalDataManagement = ref([])
const getAllAnimalsManagement = () => {
  let animalState = JSON.parse(localStorage.getItem('manage-animal'))
  return new Promise((resolve, reject) => {
    api
      .get('api.php', {
        params: { all_animals_management: animalState },
      })
      .then((response) => {
        allAnimalManagementBackUp.value = response.data.data
        allAnimalDataManagement.value = response.data.data
        console.log(allAnimalDataManagement.value)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
let allUsersData = ref([])
const allUsers = (date) => {
  console.log(date)
  return new Promise((resolve, reject) => {
    api
      .get('api.php', {
        params: {
          all_users: 'all_users',
          month: date.month.value,
          year: date.year,
        },
      })
      .then((response) => {
        allUsersData.value = response.data.data[0].total_count
      })
      .catch((error) => {
        reject(error)
      })
  })
}
const animalPublicDisplay = () => {
  return new Promise((resolve, reject) => {
    api
      .get('api.php', {
        params: { animal_public_display: 'animal_public_display' },
      })
      .then((response) => {
        allAnimalData12.value = response.data.data
      })
      .catch((error) => {
        reject(error)
      })
  })
}

allAnimalData12.value = JSON.parse(localStorage.getItem('specificAnimal12'))
const moreAnimalForAdoption = () => {
  return new Promise((resolve, reject) => {
    api
      .get('api.php', {
        params: { more_animal_for_adoption: 'more_animal_for_adoption' },
      })
      .then((response) => {
        allAnimalData6.value = response.data.data
      })
      .catch((error) => {
        reject(error)
      })
  })
}
// const SearchAnimalByName = (payload, search) => {
//   allAnimalData.value = allAnimalBackUp.value;
//   let SearchValue = Object.fromEntries(
//     Object.entries(search._value).filter(
//       ([_, v]) => v != null && v != "Any" && v != ""
//     )
//   );
//   allAnimalData.value.forEach((animal) => {
//     var today = new Date();
//     var birthDate = new Date(animal.age);
//     var age = today.getFullYear() - birthDate.getFullYear();
//     var m = today.getMonth() - birthDate.getMonth();
//     if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
//       age--;
//     }
//     if (age < 2) {
//       return (animal.age = "young");
//     } else if (age >= 2 && age <= 10) {
//       return (animal.age = "adult");
//     } else if (age >= 11) {
//       return (animal.age = "senior");
//     }
//     // animal.age = "";
//   });

//   if (payload ? true : false && Object.keys(SearchValue).length >= 2) {
//     console.log("first");
//     delete SearchValue.animal_name;
//     allAnimalData.value = allAnimalData.value
//       .filter((obj) => {
//         return Object.keys(SearchValue).every((key) => {
//           return obj[key].toLowerCase() === SearchValue[key].toLowerCase();
//         });
//       })
//       .filter((obj) =>
//         obj.animal_name.toLowerCase().includes(payload.toLowerCase())
//       );
//   } else if (payload ? true : false) {
//     console.log("second");
//     let filteredAnimals = computed(() => {
//       return allAnimalData.value.filter((animal) => {
//         return animal.animal_name.toLowerCase().includes(payload.toLowerCase());
//       });
//     });
//     console.log(filteredAnimals.value);
//     allAnimalData.value = filteredAnimals.value;
//   } else {
//     console.log("third");
//     console.log(SearchValue);

//     allAnimalData.value = allAnimalData.value.filter((obj) => {
//       return Object.keys(SearchValue).every((key) => {
//         return obj[key] === SearchValue[key];
//       });
//     });
//   }
// };
const SearchAnimalByName = (searchValue) => {
  // Filter the array based on the user's input
  let notEqual = ['animal_image', 'animal_id']

  let filteredArr = allAnimalData.value.filter((obj) =>
    Object.keys(obj).some(
      (key) => key.toLowerCase().includes(searchValue.toLowerCase()) && !notEqual.includes(key),
    ),
  )
  // If no matching keys, search in the object's values
  if (filteredArr.length === 0) {
    filteredArr = allAnimalData.value.filter((obj) =>
      Object.values(obj).some((value) =>
        value.toString().toLowerCase().includes(searchValue.toLowerCase()),
      ),
    )
  }

  // Extract the values of the keys that include the user's input and remove duplicates
  let values = [
    ...new Set(
      filteredArr.flatMap((obj) =>
        Object.entries(obj)
          .filter(
            ([key, value]) =>
              (key.includes(searchValue) ||
                value.toString().toLowerCase().includes(searchValue.toLowerCase())) &&
              key !== 'animal_image',
          )
          .map(([, value]) => value),
      ),
    ),
  ]
  console.log(filteredArr)

  console.log(values)
}

let newBackupallAnimalDataManagement = ref([])
let filterAnimalByState = (val) => {
  if (val == 0) {
    allAnimalDataManagement.value = allAnimalManagementBackUp.value
  } else {
    allAnimalDataManagement.value = allAnimalManagementBackUp.value.filter(
      (obj) => obj.current_state === val,
    )
  }
  newBackupallAnimalDataManagement.value = allAnimalDataManagement.value
}
const SearchAnimalByNameManagement = (payload, search) => {
  allAnimalDataManagement.value = newBackupallAnimalDataManagement.value
  let SearchValue = Object.fromEntries(
    Object.entries(search._value).filter(([, v]) => v != null && v != 'Any' && v != ''),
  )
  if (payload && Object.keys(SearchValue).length >= 2) {
    console.log('first')
    delete SearchValue.animal_name
    allAnimalDataManagement.value = allAnimalDataManagement.value
      .filter((obj) => {
        return Object.keys(SearchValue).every((key) => {
          return obj[key].toLowerCase() === SearchValue[key].toLowerCase()
        })
      })
      .filter((obj) => obj.animal_name.toLowerCase().includes(payload.toLowerCase()))
  } else if (payload ? true : false) {
    let filteredAnimals = computed(() => {
      return allAnimalDataManagement.value.filter((animal) => {
        return animal.animal_name.toLowerCase().includes(payload.toLowerCase())
      })
    })
    console.log(filteredAnimals.value)
    allAnimalDataManagement.value = filteredAnimals.value
  } else {
    allAnimalDataManagement.value = allAnimalDataManagement.value.filter((obj) => {
      return Object.keys(SearchValue).every((key) => {
        return obj[key] === SearchValue[key]
      })
    })
  }
}

const checkEmail = (payload) => {
  return new Promise((resolve, reject) => {
    api
      .get('api.php', { params: { check_email: payload } })
      .then((response) => {
        if (response.data.status == 'success') {
          dearUserName.value = response.data.data[0].first_name
          dearUserEmail.value = response.data.data[0].email_address
          dearUserPhoneNumber.value = response.data.data[0].phone_number
        }
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const logIn = (email_address, password) => {
  return new Promise((resolve, reject) => {
    api
      .get('api.php', {
        params: { email_address: email_address, password: password },
      })
      .then((response) => {
        // if (response.data.status == 'failed') {
        // } else {
        // var serializedObject = JSON.stringify(response.data.data)
        // localStorage.setItem('logInDetails', serializedObject)
        // logInDetails.value = JSON.parse(localStorage.getItem('logInDetails'))
        // }
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const getPublicUser = (user_id) => {
  return new Promise((resolve, reject) => {
    api
      .get('api.php', {
        params: { public_user_id: user_id },
      })
      .then((response) => {
        if (response.data.status == 'success') {
          console.log()
          resolve(response.data.data[0])
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const updatePublicUserDetails = (payload) => {
  console.log(payload)
  return new Promise((resolve, reject) => {
    api
      .put('api.php', { update_public_user_details: payload })
      .then((response) => {
        if (response.data.status == 'success') {
          let obj = {
            user_id: payload.user_id,
            image: payload.image,
            first_name: payload.first_name,
            account_identifier: payload.account_identifier,
          }
          logInDetails.value[0] = { ...obj }
          let serializedObject = JSON.stringify(logInDetails.value)
          localStorage.setItem('logInDetails', serializedObject)
          logInDetails.value = JSON.parse(localStorage.getItem('logInDetails'))
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const updatePublicUserEmailAddress = (new_email_address, user_id) => {
  return new Promise((resolve, reject) => {
    api
      .put('api.php', {
        update_publicuser_email_address: new_email_address,
        user_id: user_id,
      })
      .then((response) => {
        resolve(response.data.status)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
// localStorage.removeItem('logInDetails');

const uploadImage = (payload, image, name) => {
  payload.value[0].user_image = image[0]
  return new Promise((resolve, reject) => {
    api
      .put('api.php', {
        image: image[0],
        user_id: payload.value[0].user_id,
        user_image_name: name,
      })
      .then(() => {
        var upload = JSON.stringify(payload.value)
        localStorage.setItem('upload', upload)
        // console.log(localStorage.getItem('logInDetails'));
        logInDetails.value = JSON.parse(localStorage.getItem('upload')) //not being use anymore in edit-profile check other template
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const updatePublicUserPassword = (new_password, user_id) => {
  return new Promise((resolve, reject) => {
    api
      .put('api.php', { update_password: new_password, user_id: user_id })
      .then((response) => {
        if (response.data.status == 'success') {
          resolve(response.data.status)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
let specificAnimal = ref([])
const viewSpecificAnimal = (payload) => {
  return new Promise((resolve, reject) => {
    api
      .get('api.php', {
        params: {
          specificAnimalId: payload,
        },
      })
      .then((response) => {
        specificAnimal.value = response.data
        // localStorage.setItem("specificAnimalId", payload);
        console.log(specificAnimal.value)
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
let specificAnimalImage = ref([])
const getSpecificAnimalImage = (payload) => {
  console.log(payload)
  return new Promise((resolve, reject) => {
    api
      .get('api.php', {
        params: {
          animalImageId: payload,
        },
      })
      .then((response) => {
        specificAnimalImage.value = response.data.image
        console.log(specificAnimalImage.value)
        resolve(specificAnimalImage.value)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
let specificAnimalManagement = ref([])
const viewSpecificAnimalManagement = (payload) => {
  return new Promise((resolve, reject) => {
    api
      .get('api.php', {
        params: {
          animalId: payload,
        },
      })
      .then((response) => {
        specificAnimalManagement.value = response.data
      })
      .catch((error) => {
        reject(error)
      })
  })
}

let latestAnnouncement = ref([])
let latestAnnouncementImage = ref([])
const getAnnouncement = () => {
  return new Promise((resolve, reject) => {
    api
      .get('api.php', { params: { get_annoucement: 'get_annoucement' } })
      .then((response) => {
        // response.data.data.sort(
        //   (a, b) => new Date(b.date_created) - new Date(a.date_created)
        // );
        latestAnnouncement.value = response.data.data
        // latestAnnouncement.value = response.data.data.reduce(
        //   (prev, current) => {
        //     return new Date(prev.date_report) > new Date(current.date_report)
        //       ? prev
        //       : current;
        //   }
        // );
        latestAnnouncementImage.value = response.data.image
        // .filter((item) => {
        //   return item.report_id === latestAnnouncement.value.report_id;
        // });
      })
      .catch((error) => {
        reject(error)
      })
  })
}
const getAllAnnouncement = () => {
  return new Promise((resolve, reject) => {
    api
      .get('api.php', {
        params: { get_all_annoucement: 'get_all_annoucement' },
      })
      .then((response) => {
        annoucementData.value = response.data
      })
      .catch((error) => {
        reject(error)
      })
  })
}
const addAnnouncementManagement = (announcementDetails, images) => {
  return new Promise((resolve, reject) => {
    api
      .post('api.php', {
        add_announcement_management: 'add_announcement_management',
        announcement_details: announcementDetails,
        images: images,
      })
      .then((response) => {
        console.log(response.data.data)
        console.log(response.data.images)
        // update on refresh but notif should be real time
      })
      .catch((error) => {
        reject(error)
      })
  })
}
const updateAnnouncementManagement = (announcementDetails, images) => {
  return new Promise((resolve, reject) => {
    api
      .put('api.php', {
        update_announcement: 'update_announcement',
        announcement_details: announcementDetails,
        images: images,
      })
      .then((response) => {
        if (response.data.status == 'success') {
          annoucementData.value.data = annoucementData.value.data.map((obj) =>
            obj.announcement_id === announcementDetails.announcement_id ? announcementDetails : obj,
          )

          const newImageMap = images.reduce((map, newObj) => {
            if (!map[newObj.announcement_id]) {
              map[newObj.announcement_id] = [] // Initialize an array for each announcement_id
            }
            map[newObj.announcement_id].push(newObj.image) // Add the new image URL
            return map
          }, {})

          // Update the image property in olddata
          annoucementData.value.image.forEach((obj) => {
            if (newImageMap[obj.announcement_id]) {
              obj.image = newImageMap[obj.announcement_id].shift() // Assign the new image URL
            }
          })
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const addSurrenderForm = (surrenderDetails) => {
  return new Promise((resolve, reject) => {
    api
      .post('api.php', {
        add_surrender_form: surrenderDetails,
      })
      .then((response) => {
        console.log(response.data.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

let reportRequestData = ref([])
const getReportRequest = () => {
  return new Promise((resolve, reject) => {
    api
      .get('api.php', { params: { get_rescue_request: 'get_rescue_request' } })
      .then((response) => {
        reportRequestData.value = response.data
        console.log(reportRequestData.value)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
let volunteerRequestData = ref([])
const getVolunteerRequest = () => {
  return new Promise((resolve, reject) => {
    api
      .get('api.php', {
        params: { get_volunteer_request: 'get_volunteer_request' },
      })
      .then((response) => {
        volunteerRequestData.value = response.data.data
        console.log(volunteerRequestData.value)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
const getAdoptionRequest = () => {
  return new Promise((resolve, reject) => {
    api
      .get('api.php', {
        params: { get_adoption_request: 'get_adoption_request' },
      })
      .then((response) => {
        adoptionRequest.value = response.data.data
        console.log(adoptionRequest.value)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
let declineAdoptionRequest = (payload) => {
  return new Promise((resolve, reject) => {
    api
      .put('api.php', {
        decline_adoption_request: payload,
        adoption_status: { adoption_status: 3 },
      })
      .then((response) => {
        if (response.data.status == 'success') {
          adoptionRequest.value = adoptionRequest.value.filter((obj) => obj.id !== payload)
          console.log(adoptionRequest.value)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
let approveAdoptionRequest = (payload) => {
  return new Promise((resolve, reject) => {
    api
      .put('api.php', {
        approve_adoption_request: payload,
        adoption_status: { adoption_status: 2 },
      })
      .then((response) => {
        if (response.data.status == 'success') {
          adoptionRequest.value = adoptionRequest.value.filter((obj) => obj.id !== payload)
          console.log(adoptionRequest.value)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
let adoptionRequestProgressUpdate = (payload, review_value) => {
  return new Promise((resolve, reject) => {
    api
      .put('api.php', {
        update_adoption_request: payload,
        review_form: { review_form: review_value },
      })
      .then((response) => {
        if (response.data.status == 'success') {
          adoptionRequest.value = adoptionRequest.value.map((obj) => {
            if (obj.id === payload) {
              return { ...obj, review_form: 2 }
            }
            return obj
          })
        }
        console.log(adoptionRequest.value)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
let declineRescueRequest = (payload) => {
  return new Promise((resolve, reject) => {
    api
      .put('api.php', {
        decline_rescue_request: payload,
        report_status: { report_status: 3 },
      })
      .then((response) => {
        if (response.data.status == 'success') {
          reportRequestData.value.data = reportRequestData.value.data.filter(
            (obj) => obj.report_id !== payload,
          )
          console.log(reportRequestData.value.data)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
let approveRescueRequest = (payload) => {
  return new Promise((resolve, reject) => {
    api
      .put('api.php', {
        approve_rescue_request: payload,
        report_status: { report_status: 2 },
      })
      .then((response) => {
        if (response.data.status == 'success') {
          reportRequestData.value.data = reportRequestData.value.data.filter(
            (obj) => obj.report_id !== payload,
          )
          console.log(reportRequestData.value.data)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
let declineVolunteerRequest = (payload) => {
  console.log(payload)
  return new Promise((resolve, reject) => {
    api
      .put('api.php', {
        decline_volunteer_request: payload,
        volunteer_status: { volunteer_status: 3 },
      })
      .then((response) => {
        if (response.data.status == 'success') {
          volunteerRequestData.value = volunteerRequestData.value.filter(
            (obj) => obj.volunteer_id !== payload,
          )
          console.log(volunteerRequestData.value)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
let approveVolunteerRequest = (payload) => {
  console.log(payload)
  return new Promise((resolve, reject) => {
    api
      .put('api.php', {
        approve_volunteer_request: payload,
        volunteer_status: { volunteer_status: 2 },
      })
      .then((response) => {
        if (response.data.status == 'success') {
          volunteerRequestData.value = volunteerRequestData.value.filter(
            (obj) => obj.volunteer_id !== payload,
          )
          console.log(volunteerRequestData.value)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
let declineInKindDonation = (payload) => {
  console.log(payload)
  return new Promise((resolve, reject) => {
    api
      .put('api.php', {
        decline_in_kind_donation: payload,
        donation_in_kind_status: { donation_in_kind_status: 3 },
      })
      .then((response) => {
        if (response.data.status == 'success') {
          pendingInKindDonations.value = pendingInKindDonations.value.filter(
            (obj) => obj.donation_in_kind_id !== payload,
          )
          console.log(pendingInKindDonations.value)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
let approveInKindDonation = (payload) => {
  console.log(payload)
  return new Promise((resolve, reject) => {
    api
      .put('api.php', {
        approve_in_kind_donation: payload,
        donation_in_kind_status: { donation_in_kind_status: 2 },
      })
      .then((response) => {
        if (response.data.status == 'success') {
          pendingInKindDonations.value = pendingInKindDonations.value.filter(
            (obj) => obj.donation_in_kind_id !== payload,
          )
          console.log(pendingInKindDonations.value)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
let declineDonation = (payload) => {
  console.log(payload)
  return new Promise((resolve, reject) => {
    api
      .put('api.php', {
        decline_donation: payload,
        donation_status: { donation_status: 2 },
      })
      .then((response) => {
        if (response.data.status == 'success') {
          pendingDonations.value = pendingDonations.value.filter(
            (obj) => obj.donation_id !== payload,
          )
          console.log(pendingInKindDonations.value)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
let approveDonation = (payload) => {
  console.log(payload)
  return new Promise((resolve, reject) => {
    api
      .put('api.php', {
        approve_donation: payload,
        donation_status: { donation_status: 2 },
      })
      .then((response) => {
        if (response.data.status == 'success') {
          pendingDonations.value = pendingDonations.value.filter(
            (obj) => obj.donation_id !== payload,
          )
          console.log(pendingInKindDonations.value)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
const getReportRescue = () => {
  return new Promise((resolve, reject) => {
    api
      .get('api.php', { params: { get_rescue_report: 'get_rescue_report' } })
      .then((response) => {
        originalReportRescueData.value = response.data.data
        getReportRescueData.value = response.data
        console.log(getReportRescueData.value.data)
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
const addReportManagement = (reportDetails, images) => {
  console.log(reportDetails)
  console.log(images)
  // return new Promise((resolve, reject) => {
  //   api
  //     .post("api.php", {
  //       add_report_management: "add_report_management",
  //       report_details: reportDetails,
  //       images: images,
  //     })
  //     .then((response) => {
  //       console.log(response.data.data);
  //       console.log(response.data.images);
  //       // update on refresh but notif should be real time
  //     })
  //     .catch((error) => {
  //       reject(error);
  //     });
  // });
}
const updateReportManagement = (reportDetails, images) => {
  console.log(reportDetails)
  console.log(images)

  return new Promise((resolve, reject) => {
    api
      .put('api.php', {
        update_report: 'update_report',
        report_details: reportDetails,
        images: images,
      })
      .then((response) => {
        if (response.data.status == 'success') {
          getReportRescueData.value.data = getReportRescueData.value.data.map((obj) =>
            obj.report_id === reportDetails.report_id ? reportDetails : obj,
          )

          const newImageMap = images.reduce((map, newObj) => {
            if (!map[newObj.report_id]) {
              map[newObj.report_id] = [] // Initialize an array for each report_id
            }
            map[newObj.report_id].push(newObj.image) // Add the new image URL
            return map
          }, {})

          // Update the image property in olddata
          getReportRescueData.value.image.forEach((obj) => {
            if (newImageMap[obj.report_id]) {
              obj.image = newImageMap[obj.report_id].shift() // Assign the new image URL
            }
          })
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
const addAnimalReport = (payload, image) => {
  return new Promise((resolve, reject) => {
    api
      .post('api.php', { add_animal_report: payload, image: image })
      .then((response) => {
        console.log(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

let activitiesAndEventsData = ref([])
let activitiesAndEventsDataSpecific = ref([])
let activitiesAndEventsDataOriginalData = ref([])

const getActivitiesAndEvents = () => {
  return new Promise((resolve, reject) => {
    api
      .get('api.php', {
        params: { get_activities_and_event: 'get_activities_and_event' },
      })
      .then((response) => {
        activitiesAndEventsDataOriginalData.value = response.data.data
        activitiesAndEventsData.value = response.data.data
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const getActivitiesAndEventsSpecific = () => {
  let payloadId = JSON.parse(localStorage.getItem('activitiesAndEventsDataSpecificId'))
  return new Promise((resolve, reject) => {
    api
      .get('api.php', {
        params: {
          activities_and_event_specific: payloadId,
        },
      })
      .then((response) => {
        activitiesAndEventsDataSpecific.value = response.data
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const addUser = (payload) => {
  console.log(payload)
  return new Promise((resolve, reject) => {
    api
      .post('api.php', { add_user: payload })
      .then((response) => {
        // userData.value = response.data;
        // console.log(response.data);
        resolve(response.data.status)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

let likesData = ref([])
const likes = (payload1, payload2, date, image, name) => {
  return new Promise((resolve, reject) => {
    api
      .post('api.php', {
        animal_id: payload1,
        user_id: payload2,
        date_liked: date,
        animal_image: image,
        animal_name: name,
      })
      .then((response) => {
        if (response.data.status == 'success') {
          localStorage.setItem('animalLikes', JSON.stringify(response.data.data))
          likesData.value = JSON.parse(localStorage.getItem('animalLikes'))
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const removeLikes = (animal_id, user_id, date, image, name) => {
  return new Promise((resolve, reject) => {
    api
      .delete('api.php', {
        data: {
          animal_id: animal_id,
          user_id: user_id,
          date_liked: date,
          animal_image: image,
          animal_name: name,
        },
      })
      .then((response) => {
        if (response.data.status == 'success') {
          likesData.value = likesData.value.filter(
            (item) => item.user_id !== user_id || item.animal_id !== animal_id,
          )
          localStorage.setItem('animalLikes', JSON.stringify(likesData.value))
          likesData.value = JSON.parse(localStorage.getItem('animalLikes'))
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const getLikes = (user_id) => {
  return new Promise((resolve, reject) => {
    api
      .get('api.php', { params: { get_likes: 'get_likes', user_id: user_id } })
      .then((response) => {
        localStorage.setItem('animalLikes', JSON.stringify(response.data.data))
        likesData.value = JSON.parse(localStorage.getItem('animalLikes'))
      })
      .catch((error) => {
        reject(error)
      })
  })
}
let notifData = ref([])
let notifCount = ref()
const items = ref([])
let lastObjectNotif
const getNotification = () => {
  // return new Promise((resolve, reject) => {
  //   api
  //     .get("api.php", {
  //       params: {
  //         get_notification: "get_notification",
  //         account_date_created: logInDetails.value[0].date_created,
  //         offset: offset,
  //       },
  //     })
  //     .then((response) => {
  //       notifData.value = response.data.data;
  //       items.value.push(...notifData.value);
  //       console.log(items.value);
  //       lastObjectNotif = items.value.length;
  //       let storeCount = 0;
  //       items.value
  //         .map((obj) => obj.status)
  //         .forEach((str) => {
  //           const subArr = str.split(",");
  //           if (
  //             !subArr.includes(
  //               logInDetails.value == null
  //                 ? null
  //                 : logInDetails.value[0].user_id.toString()
  //             )
  //           ) {
  //             logInDetails.value == null ? (storeCount = 0) : storeCount++;
  //           }
  //         });
  //       localStorage.setItem("count", JSON.stringify(storeCount));
  //       notifCount.value = JSON.parse(localStorage.getItem("count"));
  //     })
  //     .catch((error) => {
  //       reject(error);
  //     });
  // });
}
const notifUpdate = (concat, idbased) => {
  return new Promise((resolve, reject) => {
    api
      .put('api.php', {
        notif: idbased,
        status: concat,
      })
      .then(() => {
        notifData.value = notifData.value.map((item) => {
          if (item.notif === idbased) {
            return { ...item, status: concat }
          }
          return item
        })
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const submitAdoptionForm = (payload) => {
  return new Promise((resolve, reject) => {
    api
      .post('api.php', { submit_adoption_form: payload })
      .then((response) => {
        resolve(response.data.status)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const submitSuppliesForm = (payload) => {
  delete payload.summarize
  console.log(payload)
  return new Promise((resolve, reject) => {
    api
      .post('api.php', { supplies_form_details: payload })
      .then((response) => {
        resolve(response.data.status)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const getSubmitAdoptionForm = (payload) => {
  console.log(payload)
  return new Promise((resolve, reject) => {
    api
      .get('api.php', { params: { adoption_form_details: payload } })
      .then((response) => {
        adoptedAnimalOnProgress.value = response.data.data
        console.log(adoptedAnimalOnProgress.value)
        resolve(response.data.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// taara management function
let fundsAndExpenses = ref([])
let todayfundsAndExpensesTotal = ref(0)
let specificDateAddExpenses = ref()
const getDailyFundsAndExpenses = (date) => {
  console.log(date)
  specificDateAddExpenses.value = date
  return new Promise((resolve, reject) => {
    api
      .get('api.php', {
        params: {
          get_today_funds_and_expenses: 'get_today_funds_and_expenses',
          date: date,
        },
      })
      .then((response) => {
        originalDatafundsAndExpenses.value = response.data.data
        fundsAndExpenses.value = response.data.data
        todayfundsAndExpensesTotal.value = response.data.data.reduce(
          (total, item) => total + item.expense_total,
          0,
        )
        console.log(fundsAndExpenses.value)
        resolve(todayfundsAndExpensesTotal.value)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
let dailyTotal = ref([])
let monthlyTotalExpense = ref(0)
let responseBackup = ref([])
const getMonthlyFundAndExpenses = (date) => {
  console.log(date)

  return new Promise((resolve, reject) => {
    api
      .get('api.php', {
        params: {
          get_monthly_funds_and_expenses: 'get_monthly_funds_and_expenses',
          month: date.month.value,
          year: date.year,
        },
      })
      .then((response) => {
        responseBackup.value = response.data.data
        let numberOfDays = new Date(date.month.value, date.year, 0).getDate()
        dailyTotal.value = []
        monthlyTotalExpense.value = 0
        for (let i = 1; i <= numberOfDays; i++) {
          dailyTotal.value.push({ day: i, total: 0 })
        }
        responseBackup.value.forEach((purchase) => {
          let day = Number(purchase.date.split('-')[2])
          let dayObject = dailyTotal.value.find((obj) => obj.day === day)
          if (dayObject) {
            dayObject.total += purchase.expense_total
            monthlyTotalExpense.value += purchase.expense_total
          }
        })
        console.log(responseBackup.value)
        resolve(monthlyTotalExpense.value)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
const getAllMonthlyExpenses = (date, text) => {
  let year
  if (text == 'budget_allocation') {
    let isArray = Array.isArray(date.year)
    if (isArray) {
      year = date.year[0]
    } else {
      year = date.year
    }
  } else {
    year = date.year
  }
  return new Promise((resolve, reject) => {
    api
      .get('api.php', {
        params: {
          get_all_monthly_expenses: 'get_all_monthly_expenses',
          year: year,
        },
      })
      .then((response) => {
        resolve(response.data.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
let monthlyDonationData = ref([])
const getMonthlyDonation = (date, text) => {
  let year
  if (text == 'budget_allocation') {
    let isArray = Array.isArray(date.year)
    if (isArray) {
      year = date.year[0]
    } else {
      year = date.year
    }
  } else {
    year = date.year
  }
  return new Promise((resolve, reject) => {
    api
      .get('api.php', {
        params: {
          get_monthly_donation: 'get_monthly_donation',
          year: year,
        },
      })
      .then((response) => {
        if (response.data.status == 'success') {
          if (response.data.data.length > 0) {
            monthlyDonationData.value = response.data.data
            // monthlyDonationData.value = response.data.data[0].month_donation;
          }
          resolve(response.data.data)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
const addExpenses = (payload) => {
  delete payload.expense_id

  return new Promise((resolve, reject) => {
    api
      .post('api.php', {
        add_expenses: payload,
      })
      .then((response) => {
        if (response.data.status == 'success') {
          fundsAndExpenses.value = response.data.data
          todayfundsAndExpensesTotal.value += payload.expense_total
          monthlyTotalExpense.value += payload.expense_total
          dailyTotal.value.forEach((item) => {
            let date = new Date(payload.date)
            if (item.day === date.getDate()) {
              item.total += payload.expense_total
            }
          })
          budgetAllocationData.value = budgetAllocationData.value.map((obj) => {
            if (obj.item_name === payload.expense_type) {
              obj.accumulated_expenses = Number(obj.accumulated_expenses) + payload.expense_total
            }
            return obj
          })

          console.log(budgetAllocationData.value)
        }
        resolve(response.data.status)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const updateExpenses = (payload, day) => {
  let copy = { ...payload }
  copy.expense_total = copy.expense_amount * copy.expense_qty
  return new Promise((resolve, reject) => {
    api
      .put('api.php', {
        update_expenses: copy,
      })
      .then((response) => {
        if (response.data.status == 'success') {
          fundsAndExpenses.value = fundsAndExpenses.value.map((obj) =>
            obj.expense_id === copy.expense_id ? copy : obj,
          )
          responseBackup.value = responseBackup.value.map((item) =>
            item.expense_id === copy.expense_id ? copy : item,
          )
          let dayObject = dailyTotal.value.find((obj) => obj.day === day)
          if (dayObject) {
            dayObject.total = copy.expense_total
          }
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
const updateRehomedPets = (payload) => {
  console.log(payload)
  return new Promise((resolve, reject) => {
    api
      .put('api.php', {
        update_rehomed_pets: payload,
      })
      .then((response) => {
        if (response.data.status == 'success') {
          allAnimalsAdopted.value = allAnimalsAdopted.value.map((obj) => {
            return obj.id === payload.id ? { ...payload } : obj
          })
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
const updateMedicine = (payload) => {
  console.log(payload)
  return new Promise((resolve, reject) => {
    api
      .put('api.php', {
        update_medicine: payload,
      })
      .then((response) => {
        if (response.data.status == 'success') {
          listOfMedicine.value = listOfMedicine.value.map((obj) => {
            return obj.medicine_id === payload.medicine_id ? { ...payload } : obj
          })
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
const updateVaccine = (payload) => {
  return new Promise((resolve, reject) => {
    api
      .put('api.php', {
        update_vaccine: payload,
      })
      .then((response) => {
        if (response.data.status == 'success') {
          listOfVaccine.value = listOfVaccine.value.map((obj) => {
            return obj.vaccine_id === payload.vaccine_id ? { ...payload } : obj
          })
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
const updateVitamin = (payload) => {
  return new Promise((resolve, reject) => {
    api
      .put('api.php', {
        update_vitamin: payload,
      })
      .then((response) => {
        if (response.data.status == 'success') {
          listOfVitamin.value = listOfVitamin.value.map((obj) => {
            return obj.vitamin_id === payload.vitamin_id ? { ...payload } : obj
          })
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
const updatePetFood = (payload) => {
  let copy = { ...payload }
  copy.food_range = JSON.stringify(copy.food_range)
  return new Promise((resolve, reject) => {
    api
      .put('api.php', {
        update_pet_food: copy,
      })
      .then((response) => {
        if (response.data.status == 'success') {
          foodInventory.value = foodInventory.value.map((obj) => {
            return obj.food_id === payload.food_id ? { ...copy } : obj
          })
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
const updateSpecificAnimal = (animalDetails, animalImage) => {
  console.log(animalDetails)
  return new Promise((resolve, reject) => {
    api
      .put('api.php', {
        update_specific_animal: 'update_specific_animal',
        animal_details: animalDetails,
        animal_image: animalImage,
      })
      .then((response) => {
        if (response.data.status == 'success') {
          allAnimalDataManagement.value = allAnimalDataManagement.value.map((obj) => {
            return obj.animal_id === animalDetails.animal_id ? { ...animalDetails } : obj
          })
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
const addNewAnimal = (animalDetails, animalImage) => {
  let animalImageObjects = animalImage.map((animal_image) => ({
    animal_image,
  }))

  return new Promise((resolve, reject) => {
    api
      .post('api.php', {
        add_new_animal: 'add_new_animal',
        animal_details: animalDetails,
        animal_image: animalImageObjects,
      })
      .then((response) => {
        console.log(response.data.data)
        if (response.data.status == 'success') {
          allAnimalDataManagement.value.push(response.data.data[0])
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
const addNewActivitiesAndEvents = (
  eventData,
  // activitiesAndEventsImages
) => {
  // ({ image: activitiesAndEvents.image } = activitiesAndEventsImages[0]);
  console.log(eventData)
  return new Promise((resolve, reject) => {
    api
      .post('api.php', {
        add_new_event: eventData,
        // event_details: activitiesAndEvents,
        // image: activitiesAndEventsImages,
      })
      .then((response) => {
        if (response.data.status == 'success') {
          activitiesAndEventsData.value.data.push(response.data.data[0])
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
const updateRescuedStrayAnimals = (payload) => {
  console.log(payload)
  return new Promise((resolve, reject) => {
    api
      .put('api.php', {
        update_rescued_stray_animals: payload,
      })
      .then((response) => {
        if (response.data.status == 'success') {
          allStrayAnimals.value = allStrayAnimals.value.map((obj) => {
            return obj.animal_id === payload.animal_id ? { ...payload } : obj
          })
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
const updateInKindDonation = (payload) => {
  console.log(payload)
  return new Promise((resolve, reject) => {
    api
      .put('api.php', {
        update_in_kind_donation: payload,
      })
      .then((response) => {
        if (response.data.status == 'success') {
          allInKindDonations.value = allInKindDonations.value.map((obj) => {
            return obj.donation_in_kind_id === payload.donation_in_kind_id ? { ...payload } : obj
          })
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
const updateCashWalkInDonation = (payload) => {
  console.log(payload)

  return new Promise((resolve, reject) => {
    api
      .put('api.php', {
        update_walk_in_donation: payload,
      })
      .then((response) => {
        console.log(response.data.data)
        if (response.data.status == 'success') {
          allDonations.value = allDonations.value.map((obj) => {
            return obj.donation_id === payload.donation_id ? { ...payload } : obj
          })
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
const updateSurrenderedAnimal = (payload) => {
  console.log(payload)

  return new Promise((resolve, reject) => {
    api
      .put('api.php', {
        update_surrendered_animal: payload,
      })
      .then((response) => {
        if (response.data.status == 'success') {
          allSurrenderedAnimals.value = allSurrenderedAnimals.value.map((obj) => {
            return obj.id === payload.id ? { ...payload } : obj
          })
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
const updateDeceasedAnimals = (payload) => {
  console.log(payload)
  return new Promise((resolve, reject) => {
    api
      .put('api.php', {
        update_deceased_animals: payload,
      })
      .then((response) => {
        if (response.data.status == 'success') {
          allAnimalsDeceased.value = allAnimalsDeceased.value.map((obj) => {
            return obj.animal_id === payload.animal_id ? { ...payload } : obj
          })
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
  // need to remove
}
const updateOfficialAccount = (payload) => {
  console.log(payload)
  return new Promise((resolve, reject) => {
    api
      .put('api.php', {
        update_official_account: payload,
      })
      .then((response) => {
        if (response.data.status == 'success') {
          allTaaraOfficialsInfo.value = allTaaraOfficialsInfo.value.map((obj) => {
            return obj.id === payload.id ? { ...payload } : obj
          })
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
const updateVolunteerAccount = (payload) => {
  console.log(payload)
  return new Promise((resolve, reject) => {
    api
      .put('api.php', {
        update_volunteer_account: payload,
      })
      .then((response) => {
        if (response.data.status == 'success') {
          allVolunteersInfo.value = allVolunteersInfo.value.map((obj) => {
            return obj.id === payload.id ? { ...payload } : obj
          })
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
const updateScheduleAnimal = (payload) => {
  console.log(payload)
  return new Promise((resolve, reject) => {
    api
      .put('api.php', {
        update_schedule_animal: payload,
      })
      .then((response) => {
        if (response.data.status == 'success') {
          if (payload.medication_or_check_up == 1) {
            AnimalScheduleDataMedication.value = AnimalScheduleDataMedication.value.map((obj) => {
              return obj.id === payload.id ? { ...payload } : obj
            })
          } else if (payload.medication_or_check_up == 2) {
            AnimalScheduleDataCheckUp.value = AnimalScheduleDataCheckUp.value.map((obj) => {
              return obj.id === payload.id ? { ...payload } : obj
            })
          }
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
const deleteScheduleAnimal = (payload) => {
  console.log(payload)
  return new Promise((resolve, reject) => {
    api
      .delete('api.php', {
        data: {
          delete_schedule_animal: payload.id,
        },
      })
      .then((response) => {
        if (response.data.status == 'success') {
          if (payload.medication_or_check_up == 1) {
            AnimalScheduleDataMedication.value = AnimalScheduleDataMedication.value.filter(
              (obj) => {
                return obj.id !== payload.id
              },
            )
          } else if (payload.medication_or_check_up == 2) {
            AnimalScheduleDataCheckUp.value = AnimalScheduleDataCheckUp.value.filter((obj) => {
              return obj.id !== payload.id
            })
          }
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
const deleteAnimal = (payload) => {
  console.log(payload)
  // return new Promise((resolve, reject) => {
  //   api
  //     .delete("api.php", {
  //       data: {
  //         delete_animal: payload,
  //       },
  //     })
  //     .then((response) => {
  //       if (response.data.status == "success") {
  //         console.log("success");
  //         allAnimalDataManagement.value = allAnimalDataManagement.value.filter(
  //           (obj) => {
  //             return !payload.includes(obj.animal_id);
  //           }
  //         );
  //       }
  //     })
  //     .catch((error) => {
  //       reject(error);
  //     });
  // });
}
const deleteRehomedPets = (payload, choices) => {
  return new Promise((resolve, reject) => {
    api
      .delete('api.php', {
        data: {
          delete_rehomed_pets: payload,
        },
      })
      .then((response) => {
        if (response.data.status == 'success') {
          allAnimalsAdopted.value = allAnimalsAdopted.value.filter((obj) => {
            return !payload.includes(obj.id)
          })

          allAnimalsNotAdopted.value = allAnimalsNotAdopted.value.concat(choices)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
const deleteMedicine = (payload) => {
  console.log(payload)
  return new Promise((resolve, reject) => {
    api
      .delete('api.php', {
        data: {
          delete_medicine: payload,
        },
      })
      .then((response) => {
        if (response.data.status == 'success') {
          listOfMedicine.value = listOfMedicine.value.filter((obj) => {
            return !payload.some((paramObj) => paramObj.medicine_id === obj.medicine_id)
          })
          // groupNameMedicine.value = groupNameMedicine.value.map((obj) => {
          //   payload.forEach((payloadObj) => {
          //     if (obj.group_name === payloadObj.group_name) {
          //       obj.no_of_medicine -= payloadObj.medicine_stocks_qty;
          //     }
          //   });
          //   return obj;
          // });
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
const deleteVaccine = (payload) => {
  console.log(payload)
  return new Promise((resolve, reject) => {
    api
      .delete('api.php', {
        data: {
          delete_vaccine: payload,
        },
      })
      .then((response) => {
        if (response.data.status == 'success') {
          listOfVaccine.value = listOfVaccine.value.filter((obj) => {
            return !payload.some((payloadObj) => payloadObj.vaccine_id === obj.vaccine_id)
          })
          // groupNameVaccine.value = groupNameVaccine.value.map((obj) => {
          //   payload.forEach((payloadObj) => {
          //         if (obj.group_name === payloadObj.group_name) {
          //           obj.no_of_vaccine -= payloadObj.vaccine_stocks_qty;
          //         }
          //       });
          //   return obj;
          // });
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
const deleteVitamin = (payload) => {
  console.log(payload)
  return new Promise((resolve, reject) => {
    api
      .delete('api.php', {
        data: {
          delete_vitamin: payload,
        },
      })
      .then((response) => {
        if (response.data.status == 'success') {
          listOfVitamin.value = listOfVitamin.value.filter((obj) => {
            return !payload.some((payloadObj) => payloadObj.vitamin_id === obj.vitamin_id)
          })
          groupNameVitamin.value = groupNameVitamin.value.map((obj) => {
            payload.forEach((payloadObj) => {
              if (obj.group_name === payloadObj.group_name) {
                obj.no_of_vitamin -= payloadObj.vitamin_stocks_qty
              }
            })
            return obj
          })
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
const deletePetFood = (payload) => {
  console.log(payload)
  return new Promise((resolve, reject) => {
    api
      .delete('api.php', {
        data: {
          delete_pet_food: payload,
        },
      })
      .then((response) => {
        if (response.data.status == 'success') {
          foodInventory.value = foodInventory.value.filter((obj) => {
            return !payload.includes(obj.food_id)
          })
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
const deleteRescuedStrayAnimal = (payload, choices) => {
  console.log(payload)
  console.log(choices)
  return new Promise((resolve, reject) => {
    api
      .delete('api.php', {
        data: {
          delete_rescued_stray_animals: payload,
        },
      })
      .then((response) => {
        if (response.data.status == 'success') {
          allStrayAnimals.value = allStrayAnimals.value.filter((obj) => {
            return !payload.includes(obj.id)
          })
          // allNotStrayAnimals.value.push({
          //   animal_id: payload.animal_id,
          //   animal_name: payload.animal_name,
          //   animal_image: payload.animal_image,
          // });

          allNotStrayAnimals.value = allNotStrayAnimals.value.concat(choices)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
const deleteSurrenderedAnimal = (payload, choices) => {
  console.log(payload)
  console.log(choices)
  return new Promise((resolve, reject) => {
    api
      .delete('api.php', {
        data: {
          delete_surrendered_animal: payload,
        },
      })
      .then((response) => {
        if (response.data.status == 'success') {
          allSurrenderedAnimals.value = allSurrenderedAnimals.value.filter((obj) => {
            return !payload.includes(obj.id)
          })
          // allNotSurrenderedAnimals.value.push({
          //   animal_id: payload.animal_id,
          //   animal_name: payload.animal_name,
          //   animal_image: payload.animal_image,
          // });
          allNotSurrenderedAnimals.value = allNotSurrenderedAnimals.value.concat(choices)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
const deleteInKindDonation = (payload) => {
  console.log(payload)
  return new Promise((resolve, reject) => {
    api
      .delete('api.php', {
        data: {
          delete_in_kind_donation: payload,
        },
      })
      .then((response) => {
        if (response.data.status == 'success') {
          allInKindDonations.value = allInKindDonations.value.filter((obj) => {
            return !payload.includes(obj.donation_in_kind_id)
          })
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
const deleteWalkInDonation = (payload) => {
  console.log(payload)
  return new Promise((resolve, reject) => {
    api
      .delete('api.php', {
        data: {
          delete_walk_in_donation: payload,
        },
      })
      .then((response) => {
        if (response.data.status == 'success') {
          allDonations.value = allDonations.value.filter((obj) => {
            return !payload.includes(obj.walk_in_id)
          })
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
const deleteDeceasedAnimal = (payload, choices) => {
  console.log(payload)
  console.log(choices)
  return new Promise((resolve, reject) => {
    api
      .delete('api.php', {
        data: {
          delete_deceased_animals: payload,
        },
      })
      .then((response) => {
        if (response.data.status == 'success') {
          allAnimalsDeceased.value = allAnimalsDeceased.value.filter((obj) => {
            return !payload.includes(obj.id)
          })
          // allAnimalsNotDeceased.value.push({
          //   animal_id: payload.animal_id,
          //   animal_name: payload.animal_name,
          //   animal_image: payload.animal_image,
          // });
          allAnimalsNotDeceased.value = allAnimalsNotDeceased.value.concat(choices)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
const deleteOfficialActivity = (payload) => {
  return new Promise((resolve, reject) => {
    api
      .delete('api.php', {
        data: {
          delete_official_activity: payload,
        },
      })
      .then((response) => {
        if (response.data.status == 'success') {
          systemActivityData.value = systemActivityData.value.filter((obj) => {
            return obj.id !== payload.id
          })
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
let exportMonthlyExpenses = (date) => {
  return new Promise((resolve, reject) => {
    api
      .get('api.php', {
        params: {
          export_monthly_expenses: 'export_monthly_expenses',
          month: date.selectedMonth.value,
          year: date.selectedYear,
        },
      })
      .then((response) => {
        console.log(response.data)
        var excelsheet = XLSX.utils.json_to_sheet(response.data.data)
        var wscols = [
          { wch: 15 },
          { wch: 15 },
          { wch: 15 },
          { wch: 15 },
          { wch: 20 },
          { wch: 15 },
          { wch: 15 },
        ]
        excelsheet['!cols'] = wscols
        var wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, excelsheet, 'Monthly Expenses')
        XLSX.writeFile(wb, 'MonthlyExpenses.xlsx')
      })
      .catch((error) => {
        reject(error)
      })
  })
}
let exportSpecificAnimal = (animal_id) => {
  return new Promise((resolve, reject) => {
    api
      .get('api.php', {
        params: {
          export_specific_animal: animal_id,
        },
      })
      .then((response) => {
        response.data.data.forEach((item) => {
          item.current_state = wordifyCurrentState(item.current_state)
        })
        var excelsheet = XLSX.utils.json_to_sheet(response.data.data)
        var wscols = [
          { wch: 10 },
          { wch: 15 },
          { wch: 20 },
          { wch: 15 },
          { wch: 25 },
          { wch: 20 },
          { wch: 20 },
          { wch: 25 },
          { wch: 20 },
          { wch: 20 },
          { wch: 15 },
          { wch: 20 },
          { wch: 15 },
          { wch: 45 },
          { wch: 40 },
          { wch: 40 },
          { wch: 35 },
          { wch: 60 },
          { wch: 20 },
        ]
        excelsheet['!cols'] = wscols

        var wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, excelsheet, response.data.data[0].animal_name)
        XLSX.writeFile(wb, response.data.data[0].animal_name + '.xlsx')
      })
      .catch((error) => {
        reject(error)
      })
  })
}
let exportRehomedPets = () => {
  return new Promise((resolve, reject) => {
    api
      .get('api.php', {
        params: {
          export_rehomed_pets: 'export_rehomed_pets',
        },
      })
      .then((response) => {
        // console.log(response.data.data);
        var excelsheet = XLSX.utils.json_to_sheet(response.data.data)
        var wscols = [
          { wch: 10 },
          { wch: 15 },
          { wch: 20 },
          { wch: 15 },
          { wch: 25 },
          { wch: 20 },
          { wch: 20 },
          { wch: 25 },
          { wch: 20 },
          { wch: 20 },
        ]
        excelsheet['!cols'] = wscols

        var wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, excelsheet, 'Rehomed pets')
        XLSX.writeFile(wb, 'Rehomed Pets.xlsx')
      })
      .catch((error) => {
        reject(error)
      })
  })
}
let exportWishlist = (tab) => {
  if (typeof tab === 'number') {
    if (tab == 0) {
      tab = 'medicine'
    } else if (tab == 1) {
      tab = 'food'
    } else {
      tab = 'supplies'
    }
  }
  tab = tab.charAt(0).toUpperCase() + tab.slice(1)
  return new Promise((resolve, reject) => {
    api
      .get('api.php', {
        params: {
          export_wishlist: tab,
        },
      })
      .then((response) => {
        var excelsheet = XLSX.utils.json_to_sheet(response.data.data)
        var wscols = [{ wch: 20 }, { wch: 50 }, { wch: 20 }]
        excelsheet['!cols'] = wscols

        var wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, excelsheet, tab + ' Wishlist')
        XLSX.writeFile(wb, tab + ' Wishlist.xlsx')
      })
      .catch((error) => {
        reject(error)
      })
  })
}
let exportPetsFoods = () => {
  return new Promise((resolve, reject) => {
    api
      .get('api.php', {
        params: {
          export_pets_foods: 'export_pets_foods',
        },
      })
      .then((response) => {
        var excelsheet = XLSX.utils.json_to_sheet(response.data.data)
        var wscols = [
          { wch: 10 },
          { wch: 30 },
          { wch: 15 },
          { wch: 15 },
          { wch: 15 },
          { wch: 25 },
          { wch: 20 },
        ]
        excelsheet['!cols'] = wscols

        var wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, excelsheet, 'List_of_pet_foods')
        XLSX.writeFile(wb, 'List_of_pet_foods.xlsx')
      })
      .catch((error) => {
        reject(error)
      })
  })
}
let exportMedicine = () => {
  return new Promise((resolve, reject) => {
    api
      .get('api.php', {
        params: {
          export_medicine: 'export_medicine',
        },
      })
      .then((response) => {
        var excelsheet = XLSX.utils.json_to_sheet(response.data.data)
        var wscols = [
          { wch: 10 },
          { wch: 30 },
          { wch: 15 },
          { wch: 15 },
          { wch: 15 },
          { wch: 25 },
          { wch: 20 },
        ]
        excelsheet['!cols'] = wscols

        var wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, excelsheet, 'List_of_medicines')
        XLSX.writeFile(wb, 'List_of_medicines.xlsx')
      })
      .catch((error) => {
        reject(error)
      })
  })
}
let exportVaccine = () => {
  return new Promise((resolve, reject) => {
    api
      .get('api.php', {
        params: {
          export_vaccine: 'export_vaccine',
        },
      })
      .then((response) => {
        var excelsheet = XLSX.utils.json_to_sheet(response.data.data)
        var wscols = [
          { wch: 10 },
          { wch: 30 },
          { wch: 15 },
          { wch: 15 },
          { wch: 15 },
          { wch: 25 },
          { wch: 20 },
        ]
        excelsheet['!cols'] = wscols

        var wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, excelsheet, 'List_of_vaccines')
        XLSX.writeFile(wb, 'List_of_vaccines.xlsx')
      })
      .catch((error) => {
        reject(error)
      })
  })
}
let exportVitamin = () => {
  return new Promise((resolve, reject) => {
    api
      .get('api.php', {
        params: {
          export_vitamin: 'export_vitamin',
        },
      })
      .then((response) => {
        var excelsheet = XLSX.utils.json_to_sheet(response.data.data)
        var wscols = [
          { wch: 10 },
          { wch: 30 },
          { wch: 15 },
          { wch: 15 },
          { wch: 15 },
          { wch: 25 },
          { wch: 20 },
        ]
        excelsheet['!cols'] = wscols

        var wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, excelsheet, 'List_of_vitamins')
        XLSX.writeFile(wb, 'List_of_vitamins.xlsx')
      })
      .catch((error) => {
        reject(error)
      })
  })
}
let exportRescuedStrayAnimals = () => {
  return new Promise((resolve, reject) => {
    api
      .get('api.php', {
        params: {
          export_rescued_stray_animals: 'export_rescued_stray_animals',
        },
      })
      .then((response) => {
        // console.log(response.data.data);
        var excelsheet = XLSX.utils.json_to_sheet(response.data.data)
        var wscols = [
          { wch: 15 },
          { wch: 15 },
          { wch: 15 },
          { wch: 20 },
          { wch: 20 },
          { wch: 20 },
          { wch: 25 },
          { wch: 15 },
          { wch: 15 },
        ]
        excelsheet['!cols'] = wscols

        var wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, excelsheet, 'Rescued Strays')
        XLSX.writeFile(wb, 'Rescued Strays.xlsx')
      })
      .catch((error) => {
        reject(error)
      })
  })
}
let exportSurrenderedAnimals = () => {
  return new Promise((resolve, reject) => {
    api
      .get('api.php', {
        params: {
          export_surrendered_animals: 'export_surrendered_animals',
        },
      })
      .then((response) => {
        response.data.data.forEach((item) => {
          item.surrenderer_sex = wordifySex(item.surrenderer_sex)
        })
        var excelsheet = XLSX.utils.json_to_sheet(response.data.data)
        var wscols = [
          { wch: 10 },
          { wch: 15 },
          { wch: 20 },
          { wch: 30 },
          { wch: 25 },
          { wch: 20 },
          { wch: 30 },
          { wch: 20 },
          { wch: 20 },
        ]
        excelsheet['!cols'] = wscols

        var wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, excelsheet, 'Surrendered Animals')
        XLSX.writeFile(wb, 'Surrendered Animals.xlsx')
      })
      .catch((error) => {
        reject(error)
      })
  })
}
let exportInKindDonations = () => {
  return new Promise((resolve, reject) => {
    api
      .get('api.php', {
        params: {
          export_in_kind_donations: 'export_in_kind_donations',
        },
      })
      .then((response) => {
        console.log(response.data.data)
        var excelsheet = XLSX.utils.json_to_sheet(response.data.data)
        var wscols = [
          { wch: 15 },
          { wch: 30 },
          { wch: 25 },
          { wch: 10 },
          { wch: 10 },
          { wch: 50 },
          { wch: 15 },
          { wch: 15 },
          { wch: 15 },
        ]
        excelsheet['!cols'] = wscols

        var wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, excelsheet, 'In_kind_Donations')
        XLSX.writeFile(wb, 'In_kind_Donations.xlsx')
      })
      .catch((error) => {
        reject(error)
      })
  })
}
let exportDonationTracker = () => {
  return new Promise((resolve, reject) => {
    api
      .get('api.php', {
        params: {
          export_donation_tracker: 'export_donation_tracker',
        },
      })
      .then((response) => {
        var excelsheet = XLSX.utils.json_to_sheet(response.data.data)
        var wscols = [
          { wch: 10 },
          { wch: 25 },
          { wch: 15 },
          { wch: 60 },
          { wch: 15 },
          { wch: 15 },
          { wch: 15 },
        ]
        excelsheet['!cols'] = wscols

        var wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, excelsheet, 'Donation_Tracker')
        XLSX.writeFile(wb, 'Donation_Tracker.xlsx')
      })
      .catch((error) => {
        reject(error)
      })
  })
}
let exportDeceasedAnimals = () => {
  return new Promise((resolve, reject) => {
    api
      .get('api.php', {
        params: {
          export_deceased_animals: 'export_deceased_animals',
        },
      })
      .then((response) => {
        response.data.data.forEach((item) => {
          item.age = calculateAge(item.age)
        })
        var excelsheet = XLSX.utils.json_to_sheet(response.data.data)
        var wscols = [
          { wch: 10 },
          { wch: 10 },
          { wch: 15 },
          { wch: 15 },
          { wch: 10 },
          { wch: 10 },
          { wch: 10 },
          { wch: 15 },
          { wch: 15 },
        ]
        excelsheet['!cols'] = wscols

        var wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, excelsheet, 'Deceased Animals')
        XLSX.writeFile(wb, 'Deceased Animals.xlsx')
      })
      .catch((error) => {
        reject(error)
      })
  })
}
let allTaaraOfficialsInfo = ref()
let originalAllTaaraOfficialsInfo = ref()
const allTaaraOfficials = (ary) => {
  let param = false
  if (ary.length > 0) {
    param = true
  } else {
    param = false
  }
  return new Promise((resolve, reject) => {
    api
      .get('api.php', {
        params: { all_taara_officials_info: param ? ary : null },
      })
      .then((response) => {
        originalAllTaaraOfficialsInfo.value = response.data.data
        allTaaraOfficialsInfo.value = response.data.data
        console.log(allTaaraOfficialsInfo.value)
        if (param == false) {
          allTaaraOfficialsInfo.value.forEach((item) => {
            item.system_privilege = JSON.parse(item.system_privilege)
          })
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
const grantPrivilege = (obj) => {
  return new Promise((resolve, reject) => {
    api
      .put('api.php', {
        grant_privilege: obj,
      })
      .then(() => {})
      .catch((error) => {
        reject(error)
      })
  })
}
const activateAccount = (obj) => {
  obj.activated = obj.activated == 1 ? 0 : 1
  return new Promise((resolve, reject) => {
    api
      .put('api.php', {
        account_activate: obj,
      })
      .then((response) => {
        // if (response.data.status == "success") {
        //   let findObj = allTaaraOfficialsInfo.value.find(
        //     (item) => item.id === obj.id
        //   );
        //   if (findObj) {
        //     obj.activated = obj.activated;
        //   }
        // }
        resolve({ status: response.data.status, activated: obj.activated })
      })
      .catch((error) => {
        reject(error)
      })
  })
}

let originalAllVolunteersInfo = ref()
let allVolunteersInfo = ref()
const allVolunteers = (ary) => {
  let param = false
  if (ary.length > 0) {
    param = true
  } else {
    param = false
  }
  return new Promise((resolve, reject) => {
    api
      .get('api.php', {
        params: { all_volunteers_info: param ? ary : null },
      })
      .then((response) => {
        originalAllVolunteersInfo.value = response.data.data
        allVolunteersInfo.value = response.data.data
        console.log(allVolunteersInfo.value)
        if (param == false) {
          allVolunteersInfo.value.forEach((item) => {
            item.system_privilege = JSON.parse(item.system_privilege)
          })
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}

let allAnimalsNotAdopted = ref([])
const getAllAnimalsNotAdopted = () => {
  return new Promise((resolve, reject) => {
    api
      .get('api.php', { params: { get_all_animals_not_adopted: 'yes' } })
      .then((response) => {
        console.log(response.data.data)
        allAnimalsNotAdopted.value = response.data.data
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const getWishlistMedicine = () => {
  return new Promise((resolve, reject) => {
    api
      .get('api.php', { params: { get_wishlist_medicine: 'yes' } })
      .then((response) => {
        resolve(response.data.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const getWishlistFood = () => {
  return new Promise((resolve, reject) => {
    api
      .get('api.php', { params: { get_wishlist_food: 'yes' } })
      .then((response) => {
        resolve(response.data.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const getWishlistSupplies = () => {
  return new Promise((resolve, reject) => {
    api
      .get('api.php', { params: { get_wishlist_supplies: 'yes' } })
      .then((response) => {
        resolve(response.data.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
// const updateWishlist = (payload, name, change) => {
//   return new Promise((resolve, reject) => {
//     api
//       .put('api.php', {
//         update_wishlist: payload,
//         name: name,
//         change: change,
//       })
//       .then((response) => {
//         if (response.data.status == 'success' && response.data.method == 'DELETE') {
//           if (response.data.deleted_wishlist == 'medicine') {
//             wishlistMedicineData.value = wishlistMedicineData.value.filter((obj) => {
//               return obj.wishlist_medicine_id !== payload.wishlist_medicine_id
//             })
//           } else if (response.data.deleted_wishlist == 'food') {
//             wishlistFoodData.value = wishlistFoodData.value.filter((obj) => {
//               return obj.wishlist_food_id !== payload.wishlist_food_id
//             })
//           } else if (response.data.deleted_wishlist == 'supplies') {
//             wishlistSuppliesData.value = wishlistSuppliesData.value.filter((obj) => {
//               return obj.wishlist_supplies_id !== payload.wishlist_supplies_id
//             })
//           }
//         } else if (response.data.status == 'success' && response.data.method == 'PUT') {
//           if (name == 'medicine') {
//             wishlistMedicineData.value = wishlistMedicineData.value.map((obj) =>
//               obj.wishlist_medicine_id === payload.wishlist_medicine_id ? payload : obj,
//             )
//           } else if (name == 'food') {
//             wishlistFoodData.value = wishlistFoodData.value.map((obj) =>
//               obj.wishlist_food_id === payload.wishlist_food_id ? payload : obj,
//             )
//           } else if (name == 'supplies') {
//             wishlistSuppliesData.value = wishlistSuppliesData.value.map((obj) =>
//               obj.wishlist_supplies_id === payload.wishlist_supplies_id ? payload : obj,
//             )
//           }
//         }
//       })
//       .catch((error) => {
//         reject(error)
//       })
//   })
// }
const addWishlist = (payload, name) => {
  console.log(payload)
  console.log(name)
  return new Promise((resolve, reject) => {
    api
      .post('api.php', { add_wishlist: payload, name: name })
      .then((response) => {
        if (response.data.status == 'success') {
          if (name == 'medicine') {
            // wishlistMedicineData.value.push(response.data.data)
          } else if (name == 'food') {
            // wishlistFoodData.value.push(response.data.data)
          } else {
            // wishlistSuppliesData.value.push(response.data.data)
          }
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
const addOrganizationAccount = (payload, addTo) => {
  payload.system_privilege = JSON.stringify(payload.system_privilege)
  return new Promise((resolve, reject) => {
    api
      .post('api.php', { add_account: payload, addTo: addTo })
      .then((response) => {
        if (response.data.status == 'success') {
          response.data.data.forEach((item) => {
            item.system_privilege = JSON.parse(item.system_privilege)
          })
          if (addTo == 'Official') {
            allTaaraOfficialsInfo.value.push(response.data.data)
          } else if (addTo == 'Volunteer') {
            allVolunteersInfo.value.push(response.data.data)
          }
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
let allAnimalsAdopted = ref([])
const getAllAnimalsAdopted = () => {
  return new Promise((resolve, reject) => {
    api
      .get('api.php', {
        params: { getAllAnimalsAdopted: 'getAllAnimalsAdopted' },
      })
      .then((response) => {
        originalDatadopted.value = response.data.data
        allAnimalsAdopted.value = response.data.data
        console.log(response.data.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
let animalsAdopted = ref([])
const getAnimalsAdopted = (date) => {
  return new Promise((resolve, reject) => {
    api
      .get('api.php', {
        params: {
          get_animals_adopted: 'get_animals_adopted',
          month: date.month.value,
          year: date.year,
        },
      })
      .then((response) => {
        animalsAdopted.value = response.data.data
        resolve(animalsAdopted.value)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
const getMonthDonation = (month, year) => {
  return new Promise((resolve, reject) => {
    api
      .get('api.php', {
        params: {
          get_month_donation: 'get_month_donation',
          month: month,
          year: year,
        },
      })
      .then((response) => {
        if (response.data.status == 'success') {
          resolve(response.data.data)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
let listOfMedicine = ref([])
let originalListOfMedicine = ref([])
let computerListOfMedicine = ref([])
const getListOfMedicine = () => {
  return new Promise((resolve, reject) => {
    api
      .get('api.php', {
        params: { get_list_of_medicine: 'get_list_of_medicine' },
      })
      .then((response) => {
        originalListOfMedicine.value = response.data.data
        listOfMedicine.value = response.data.data
        let result = response.data.data.reduce((acc, obj) => {
          let key = obj.group_name
          if (!acc[key]) {
            acc[key] = { group_name: obj.group_name, medicine_stocks_qty: 0 } // if the group_name is not yet in the accumulator, add it
          }
          acc[key].medicine_stocks_qty += obj.medicine_stocks_qty // add the qty_stock to the existing group_name
          return acc
        }, {})

        // Convert the result object back into an array
        computerListOfMedicine.value = Object.values(result)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
const resolveExpiredMedicine = (payload) => {
  console.log(payload)
  return new Promise((resolve, reject) => {
    api
      .delete('api.php', {
        data: {
          resolveMedicine: payload,
        },
      })
      .then((response) => {
        if (response.data.status == 'success')
          originalListOfMedicine.value = listOfMedicine.value.filter((obj) => {
            return obj.expiry_date > payload
          })
        listOfMedicine.value = originalListOfMedicine.value
      })
      .catch((error) => {
        reject(error)
      })
  })
}

let originalListOfVaccine = ref([])
let listOfVaccine = ref([])
const getListOfVaccine = () => {
  return new Promise((resolve, reject) => {
    api
      .get('api.php', {
        params: { get_list_of_vaccine: 'get_list_of_vaccine' },
      })
      .then((response) => {
        originalListOfVaccine.value = response.data.data
        listOfVaccine.value = response.data.data
      })
      .catch((error) => {
        reject(error)
      })
  })
}
const resolveExpiredVaccine = (payload) => {
  console.log(payload)
  return new Promise((resolve, reject) => {
    api
      .delete('api.php', {
        data: {
          resolveVaccine: payload,
        },
      })
      .then((response) => {
        if (response.data.status == 'success')
          originalListOfVaccine.value = listOfVaccine.value.filter((obj) => {
            return obj.expiry_date > payload
          })
        listOfVaccine.value = originalListOfVaccine.value
      })
      .catch((error) => {
        reject(error)
      })
  })
}

let originalListOfVitamin = ref([])
let listOfVitamin = ref([])
const getListOfVitamin = () => {
  return new Promise((resolve, reject) => {
    api
      .get('api.php', {
        params: { get_list_of_vitamin: 'get_list_of_vitamin' },
      })
      .then((response) => {
        originalListOfVitamin.value = response.data.data
        listOfVitamin.value = response.data.data
      })
      .catch((error) => {
        reject(error)
      })
  })
}
const resolveExpiredVitamin = (payload) => {
  console.log(payload)
  return new Promise((resolve, reject) => {
    api
      .delete('api.php', {
        data: {
          resolveVitamin: payload,
        },
      })
      .then((response) => {
        if (response.data.status == 'success')
          originalListOfVitamin.value = listOfVitamin.value.filter((obj) => {
            return obj.expiry_date > payload
          })
        listOfVitamin.value = originalListOfVitamin.value
      })
      .catch((error) => {
        reject(error)
      })
  })
}
let groupNameMedicine = ref([])
let originalGroupNameMedicine = ref([])
const getGroupName = () => {
  return new Promise((resolve, reject) => {
    api
      .get('api.php', {
        params: { get_group_name: 'get_group_name' },
      })
      .then((response) => {
        originalGroupNameMedicine.value = response.data.data
        groupNameMedicine.value = response.data.data
      })
      .catch((error) => {
        reject(error)
      })
  })
}
let groupNameVaccine = ref([])
let originalGroupNameVaccine = ref([])
const getGroupNameVaccine = () => {
  return new Promise((resolve, reject) => {
    api
      .get('api.php', {
        params: { get_group_name_vaccine: 'get_group_name_vaccine' },
      })
      .then((response) => {
        originalGroupNameVaccine.value = response.data.data
        groupNameVaccine.value = response.data.data
      })
      .catch((error) => {
        reject(error)
      })
  })
}
let groupNameVitamin = ref([])
let originalGroupListOfVaccine = ref([])
const getGroupNameVitamin = () => {
  return new Promise((resolve, reject) => {
    api
      .get('api.php', {
        params: { get_group_name_vitamin: 'get_group_name_vitamin' },
      })
      .then((response) => {
        groupNameVitamin.value = response.data.data
        originalGroupListOfVaccine.value = response.data.data
      })
      .catch((error) => {
        reject(error)
      })
  })
}
let foodInventory = ref([])
const getFoodInventory = () => {
  return new Promise((resolve, reject) => {
    api
      .get('api.php', {
        params: { get_food_inventory: 'get_food_inventory' },
      })
      .then((response) => {
        originalFoodInventory.value = response.data.data
        foodInventory.value = response.data.data
        resolve(foodInventory.value)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
let allStrayAnimals = ref([])
const getAllAnimalsStray = () => {
  return new Promise((resolve, reject) => {
    api
      .get('api.php', {
        params: { get_all_animal_stray: 'get_all_animal_stray' },
      })
      .then((response) => {
        response.data.data.forEach((item) => {
          item.reporter_sex = wordifySex(item.reporter_sex)
          // item.reporter_birth_date = calculateAge(item.reporter_birth_date);
        })
        originalDataRescuedStray.value = response.data.data

        allStrayAnimals.value = response.data.data
        console.log(allStrayAnimals.value)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
let allRescuedAnimal = ref([])
const getRescuedAnimal = (date) => {
  console.log(date)
  return new Promise((resolve, reject) => {
    api
      .get('api.php', {
        params: {
          get_rescued_animal: 'get_rescued_animal',
          month: date.month.value,
          year: date.year,
        },
      })
      .then((response) => {
        if (response.data.status == 'success') {
          allRescuedAnimal.value = response.data.data
          console.log(allRescuedAnimal.value)
          resolve(allRescuedAnimal.value)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
let monthlyRescuedAnimal = ref([])
const getMonthlyRescuedAnimal = (date) => {
  console.log(date)
  return new Promise((resolve, reject) => {
    api
      .get('api.php', {
        params: {
          get_monthly_rescued_animal: date,
        },
      })
      .then((response) => {
        if (response.data.status == 'success') {
          monthlyRescuedAnimal.value = response.data.data

          resolve(monthlyRescuedAnimal.value)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
let monthlyAdoption = ref([])
const getMonthlyAdoption = (date) => {
  console.log(date)
  return new Promise((resolve, reject) => {
    api
      .get('api.php', {
        params: {
          get_monthly_adoption: date,
        },
      })
      .then((response) => {
        if (response.data.status == 'success') {
          monthlyAdoption.value = response.data.data
          resolve(monthlyAdoption.value)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
let AnimalScheduleData = ref([])
let AnimalScheduleDataMedication = ref([])
let AnimalScheduleDataCheckUp = ref([])
const getAnimalSchedule = (payload) => {
  console.log(payload)
  return new Promise((resolve, reject) => {
    api
      .get('api.php', {
        params: { get_animal_schedule: payload },
      })
      .then((response) => {
        console.log(response.data.data)
        AnimalScheduleDataMedication.value = response.data.data.filter(
          (item) => item.medication_or_check_up === 1,
        )
        console.log(AnimalScheduleDataMedication.value)
        AnimalScheduleDataCheckUp.value = response.data.data.filter(
          (item) => item.medication_or_check_up === 2,
        )
      })
      .catch((error) => {
        reject(error)
      })
  })
}

let allNotStrayAnimals = ref([])
const getAllAnimalsNotStray = () => {
  return new Promise((resolve, reject) => {
    api
      .get('api.php', {
        params: { get_all_animal_not_stray: 'get_all_animal_not_stray' },
      })
      .then((response) => {
        allNotStrayAnimals.value = response.data.data
        console.log(allNotStrayAnimals.value)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

let budgetAllocationData = ref([])
let originalBudgetAllocationData = ref([])
const getBudgetAllocation = (date) => {
  console.log(date)
  return new Promise((resolve, reject) => {
    api
      .get('api.php', {
        params: {
          budget_allocation_data: 'budget_allocation_data',
          month: date.month.value,
          year: date.year,
        },
      })
      .then((response) => {
        budgetAllocationData.value = response.data.data
        originalBudgetAllocationData.value = { ...response.data.data }
        console.log(budgetAllocationData.value)
        resolve(budgetAllocationData.value)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
// const getBudgetAllocation = (date, text) => {
//   console.log(date);
//   let month, year;
//   if (text == "budget_allocation") {
//     let isArray = Array.isArray(date.year);
//     if (isArray) {
//       year = date.year[0];
//     } else {
//       year = date.year;
//     }
//     month = date.month.value;
//   } else if (text == "funds_expenses") {
//     month = date.month.value;
//     year = date.year;
//   } else {
//     month = date.month;
//     year = date.year;
//   }

//   return new Promise((resolve, reject) => {
//     api
//       .get("api.php", {
//         params: {
//           budget_allocation_data: "budget_allocation_data",
//           month: month,
//           year: year,
//         },
//       })
//       .then((response) => {
//         budgetAllocationData.value = response.data.data;
//         originalBudgetAllocationData.value = { ...response.data.data };
//         resolve(budgetAllocationData.value);
//       })
//       .catch((error) => {
//         reject(error);
//       });
//   });
// };
const addBudgetAllocation = (payload) => {
  return new Promise((resolve, reject) => {
    api
      .post('api.php', { add_budget_allocation: payload })
      .then((response) => {
        if (response.data.status == 'success') {
          console.log(...response.data.data)
          budgetAllocationData.value.push(...response.data.data)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
// add record rehomed pets
const updateBudgetAllocation = (payload) => {
  return new Promise((resolve, reject) => {
    api
      .put('api.php', { update_budget_allocation: payload })
      .then((response) => {
        if (response.data.status == 'success') {
          budgetAllocationData.value = response.data.data
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
const OfficialAuthorization = (payload) => {
  let getObj = {
    id: payload.id,
    email_address: payload.email_address,
    password: payload.password,
    system_privilege: JSON.stringify(payload.system_privilege),
  }
  return new Promise((resolve, reject) => {
    api
      .put('api.php', { official_authorization: getObj })
      .then((response) => {
        if (response.data.status == 'success') {
          allTaaraOfficialsInfo.value = allTaaraOfficialsInfo.value.map((obj) => {
            return obj.id === payload.id ? { ...payload } : obj
          })
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const addRehomedPets = (payload) => {
  console.log(payload)
  return new Promise((resolve, reject) => {
    api
      .put('api.php', { add_rehomed_pets: payload })
      .then((response) => {
        if (response.data.status == 'success') {
          console.log(response.data.data)
          allAnimalsAdopted.value.push(response.data.data[0])
          allAnimalsNotAdopted.value = allAnimalsNotAdopted.value.filter((obj) => {
            return obj.animal_id !== payload.animal_id
          })
          // items.value.push(response.data.notif_data);
          // need to show real time in notification
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
const addMedicine = (payload) => {
  delete payload.medicine_id
  return new Promise((resolve, reject) => {
    api
      .post('api.php', { add_medicine: payload })
      .then((response) => {
        if (response.data.status == 'success') {
          listOfMedicine.value.push(response.data.data)
          groupNameMedicine.value = groupNameMedicine.value.map((obj) => {
            if (obj.group_name === payload.group_name) {
              obj.no_of_medicine += payload.medicine_stocks_qty
            }
            return obj
          })
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
const addVitamin = (payload) => {
  delete payload.vitamin_id
  return new Promise((resolve, reject) => {
    api
      .post('api.php', { add_vitamin: payload })
      .then((response) => {
        if (response.data.status == 'success') {
          listOfVitamin.value.push(response.data.data)
          groupNameVitamin.value = groupNameVitamin.value.map((obj) => {
            if (obj.group_name === payload.group_name) {
              obj.no_of_vitamin += payload.vitamin_stocks_qty
            }
            return obj
          })
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
const addVaccine = (payload) => {
  delete payload.vaccine_id
  return new Promise((resolve, reject) => {
    api
      .post('api.php', { add_vaccine: payload })
      .then((response) => {
        if (response.data.status == 'success') {
          listOfVaccine.value.push(response.data.data)
          groupNameVaccine.value = groupNameVaccine.value.map((obj) => {
            if (obj.group_name === payload.group_name) {
              obj.no_of_vaccine += payload.vaccine_stocks_qty
            }
            return obj
          })
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
const addMedicineGroupName = (payload) => {
  delete payload.group_id
  return new Promise((resolve, reject) => {
    api
      .post('api.php', { add_medicine_group_name: payload })
      .then((response) => {
        if (response.data.status == 'success') {
          groupNameMedicine.value.push(response.data.data)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
const addVaccineGroupName = (payload) => {
  delete payload.group_id
  return new Promise((resolve, reject) => {
    api
      .post('api.php', { add_vaccine_group_name: payload })
      .then((response) => {
        if (response.data.status == 'success') {
          groupNameVaccine.value.push(response.data.data)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
const addVitaminGroupName = (payload) => {
  delete payload.group_id
  return new Promise((resolve, reject) => {
    api
      .post('api.php', { add_vitamin_group_name: payload })
      .then((response) => {
        if (response.data.status == 'success') {
          groupNameVitamin.value.push(response.data.data)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
const addPetFood = (payload) => {
  let copy = { ...payload }
  copy.food_range = JSON.stringify(payload.food_range)
  return new Promise((resolve, reject) => {
    api
      .post('api.php', { add_pets_food: copy })
      .then((response) => {
        if (response.data.status == 'success') {
          foodInventory.value.push(response.data.data)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
const addRescuedStrayAnimals = (payload) => {
  console.log(payload)
  return new Promise((resolve, reject) => {
    api
      .post('api.php', { add_rescued_stray_animals: payload })
      .then((response) => {
        if (response.data.status == 'success') {
          allStrayAnimals.value.push(response.data.data[0])
          console.log(response.data.data[0])
          allNotStrayAnimals.value = allNotStrayAnimals.value.filter((obj) => {
            return obj.animal_id !== payload.animal_id
          })
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
const addInKindDonation = (payload) => {
  console.log(payload)
  return new Promise((resolve, reject) => {
    api
      .post('api.php', { add_in_kind_donation: payload })
      .then((response) => {
        allInKindDonations.value.push(response.data.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
const addNewScheduleMedicationOrCheckUp = (payload) => {
  console.log(payload)
  return new Promise((resolve, reject) => {
    api
      .post('api.php', { add_new_schedule_medication: payload })
      .then((response) => {
        if (payload.medication_or_check_up == 1) {
          AnimalScheduleDataMedication.value.push(response.data.data)
        } else if (payload.medication_or_check_up == 2) {
          AnimalScheduleDataCheckUp.value.push(response.data.data)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
const addSurrenderAnimal = (payload) => {
  console.log(payload)
  return new Promise((resolve, reject) => {
    api
      .post('api.php', {
        add_surrendered_animal: payload,
      })
      .then((response) => {
        if (response.data.status == 'success') {
          response.data.data[0].surrenderer_sex = wordifySex(response.data.data[0].surrenderer_sex)

          allSurrenderedAnimals.value.push(response.data.data[0])
          allNotSurrenderedAnimals.value = allNotSurrenderedAnimals.value.filter((obj) => {
            return obj.animal_id !== payload.animal_id
          })
          // items.value.push(response.data.notif_data);
          // need to show real time in notification
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
const addWalkIn = (payload) => {
  console.log(payload)
  return new Promise((resolve, reject) => {
    api
      .post('api.php', {
        add_walk_in_donation: payload,
      })
      .then((response) => {
        console.log(response.data.data)
        allDonations.value.push(response.data.data[0])
        // need realtime notification for management
        //backend not applied
      })
      .catch((error) => {
        reject(error)
      })
  })
}
const submitPublicDonation = (payload) => {
  console.log(payload)
  // return new Promise((resolve, reject) => {
  //   api
  //     .post("api.php", {
  //       submit_public_donation: payload,
  //     })
  //     .then((response) => {
  //       console.log(response.data.status);
  //     })
  //     .catch((error) => {
  //       reject(error);
  //     });
  // });
}
const addDeceasedAnimals = (payload) => {
  console.log(payload)
  return new Promise((resolve, reject) => {
    api
      .post('api.php', { add_deceased_animals: payload })
      .then((response) => {
        if (response.data.status == 'success') {
          allAnimalsDeceased.value.push(response.data.data[0])

          allAnimalsNotDeceased.value = allAnimalsNotDeceased.value.filter((obj) => {
            return obj.animal_id !== payload.animal_id
          })
          // items.value.push(response.data.notif_data);
          // need to show real time in notification
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
const eventBasicSearch = (searchValue, futurePast) => {
  let exactMatches = []
  let partialMatches = []
  activitiesAndEventsData.value = activitiesAndEventsDataOriginalData.value
  const now = new Date()
  if (futurePast == true) {
    activitiesAndEventsData.value = activitiesAndEventsData.value.filter(
      (obj) => new Date(obj.event_date + ' ' + obj.event_time) >= now,
    )
  } else if (futurePast == false) {
    activitiesAndEventsData.value = activitiesAndEventsData.value.filter(
      (obj) => new Date(obj.event_date + ' ' + obj.event_time) < now,
    )
  }
  if (searchValue != null) {
    activitiesAndEventsData.value.forEach((obj) => {
      if (
        Object.values(obj).some(
          (val) =>
            val &&
            val.toString().trim() !== '' &&
            val.toString().toLowerCase() === searchValue.toLowerCase(),
        )
      ) {
        exactMatches.push(obj)
      } else if (
        Object.values(obj).some(
          (val) =>
            val &&
            val.toString().trim() !== '' &&
            val.toString().toLowerCase().includes(searchValue.toLowerCase()),
        )
      ) {
        partialMatches.push(obj)
      }
    })
    activitiesAndEventsData.value = exactMatches.length > 0 ? exactMatches : partialMatches
  }
}
const manageRecordBasicSearch = (searchValue, based) => {
  const dataMap = {
    1: { data: allAnimalsAdopted, original: originalDatadopted },
    2: { data: allStrayAnimals, original: originalDataRescuedStray },
    3: { data: allAnimalsDeceased, original: originalDataDeceased },
    4: { data: allSurrenderedAnimals, original: originalDataSurrendered },
    5: { data: allInKindDonations, original: originalDataallInKind },
    6: { data: allDonations, original: originalDataDonationTracker },
  }

  let exactMatches = []
  let partialMatches = []

  if (dataMap[based]) {
    dataMap[based].data.value = dataMap[based].original.value
    let copy = dataMap[based].data.value

    copy.forEach((obj) => {
      if (
        Object.values(obj).some(
          (val) =>
            val &&
            val.toString().trim() !== '' &&
            val.toString().toLowerCase() === searchValue.toLowerCase(),
        )
      ) {
        exactMatches.push(obj)
      } else if (
        Object.values(obj).some(
          (val) =>
            val &&
            val.toString().trim() !== '' &&
            val.toString().toLowerCase().includes(searchValue.toLowerCase()),
        )
      ) {
        partialMatches.push(obj)
      }
    })

    dataMap[based].data.value = exactMatches.length > 0 ? exactMatches : partialMatches
  }
}
const rehomedBasicSearch = (searchValue) => {
  let exactMatches = []
  let partialMatches = []
  allAnimalsAdopted.value = originalDatadopted.value
  allAnimalsAdopted.value.forEach((obj) => {
    if (
      Object.values(obj).some(
        (val) =>
          val &&
          val.toString().trim() !== '' &&
          val.toString().toLowerCase() === searchValue.toLowerCase(),
      )
    ) {
      exactMatches.push(obj)
    } else if (
      Object.values(obj).some(
        (val) =>
          val &&
          val.toString().trim() !== '' &&
          val.toString().toLowerCase().includes(searchValue.toLowerCase()),
      )
    ) {
      partialMatches.push(obj)
    }
  })

  allAnimalsAdopted.value = exactMatches.length > 0 ? exactMatches : partialMatches
}
// const wishlistBasicSearch = (searchValue, tab) => {
//   if (typeof tab === 'number') {
//     if (tab == 0) {
//       tab = 'medicine'
//     } else if (tab == 1) {
//       tab = 'food'
//     } else {
//       tab = 'supplies'
//     }
//   }
//   let exactMatches = []
//   let partialMatches = []
//   let copy = []
//   if (tab == 'medicine') {
//     wishlistMedicineData.value = originalWishlistMedicineData.value
//     copy = wishlistMedicineData.value
//   } else if (tab == 'food') {
//     wishlistFoodData.value = originalWishlistFoodData.value
//     copy = wishlistFoodData.value
//   } else {
//     wishlistSuppliesData.value = originalWishlistSuppliesData.value
//     copy = wishlistSuppliesData.value
//   }
//   copy.forEach((obj) => {
//     if (
//       Object.values(obj).some(
//         (val) =>
//           val &&
//           val.toString().trim() !== '' &&
//           val.toString().toLowerCase() === searchValue.toLowerCase(),
//       )
//     ) {
//       exactMatches.push(obj)
//     } else if (
//       Object.values(obj).some(
//         (val) =>
//           val &&
//           val.toString().trim() !== '' &&
//           val.toString().toLowerCase().includes(searchValue.toLowerCase()),
//       )
//     ) {
//       partialMatches.push(obj)
//     }
//   })
//   if (tab == 'medicine') {
//     wishlistMedicineData.value = exactMatches.length > 0 ? exactMatches : partialMatches
//   } else if (tab == 'food') {
//     wishlistFoodData.value = exactMatches.length > 0 ? exactMatches : partialMatches
//   } else {
//     wishlistSuppliesData.value = exactMatches.length > 0 ? exactMatches : partialMatches
//   }
// }
const fundsAndExpensesBasicSearch = (searchValue) => {
  let exactMatches = []
  let partialMatches = []
  fundsAndExpenses.value = originalDatafundsAndExpenses.value
  fundsAndExpenses.value.forEach((obj) => {
    if (
      Object.values(obj).some(
        (val) =>
          val &&
          val.toString().trim() !== '' &&
          val.toString().toLowerCase() === searchValue.toLowerCase(),
      )
    ) {
      exactMatches.push(obj)
    } else if (
      Object.values(obj).some(
        (val) =>
          val &&
          val.toString().trim() !== '' &&
          val.toString().toLowerCase().includes(searchValue.toLowerCase()),
      )
    ) {
      partialMatches.push(obj)
    }
  })

  fundsAndExpenses.value = exactMatches.length > 0 ? exactMatches : partialMatches
}
const medicineListBasicSearch = (searchValue) => {
  let exactMatches = []
  let partialMatches = []

  listOfMedicine.value = originalListOfMedicine.value
  listOfMedicine.value.forEach((obj) => {
    if (
      Object.values(obj).some(
        (val) =>
          val &&
          val.toString().trim() !== '' &&
          val.toString().toLowerCase() === searchValue.toLowerCase(),
      )
    ) {
      exactMatches.push(obj)
    } else if (
      Object.values(obj).some(
        (val) =>
          val &&
          val.toString().trim() !== '' &&
          val.toString().toLowerCase().includes(searchValue.toLowerCase()),
      )
    ) {
      partialMatches.push(obj)
    }
  })

  listOfMedicine.value = exactMatches.length > 0 ? exactMatches : partialMatches
}
const medicineGroupBasicSearch = (searchValue) => {
  let exactMatches = []
  let partialMatches = []

  groupNameMedicine.value = originalGroupNameMedicine.value
  groupNameMedicine.value.forEach((obj) => {
    if (
      Object.values(obj).some(
        (val) =>
          val &&
          val.toString().trim() !== '' &&
          val.toString().toLowerCase() === searchValue.toLowerCase(),
      )
    ) {
      exactMatches.push(obj)
    } else if (
      Object.values(obj).some(
        (val) =>
          val &&
          val.toString().trim() !== '' &&
          val.toString().toLowerCase().includes(searchValue.toLowerCase()),
      )
    ) {
      partialMatches.push(obj)
    }
  })

  groupNameMedicine.value = exactMatches.length > 0 ? exactMatches : partialMatches
}
const vaccineGroupBasicSearch = (searchValue) => {
  let exactMatches = []
  let partialMatches = []

  groupNameVaccine.value = originalGroupNameVaccine.value
  groupNameVaccine.value.forEach((obj) => {
    if (
      Object.values(obj).some(
        (val) =>
          val &&
          val.toString().trim() !== '' &&
          val.toString().toLowerCase() === searchValue.toLowerCase(),
      )
    ) {
      exactMatches.push(obj)
    } else if (
      Object.values(obj).some(
        (val) =>
          val &&
          val.toString().trim() !== '' &&
          val.toString().toLowerCase().includes(searchValue.toLowerCase()),
      )
    ) {
      partialMatches.push(obj)
    }
  })

  groupNameVaccine.value = exactMatches.length > 0 ? exactMatches : partialMatches
}
const rescueReportBasicSearch = (searchValue) => {
  console.log(searchValue)
  let exactMatches = []
  let partialMatches = []
  getReportRescueData.value.data = originalReportRescueData.value
  getReportRescueData.value.data.forEach((obj) => {
    if (
      Object.values(obj).some(
        (val) =>
          val &&
          val.toString().trim() !== '' &&
          val.toString().toLowerCase() === searchValue.toLowerCase(),
      )
    ) {
      exactMatches.push(obj)
    } else if (
      Object.values(obj).some(
        (val) =>
          val &&
          val.toString().trim() !== '' &&
          val.toString().toLowerCase().includes(searchValue.toLowerCase()),
      )
    ) {
      partialMatches.push(obj)
    }
  })

  getReportRescueData.value.data = exactMatches.length > 0 ? exactMatches : partialMatches
  console.log(getReportRescueData.value)
}

const vaccineListBasicSearch = (searchValue) => {
  let exactMatches = []
  let partialMatches = []

  listOfVaccine.value = originalListOfVaccine.value
  listOfVaccine.value.forEach((obj) => {
    if (
      Object.values(obj).some(
        (val) =>
          val &&
          val.toString().trim() !== '' &&
          val.toString().toLowerCase() === searchValue.toLowerCase(),
      )
    ) {
      exactMatches.push(obj)
    } else if (
      Object.values(obj).some(
        (val) =>
          val &&
          val.toString().trim() !== '' &&
          val.toString().toLowerCase().includes(searchValue.toLowerCase()),
      )
    ) {
      partialMatches.push(obj)
    }
  })
  listOfVaccine.value = exactMatches.length > 0 ? exactMatches : partialMatches
}
const vitaminGroupBasicSearch = (searchValue) => {
  let exactMatches = []
  let partialMatches = []

  groupNameVitamin.value = originalGroupListOfVaccine.value
  groupNameVitamin.value.forEach((obj) => {
    if (
      Object.values(obj).some(
        (val) =>
          val &&
          val.toString().trim() !== '' &&
          val.toString().toLowerCase() === searchValue.toLowerCase(),
      )
    ) {
      exactMatches.push(obj)
    } else if (
      Object.values(obj).some(
        (val) =>
          val &&
          val.toString().trim() !== '' &&
          val.toString().toLowerCase().includes(searchValue.toLowerCase()),
      )
    ) {
      partialMatches.push(obj)
    }
  })
  groupNameVitamin.value = exactMatches.length > 0 ? exactMatches : partialMatches
}
const vatiminListBasicSearch = (searchValue) => {
  let exactMatches = []
  let partialMatches = []

  listOfVitamin.value = originalListOfVitamin.value
  listOfVitamin.value.forEach((obj) => {
    if (
      Object.values(obj).some(
        (val) =>
          val &&
          val.toString().trim() !== '' &&
          val.toString().toLowerCase() === searchValue.toLowerCase(),
      )
    ) {
      exactMatches.push(obj)
    } else if (
      Object.values(obj).some(
        (val) =>
          val &&
          val.toString().trim() !== '' &&
          val.toString().toLowerCase().includes(searchValue.toLowerCase()),
      )
    ) {
      partialMatches.push(obj)
    }
  })
  listOfVitamin.value = exactMatches.length > 0 ? exactMatches : partialMatches
}
const petFoodBasicSearch = (searchValue) => {
  let exactMatches = []
  let partialMatches = []
  foodInventory.value = originalFoodInventory.value
  foodInventory.value.forEach((obj) => {
    if (
      Object.values(obj).some(
        (val) =>
          val &&
          val.toString().trim() !== '' &&
          val.toString().toLowerCase() === searchValue.toLowerCase(),
      )
    ) {
      exactMatches.push(obj)
    } else if (
      Object.values(obj).some(
        (val) =>
          val &&
          val.toString().trim() !== '' &&
          val.toString().toLowerCase().includes(searchValue.toLowerCase()),
      )
    ) {
      partialMatches.push(obj)
    }
  })

  foodInventory.value = exactMatches.length > 0 ? exactMatches : partialMatches
}
const rescuedStrayBasicSearch = (searchValue) => {
  let exactMatches = []
  let partialMatches = []
  allStrayAnimals.value = originalDataRescuedStray.value
  allStrayAnimals.value.forEach((obj) => {
    if (
      Object.values(obj).some(
        (val) =>
          val &&
          val.toString().trim() !== '' &&
          val.toString().toLowerCase() === searchValue.toLowerCase(),
      )
    ) {
      exactMatches.push(obj)
    } else if (
      Object.values(obj).some(
        (val) =>
          val &&
          val.toString().trim() !== '' &&
          val.toString().toLowerCase().includes(searchValue.toLowerCase()),
      )
    ) {
      partialMatches.push(obj)
    }
  })

  allStrayAnimals.value = exactMatches.length > 0 ? exactMatches : partialMatches
}
const surrenderedBasicSearch = (searchValue) => {
  let exactMatches = []
  let partialMatches = []
  allSurrenderedAnimals.value = originalDataSurrendered.value
  allSurrenderedAnimals.value.forEach((obj) => {
    if (
      Object.values(obj).some(
        (val) =>
          val &&
          val.toString().trim() !== '' &&
          val.toString().toLowerCase() === searchValue.toLowerCase(),
      )
    ) {
      exactMatches.push(obj)
    } else if (
      Object.values(obj).some(
        (val) =>
          val &&
          val.toString().trim() !== '' &&
          val.toString().toLowerCase().includes(searchValue.toLowerCase()),
      )
    ) {
      partialMatches.push(obj)
    }
  })

  allSurrenderedAnimals.value = exactMatches.length > 0 ? exactMatches : partialMatches
}
const inKindDonationBasicSearch = (searchValue) => {
  let exactMatches = []
  let partialMatches = []
  allInKindDonations.value = originalDataallInKind.value
  allInKindDonations.value.forEach((obj) => {
    if (
      Object.values(obj).some(
        (val) =>
          val &&
          val.toString().trim() !== '' &&
          val.toString().toLowerCase() === searchValue.toLowerCase(),
      )
    ) {
      exactMatches.push(obj)
    } else if (
      Object.values(obj).some(
        (val) =>
          val &&
          val.toString().trim() !== '' &&
          val.toString().toLowerCase().includes(searchValue.toLowerCase()),
      )
    ) {
      partialMatches.push(obj)
    }
  })

  allInKindDonations.value = exactMatches.length > 0 ? exactMatches : partialMatches
}
const donationTrackerBasicSearch = (searchValue) => {
  let exactMatches = []
  let partialMatches = []
  allDonations.value = originalDataDonationTracker.value
  allDonations.value.forEach((obj) => {
    if (
      obj &&
      Object.values(obj).some(
        (val) => val && val.toString().toLowerCase() === searchValue.toLowerCase(),
      )
    ) {
      exactMatches.push(obj)
    } else if (
      obj &&
      Object.values(obj).some(
        (val) => val && val.toString().toLowerCase().includes(searchValue.toLowerCase()),
      )
    ) {
      partialMatches.push(obj)
    }
  })

  allDonations.value = exactMatches.length > 0 ? exactMatches : partialMatches
}

const deceasedBasicSearch = (searchValue) => {
  let exactMatches = []
  let partialMatches = []
  allAnimalsDeceased.value = originalDataDeceased.value
  allAnimalsDeceased.value.forEach((obj) => {
    if (
      obj &&
      Object.values(obj).some(
        (val) => val && val.toString().toLowerCase() === searchValue.toLowerCase(),
      )
    ) {
      exactMatches.push(obj)
    } else if (
      obj &&
      Object.values(obj).some(
        (val) => val && val.toString().toLowerCase().includes(searchValue.toLowerCase()),
      )
    ) {
      partialMatches.push(obj)
    }
  })

  allAnimalsDeceased.value = exactMatches.length > 0 ? exactMatches : partialMatches
}
const accountMaintenanceBasicSearch = (searchValue, based) => {
  const dataMap = {
    1: { data: allTaaraOfficialsInfo, original: originalAllTaaraOfficialsInfo },
    2: { data: allVolunteersInfo, original: originalAllVolunteersInfo },
    3: { data: allUserData, original: originalAllUserData },
  }

  let exactMatches = []
  let partialMatches = []

  if (dataMap[based]) {
    let toSearch = dataMap[based].original.value

    toSearch.forEach((obj) => {
      if (
        obj &&
        Object.values(obj).some(
          (val) => val && val.toString().toLowerCase() === searchValue.toLowerCase(),
        )
      ) {
        exactMatches.push(obj)
      } else if (
        obj &&
        Object.values(obj).some(
          (val) => val && val.toString().toLowerCase().includes(searchValue.toLowerCase()),
        )
      ) {
        partialMatches.push(obj)
      }
    })

    dataMap[based].data.value = exactMatches.length > 0 ? exactMatches : partialMatches
  }
}

let allAnimalsDeceased = ref([])
const getAllAnimalsDeceased = () => {
  return new Promise((resolve, reject) => {
    api
      .get('api.php', {
        params: { get_all_animals_deceased: 'get_all_animals_deceased' },
      })
      .then((response) => {
        originalDataDeceased.value = response.data.data
        allAnimalsDeceased.value = response.data.data
        console.log(response.data.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

let allAnimalsNotDeceased = ref([])
const getAllAnimalsNotDeceased = () => {
  return new Promise((resolve, reject) => {
    api
      .get('api.php', {
        params: {
          get_all_animals_not_deceased: 'get_all_animals_not_deceased',
        },
      })
      .then((response) => {
        allAnimalsNotDeceased.value = response.data.data
        console.log(allAnimalsNotDeceased.value)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

let allSurrenderedAnimals = ref([])
const getAllSurrenderedAnimals = () => {
  return new Promise((resolve, reject) => {
    api
      .get('api.php', { params: { getAllSurrenderedAnimals: 'yes' } })
      .then((response) => {
        response.data.data.forEach((item) => {
          item.surrenderer_sex = wordifySex(item.surrenderer_sex)
        })
        originalDataSurrendered.value = response.data.data
        allSurrenderedAnimals.value = response.data.data
        console.log(allSurrenderedAnimals.value)
        resolve(response.data.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
let allNotSurrenderedAnimals = ref([])
const getAllNotSurrenderedAnimals = () => {
  return new Promise((resolve, reject) => {
    api
      .get('api.php', { params: { getAllNotSurrenderedAnimals: 'yes' } })
      .then((response) => {
        allNotSurrenderedAnimals.value = response.data.data
        console.log(allNotSurrenderedAnimals.value)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
let donationData = ref([])
const getDonationThisMonth = (date) => {
  console.log(date)
  return new Promise((resolve, reject) => {
    api
      .get('api.php', {
        params: { get_donation_this_month: date.month.value, year: date.year },
      })
      .then((response) => {
        donationData.value = response.data.data
        console.log(donationData.value)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

let allInKindDonations = ref([])
const getallInKindDonations = () => {
  return new Promise((resolve, reject) => {
    api
      .get('api.php', { params: { get_all_in_kind_donations: 'yes' } })
      .then((response) => {
        originalDataallInKind.value = response.data.data
        allInKindDonations.value = response.data.data
        console.log(allInKindDonations.value)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
let pendingInKindDonations = ref([])
const getPendingInKindDonations = () => {
  return new Promise((resolve, reject) => {
    api
      .get('api.php', {
        params: {
          get_pending_in_kind_donations: 'get_pending_in_kind_donations',
        },
      })
      .then((response) => {
        pendingInKindDonations.value = response.data.data
        console.log(pendingInKindDonations.value)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

let allDonations = ref([])
const getDonations = () => {
  return new Promise((resolve, reject) => {
    api
      .get('api.php', { params: { get_donations: 'yes' } })
      .then((response) => {
        originalDataDonationTracker.value = response.data.data
        allDonations.value = response.data.data
        console.log(allDonations.value)
        resolve(allDonations.value)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
let donatorsData = ref([])
const getOverallDonators = () => {
  return new Promise((resolve, reject) => {
    api
      .get('api.php', { params: { donatorsData: 'donatorsData' } })
      .then((response) => {
        // donatorsData.value = response.data.data
        resolve(response.data.count)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const getOverAllDonationCash = () => {
  return new Promise((resolve, reject) => {
    api
      .get('api.php', { params: { year_donation_cash: 'year_donation_cash' } })
      .then((response) => {
        console.log(response.data.data)

        resolve(response.data.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
const getMonthDonationCash = () => {
  return new Promise((resolve, reject) => {
    api
      .get('api.php', { params: { mont_donation_cash: 'mont_donation_cash' } })
      .then((response) => {
        resolve(response.data.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
let donationsThisMonth = ref([])
const getDonationsThisMonth = (month, year) => {
  return new Promise((resolve, reject) => {
    api
      .get('api.php', {
        params: { get_donations_this_month: 'yes', month: month, year: year },
      })
      .then((response) => {
        donationsThisMonth.value = response.data.data
        console.log(donationsThisMonth.value)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
let pendingDonations = ref([])
const getPendingDonations = () => {
  return new Promise((resolve, reject) => {
    api
      .get('api.php', {
        params: { get_pending_donations: 'get_pending_donations' },
      })
      .then((response) => {
        pendingDonations.value = response.data.data
        console.log(pendingDonations.value)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

let originalAllUserData = ref()
let allUserData = ref()
const allUser = (id) => {
  console.log(id)
  return new Promise((resolve, reject) => {
    api
      .get('api.php', { params: { allUser: 'yes' } })
      .then((response) => {
        originalAllUserData.value = response.data.data
        allUserData.value = response.data.data
        // const result = response.data.data.some(obj => obj.user_id == id);
        // console.log(result);
        // allUserId.value = result;
        // if(result == true){
        // allUserId.value= "User ID exist!";
        // }else{
        //   allUserId.value= "User ID available";
        // }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
let systemActivityData = ref([])
const getSystemActivity = (id) => {
  return new Promise((resolve, reject) => {
    api
      .get('api.php', { params: { system_activity: id } })
      .then((response) => {
        systemActivityData.value = response.data.data
      })
      .catch((error) => {
        reject(error)
      })
  })
}

let specificVolunteerFormData = ref()
const volunteerFormData = (payload) => {
  return new Promise((resolve, reject) => {
    api
      .get('api.php', { params: { allVolunteerForm: 'Yes' } })
      .then((response) => {
        console.log(response.data.data)
        var serializedObject = JSON.stringify(
          response.data.data.some((obj) => obj.user_id === payload),
        )
        localStorage.setItem('specificVolunteerFormData', serializedObject)
        specificVolunteerFormData.value = JSON.parse(
          localStorage.getItem('specificVolunteerFormData'),
        )
      })
      .catch((error) => {
        reject(error)
      })
  })
}
specificVolunteerFormData.value = JSON.parse(localStorage.getItem('specificVolunteerFormData'))

//put
const changePass = (pass, email) => {
  return new Promise((resolve, reject) => {
    api
      .put('api.php', {
        changePassword: null,
        password: pass,
        email_address: email,
      })
      .then((response) => {
        console.log(response.data.status)
        resolve(response.data.status)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
const logOut = () => {
  // originalObject.value = localStorage.clear();
  originalObject.value = localStorage.removeItem('logInDetails')
  logInDetails.value = originalObject.value
  specificVolunteerFormData.value = localStorage.removeItem('specificVolunteerFormData')
}
let userSettingChanger = ref()
let valueHolder = ref(0)
var userSettings = JSON.stringify(valueHolder)
localStorage.setItem('change', userSettings)
userSettingChanger.value = JSON.parse(localStorage.getItem('change'))

export {
  getOverAllDonationCash,
  rescueReportBasicSearch,
  submitPublicDonation,
  monthlyTotalExpense,
  dailyTotal,
  todayfundsAndExpensesTotal,
  getMonthlyFundAndExpenses,
  items,
  lastObjectNotif,
  valueHolder,
  updatePetFood,
  userSettingChanger,
  submitSuppliesForm,
  removeLikes,
  imageURL,
  notifUpdate,
  getActivitiesAndEvents,
  activitiesAndEventsData,
  updateDeceasedAnimals,
  volunteerFormData,
  uploadImage,
  updatePublicUserDetails,
  notifCount,
  deleteDeceasedAnimal,
  likes,
  updateVolunteerAccount,
  getSubmitAdoptionForm,
  checkEmail,
  getLikes,
  getActivitiesAndEventsSpecific,
  activitiesAndEventsDataSpecific,
  changePass,
  addUser,
  deleteScheduleAnimal,
  updatePublicUserPassword,
  allAnimalData12,
  getGroupName,
  exportPetsFoods,
  adoptedAnimalOnProgress,
  voluteerFormData,
  exportSurrenderedAnimals,
  likesData,
  exportDonationTracker,
  declineAdoptionRequest,
  deleteWalkInDonation,
  userData,
  updatePublicUserEmailAddress,
  logOut,
  updateSurrenderedAnimal,
  deceasedBasicSearch,
  getAnnouncement,
  addSurrenderForm,
  getNotification,
  notifData,
  submitAdoptionForm,
  logIn,
  logInDetails,
  updateCashWalkInDonation,
  volunteerRequestData,
  getVolunteerRequest,
  wrongUserOrPass,
  deleteVitamin,
  petFoodBasicSearch,
  annoucementData,
  exportRescuedStrayAnimals,
  deleteRescuedStrayAnimal,
  allAnimalData6,
  deleteVaccine,
  specificAnimal,
  moreAnimalForAdoption,
  getReportRescue,
  deleteRehomedPets,
  getReportRescueData,
  getReportRequest,
  addDeceasedAnimals,
  medicineListBasicSearch,
  specificAnimalId,
  AnimalScheduleDataMedication,
  AnimalScheduleDataCheckUp,
  addSurrenderAnimal,
  resolveExpiredVaccine,
  specificAnimalManagement,
  addVitaminGroupName,
  vitaminGroupBasicSearch,
  viewSpecificAnimalManagement,
  donationTrackerBasicSearch,
  updateOfficialAccount,
  deleteMedicine,
  getListOfVaccine,
  listOfVaccine,
  originalListOfVaccine,
  SearchAnimalByNameManagement,
  updateInKindDonation,
  allUserId,
  getFeaturedAnimals,
  addVaccineGroupName,
  updateAnnouncementManagement,
  featuredData,
  viewSpecificAnimal,
  updateScheduleAnimal,
  allAnimalData,
  addNewAnimal,
  getAllAnimals,
  addNewActivitiesAndEvents,
  getAllAnnouncement,
  animalPublicDisplay,
  addPetFood,
  latestAnnouncement,
  getGroupNameVitamin,
  groupNameVitamin,
  specificVolunteerFormData,
  computerListOfMedicine,
  getDailyFundsAndExpenses,
  fundsAndExpenses,
  deleteInKindDonation,
  deleteSurrenderedAnimal,
  updateMedicine,
  allNotSurrenderedAnimals,
  vaccineListBasicSearch,
  latestAnnouncementImage,
  addVitamin,
  exportInKindDonations,
  allDonations,
  getDonations,
  surrenderedBasicSearch,
  allInKindDonations,
  getallInKindDonations,
  allSurrenderedAnimals,
  getAllSurrenderedAnimals,
  AnimalScheduleData,
  getListOfMedicine,
  listOfMedicine,
  getAllNotSurrenderedAnimals,
  getAllAnimalsNotDeceased,
  getGroupNameVaccine,
  groupNameVaccine,
  updateVitamin,
  allAnimalsNotDeceased,
  allAnimalsDeceased,
  getAllAnimalsDeceased,
  allAnimalsAdopted,
  addVaccine,
  getAllAnimalsAdopted,
  allStrayAnimals,
  allAnimalsNotAdopted,
  getAllAnimalsNotAdopted,
  getAllAnimalsManagement,
  addMedicine,
  addMedicineGroupName,
  updateRescuedStrayAnimals,
  addRescuedStrayAnimals,
  getMonthDonationCash,
  deleteModalCtrl,
  getPendingInKindDonations,
  pendingInKindDonations,
  inKindDonationBasicSearch,
  vatiminListBasicSearch,
  addInKindDonation,
  addAnimalReport,
  addRehomedPets,
  declineVolunteerRequest,
  addModalCtrl,
  declineDonation,
  getAllAnimalsStray,
  deletePetFood,
  mainDisplayCtrl,
  addReportManagement,
  successModalCtrl,
  updateModalCtrl,
  updateRehomedPets,
  getAnimalSchedule,
  groupNameMedicine,
  allVolunteersInfo,
  allVolunteers,
  getFoodInventory,
  foodInventory,
  allTaaraOfficialsInfo,
  allTaaraOfficials,
  allUserData,
  rehomedBasicSearch,
  allUser,
  getAllAnimalsNotStray,
  declineRescueRequest,
  allNotStrayAnimals,
  SearchAnimalByName,
  updateExpenses,
  resolveExpiredMedicine,
  addNewScheduleMedicationOrCheckUp,
  addExpenses,
  updateSpecificAnimal,
  originalListOfVitamin,
  listOfVitamin,
  reportRequestData,
  getListOfVitamin,
  specificDateAddExpenses,
  exportMonthlyExpenses,
  exportRehomedPets,
  updateReportManagement,
  rescuedStrayBasicSearch,
  updateVaccine,
  allAnimalDataManagement,
  exportDeceasedAnimals,
  addAnnouncementManagement,
  addWalkIn,
  getAdoptionRequest,
  adoptionRequest,
  getPendingDonations,
  pendingDonations,
  declineInKindDonation,
  approveAdoptionRequest,
  approveDonation,
  approveInKindDonation,
  approveRescueRequest,
  approveVolunteerRequest,
  budgetAllocationData,
  getBudgetAllocation,
  addBudgetAllocation,
  originalBudgetAllocationData,
  fundsAndExpensesBasicSearch,
  exportMedicine,
  exportVaccine,
  exportVitamin,
  medicineGroupBasicSearch,
  vaccineGroupBasicSearch,
  allUsersData,
  allUsers,
  resolveExpiredVitamin,
  monthlyDonationData,
  getMonthlyDonation,
  adoptionRequestProgressUpdate,
  getAllMonthlyExpenses,
  donationData,
  getDonationThisMonth,
  updateBudgetAllocation,
  allRescuedAnimal,
  getRescuedAnimal,
  animalsAdopted,
  getAnimalsAdopted,
  getMonthlyRescuedAnimal,
  monthlyRescuedAnimal,
  monthlyAdoption,
  getMonthlyAdoption,
  getMonthDonation,
  donationsThisMonth,
  getDonationsThisMonth,
  getWishlistFood,
  getWishlistMedicine,
  getWishlistSupplies,
  // updateWishlist,
  addWishlist,
  exportWishlist,
  wishlistPriority,
  getWishlistPriority,
  allAnimalManagementBackUp,
  filterAnimalByState,
  specificAnimalImage,
  getSpecificAnimalImage,
  deleteAnimal,
  exportSpecificAnimal,
  accountMaintenanceBasicSearch,
  manageRecordBasicSearch,
  eventBasicSearch,
  responseBackup,
  systemActivityData,
  getSystemActivity,
  grantPrivilege,
  activateAccount,
  deleteOfficialActivity,
  OfficialAuthorization,
  addOrganizationAccount,
  getPublicUser,
  allAnimalBackUp,
  dearUserName,
  dearUserEmail,
  dearUserPhoneNumber,
  getOverallDonators,
  donatorsData,
  originalReportRescueData,
}
