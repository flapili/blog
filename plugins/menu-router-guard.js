export default function(ctx) {
    ctx.app.router.afterEach((to, from) => {
        if (to.path.includes("/posts")) {
            ctx.store.commit("menu-active-item/update", "/posts")
        } else {
            ctx.store.commit("menu-active-item/update", to.path)
        }
    })
}