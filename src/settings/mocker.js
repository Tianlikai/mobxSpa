const Mock = require('mockjs')
const qs = require('qs')

let cached

/**
 * @param {num: 页} p
 * @param {num: 行数} i
 * @param {num: 总数} max
 */
function getStartAndStop(p, i, max) {
    let start = (p - 1) * 10
    let end = start + 10
    if (end > max) end = max
    return {start, end}
}

function getCachedResult(name, state) {
    let copyCached = cached.slice()
    state = state ? state + '' : null
    name = name ? name + '' : null
    if (name) {
        console.log(name)
        copyCached = copyCached.filter(element => {
            return element.name.indexOf(name) >= 0 || (element.id + '').indexOf(name) >= 0 || (element.mobile + '').indexOf(name) >= 0
        })
    }
    if (state) {
        console.log(state)
        copyCached = copyCached.filter(element => {
            return element.countState + '' === state
        })
    }
    return copyCached
}

const proxy = {
    'POST /__api/8/user/login': function(req, res) {
        const {username, password} = req.body
        if (password !== '123' || username !== 'jason') {
            res.json({
                err: null,
                code: '1002',
                message: '请输入正确的用户名和密码!',
                data: null,
                successful: false
            })
        } else {
            res.json({
                err: null,
                code: '0',
                message: 'success',
                data: {
                    name: 'jason',
                    tokenType: 'Bearer',
                    access_token: '35f2a3e9-108f-350e-9121-e22acafd11fd',
                    avatar: '',
                    mobile: '',
                    expires_in: new Date().getTime() + 60 * 1000,
                    user: {
                        id: 1,
                        mobile: '183',
                        name: 'jason',
                        state: 0,
                        status: 0,
                        roleOperations: [
                            {
                                id: null,
                                displayOrder: -1,
                                createdAt: null,
                                'operationId': 60000,
                                'state': 0,
                                'isRight': 1
                            },
                            {
                                'id': null,
                                'displayOrder': -1,
                                'createdAt': null,
                                'operationId': 60001,
                                'state': 2,
                                'isRight': 1
                            },
                            {
                                'id': null,
                                'displayOrder': -1,
                                'createdAt': null,
                                'operationId': 60002,
                                'state': 2,
                                'isRight': 1
                            },
                            {
                                'id': null,
                                'displayOrder': -1,
                                'createdAt': null,
                                'operationId': 60003,
                                'state': 2,
                                'isRight': 1
                            },
                            {
                                'id': null,
                                'displayOrder': -1,
                                'createdAt': null,
                                'operationId': 60004,
                                'state': 2,
                                'isRight': 1
                            },
                            {
                                'id': null,
                                'displayOrder': -1,
                                'createdAt': null,
                                'operationId': 110000,
                                'state': 0,
                                'isRight': 1
                            },
                            {
                                'id': null,
                                'displayOrder': -1,
                                'createdAt': null,
                                'operationId': 110001,
                                'state': 2,
                                'isRight': 1
                            },
                            {
                                'id': null,
                                'displayOrder': -1,
                                'createdAt': null,
                                'operationId': 110002,
                                'state': 2,
                                'isRight': 1
                            },
                            {
                                'id': null,
                                'displayOrder': -1,
                                'createdAt': null,
                                'operationId': 120000,
                                'state': 0,
                                'isRight': 1
                            },
                            {
                                'id': null,
                                'displayOrder': -1,
                                'createdAt': null,
                                'operationId': 120001,
                                'state': 2,
                                'isRight': 1
                            },
                            {
                                'id': null,
                                'displayOrder': -1,
                                'createdAt': null,
                                'operationId': 120002,
                                'state': 2,
                                'isRight': 1
                            },
                            {
                                'id': null,
                                'displayOrder': -1,
                                'createdAt': null,
                                'operationId': 120003,
                                'state': 2,
                                'isRight': 1
                            },
                            {
                                'id': null,
                                'displayOrder': -1,
                                'createdAt': null,
                                'operationId': 130000,
                                'state': 0,
                                'isRight': 1
                            },
                            {
                                'id': null,
                                'displayOrder': -1,
                                'createdAt': null,
                                'operationId': 130001,
                                'state': 2,
                                'isRight': 1
                            },
                            {
                                'id': null,
                                'displayOrder': -1,
                                'createdAt': null,
                                'operationId': 130002,
                                'state': 2,
                                'isRight': 1
                            },
                            {
                                'id': null,
                                'displayOrder': -1,
                                'createdAt': null,
                                'operationId': 130003,
                                'state': 2,
                                'isRight': 1
                            }
                        ]
                    }
                },
                successful: true
            })
        }
    },
    'GET /__api/11/org/list': function(req, res) {
        let max = 205
        if (!cached) {
            cached = []
            for (let i = 0; i < max; ++i) {
                let mock = Mock.mock({
                    'item': {
                        'id|+1': 1000000 + i,
                        'state|1': [0, 1],
                        'name': Mock.Random.cname(),
                        'mobile': /^1[34578]\d{9}$/,
                        'createdBy': Mock.Random.cname(),
                        'teacherNum|1-100': 100,
                        'studentNum|1-100': 100,
                        'countState|1': [0, 1, 2, 3, 4],
                        'createdAtFormat': Mock.Random.datetime()
                    }
                })
                cached.push(mock.item)
            }
        }
        const {name, pageNo, itemsPerPage, state} = qs.parse(req._parsedUrl.query)
        let copyCached = getCachedResult(name, state)
        console.log(copyCached)
        let items = []
        let len = copyCached.length
        let {start, end} = getStartAndStop(pageNo, itemsPerPage, len)
        while (start < end) {
            items.push(copyCached[start])
            ++start
        }
        res.json({
            code: '0',
            data: {
                count: len,
                items: items
            },
            err: null,
            message: 'success!',
            successful: true
        })
    }
}

module.exports = proxy

