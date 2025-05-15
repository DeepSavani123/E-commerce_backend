import mongoose from 'mongoose'

const {MONGODB_URL} = process.env
mongoose.connect(MONGODB_URL).then(() => {
    console.log('Database connected!')
}).catch((err) => {
    console.log(err)
})