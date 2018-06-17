export function addClass (el, className) {
  if (!hasClass(el, className)) {
    let newClass = el.className.split(' ')
    newClass.push(className)
    el.className = newClass.join(' ')
  }
}

export function hasClass (el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className) // 测试这个字符串是偶符合设置规则，返回布尔类型
}
