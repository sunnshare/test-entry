export default {
    id: "admin",
    name: "Admin-营销模块",
    desc: "marketing-web-admin",
    urls: {
        vs2: "https://wxtest.51tyty.com/marketing/front/admin/",
        xs: "https://wxxs.51tyty.com/marketing/front/admin/",
        prod: "https://wechat.51tyty.com/marketing/front/admin/",
    },
    routeGroups: [
        { module: "招生宝", routes: [{ label: "模板库", path: "/recruit/templateLib" }] },
        { module: "在线商城", routes: [{ label: "商品列表", path: "/goods/index" }] },
        { module: "转介绍", routes: [{ label: "转介绍", path: "/promotion/promoteList" }] },
        { module: "优惠券", routes: [{ label: "优惠券", path: "/activity/coupon" }] },
        { module: "卡券管理", routes: [{ label: "电子卡券", path: "/order/index" }] },
        { module: "分佣推广", routes: [{ label: "分销设置", path: "/distribution/setup" }] },
        { module: "商城数据", routes: [{ label: "商城数据", path: "/data/index" }] },
        { module: "商城设置", routes: [{ label: "海报模板", path: "/other/index" }] },
        { module: "小程序预览", routes: [{ label: "小程序", path: "/preview/minp" }] },
    ],
};
