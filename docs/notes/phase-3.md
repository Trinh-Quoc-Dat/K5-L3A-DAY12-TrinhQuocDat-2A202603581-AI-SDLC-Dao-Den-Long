# Phase 3 · Nhật ký AI và hồi tưởng

## Quyết định và giả định

- Lượng dầu được lưu dưới dạng số nguyên theo đơn vị 1/60: 60 đơn vị tương ứng 1 đơn vị dầu; đèn tự hao 1 đơn vị mỗi tick; mỗi Bóng Mực đang hút dầu lấy thêm 5 đơn vị mỗi tick.
- `fuel_drain.fuel` ghi lượng dầu còn lại sau khi Bóng Mực hút dầu, vào mỗi tick thứ 60 của mô phỏng.
- Khi được đẩy ra, Bóng Mực có khoảng thời gian 30 tick không thể gây sát thương và được đưa đến rìa vùng an toàn bán kính 5 mét. Cách làm này đáp ứng giới hạn tối đa 30 tick, đồng thời vẫn thể hiện rõ ranh giới an toàn.
- Đèn được đặt sẵn ở trạng thái sáng trong scenario mà không khai báo lượng dầu sẽ mặc định có 100 dầu. Đèn tắt luôn có `fuel` bằng 0 trong snapshot. Đèn được bật sẵn trong scenario không làm tăng số lần thắp thành công và không cộng điểm.
- Lỗi thiếu import `DT` trước đây khiến vòng lặp hiển thị trên trình duyệt dừng đã được sửa ở commit `514e85b`; lịch sử Phase 2 vẫn ghi nhận thay đổi này.

## Nhật ký dùng AI/công cụ

- Codex đã triển khai các thay đổi mô phỏng v1.2, HUD, cài đặt màu, scenario, kiểm thử và tài liệu này.
- Giao diện không cung cấp số token hoặc chi phí chính xác; mục này ghi là chưa đo được.
- Dùng chung một mô phỏng tất định cho chế độ headless và phần chơi trên trình duyệt; không thêm engine game bên ngoài.

## Hồi tưởng

Scenario cũ kiểm tra việc thắng ngay khi thắp hết đèn không bị bỏ qua: scenario đó được thay bằng hai kiểm thử để xác nhận ngưỡng thắng lúc bình minh và trường hợp tất cả đèn đều sáng nhưng thời gian vẫn còn. Lưu lượng dầu dưới dạng số nguyên giúp kiểm tra chính xác các ngưỡng và trạng thái ở cuối đêm. Việc còn lại là đo FPS trên trình duyệt và kiểm tra trực quan hiệu ứng đèn ít dầu cùng bảng màu dễ phân biệt trên máy người dùng, khi máy chủ cục bộ đang chạy.
