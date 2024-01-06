<template>
    <div>
        <b-button @click="$bvModal.show('dateSelector')" variant="primary">Select time span</b-button>

        <b-modal id="dateSelector" @ok="$emit('selectedTime', {startDate: startDate, endDate: endDate})">
            <div>
                <b-form-group>
                  <b-form-datepicker id="startDate" v-model="startDate" locale="en" size="sm"
                    ></b-form-datepicker>
                </b-form-group>
                <b-form-group>
                  <b-form-datepicker id="endDate" v-model="endDate" locale="en" size="sm"
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
