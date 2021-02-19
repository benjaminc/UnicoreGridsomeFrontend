<template>
  <layout>
    <h1>{{$context.item.title}}</h1>
    <div v-html="updateContent($context.item.content)"></div>
  </layout>
</template>

<script>
export default {
    methods: {
        updateContent: function(content) {
            return content ? content.replace(/(<img src=['"])/g, "$1" + process.env.GRIDSOME_MEDIA_BASE) : ''
        }
    }
}
</script>