export const state = () => ({
    last_articles: []
  })

export const mutations = {
  update_last(state, last_articles) {
      state.last_articles = last_articles
},
}