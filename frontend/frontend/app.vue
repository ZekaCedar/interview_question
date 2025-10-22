<script setup>
import { useTimer } from '~/app/composables/useTimer'

const room1 = useTimer(300, "room1")
const room2 = useTimer(300, "room2")
const room3 = useTimer(300, "room3")
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <div>
      <h1>Room 1 - {{ room1.formatted }}</h1>
      <button @click="room1.start ">Start</button>
      <button @click="room1.stop ">Stop</button>
      <button @click="room1.restart">Restart</button>
    </div>

    <div>
      <h1>Room 2 - {{ room2.formatted }}</h1>
      <button @click="room2.start">Start</button>
      <button @click="room2.stop">Stop</button>
      <button @click="room2.restart">Restart</button>
    </div>

    <div>
      <h1>Room 3 - {{ room3.formatted }}</h1>
      <button @click="room3.start">Start</button>
      <button @click="room3.stop">Stop</button>
      <button @click="room3.restart">Restart</button>
    </div>

    <!-- <NuxtWelcome /> -->
  </div>
</template>