# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   cd frontend
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).
## 📂 Hướng dẫn viết code UI
- Các màn hình (Screens) được đặt trong thư mục `app/`. Khi tạo một file `.tsx` hoặc `.js` mới ở đây, nó sẽ tự động trở thành một màn hình có thể truy cập được.
- Các thành phần tái sử dụng (như nút bấm, thẻ hiển thị món ăn) phải được tạo trong thư mục `components/`.
- Cấu hình địa chỉ IP của Backend Server được đặt tại file `constants/api.js`.
- Mình có thể chạy hiện app ra trên điện thoại bằng cách tải Expo Go trên CH Play/App store và quét mã QR hiện trong terminal sau lệnh start the app ở trên.