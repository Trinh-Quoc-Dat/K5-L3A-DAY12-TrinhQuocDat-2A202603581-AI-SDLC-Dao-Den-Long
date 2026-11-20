# Nhật ký AI và retro · Phase 2

## Giả định đã ghi

Tệp ticket không chứa bảng tuning và RGB mà nó tham chiếu. Theo chỉ dẫn của người dùng, mình chọn thông số bổ sung, giữ các tuning Phase 1 tương thích, tăng sức chứa và giá nạp lên 10 theo HUD v1.1, dùng 300 giây mỗi đêm, lướt 14 m/s trong 12 tick với hồi chiêu 90 tick, và bảng màu chàm/ngọc lam/hổ phách. Danh sách đầy đủ cùng các chi tiết được chọn để hoàn thiện luật nằm trong [`../spec/phase-2.md`](../spec/phase-2.md).

## Nhật ký

- AI hỗ trợ chuyển contract v1.0 sang v1.1, mô phỏng vật lý theo tick, ba map, kịch bản headless và giao diện.
- Công cụ: Codex trong phiên hiện tại.
- Giao diện không cung cấp mức dùng token/chi phí chính xác; ghi là **không đo được** thay vì tự tạo con số.
- Tiết kiệm: mô phỏng thuần JavaScript dùng chung cho trình duyệt và headless; không cài engine/package; dùng primitive hình học và Web Audio.

## Evaluation / retro

- Test tự động bao phủ hồi quy Phase 1, đọc input lỗi, sự kiện, thời gian pause, lướt, bùa, bục phóng, Gió Lạc, ba map, gió và lịch sinh Bóng Mực.
- CUA hiển thị menu và HUD nhưng canvas 3D trống; trình duyệt giữ stylesheet cũ và máy chủ local không khởi động lại được trong môi trường này. Đã ghi rõ phần kiểm tra trực quan còn thiếu trong bằng chứng, không báo đạt.
- Bài học: input contract cần tách `tick` khỏi `sim_tick`; pause và cooldown phải được kiểm tra bằng snapshot quanh ranh giới tick. Tối ưu không cần package engine cho phép benchmark 18.000 tick trong thời gian ngắn.
- Nếu làm lại, sẽ yêu cầu giữ bảng tuning/RGB đầy đủ trong ticket trước lúc bắt đầu để tránh chọn giả định thay cho số chuẩn của đề.
