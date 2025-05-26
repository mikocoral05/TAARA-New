<template>
  <!-- <div>
    <div class="Attachments bg-grey-3 q-pa-sm q-mb-sm" style="width: 100%">
      <div class="files q-mb-sm q-pa-sm">
        <div class="imgCon q-gutter-sm">
          <div v-for="(image, index) in images" :key="index" class="cardImg q-pa-sm">
            <q-card class="imgsrc">
              <q-img
                :src="image"
                spinner-color="amber"
                class="imgsrc"
                height="100px"
                width="100px"
              ></q-img>
              <q-card-actions class="banner">
                <p>document</p>
              </q-card-actions>
            </q-card>
          </div>
          <q-btn class="filebtn" @click="pickFile" icon="person_add"></q-btn>
          <input
            ref="fileInput"
            type="file"
            style="display: none"
            @change="handleFileUpload"
            multiple
          />
        </div>
      </div>
    </div>
  </div> -->
  <q-page>
    <q-file v-model="files" label="Pick files" filled multiple append style="max-width: 300px" />
    <q-btn @click="upload()"></q-btn>
  </q-page>
</template>
<script>
import { ref } from 'vue'
import { uploadImage, imageURL, logInDetails } from '../composable/taaraComposable'
import { uploadImages } from 'src/composable/latestComposable'
export default {
  setup() {
    const files = ref([])
    const images = ref([])
    function resizeImage(file, maxWidth, maxHeight) {
      var img = document.createElement('img')
      var canvas = document.createElement('canvas')
      var ctx = canvas.getContext('2d')
      var reader = new FileReader()
      reader.onload = function (e) {
        img.src = e.target.result
        img.onload = function () {
          var width = img.width
          var height = img.height
          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width
              width = maxWidth
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height
              height = maxHeight
            }
          }
          canvas.width = width
          canvas.height = height
          ctx.drawImage(img, 0, 0, width, height)
          images.value.push(canvas.toDataURL(file.type))
          console.log(images.value)
          // uploadImage(images.value,logInDetails.value[0].user_id);
        }
      }
      reader.readAsDataURL(file)
      // console.log(reader.result);
    }
    const handleFileUpload = (event) => {
      const files = event.target.files
      console.log(files)
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        console.log(file.name)
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
          resizeImage(file, 500, 500) // call the resizeImage function here
          // console.log(reader.result);
          // images.value.push(reader.result);
        }
      }
      // console.log(logInDetails);
      // console.log(logInDetails.value[0].user_id);
    }

    const fileInput = ref(null)
    const pickFile = () => {
      fileInput.value.click()
    }
    const upload = () => {
      uploadImages(files.value).then((response) => {
        console.log(response)
      })
    }

    return {
      upload,
      files,
      imageURL,
      handleFileUpload,
      images,
      uploadImage,
      logInDetails,
      pickFile,
      fileInput,
    }
  },
}
</script>
