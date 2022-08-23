<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="settings"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          SquareDesk Tip Planner V1.11
        </q-toolbar-title>

        <q-tabs v-model="whichTab" shrink stretch dense inline-label>
          <q-route-tab name="randomizerTab" icon="shuffle" to="rand" label="Randomizer" />
          <q-route-tab name="sequencesTab" icon="list" to="seq" label="Sequences" />
          <q-route-tab name="singersTab" icon="music_note" to="sing" label="Singers" />
          <q-route-tab name="checklistTab" icon="checklist" to="check" label="Checklist" />
        </q-tabs>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      elevated
    >
      <q-item-label header>Level</q-item-label>
      <q-checkbox v-model="levelBasic" label="Basic" v-on:click="toggleLevel('basic')" />
      <q-checkbox v-model="levelMainstream" label="Mainstream" v-on:click="toggleLevel('mainstream')" />
      <q-checkbox v-model="levelPlus" label="Plus" v-on:click="toggleLevel('plus')" />
      <q-checkbox v-model="levelA1" label="A1" v-on:click="toggleLevel('a1')" />
      <q-checkbox v-model="levelA2" label="A2" v-on:click="toggleLevel('a2')"  />
      <q-separator/>

      <q-item-label header>Difficulty</q-item-label>
      <q-checkbox v-model="difficultyEASY" label="EASY" v-on:click="toggleDifficulty('EASY')" />
      <q-checkbox v-model="difficultyHARD" label="HARD" v-on:click="toggleDifficulty('HARD')" />
      <q-checkbox v-model="difficultyUNKNOWN" label="UNKNOWN" v-on:click="toggleDifficulty('UNKNOWN')" />
      <q-separator/>

      <q-item-label header>Length</q-item-label>
      <q-checkbox v-model="lengthSHORT" label="Short (< 8 calls)" v-on:click="toggleLength('SHORT')" />
      <q-checkbox v-model="lengthMEDIUM" label="Medium (9 - 15 calls)" v-on:click="toggleLength('MEDIUM')" />
      <q-checkbox v-model="lengthLONG" label="Long (> 15 calls)" v-on:click="toggleLength('LONG')" />
      <q-separator/>

      <q-list>
        <q-item-label
          header
        >
          Essential Links
        </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- <q-footer elevated>
            <q-toolbar>
              <q-input label="KEY:" name="key" dense label-color="white" color="white"></q-input>-001&nbsp;&nbsp;
              <q-btn icon="arrow_back" label="previous sequence" color="orange" @click="()=> alert('hello world')" />&nbsp;
              <q-btn icon-right="arrow_forward" label="next sequence" color="green"/>
            </q-toolbar>
    </q-footer> -->

  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue'

const linksList = [
  {
    title: 'Report bugs',
    caption: 'GitHub bug tracking for SquareDesk',
    icon: 'code',
    link: 'https://github.com/mpogue2/SquareDesk/issues'
  },
  {
    title: 'SquareDesk',
    caption: 'Home of SquareDesk',
    icon: 'school',
    link: 'https://squaredesk.net'
  }
]

import { defineComponent, ref } from 'vue'
// import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  watch: {
    'leftDrawerOpen' () {
      if (this.leftDrawerOpen) { // if it is showing
        // do something
        // console.log('DRAWER OPENED')
      } else { // if hidden
        // do something
        // console.log('DRAWER CLOSED')
        window.location.reload() // reload the page to pick up the new global variables
      }
    }
  },

  setup () {
    const leftDrawerOpen = ref(false)
    const whichTab = ref('')

    const levelBasic = ref(true)
    const levelMainstream = ref(true)
    const levelPlus = ref(true)
    const levelA1 = ref(false)
    const levelA2 = ref(false)

    const difficultyEASY = ref(true)
    const difficultyHARD = ref(true)
    const difficultyUNKNOWN = ref(true)

    const lengthSHORT = ref(true)
    const lengthMEDIUM = ref(true)
    const lengthLONG = ref(true)

    if (localStorage.getItem('levelBasic') == null) {
      // console.log('initializing localStorage.levelBasic to TRUE')
      levelBasic.value = true
      localStorage.setItem('levelBasic', true)
    } else {
      levelBasic.value = (localStorage.getItem('levelBasic') === 'true')
      // console.log('initialized levelBasic from localStorage to: ', levelBasic.value)
    }
    if (localStorage.getItem('levelMainstream') == null) {
      // console.log('initializing localStorage.levelMainstream to TRUE')
      levelMainstream.value = true
      localStorage.setItem('levelMainstream', true)
    } else {
      levelMainstream.value = (localStorage.getItem('levelMainstream') === 'true')
      // console.log('initialized levelMainstream from localStorage to: ', levelMainstream.value)
    }
    if (localStorage.getItem('levelPlus') == null) {
      // console.log('initializing localStorage.levelPlus to TRUE')
      levelPlus.value = true
      localStorage.setItem('levelPlus', true)
    } else {
      levelPlus.value = (localStorage.getItem('levelPlus') === 'true')
      // console.log('initialized levelPlus from localStorage to: ', levelPlus.value)
    }
    if (localStorage.getItem('levelA1') == null) {
      // console.log('initializing localStorage.levelA1 to FALSE')
      levelA1.value = false
      localStorage.setItem('levelA1', false)
    } else {
      levelA1.value = (localStorage.getItem('levelA1') === 'true')
      // console.log('initialized levelA1 from localStorage to: ', levelA1.value)
    }
    if (localStorage.getItem('levelA2') == null) {
      // console.log('initializing localStorage.levelA2 to FALSE')
      levelA2.value = false
      localStorage.setItem('levelA2', false)
    } else {
      levelA2.value = (localStorage.getItem('levelA2') === 'true')
      // console.log('initialized levelA2 from localStorage to: ', levelA2.value)
    }
    // difficulty init ------------
    if (localStorage.getItem('difficultyEASY') == null) {
      // console.log('initializing localStorage.difficultyEASY to TRUE')
      difficultyEASY.value = true
      localStorage.setItem('difficultyEASY', true)
    } else {
      difficultyEASY.value = (localStorage.getItem('difficultyEASY') === 'true')
      // console.log('initialized difficultyEASY from localStorage to: ', difficultyEASY.value)
    }
    if (localStorage.getItem('difficultyHARD') == null) {
      // console.log('initializing localStorage.difficultyHARD to TRUE')
      difficultyHARD.value = true
      localStorage.setItem('difficultyHARD', true)
    } else {
      difficultyHARD.value = (localStorage.getItem('difficultyHARD') === 'true')
      // console.log('initialized difficultyHARD from localStorage to: ', difficultyHARD.value)
    }
    if (localStorage.getItem('difficultyUNKNOWN') == null) {
      // console.log('initializing localStorage.difficultyUNKNOWN to TRUE')
      difficultyUNKNOWN.value = true
      localStorage.setItem('difficultyUNKNOWN', true)
    } else {
      difficultyUNKNOWN.value = (localStorage.getItem('difficultyUNKNOWN') === 'true')
      // console.log('initialized difficultyUNKNOWN from localStorage to: ', difficultyUNKNOWN.value)
    }

    // length init ------------
    if (localStorage.getItem('lengthSHORT') == null) {
      // console.log('initializing localStorage.lengthSHORT to TRUE')
      lengthSHORT.value = true
      localStorage.setItem('lengthSHORT', true)
    } else {
      lengthSHORT.value = (localStorage.getItem('lengthSHORT') === 'true')
      // console.log('initialized lengthSHORT from localStorage to: ', lengthSHORT.value)
    }
    if (localStorage.getItem('lengthMEDIUM') == null) {
      // console.log('initializing localStorage.lengthMEDIUM to TRUE')
      lengthMEDIUM.value = true
      localStorage.setItem('lengthMEDIUM', true)
    } else {
      lengthMEDIUM.value = (localStorage.getItem('lengthMEDIUM') === 'true')
      // console.log('initialized lengthMEDIUM from localStorage to: ', lengthMEDIUM.value)
    }
    if (localStorage.getItem('lengthLONG') == null) {
      // console.log('initializing localStorage.lengthLONG to TRUE')
      lengthLONG.value = true
      localStorage.setItem('lengthLONG', true)
    } else {
      lengthLONG.value = (localStorage.getItem('lengthLONG') === 'true')
      // console.log('initialized lengthLONG from localStorage to: ', lengthLONG.value)
    }

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      levelBasic,
      levelMainstream,
      levelPlus,
      levelA1,
      levelA2,
      difficultyEASY,
      difficultyHARD,
      difficultyUNKNOWN,
      lengthSHORT,
      lengthMEDIUM,
      lengthLONG,
      whichTab,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
        // console.log('***** toggleLeftDrawer now: ' + leftDrawerOpen.value)
      },
      toggleLength (len) {
        // console.log('toggleLength: ' + len)
        // console.log(lengthSHORT.value + ', ' + lengthMEDIUM.value + ', ' + lengthLONG.value)
        // write all values to localStorage -- these are GLOBAL preferences!
        localStorage.setItem('lengthSHORT', lengthSHORT.value)
        localStorage.setItem('lengthMEDIUM', lengthMEDIUM.value)
        localStorage.setItem('lengthLONG', lengthLONG.value)
      },
      toggleDifficulty (difficulty) {
        // console.log('TOGGLEDIFFICULTY: ' + difficulty)
        // console.log(difficultyEASY.value + ', ' + difficultyHARD.value + ', ' + difficultyUNKNOWN.value)
        // write all values to localStorage -- these are GLOBAL preferences!
        localStorage.setItem('difficultyEASY', difficultyEASY.value)
        localStorage.setItem('difficultyHARD', difficultyHARD.value)
        localStorage.setItem('difficultyUNKNOWN', difficultyUNKNOWN.value)
      },
      toggleLevel (level) {
        // console.log('TOGGLELEVEL: ' + level)
        // console.log(levelBasic.value + ', ' + levelMainstream.value + ', ' + levelPlus.value + ', ' + levelA1.value + ', ' + levelA2.value)
        // write all values to localStorage -- these are GLOBAL preferences!
        localStorage.setItem('levelBasic', levelBasic.value)
        localStorage.setItem('levelMainstream', levelMainstream.value)
        localStorage.setItem('levelPlus', levelPlus.value)
        localStorage.setItem('levelA1', levelA1.value)
        localStorage.setItem('levelA2', levelA2.value)
      }
    }
  }
})
</script>
