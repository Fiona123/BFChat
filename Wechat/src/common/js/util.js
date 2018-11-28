export default {
    isJSON (str) {
        if (typeof str === 'string') {
            try {
                var obj = JSON.parse(str)
                if (typeof obj === 'object' && obj) {
                    return true
                } else {
                    return false
                }
            } catch (e) {
                // console.log('error：' + str + '!!!' + e)
                return false
            }
        }
        console.log('It is not a string!')
    },
    trim (str) {
        return str.replace(/(^\s*)|(\s*$)/g, '')
    },
    isIphoneX () {
        let agent = navigator.userAgent
        let ios = !!agent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
        if (ios) {
            if (screen.height === 812 && screen.width === 375) {
                return true
            } else {
                return false
            }
        }
        return false
    }
}
