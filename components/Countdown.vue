<template>
  <div class="flex gap-4 text-white">
    <div :class="blockClasses">
      {{ days }}
      <div :class="captionClasses">Dias</div>
    </div>
    <div :class="blockClasses">
      {{ hours }}
      <div :class="captionClasses">Horas</div>
    </div>
    <div :class="blockClasses">
      {{ minutes }}
      <div :class="captionClasses">Minutos</div>
    </div>
    <div :class="blockClasses">
      {{ seconds }}
      <div :class="captionClasses">Segundos</div>
    </div>
  </div>
</template>

<script setup lang="ts">
type CountdownProps = {
  end: Date
}

const props = defineProps<CountdownProps>()
const days = ref<string>()
const hours = ref<string>()
const minutes = ref<string>()
const seconds = ref<string>()

const blockClasses = ref('bg-black/50 w-16 h-20 rounded-lg flex flex-col items-center justify-center text-3xl font-semibold md:w-20 md:h-24 md:text-4xl')
const captionClasses = ref('text-sm md:text-base font-normal')

const fill = (value: number) => Math.floor(value).toString().padStart(2, '0')

const countdown = () => {
  const timeNow = new Date().getTime()
  const timeDifference = props.end.getTime() - timeNow
  const millisecondsInOneSecond = 1000
  const millisecondsInOneMinute = millisecondsInOneSecond * 60
  const millisecondsInOneHour = millisecondsInOneMinute * 60
  const millisecondsInOneDay = millisecondsInOneHour * 24
  const differenceInDays = timeDifference / millisecondsInOneDay
  const remainderDifferenceInHours = (timeDifference % millisecondsInOneDay) / millisecondsInOneHour
  const remainderDifferenceInMinutes =
    (timeDifference % millisecondsInOneHour) / millisecondsInOneMinute
  const remainderDifferenceInSeconds =
    (timeDifference % millisecondsInOneMinute) / millisecondsInOneSecond

  days.value = fill(differenceInDays)
  hours.value = fill(remainderDifferenceInHours)
  minutes.value = fill(remainderDifferenceInMinutes)
  seconds.value = fill(remainderDifferenceInSeconds)
}

const start = () => {
  setInterval(countdown, 1000)
}

onMounted(() => {
  start()
})
</script>
