<script setup lang="ts">
import { TrashIcon } from '@heroicons/vue/24/solid'

const emit = defineEmits<{
  (event: 'update:modelValue', value: string | null | undefined): void
}>()

const isPhotoLoading = ref(false)

// async function uploadImage(e: Event) {
//   isPhotoLoading.value = true
//   const file = (e.target as HTMLInputElement).files?.[0]
//   if (file) {
//     const readerResult = await fileToDataUri(file)
//     const imageDataUri = await resizeImageFromReader(readerResult)
//     emit('update:modelValue', imageDataUri)
//     isPhotoLoading.value = false
//   }
// }
async function uploadImage(e: Event) {
  isPhotoLoading.value = true
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    const readerResult = await fileToDataUri(file)
    const img = new Image()
    img.src = readerResult

    img.onload = async () => {
      const shouldResize = file.size > 1 * 1024 * 1024 || img.width > 1000 || img.height > 1000

      let imageDataUri = readerResult
      if (shouldResize)
        imageDataUri = await resizeImageFromReader(readerResult)

      emit('update:modelValue', imageDataUri)
      isPhotoLoading.value = false
    }
  }
}
function clearProfileImage() {
  emit('update:modelValue', null)
  isPhotoLoading.value = false
}

function fileToDataUri(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(blob)

    reader.addEventListener(
      'load',
      (e) => {
        const readerResult = e.target?.result
        if (typeof readerResult === 'string')
          resolve(readerResult)
        else
          reject(new Error('Something went wrong'))
      },
      { once: true },
    )
  })
}

function resizeImageFromReader(readerResult: string) {
  const img = new Image()
  img.src = readerResult
  return new Promise<string>(resolve =>
    img.addEventListener(
      'load',
      () => {
        const resizedImage = resizeImage(img)
        resolve(resizedImage)
      },
      { once: true },
    ),
  )
}

function resizeImage(imgToResize: HTMLImageElement, resizingFactor = 0.25) {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  const originalWidth = imgToResize.width
  const originalHeight = imgToResize.height

  const canvasWidth = originalWidth * resizingFactor
  const canvasHeight = originalHeight * resizingFactor

  canvas.width = canvasWidth
  canvas.height = canvasHeight

  if (context)
    context.drawImage(imgToResize, 0, 0, canvasWidth, canvasHeight)

  return canvas.toDataURL()
}
</script>

<template>
  <div class="flex mt-6 justify-center items-center">
    <label
      tabindex="0"
      for="firm-image-uploader"
      class="form__btn basis-full"
    >{{ $t("upload-firma-image") }}
      <input
        id="firm-image-uploader"
        type="file"
        accept="image/*"
        name="uploadFirmImage"
        class="hidden"
        @change="uploadImage"
      >
    </label>
    <button
      class="form__bt bg-white shadow-sm hover:bg-red-600 hover:text-white group border-gray-300 h-10 py-2 px-3 it flex flex-col justify-center rounded-md"
      type="button"
      @click="clearProfileImage"
    >
      <TrashIcon class="text-red-600 hover:text-white group-hover:text-white h-5 w-5" />
    </button>
  </div>
</template>
