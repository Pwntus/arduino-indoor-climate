<template lang="pug">
.h-full.transition-opacity.opacity-0(
  :class="{ 'opacity-100': config.data !== null }"
)
  ui-highcharts(
    :options="chartOptions"
    ref="chart"
  )
</template>

<script>
import { merge, cloneDeep } from 'lodash'

/**
 * Highcharts options docs:
 * https://api.highcharts.com/highcharts/
 */
const GLOBAL_OPTIONS = {
  chart: {
    backgroundColor: 'transparent'
  },
  boost: {
    seriesThreshold: 50
  },
  title: null,
  tooltip: { enabled: false },
  credits: { enabled: false },
  legend: {
    enabled: false,
    itemStyle: {
      fontWeight: 'normal',
      color: '#FFF'
    },
    itemHoverStyle: {
      color: '#FFF'
    }
  },
  time: {
    timezoneOffset: -120 // UTC+2
  },
  xAxis: {
    lineColor: '#f1f1f1',
    gridLineColor: '#f1f1f1',
    tickColor: '#f1f1f1',
    labels: {
      style: {
        color: '#171717'
      }
    }
  },
  yAxis: {
    title: null,
    lineColor: '#f1f1f1',
    gridLineColor: '#f1f1f1',
    labels: {
      style: {
        color: '#171717'
      }
    }
  },
  colors: ['#FFF']
}

export default {
  name: 'Chart',
  props: ['config'],
  data: () => ({
    chartOptions: {}
  }),
  watch: {
    config: {
      deep: true,
      handler() {
        this.setOptions()
      }
    }
  },
  methods: {
    setOptions() {
      const localOptions = {
        title: {
          text: this.config.title,
          align: 'left',
          style: {
            color: '#171717',
            fontSize: '16px',
            fontWeight: '500'
          }
        },
        series: [
          {
            name: this.config.title,
            type: 'spline',
            data: this.config.data
          }
        ],
        colors: [this.config.color],
        plotOptions: {
          spline: {
            lineWidth: 2,
            turboThreshold: 0,
            animation: {
              duration: 0
            },
            marker: {
              radius: 1,
              enabledThreshold: 3
            },
            dataLabels: {
              enabled: true,
              format: '{point.y} ' + this.config.suffix,
              color: this.config.color,
              backgroundColor: 'transparent',
              padding: 15,
              style: {
                textOutline: 0
                // textOutline: '1px #bbb'
              }
            }
          }
        },
        tooltip: {
          enabled: true,
          animation: false,
          valueSuffix: this.config.suffix,
          valueDecimals: 2,
          backgroundColor: '#f1f1f1',
          hideDelay: 0,
          shadow: false,
          padding: 16,
          useHTML: true,
          borderWidth: 0,
          borderRadius: 5,
          // headerFormat: '',
          pointFormat: `
            <table style="border:none;color:#000">
              <tr>
                <td style="padding-right:8px;text-align:right">{series.name}:</td>
                <td style="font-weight:bold;text-align:left;color:#0c2231">{point.y}</td>
              </tr>
            </table>`
        },
        xAxis: {
          type: 'datetime'
        },
        yAxis: {
          // min: this.config.min,
          // max: this.config.max,
          endOnTick: false
        }
      }
      this.chartOptions = cloneDeep(merge(GLOBAL_OPTIONS, localOptions))
    }
  }
}
</script>

<style lang="stylus" scoped></style>
