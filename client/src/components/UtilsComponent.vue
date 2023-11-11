<script>
export default {
  data() {
    return {
    }
  },
  methods: {
    changeSearchRange() {
      if (this.currentRadius && this.currentRadius !== this.previousRadius) {
        const radiusArticle = document.getElementById('radius-data')
        radiusArticle.innerHTML = this.currentRadius
        this.previousRadius = this.currentRadius
      }
    },
    changeTravelMode() {
      if (this.currentTravelMode && this.currentTravelMode !== this.previousTravelMode) {
        const travelModeArticle = document.getElementById('travel-mode-data')
        travelModeArticle.innerHTML = this.currentTravelMode
        this.previousTravelMode = this.currentTravelMode
      }
    },
    confirmVariableChange(variable, previousVariableValue) {
      if (variable && variable !== previousVariableValue) {
        return true
      }
      return false
    },
    alterHTMLElementContent(identifier, variable) {
      document.getElementById(identifier).innerHTML = variable
    },
    modifyHTMLOnVariableChange(variable, previousVariableValue, identifier) {
      if (this.confirmVariableChange(variable, previousVariableValue)) {
        this.alterHTMLElementContent(identifier)
        previousVariableValue = variable
      }
    }
  }
}

</script>
