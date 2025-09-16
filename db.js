// db.js
const mongoose = require('mongoose');

mongoose.set('strictQuery', true); // hoặc false, tùy theo cảnh báo của mongoose

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Kết nối MongoDB thành công!');
    } catch (err) {
        console.error('❌ Kết nối MongoDB thất bại:', err);
        process.exit(1); // thoát chương trình nếu lỗi
    }
}

module.exports = connectDB;
