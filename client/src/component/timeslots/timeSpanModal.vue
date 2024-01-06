<template>
  <div>
    <b-button @click="$bvModal.show('dateSelector')" variant="dark">Filter</b-button>

    <b-modal id="dateSelector" @ok="$emit('selectedTime', { timespan: {startDate: startDate, endDate: endDate}, filterOptions: clinicFilter })"
    :ok-disabled="!validInput" title="Select search parameters">
      <div>
        <b-form-group label="Start time">
          <b-form-datepicker id="startDate" v-model="startDate" locale="en" size="sm"></b-form-datepicker>
        </b-form-group>
        <b-form-group label="End time">
          <b-form-datepicker id="endDate" v-model="endDate" locale="en" size="sm"></b-form-datepicker>
        </b-form-group>
        <b-form-group label="Filter clinics">
          <b-form-select v-model="clinicFilter" :options="filterOptions" size="sm" class="mt-1"></b-form-select>
        </b-form-group>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'timeSpanModal',
  data() {
    return {
      startDate: null,
      endDate: null,
      clinicFilter: null,
      filterOptions: [
        { text: 'All clinics', value: 'all' },
        { text: '10 Closest clinics', value: 'closest' }
      ]
    }
  },
  methods: {
    show() {
      this.$bvModal.show('dateSelector')
    }
  },
  computed: {
    validInput() {
      if (this.startDate && this.endDate && this.clinicFilter) {
        return true
      } else {
        return false
      }
    }
  }
}

</script>
