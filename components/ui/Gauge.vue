<template lang="pug">
.transition-opacity.opacity-0(
  :class="{ 'opacity-100': config.value !== null }"
)
  .relative
    circle-progress(
      :percent="percent"
      :fill-color="threshold.color"
      :border-width="15"
      empty-color="#f1f1f1"
    )
    .absolute.top-0.bottom-0.left-0.right-0.flex.justify-center.items-center
      .text-center(
        :style="{ color: threshold.color }"
      )
        .font-normal {{ threshold.text }}
        .text-xl.font-bold {{ config.value }} {{ config.suffix }}
  .text-center.text-base.font-medium.mt-2(
    class="lg:mt-4"
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

<style lang="stylus" scoped></style>
