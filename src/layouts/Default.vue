<template>
  <div class="layout">
    <header>
      <nav class="nav__link" v-if="$context.parent">
        <g-link :to="$context.parent.item._url">{{$context.parent.item.title}}</g-link>
      </nav>
      <nav class="nav__link" v-for="child in $context.children" :key="child.id">
        <g-link :to="child.item._url">{{child.item.title}}</g-link>
      </nav>
    </header>
    <slot />
  </div>
</template>

<static-query>
query {
  metadata {
    siteName
  }
}
</static-query>

<style>
body {
  font-family: -apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
  margin:0;
  padding:0;
  line-height: 1.5;
}

.layout {
  max-width: 760px;
  margin: 0 auto;
  padding-left: 20px;
  padding-right: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  height: 80px;
}

.nav__link {
  margin-left: 20px;
}
</style>
