# Phase 2 · Ticket-02 · Tiêu chí nghiệm thu

Contract mục tiêu: v1.1. Các tiêu chí dưới đây được chép lại từ Ticket-02 được cung cấp. Tệp đính kèm thiếu bảng thông số điều chỉnh chuẩn và các dòng RGB được nhắc đến; người dùng đã cho phép tự chọn các giá trị ban đầu. Các giá trị Phase 1 được giữ lại khi còn phù hợp; sức chứa/HUD được đặt là 10 theo yêu cầu cụ thể của ticket. Các giá trị đã chọn và giới hạn này được ghi trong nhật ký giả định Phase 2.

## Mô phỏng cốt lõi và quy tắc chuẩn hóa

- [ ] Mô phỏng chạy ở tần số cố định 60 Hz và tuân theo đúng thứ tự các giai đoạn cập nhật trong ticket; thực thể xuất hiện trong một tick chỉ có thể tương tác từ tick tiếp theo.
- [ ] Khi tạm dừng, chỉ `tick` của mô phỏng thời gian thực tăng; `sim_tick` của gameplay, bộ đếm thời gian, hồi chiêu, lịch xuất hiện, TTL và hồi phục bùa đều đóng băng. Snapshot có `state: "paused"`.
- [ ] Tọa độ dùng mét, trục Y hướng lên; quy ước góc là trục +X quay ngược chiều kim đồng hồ khi nhìn từ trên xuống.
- [ ] Dùng bản đồ chuẩn Đêm 1: đảo tròn bán kính 40, vị trí xuất phát, tọa độ 5 đèn, điểm xuất hiện đom đóm và quy tắc/lịch xuất hiện Bóng Mực.
- [ ] Triển khai bản đồ Đêm 2 theo ticket: hai đảo nối bằng cầu, 6 đèn, điểm xuất hiện riêng cho mỗi đảo, bệ phóng và vận tốc khi chuyển đảo.
- [ ] Triển khai bản đồ Đêm 3 theo ticket: đảo có 3 độ cao, các mặt đi được, chỗ rơi thẳng đứng, 2 đường dốc, bệ phóng, tháp chuông, đèn và các điểm xuất hiện.
- [ ] Điểm chuẩn: nhặt đom đóm +10, thắp đèn +100, mỗi Bóng Mực bị Tỏa Sáng đánh trúng +5; thắng Đêm được cộng `floor(số giây còn lại) × 2 + 50 × số Ngọn Lửa còn`. Tổng điểm chỉ cộng từ những Đêm đã thắng.
- [ ] Dùng bộ thông số nền đã chọn và ghi lại cho tốc độ di chuyển, sức chứa, chi phí/bán kính đèn, Tỏa Sáng, số mạng, thời gian bất tử, tốc độ địch, thời lượng Đêm và thời gian lướt. Chạy lặp lại các scenario Phase 1.

## Tính năng Phase 2 (các mục 1–8 trong ticket)

1. **Gió Lạc, Đêm 2–3:** xuất hiện ở tick 1200, 2400, … tại các điểm sương được chọn tất định theo seed; tối đa 2 con; các chuyển trạng thái idle/chase/flee/removed, ngưỡng/khoảng cách, hành vi trộm một lần, thời gian bỏ chạy, tương tác với Tỏa Sáng và va chạm không gây chết đều tuân theo ticket.
2. **Bùa Gió:** vật phẩm nhặt được C1/C2, hiệu lực 600 tick, tốc độ chạy 7,2 m/s, bỏ hồi chiêu lướt trong thời gian có bùa nhưng vẫn giữ thao tác nhấn/kích hoạt lướt; xuất hiện lại sau 2700 tick tại vị trí tương ứng của từng Đêm.
3. **Luồng chơi ba Đêm:** menu chính → giới thiệu Đêm (tên đảo và lời dẫn của Ông Đăng) → chơi → kết quả → Đêm tiếp theo; thắng Đêm 3 hiển thị bình minh và tổng điểm; thua thì chơi lại chính Đêm đó.
4. **Tạm dừng:** Esc/P bật/tắt tạm dừng; các lựa chọn Tiếp tục, Chơi lại Đêm, Cài đặt, Về menu chính hoạt động; mô phỏng tuân thủ quy tắc đóng băng.
5. **Cài đặt:** âm lượng và độ nhạy chuột được lưu qua lần tải lại trang.
6. **Âm thanh:** nhạc nền mỗi Đêm và âm báo cho các sự kiện nhặt đom đóm, thắp đèn, Tỏa Sáng, trúng đòn, nhảy, lướt, thắng, thua, Bóng Mực xuất hiện và đếm ngược 10 giây cuối.
7. **HUD:** số Ngọn Lửa, đồng hồ giữa màn hình nhấp nháy đỏ khi sắp hết giờ, số đèn và điểm, thanh 10 ô đom đóm, hồi chiêu lướt/Tỏa Sáng, lời nhắc đèn ở gần (`E — Nạp ánh sáng (x/10)`), mũi tên chỉ đèn tối gần nhất ở ngoài màn hình.
8. **Bảng màu/môi trường:** dùng bảng màu tự chọn gồm vàng hổ phách ấm, xanh ngọc và chàm đậm; cường độ môi trường theo công thức `0.15 + 0.55 × lit / total`. Các mã RGB nguồn bị thiếu; bản dựng dùng bảng màu nhất quán do người dùng cho phép tự chọn.

## Test Contract v1.1

- [ ] `game.contract.json` khai báo phiên bản 1.1, thông số chuẩn và `dash_speed`, `dash_duration_s`, `dash_cooldown_s`, `night2_duration_s`, `night3_duration_s`.
- [ ] Headless nhận `--night` là 1, 2 hoặc 3; mỗi Đêm có thể chạy đến kết thúc trong tối đa 21.600 tick và không quá 30 giây.
- [ ] Snapshot có đêm, gió, vận tốc/trạng thái chạm đất/thời gian bất tử/hồi chiêu lướt/hồi chiêu Tỏa Sáng/thời gian bùa của người chơi; đom đóm kèm loại và TTL; Gió Lạc và bùa.
- [ ] Scenario hỗ trợ hồi chiêu/bùa của người chơi, trạng thái/bộ đếm của Bóng Mực, thay thế danh sách Gió Lạc/bùa, cờ bật/tắt Gió Lạc và gió.
- [ ] Inputs hỗ trợ lướt khi nút chuyển từ nhả sang nhấn và thao tác tạm dừng.
- [ ] Phát tất cả sự kiện mới với đúng tên/dữ liệu; `player_hit` có trường `lost`.
- [ ] Bóng Mực chỉ dùng các trạng thái `spawning`, `wander`, `chase`, `recoil`, `stunned`.
- [ ] Giữ nguyên mọi hành vi Phase 1 được kiểm thử ẩn với thông số chuẩn.
- [ ] Mỗi tính năng mới có ít nhất một scenario headless tái lập được để kiểm tra.
- [ ] Gameplay thông thường đạt trung bình ít nhất 30 FPS ở độ phân giải 1280×720.

## Kế hoạch kiểm chứng

Thêm một scenario headless tất định cho mỗi cơ chế thay đổi: quỹ đạo lướt và bệ phóng; tính tick khi tạm dừng/tiếp tục; bản đồ, nhặt đồ và tương tác của Đêm 1/2/3; nhặt/làm mới/xuất hiện lại bùa; ngưỡng của Gió Lạc, trộm, tương tác Tỏa Sáng, làm rơi và hết thời gian; bắt đầu/dừng gió; tên trạng thái và lịch xuất hiện Bóng Mực; thắng/thua/chơi lại/tiến trình và tổng điểm; ghi đè scenario cùng mọi trường snapshot/sự kiện v1.1. Chạy lại các scenario Phase 1 hiện có với engine v1.1 để kiểm tra hồi quy.

## Giả định đã chọn theo sự cho phép của người dùng

- Giữ các giá trị Phase 1: tốc độ người chơi 6 m/s, bán kính nhặt/tương tác 1,5/2,5 m, chi phí/bán kính Tỏa Sáng 1/8 m, 3 Ngọn Lửa, bất tử 1,5 giây, rơi 50% đom đóm khi trúng đòn, choáng 3 giây, đẩy lùi 5 m, hồi chiêu Tỏa Sáng 1 giây, vùng an toàn 5 m, tốc độ Bóng Mực 2,4 m/s và bán kính va chạm 1,2 m.
- Đặt sức chứa và chi phí thắp đèn là 10, khớp với thanh 10 ô và lời nhắc tương tác `x/10` trong ticket.
- Dùng thời lượng 300 giây cho mỗi Đêm vì ticket được cung cấp thiếu các giá trị thời lượng được dẫn chiếu.
- Lướt có tốc độ 14 m/s trong 12 tick; chọn hồi chiêu thông thường 90 tick (1,5 giây). Bùa có hiệu lực 600 tick như quy định và bỏ hồi chiêu lướt trong thời gian còn hiệu lực.
- Dùng bảng màu tự thiết kế gồm chàm ánh trăng, xanh ngọc và vàng đèn lồng; giữ độ tương phản cao và công thức tăng ánh sáng môi trường trong ticket.
- Giai đoạn cảnh báo/xuất hiện của Bóng Mực là 30 tick. Ticket được cung cấp không nêu thời lượng này; đây là lựa chọn khi triển khai và trạng thái cần hiển thị trong snapshot.
- Seed điều khiển mọi lựa chọn ngẫu nhiên về điểm sương, điểm xuất hiện và hướng gió.
