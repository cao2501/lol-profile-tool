# League of Legends Profile Tool V.2.5.0

> Công cụ tùy chỉnh hồ sơ Liên Minh Huyền Thoại — thay đổi icon, background, trạng thái, rank hiển thị và nhiều hơn nữa.

---

## 📥 Tải xuống

**[⬇️ Tải League Profile Tool V.2.5.0 (Windows 64-bit)](https://github.com/cao2501/lol-prifile-status/releases/download/V.2.5.0/League.Profile.Tool.zip)**

*Xem tất cả các phiên bản: [Releases](https://github.com/cao2501/lol-prifile-status/releases)*

---

## 📋 Hướng dẫn cài đặt

1. **Tải file** `League.Profile.Tool.zip` từ link ở trên
2. **Giải nén** toàn bộ file ra một thư mục bất kỳ
3. **Chạy** file `League Profile Tool.exe`

> ⚠️ **Lưu ý:** Windows Defender có thể cảnh báo vì app không có chữ ký số. Chọn **"More info" → "Run anyway"** để tiếp tục.

---

## 🎮 Hướng dẫn sử dụng

### Bước 1: Mở League of Legends

- Đảm bảo **League of Legends Client** đã được mở và bạn đã đăng nhập
- Tool chỉ hoạt động khi client League đang chạy (không cần vào trận)

### Bước 2: Mở League Profile Tool

- Chạy `League Profile Tool.exe`
- Tool sẽ tự động kết nối với League Client
- Khi hiện **"Connected"** ở góc trên là đã sẵn sàng

> 💡 Nếu tool hiện **"Waiting for client..."**, hãy đảm bảo League Client đang mở. Tool sẽ tự kết nối khi phát hiện client.

---

### 🏠 Tab Home (Trang chủ)

- Hiển thị phiên bản hiện tại và kiểm tra cập nhật mới
- Chứa link đến GitHub và các tài nguyên liên quan

---

### 🖼️ Tab Background (Hình nền hồ sơ)

Thay đổi hình nền hiển thị trên hồ sơ của bạn:

1. Chọn **Skin ID** của tướng bạn muốn làm hình nền
2. Nhấn **Apply** để áp dụng
3. Hình nền sẽ thay đổi ngay trên hồ sơ của bạn

> 💡 Skin ID có thể tra trên [CommunityDragon](https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/skins.json)

---

### 🏆 Tab Chat Rank (Rank hiển thị)

Thay đổi rank hiển thị trên chat và hồ sơ:

1. Chọn **Tier** (hạng): Iron, Bronze, Silver, Gold, Platinum, Emerald, Diamond, Master, Grandmaster, Challenger
2. Chọn **Division**: I, II, III, IV
3. Chọn **Queue** (hàng chờ): Ranked Solo, Ranked Flex
4. Nhấn **Apply**

> ⚠️ Chỉ thay đổi hiển thị, không ảnh hưởng rank thật.

---

### 📝 Tab Status (Trạng thái)

Thay đổi tin nhắn trạng thái và chế độ hiển thị:

#### Tin nhắn trạng thái:
1. Nhập nội dung trạng thái vào ô text
2. Nhấn **Apply** để đặt tin nhắn trạng thái

#### Chế độ trực tuyến:
- **🟢 Online** — Hiển thị đang trực tuyến
- **📱 Mobile** — Hiển thị đang dùng điện thoại
- **🟡 Away** — Hiển thị đang vắng mặt
- **⚫ Offline** — Hiển thị ngoại tuyến (ẩn)
- **🔄 Clear** — Xóa trạng thái, quay về mặc định

---

### 🎨 Tab Custom Icon (Icon tùy chỉnh)

Thay đổi icon hồ sơ sang bất kỳ icon nào:

1. Nhập **Icon ID** bạn muốn sử dụng
2. Nhấn **Apply**
3. Icon hồ sơ của bạn sẽ thay đổi ngay lập tức

---

### ⚡ Tab Custom API

Gửi request tùy chỉnh trực tiếp đến LCU API:

1. Chọn **Method**: GET, POST, PUT, PATCH, DELETE
2. Nhập **Endpoint** (đường dẫn API)
3. Nhập **Body** (nội dung JSON) nếu cần
4. Nhấn **Send**

> ⚠️ Dành cho người dùng nâng cao. Sử dụng sai có thể gây lỗi client.

---

### 🤖 Tab Practice Tool

Tạo phòng Practice Tool nhanh:

1. Chọn map và chế độ
2. Nhấn **Create** để tạo phòng luyện tập

---

## ❓ FAQ — Câu hỏi thường gặp

**Q: Tool có an toàn không? Có bị ban không?**
> Tool chỉ sử dụng LCU API (API chính thức của client League). Các thay đổi chỉ hiển thị phía client và không can thiệp vào gameplay. Tuy nhiên, sử dụng tự chịu rủi ro.

**Q: Tool không kết nối được với League Client?**
> - Đảm bảo League Client đang mở và bạn đã đăng nhập
> - Thử chạy tool với quyền **Administrator**
> - Nếu League được cài ở thư mục khác mặc định, kiểm tra file `config/clientPath.txt`

**Q: Thay đổi có bị mất khi tắt League không?**
> Có, hầu hết các thay đổi sẽ reset khi bạn khởi động lại League Client. Bạn cần áp dụng lại.

**Q: Tool có hoạt động trên server Garena (VN) không?**
> Tool hoạt động trên tất cả các server sử dụng Riot Client, bao gồm cả server Việt Nam.

---

## 🔄 Có gì mới trong V.2.5.0

- ✅ **Sửa lỗi kết nối** — Thay thế `wmic` (đã bị Windows loại bỏ) bằng cơ chế tự phát hiện đường dẫn League
- ✅ **Sửa lỗi API** — Xóa dấu `/` thừa ở endpoint gây lỗi 404
- ✅ **Thêm nút điều khiển trạng thái** — Online, Mobile, Away, Offline, Clear
- ✅ **Cập nhật phiên bản** lên V.2.5.0

---

## 🛠️ Built With (Công nghệ sử dụng)

- [LCU Connector](https://github.com/Pupix/lcu-connector) — Kết nối LCU API
- [Electron](https://github.com/electron/electron) — Framework ứng dụng desktop
- [Angular CLI](https://github.com/angular/angular-cli) — Frontend framework
- TypeScript / HTML / CSS / JavaScript

---

## ⚖️ Riot Games

Dự án này không được Riot Games xác nhận và không phản ánh quan điểm hay ý kiến của Riot Games hoặc bất kỳ ai chính thức liên quan đến việc sản xuất hoặc quản lý League of Legends. League of Legends và Riot Games là thương hiệu hoặc thương hiệu đã đăng ký của Riot Games, Inc. League of Legends © Riot Games, Inc.

## 📄 License

Dự án này được cấp phép theo MIT License — xem file [LICENSE](LICENSE) để biết chi tiết.
