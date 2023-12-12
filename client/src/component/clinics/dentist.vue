<template>
  <div>
    <b-list-group-item @click="handleDentistClick"> {{ dentist.name }}</b-list-group-item>
  </div>
</template>

<script>
export default {
  name: 'dentistList',
  props: {
    dentist: {
      type: Object,
      required: true
    }
  },
  methods: {
    handleDentistClick() {
      this.$emit('showTimeslots', this.dentist._id)
    }
  }
}
</script>

<style scoped></style>
