# Nhật ký AI và retro · Phase 1

## Nhật ký

- AI hỗ trợ đọc contract, chọn kiến trúc mô phỏng dùng chung, viết mã ban đầu và kịch bản kiểm chứng.
- Công cụ: Codex trong phiên làm việc này. Tổng token/chi phí chính xác không được giao diện phiên cung cấp; ghi nhận là **không đo được**, không tự ước lượng thành số liệu thật.
- Tiết kiệm: không thêm engine/package cài đặt; mô phỏng thuần JavaScript, giữ renderer riêng và test các luồng nhỏ trước.

## Evaluation

- Tự động: pickup → deposit → lantern_lit, pulse stun, replay tất định, input sai trả mã 2 đều đạt trên runtime cục bộ.
- Chưa có bằng chứng trực quan trình duyệt hoặc lượt chơi hoàn chỉnh; cần thực hiện trước khi coi Phase 1 đã kiểm tra đủ.
- Harness: `AGENTS.md` nhắc contract và lệnh; `tests/run.mjs` kiểm tra các hành vi quan trọng. Khi tuning thay đổi, cập nhật đồng thời contract và kiểm chứng.
- Retro: chia module simulation/view giúp headless không phụ thuộc GPU. Nếu làm lại, nên kiểm tra renderer sớm hơn và đo quota qua số liệu được giao diện cung cấp.
