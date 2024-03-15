<template>
  <q-page class="bg-grey-3 column">
    <div class="row">
      <div class="col">
    <q-list class="bg-white" separator bordered dense>
      <q-item
          v-for="(task) in tasks.filter( (element, index) => index < 25 && (element.level.includes('Basic') || element.level.includes('MS')))"
          :key="task.call"
          @click="task.done = !task.done"
          :class="{ 'done bg-blue-1' : task.done }"
          clickable
          v-ripple>
        <q-item-section avatar>
          <q-checkbox
          v-model="task.done"
          class="no-pointer-events"
          color="primary" />
        </q-item-section>
        <q-item-section>
          <q-item-label class = "focus4"><span :class="{basic : task.level.includes('Basic')}"><span :class="{ms : task.level.includes('MS')}">{{ task.call }}</span></span></q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
      </div>
      <div class="col">
    <q-list class="bg-white" separator bordered dense>
      <q-item
          v-for="(task) in tasks.filter( (element, index) => index >= 25 && (element.level.includes('Basic') || element.level.includes('MS')))"
          :key="task.call"
          @click="task.done = !task.done"
          :class="{ 'done bg-blue-1' : task.done }"
          clickable
          v-ripple>
        <q-item-section avatar>
          <q-checkbox
          v-model="task.done"
          class="no-pointer-events"
          color="primary" />
        </q-item-section>
        <q-item-section>
          <q-item-label class = "focus4"><span :class="{basic : task.level.includes('Basic')}"><span :class="{ms : task.level.includes('MS')}">{{ task.call }}</span></span></q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
      </div>
    </div>
    <div
      v-if="!tasks.length"
      class="no-tasks absolute-center">
      <q-icon
      name="check"
      size="100px"
      color="primary">
      </q-icon>
      <div class="text-h5 text-primary text-center">
        No tasks
      </div>
    </div>
  </q-page>
</template>

<script>

import json from 'assets/calls.json'

export default {
  data () {
    return {
      newTask: '',
      tasks: json.ssdCalls
    }
  },

  methods: {
    addTask () {
      this.tasks.push({
        title: this.newTask,
        done: false
      })
      this.newTask = ''
    }
  }
}
</script>

<style lang="scss">
  .done {
    .q-item__label {
      text-decoration: line-through;
      color: #bbb;
    }
  }

  .no-tasks {
    opacity: 0.5;
  }

  .focus4 {
    font-size: 18pt;
    color: black;
  }

  .basic {
    color: #eb7734;
  }

  .ms {
    color: green;
  }

  .plus {
    color: rgb(158, 9, 9);
  }

</style>
