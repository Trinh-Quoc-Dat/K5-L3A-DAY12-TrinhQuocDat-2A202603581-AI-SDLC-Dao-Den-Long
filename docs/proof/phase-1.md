# Phase 1 · Bằng chứng và giả định

## Tiêu chí và kiểm chứng

| Yêu cầu | Cách kiểm tra | Kết quả |
|---|---|---|
| Mô phỏng headless cố định 60 tick/s; snapshot 0; kết thúc JSONL | `node tests/run.mjs` và `node src/headless.mjs ...` | Đạt trong kiểm tra cục bộ |
| Nhặt đom đóm, nạp và thắp đèn | `tests/fixtures/pickup_*`; xác nhận ba event theo thứ tự và L1 sáng | Đạt |
| Tỏa sáng làm choáng và đẩy Bóng Mực | `tests/fixtures/pulse_*`; xác nhận event và trạng thái `stunned` | Đạt |
| Cùng seed/input cho output giống nhau | Chạy lại 240 tick, so byte JSONL | Đạt |
| Input sai trả mã 2 | Hai frame trùng tick | Đạt |
| Game 3D, nhân vật, đảo, đom đóm, Bóng Mực, camera và HUD | Mở `http://localhost:8000` trong Edge/WebGL | Đạt: cảnh 3D hiển thị; sau vài giây HUD tự cập nhật điểm 40 và 3/5 đom đóm; không có lỗi console tại thời điểm kiểm tra |
| Chơi trọn màn đến thắng/thua và chơi lại | Kiểm tra thủ công trong trình duyệt | Chưa xác nhận hết lượt chơi; cần thêm kiểm tra tương tác end-to-end |

Các kết quả tự động được tạo bằng `node tests/run.mjs`; không sửa tay output. Để tái tạo, chạy lệnh kiểm chứng trong README. Game đã được mở trực quan qua máy chủ cục bộ và thấy cảnh 3D cùng HUD; một ván hoàn chỉnh tới thắng/thua chưa được chơi thủ công.

## Giả định PRD-0

- Hòn đảo có bán kính đi lại 34 m; 5 đèn cố định cách tâm 22 m, đặt đều quanh đảo.
- Mỗi đèn cần 3 đom đóm; người chơi mang tối đa 5. Sinh 28 đom đóm và 3 Bóng Mực theo seed.
- Mây đi 6 m/s, nhặt ở 1.5 m, tương tác đèn ở 2.5 m.
- Mây bắt đầu với 3 tim năng lượng; pulse tốn 1, bán kính 8 m, choáng 3 giây, đẩy 5 m, hồi chiêu 1 giây.
- Bóng Mực đi 2.4 m/s, chạm trong 1.2 m gây mất 1 tim; bất tử sau đòn 1.5 giây, rơi 50% đom đóm đang mang (làm tròn xuống). Rơi khỏi đảo bị vô hiệu hóa trong bản đầu.
- Đêm dài 300 giây; thắng khi thắp đủ đèn, thua khi hết tim hoặc bình minh. Tỏa sáng không tiêu thụ đom đóm mang theo; dùng tim làm năng lượng.
- Điểm gồm: nhặt +10, thắp +100, choáng +25, mỗi giây còn lại +1 và mỗi tim còn lại khi thắng +50.

## Lệnh chạy đã dùng

- `node --check src/game.mjs && node --check src/headless.mjs`
- `node tests/run.mjs`
- `node src/headless.mjs --seed 42 --night 1 --ticks 600 --out result.jsonl`
