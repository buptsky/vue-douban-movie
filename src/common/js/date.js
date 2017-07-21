// 当前周次的类，用于获取当前周的起止日期
export default class WeekDate {
  constructor() {
    let now = new Date(); // 当前日期
    this.nowYear = now.getFullYear(); // 当前年
    this.nowMonth = now.getMonth(); // 月
    this.nowDay = now.getDate(); // 日
    this.nowDayOfWeek = now.getDay(); // 今天本周的第几天
    this.nowDayOfWeek = this.nowDayOfWeek === 0 ? 7 : this.nowDayOfWeek; // 如果是周日，就变成周七
  }

  formatDate(date) {
    // let myyear = date.getFullYear();
    let mymonth = date.getMonth() + 1;
    let myweekday = date.getDate();
    // if (mymonth < 10) {
    //   mymonth = '0' + mymonth;
    // }
    // if (myweekday < 10) {
    //   myweekday = '0' + myweekday;
    // }
    return `${mymonth}月${myweekday}日`;
  }

  getWeekStartDate() {
    let weekStartDate = new Date(this.nowYear, this.nowMonth, this.nowDay - this.nowDayOfWeek + 1);
    return this.formatDate(weekStartDate);
  }

  getWeekEndDate() {
    let weekEndDate = new Date(this.nowYear, this.nowMonth, this.nowDay + (6 - this.nowDayOfWeek + 1));
    return this.formatDate(weekEndDate);
  }
};
