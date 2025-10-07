// 全局变量
const birthdayMap = {
    2024: "2024-10-8",
    2025: "2025-10-8",
    2026: "2026-10-8",
    2027: "2027-10-8",
    2028: "2028-10-8",
    2029: "2029-10-8",
    2030: "2030-10-8",
}
const $btn = $("#birth-start-btn")
const $main = $(".main")
let intervalId = null
let snowflakes = null

// 支持通过 URL 查询参数个性化：?name=名字&inline=昵称&type=称呼&title=页面标题&unlock=1&date=MM-DD 或 YYYY-MM-DD
const params = new URLSearchParams(window.location.search)
const customName = params.get("name")
const inlineName = params.get("inline") || customName
const peopleType = params.get("type")
const customTitle = params.get("title")
const unlock = params.get("unlock") === "1"
const customDate = params.get("date")

// 页面加载完成
$(document).ready(function () {
    // 雪花飞舞
    snowflakes = new Snowflakes({
        color: "#ffd700",
        minSize: 20,
    })
    // 淡出内容
    $main.fadeOut(1)
    // 通过参数个性化展示内容
    if (customTitle) document.title = customTitle
    if (customName) $("#name").text(customName)
    if (inlineName) $("#inline-name").text(inlineName)
    if (peopleType) $("#people-type").text(peopleType)
    // 生日倒计时
    intervalId = setInterval(birthdayCountdown, 1000)
    // 如果需要立即解锁按钮
    if (unlock) {
        clearInterval(intervalId)
        $btn.text("来吧，展示")
        $btn.prop("disabled", false)
    }
    // 按钮点击
    $btn.click(pageRender)
})

function birthdayCountdown() {
    // 获取当前时间和今年生日
    const now = dayjs()
    const curYearStr = now.format("YYYY")
    let birthday
    // 优先使用自定义日期
    if (customDate) {
        if (/^\d{4}-\d{2}-\d{2}$/.test(customDate)) {
            birthday = dayjs(customDate)
        } else if (/^\d{2}-\d{2}$/.test(customDate)) {
            birthday = dayjs(`${curYearStr}-${customDate}`)
        } else {
            birthday = dayjs(birthdayMap[curYearStr])
        }
    } else {
        birthday = dayjs(birthdayMap[curYearStr])
    }

    // 生日当天关闭倒计时，解锁按钮支持可点击
    if (now.format("YYYY-MM-DD") === birthday.format("YYYY-MM-DD")) {
        clearInterval(intervalId)
        $btn.text("来吧，展示")
        $btn.prop("disabled", false)
        return
    }

    // 今年生日已过则计算距明年生日的时间
    if (now.isAfter(birthday)) {
        if (customDate && /^\d{2}-\d{2}$/.test(customDate)) {
            birthday = dayjs(`${parseInt(curYearStr) + 1}-${customDate}`)
        } else if (!customDate) {
            birthday = dayjs(birthdayMap[parseInt(curYearStr) + 1])
        }
        // 如果提供的是具体年份的日期且已过，则保持原样，按钮显示“指定日期生日已过”
    }

    // 计算与目标日期的差值（秒），并转换成天、时、分、秒
    const diffInSeconds = birthday.diff(now, "second")
    const days = Math.floor(diffInSeconds / (3600 * 24))
    const hours = Math.floor((diffInSeconds % (3600 * 24)) / 3600)
    const minutes = Math.floor((diffInSeconds % 3600) / 60)
    const seconds = diffInSeconds % 60

    // 构建时间字符串
    const timeStrArr = []
    if (days > 0) {
        timeStrArr.push(`${days}天`)
    }
    if (hours > 0 || days > 0) {
        timeStrArr.push(`${hours}时`)
    }
    if (minutes > 0 || hours > 0 || days > 0) {
        timeStrArr.push(`${minutes}分`)
    }
    timeStrArr.push(`${seconds}秒`)

    $btn.text(diffInSeconds <= 0 ? "指定日期生日已过" : timeStrArr.join(""))
}

function pageRender() {
    // 关闭雪花、淡出封面
    snowflakes.destroy()
    $(".birth-cover-container").fadeOut(1500)

    // 淡入内容、播放歌曲、放飞气球、展示祝词
    $main.fadeIn("slow")
    $(".song")[0].play()
    $(".brith-balloon").animate({ top: -500 }, 8000)
    new Typed("#typed", {
        stringsElement: "#greeting-word",
        typeSpeed: 50,
        backSpeed: 25,
        loop: true,
    })
}

