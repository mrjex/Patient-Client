<template>
    <div>
        <b-button @click="$bvModal.show('dateSelector')" variant="primary">Show Modal</b-button>

        <b-modal id="dateSelector" @hidden="$emit('selected time', {startDate: this.startDate, endDate: this.endDate})">
            <div>
                <b-form-group>
                  <b-form-datepicker id="startDate" v-model="start_date" :min="minDate" locale="en" size="sm"
                    ></b-form-datepicker>
                </b-form-group>
                <b-form-group>
                  <b-form-datepicker id="endDate" v-model="end_date" :min="minDate" locale="en" size="sm"
                    ></b-form-datepicker>
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
      endDate: null
    }
  },
  methods: {
    show() {
      this.$bvModal.show('dateSelector')
    }
  }
}

</script>
