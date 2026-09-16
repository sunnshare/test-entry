export default {
    id: "shop",
    name: "Shop-市场采购模块",
    desc: "shop_pc_vue3",
    urls: {
        vs2: "https://wxtest.51tyty.com/marketing/front/shop/index.html",
        xs: "https://wxxs.51tyty.com/marketing/front/shop/index.html",
        prod: "https://mall.lingshi.com/marketing/front/shop/index.html",
    },
    routeGroups: [
        {
            module: "商城",
            routes: [
                { label: "商城首页", path: "/market/index", tip: "进这个就行" },
                { label: "登录页", path: "/loginPage" },
            ],
        },
    ],
};
