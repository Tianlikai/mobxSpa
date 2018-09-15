const fs = require('fs')
const path = require('path')

const filePath = path.resolve('../pages')

/**
 * 获取文件夹下所有js文件
 * @param filePath
 */
function fileDisplay(filePath) {
    // 根据文件路径读取文件，返回文件列表
    fs.readdir(filePath, function(err, files) {
        if (err) {
            console.warn(err)
        } else {
            // 遍历读取到的文件列表
            files.forEach(function(filename) {
                // 获取当前文件的绝对路径
                var fileDir = path.join(filePath, filename)
                // 根据文件路径获取文件信息，返回一个fs.Stats对象
                fs.stat(fileDir, function(error, stats) {
                    if (error) {
                        console.warn('获取文件stats失败')
                    } else {
                        var isFile = stats.isFile() // 是文件
                        var isDir = stats.isDirectory() // 是文件夹
                        if (isFile && fileDir.endsWith('.js')) {
                            console.log(fileDir)
                        }
                        if (isDir) {
                            fileDisplay(fileDir) // 递归，如果是文件夹，就继续遍历该文件夹下面的文件
                        }
                    }
                })
            })
        }
    })
}

fileDisplay(filePath)
