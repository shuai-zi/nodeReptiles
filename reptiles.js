const Nightmare = require('nightmare')
const URL = 'http://roll.news.qq.com/'

const nightmare = Nightmare({
    show: true, //显示electron窗口
    pollInterval: 1000,
    waitTimeout: 90000000
})

nightmare
    .goto(URL)
    .inject('js', 'jquery.min.js')

    .wait(() => document.querySelectorAll("#artContainer li").length > 0)
    .wait(() => {
        $(".moreLink_con a:contains('体育')").click()
        return true;
    })
    .wait(() => document.querySelectorAll("#artContainer li").length > 0)
    .inject('js', 'jquery.min.js')
    .wait(() => {
        news = [];
        comments = [];
        page = $("#totalPage").val()
        saveInfo = doms => {
            doms.each(function () {
                const title = $(this).find('a').text();
                const href = $(this).find('a').attr("href")
                news.push({
                    title,
                    href
                });
            });
        }
        return true
    })
    .wait(() => {
        if ($(".loading").length) return false;
        const _doms = $('#artContainer li')
        if (page === 1) {
            saveInfo(_doms)
            return true;
        } else {
            saveInfo(_doms)
            $("#pageArea a.f12:contains('下一页')").click()
            page--
            return false
        }
    })
    .evaluate(() => news)
    .end()
    .then(res => console.log(res, res.length))
    .catch(err => console.error(err))