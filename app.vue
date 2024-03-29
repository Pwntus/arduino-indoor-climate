<template lang="pug">
.antialiased.h-full.min-h-screen.bg-white.text-neutral-900
  main.container.mx-auto.p-2(
    class="lg:p-4"
  )
    .text-center.mt-8(
      class="lg:mt-16"
    )
      .text-base.font-medium(
        class="lg:text-xl"
      ) Indoor climate in real time at
      .text-3xl.font-semibold.mt-2.leading(
        class="lg:text-6xl lg:mt-4"
      )
        | Taavinkuja 
        span.text-transparent.bg-clip-text.bg-gradient-to-r.from-blue-700.to-blue-500 5 A 1
        | .

    .mt-12.grid.grid-cols-4.gap-2(
      class="lg:mt-24 lg:gap-4"
    )
      .text-center.text-sm.text-neutral-800.font-medium.border.rounded-full.p-1.cursor-pointer(
          @click="gte_days = 1"
          :class="`lg:px-4 lg:py-2 ${gte_days === 1 ? 'bg-blue-500 border-blue-500 hover:bg-blue-500 text-white' : 'hover:bg-neutral-300 border-neutral-300'}`"
        ) 24H
      .text-center.text-sm.text-neutral-800.font-medium.border.rounded-full.p-1.cursor-pointer(
          @click="gte_days = 3"
          :class="`lg:px-4 lg:py-2 ${gte_days === 3 ? 'bg-blue-500 border-blue-500 hover:bg-blue-500 text-white' : 'hover:bg-neutral-300 border-neutral-300'}`"
        ) 3D
      .text-center.text-sm.text-neutral-800.font-medium.border.rounded-full.p-1.cursor-pointer(
          @click="gte_days = 7"
          :class="`lg:px-4 lg:py-2 ${gte_days === 7 ? 'bg-blue-500 border-blue-500 hover:bg-blue-500 text-white' : 'hover:bg-neutral-300 border-neutral-300'}`"
        ) 7D
      .text-center.text-sm.text-neutral-800.font-medium.border.rounded-full.p-1.cursor-pointer(
          @click="gte_days = 30"
          :class="`lg:px-4 lg:py-2 ${gte_days === 30 ? 'bg-blue-500 border-blue-500 hover:bg-blue-500 text-white' : 'hover:bg-neutral-300 border-neutral-300'}`"
        ) 1M

    .mt-12(
      class="lg:mt-24"
    )
      .text-xl.font-bold.leading.flex(
        class="lg:text-4xl"
      )
        | Now
        .grow
        .flex.items-center.text-sm.text-neutral-400.font-medium.border.border-neutral-300.rounded-full.px-2(
          class="lg:px-4"
        ) Updated {{ last_updated }}
      .text-base.font-medium.text-neutral-500.mt-1(
        class="lg:text-xl lg:mt-2"
      ) Latest value, updated live.
    .mt-6.grid.grid-cols-3.gap-2.flex.justify-items-center(
      class="lg:mt-12 lg:gap-4"
    )
      ui-gauge(:config="gauge_temperature")
      ui-gauge(:config="gauge_humidity")
      ui-gauge(:config="gauge_heat_index")

    .mt-12(
      class="lg:mt-24"
    )
      .text-xl.font-bold.leading.flex(
        class="lg:text-4xl"
      )
        | History
        .grow
        .flex.items-center.text-sm.text-neutral-400.font-medium.border.border-neutral-300.rounded-full.px-2(
          class="lg:px-4"
        ) Updated {{ last_updated }}
      .text-base.font-medium.text-neutral-500.mt-1(
        class="lg:text-xl lg:mt-2"
      ) Latest 24 hours.
    .mt-6(class="lg:mt-12")
      .h-64
        ui-graph(:config="graph_temperature")
      .h-64
        ui-graph(:config="graph_humidity")
      .h-64
        ui-graph(:config="graph_heat_index")

    template(v-if="false")
      .mt-6(
        class="lg:mt-12 lg:grid lg:grid-cols-2 lg:gap-4"
      )
        .h-64
          ui-graph(:config="graph_temperature")
        .h-64
          ui-graph(:config="graph_humidity")
      .mt-0(
        class="lg:mt-12"
      )
        .h-64
          ui-graph(:config="graph_heat_index")
</template>

<script>
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

const UPDATE_TIMEOUT = 60000

export default {
  data: () => ({
    last_updated: null,
    last_updated_timeout: null,

    loading: true,
    gte_days: 3,
    rows: null,
    latest_row: {
      id: null,
      temperature: null,
      humidity: null,
      heat_index: null,
      created_at: null
    },

    gauge_temperature: {
      value: null,
      min: 0.0,
      max: 60.0,
      title: 'Temperature',
      suffix: '°C',
      thresholds: [
        { th: 100, text: 'Hot', color: '#ff0000' },
        { th: 22.1, text: 'Warm', color: '#61aa02' },
        { th: 18, text: 'Cold', color: '#071b54' },
        { th: 15, text: 'Very cold', color: '#990099' }
      ]
    },
    gauge_humidity: {
      value: null,
      min: 0.0,
      max: 100.0,
      title: 'Humidity',
      suffix: '%',
      thresholds: [
        { th: 100, text: 'Very humid', color: '#071b54' },
        { th: 75, text: 'Humid', color: '#ff9900' },
        { th: 50, text: 'Comfortable', color: '#61aa02' },
        { th: 30, text: 'Dry', color: '#990099' }
      ]
    },
    gauge_heat_index: {
      value: null,
      min: 0.0,
      max: 60.0,
      title: 'Heat index',
      suffix: '°C',
      thresholds: [
        { th: 100, text: 'Hot', color: '#ff0000' },
        { th: 22.1, text: 'Warm', color: '#61aa02' },
        { th: 18, text: 'Cold', color: '#071b54' },
        { th: 15, text: 'Very cold', color: '#990099' }
      ]
    },

    graph_temperature: {
      data: null,
      title: 'Temperature',
      suffix: '°C',
      color: '#61aa02',
      min: 15,
      max: 30
    },
    graph_humidity: {
      data: null,
      title: 'Humidity',
      suffix: '%',
      color: '#61aa02',
      min: 0,
      max: 100
    },
    graph_heat_index: {
      data: null,
      title: 'Heat index',
      suffix: '°C',
      color: '#61aa02',
      min: 15,
      max: 30
    }
  }),
  watch: {
    gte_days: {
      immediate: true,
      handler() {
        this.query()
      }
    }
  },
  methods: {
    async query() {
      try {
        this.loading = true
        const gte = +new Date() - 86400000 * this.gte_days
        const response = await fetch(`/api/telemetry?gte=${gte}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const { latest_row, rows } = await response.json()
        this.rows = rows

        // Set latest row
        this.latest_row.id = latest_row?.id || null
        this.latest_row.temperature = latest_row?.temperature || null
        this.latest_row.humidity = latest_row?.humidity || null
        this.latest_row.heat_index = latest_row?.heat_index || null
        this.latest_row.created_at = latest_row?.created_at || null

        if (this.latest_row.created_at)
          this.last_updated = dayjs(
            Number(this.latest_row.created_at)
          ).fromNow()

        this.update_data()

        this.error = null
      } catch (e) {
        this.error = e.message
      } finally {
        this.loading = false
      }
    },
    update_data() {
      const { temperature, humidity, heat_index } = this.latest_row

      this.gauge_temperature.value = parseFloat(temperature).toFixed(1)
      this.gauge_humidity.value = parseFloat(humidity).toFixed(1)
      this.gauge_heat_index.value = parseFloat(heat_index).toFixed(1)

      this.graph_temperature.data = this.rows.map(
        ({ created_at, temperature }) => ({
          x: Number(created_at),
          y: Number(temperature)
        })
      )
      this.graph_humidity.data = this.rows.map(({ created_at, humidity }) => ({
        x: Number(created_at),
        y: Number(humidity)
      }))
      this.graph_heat_index.data = this.rows.map(
        ({ created_at, heat_index }) => ({
          x: Number(created_at),
          y: Number(heat_index)
        })
      )
    }
  },
  mounted() {
    this.last_updated_timeout = setInterval(() => {
      this.query()
    }, UPDATE_TIMEOUT)
  },
  beforeDestroy() {
    clearInterval(this.last_updated_timeout)
  }
}
</script>

<style lang="stylus" scoped></style>
