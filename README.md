# Đảo Đèn Lồng · Ba Đêm Giữ Sáng

Mây đi qua ba hòn đảo, nhặt đom đóm, thắp đèn rồi giữ đủ ánh sáng tới bình minh. Bóng Mực có thể hút cạn dầu; Gió Lạc vẫn rình lấy đom đóm; Bùa Gió giúp Mây chạy nhanh. Bản Phase 3 dùng contract v1.2.

## Chạy game

Cần Python 3, Node.js 18 trở lên và trình duyệt hỗ trợ WebGL. Three.js và phông chữ được tải từ CDN nên cần Internet.

- **Windows:** mở thư mục repo, nhấp đúp `run-game.bat` và để cửa sổ hiện ra mở khi chơi.
- **macOS/Linux:** từ thư mục repo chạy `python3 src/run.py`.

Máy chủ cục bộ mở game ở `http://127.0.0.1:8000/`. Dừng máy chủ bằng `Ctrl+C` trong cửa sổ chạy.

## Điều khiển

- `WASD` / phím mũi tên: di chuyển; kéo chuột: xoay camera.
- `Space`: nhảy; `Shift`: lướt; `E`: thắp/châm đèn; `Q`: Tỏa Sáng.
- `Esc` / `P`: tạm dừng; menu có chơi tiếp, chơi lại, cài đặt và về menu.

Mây mang tối thiểu 10 đom đóm; mỗi lần thắp thành công tăng sức chứa thêm 2, tối đa 20. Đèn sáng tự hao 1 dầu mỗi giây. Mỗi đom đóm châm thêm 10 dầu; đèn đã tắt cần 5 đom đóm để thắp lại. Dưới 30 dầu, đèn mất vùng an toàn và Bóng Mực có thể hút thêm 5 dầu mỗi giây. Giữ ít nhất 3/5, 4/6, 5/7 đèn sáng tương ứng tới hết Đêm 1/2/3 để thắng.

## Điểm

Mỗi đom đóm nạp vào đèn được 5 điểm; thắp lần đầu được thêm 100; thắp lại thêm 40. Tỏa Sáng trúng Bóng Mực được 5 điểm, hoặc 15 nếu nó đang hút dầu. Khi thắng, mỗi đèn còn sáng cộng `50 + floor(dầu còn lại)`; mỗi Ngọn Lửa cộng thêm 50. Không có thưởng thời gian.

## Chế độ headless và kiểm chứng

Mô phỏng 60 Hz chạy bằng Node.js, không cần cửa sổ hay GPU:

```sh
node tests/run.mjs
node src/headless.mjs --seed 42 --night 2 --ticks 21600 --out result.jsonl
```

`--night` nhận 1, 2 hoặc 3; có thể nối `--scenario FILE`, `--inputs FILE`, `--snapshot-every N`. Thông số contract v1.2 nằm trong [`game.contract.json`](game.contract.json).

## Sáng tạo của tôi

Ba bản đồ dùng bảng màu chàm, ngọc lam và vàng hổ phách; nhân vật, đảo và đèn dựng từ hình khối 3D. Đêm 2 có cầu tre và bục phóng; Đêm 3 có vành cao, dốc đá và tháp chuông. Âm thanh dùng Web Audio. Phase 3 thêm vết rách trên đèn tắt, thanh dầu nhìn thấy được, Bóng Mực có viền/mắt theo cài đặt màu dễ phân biệt và hiệu ứng đèn yếu nhấp nháy.

## Tài liệu

- Quyết định thiết kế: [`docs/adr/0003-oil-lanterns-dawn-win.md`](docs/adr/0003-oil-lanterns-dawn-win.md)
- Changelog phá vỡ tương thích: [`CHANGELOG.md`](CHANGELOG.md)
- Tiêu chí Phase 3: [`docs/spec/phase-3.md`](docs/spec/phase-3.md)
- Bằng chứng: [`docs/proof/phase-3.md`](docs/proof/phase-3.md)
- Nhật ký AI và retro: [`docs/notes/phase-3.md`](docs/notes/phase-3.md)
- Credits và giấy phép: [`CREDITS.md`](CREDITS.md), [`LICENSE`](LICENSE)
