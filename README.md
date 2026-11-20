# Đảo Đèn Lồng · Ba Đêm Giữ Sáng

**Demo:** chưa quay video cho Phase 2; ảnh và kết quả kiểm chứng được ghi trong [`docs/proof/phase-2.md`](docs/proof/phase-2.md).

Mây chạy qua ba hòn đảo giữa biển mây, gom đom đóm và thắp các Đèn Lồng Lớn trước bình minh. Bóng Mực truy đuổi; Gió Lạc rình lấy đom đóm; Bùa Gió tăng tốc. Các đêm có cầu tre, bục phóng và đảo nhiều tầng.

## Chạy game

Cần Python 3, Node.js 18 trở lên và trình duyệt có WebGL. Từ thư mục repo:

```sh
python3 src/run.py
```

Lệnh mở game trên trình duyệt mặc định. Three.js và Be Vietnam Pro được tải từ CDN nên cần Internet. Dừng máy chủ bằng `Ctrl+C`.

## Điều khiển

- `WASD` / phím mũi tên: chạy; kéo chuột: xoay camera.
- `Space`: nhảy; `Shift`: lướt; `E`: nạp đom đóm vào đèn; `Q`: Tỏa Sáng.
- `Esc` / `P`: tạm dừng. Chơi lại trong màn hình kết quả hoặc menu tạm dừng.

Mây mang tối đa 10 đom đóm. Mỗi đèn cần 10. Chạm Bóng Mực mất một Ngọn Lửa và rơi một nửa số đang mang. Tỏa Sáng tiêu hao một Ngọn Lửa. Bùa Gió kéo dài 10 giây, tăng tốc chạy và bỏ hồi chiêu Lướt.

## Điểm

10 điểm mỗi đom đóm nhặt, 100 mỗi đèn thắp, 5 mỗi Bóng Mực trúng Tỏa Sáng (kể cả đang choáng). Thắng một đêm cộng `floor(giây còn lại) × 2 + 50 × Ngọn Lửa còn lại`; tổng điểm giữ các đêm đã thắng.

## Chế độ headless và kiểm chứng

Mô phỏng 60 Hz chạy bằng Node.js, không cần cửa sổ hay GPU. Ví dụ:

```sh
node tests/run.mjs
node src/headless.mjs --seed 42 --night 2 --ticks 21600 --out result.jsonl
```

`--night` nhận 1, 2 hoặc 3; có thể nối `--scenario FILE`, `--inputs FILE`, `--snapshot-every N`. Schema v1.1 và thông số đã chọn nằm trong [`game.contract.json`](game.contract.json). Các scenario headless kiểm tra hồi quy Phase 1, lướt, bùa, bục phóng, Gió Lạc, pause, lịch sinh kẻ địch, gió, bản đồ và thắng/thua.

## Sáng tạo của tôi

Ba bản đồ dùng bảng màu chàm, ngọc lam và vàng hổ phách; hình khối cây, đèn và nhân vật được dựng trong Three.js. Đêm 2 có cầu tre qua biển mây; Đêm 3 có vành cao, thềm chuông và dốc đá. Hệ thống âm thanh dùng Web Audio nên không cần tải nhạc/hiệu ứng bên ngoài. Các phần trang trí không tham gia mô phỏng headless.

## Tài liệu Phase 2

- Spec và tiêu chí nghiệm thu: [`docs/spec/phase-2.md`](docs/spec/phase-2.md)
- Bằng chứng và kết quả chạy: [`docs/proof/phase-2.md`](docs/proof/phase-2.md)
- Giả định, nhật ký AI và retro: [`docs/notes/phase-2.md`](docs/notes/phase-2.md)
- Credits và giấy phép: [`CREDITS.md`](CREDITS.md), [`LICENSE`](LICENSE)
