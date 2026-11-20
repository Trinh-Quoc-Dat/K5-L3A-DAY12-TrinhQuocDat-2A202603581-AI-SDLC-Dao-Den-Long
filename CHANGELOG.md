# Changelog

## Phase 3 · Contract v1.2

### Breaking changes

- Game không kết thúc khi thắp hết đèn; thắng chỉ ở bình minh khi còn sống và giữ đủ 60% đèn sáng.
- Đêm 1/2/3 giảm/thay thời lượng thành 240/270/300 giây.
- Đèn sáng tự hao dầu, nhận châm dầu, cạn thì tắt và ghi nhớ đã từng sáng. Thắp lại chỉ cần 5 đom đóm.
- Bóng Mực có trạng thái `drain`; vùng an toàn tắt khi dầu dưới 30; thêm sự kiện `refuel`, `lantern_out`, `fuel_drain`.
- Sức chứa thành 10 + 2 mỗi lần thắp thành công, tối đa 20; snapshot thêm `player.capacity` và trường dầu/đã thắp của đèn.
- Thay toàn bộ công thức điểm cũ bằng điểm nạp, thắp lần đầu/thắp lại, Tỏa Sáng và thưởng bình minh.
- Scenario hỗ trợ `player.successful_lights`, `lantern.fuel`, `lantern.ever_lit` và `shade.target_lantern_id`.

### Added

- Cài đặt bảng màu dễ phân biệt; đèn tắt có hình dạng/vết rách riêng; đèn yếu nhấp nháy và có thanh dầu.
- ADR-0003, tiêu chí Phase 3 và bộ scenario kiểm thử mới.
