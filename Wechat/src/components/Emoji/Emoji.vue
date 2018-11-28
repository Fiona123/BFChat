<template>
    <svg class="icon" aria-hidden="true">
      <use v-bind:xlink:href="name"></use>
    </svg>
</template>

<script>
import './iconfont.js'

export default {
    props: {
        name: {
            type: String,
            default: '#icon--cry'
        }
    }
}
</script>

<style>
.icon {
    width: 1.5em;
    height: 1.5em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
}
</style>
