import util from '@/common/js/util'
// 对话日志的类别：气泡（"文字"+[相关问题链接]); 单张图片；[卡片];
const HISTORY_LOG_COUNT = 30
export const TYPES = {
    BUBBLE: 'bubble',
    SINGLEPIC: 'singlepic',
    CARDS: 'cards'
}
// 气泡方向： 左|右
export const DIRECTION = {
    LEFT: 'left',
    RIGHT: 'right'
}
// 0. 聊天记录
export class ChatLog {
    // 属性： id, 类别, 方向
    constructor (type, id, direction, externalLink) {
        // mandatory attributes
        this.type = type
        this.id = id
        this.direction = direction
        // optional attributes
        this.externalLink = externalLink
    }
}
// 聊天记录列表
export class ChatLogList {
    constructor (chatId, chatLogs) {
        // code
        this.chatId = chatId
        if (chatLogs instanceof Array) {
            this.chatLogs = chatLogs
        } else {
            this.chatLogs = []
        }
    }
    // methods
    // 发送气泡
    addRightBubble (content) {
        let index = 'rb' + this.chatLogs.length
        let leftBubble = new BubbleLog(index, DIRECTION.right, undefined, content, undefined)
        this.chatLogs.push(leftBubble)
        return index
    }
    // 接受的log类型
    addCardsLog (cards) {
        let id = 'cards' + this.chatLogs.length
        let cardsLog = new CardsLog(id, cards)
        this.chatLogs.push(cardsLog)
        return id
    }
    insertCardsLog (cards, index) {
        if (index < 0 || index > this.chatLogs.length) {
            return
        }
        let id = 'cards' + index + '-0'
        let cardsLog = new CardsLog(id, cards)
        this.chatLogs.splice(index, 0, cardsLog)
        return id
    }
    // 不传参数直接call addLeftBubble()，生成的气泡处于loading状态，当content或者links有值之后会改为非loading状态
    addLeftBubble (content, links, externalLink) {
        let id = 'lb' + this.chatLogs.length
        let leftBubble = new BubbleLog(id, DIRECTION.LEFT, externalLink, content, links)
        this.chatLogs.push(leftBubble)
        return id
    }
    insertLeftBubble (content, links, externalLink, index) {
        if (index < 0 || index > this.chatLogs.length) {
            return
        }
        let id = 'lb' + index + '0'
        let leftBubble = new BubbleLog(id, DIRECTION.LEFT, externalLink, content, links)
        this.chatLogs.splice(index, 0, leftBubble)
        return id
    }
    addSinglePicLog (imageUrl) {
        let id = 'pic' + this.chatLogs.length
        let singlePic = new SinglePicLog(id, imageUrl)
        this.chatLogs.push(singlePic)
        return id
    }
    insertSinglePicLog (imageUrl, index) {
        if (index < 0 || index > this.chatLogs.length) {
            return
        }
        let id = 'pic' + index + '-0'
        let singlePic = new SinglePicLog(id, imageUrl)
        this.chatLogs.splice(index, 0, singlePic)
        return id
    }
    _removeLog (logIndex) {
        if (logIndex < 0 || logIndex >= this.chatLogs.length) {
            return
        }
        this.chatLogs.splice(logIndex, 1)
    }
    getChatLogIndexById (logId) {
        let index = -1
        for (let i = 0; i < this.chatLogs.length; i++) {
            if (this.chatLogs[i].id === logId) {
                index = i + 1
            }
        }
        return index
    }
    getLogs () {
        return this.chatLogs
    }
    updateChatLog (logId, args) {
        let logIndex = -1
        for (let i = 0; i < this.chatLogs.length; i++) {
            if (this.chatLogs[i].id === logId) {
                logIndex = i
            }
        }
        if (logIndex === -1) {
            // 需要刷新的bubble不存在，在末尾添加
            return
        }
        if (args.imageUrl) {
            // 单图片
            this._removeLog(logIndex)
            this.insertSinglePicLog(args.imageUrl, logIndex)
        } else if (args.cards) {
            // 卡片
            this._removeLog(logIndex)
            this.insertCardsLog(args.cards, logIndex)
        } else if (args.content || args.links || args.externalLink) {
            // 文字
            this.chatLogs[logIndex].content = args.content
            this.chatLogs[logIndex].links = args.links
            this.chatLogs[logIndex].externalLink = args.externalLink
        }
    }
    updateHistoryLogs () {
        if (this.chatLogs.length > 0 && this.chatId !== '') {
            let str = JSON.stringify(this.chatLogs)
            console.log(this.chatId + ' ====== ' + str)
            localStorage.setItem('historyLogs-' + this.chatId, str)
        }
    }
    static getHistoryLogs (chatId) {
        let history = localStorage.getItem('historyLogs-' + chatId)
        let res = []
        if (history !== null && util.isJSON(history)) {
            res = JSON.parse(history)
            let num = res.length - HISTORY_LOG_COUNT
            if (num > 0) {
                res.splice(0, num)
            }
        }
        return res
    }
}
// 1. 气泡
export class BubbleLog extends ChatLog {
    constructor (id, direction, externalLink, content, links) {
        // code
        super(TYPES.BUBBLE, id, direction, externalLink)
        this.content = content
        this.links = links
    }
}
// 2. 单图片
export class SinglePicLog extends ChatLog {
    constructor (id, imageUrl) {
        // code
        super(TYPES.SINGLEPIC, id, DIRECTION.LEFT, undefined)
        this.imageUrl = imageUrl
    }
}
// 3. 卡片
export class CardsLog extends ChatLog {
    constructor (id, cards) {
        // code
        super(TYPES.CARDS, id, DIRECTION.LEFT, undefined)
        this.cards = cards
    }
}
export class Card {
    constructor (title, description, externalLink) {
        this.title = title
        this.description = description
        this.externalLink = externalLink
    }
}
