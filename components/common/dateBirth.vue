<script setup>
import { onMounted, ref } from 'vue'

const emit = defineEmits(['date'])
const dia = ref(null)
const mes = ref(1)
const ano = ref(null)
const diasDelMes = ref([])
const error = ref('')
const years = ref([])
const meses = ref([])
const fechaFormateada = ref('')

function calcularDiasEnMes(mes, ano) {
  if (mes === 2)
    return (ano % 4 === 0 && (ano % 100 !== 0 || ano % 400 === 0)) ? 29 : 28

  // Meses con 30 días
  if ([4, 6, 9, 11].includes(mes))
    return 30

  // Meses con 31 días
  return 31
}
function actualizarDias() {
  const diasEnMes = calcularDiasEnMes(mes.value, ano.value)
  diasDelMes.value = Array.from({ length: diasEnMes }, (_, i) => i + 1)
  if (dia.value > diasEnMes)
    dia.value = null
}

function validarFecha() {
  const fechaNacimiento = new Date(ano.value, mes.value - 1, dia.value)
  const fechaActual = new Date()
  const edad = fechaActual.getFullYear() - fechaNacimiento.getFullYear()
  const mesNacimiento = fechaActual.getMonth() - fechaNacimiento.getMonth()

  // Validar si la edad es menor de 18 años
  if (edad < 18 || (edad === 18 && mesNacimiento < 0) || (edad === 18 && mesNacimiento === 0 && fechaActual.getDate() < dia.value)) {
    error.value = 'Debes tener al menos 18 años para registrarte.'
  }
  else {
    error.value = ''
    fechaFormateada.value = `${ano.value}-${String(mes.value).padStart(2, '0')}-${String(dia.value).padStart(2, '0')}`
    emit ('date', fechaFormateada.value)
  }
}
watch([dia, mes, ano], () => {
  if (dia.value && mes.value && ano.value)
    validarFecha()
})

function generarAnios() {
  const startYear = 1800
  const endYear = new Date().getFullYear()
  for (let i = endYear; i >= startYear; i--)
    years.value.push(i)
}

function generarMeses() {
  meses.value = [
    { value: 1, name: 'Enero' },
    { value: 2, name: 'Febrero' },
    { value: 3, name: 'Marzo' },
    { value: 4, name: 'Abril' },
    { value: 5, name: 'Mayo' },
    { value: 6, name: 'Junio' },
    { value: 7, name: 'Julio' },
    { value: 8, name: 'Agosto' },
    { value: 9, name: 'Septiembre' },
    { value: 10, name: 'Octubre' },
    { value: 11, name: 'Noviembre' },
    { value: 12, name: 'Diciembre' },
  ]
}

onMounted(() => {
  actualizarDias()
  generarAnios()
  generarMeses()
})
</script>

<template>
  <div>
    <label for="name" class="block mb-2  text-sm col-span-3 font-medium text-gray-900 ">Fecha de nacimiento</label>

    <div class="grid grid-cols-3 gap-2.5">
      <div>
        <select id="dia-nacimiento" v-model="dia" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" required>
          <option v-for="d in diasDelMes" :key="d" :value="d">
            {{ d }}
          </option>
        </select>
      </div>

      <div>
        <select id="mes-nacimiento" v-model="mes" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full px-1 py-2.5" name="month" @change="actualizarDias">
          <option v-for="m in meses" :key="m.value" :value="m.value">
            {{ m.name }}
          </option>
        </select>
      </div>

      <div>
        <select id="ano-nacimiento" v-model="ano" :class="{ 'border-red-500': error }" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" required>
          <option v-for="year in years" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
      </div>
    </div>

    <div v-if="error" class="text-xs absolute mt-1 max-w-max text-red-600 dark:text-red-500">
      {{ error }}
    </div>
  </div>
</template>
