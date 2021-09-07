class DateParseUtils {
    /**
     * 根据毫秒数创建Date实例
     * @param {毫秒数} millions
     */
    constructor(millions) {
        this.date = new Date(millions)
    }

    /**
     * 日期格式化
     */
    formatDate() {
        return (
            this.date.getFullYear() +
            '-' +
            (this.date.getMonth() + 1) +
            '-' +
            this.date.getDate()
            // +
            // '\n' +
            // this.date.getHours() +
            // ':' +
            // this.date.getMinutes() +
            // ':' +
            // this.date.getSeconds()
        )
    }
}
module.exports = DateParseUtils