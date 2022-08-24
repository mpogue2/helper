<template>
  <!-- <q-page class="flex flex-center" v-touch-swipe.mouse.left.right="handleSwipe" @click="onPageClick">
    <q-list class="shadow-2 rounded-borders" style="max-width: 750px; width: 100%;"> -->
  <!-- <q-page class="flex-center" v-touch-swipe.mouse.left.right="handleSwipe" @click="onPageClick">
    <q-list class="rounded-borders" style="max-width: 800px; width: 100%; height: 900px"> -->
  <q-page class="flex-center" v-touch-swipe.mouse.left.right="handleSwipe" @click="onPageClick">
    <!-- *************** -->
    <q-list class="rounded-borders" style="max-width: 800px; width: 100%; height: 900px">
        <!-- <q-item-label header><b>Singing call #{{ sequenceNumber }} of {{ filteredSequences.length }}</b></q-item-label> -->
        <q-item>
          <q-item-section><div class="sequence" v-html="getoutHTML"></div></q-item-section>
        </q-item>
      </q-list>

      <q-toolbar>
        <q-btn icon="arrow_back" label="previous sequence" color="orange" @click="previousSeq" />&nbsp;
        <q-btn icon-right="arrow_forward" label="next sequence" color="green" @click="nextSeq" />
      </q-toolbar>

    <!-- *************** -->
  </q-page>
</template>

<script>
// import { defineComponent } from 'vue'

// export default defineComponent({
//   name: 'PageIndex'
// })

import singers from 'assets/a5_singer.json'
import GlobalUtils from '../GlobalUtils.js'

export default {
  setup () {
    // console.log('SETUP INDEX3 -----------')
    if (localStorage.getItem('seqNum3') == null) {
      // if not, set this sequenceNumber to 1
      localStorage.setItem('seqNum3', '1')
      // console.log('SETUP: seqNum3 WAS NULL!')
    }
  },

  // name: 'foobar',
  data () {
    return {
      // openerCall: '',
      // focusCall1: '',
      // focusCall2: '',
      sequenceNumber: 1,
      numSequences: 1,

      // openingCalls: '',
      // numOpeningCalls: 0,
      // shuffleOpeningCalls: [],

      // focusCalls: '',
      // numFocusCalls: 0,
      // shuffleFocusCalls: [],

      // resolves: '',
      // numResolves: 0,
      // shuffleResolves: [],

      filteredSequences: [], // sequences after filters are applied
      numFilteredSequences: 0, // number after filtering
      shuffleSequences: [], // the shuffle array

      currentLevelBasic: null,
      currentLevelMainstream: null,
      currentLevelPlus: null,
      currentLevelA1: null,
      currentLevelA2: null,
      currentDifficultyEasy: null,
      currentDifficultyHard: null,
      currentDifficultyUnknown: null,
      currentLengthShort: null,
      currentLengthMedium: null,
      currentLengthLong: null,
      numCalls: null,

      getoutHTML: '',
      // openerHTML: '',
      strDebug: '',
      keyString: ''
    }
  },
  methods: {
    init () {
      // this.keyString = ''
      // this.newKey() // this will call this.newSequence(), after the shuffle arrays have been initialized
      // this.sequenceNumber = 1
      const val = +localStorage.getItem('seqNum3') // note '+' sign, because NUMBER
      this.sequenceNumber = val // use persisted value, because this is a RELOAD
      // console.log('INDEX2 INIT: using persisted value of sequenceNumber = ' + val)

      this.newSequence()
    },

    handleSwipe ({ evt, ...newInfo }) {
      switch (newInfo.direction) {
        case 'left': this.nextSeq(); break
        case 'right': this.previousSeq(); break
        default: break
      }
    },

    onPageClick (event) {
      if (event.clientX < window.innerWidth * 0.15) {
        this.previousSeq()
      } else if (event.clientX > window.innerWidth * 0.85) {
        this.nextSeq()
      }
    },

    // re-init SHUFFLE array for sequences
    shuffleSeqs () {
      // console.log('SHUFFLESEQS')
      const val2 = localStorage.getItem('key3') // no '+' because this is a STRING
      this.keyString = val2 // use persisted value
      // console.log('SHUFFLESEQS INDEX3 keyString = ' + this.keyString)

      this.numFilteredSequences = this.filteredSequences.length
      this.shuffleSequences = [...Array(this.numFilteredSequences)].map((_, i) => i) // initialize shuffle array
      const shuffler = GlobalUtils.seededRandom(this.keyString) // make a shuffler
      shuffler(this.shuffleSequences) // and shuffle exactly once
    },

    newFilter () {
      const levelBasic = (localStorage.getItem('levelBasic') === 'true')
      // console.log('NEWFILTER levelBasic:  ' + levelBasic)

      const levelMainstream = (localStorage.getItem('levelMainstream') === 'true')
      // console.log('NEWFILTER levelMainstream:  ' + levelMainstream)

      const levelPlus = (localStorage.getItem('levelPlus') === 'true')
      // console.log('NEWFILTER levelPlus:  ' + levelPlus)

      const levelA1 = (localStorage.getItem('levelA1') === 'true')
      // console.log('NEWFILTER levelA1:  ' + levelA1)

      const levelA2 = (localStorage.getItem('levelA2') === 'true')
      // console.log('NEWFILTER levelA2:  ' + levelA2)

      const difficultyEASY = (localStorage.getItem('difficultyEASY') === 'true')
      // console.log('NEWFILTER difficultyEASY:  ' + difficultyEASY)

      const difficultyHARD = (localStorage.getItem('difficultyHARD') === 'true')
      // console.log('NEWFILTER difficultyHARD:  ' + difficultyHARD)

      const difficultyUNKNOWN = (localStorage.getItem('difficultyUNKNOWN') === 'true')
      // console.log('NEWFILTER difficultyUNKNOWN:  ' + difficultyUNKNOWN)

      const lengthSHORT = (localStorage.getItem('lengthSHORT') === 'true')
      // console.log('NEWFILTER lengthSHORT:  ' + lengthSHORT)

      const lengthMEDIUM = (localStorage.getItem('lengthMEDIUM') === 'true')
      // console.log('NEWFILTER lengthMEDIUM:  ' + lengthMEDIUM)

      const lengthLONG = (localStorage.getItem('lengthLONG') === 'true')
      // console.log('NEWFILTER lengthLONG:  ' + lengthLONG)

      if (
        (this.currentLevelBasic !== levelBasic) ||
        (this.currentLevelMainstream !== levelMainstream) ||
        (this.currentLevelPlus !== levelPlus) ||
        (this.currentLevelA1 !== levelA1) ||
        (this.currentLevelA2 !== levelA2) ||
        (this.currentDifficultyEasy !== difficultyEASY) ||
        (this.currentDifficultyHard !== difficultyHARD) ||
        (this.currentDifficultyUnknown !== difficultyUNKNOWN) ||
        (this.currentLengthShort !== lengthSHORT) ||
        (this.currentLengthMedium !== lengthMEDIUM) ||
        (this.currentLengthLong !== lengthLONG)) { // if global levels are not the same as local ones
        // console.log('NEWFILTER: FILTERING *****')
        // console.log('sequences.length: ' + sequences.length)
        // console.log('singers.length: ' + singers.length)
        // const seqAndSingers = sequences | singers // merge regular sequences (sn<10000) and singers (sn>=10000)
        // const seqAndSingers = sequences.concat(singers)
        // const seqAndSingers = sequences
        const seqAndSingers = singers
        // console.log('seqAndSingers.length: ' + seqAndSingers.length)
        this.filteredSequences = seqAndSingers.filter(a => { // do the filter operation again with new global values
          return (
            ((levelBasic && (a.level.toUpperCase() === 'BASIC')) ||
            (levelMainstream && (a.level.toUpperCase() === 'MS')) ||
            (levelPlus && (a.level.toUpperCase() === 'PLUS')) ||
            (levelA1 && (a.level.toUpperCase() === 'A1')) ||
            (levelA2 && (a.level.toUpperCase() === 'A2'))) &&
            ((lengthSHORT && (a.N < 8)) ||
             (lengthMEDIUM && (a.N >= 8 || a.N <= 15)) ||
             (lengthLONG && (a.N > 15))) &&
            ((difficultyEASY && (a.difficulty === 'EASY')) ||
            (difficultyHARD && (a.difficulty === 'HARD')) ||
            (difficultyUNKNOWN && (a.difficulty === 'UNKNOWN')))
          )
        })
        this.numSequences = this.filteredSequences.length
        // this.sequenceNumber = 1 // filter changed, so reset the sequence number back to the start NO.
        // console.log('NEWFILTER 3: new length = ' + this.numSequences)
        this.currentLevelBasic = levelBasic // and set local values to match globals
        this.currentLevelMainstream = levelMainstream
        this.currentLevelPlus = levelPlus
        this.currentLevelA1 = levelA1
        this.currentLevelA2 = levelA2
        this.currentDifficultyEasy = difficultyEASY
        this.currentDifficultyHard = difficultyHARD
        this.currentDifficultyUnknown = difficultyUNKNOWN
        this.currentLengthShort = lengthSHORT
        this.currentLengthMedium = lengthMEDIUM
        this.currentLengthLong = lengthLONG

        if (this.sequenceNumber >= this.filteredSequences.length) {
          // protect against filter reducing size of filteredSequences, so app crashes
          // console.log('Resetting seqNum to' + this.filteredSequences.length)
          this.sequenceNumber = this.filteredSequences.length
          localStorage.setItem('seqNum3', this.sequenceNumber) // persist this value
        }
      }

      // now that we have new filteredSequences, we need to re-init the shuffle arrays
      this.shuffleSeqs() // reinit the shuffle arrays, based on the current FILTERED arrays

      // DEBUG DEBUG DEBUG ***********
      // console.log('NEWFILTER length: ' + this.numFilteredSequences)
      // console.log('FILTERED sequences: ' + JSON.stringify(this.filteredSequences))
      // console.log('Shuffle array for filtered sequences: ' + JSON.stringify(this.shuffleSequences))
    },

    // call when there's a new KEY string
    newKey () {
    },

    // Call this function when the L or R buttons are pushed, to setup new calls in all 3 sections
    newSequence () {
      localStorage.setItem('seqNum3', this.sequenceNumber) // persist this value

      this.newFilter()
      // const seq = this.filteredSequences[this.sequenceNumber - 1] // chosen sequence

      const defaultSequence = { sn: 0, rec: 0, N: 0, level: '', difficulty: '', calls: '-----|-----|-----|-----' }

      // work through the shuffle!
      const ns1 = (this.sequenceNumber - 1) % this.filteredSequences.length
      const ns2 = this.shuffleSequences[ns1] // map thru the shuffle

      // console.log('INDEX2: ns1 = ' + ns1)
      // console.log('INDEX2: ns2 = ' + ns2)

      // const seq = (this.filteredSequences.length >= 1 && this.sequenceNumber - 1 < this.filteredSequences.length ? this.filteredSequences[this.sequenceNumber - 1] : defaultSequence) // chosen sequence
      const seq = (this.filteredSequences.length >= 1 && ns2 < this.filteredSequences.length ? this.filteredSequences[ns2] : defaultSequence) // chosen sequence
      // console.log('NEWSEQUENCE B = ' + JSON.stringify(seq) + ', len(filteredSequences):' + this.filteredSequences.length)

      // console.log('NEWSEQUENCE = ' + JSON.stringify(seq) + ', len(filteredSequences):' + this.filteredSequences.length)
      const individualCalls = seq.calls.split('|')
      const numIndividualCalls = individualCalls.length
      this.numCalls = numIndividualCalls
      let extraBRs = ''
      for (let i = 0; i < 16 - numIndividualCalls; i++) {
        extraBRs = extraBRs + '<br/>'
      }
      // this.getoutHTML = '<span class="text-positive">(' + seq.level.toUpperCase() +
      //   ' #' + seq.rec +
      //   ', ' + seq.difficulty +
      //   ', calls: ' + seq.N +
      //   // (seq.sn >= 10000 ? ', SINGER' : '') +
      //   ')</span><br/><span class="sequence3">' + seq.calls.split('|').join('<br/>') + extraBRs + '</span>'
      this.getoutHTML = '<span class="text-positive metadata">Sequence #' + this.sequenceNumber + ' of ' + this.filteredSequences.length + ', ' +
        seq.level.toUpperCase() +
        ', #' + seq.rec +
        ', ' + seq.difficulty +
        ', calls: ' + seq.N +
        // (seq.sn >= 10000 ? ', SINGER' : '') +
        '</span><br/><span class="sequence2">' + seq.calls.split('|').join('<br/>') + extraBRs + '</span>'

      this.strDebug = seq
    },

    previousSeq () {
      // console.log('INDEX2: previous sequence')
      if (this.sequenceNumber > 1) {
        this.sequenceNumber = this.sequenceNumber - 1
        this.newSequence()
      }
    },

    nextSeq () {
      // console.log('INDEX2: next sequence')
      if (this.sequenceNumber < this.numSequences) { // Note: there is a limit in INDEX2.vue
        this.sequenceNumber = this.sequenceNumber + 1
        this.newSequence()
      }
    },

    home () {
      // go to sequenceNumber 1
      this.sequenceNumber = 1
      this.newSequence()
    },

    end () {
      // go to sequenceNumber LAST
      this.sequenceNumber = this.numSequences
      this.newSequence()
    },

    pageUP () {
      // console.log('page UP')
      if (this.sequenceNumber > 10) {
        this.sequenceNumber = this.sequenceNumber - 10
      } else {
        this.sequenceNumber = 1
      }
      this.newSequence()
    },

    pageDOWN () {
      // console.log('page DOWN')
      if (this.sequenceNumber < this.numSequences - 10) {
        this.sequenceNumber = this.sequenceNumber + 10
      } else {
        this.sequenceNumber = this.numSequences
      }
      this.newSequence()
    },

    keyPressed (event) {
      if (this.$router.currentRoute.value.fullPath !== '/sing') {
        return
      }

      // console.log('INDEX2: key pressed: ' + event.which)
      switch (event.which) {
        case 33: this.pageUP(); break // PAGE UP key
        case 34: this.pageDOWN(); break // PAGE DOWN key
        case 35: this.end(); break // END key
        case 36: this.home(); break // HOME key
        case 37: this.previousSeq(); break // left arrow
        case 39: this.nextSeq(); break // right arrow
        default: break
      }
    }//,

  }, // methods

  created () {
    this.init() // after the page is created, do some initialization....
    // console.log('INDEX2 INIT! *******')
    window.addEventListener('keydown', this.keyPressed)
  }

}

</script>

<style lang="sass">
.opener
  font-size: 20pt
  color: blue
.focus
  font-size: 24pt
  color: green
.sequence
  font-size: 18pt
  color: black
.sequence3
  font-size: 24pt
  color: black
.debug
  font-size: 12pt
  color: black
body
  touch-action: pan-x pan-y
  overflow: hidden
</style>
