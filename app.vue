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
    .mt-6.grid.grid-cols-3.gap-4.flex.justify-items-center(
      class="lg:mt-12"
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
    .mt-6(
      class="lg:mt-12 lg:grid lg:grid-cols-2 lg:gap-4"
    )
      .h-64
        ui-graph(:config="graph_temperature")
      .h-64
        ui-graph(:config="graph_humidity")
    .mt-6(
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
    latest_row: {
      deep: true,
      handler(value) {
        this.gauge_temperature.value = parseFloat(value.temperature).toFixed(1)
        this.gauge_humidity.value = parseFloat(value.humidity).toFixed(1)
        this.gauge_heat_index.value = parseFloat(value.heat_index).toFixed(1)

        this.graph_temperature.data = this.rows.map(
          ({ created_at, temperature }) => ({
            x: Number(created_at),
            y: Number(temperature)
          })
        )
        this.graph_humidity.data = this.rows.map(
          ({ created_at, humidity }) => ({
            x: Number(created_at),
            y: Number(humidity)
          })
        )
        this.graph_heat_index.data = this.rows.map(
          ({ created_at, heat_index }) => ({
            x: Number(created_at),
            y: Number(heat_index)
          })
        )
      }
    }
  },
  methods: {
    async query() {
      try {
        this.loading = true
        const response = await fetch('/api/telemetry', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        this.rows = await response.json()

        // Set latest row
        const latest_row = this.rows[this.rows.length - 1]
        this.latest_row.id = latest_row?.id || null
        this.latest_row.temperature = latest_row?.temperature || null
        this.latest_row.humidity = latest_row?.humidity || null
        this.latest_row.heat_index = latest_row?.heat_index || null
        this.latest_row.created_at = latest_row?.created_at || null

        if (this.latest_row.created_at)
          this.last_updated = dayjs(
            Number(this.latest_row.created_at)
          ).fromNow()

        this.error = null
      } catch (e) {
        this.error = e.message
      } finally {
        this.loading = false
      }
    }
  },
  mounted() {
    this.query()

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
