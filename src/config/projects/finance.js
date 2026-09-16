export default {
    id: "finance",
    name: "Finance-财务中心模块",
    desc: "finance-center",
    urls: {
        vs2: "https://stage2finance.lingshi.com/",
        xs: "https://prefinance.lingshi.com/",
        prod: "https://finance.lingshi.com/",
    },
    routeGroups: [
        {
            module: "订单管理",
            routes: [
                { label: "订单列表", path: "/order/list" },
                { label: "订单明细", path: "/order/sublist" },
            ],
        },
        { module: "收支管理", routes: [{ label: "收支明细", path: "/shouZhi/list" }] },
        { module: "收银宝", routes: [{ label: "收银宝交易记录", path: "/SYB/transaction" }] },
        {
            module: "商城营收（老提现）",
            routes: [
                { label: "交易记录", path: "/mallIncome/transaction", tip: "老提现使用" },
                { label: "收入提现", path: "/mallIncome/withdrawal", tip: "老提现使用" },
            ],
        },
    ],
};
