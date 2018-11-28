<template>
    <div>
        <img :src="imageUrl" class="singlepinc" ref="image" @load="imageLoaded">
    </div>
</template>

<script>
export default {
    props: {
        imageUrl: {
            type: String,
            default: ''
        }
    },
    methods: {
        imageLoaded () {
            this.$emit('load')
        }
    }
}
</script>

<style>
.singlepinc{
    max-width: 70%;
   /* margin: 0px 20px 5px 20px;*/
}
</style>
