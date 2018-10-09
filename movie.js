const request = require("request")
const cheerio = require("cheerio")
const fs = require("fs")
const URL = "https://movie.douban.com/j/search_subjects?type=movie&tag=%E8%B1%86%E7%93%A3%E9%AB%98%E5%88%86&sort=time&page_limit=500&page_start=0"
const urlList = []
let num = 0	//从num开始、索引

$http(URL).then(res => {
	const data = JSON.parse(res).subjects
	console.log(data)
	for (let i = 0; i < data.length; i++) {
		if (data[i].url) {
			urlList.push(data[i].url)
		}
	}
	getMovieInfo(urlList[num])
}).catch(err => {
	console.log(err)
})

//数据请求
function $http(dataUrl) {
	//发送请求
	return new Promise((resolve, reject) => {
		request({
			url: dataUrl,
			method: 'GET'
		}, (err, red, body) => {
			//请求到body
			if (err) {
				console.error('[ERROR]Collection' + err);
				reject(err)
				return;
			}
			resolve(body)
		})
	})
}

function getMovieInfo(URL) {
	if (num >= urlList.length) {
		console.error("成功执行所有操作")
		return
	}
	$http(URL).then(res => {
		const $ = cheerio.load(res);
		const info = getAllinfo($)
		const title = getTitle($)	//电影名字
		console.log(title)

		const doctor = info["导演"]	//导演名字
		console.log("导演：" + doctor)

		const country = info["制片国家/地区"]	//所属国家
		console.log("所属国家：" + country)

		const language = info["语言"]
		console.log("语言：" + language)

		const year = info["上映日期"] ? info["上映日期"].split('-')[0] : 2018
		console.log("上映年份：" + year)

		const poster = getPoster($)	//海报地址
		console.log("海报地址：" + poster)

		const flash = getFlash($)	//播放地址
		console.log("播放地址：" + flash)

		const summary = getSummary($)	//电影详情
		console.log("电影详情：" + summary)

		console.log("*****************" + "电影名字：" + title + ':' + urlList[num], '当前执行：' + num + "*****************")
		//存储信息代码....
		//fs.writeFile

		num++
		getMovieInfo(urlList[num])
	}).catch(err => {
		console.log(err)
		console.error("出错了!!!!" + urlList[num])
	})
}
function getAllinfo($) {
	const list = $("#info").text().split("\n")
	const obj = {}
	for (let i = 0; i < list.length; i++) {
		const item = list[i].replace(/\s/g, "")
		if (item) {
			const key = item.split(":")[0] ? item.split(":")[0].trim() : ""
			const value = item.split(":")[1] ? item.split(":")[1].trim() : ""
			if (key && value) {
				obj[key] = value
			}
		}
	}
	return obj
}
function getTitle($) {
	const title = $("#content h1").find("span").eq(0).text().split(" ")[0]
	return title
}
function getPoster($) {
	const url = $("#mainpic").find("img").attr("src")
	return url
}

function getFlash($) {
	const flash = $("#related-pic").find(".label-trailer a").attr("href") || "www.baidu.com"
	return flash
}
function getSummary($) {
	const summary = $("#link-report").find("span").text().trim().split(/\n/)[0] || '无'
	return summary
}
