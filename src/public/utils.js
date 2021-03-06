function setCookie (cname, cvalue, exdays) {
  let d = new Date()
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
  let expires = 'expires=' + d.toUTCString()
  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/'
}

function getCookie (cname) {
  let name = cname + '='
  let ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') {
      c = c.substring(1)
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length)
    }
  }
  return ''
}

function hasUid () {
  let name = 'cuid='
  let re = /^\d{1,8}$/
  let decodedCookie = decodeURIComponent(document.cookie)
  let ca = decodedCookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') {
      c = c.substring(1)
    }
    if (c.indexOf(name) === 0) {
      return re.test(c.substring(name.length, c.length))
    }
  }
  return false
}

/*
* @param { String } iosTime 传入的时间,格式为 ISO-8601
* @returns { Number } 时间戳
* @description 2015-03-04T00:00:00.000Z => 1425427200000
* */
function iosToTimestamp (iosTime) {
  let dstr = String(new Date(iosTime).getTime())
  return Number(dstr)
}

/*
* @param { Number } timeStamp 时间戳
* @returns { String } 返回时间 可选值: 'YYYY' || 'MM' || 'DD' || 'days'
* @description timeStamp => yyyy-mm-dd h:mm:ss
* */
function formatDateTime (timeStamp, limit) {
  let date = new Date()
  let y = date.getFullYear()
  let m = date.getMonth() + 1
  m = m < 10 ? ('0' + m) : m
  let d = date.getDate()
  d = d < 10 ? ('0' + d) : d
  let h = date.getHours()
  h = h < 10 ? ('0' + h) : h
  let minute = date.getMinutes()
  let second = date.getSeconds()
  minute = minute < 10 ? ('0' + minute) : minute
  second = second < 10 ? ('0' + second) : second
  if (limit) {
    if (limit === 'YYYY') {
      return y
    } else if (limit === 'MM') {
      return m
    } else if (limit === 'DD') {
      return d
    } else if (limit === 'days') {
      return `${y}-${m}-${d}`
    }
  } else {
    return `${y}-${m}-${d} ${h}:${minute}:${second}`
  }
}

/*
* @param { String || Number } date 格式为 ISO-8601或者时间戳
* @param { String } limit 是否开启限制,可选值: 'YYYY' || 'MM' || 'DD' || 'days'
* @returns { String } 返回相对时间
* @description 2018-08-19T00:00:00.000Z => 6小时前 || 1534636800000 => 6小时前
* */
function timeFilter (date, limit) {
  let timeStamp
  if (typeof (date) === 'string') {
    timeStamp = iosToTimestamp(date)
  } else {
    timeStamp = date
  }
  if (limit) {
    return formatDateTime(timeStamp, limit)
  }
  let seconds = Math.floor((new Date() - timeStamp) / 1000)
  let interval = Math.floor(seconds / 31536000)
  if (interval > 1) {
    return formatDateTime(interval)
  }
  interval = Math.floor(seconds / 2592000)
  if (interval > 1) {
    return interval + '个月前'
  }
  interval = Math.floor(seconds / 86400)
  if (interval > 1) {
    return interval + '天前'
  }
  interval = Math.floor(seconds / 3600)
  if (interval > 1) {
    return interval + '小时前'
  }
  interval = Math.floor(seconds / 60)
  if (interval > 1) {
    return interval + '分钟前'
  }
  return Math.floor(seconds) + '秒前'
}

/*
* @param {String} content 输入的内容
* @return {String} 替换为<br>的文本
* */
function transferContent (content) {
  return content.replace(/\n/gm, '<br>')
}

// see https://stackoverflow.com/a/33928558/9002383
function copy (text) {
  if (window.clipboardData && window.clipboardData.setData) {
    return window.clipboardData.setData('Text', text)
  } else if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
    var textarea = document.createElement('textarea')
    textarea.textContent = text
    textarea.style.position = 'fixed'
    document.body.appendChild(textarea)
    textarea.select()
    try {
      return document.execCommand('copy')
    } catch (ex) {
      window.alert(text)
      return false
    } finally {
      document.body.removeChild(textarea)
    }
  }
}

export {
  setCookie,
  getCookie,
  hasUid,
  iosToTimestamp,
  timeFilter,
  formatDateTime,
  transferContent,
  copy
}
