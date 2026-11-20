# Phase 2 · Bằng chứng kiểm chứng

Chạy `node tests/run.mjs` để tạo lại bằng chứng headless. Bộ chạy kiểm thử tạo các tệp đầu ra trong thư mục tạm của hệ điều hành và kiểm tra trực tiếp các giá trị/sự kiện JSON; không chỉnh sửa thủ công các tệp đầu ra.

## Bảng nghiệm thu

| Yêu cầu | Bằng chứng | Kết quả |
|---|---|---|
| Tick cố định, snapshot tick 0, đầu ra tất định theo seed, dòng kết thúc JSONL | Chạy lặp lại với seed 77 trong 240 tick; so sánh từng byte đầu ra | Đạt |
| Nhặt đom đóm, nạp và thắp đèn; giữ nguyên sự kiện/dữ liệu Phase 1 | `pickup_scenario.json`, `pickup_inputs.json` | Đạt |
| Tỏa Sáng làm choáng Bóng Mực, kể cả mục tiêu ban đầu đã choáng; hồi chiêu và điểm | `pulse_scenario.json`, `pulse_inputs.json` | Đạt |
| Thắng Đêm và thua khi hết Ngọn Lửa; có `player_hit.lost` | `win_*` và `hit_scenario.json` | Đạt |
| Hướng lướt, tốc độ 14 m/s trong 12 tick, hồi chiêu | `dash_*` | Đạt |
| Nhặt bùa ở Đêm 2 và bộ đếm thời gian | `charm_scenario.json` | Đạt |
| Bệ phóng ở Đêm 2 đưa người chơi tới đảo B và tiếp đất vững | `pad_scenario.json`, chạy 85 tick | Đạt |
| Gió Lạc lấy tối đa 3 đom đóm; Tỏa Sáng làm rơi đom đóm đang mang | `drifter_scenario.json`, `drifter_drop_scenario.json` | Đạt |
| Sự kiện tạm dừng/tiếp tục và `sim_tick` được đóng băng | `pause_*`, snapshot ở tick 1 và 5 | Đạt |
| Bố cục đèn và đom đóm của Đêm 1/2/3; vị trí xuất phát tại nhà ở Đêm 3 | Snapshot bản đồ mặc định | Đạt |
| Đợt Bóng Mực đầu tiên ở Đêm 1; ID và số lượng xuất hiện | `schedule_scenario.json`, chạy 300 tick | Đạt |
| Thời điểm gió và hướng được chọn ở Đêm 3 | `night3_scenario.json`, chạy 1.800 tick | Đạt |
| JSON đầu vào/scenario sai cấu trúc trả mã thoát 2 | Tick đầu vào bị trùng và vector người chơi không hợp lệ | Đạt |
| Menu 3D, cảnh Đêm 1, HUD trực tiếp và bảng điều khiển trình duyệt | Lần kiểm tra trình duyệt trước phát hiện thiếu import `DT` khiến vòng lặp dựng hình dừng; đã sửa trong commit tiếp theo, vẫn cần kiểm tra lại trên trình duyệt | Cần kiểm tra thủ công |

## Thời lượng headless đầy đủ

Mô phỏng Node.js đã chạy Đêm 3 qua 18.000 bước (300 giây) và ghi JSONL trong **0,21 giây** theo phép đo cục bộ. Máy đo: Windows x64, Node.js v24.22.3, Intel Core i7-11370H, hệ điều hành báo cáo 8 luồng CPU logic, RAM 15,7 GiB. Scenario `tests/fixtures/perf_scenario.json` tắt các kẻ truy đuổi/gió để lượt chạy đến bình minh thay vì kết thúc sớm do thua. Chạy lại bằng:

```sh
Measure-Command { node src/headless.mjs --seed 2026 --night 3 --ticks 21600 --snapshot-every 900 --scenario tests/fixtures/perf_scenario.json --out result.jsonl }
```

## Kiểm tra hình ảnh

Trong lần kiểm tra trình duyệt cục bộ trước đây, HUD tĩnh hiện trên một canvas trống. Vòng lặp dựng hình tham chiếu `DT` nhưng không import nên hoạt ảnh dừng ngay ở khung hình đầu tiên. Lỗi đã được sửa bằng cách export `DT` từ `src/game.mjs` và import trong `src/view.mjs`. Sau khi sửa, kiểm tra cú pháp, kiểm tra export tần số 60 Hz và bộ kiểm thử headless đều đạt. Trình duyệt không kết nối lại được tới máy chủ cục bộ mới trong môi trường này, nên vẫn cần kiểm tra hình ảnh/FPS sau sửa lỗi. Trên máy có Internet, mở bản hiện tại bằng `python3 src/run.py` để tải Three.js từ CDN; xác nhận đảo và người chơi được dựng hình, đồng thời FPS trung bình đạt ít nhất 30.

## Giả định của Ticket

Ticket được cung cấp thiếu bảng thông số điều chỉnh và các dòng RGB chuẩn mà tài liệu có nhắc đến. Người dùng đã cho phép tự chọn thông số; mọi giá trị được chọn cùng vị trí xuất phát ở Đêm 3 đều được liệt kê trong [`../spec/phase-2.md`](../spec/phase-2.md). Nếu giảng viên cung cấp bảng chuẩn sau đó, hãy đối chiếu với `game.contract.json` và điều chỉnh trước khi phát hành.
