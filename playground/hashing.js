const {SHA256} = require('crypto-js')
const jwt = require('jsonwebtoken')
const brcrypt = require('bcryptjs')

var password = '123qwe'
//
// brcrypt.genSalt(10, (err, salt) => {
//   brcrypt.hash(password, salt, (err, hash) => {
//     console.log(hash);
//   })
// })

var hashedPassword = '$2a$10$tazTh0IIJZ6nduw29/w7y.CQMHlYh0FY.qfbPp4aL4n.DM.PSD4pS'

brcrypt.compare(password,hashedPassword,(err,res) => {
  console.log(res);
})

// var data = {
//   id: 10
// }
//
// var token = jwt.sign(data,'123abc') // takes the object, signs it and returns a token
// console.log(token);
// var decoded = jwt.verify(token,'123abcc') // ensures data wasn't manipulated
// console.log('decoded', decoded);

// var message = "I am user number 4"
// var hash = SHA256(message).toString()
//
// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);
//

// var data = {
//   id: 3
// }
//
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data)+'somesecretsalt').toString()
// }
//
//
// token.data.id = 5
// token.hash = SHA256(JSON.stringify(token.data)).toString()
//
// var resultHash =SHA256(JSON.stringify(token.data)+'somesecretsalt').toString()
//
// if (resultHash === token.hash) {
//   console.log('Data was not changed');
// } else {
//   console.log('Data was changed');
// }
