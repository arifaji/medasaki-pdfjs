const Printer = require('pdfmake')
const axios = require('axios')
const path = require('path')

module.exports.pdf = async (req, res, next) => {
    var printer = new Printer({
        Roboto: {
            normal: path.resolve('src', 'fonts', 'Roboto.ttf'),
            bold: path.resolve('src', 'fonts', 'Roboto-Bold.ttf'),
        }
    })
    
    try {
        var result = await axios.get('http://via.placeholder.com/350x150', {
            responseType: 'arraybuffer'
        })
    } catch(err) {
        return next(err.message)
    }
  
    var image = Buffer.from(result.data, 'base64')
    var doc = printer.createPdfKitDocument({
        info: {
            title: 'PDF with External Image',
            author: 'Matt Hagemann',
            subject: 'PDF with External Image',
        },
        content: [{
            image: image,
            width: 595, // Full A4 size width.
            absolutePosition: { x: 0, y: 0 }
        }],
        defaultStyle: {
            fontSize: 11,
            font: 'Roboto', // The font name was defined above.
            lineHeight: 1.2,
        }
    })
    
    doc.end()
  
    res.setHeader('Content-type', 'application/pdf')
    res.setHeader('Content-disposition', 'inline; filename="Example.pdf"')
  
    doc.pipe(res)
}
