<template>
  <q-page class="flex-center" v-touch-swipe.mouse.left.right="handleSwipe" @click="onPageClick">
    <!-- *************** -->
    <span class="text-positive metadata">&nbsp;Random sequence #{{ sequenceNumber }}</span>
    <q-separator/>
    <div class="opener" v-html="openerHTML"></div>
    <q-separator/>
    <div class="row">
      <div class="col-6">
        <div class="focus2">&nbsp;{{ focusCall1 }}<br/>&nbsp;{{ focusCall2 }}</div>
      </div>
      <div class="col-6">
        <div class="focus2">{{ focusCall3 }}<br/>{{ focusCall4 }}</div>
      </div>
    </div>
    <q-separator/>
    <div class="row">
      <div class="col-6">
        <div class="getout" v-html="getoutHTML"></div>
      </div>
      <div class="col-6">
        <div class="getout" v-html="getoutHTML2"></div>
      </div>
    </div>
    <q-separator/>

      <q-toolbar>
        <q-input label="KEY:" name="key"
          dense outlined
          v-model="keyString"
          @keyup.enter="this.sequenceNumber = 1;newKey()"
          @blur="newKey"
          clearable
          clear-icon="close"
          maxlength="20">
          <template v-slot:prepend><q-icon name="key" /></template>
        </q-input>&nbsp;&nbsp;&nbsp;&nbsp;
        <q-btn icon="arrow_back" label="previous sequence" color="orange" @click="previousSeq" />&nbsp;
        <q-btn icon-right="arrow_forward" label="next sequence" color="green" @click="nextSeq" />
        &nbsp;&nbsp;O: {{ numOpeningCalls }}, F: {{ numFocusCalls }}, R: {{ numResolves }}
      </q-toolbar>

    <!-- *************** -->
  </q-page>
</template>

<script>
// import { defineComponent } from 'vue'

// export default defineComponent({
//   name: 'PageIndex'
// })

import json from 'assets/calls.json'
import GlobalUtils from '../GlobalUtils.js'

export default {
  setup () {
    // console.log('SETUP ------------')

    // check to see if we've been here before --------
    if (localStorage.getItem('seqNum1') == null) {
      // if not, set this sequenceNumber to 1
      localStorage.setItem('seqNum1', '1')
      // console.log('SETUP: seqNum1 WAS NULL!')
    }
    if (localStorage.getItem('key3') == null) {
      // if not, set this keyString to '' (nothing)
      localStorage.setItem('key3', '')
      // console.log('SETUP: key3 WAS NULL! setting to null string...')
    }
  },
  // name: 'foobar',
  data () {
    return {
      openerCall: '',
      focusCall1: '',
      focusCall2: '',
      focusCall3: '',
      focusCall4: '',
      sequenceNumber: 1,

      openingCalls: json.openingCalls,
      numOpeningCalls: 0,
      shuffleOpeningCalls: [],

      focusCalls: json.focusCalls,
      numFocusCalls: 0,
      shuffleFocusCalls: [],

      resolves: json.resolves,
      numResolves: 0,
      shuffleResolves: [],

      CBresolves: [],
      numCBResolves: 0,
      shuffleCBResolves: [],

      nonCBresolves: [],
      numNonCBResolves: 0,
      shuffleNonCBResolves: [],

      filteredOpeningCalls: [], // opening calls after filters are applied
      filteredFocusCalls: [], // focus calls after filters are applied
      filteredResolves: [], // resolves after filters are applied
      filteredCBResolves: [], // resolves after filters are applied
      filteredNonCBResolves: [], // resolves after filters are applied

      currentLevelBasic: null,
      currentLevelSSD: null,
      currentLevelMainstream: null,
      currentLevelPlus: null,
      currentLevelA1: null,
      currentLevelA2: null,

      getoutHTML: '',
      getoutHTML2: '',
      openerHTML: '',
      strDebug: '',
      keyString: ''
    }
  },
  methods: {
    init () {
      // console.log('init -----------------------')
      this.keyString = ''

      this.strDebug = this.shuffleResolves

      const val = +localStorage.getItem('seqNum1') // note '+' sign, because NUMBER
      this.sequenceNumber = val // use persisted value, because this is a RELOAD
      // console.log('init: using persisted value of sequenceNumber = ' + val)

      const val2 = localStorage.getItem('key3') // no '+' because this is a STRING
      this.keyString = val2 // use persisted value, because this is a RELOAD
      // console.log('init: using persisted value of key3 = ' + val2)

      this.newKey() // this will call this.newSequence(), after the shuffle arrays have been initialized

      this.CBresolves = json.resolves.filter(a => { return (a.from === 'CB') })
      this.nonCBresolves = json.resolves.filter(a => { return (a.from !== 'CB') })

      // eslint-disable-next-line no-unused-vars
      // const $q = useQuasar()
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

    // re-init SHUFFLE arrays
    shuffleAll () {
      // console.log('SHUFFLEALL')

      this.numOpeningCalls = this.filteredOpeningCalls.length
      this.shuffleOpeningCalls = [...Array(this.numOpeningCalls)].map((_, i) => i) // initialize shuffle array
      const shuffler = GlobalUtils.seededRandom(this.keyString) // make a shuffler
      shuffler(this.shuffleOpeningCalls) // and shuffle exactly once
      // console.log('Shuffle(openingCalls):' + JSON.stringify(this.shuffleOpeningCalls))

      this.numFocusCalls = this.filteredFocusCalls.length
      this.shuffleFocusCalls = [...Array(this.numFocusCalls)].map((_, i) => i) // initialize shuffle array
      const shuffler2 = GlobalUtils.seededRandom(this.keyString) // make a shuffler
      shuffler2(this.shuffleFocusCalls) // and shuffle exactly once
      // console.log('Shuffle(focusCalls):' + JSON.stringify(this.shuffleFocusCalls))

      this.numResolves = this.filteredResolves.length
      this.shuffleResolves = [...Array(this.numResolves)].map((_, i) => i) // initialize shuffle array
      const shuffler3 = GlobalUtils.seededRandom(this.keyString) // make a shuffler
      shuffler3(this.shuffleResolves) // and shuffle exactly once

      this.numCBResolves = this.filteredCBResolves.length
      this.shuffleCBResolves = [...Array(this.numCBResolves)].map((_, i) => i) // initialize shuffle array
      const shuffler4 = GlobalUtils.seededRandom(this.keyString) // make a shuffler
      shuffler4(this.shuffleCBResolves) // and shuffle exactly once

      this.numNonCBResolves = this.filteredNonCBResolves.length
      this.shuffleNonCBResolves = [...Array(this.numNonCBResolves)].map((_, i) => i) // initialize shuffle array
      const shuffler5 = GlobalUtils.seededRandom(this.keyString) // make a shuffler
      shuffler5(this.shuffleNonCBResolves) // and shuffle exactly once
    },

    // call when there's a new KEY string
    newKey () {
      // console.log('newKey ---------------------')
      // this.sequenceNumber = 1 // new key always takes us back to the beginning
      // alert('newKey: ' + this.keyString)

      localStorage.setItem('key3', this.keyString) // persist the keyString
      // console.log('persisting the key3 = ' + this.keyString)

      this.shuffleAll() // reinit the shuffle arrays, based on the current filtered arrays

      this.newSequence()
    },

    newFilter () {
      const levelBasic = (localStorage.getItem('levelBasic') === 'true')
      // console.log('INDEX NEWFILTER levelBasic:  ' + levelBasic)

      const levelSSD = (localStorage.getItem('levelSSD') === 'true')
      // console.log('INDEX NEWFILTER levelSSD:  ' + levelSSD)

      const levelMainstream = (localStorage.getItem('levelMainstream') === 'true')
      // console.log('INDEX NEWFILTER levelMainstream:  ' + levelMainstream)

      const levelPlus = (localStorage.getItem('levelPlus') === 'true')
      // console.log('INDEX NEWFILTER levelPlus:  ' + levelPlus)

      const levelA1 = (localStorage.getItem('levelA1') === 'true')
      // console.log('INDEX NEWFILTER levelA1:  ' + levelA1)

      const levelA2 = (localStorage.getItem('levelA2') === 'true')
      // console.log('INDEX NEWFILTER levelA2:  ' + levelA2)

      // const difficultyEASY = (localStorage.getItem('difficultyEASY') === 'true')
      // // console.log('INDEX NEWFILTER difficultyEASY:  ' + difficultyEASY)

      // const difficultyHARD = (localStorage.getItem('difficultyHARD') === 'true')
      // // console.log('INDEX NEWFILTER difficultyHARD:  ' + difficultyHARD)

      // const difficultyUNKNOWN = (localStorage.getItem('difficultyUNKNOWN') === 'true')
      // // console.log('INDEX NEWFILTER difficultyUNKNOWN:  ' + difficultyUNKNOWN)

      // const lengthSHORT = (localStorage.getItem('lengthSHORT') === 'true')
      // // console.log('INDEX NEWFILTER lengthSHORT:  ' + lengthSHORT)

      // const lengthMEDIUM = (localStorage.getItem('lengthMEDIUM') === 'true')
      // // console.log('INDEX NEWFILTER lengthMEDIUM:  ' + lengthMEDIUM)

      // const lengthLONG = (localStorage.getItem('lengthLONG') === 'true')
      // // console.log('INDEX NEWFILTER lengthLONG:  ' + lengthLONG)

      if (
        (this.currentLevelBasic !== levelBasic) ||
        (this.currentLevelSSD !== levelSSD) ||
        (this.currentLevelMainstream !== levelMainstream) ||
        (this.currentLevelPlus !== levelPlus) ||
        (this.currentLevelA1 !== levelA1) ||
        (this.currentLevelA2 !== levelA2)
      ) {
        // (this.currentDifficultyEasy !== difficultyEASY) ||
        // (this.currentDifficultyHard !== difficultyHARD) ||
        // (this.currentDifficultyUnknown !== difficultyUNKNOWN) ||
        // (this.currentLengthShort !== lengthSHORT) ||
        // (this.currentLengthMedium !== lengthMEDIUM) ||
        // (this.currentLengthLong !== lengthLONG)) { // if global levels are not the same as local ones
        // console.log('INDEX NEWFILTER: FILTERING *****')

        // ----------------------
        this.filteredOpeningCalls = this.openingCalls.filter(a => { // do the filter operation again with new global values
          return (
            (levelBasic && (a.level.toUpperCase() === 'BASIC')) ||
            (levelSSD && (a.level.toUpperCase() === 'SSD')) ||
            (levelMainstream && (a.level.toUpperCase() === 'MS')) ||
            (levelPlus && (a.level.toUpperCase() === 'PLUS')) ||
            (levelA1 && (a.level.toUpperCase() === 'A1')) ||
            (levelA2 && (a.level.toUpperCase() === 'A2'))
          )
        })
        this.numOpeningCalls = this.filteredOpeningCalls.length
        // this.sequenceNumber = 1 // filter changed, so reset the sequence number back to the start NO.
        // console.log('NEWFILTER: new length of Opening Calls = ' + this.numOpeningCalls)

        // ----------------------
        this.filteredFocusCalls = this.focusCalls.filter(a => { // do the filter operation again with new global values
          return (
            (levelBasic && (a.level.toUpperCase() === 'BASIC')) ||
            (levelSSD && (a.level.toUpperCase() === 'SSD')) ||
            (levelMainstream && (a.level.toUpperCase() === 'MS')) ||
            (levelPlus && (a.level.toUpperCase() === 'PLUS')) ||
            (levelA1 && (a.level.toUpperCase() === 'A1')) ||
            (levelA2 && (a.level.toUpperCase() === 'A2'))
          )
        })
        this.numFocusCalls = this.filteredFocusCalls.length
        // this.sequenceNumber = 1 // filter changed, so reset the sequence number back to the start NO.
        // console.log('NEWFILTER: new length of Focus Calls = ' + this.numFocusCalls)

        // ----------------------
        this.filteredResolves = this.resolves.filter(a => { // do the filter operation again with new global values
          return (
            (levelBasic && (a.level.toUpperCase() === 'BASIC')) ||
            (levelSSD && (a.level.toUpperCase() === 'SSD')) ||
            (levelMainstream && (a.level.toUpperCase() === 'MS')) ||
            (levelPlus && (a.level.toUpperCase() === 'PLUS')) ||
            (levelA1 && (a.level.toUpperCase() === 'A1')) ||
            (levelA2 && (a.level.toUpperCase() === 'A2'))
          )
        })
        this.numResolves = this.filteredResolves.length

        this.filteredCBResolves = this.filteredResolves.filter(a => { return (a.from === 'CB') })
        this.numCBResolves = this.filteredCBResolves.length
        this.filteredNonCBResolves = this.filteredResolves.filter(a => { return (a.from !== 'CB') })
        this.numNonCBResolves = this.filteredNonCBResolves.length
        // this.sequenceNumber = 1 // filter changed, so reset the sequence number back to the start NO.
        // console.log('NEWFILTER: new length of Resolves = ' + this.numResolves)

        // ----------------------------------------------
        // now that we have new filteredOpening/FocusCalls, we need to re-init the shuffle arrays
        this.shuffleAll() // reinit the shuffle arrays, based on the current filtered arrays

        this.currentLevelBasic = levelBasic // and set local values to match globals
        this.currentLevelSSD = levelSSD // and set local values to match globals
        this.currentLevelMainstream = levelMainstream
        this.currentLevelPlus = levelPlus
        this.currentLevelA1 = levelA1
        this.currentLevelA2 = levelA2
        // this.currentDifficultyEasy = difficultyEASY
        // this.currentDifficultyHard = difficultyHARD
        // this.currentDifficultyUnknown = difficultyUNKNOWN
        // this.currentLengthShort = lengthSHORT
        // this.currentLengthMedium = lengthMEDIUM
        // this.currentLengthLong = lengthLONG
      }

      // console.log('NEWFILTER length: ' + filteredSequences.length)
      // console.log('FILTERED sequences: ' + JSON.stringify(filteredSequences))
    },

    // Call this function when the L or R buttons are pushed, to setup new calls in all 3 sections
    // TODO: add weights to everything, so that some are more likely to be chosen earlier
    newSequence () {
      // console.log('newSequence -------------')
      // const persistedSeqNum = localStorage.getItem('seqNum1')
      // console.log('newSequence: persistendSeqNum = ' + persistedSeqNum)
      // this.sequenceNumber = persistedSeqNum

      this.newFilter() // check for filter rules changes

      // console.log('filteredOpeningCalls = ' + this.filteredOpeningCalls)
      // console.log('filteredFocusCalls = ' + this.filteredFocusCalls)
      // console.log('filteredResolves = ' + this.filteredResolves)

      localStorage.setItem('seqNum1', JSON.stringify(this.sequenceNumber)) // persist this value
      // console.log('newSequence persisting seqNum1 = ' + this.sequenceNumber)

      // Set a new Opening Call --------------------------------------
      // console.log('newSequence numFilteredOpeningCalls: ' + this.filteredOpeningCalls.length)
      const o1 = (this.sequenceNumber - 1) % this.filteredOpeningCalls.length // wraps every N sequenceNums
      const o2 = this.shuffleOpeningCalls[o1] // map through the shuffle
      // console.log('o1: ' + o1 + ', o2: ' + o2)
      this.openerCall = (o2 < this.filteredOpeningCalls.length ? this.filteredOpeningCalls[o2].call : '-----')
      this.openerHTML = '&nbsp;' + this.openerCall.split('|').join(', ')

      // Set a new FocusCall #1 --------------------------------------
      // const f1 = Math.floor(Math.random() * this.numFocusCalls)
      const f1 = (this.sequenceNumber - 1) % this.filteredFocusCalls.length
      const f2 = this.shuffleFocusCalls[f1] // map thru the shuffle
      this.focusCall1 = (f2 < this.filteredFocusCalls.length ? this.filteredFocusCalls[f2].call : '-----')

      // --------------------------------------------------------
      // Set a new FocusCall #2, not equal to FocusCall #1 (it's the next one on the list, shuffled)
      // let f2 = 0
      // do {
      //   f2 = Math.floor(Math.random() * this.numFocusCalls)
      // } while (f2 === f1)
      // OK, now this is a bit tricky.  The second focus call is figured out by skipping ahead by about 3/4.5 of the
      //  length of the list, and then going thru the shuffle.  This should make the pairs unique MOST of the time,
      //  and the second focus call will show up as the first focus call about 3/4.5 of the list later.
      //  This makes the pairings unique, and spreads out the calls a bit.  But, everything is still deterministic,
      //  and we can always get back to where we were at any time.
      const f3 = this.shuffleFocusCalls[(f1 + Math.floor(this.filteredFocusCalls.length * 3.0 / 4.5)) % this.filteredFocusCalls.length] // map thru the shuffle
      this.focusCall2 = (f3 < this.filteredFocusCalls.length ? this.filteredFocusCalls[f3].call : '-----') // FIX FIX FIX
      // console.log('f1: ' + f1 + ', f2: ' + f2 + ', f3: ' + f3)

      const f4 = this.shuffleFocusCalls[(f3 + Math.floor(this.filteredFocusCalls.length * 3.0 / 4.5)) % this.filteredFocusCalls.length] // map thru the shuffle
      this.focusCall3 = (f4 < this.filteredFocusCalls.length ? this.filteredFocusCalls[f4].call : '-----') // FIX FIX FIX

      const f5 = this.shuffleFocusCalls[(f4 + Math.floor(this.filteredFocusCalls.length * 3.0 / 4.5)) % this.filteredFocusCalls.length] // map thru the shuffle
      this.focusCall4 = (f5 < this.filteredFocusCalls.length ? this.filteredFocusCalls[f5].call : '-----') // FIX FIX FIX

      // Set a new FIRST resolve (CB) --------------------------------------
      // const r1 = Math.floor(Math.random() * this.numResolves)
      const r0 = this.sequenceNumber - 1
      const r1 = (this.filteredCBResolves.length > 0 ? (r0) % this.filteredCBResolves.length : 0)
      const r2 = (this.filteredCBResolves.length > 0 ? this.shuffleCBResolves[r1] : 0) // map thru the shuffle
      // console.log('r0: ' + r0 + ', r1: ' + r1 + ', r2: ' + r2)
      const defaultResolve = { level: 'MS', from: '-----', calls: '-----|-----|-----|-----' }
      const resolve = (r2 < this.filteredCBResolves.length && this.filteredCBResolves.length > 0 ? this.filteredCBResolves[r2] : defaultResolve) // chosen resolve
      // console.log('resolve: ' + resolve + ', calls: ' + resolve.calls)
      const individualCalls = resolve.calls.split('|')
      const numIndividualCalls = individualCalls.length
      // console.log('foo: ' + numIndividualCalls)
      // const extraBRs = '<BR/>'.repeat(5 - numIndividualCalls)  # BUG in QUASAR -- this messes up sequenceNumber!
      let extraBRs = ''
      for (let i = 0; i < 12 - numIndividualCalls; i++) {
        extraBRs = extraBRs + '<br/>'
      }
      // this.getoutHTML = 'r1:' + r1 + 'r2:' + r2 + ';' + resolve + individualCalls + numIndividualCalls
      this.getoutHTML = '<span class="getoutFASR">&nbsp;(' + resolve.from + ')</span><br/>&nbsp;' + resolve.calls.split('|').join('<br/>&nbsp;') + extraBRs
      // console.log('getoutHTML:' + this.getoutHTML)

      // Set a new SECOND resolve --------------------------------------
      const r0b = this.sequenceNumber
      const r1b = (this.filteredNonCBResolves.length > 0 ? (r0b) % this.filteredNonCBResolves.length : 0)
      const r2b = (this.filteredNonCBResolves.length > 0 ? this.shuffleNonCBResolves[r1b] : 0) // map thru the shuffle
      const resolve2 = (r2b < this.filteredNonCBResolves.length && this.filteredNonCBResolves.length > 0 ? this.filteredNonCBResolves[r2b] : defaultResolve) // chosen resolve
      // console.log('resolve: ' + resolve + ', calls: ' + resolve.calls)
      const individualCalls2 = resolve2.calls.split('|')
      const numIndividualCalls2 = individualCalls2.length
      // console.log('foo: ' + numIndividualCalls)
      // const extraBRs = '<BR/>'.repeat(5 - numIndividualCalls)  # BUG in QUASAR -- this messes up sequenceNumber!
      let extraBRs2 = ''
      for (let i = 0; i < 12 - numIndividualCalls2; i++) {
        extraBRs2 = extraBRs2 + '<br/>'
      }
      // this.getoutHTML = 'r1:' + r1 + 'r2:' + r2 + ';' + resolve + individualCalls + numIndividualCalls
      this.getoutHTML2 = '<span class="getoutFASR">&nbsp;(' + resolve2.from + ')</span><br/>&nbsp;' + resolve2.calls.split('|').join('<br/>&nbsp;') + extraBRs2
      // console.log('getoutHTML:' + this.getoutHTML)
    },

    previousSeq () {
      // console.log('INDEX: previous sequence ' + this.sequenceNumber)
      if (this.sequenceNumber > 1) {
        this.sequenceNumber = this.sequenceNumber - 1
        this.newSequence()
      }
    },

    nextSeq () {
      // console.log('INDEX: next sequence ' + this.sequenceNumber)
      // NOTE: in Index.vue, there is no limit to the number of sequences we generate
      this.sequenceNumber = this.sequenceNumber + 1
      this.newSequence()
    },

    home () {
      // go to sequenceNumber 1
      this.sequenceNumber = 1
      this.newSequence()
    },

    // end () {
    //   // go to sequenceNumber LAST
    //   this.sequenceNumber = this.numSequences
    //   this.newSequence()
    // },

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
      this.sequenceNumber = this.sequenceNumber + 10 // NOTE: no limit here
      this.newSequence()
    },

    keyPressed (event) {
      if (this.$router.currentRoute.value.fullPath !== '/rand') {
        return
      }
      // console.log('INDEX: key pressed: ' + event.which)
      switch (event.which) {
        case 33: this.pageUP(); break // PAGE UP key
        case 34: this.pageDOWN(); break // PAGE DOWN key
        // case 35: this.end(); break // END key
        case 36: this.home(); break // HOME key
        case 37: this.previousSeq(); break // left arrow
        case 39: this.nextSeq(); break // right arrow
        default: break
      }
    } //,

  }, // methods

  created () {
    this.init() // after the page is created, do some initialization....
    // console.log('INDEX INIT! *******')
    window.addEventListener('keydown', this.keyPressed)
  }

}

</script>

<style lang="sass">
.opener
  font-size: 24pt
  color: blue
.focus2
  font-size: 24pt
  color: green
.getout
  font-size: 24pt
  color: black
.getoutFASR
  font-size: 24pt
  color: red
.debug
  font-size: 12pt
  color: black
.metadata
  font-size: 18pt
  text-decoration: underline
body
  touch-action: pan-x pan-y
  overflow: hidden
</style>
