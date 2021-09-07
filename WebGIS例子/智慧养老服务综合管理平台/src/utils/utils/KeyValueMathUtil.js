/**数学计算工具类 */
class KeyValueMathUtil {
    /**
     * 构造器
     * @param {KeyValue数组} _keyValueArray
     */
    constructor(_keyValueArray) {
        console.log(_keyValueArray)
        this.keyValueArray = _keyValueArray
    }

    /**
     * 获取KeyValue数组中保存的最大value值
     */
    getMaxValue() {
        if (this.keyValueArray && this.keyValueArray.length > 0) {
            //求解最大value值
            let len = this.keyValueArray.length - 1
            let maxValue = this.keyValueArray[len].value
            while (len--) {
                if (this.keyValueArray[len].value > maxValue) {
                    maxValue = this.keyValueArray[len].value
                }
            }
            //返回最大值
            return maxValue
        }
        return undefined
    }

    /**
     * 获取keyValue数组中保存的最小value值
     */
    getMinValue() {
        if (this.keyValueArray && this.keyValueArray.length > 0) {
            //求解最小value值
            let len = this.keyValueArray.length - 1
            let minVlaue = this.keyValueArray[len].value
            while (len--) {
                if (this.keyValueArray[len].value < minVlaue) {
                    minVlaue = this.keyValueArray[len].value
                }
            }
            //返回最大值
            return minVlaue
        }
        return undefined
    }
}

//导出当前类
module.exports = KeyValueMathUtil