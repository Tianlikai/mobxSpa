import React from 'react'

/* eslint no-proto: "off" */
let wontBind = [
    'constructor',
    'render',
    'componentWillMount',
    'componentDidMount',
    'componentWillReceiveProps',
    'shouldComponentUpdate',
    'componentWillUpdate',
    'componentDidUpdate',
    'componentWillUnmount'
]

/*
 export default function(context) {
 let proto = Object.getPrototypeOf(context)
 let props = Object.getOwnPropertyNames(proto)

 props.forEach(method => {
 // @FIXME
 // A => B => C，如果在 A 上使用 autoBind，
 // 那么只有 A 上的函数才会 autoBind，
 // B，C 上的函数都无法 autoBind
 let desc = Object.getOwnPropertyDescriptor(proto, method)

 if (wontBind.indexOf(method) >= 0 || typeof desc.value !== 'function') {
 return
 }

 bind(proto, method, desc)
 })
 }
 */

export default function autoBind(context) {
    let map = {}
    let proto = getPrototypeOf(context)
    // @FIXED
    // A => B => C，如果在 A 上使用 autoBind，
    // 那么不只有 A 上的函数会 autoBind，
    // B，C 上的函数也都会 autoBind
    while (proto && proto !== React.Component.prototype) {
        Object.getOwnPropertyNames(proto)
            .filter(method => wontBind.indexOf(method) < 0 && !(method in map))
            .forEach(method => {
                let desc = Object.getOwnPropertyDescriptor(proto, method)
                if (typeof desc.value !== 'function') {
                    return
                }

                map[method] = true
                bind(proto, method, desc)
            })
        proto = getPrototypeOf(proto)
    }
}

function bind(proto, method, desc) {
    let fn = desc.value

    Object.defineProperty(proto, method, {
        configurable: true,
        get() {
            if (this === proto || this.hasOwnProperty(method)) return fn

            // bind 一次就够了，此 bind 会自动根据子类切换 this 环境
            // 如：
            // A1 => B, A2 => B
            // 如果 A1 autoBind 之后，B 上函数也会 autoBind 到 A1
            // 而在 A2 autoBind 之后，B 上函数不需要再 autoBind，但在 A2 上调用 B 上的方法是不会有问题的
            let boundFn = fn.bind(this)
            Object.defineProperty(this, method, {
                value: boundFn,
                configurable: true,
                writable: true
            })
            return boundFn
        }
    })
}

function getPrototypeOf(obj) {
    return obj.__proto__ || Object.getPrototypeOf(obj)
}
