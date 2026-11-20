# Đảo Đèn Lồng · Đêm 1: Đảo Bến

**Demo:** chưa quay trong môi trường làm việc này. Xem [bằng chứng Phase 1](docs/proof/phase-1.md).

Mây chạy quanh đảo trong đêm, nhặt đom đóm rồi nạp 3 đốm sáng vào mỗi Đèn Lồng Lớn. Bóng Mực đuổi theo; tỏa sáng bằng `Q` làm chúng choáng và đẩy lùi. Thắp đủ 5 đèn để thắng trước bình minh. Trúng đòn mất một tim và rơi một nửa số đom đóm đang mang. Tối đa 5 đốm sáng có thể mang cùng lúc.

## Chạy game

Cần Python 3 để mở máy chủ tĩnh và trình duyệt hiện đại có WebGL. Từ thư mục dự án:

```sh
python3 src/run.py
```

Lệnh mở game trên trình duyệt mặc định. Game tải Three.js và Be Vietnam Pro từ CDN nên cần Internet lần đầu. Dừng máy chủ bằng `Ctrl+C`.

## Điều khiển

- `WASD` hoặc phím mũi tên: di chuyển; kéo chuột trên màn hình để xoay hướng camera.
- `Space`: nhảy.
- `E`: nạp đom đóm vào đèn gần nhất khi đứng sát.
- `Q`: tỏa sáng, tiêu hao 1 tim năng lượng; hồi chiêu 1 giây.
- `R`: chơi lại sau khi thắng hoặc thua.

## Điểm

10 điểm mỗi đom đóm nhặt, 100 điểm mỗi đèn thắp, 25 điểm mỗi Bóng Mực bị choáng, cộng 1 điểm mỗi giây còn lại và 50 điểm mỗi tim còn lại khi thắng.

## Kiểm chứng headless

Cần Node.js 18 trở lên. Chạy cú pháp và các kịch bản kiểm chứng:

```sh
node --check src/game.mjs && node --check src/headless.mjs
node tests/run.mjs
node src/headless.mjs --seed 42 --night 1 --ticks 600 --out result.jsonl
```

Có thể thêm `--scenario FILE --inputs FILE --snapshot-every N`. Định dạng, bước 60 Hz, JSONL và thông số đúng với `game.contract.json` / Test Contract v1.0. Mô phỏng headless không cần đồ họa hay GPU. Kịch bản mẫu trong `tests/fixtures/` kiểm tra nhặt-nạp-thắp, tỏa sáng, tính tất định và mã lỗi 2 với input sai.

## Sáng tạo của tôi

Đảo có cụm cây phát sáng nhẹ, đường bờ nổi, Mây đội nón lá và cầm đèn nhỏ; biểu tượng HUD và hiệu ứng sương tạo sắc thái cổ tích. Đây là hình khối và chất liệu tự dựng, tắt hoàn toàn trong headless. Kiểm tra hồi quy ở `tests/run.mjs` xác nhận đầu ra headless vẫn tất định và các luật lõi hoạt động.

## Giả định & ghi chép

Thông số vận hành, giả định và kết quả kiểm chứng: [docs/proof/phase-1.md](docs/proof/phase-1.md). Nhật ký AI và retro: [docs/notes/phase-1.md](docs/notes/phase-1.md).
