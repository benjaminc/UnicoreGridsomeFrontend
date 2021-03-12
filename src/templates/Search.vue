<template>
  <layout>
    <h1>{{$context.item.title}}</h1>
    <div>
        <form @submit.stop.prevent="performSearch">
            <label>Enter a search term: <input v-model="searchTerm" placeholder="search text" /></label>
            <input type="submit" value="Search" />
        </form>
    </div>
    <div v-if="results === null">
    </div>
    <div v-else-if="results.length === 0">
        No matching results were found
    </div>
    <div v-else>
        <div v-for="(result, index) in results" :key="index" class="search-result">
            <g-link :to="findUrl(result.objectID)" class="search-title" v-html="result._highlightResult.title.value"></g-link>
            <div v-html="result._snippetResult.content.value"></div>
        </div>
    </div>
  </layout>
</template>

<script>
import algolia from 'algoliasearch/lite'
const client = algolia(process.env.GRIDSOME_ALGOLIA_APPLICATION_ID, process.env.GRIDSOME_ALGOLIA_API_KEY)
const index = client.initIndex(process.env.GRIDSOME_ALGOLIA_INDEX_NAME)

export default {
    data: function() {
        return {
            searchTerm: null,
            results: null
        }
    },
    methods: {
        findUrl: function(objectID) {
            const match = this.$static.allPage.find(x => x.context && x.context.id === objectID)
            return match ? match.path : null
        },
        performSearch: async function() {
            const me = this
            const result = await index.search(me.searchTerm, {
                attributesToRetrieve: ['objectID'],
                attributesToHighlight: ['title'],
                attributesToSnippet: ['content'],
                highlightPreTag: '<span class="search-highlight">',
                highlightPostTag: '</span>'
            })
            const hits = result.hits

            if (!me.results) me.results = []
            me.results.splice(0, me.results.length, ...hits)
        }
    }
}
</script>

<static-query>
query {
  allPage {
    path
    context
  }
}
</static-query>


<style>
.search-result {
    margin-top: 3em;
}
.search-title {
    font-size: 1.6em;
}
.search-highlight {
    background-color: #FFFF88;
}
</style>