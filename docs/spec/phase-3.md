# Phase 3 · Acceptance criteria

Contract v1.2 target: `game.contract.json`.

## Thay đổi luật cốt lõi

- [x] Dầu đèn có giới hạn 100, hao 1/giây và được lưu theo integer 1/60 unit.
- [x] Thắp đầu tiên 10 đom đóm; thắp lại 5; châm đèn sáng theo công thức `ceil((100-fuel)/10)`.
- [x] Hết dầu chuyển sang tắt, đặt `deposited=0`, giữ `ever_lit=true`, phát `lantern_out`.
- [x] Ngưỡng an toàn giữ tại đúng 30 dầu; dưới 30 thì mất vùng an toàn.
- [x] Bóng Mực wander chọn weak lamp gần nhất; `drain` hút 5/giây, chuyển chase trong 6 m, rời drain khi đèn tắt/đủ dầu/ra quá 2 m; pulse choáng.
- [x] Châm dầu vượt 30 đẩy shade cách đèn ra vùng an toàn trong tối đa 30 tick và không gây sát thương trong khoảng đó.
- [x] Không thắng sớm; bình minh thắng cần sống sót và giữ đủ `ceil(0.6 × total)` đèn sáng.
- [x] Hết máu được xét trước kết quả bình minh.
- [x] Sức chứa tăng 2 mỗi lần thắp thành công, tối đa 20, đặt lại mỗi đêm.
- [x] Điểm nạp +5, lần đầu +100, thắp lại +40, pulse thường +5, pulse khi drain +15, bình minh theo dầu/đèn/ngọn lửa; bỏ thưởng thời gian.
- [x] Cài đặt màu dễ phân biệt đã lưu, cảnh báo trắng có ⚠, vết rách/đèn xẹp và nhấp nháy dầu yếu được triển khai.
- [ ] Kiểm tra trực quan màu, thanh dầu/nhấp nháy và 30 FPS trên trình duyệt thật (chưa đo trong phiên này).

## Contract và hồi quy

- [x] Contract v1.2, tuning dầu, ngưỡng thắng, sức chứa, durations.
- [x] Snapshot có fuel, ever_lit, relit_count, capacity; shade có drain.
- [x] Scenario hỗ trợ fuel, ever_lit, successful_lights và target lantern.
- [x] Event/data mới có kiểm thử tái lập.
- [x] Test thắng cũ được sửa từ all-lit-at-once sang dawn threshold; test all-lit-before-dawn xác nhận chưa thắng. Xem ADR-0003.
- [x] Bộ Phase 1–2 còn phù hợp tiếp tục chạy; chỉ luật/điểm bị ticket thay thế được điều chỉnh.

## Kiểm chứng cần giữ

Chạy `node tests/run.mjs`. Kịch bản xác nhận: bình minh thắng/thua, hết lửa đúng tick cuối, thắp lại và sức chứa, châm dầu vượt ngưỡng, drain và event mỗi 60 tick, extinguish, pulse khi drain, không thắng sớm, và hồi quy Phase 1–2. Độ mượt giao diện 3D cần đo trên máy có WebGL; không đánh dấu đạt nếu chưa có phép đo.
