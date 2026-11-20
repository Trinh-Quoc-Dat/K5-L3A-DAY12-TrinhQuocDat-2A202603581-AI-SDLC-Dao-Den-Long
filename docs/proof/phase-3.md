# Phase 3 · Bằng chứng · Contract v1.2

## Bằng chứng tự động

Chạy `node tests/run.mjs` để tạo lại các fixture tất định. Bộ chạy kiểm thử ghi kết quả vào thư mục tạm của hệ điều hành và kiểm tra trực tiếp các sự kiện/snapshot JSONL.

- Nhặt/nạp đèn, va chạm, Tỏa Sáng, seed tất định và mã thoát 2 khi đầu vào sai từ Phase 1: đạt.
- Lướt, bùa, bệ phóng, Gió Lạc lấy/làm rơi đom đóm, tạm dừng, 3 bản đồ, gió và lịch xuất hiện Bóng Mực từ Phase 2: đạt.
- Thắng bình minh khi 3/5 đèn sáng, thua bình minh dưới ngưỡng, ưu tiên hết Ngọn Lửa cuối cùng, không thắng sớm khi mọi đèn đều sáng, tính điểm thắp lần đầu/thắp lại và tăng sức chứa, châm dầu khi ít dầu/đẩy Bóng Mực, chu kỳ/sự kiện hút dầu, đèn tắt khi hết dầu và điểm Tỏa Sáng khi Bóng Mực đang hút dầu từ Phase 3: đạt.
- Kiểm tra cú pháp bộ phân tích và JavaScript: đạt.

## Bằng chứng hình ảnh

Ảnh chụp trình duyệt trước đó cho thấy HUD trên một canvas trống. Nguyên nhân là thiếu import `DT` trong vòng lặp dựng hình; lỗi đã được sửa ở commit `514e85b` trước Phase 3. Môi trường này không truy cập được máy chủ `127.0.0.1` của người dùng, vì vậy cảnh hiện tại, thanh/hiệu ứng nhấp nháy khi dầu yếu, tùy chọn màu dễ phân biệt và mục tiêu 30 FPS vẫn cần được kiểm tra thủ công trên máy cục bộ. Tài liệu này không khẳng định đã kiểm tra hình ảnh thành công hoặc đã đo FPS.

## Kiểm thử được thay thế

Kiểm thử Ticket-02 “tất cả đèn sáng ⇒ thắng ngay” không còn phù hợp. Kiểm thử đó đã được thay thế, không bị bỏ qua, bằng: kiểm tra thắng bình minh khi 3/5 đèn sáng; kiểm tra thua bình minh khi chỉ có 2/5 đèn sáng; và kiểm tra cả 5 đèn đã sáng nhưng thời gian vẫn còn thì trạng thái vẫn là `playing`. Ưu tiên thua khi hết Ngọn Lửa ở tick cuối được kiểm tra riêng.
