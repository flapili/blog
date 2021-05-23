export const state = () => ({
    activeIndex: null
})

export const mutations = {
    update(state, activeIndex) {
        state.activeIndex = activeIndex
    },
}