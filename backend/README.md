# ⚙️ Backend & AI

Đây là thư mục chứa mã nguồn của máy chủ API và các mô hình AI phục vụ cho dự án quản lý thực phẩm. Backend được xây dựng bằng Python, sử dụng framework **FastAPI** để đảm bảo tốc độ cao và hỗ trợ xử lý bất đồng bộ (rất cần thiết khi chạy các mô hình Deep Learning nặng).

## 📂 Cấu trúc thư mục (Folder Structure)

Khi phát triển thêm tính năng, vui lòng tuân thủ cấu trúc thư mục dưới đây để dự án luôn gọn gàng và dễ bảo trì:

```text
backend/
│
├── app/                        # Thư mục chính chứa mã nguồn API
│   ├── api/                    # Chứa các file định nghĩa Endpoints (Routes)
│   │   ├── routes_food.py      # Các API thêm/sửa/xóa thực phẩm
│   │   └── routes_ml.py        # Các API nhận ảnh từ điện thoại và trả kết quả AI
│   │
│   ├── core/                   # Cấu hình chung, biến môi trường, bảo mật
│   │   └── config.py           # Cấu hình URL DB, JWT, khóa API...
│   │
│   ├── database/               # Kết nối CSDL và các hàm truy vấn
│   │   ├── models.py           # Khai báo cấu trúc bảng CSDL (SQLAlchemy/MongoDB)
│   │   └── schemas.py          # Định dạng dữ liệu vào/ra (Pydantic)
│   │
│   ├── ml_pipeline/            # Nơi chứa logic xử lý AI
│   │   ├── cv_model.py         # Hàm load model YOLO và nhận diện loại thực phẩm
│   │   ├── freshness_model.py  # Hàm đánh giá độ tươi dựa trên ảnh đã cắt
│   │   └── ocr_model.py        # Hàm đọc chữ (OCR) trên bao bì
│   │
│   └── services/               # Chứa các logic nghiệp vụ phức tạp
│       ├── recipe_service.py   # Logic gợi ý món ăn và xóa nguyên liệu thừa
│       └── notif_service.py    # Logic quét hạn sử dụng và đẩy thông báo FCM
│
├── weights/                    # Chứa các file mô hình đã được huấn luyện (Không đẩy lên Git)
│   ├── yolov8_food.pt          # Trọng số model YOLO
│   └── resnet_freshness.pth    # Trọng số model CNN đánh giá độ tươi
│
├── data/                       # Chứa ảnh sample hoặc dữ liệu tạm (nếu cần)
├── tests/                      # Chứa các kịch bản kiểm thử (Unit tests)
├── main.py                     # File gốc khởi chạy toàn bộ server FastAPI
└── requirements.txt            # Danh sách các thư viện Python cần cài đặt
```
