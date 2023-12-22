<template lang="pug">
.gauge.transition-opacity.opacity-0.w-full(
  :class="{ 'opacity-100': config.value !== null }"
)
  .relative.mx-auto(class="max-w-[180px]")
    circle-progress.aspect-square(
      :percent="percent"
      :fill-color="threshold.color"
      :border-width="15"
      empty-color="#f1f1f1"
    )
    .absolute.top-0.bottom-0.left-0.right-0.flex.justify-center.items-center
      .text-center(
        :style="{ color: threshold.color }"
      )
        .text-xs.font-normal(
          class="lg:text-base"
        ) {{ threshold.text }}
        .text-base.font-bold(
          class="lg:text-lg"
        ) {{ config.value }} {{ config.suffix }}
  .text-center.text-xs.font-medium.mt-2(
    class="lg:text-base lg:mt-4"
  ) {{ config.title }}
</template>

<script>
import 'vue3-circle-progress/dist/circle-progress.css'
import CircleProgress from 'vue3-circle-progress'

export default {
  name: 'Gauge',
  props: ['config'],
  components: {
    CircleProgress
  },
  computed: {
    percent() {
      let pc = this.config.value / this.config.max
      pc = pc > 1 ? 1 : pc
      return pc * 100
    },
    threshold() {
      let th = { text: '', class: 'green' }
      for (let cur of this.config.thresholds) {
        if (this.config.value < cur.th) th = cur
      }
      return th
    }
  }
}
</script>

<style lang="stylus" scoped>
.gauge
  .vue3-circular-progressbar
    width 100% !important
    height unset !important
</style>
