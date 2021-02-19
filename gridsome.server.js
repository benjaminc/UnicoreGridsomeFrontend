// Server API makes it possible to hook into various parts of Gridsome
// on server-side and add custom data to the GraphQL data layer.
// Learn more: https://gridsome.org/docs/server-api/

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`
const axios = require('axios')

module.exports = function (api) {
  // The loadSource method is called at the beginning of the build process, and is where we load our custom data into the GraphQL data store
  api.loadSource(async ({ addCollection, store }) => {
    // Use the Data Store API here: https://gridsome.org/docs/data-store-api/
    const { data } = await axios.get('https://benjamin-unicore-gridsome-app.azurewebsites.net/api/data/content')

    // Each collection results in two nodes under the main GraphQL query node.  One with the name we provide ('umbraco' for the one here), which can be used to query a single item, and another called 'allUmbraco' which provides access to all nodes.
    const umbraco = addCollection('Umbraco')
    var map = {};

    data.forEach(item => {
      const type = item['_contentType']
      const id = item['_key']
      const parent = item['_parentKey']
      const children = item['_childKeys']

      // Here we create the node that we are going to store in GraphQL.  The store.createReference calls tells Gridsome that this node is related to other nodes we will be adding, using the id value or values we provide.  This way you can use GraphQL queries to retrieve multiple related nodes in a single query
      const node = { id, item, children: children && children.length ? store.createReference('Umbraco', children) : null, parent: parent && parent.length ? store.createReference('Umbraco', parent) : null }

      if (type) {
        // While not needed for our demo here, you can add additional collections, such as one per document type, to make querying specific types of content easier
        if (!map[type]) map[type] = addCollection(type);
        map[type].addNode(node)
      }

      umbraco.addNode(node)
    })
  })

  // This is called after all the data is loaded.  It is where we can retrieve data from GraphQL (from any data source that was loaded above), and use it to build a dynamic page structure.  In our query here, we are grabbing details about each node, its children, and its parent.  The children and parent fields will be null if the node doesn't have children or a parent
  api.createPages(async ({ createPage, graphql }) => {
    // Use the Pages API here: https://gridsome.org/docs/pages-api/
    const { data } = await graphql(`
    query {
      allUmbraco {
        edges {
          node {
            id
            children { id item { _name _url title } }
            parent { id item { _name _url title } }
            item { _name _url _template title content }
          }
        }
      }
    }
    `)

    console.log('Found ' + data.allUmbraco.edges.length + ' pages')
    // Finally, we are going to loop through the data we got back from GraphQL to actually create the pages.  We check to make sure that the node we are looking at has a URL and a template (meaning it isn't a data node), and then use those pieces of information to create a page using the path and template name specified in Umbraco
    data.allUmbraco.edges.forEach(({ node }) => {
      if (node && node.item && node.item._url && node.item._url.length && node.item._template && node.item._template.length) {
        const template = node.item._template[0].toUpperCase() + node.item._template.substring(1)
        console.log(`Creating ${template} page at ${node.item._url} for ${node.item.title}`)
        createPage({
          path: node.item._url,
          component: `./src/templates/${template}.vue`,
          context: node
        })
      }
    })
  })
}