# ADR-0003: Dầu đèn và chiến thắng lúc bình minh

- Trạng thái: Chấp thuận
- Ngày: 2026-11-20
- Phase: 3, Ticket-03

## Bối cảnh

Playtest cho thấy người chơi có thể thắp mọi đèn sớm và kết thúc đêm trước khi áp lực tăng. Ticket-03 thay luật thắng ngay bằng việc giữ tối thiểu 60% đèn sáng đến hết giờ; đèn đã thắp có thể cạn dầu.

## Quyết định

- Mỗi đèn lưu `lit`, `ever_lit`, `relit_count`, `deposited` và lượng dầu nguyên `fuelUnits`. Một đơn vị dầu bằng 1/60 đơn vị hiển thị, nên tự hao 1 unit/tick và Bóng Mực hút 5 unit/tick mà không tích lũy sai số thực. Chỉ snapshot/event mới làm tròn dầu đến 0.1.
- Bật sáng lần đầu cần 10 đom đóm; đèn đã từng sáng cần 5. Đèn đang sáng nhận thêm dầu theo 10 dầu mỗi đom đóm, giới hạn 100.
- Dưới 30 dầu đèn mất vùng an toàn. Bóng Mực `wander` chọn đèn yếu gần nhất, vào cách 2 m thì `drain`; người chơi vào 6 m sẽ kéo nó sang `chase`. Châm dầu qua ngưỡng 30 đẩy Bóng Mực đang trong 6 m ra mép vùng an toàn, miễn sát thương tối đa 30 tick.
- Thắng chỉ được xét sau mọi cập nhật ở tick cuối: còn sống và đủ `ceil(0.6 × số đèn)` thì thắng `dawn_survived`; không đủ thì thua `dawn`. Hết Ngọn Lửa luôn ưu tiên thua `no_flames`.
- Điểm nạp đom đóm ghi nhận khi đom đóm thực sự được đưa vào đèn, không ghi lúc nhặt. Điểm bình minh chỉ cộng khi thắng.

## Hệ quả

Ticket-02 test “thắp đủ đèn thì thắng ngay” bị thay thế. Test thắng được đổi thành thắng tại bình minh với đúng ngưỡng 60%; test “mọi đèn sáng nhưng còn giờ” xác nhận game vẫn `playing`. Không có test nào bị skip âm thầm. Contract, HUD, kịch bản và bảng điểm được cập nhật theo v1.2.
