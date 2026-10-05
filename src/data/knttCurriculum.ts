import { GradeLevel } from '../types/worksheet';

export interface LessonItem {
  id: string;
  name: string;
}

export interface ChapterItem {
  id: string;
  name: string;
  lessons: LessonItem[];
}

export interface VolumeItem {
  id: string;
  name: string; // "TẬP MỘT" | "TẬP HAI"
  chapters: ChapterItem[];
}

export const KNTT_CURRICULUM: Record<GradeLevel, VolumeItem[]> = {
  6: [
    {
      id: 'g6_v1',
      name: 'TẬP MỘT',
      chapters: [
        {
          id: 'g6_c1',
          name: 'Chương I. TẬP HỢP CÁC SỐ TỰ NHIÊN',
          lessons: [
            { id: 'g6_b1', name: 'Bài 1. Tập hợp các số tự nhiên' },
            { id: 'g6_b2', name: 'Bài 2. Cách ghi số tự nhiên' },
            { id: 'g6_b3', name: 'Bài 3. Thứ tự trong tập hợp các số tự nhiên' },
            { id: 'g6_b4', name: 'Bài 4. Phép cộng và phép trừ số tự nhiên' },
            { id: 'g6_b5', name: 'Bài 5. Phép nhân và phép chia số tự nhiên' },
            { id: 'g6_ltc1', name: 'Luyện tập chung' },
            { id: 'g6_b6', name: 'Bài 6. Lũy thừa với số mũ tự nhiên' },
            { id: 'g6_b7', name: 'Bài 7. Thứ tự thực hiện các phép tính' },
            { id: 'g6_b8', name: 'Bài 8. Quan hệ chia hết và tính chất' },
            { id: 'g6_b9', name: 'Bài 9. Dấu hiệu chia hết cho 2, cho 5' },
            { id: 'g6_b10', name: 'Bài 10. Dấu hiệu chia hết cho 3, cho 9' },
            { id: 'g6_b11', name: 'Bài 11. Số nguyên tố' },
            { id: 'g6_b12', name: 'Bài 12. Ước chung. Ước chung lớn nhất' },
            { id: 'g6_b13', name: 'Bài 13. Bội chung. Bội chung nhỏ nhất' },
            { id: 'g6_c1_end', name: 'Bài tập cuối chương I' },
          ],
        },
        {
          id: 'g6_c2',
          name: 'Chương II. TÍNH CHIA HẾT TRONG TẬP HỢP CÁC SỐ NGUYÊN',
          lessons: [
            { id: 'g6_b14', name: 'Bài 14. Tập hợp các số nguyên' },
            { id: 'g6_b15', name: 'Bài 15. Phép cộng và phép trừ số nguyên' },
            { id: 'g6_b16', name: 'Quy tắc dấu ngoặc' },
            { id: 'g6_b17', name: 'Bài 16. Phép nhân số nguyên' },
            { id: 'g6_b18', name: 'Bài 17. Phép chia hết. Ước và bội của một số nguyên' },
            { id: 'g6_c2_end', name: 'Bài tập cuối chương II' },
          ],
        },
        {
          id: 'g6_c3',
          name: 'Chương III. HÌNH HỌC TRỰC QUAN',
          lessons: [
            { id: 'g6_b19', name: 'Bài 18. Tam giác đều. Hình vuông. Lục giác đều' },
            { id: 'g6_b20', name: 'Bài 19. Hình chữ nhật. Hình thoi. Hình bình hành. Hình thang cân' },
            { id: 'g6_b21', name: 'Bài 20. Chu vi và diện tích một số hình tứ giác đã học' },
            { id: 'g6_c3_end', name: 'Bài tập cuối chương III' },
          ],
        },
        {
          id: 'g6_c4',
          name: 'Chương IV. MỘT SỐ HÌNH PHẲNG TRONG THỰC TIỄN',
          lessons: [
            { id: 'g6_b22', name: 'Bài 21. Hình có trục đối xứng' },
            { id: 'g6_b23', name: 'Bài 22. Hình có tâm đối xứng' },
            { id: 'g6_c4_end', name: 'Bài tập cuối chương IV' },
          ],
        },
        {
          id: 'g6_c5',
          name: 'Chương V. TÍNH ĐỐI XỨNG CỦA HÌNH PHẲNG TRONG TỰ NHIÊN',
          lessons: [
            { id: 'g6_b24', name: 'Thu thập, tổ chức và xử lý dữ liệu' },
            { id: 'g6_b25', name: 'Biểu đồ tranh và biểu đồ cột' },
            { id: 'g6_c5_end', name: 'Bài tập cuối chương V' },
          ],
        },
      ],
    },
    {
      id: 'g6_v2',
      name: 'TẬP HAI',
      chapters: [
        {
          id: 'g6_c6',
          name: 'Chương VI. PHÂN SỐ',
          lessons: [
            { id: 'g6_b26', name: 'Bài 23. Mở rộng phân số. Phân số bằng nhau' },
            { id: 'g6_b27', name: 'Bài 24. So sánh phân số. Hỗn số dương' },
            { id: 'g6_b28', name: 'Bài 25. Phép cộng và phép trừ phân số' },
            { id: 'g6_b29', name: 'Bài 26. Phép nhân và phép chia phân số' },
            { id: 'g6_b30', name: 'Bài 27. Hai bài toán về phân số' },
            { id: 'g6_c6_end', name: 'Bài tập cuối chương VI' },
          ],
        },
        {
          id: 'g6_c7',
          name: 'Chương VII. SỐ THẬP PHÂN',
          lessons: [
            { id: 'g6_b31', name: 'Bài 28. Số thập phân' },
            { id: 'g6_b32', name: 'Bài 29. Tính toán với số thập phân' },
            { id: 'g6_b33', name: 'Bài 30. Làm tròn và ước lượng' },
            { id: 'g6_b34', name: 'Bài 31. Một số bài toán về tỉ số và tỉ số phần trăm' },
            { id: 'g6_c7_end', name: 'Bài tập cuối chương VII' },
          ],
        },
        {
          id: 'g6_c8',
          name: 'Chương VIII. NHỮNG HÌNH HÌNH HỌC CƠ BẢN',
          lessons: [
            { id: 'g6_b35', name: 'Bài 32. Điểm và đường thẳng' },
            { id: 'g6_b36', name: 'Bài 33. Điểm nằm giữa hai điểm. Tia' },
            { id: 'g6_b37', name: 'Bài 34. Đoạn thẳng. Độ dài đoạn thẳng' },
            { id: 'g6_b38', name: 'Bài 35. Trung điểm của đoạn thẳng' },
            { id: 'g6_b39', name: 'Bài 36. Góc' },
            { id: 'g6_b40', name: 'Bài 37. Số đo góc' },
            { id: 'g6_c8_end', name: 'Bài tập cuối chương VIII' },
          ],
        },
        {
          id: 'g6_c9',
          name: 'Chương IX. DỮ LIỆU VÀ XÁC SUẤT THỰC NGHIỆM',
          lessons: [
            { id: 'g6_b41', name: 'Bài 38. Dữ liệu và thu thập dữ liệu' },
            { id: 'g6_b42', name: 'Bài 39. Bảng thống kê và biểu đồ tranh' },
            { id: 'g6_b43', name: 'Bài 40. Biểu đồ cột' },
            { id: 'g6_b44', name: 'Bài 41. Biểu đồ cột kép' },
            { id: 'g6_b45', name: 'Bài 42. Kết quả có thể và sự kiện' },
            { id: 'g6_b46', name: 'Bài 43. Xác suất thực nghiệm' },
            { id: 'g6_c9_end', name: 'Bài tập cuối chương IX' },
          ],
        },
      ],
    },
  ],
  7: [
    {
      id: 'g7_v1',
      name: 'TẬP MỘT',
      chapters: [
        {
          id: 'g7_c1',
          name: 'Chương I. SỐ HỮU TỈ',
          lessons: [
            { id: 'g7_b1', name: 'Bài 1. Tập hợp các số hữu tỉ' },
            { id: 'g7_b2', name: 'Bài 2. Cộng, trừ, nhân, chia số hữu tỉ' },
            { id: 'g7_b3', name: 'Bài 3. Lũy thừa với số mũ tự nhiên của một số hữu tỉ' },
            { id: 'g7_b4', name: 'Bài 4. Thứ tự thực hiện các phép tính. Quy tắc chuyển vế' },
            { id: 'g7_ltc1', name: 'Luyện tập chung' },
            { id: 'g7_c1_end', name: 'Bài tập cuối chương I' },
          ],
        },
        {
          id: 'g7_c2',
          name: 'Chương II. SỐ THỰC',
          lessons: [
            { id: 'g7_b5', name: 'Bài 5. Làm quen với số thập phân vô hạn tuần hoàn' },
            { id: 'g7_b6', name: 'Bài 6. Số vô tỉ. Căn bậc hai số học' },
            { id: 'g7_b7', name: 'Bài 7. Tập hợp các số thực' },
            { id: 'g7_ltc2', name: 'Luyện tập chung' },
            { id: 'g7_c2_end', name: 'Bài tập cuối chương II' },
          ],
        },
        {
          id: 'g7_c3',
          name: 'Chương III. GÓC VÀ ĐƯỜNG THẲNG SONG SONG',
          lessons: [
            { id: 'g7_b8', name: 'Bài 8. Góc ở vị trí đặc biệt. Tia phân giác của một góc' },
            { id: 'g7_b9', name: 'Bài 9. Hai đường thẳng song song và dấu hiệu nhận biết' },
            { id: 'g7_b10', name: 'Bài 10. Tiên đề Euclid. Tính chất của hai đường thẳng song song' },
            { id: 'g7_b11', name: 'Bài 11. Định lí và chứng minh định lí' },
            { id: 'g7_ltc3', name: 'Luyện tập chung' },
            { id: 'g7_c3_end', name: 'Bài tập cuối chương III' },
          ],
        },
        {
          id: 'g7_c4',
          name: 'Chương IV. TAM GIÁC BẰNG NHAU',
          lessons: [
            { id: 'g7_b12', name: 'Bài 12. Tổng các góc trong một tam giác' },
            { id: 'g7_b13', name: 'Bài 13. Hai tam giác bằng nhau. Trường hợp bằng nhau thứ nhất c-c-c' },
            { id: 'g7_b14', name: 'Bài 14. Trường hợp bằng nhau thứ hai và thứ ba của tam giác' },
            { id: 'g7_b15', name: 'Bài 15. Các trường hợp bằng nhau của tam giác vuông' },
            { id: 'g7_b16', name: 'Bài 16. Tam giác cân. Đường trung trực của đoạn thẳng' },
            { id: 'g7_ltc4', name: 'Luyện tập chung' },
            { id: 'g7_c4_end', name: 'Bài tập cuối chương IV' },
          ],
        },
        {
          id: 'g7_c5',
          name: 'Chương V. THU THẬP VÀ BIỂU DIỄN DỮ LIỆU',
          lessons: [
            { id: 'g7_b17', name: 'Bài 17. Thu thập và phân loại dữ liệu' },
            { id: 'g7_b18', name: 'Bài 18. Biểu đồ hình quạt tròn' },
            { id: 'g7_b19', name: 'Bài 19. Biểu đồ đoạn thẳng' },
            { id: 'g7_ltc5', name: 'Luyện tập chung' },
            { id: 'g7_c5_end', name: 'Bài tập cuối chương V' },
          ],
        },
      ],
    },
    {
      id: 'g7_v2',
      name: 'TẬP HAI',
      chapters: [
        {
          id: 'g7_c6',
          name: 'Chương VI. TỈ LỆ THỨC VÀ ĐẠI LƯỢNG TỈ LỆ',
          lessons: [
            { id: 'g7_b20', name: 'Bài 20. Tỉ lệ thức' },
            { id: 'g7_b21', name: 'Bài 21. Tính chất của dãy tỉ số bằng nhau' },
            { id: 'g7_b22', name: 'Bài 22. Đại lượng tỉ lệ thuận' },
            { id: 'g7_b23', name: 'Bài 23. Đại lượng tỉ lệ nghịch' },
            { id: 'g7_ltc6', name: 'Luyện tập chung' },
            { id: 'g7_c6_end', name: 'Bài tập cuối chương VI' },
          ],
        },
        {
          id: 'g7_c7',
          name: 'Chương VII. BIỂU THỨC ĐẠI SỐ VÀ ĐA THỨC MỘT BIẾN',
          lessons: [
            { id: 'g7_b24', name: 'Bài 24. Biểu thức đại số' },
            { id: 'g7_b25', name: 'Bài 25. Đa thức một biến' },
            { id: 'g7_b26', name: 'Bài 26. Phép cộng và phép trừ đa thức một biến' },
            { id: 'g7_b27', name: 'Bài 27. Phép nhân đa thức một biến' },
            { id: 'g7_b28', name: 'Bài 28. Phép chia đa thức một biến' },
            { id: 'g7_ltc7', name: 'Luyện tập chung' },
            { id: 'g7_c7_end', name: 'Bài tập cuối chương VII' },
          ],
        },
        {
          id: 'g7_c8',
          name: 'Chương VIII. LÀM QUEN VỚI BIẾN CỐ VÀ XÁC SUẤT CỦA BIẾN CỐ',
          lessons: [
            { id: 'g7_b29', name: 'Bài 29. Làm quen với biến cố' },
            { id: 'g7_b30', name: 'Bài 30. Làm quen với xác suất của biến cố' },
            { id: 'g7_ltc8', name: 'Luyện tập chung' },
            { id: 'g7_c8_end', name: 'Bài tập cuối chương VIII' },
          ],
        },
        {
          id: 'g7_c9',
          name: 'Chương IX. QUAN HỆ GIỮA CÁC YẾU TỐ TRONG MỘT TAM GIÁC',
          lessons: [
            { id: 'g7_b31', name: 'Bài 31. Quan hệ giữa góc và cạnh đối diện trong một tam giác' },
            { id: 'g7_b32', name: 'Bài 32. Quan hệ giữa đường vuông góc và đường xiên' },
            { id: 'g7_b33', name: 'Bài 33. Quan hệ giữa ba cạnh của một tam giác' },
            { id: 'g7_b34', name: 'Bài 34. Sự đồng quy của ba đường trung tuyến, ba đường phân giác' },
            { id: 'g7_b35', name: 'Bài 35. Sự đồng quy của ba đường trung trực, ba đường cao' },
            { id: 'g7_ltc9', name: 'Luyện tập chung' },
            { id: 'g7_c9_end', name: 'Bài tập cuối chương IX' },
          ],
        },
        {
          id: 'g7_c10',
          name: 'Chương X. MỘT SỐ HÌNH KHỐI TRONG THỰC TIỄN',
          lessons: [
            { id: 'g7_b36', name: 'Bài 36. Hình hộp chữ nhật và hình lập phương' },
            { id: 'g7_b37', name: 'Bài 37. Hình lăng trụ đứng tam giác và lăng trụ đứng tứ giác' },
            { id: 'g7_ltc10', name: 'Luyện tập chung' },
            { id: 'g7_c10_end', name: 'Bài tập cuối chương X' },
          ],
        },
      ],
    },
  ],
  8: [
    {
      id: 'g8_v1',
      name: 'TẬP MỘT',
      chapters: [
        {
          id: 'g8_c1',
          name: 'Chương I. ĐA THỨC',
          lessons: [
            { id: 'g8_b1', name: 'Bài 1. Đơn thức' },
            { id: 'g8_b2', name: 'Bài 2. Đa thức' },
            { id: 'g8_b3', name: 'Bài 3. Phép cộng và phép trừ đa thức' },
            { id: 'g8_ltc1', name: 'Luyện tập chung' },
            { id: 'g8_b4', name: 'Bài 4. Phép nhân đa thức' },
            { id: 'g8_b5', name: 'Bài 5. Phép chia đa thức cho đơn thức' },
            { id: 'g8_ltc2', name: 'Luyện tập chung' },
            { id: 'g8_c1_end', name: 'Bài tập cuối chương I' },
          ],
        },
        {
          id: 'g8_c2',
          name: 'Chương II. HẰNG ĐẲNG THỨC ĐÁNG NHỚ VÀ ỨNG DỤNG',
          lessons: [
            { id: 'g8_b6', name: 'Bài 6. Hiệu hai bình phương. Bình phương của một tổng hay một hiệu' },
            { id: 'g8_b7', name: 'Bài 7. Lập phương của một tổng. Lập phương của một hiệu' },
            { id: 'g8_b8', name: 'Bài 8. Tổng và hiệu hai lập phương' },
            { id: 'g8_ltc3', name: 'Luyện tập chung' },
            { id: 'g8_b9', name: 'Bài 9. Phân tích đa thức thành nhân tử' },
            { id: 'g8_ltc4', name: 'Luyện tập chung' },
            { id: 'g8_c2_end', name: 'Bài tập cuối chương II' },
          ],
        },
        {
          id: 'g8_c3',
          name: 'Chương III. TỨ GIÁC',
          lessons: [
            { id: 'g8_b10', name: 'Bài 10. Tứ giác' },
            { id: 'g8_b11', name: 'Bài 11. Hình thang cân' },
            { id: 'g8_b12', name: 'Bài 12. Hình bình hành' },
            { id: 'g8_b13', name: 'Bài 13. Hình chữ nhật' },
            { id: 'g8_b14', name: 'Bài 14. Hình thoi và hình vuông' },
            { id: 'g8_ltc5', name: 'Luyện tập chung' },
            { id: 'g8_c3_end', name: 'Bài tập cuối chương III' },
          ],
        },
        {
          id: 'g8_c4',
          name: 'Chương IV. ĐỊNH LÍ THALÈS',
          lessons: [
            { id: 'g8_b15', name: 'Bài 15. Định lí Thalès trong tam giác' },
            { id: 'g8_b16', name: 'Bài 16. Đường trung bình của tam giác' },
            { id: 'g8_b17', name: 'Bài 17. Tính chất đường phân giác của tam giác' },
            { id: 'g8_ltc6', name: 'Luyện tập chung' },
            { id: 'g8_c4_end', name: 'Bài tập cuối chương IV' },
          ],
        },
        {
          id: 'g8_c5',
          name: 'Chương V. DỮ LIỆU VÀ BIỂU ĐỒ',
          lessons: [
            { id: 'g8_b18', name: 'Bài 18. Thu thập và phân loại dữ liệu' },
            { id: 'g8_b19', name: 'Bài 19. Biểu diễn dữ liệu bằng bảng, biểu đồ' },
            { id: 'g8_b20', name: 'Bài 20. Phân tích số liệu thống kê dựa vào biểu đồ' },
            { id: 'g8_ltc7', name: 'Luyện tập chung' },
            { id: 'g8_c5_end', name: 'Bài tập cuối chương V' },
          ],
        },
      ],
    },
    {
      id: 'g8_v2',
      name: 'TẬP HAI',
      chapters: [
        {
          id: 'g8_c6',
          name: 'Chương VI. PHÂN THỨC ĐẠI SỐ',
          lessons: [
            { id: 'g8_b21', name: 'Bài 21. Phân thức đại số' },
            { id: 'g8_b22', name: 'Bài 22. Tính chất cơ bản của phân thức đại số' },
            { id: 'g8_b23', name: 'Bài 23. Phép cộng và phép trừ phân thức đại số' },
            { id: 'g8_b24', name: 'Bài 24. Phép nhân và phép chia phân thức đại số' },
            { id: 'g8_ltc8', name: 'Luyện tập chung' },
            { id: 'g8_c6_end', name: 'Bài tập cuối chương VI' },
          ],
        },
        {
          id: 'g8_c7',
          name: 'Chương VII. PHƯƠNG TRÌNH BẬC NHẤT VÀ HÀM SỐ BẬC NHẤT',
          lessons: [
            { id: 'g8_b25', name: 'Bài 25. Phương trình bậc nhất một ẩn' },
            { id: 'g8_b26', name: 'Bài 26. Giải bài toán bằng cách lập phương trình' },
            { id: 'g8_b27', name: 'Bài 27. Khái niệm hàm số và đồ thị của hàm số' },
            { id: 'g8_b28', name: 'Bài 28. Hàm số bậc nhất y = ax + b' },
            { id: 'g8_b29', name: 'Bài 29. Hệ số góc của đường thẳng' },
            { id: 'g8_ltc9', name: 'Luyện tập chung' },
            { id: 'g8_c7_end', name: 'Bài tập cuối chương VII' },
          ],
        },
        {
          id: 'g8_c8',
          name: 'Chương VIII. MỞ ĐẦU VỀ TÍNH XÁC SUẤT CỦA BIẾN CỐ',
          lessons: [
            { id: 'g8_b30', name: 'Bài 30. Kết quả có thể và kết quả thuận lợi' },
            { id: 'g8_b31', name: 'Bài 31. Cách tính xác suất của biến cố bằng tỉ số' },
            { id: 'g8_b32', name: 'Bài 32. Mối liên hệ giữa xác suất thực nghiệm và lí thuyết' },
            { id: 'g8_ltc10', name: 'Luyện tập chung' },
            { id: 'g8_c8_end', name: 'Bài tập cuối chương VIII' },
          ],
        },
        {
          id: 'g8_c9',
          name: 'Chương IX. TAM GIÁC ĐỒNG DẠNG',
          lessons: [
            { id: 'g8_b33', name: 'Bài 33. Hai tam giác đồng dạng' },
            { id: 'g8_b34', name: 'Bài 34. Ba trường hợp đồng dạng của hai tam giác' },
            { id: 'g8_b35', name: 'Bài 35. Định lí Pythagore và ứng dụng' },
            { id: 'g8_b36', name: 'Bài 36. Các trường hợp đồng dạng của tam giác vuông' },
            { id: 'g8_b37', name: 'Bài 37. Hình đồng dạng' },
            { id: 'g8_ltc11', name: 'Luyện tập chung' },
            { id: 'g8_c9_end', name: 'Bài tập cuối chương IX' },
          ],
        },
        {
          id: 'g8_c10',
          name: 'Chương X. MỘT SỐ HÌNH KHỐI TRONG THỰC TIỄN',
          lessons: [
            { id: 'g8_b38', name: 'Bài 38. Hình chóp tam giác đều' },
            { id: 'g8_b39', name: 'Bài 39. Hình chóp tứ giác đều' },
            { id: 'g8_ltc12', name: 'Luyện tập chung' },
            { id: 'g8_c10_end', name: 'Bài tập cuối chương X' },
          ],
        },
      ],
    },
  ],
  9: [
    {
      id: 'g9_v1',
      name: 'TẬP MỘT',
      chapters: [
        {
          id: 'g9_c1',
          name: 'Chương I. PHƯƠNG TRÌNH VÀ HỆ HAI PHƯƠNG TRÌNH BẬC NHẤT HAI ẨN',
          lessons: [
            { id: 'g9_b1', name: 'Bài 1. Khái niệm phương trình và hệ hai phương trình bậc nhất hai ẩn' },
            { id: 'g9_b2', name: 'Bài 2. Giải hệ hai phương trình bậc nhất hai ẩn' },
            { id: 'g9_b3', name: 'Bài 3. Giải bài toán bằng cách lập hệ phương trình' },
            { id: 'g9_ltc1', name: 'Luyện tập chung' },
            { id: 'g9_c1_end', name: 'Bài tập cuối chương I' },
          ],
        },
        {
          id: 'g9_c2',
          name: 'Chương II. PHƯƠNG TRÌNH VÀ BẤT PHƯƠNG TRÌNH BẬC NHẤT MỘT ẨN',
          lessons: [
            { id: 'g9_b4', name: 'Bài 4. Phương trình quy về phương trình bậc nhất một ẩn' },
            { id: 'g9_b5', name: 'Bài 5. Bất đẳng thức và tính chất' },
            { id: 'g9_b6', name: 'Bài 6. Bất phương trình bậc nhất một ẩn' },
            { id: 'g9_ltc2', name: 'Luyện tập chung' },
            { id: 'g9_c2_end', name: 'Bài tập cuối chương II' },
          ],
        },
        {
          id: 'g9_c3',
          name: 'Chương III. CĂN THỨC',
          lessons: [
            { id: 'g9_b7', name: 'Bài 7. Căn bậc hai và căn thức bậc hai' },
            { id: 'g9_b8', name: 'Bài 8. Khai căn bậc hai với phép nhân và phép chia' },
            { id: 'g9_b9', name: 'Bài 9. Biến đổi đơn giản và rút gọn biểu thức chứa căn thức bậc hai' },
            { id: 'g9_b10', name: 'Bài 10. Căn bậc ba và căn thức bậc ba' },
            { id: 'g9_ltc3', name: 'Luyện tập chung' },
            { id: 'g9_c3_end', name: 'Bài tập cuối chương III' },
          ],
        },
        {
          id: 'g9_c4',
          name: 'Chương IV. HỆ THỨC LƯỢNG TRONG TAM GIÁC VUÔNG',
          lessons: [
            { id: 'g9_b11', name: 'Bài 11. Tỉ số lượng giác của góc nhọn' },
            { id: 'g9_b12', name: 'Bài 12. Một số hệ thức giữa cạnh, góc trong tam giác vuông và ứng dụng' },
            { id: 'g9_ltc4', name: 'Luyện tập chung' },
            { id: 'g9_c4_end', name: 'Bài tập cuối chương IV' },
          ],
        },
        {
          id: 'g9_c5',
          name: 'Chương V. ĐƯỜNG TRÒN',
          lessons: [
            { id: 'g9_b13', name: 'Bài 13. Mở đầu về đường tròn' },
            { id: 'g9_b14', name: 'Bài 14. Cung và dây của một đường tròn' },
            { id: 'g9_b15', name: 'Bài 15. Độ dài cung tròn. Diện tích hình quạt tròn và hình vành khuyên' },
            { id: 'g9_b16', name: 'Bài 16. Vị trí tương đối của đường thẳng và đường tròn' },
            { id: 'g9_b17', name: 'Bài 17. Vị trí tương đối của hai đường tròn' },
            { id: 'g9_ltc5', name: 'Luyện tập chung' },
            { id: 'g9_c5_end', name: 'Bài tập cuối chương V' },
          ],
        },
      ],
    },
    {
      id: 'g9_v2',
      name: 'TẬP HAI',
      chapters: [
        {
          id: 'g9_c6',
          name: 'Chương VI. HÀM SỐ y = ax² (a ≠ 0). PHƯƠNG TRÌNH BẬC HAI MỘT ẨN',
          lessons: [
            { id: 'g9_b18', name: 'Bài 18. Hàm số y = ax² (a ≠ 0)' },
            { id: 'g9_b19', name: 'Bài 19. Phương trình bậc hai một ẩn' },
            { id: 'g9_b20', name: 'Bài 20. Định lí Viète và ứng dụng' },
            { id: 'g9_b21', name: 'Bài 21. Giải bài toán bằng cách lập phương trình' },
            { id: 'g9_ltc6', name: 'Luyện tập chung' },
            { id: 'g9_c6_end', name: 'Bài tập cuối chương VI' },
          ],
        },
        {
          id: 'g9_c7',
          name: 'Chương VII. TẦN SỐ VÀ TẦN SỐ TƯƠNG ĐỐI',
          lessons: [
            { id: 'g9_b22', name: 'Bài 22. Bảng tần số và biểu đồ tần số' },
            { id: 'g9_b23', name: 'Bài 23. Bảng tần số tương đối và biểu đồ tần số tương đối' },
            { id: 'g9_b24', name: 'Bài 24. Bảng tần số ghép nhóm và biểu đồ' },
            { id: 'g9_ltc7', name: 'Luyện tập chung' },
            { id: 'g9_c7_end', name: 'Bài tập cuối chương VII' },
          ],
        },
        {
          id: 'g9_c8',
          name: 'Chương VIII. XÁC SUẤT CỦA BIẾN CỐ TRONG MỘT SỐ MÔ HÌNH XÁC SUẤT',
          lessons: [
            { id: 'g9_b25', name: 'Bài 25. Phép thử ngẫu nhiên và không gian mẫu' },
            { id: 'g9_b26', name: 'Bài 26. Xác suất của biến cố liên quan tới phép thử' },
            { id: 'g9_ltc8', name: 'Luyện tập chung' },
            { id: 'g9_c8_end', name: 'Bài tập cuối chương VIII' },
          ],
        },
        {
          id: 'g9_c9',
          name: 'Chương IX. ĐƯỜNG TRÒN NGOẠI TIẾP VÀ NỘI TIẾP',
          lessons: [
            { id: 'g9_b27', name: 'Bài 27. Góc nội tiếp' },
            { id: 'g9_b28', name: 'Bài 28. Đường tròn ngoại tiếp và nội tiếp tam giác' },
            { id: 'g9_b29', name: 'Bài 29. Tứ giác nội tiếp' },
            { id: 'g9_b30', name: 'Bài 30. Đa giác đều' },
            { id: 'g9_ltc9', name: 'Luyện tập chung' },
            { id: 'g9_c9_end', name: 'Bài tập cuối chương IX' },
          ],
        },
        {
          id: 'g9_c10',
          name: 'Chương X. MỘT SỐ HÌNH KHỐI TRONG THỰC TIỄN',
          lessons: [
            { id: 'g9_b31', name: 'Bài 31. Hình trụ và hình nón' },
            { id: 'g9_b32', name: 'Bài 32. Hình cầu' },
            { id: 'g9_ltc10', name: 'Luyện tập chung' },
            { id: 'g9_c10_end', name: 'Bài tập cuối chương X' },
          ],
        },
      ],
    },
  ],
};
