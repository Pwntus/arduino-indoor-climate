<template lang="pug">
.antialiased.h-full.min-h-screen.bg-white.text-slate-900
  pre {{ result }}
</template>

<script>
export default {
  data: () => ({
    result: null
  }),
  methods: {
    async query() {
      try {
        this.result = 'Loading...'
        const response = await fetch('/api/telemetry', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        /*
        await fetch('/api/telemetry', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            temperature: 42.01,
            humidity: 87.92
          })
        })
        */
        this.result = await response.json()
      } catch (e) {
        console.log(e)
        this.result = `Failed: ${e.message}`
      }
    }
  },
  mounted() {
    this.query()
  }
}
</script>

<style lang="stylus" scoped></style>
