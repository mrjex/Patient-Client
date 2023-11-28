<template>
  <!--Wireframe - https://git.chalmers.se/courses/dit355/2023/student-teams/dit356-2023-20/group-20-distributed-systems/-/wikis/Patient-gui#landing-page  -->
  <div style="border-color: yellow">
    <div class="container">
      <div class="carousel">
        <b-carousel
          id="carousel-1"
          v-model="slide"
          :interval="4000"
          controls
          indicators
          background="#ababab"
          img-width="1024"
          img-height="480"
          style="text-shadow: 1px 1px 2px #333;"
          @sliding-start="onSlideStart"
          @sliding-end="onSlideEnd"
        >

          <!-- Slides with custom text -->
          <b-carousel-slide img-src="https://picsum.photos/1024/480/?image=54">
            <h1>Need to consult a specialist?</h1>
            <b-btn pill variant="success">Book</b-btn>
          </b-carousel-slide>

          <!-- Slides with custom text -->
          <b-carousel-slide img-src="https://picsum.photos/1024/480/?image=54">
            <h1>Need to consult a specialist?</h1>
            <b-btn pill variant="success">Book</b-btn>
          </b-carousel-slide>

          <!-- Slides with custom text -->
          <b-carousel-slide img-src="https://picsum.photos/1024/480/?image=54">
            <h1>Need to consult a specialist?</h1>
            <b-btn pill variant="success">Book</b-btn>
          </b-carousel-slide>

          <!-- Slides with img slot -->
          <!-- Note the classes .d-block and .img-fluid to prevent browser default image alignment -->
          <b-carousel-slide>
            <template #img>
              <img
                class="d-block img-fluid w-100"
                width="1024"
                height="480"
                src="https://picsum.photos/1024/480/?image=55"
                alt="image slot"
              >
            </template>
            <h1>Need to consult a specialist?</h1>
          </b-carousel-slide>
        </b-carousel>

        <!--        <p class="mt-4">-->
        <!--          Slide #: {{ slide }}<br>-->
        <!--          Sliding: {{ sliding }}-->
        <!--        </p>-->
      </div>
    </div>
    <div class="container">
      <div class="row">
        <div class="col-2"></div>
        <div class="col-8">
          <h1>What do we offer?</h1>
          <p>
            At dentanoid we offer a seamless online booking experience for multiple dental clincics across Gothenburg.
            Fobar bar fo lorem ipsum ipsum ipsumusus loren.
            Fo fo fo bar bar bar lorem ipsumus sumen. Fobaricus fornum forus bar ipsum lorem fo barn ipsi pipsi.
          </p>
        </div>
        <div class="col-2">
          <div class='user-rev'>
            <h3>Lena</h3>
            <p>'Fobar bar fo lorem ipsum ipsum'</p>
          </div>
          <div class='user-rev'>
            <h3>Adam</h3>
            <p>'Fobar bar fo lorem ipsum ipsum'</p>
          </div>
        </div>
        <div class="col-2"></div>
        <div class="col-8">
          <h1>Start your dental adventure today!</h1>
          <div class="row">
            <div class="col-4">
              <b-btn size="lg" pill variant="success">Sign up</b-btn>
            </div>
            <div class="col-4">
              <b-btn size="lg" pill variant="success">Sign in</b-btn>
            </div>
            <div class="col-4">
              <b-btn size="lg" pill variant="success">Book</b-btn>
            </div>
          </div>
        </div>
        <div class="col-2"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LandingPage.vue',
  data() {
    return {
      slide: 0,
      sliding: null
    }
  },
  methods: {
    onSlideStart(slide) {
      this.sliding = true
    },
    onSlideEnd(slide) {
      this.sliding = false
    }
  }
}
</script>

<style scoped>
.carousel {
  border-color: #000000;
  border-style: solid;
  border-width: 1px;
  margin-bottom: 10px;
}

.user-rev {
  border-style: solid;
  border-color: black;
  margin-bottom: 10px;
}

/** {*/
/*  border-style: dashed;*/
/*  border-color: green;*/
/*}*/
</style>
