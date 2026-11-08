/**
 * PHÒNG VIẾT THƯ - B2 LEVEL (VSTEP WRITING TASK 01)
 * English with Miss Nguyet - 4-Step Guided Writing Architecture
 */

// ============================================================================
// 1. GLOBAL STATE & CONFIGURATION
// ============================================================================
const CATEGORY_META = {
  1: { id: 1, key: 'advice', title: 'Letter of Advice', titleVi: '1. Thư Cho Lời Khuyên', tagClass: 'tag-adv' },
  2: { id: 2, key: 'request', title: 'Letter of Request', titleVi: '2. Thư Yêu Cầu', tagClass: 'tag-cause' },
  3: { id: 3, key: 'description', title: 'Letter of Description', titleVi: '3. Thư Mô Tả', tagClass: 'tag-discussion' },
  4: { id: 4, key: 'complaint', title: 'Letter of Complaint', titleVi: '4. Thư Phàn Nàn', tagClass: 'tag-opinion' },
  5: { id: 5, key: 'feedback', title: 'Letter of Feedback', titleVi: '5. Thư Phản Hồi/Đánh Giá', tagClass: 'tag-adv' },
  6: { id: 6, key: 'apology', title: 'Letter of Apology', titleVi: '6. Thư Xin Lỗi', tagClass: 'tag-cause' },
  7: { id: 7, key: 'application', title: 'Letter of Application', titleVi: '7. Thư Ứng Tuyển – Xin Việc', tagClass: 'tag-discussion' }
};

const VALID_PASSWORDS = ['STUDYHARD', 'VSTEPWRITING', 'VSTEOWRITING', 'PRACTICEWRITING'];
const VALID_CLASSES = ['CB206', 'CB210', 'CB211', 'CB213', 'ONB103', 'B212', 'B2'];
const TEACHER_NAMES = ['PTMN', 'NGUYET PHAM', 'NGUYỆT PHẠM', 'CO NGUYET', 'CÔ NGUYỆT', 'MISS NGUYET'];

const STORAGE_KEYS = {
  AUTH: 'vstep_letters_b2_auth_v2',
  THEME: 'vstep_letters_b2_theme',
  HISTORY: 'vstep_letters_b2_history',
  DRAFTS: 'vstep_letters_b2_drafts',
  IDEAS: 'vstep_letters_b2_selected_ideas_v2'
};

let state = {
  currentScreen: 'dashboard',
  currentCategory: 1,
  currentPage: 1,
  itemsPerPage: 9,
  searchQuery: '',
  activeTopic: null,
  activeStep: 'read', // 'read' | 'trans' | 'write' | 'model'
  timerSeconds: 1200, // 20 minutes for VSTEP Task 1
  timerRunning: false,
  timerInterval: null,
  isSubmitted: false,
  cheatStrikes: 0,
  examModeActive: false,
  studentName: '',
  studentClass: '',
  isTeacher: false,
  history: [],
  drafts: {},
  selectedIdeasByTopic: {},
  currentExercises: [],
  lastSubmission: null
};

// ============================================================================
// 2. VIETNAMESE PROMPT TRANSLATIONS (COMPLETE FOR ALL 37 TOPICS)
// ============================================================================
const RUBRIC_VI_FOOTER = 'Bạn nên viết ít nhất 120 từ. **Không ghi tên hoặc địa chỉ của bạn.** Bài viết của bạn sẽ được đánh giá dựa trên các tiêu chí: **Hoàn thành nhiệm vụ (Task Fulfillment)**, **Bố cục (Organization)**, **Từ vựng (Vocabulary)** và **Ngữ pháp (Grammar)**.';

const PROMPT_TRANSLATIONS_VI = {
  'de-01': `Bạn vừa nhận được một bức thư từ người bạn người Anh, Helen. Bạn ấy sắp đến thăm Hà Nội vào tháng Sáu. Hãy viết một bức thư để đưa ra cho bạn ấy một vài gợi ý. Trong thư, bạn nên nói cho bạn ấy biết:
• Nơi ở (Where to stay)
• Món ăn nên thử (What dishes to try)
• Những địa điểm nên tham quan (Which places to visit)
• Trang phục nên mặc khi đến thăm Hà Nội (What to wear when visiting Hanoi)

${RUBRIC_VI_FOOTER}`,

  'de-02': `Bạn vừa nhận được một email từ người bạn người Anh đang dự định học tiếng Việt trong sáu tháng tại Đại học Hà Nội. Bạn ấy xin lời khuyên của bạn về các lựa chọn chỗ ở, chi phí sinh hoạt hàng tháng, những cách thực tế để luyện nói tiếng Việt với người dân bản địa và các mẹo thích nghi văn hóa.

Hãy viết một bức thư để đưa ra cho bạn ấy một vài gợi ý.

${RUBRIC_VI_FOOTER}`,

  'de-03': `Bạn nhìn thấy một mẩu quảng cáo về khóa học nấu ăn mùa hè tại trung tâm Delight Kitchen và rất quan tâm đến việc tham gia khóa học. Hãy viết một email gửi người quản lý tuyển sinh để hỏi thông tin về:
• Học phí khóa học (course fees)
• Lịch học (class schedules)
• Trình độ chuyên môn của giảng viên (instructor qualifications)
• Liệu nguyên liệu nấu ăn có được trung tâm chuẩn bị sẵn hay không (whether ingredients are provided)

${RUBRIC_VI_FOOTER}`,

  'de-04': `Người bạn Linda của bạn gần đây vừa hoàn thành một khóa học tiếng Trung sơ cấp tại Trung tâm Ngoại ngữ New Horizon. Bạn muốn học tiếng Trung vào mùa hè này. Hãy viết một email gửi Linda để hỏi về:
• Địa điểm trung tâm (center location)
• Học phí (tuition fees)
• Chất lượng giáo viên (teacher quality)
• Hoạt động luyện nói thực tế trên lớp (practical speaking practice)

${RUBRIC_VI_FOOTER}`,

  'de-05': `Bạn vừa nhận được một email từ người bạn của bạn, John. Hãy đọc trích đoạn bức thư của bạn ấy dưới đây:
"... Tớ nghe nói gần đây cậu đã tham gia một cuộc thi đua xe đạp địa hình trên núi. Trải nghiệm đó thế nào? Đường đua ra sao? Cậu có giành được giải thưởng nào không? Tớ cũng đang tính thử sức với bộ môn xe đạp leo núi. Sắp tới cậu có dự định chuyến đi đạp xe nào không? ..."

Hãy viết một email hồi âm cho John miêu tả trải nghiệm cuộc đua của bạn và mời bạn ấy cùng tham gia một chuyến đi sắp tới.

${RUBRIC_VI_FOOTER}`,

  'de-06': `Bạn vừa nhận được một email từ người bạn Helen muốn biết về ngôi nhà mới chuyển của bạn ở gần khuôn viên trường đại học. Hãy viết một email gửi Helen để:
• Miêu tả vị trí của ngôi nhà (house location)
• Miêu tả cách bố trí các phòng (room layout)
• Kể về khu dân cư xung quanh (surrounding neighborhood)
• Mời bạn ấy sang chơi thăm nhà mới (invite her to visit)

${RUBRIC_VI_FOOTER}`,

  'de-07': `Bạn là hội viên tại Câu lạc bộ Thể hình Elite Fitness Club. Gần đây, một số máy tập gym đã bị hỏng và vẫn chưa được sửa chữa. Hãy viết một email gửi người quản lý phòng tập để phàn nàn về sự việc này. Trong email, bạn nên:
• Miêu tả các thiết bị bị hỏng và những bất tiện phát sinh
• Giải thích vấn đề này ảnh hưởng thế nào đến việc tập luyện của bạn
• Đề xuất ban quản lý nên thực hiện biện pháp gì để khắc phục

${RUBRIC_VI_FOOTER}`,

  'de-08': `Tối qua bạn đã dùng bữa tối tại nhà hàng The Grand Bistro để kỷ niệm một sự kiện gia đình. Chất lượng món ăn rất kém, thời gian chờ đợi quá lâu và nhân viên phục vụ thiếu nhiệt tình. Hãy viết một bức thư khiếu nại gửi quản lý nhà hàng:
• Miêu tả cụ thể các vấn đề bạn gặp phải
• Giải thích sự thất vọng của bạn và gia đình
• Yêu cầu phương án giải quyết thỏa đáng

${RUBRIC_VI_FOOTER}`,

  'de-09': `Bạn là hành khách thường xuyên đi tuyến xe buýt công cộng số 08. Hãy viết một email gửi ông Tailor, giám đốc quản lý dịch vụ vận tải, để đóng góp ý kiến phản hồi về dịch vụ xe buýt. Trong email, bạn nên:
• Đề cập những mặt tích cực mà bạn đánh giá cao
• Chỉ ra các vấn đề còn tồn tại (tình trạng quá tải/trễ giờ và thái độ phục vụ)
• Đề xuất những giải pháp cải thiện thiết thực

${RUBRIC_VI_FOOTER}`,

  'de-10': `Bạn đã tổ chức bữa tiệc sinh nhật cùng bạn bè tại nhà hàng Golden Spoon vào thứ Bảy tuần trước. Hãy viết một email gửi người quản lý nhà hàng để đưa ra phản hồi. Trong email, bạn nên:
• Khen ngợi những điểm nhà hàng làm tốt (hương vị món ăn và trang trí bàn tiệc)
• Chỉ ra những điểm cần khắc phục (lên món chậm và âm thanh/nhạc nền quá ồn)
• Đưa ra các gợi ý cải thiện cho những sự kiện sau này

${RUBRIC_VI_FOOTER}`,

  'de-11': `Bạn là sinh viên đại học đã không kịp nộp bài tiểu luận nghiên cứu học phần đúng hạn. Hãy viết một email gửi giảng viên phụ trách môn học, Giáo sư Johnson, để xin lỗi vì nộp bài muộn. Trong email, bạn nên:
• Chân thành xin lỗi thầy
• Giải thích lý do cụ thể (sự cố hỏng hóc kỹ thuật máy tính ở thì quá khứ đơn)
• Gửi kèm bài làm đã hoàn thành và xin phép nộp bổ sung
• Cam kết tuân thủ nghiêm túc các thời hạn nộp bài trong tương lai

${RUBRIC_VI_FOOTER}`,

  'de-12': `Bạn là Trưởng bộ phận Quan hệ Khách hàng tại Khách sạn Pearl Palace. Một vị khách, ông Smith, đã có kỳ lưu trú không hài lòng do dịch vụ phòng chậm trễ và đồ ăn bị nguội. Hãy viết email xin lỗi gửi ông Smith. Trong thư, bạn nên:
• Chân thành xin lỗi về trải nghiệm không tốt của khách
• Giải thích sự cố ngoài ý muốn ở bộ phận bếp (dùng thì quá khứ đơn)
• Đề xuất hình thức đền bù thiện chí (giảm trừ hóa đơn hoặc tặng phiếu ưu đãi miễn phí)
• Khẳng định cam kết nâng cao chất lượng phục vụ của khách sạn

${RUBRIC_VI_FOOTER}`,

  'de-13': `Bạn nhìn thấy một mẩu quảng cáo tuyển dụng vị trí nhân viên phục vụ bàn bán thời gian (part-time waiter) tại Nhà hàng Sunflower. Hãy viết thư ứng tuyển gửi người quản lý tuyển dụng. Trong thư, bạn nên:
• Giới thiệu trình độ học vấn hiện tại của bạn
• Giải thích lý do tại sao bạn muốn ứng tuyển công việc này
• Miêu tả kinh nghiệm làm việc thực tế có liên quan
• Khẳng định lý do bạn là ứng viên phù hợp và thời gian có thể đi làm

${RUBRIC_VI_FOOTER}`,

  'de-14': `Bạn nhìn thấy thông báo tuyển dụng vị trí Trợ lý Sự kiện (Event Assistant) cho Lễ hội Văn hóa Thanh niên sắp tới. Hãy viết thư ứng tuyển gửi Ban Tổ chức. Trong thư, bạn nên:
• Giới thiệu bản thân và ngành học đại học hiện tại
• Nêu rõ động lực ứng tuyển vị trí này
• Trình bày kinh nghiệm tham gia tổ chức sự kiện hoặc hoạt động tình nguyện trước đây
• Giải thích tại sao kỹ năng của bạn giúp bạn trở thành một ứng viên sáng giá

${RUBRIC_VI_FOOTER}`,

  'de-15': `Bạn vừa nhận được một bức thư từ người bạn Emily. Bạn ấy sắp đến thăm Cần Thơ vào tháng Mười Hai. Hãy viết một bức thư để đưa ra cho bạn ấy một vài gợi ý. Bạn nên nói cho bạn ấy biết:
• Nơi ở (Where to stay)
• Món ăn nên thử (What dishes to try)
• Những địa điểm du lịch nên tham quan (Which tourist attractions to visit)
• Trang phục nên mặc (What to wear)

${RUBRIC_VI_FOOTER}`,

  'de-16': `Người bạn của bạn vừa hoàn thành một khóa học tiếng Anh tại Trung tâm Ngoại ngữ Rainbow và có trải nghiệm rất tuyệt vời. Bạn cũng đang dự định học tiếng Anh và muốn tìm hiểu thêm về khóa học đó. Hãy viết một bức thư gửi bạn mình để hỏi thêm thông tin về:
• Địa chỉ của trung tâm (The address of the center)
• Học phí (The tuition fee)
• Đội ngũ giáo viên (The teachers)
• Chương trình đào tạo (The training program)

${RUBRIC_VI_FOOTER}`,

  'de-17': `Bạn vừa nhận được thư từ người bạn Linda. Bạn ấy vừa hoàn thành một khóa học tiếng Trung tại Trung tâm Ngoại ngữ Happy Chinese và rất yêu thích khóa học đó. Bạn cũng đang lên kế hoạch học tiếng Trung và muốn biết thêm thông tin về khóa học.
Hãy viết một bức thư gửi Linda. Trong thư, bạn nên hỏi về:
• Học phí khóa học (the tuition fee)
• Thời lượng khóa học (the course duration)
• Đội ngũ giáo viên (the teachers)
• Lịch học hàng tuần (the class schedule)

${RUBRIC_VI_FOOTER}`,

  'de-18': `Bạn vừa nhận được một bức thư từ người bạn của mình, Nam. Hãy đọc trích đoạn bức thư dưới đây:
"... Tháng tới mình dự định học tiếng Anh tại Trung tâm Ngoại ngữ Rainbow. Vì cậu vừa hoàn thành một khóa học ở đó, cậu có thể chia sẻ thêm cho mình biết về khóa học được không? Mình muốn biết về địa chỉ của trung tâm, mức học phí, đội ngũ giáo viên và chương trình đào tạo trước khi quyết định đăng ký..."
Hãy viết một bức thư hồi âm cho Nam. Trong thư, bạn nên cung cấp thông tin về:
• Địa chỉ của trung tâm (the address of the center)
• Học phí (the tuition fee)
• Đội ngũ giáo viên (the teachers)
• Chương trình đào tạo (the training program)

${RUBRIC_VI_FOOTER}`,

  'de-19': `Bạn vừa nhận được một bức thư từ người bạn người Anh, Emily. Hãy đọc trích đoạn bức thư của cô ấy dưới đây:
"... Tớ vừa nhận được thư từ bạn của cậu là Hoa. Bạn ấy sắp sang học một khóa học tại London, nên có hỏi tớ liệu bạn ấy có thể ở cùng với tớ và gia đình tớ cho đến khi tìm được căn hộ riêng hay không. Cậu có thể cho tớ biết một vài thông tin về Hoa được không? (những điều như tính cách, sở thích, công việc hoặc việc học hiện tại của bạn ấy). Tớ cần biết liệu bạn ấy có hòa hợp với gia đình tớ hay không ..."

Hãy viết một bức thư hồi âm cho Emily.

${RUBRIC_VI_FOOTER}`,

  'de-20': `Bạn là hội viên của một trung tâm thể thao tại địa phương. Gần đây bạn đã sử dụng phòng thay đồ và không hài lòng với tình trạng của phòng. Hãy viết một email gửi người quản lý trung tâm thể thao. Trong email, bạn nên:
• Miêu tả các vấn đề bạn phát hiện trong phòng thay đồ
• Giải thích tình trạng đó khiến bạn cảm thấy như thế nào
• Đề xuất những biện pháp cần thực hiện để cải thiện cơ sở vật chất

${RUBRIC_VI_FOOTER}`,

  'de-21': `Gần đây bạn đã lưu trú tại một khách sạn trong kỳ nghỉ. Đáng tiếc là bạn không hài lòng với căn phòng của mình. Hãy viết một bức thư gửi người quản lý khách sạn để phàn nàn về kỳ nghỉ đó. Trong thư, bạn nên:
• Miêu tả các sự cố của căn phòng
• Giải thích cảm nhận của bạn về trải nghiệm này
• Đề xuất một số biện pháp khắc phục, cải thiện

${RUBRIC_VI_FOOTER}`,

  'de-22': `Gần đây bạn đã ở tại một khách sạn và nhận được email từ người quản lý khách sạn xin ý kiến phản hồi về kỳ lưu trú của bạn.
Hãy viết một email để đưa ra ý kiến đóng góp. Trong email, bạn nên:
• Nêu rõ bạn hài lòng hay không hài lòng với dịch vụ
• Miêu tả trải nghiệm thực tế của bạn
• Gợi ý những cách khách sạn có thể áp dụng để cải thiện dịch vụ

${RUBRIC_VI_FOOTER}`,

  'de-23': `Gần đây bạn đã dùng bữa tối tại một nhà hàng mới mở. Vài ngày sau, người quản lý nhà hàng đã gửi email xin ý kiến đánh giá của bạn.
Hãy viết một email để đưa ra nhận xét của bạn. Trong email, bạn nên:
• Nêu rõ bạn hài lòng hay không hài lòng với nhà hàng
• Miêu tả chi tiết trải nghiệm bữa tối của bạn
• Gợi ý các cách giúp nhà hàng nâng cao chất lượng phục vụ

${RUBRIC_VI_FOOTER}`,

  'de-24': `Bạn đã mượn một cuốn sách từ người bạn Helen nhưng lại quên trả. Hãy đọc trích đoạn bức thư của bạn ấy dưới đây:
"... Này cậu! Dạo này cậu thế nào rồi? Nhân tiện cho tớ hỏi, cậu đã đọc xong cuốn sách mượn của tớ chưa? Tớ đang thắc mắc sao cậu vẫn chưa trả lại sách cho tớ. Khi nào cậu định trả lại và cậu sẽ gửi trả bằng cách nào thế? ..."
Hãy viết một bức thư hồi âm cho Helen. Trong thư, bạn nên:
• Xin lỗi vì đã chưa trả lại cuốn sách đúng hẹn
• Giải thích hoàn cảnh vừa qua của bạn và cho biết bạn đã đọc xong cuốn sách hay chưa
• Nói rõ khi nào và bằng cách nào bạn sẽ trả lại sách cho bạn ấy

${RUBRIC_VI_FOOTER}`,

  'de-25': `Bạn vừa nhận được một email từ giáo sư của mình:
"... Thầy nhận thấy em vẫn chưa nộp bài tập. Hạn chót là thứ Sáu tuần trước, nhưng đến nay thầy vẫn chưa nhận được bài làm của em. Em có thể giải thích lý do tại sao bài tập lại bị trễ hạn không? Ngoài ra, khi nào em sẽ nộp bài? Thầy mong sớm nhận được phản hồi từ em. ..."
Hãy viết một bức thư hồi âm cho giáo sư. Trong thư, bạn nên:
• Xin lỗi vì đã nộp bài tập muộn
• Giải thích lý do tại sao bạn không thể nộp bài đúng thời hạn
• Nói rõ khi nào và bằng hình thức nào bạn sẽ nộp bài tập

${RUBRIC_VI_FOOTER}`,

  'de-26': `Bạn nhìn thấy thông báo tuyển dụng vị trí nhân viên bán hàng (sales assistant) tại một cửa hàng quần áo trong thành phố. Hãy viết một email để ứng tuyển công việc này. Trong email, bạn nên:
• Giới thiệu bản thân và hoàn cảnh/công việc học tập hiện tại của bạn
• Nêu rõ lý do tại sao bạn quan tâm đến vị trí này
• Đề cập bất kỳ kinh nghiệm nào bạn từng có khi làm việc, tiếp xúc với khách hàng

${RUBRIC_VI_FOOTER}`,

  'de-27': `Bạn nhìn thấy quảng cáo tuyển dụng vị trí nhân viên lễ tân (receptionist) tại một khách sạn nhỏ trong thành phố. Bạn rất quan tâm đến vị trí này và muốn nộp đơn ứng tuyển. Hãy viết một email ứng tuyển vị trí trên. Trong email, bạn nên:
• Giới thiệu bản thân và tình hình hiện tại của bạn
• Nêu rõ lý do bạn yêu thích vị trí lễ tân này
• Đề cập kinh nghiệm làm việc với khách hàng hoặc du khách trước đây
• Giải thích tại sao bạn là một ứng viên phù hợp cho công việc

${RUBRIC_VI_FOOTER}`,

  'de-28': `Bạn vừa nhận được thư từ một người bạn muốn hỏi thêm về dự án mỹ thuật chủ đề "Ở Nhà" ("At Home") mà bạn vừa thực hiện gần đây. Hãy đọc trích đoạn bức thư của bạn ấy dưới đây:
"... Cậu đã hoàn thành dự án vẽ tranh của mình chưa? Cậu chọn vẽ khung cảnh bên trong ngôi nhà hay ngoài sân vườn? Cậu có thể miêu tả bức vẽ đó cho tớ nghe được không? Trong bức tranh của cậu có đồ vật nào đặc biệt quan trọng và ý nghĩa đối với cậu không? ..."

Hãy viết một bức thư hồi âm cho người bạn của mình.

${RUBRIC_VI_FOOTER}`,

  'de-29': `Bạn vừa nhận được một email từ người bạn Ann, người đang dự định tham gia một khóa học tiếng Việt khi sang Việt Nam. Hãy đọc trích đoạn email của bạn ấy dưới đây:
"... Tớ thực sự rất hào hứng về việc tham gia một khóa học tiếng Việt trong thời gian ở Việt Nam. Tuy nhiên, tớ vẫn chưa chắc mình nên chọn loại khóa học nào. Cậu có thể cho tớ biết về mức học phí và khóa học thường kéo dài bao lâu được không? Ngoài ra, tớ nên chuẩn bị những gì trước khi bắt đầu lớp học? ..."

Hãy viết một email hồi âm cho Ann.

${RUBRIC_VI_FOOTER}`,

  'de-30': `Bạn vừa nhận được một email từ người bạn của mình, Jane. Bạn ấy hỏi bạn về hai nội dung. Hãy đọc trích đoạn email của bạn ấy dưới đây:
"... Công việc mới của cậu dạo này thế nào rồi? Đồng nghiệp của cậu có thân thiện không, và cậu có hòa đồng tốt với mọi người không? Hàng ngày cậu đi làm đến công ty có thuận tiện không? Nhân tiện, tuần tới tớ có một buổi phỏng vấn xin việc. Cậu có thể cho tớ một vài lời khuyên về cách chuẩn bị thật tốt cho buổi phỏng vấn được không? ..."

Hãy viết một email hồi âm cho Jane.

${RUBRIC_VI_FOOTER}`,

  'de-31': `Bạn vừa nhận được một email từ người bạn Jane. Bạn ấy đang lên kế hoạch đến thăm Việt Nam vào mùa hè này và muốn xin một vài gợi ý. Hãy đọc trích đoạn email của bạn ấy dưới đây:
"... Tớ thực sự rất háo hức về chuyến du lịch Việt Nam vào mùa hè này. Tuy nhiên, tớ chưa rõ nên sang vào thời điểm nào và nên ghé thăm những địa điểm nào. Cậu có thể gợi ý cho tớ một điểm đến và chỉ cách di chuyển tới đó được không? Ngoài ra, vào mùa hè ở Việt Nam có lễ hội hay sự kiện đặc sắc nào không? Tớ rất muốn biết điều gì làm nên nét đặc biệt của các lễ hội đó. ..."

Hãy viết một email gửi cho Jane.

${RUBRIC_VI_FOOTER}`,

  'de-32': `Bạn vừa nhận được một email từ người bạn Alex, người đang thực hiện một bài tập nhóm về thiết kế áp phích (poster). Hãy đọc trích đoạn email của bạn ấy dưới đây:
"... Giáo viên của bọn tớ yêu cầu mỗi nhóm thiết kế một tấm áp phích, nhưng nhóm tớ vẫn chưa chọn được chủ đề. Cậu có thể gợi ý giúp tớ vài ý tưởng về chủ đề nên chọn được không? Ngoài ra, bọn tớ có thể tìm các nguồn thông tin đáng tin cậy ở đâu để nội dung áp phích thú vị hơn? Nhân tiện, cậu có mẹo nào giúp thiết kế áp phích trông thu hút và bắt mắt không? ..."

Hãy viết một email hồi âm cho Alex.

${RUBRIC_VI_FOOTER}`,

  'de-33': `Gần đây bà Smith (Ms. Smith) đã viết thư phàn nàn về chất lượng dịch vụ kém mà bà gặp phải trong thời gian lưu trú tại khách sạn của bạn. Trong thư, bà yêu cầu một lời xin lỗi và được hoàn tiền. Bạn là người quản lý khách sạn. Hãy viết một bức thư phản hồi lại khiếu nại của bà ấy. Trong thư, bạn nên:
• Xin lỗi về chất lượng dịch vụ chưa tốt mà bà ấy đã trải qua
• Giải thích cụ thể quy trình bà ấy sẽ nhận lại khoản tiền hoàn trả như thế nào
• Cho bà ấy biết các biện pháp mà khách sạn sẽ thực hiện để chấn chỉnh và nâng cao dịch vụ

${RUBRIC_VI_FOOTER}`,

  'de-34': `Bạn vừa nhận được một bức thư từ người bạn hỏi thăm về chú cún con mới nuôi của bạn. Hãy viết một bức thư hồi âm cho bạn mình. Trong thư, bạn nên:
• Cho biết bạn đã đặt tên cho chú cún con chưa và tên của nó là gì
• Kể rõ ai đã tặng chú cún con cho bạn
• Miêu tả việc chăm sóc chú cún con hằng ngày có vất vả hay khó khăn không

${RUBRIC_VI_FOOTER}`,

  'de-35': `Gần đây bạn vừa nhận được thư từ một người bạn mới bắt đầu làm việc tại một hiệu sách địa phương. Bạn ấy đang mong nhận được lời khuyên để làm tốt công việc của mình hơn.
Hãy viết một bức thư gửi cho người bạn của bạn. Trong thư, bạn nên:
• Đưa ra lời khuyên về cách tìm và tư vấn đúng cuốn sách phù hợp cho khách hàng
• Gợi ý một vài ý tưởng trang trí không gian hiệu sách
• Đề xuất các chiến lược khuyến mãi, quảng bá hiệu quả để thu hút thêm khách đọc

${RUBRIC_VI_FOOTER}`,

  'de-36': `Bạn là giáo viên tại Trường Tiểu học Sunshine. Lớp của bạn sắp tổ chức một buổi hoạt động dã ngoại ngoài trời cho học sinh khối Lớp 4 vào cuối tuần tới. Bạn vừa nhận được thư từ bà Jane (Mrs. Jane), một phụ huynh học sinh, hỏi về:
• Những hoạt động nào sẽ diễn ra trong suốt buổi dã ngoại
• Lý do tại sao các thầy cô giáo không chuẩn bị bữa trưa tập thể cho học sinh
• Học sinh có thể mang theo những loại đồ ăn nào cho bữa trưa, và vì sao
• Con gái của bà ấy nên chuẩn bị mang theo những vật dụng gì để có một ngày vui chơi trọn vẹn

Hãy viết một bức thư gửi bà Jane để giải đáp đầy đủ các câu hỏi của bà.

${RUBRIC_VI_FOOTER}`,

  'de-37': `Bạn vừa nhận được một bức thư từ bà Lan (Mrs. Lan), nhân viên phụ trách tại sân bay nơi bạn đã trình báo về chiếc vali bị thất lạc của mình. Hãy đọc trích đoạn bức thư của bà ấy dưới đây:
"... Xin quý khách vui lòng gửi thêm cho tôi một số thông tin chi tiết về chiếc vali bị thất lạc? Tôi cần biết số hiệu chuyến bay và giờ bay của quý khách, mô tả ngắn gọn bên ngoài cũng như bên trong chiếc vali, và thông tin liên hệ để tôi có thể báo ngay cho quý khách khi tìm thấy hành lý. ..."

Hãy viết một bức thư phản hồi cho bà Lan. Trong thư, bạn nên:
• Cung cấp thông tin chi tiết về chuyến bay của bạn
• Miêu tả rõ ràng đặc điểm nhận dạng chiếc vali
• Cung cấp đầy đủ thông tin liên lạc của bạn

${RUBRIC_VI_FOOTER}`
};

// ============================================================================
// 3. INITIALIZATION & ACCESS GATEWAY
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  loadPersistedState();
  checkSavedAuth();
  setupAntiCheatVisibilityWatcher();
  renderDashboard();
});

function loadPersistedState() {
  try {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
    setTheme(savedTheme);

    const savedHistory = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (savedHistory) state.history = JSON.parse(savedHistory);

    const savedDrafts = localStorage.getItem(STORAGE_KEYS.DRAFTS);
    if (savedDrafts) state.drafts = JSON.parse(savedDrafts);

    const savedIdeas = localStorage.getItem(STORAGE_KEYS.IDEAS);
    if (savedIdeas) state.selectedIdeasByTopic = JSON.parse(savedIdeas);
  } catch (e) {
    console.warn('Could not load saved state:', e);
  }
}

function normalizeVietnameseText(str) {
  return (str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .trim()
    .toUpperCase();
}

function isTeacherAccount(name, classCode) {
  const normName = normalizeVietnameseText(name);
  const normClass = (classCode || '').trim().toUpperCase();
  if (normClass === 'GV' && (normName === 'PTMN' || TEACHER_NAMES.some(t => normalizeVietnameseText(t) === normName))) {
    return true;
  }
  return false;
}

function checkSavedAuth() {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEYS.AUTH);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.name && parsed.classCode) {
        state.studentName = parsed.name;
        state.studentClass = parsed.classCode;
        state.isTeacher = !!parsed.isTeacher;
        hideGateway();
      }
    }
  } catch (e) {}
}

function togglePasswordVisibility() {
  const passInput = document.getElementById('gateway-pass');
  if (!passInput) return;
  passInput.type = passInput.type === 'password' ? 'text' : 'password';
}

function verifyGateway() {
  const nameEl = document.getElementById('gateway-name');
  const classEl = document.getElementById('gateway-class');
  const passEl = document.getElementById('gateway-pass');
  const errEl = document.getElementById('gateway-error');

  const rawName = (nameEl ? nameEl.value : '').trim();
  const rawClass = (classEl ? classEl.value : '').trim().toUpperCase();
  const rawPass = (passEl ? passEl.value : '').trim().toUpperCase();

  if (!rawName || !rawClass) {
    if (errEl) {
      errEl.textContent = '⚠️ Vui lòng nhập đầy đủ Họ tên và Mã lớp học!';
      errEl.style.display = 'block';
    }
    return;
  }

  // Check Teacher Account (PTMN + GV -> No password required)
  if (isTeacherAccount(rawName, rawClass)) {
    state.studentName = rawName;
    state.studentClass = 'GV';
    state.isTeacher = true;
    sessionStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify({
      name: rawName,
      classCode: 'GV',
      isTeacher: true
    }));
    hideGateway();
    showToast(`Chào mừng Cô ${rawName} vào Phòng Viết Thư B2!`, 'success');
    return;
  }

  // Check Student Account
  const isValidClass = VALID_CLASSES.includes(rawClass) || /^CB\d+/i.test(rawClass) || /^B2/i.test(rawClass);
  const isValidPass = VALID_PASSWORDS.includes(rawPass);

  if (!isValidClass || !isValidPass) {
    if (errEl) {
      errEl.textContent = !isValidClass
        ? '⚠️ Mã lớp học không hợp lệ! Vui lòng kiểm tra lại mã lớp được cấp.'
        : '⚠️ Mật khẩu lớp học chưa chính xác!';
      errEl.style.display = 'block';
    }
    return;
  }

  state.studentName = rawName;
  state.studentClass = rawClass;
  state.isTeacher = false;
  sessionStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify({
    name: rawName,
    classCode: rawClass,
    isTeacher: false
  }));

  // Silent Google Form attendance tracking
  try {
    const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLScjhthdSEklX3xgFywh0WVnboJiMrdtwktPgdImgsVwl3ymbQ/formResponse';
    const body = new URLSearchParams();
    body.append('entry.1205151935', `[TASK 1 - B2 LETTERS] ${rawName} - Lớp: ${rawClass}`);
    fetch(formUrl, { method: 'POST', mode: 'no-cors', body }).catch(() => {});
  } catch (e) {}

  hideGateway();
  showToast(`Chào mừng ${rawName} (${rawClass})! Chúc bạn luyện viết hiệu quả!`, 'success');
}

function hideGateway() {
  const gw = document.getElementById('access-gateway');
  if (gw) {
    gw.classList.add('hidden-gateway');
    gw.style.display = 'none';
  }
}

// ============================================================================
// 4. THEME, SIDEBAR & SCREEN NAVIGATION
// ============================================================================
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
  const btnLight = document.getElementById('theme-light');
  const btnDark = document.getElementById('theme-dark');
  if (btnLight) btnLight.classList.toggle('active', theme === 'light');
  if (btnDark) btnDark.classList.toggle('active', theme === 'dark');
}

function toggleMobileSidebar() {
  const sb = document.querySelector('.sidebar');
  const ov = document.getElementById('sidebar-overlay');
  if (sb) sb.classList.toggle('open');
  if (ov) ov.classList.toggle('active');
}

function closeMobileSidebar() {
  const sb = document.querySelector('.sidebar');
  const ov = document.getElementById('sidebar-overlay');
  if (sb) sb.classList.remove('open');
  if (ov) ov.classList.remove('active');
}

function switchScreen(screenName) {
  closeMobileSidebar();

  if (state.examModeActive && state.currentScreen === 'workspace' && screenName !== 'workspace') {
    if (!confirm('Bạn đang trong chế độ làm bài Bước 3. Bạn có muốn lưu nháp và rời khỏi phòng thi không?')) {
      return;
    }
    saveProgressAction(true);
    state.examModeActive = false;
    pauseTimer();
  }

  state.currentScreen = screenName;
  document.querySelectorAll('.screen').forEach(el => {
    el.classList.remove('active');
    el.style.display = 'none';
  });

  const target = document.getElementById(`screen-${screenName}`);
  if (target) {
    target.classList.add('active');
    target.style.display = 'block';
  }

  // Update sidebar active state
  document.querySelectorAll('.sidebar .nav-link').forEach(link => {
    link.classList.remove('active');
    if (screenName !== 'category' && link.dataset.target === screenName) {
      link.classList.add('active');
    }
  });

  const topHeader = document.querySelector('.top-header');
  if (topHeader) {
    topHeader.classList.toggle('view-category', screenName === 'category');
    topHeader.classList.toggle('view-workspace', screenName === 'workspace');
  }

  const titleEl = document.getElementById('topbar-title');
  if (screenName === 'dashboard') {
    if (titleEl) titleEl.textContent = 'PHÒNG VIẾT THƯ B2';
    renderDashboard();
  } else if (screenName === 'history') {
    if (titleEl) titleEl.textContent = 'LỊCH SỬ BÀI VIẾT ĐÃ NỘP';
    renderHistoryTable();
  } else if (screenName === 'drafts') {
    if (titleEl) titleEl.textContent = 'BẢN NHÁP ĐÃ LƯU';
    renderDraftsTable();
  } else if (screenName === 'workspace') {
    if (titleEl && state.activeTopic) {
      titleEl.textContent = state.activeTopic.title_vi || state.activeTopic.title_en;
    }
  }
}

function switchCategory(catNum) {
  closeMobileSidebar();
  if (state.examModeActive && state.currentScreen === 'workspace') {
    if (!confirm('Bạn đang trong chế độ làm bài Bước 3. Bạn có muốn lưu nháp và chuyển sang danh mục khác không?')) {
      return;
    }
    saveProgressAction(true);
    state.examModeActive = false;
    pauseTimer();
  }

  state.currentCategory = Number(catNum) || 1;
  state.currentPage = 1;
  state.searchQuery = '';
  const searchInput = document.getElementById('global-search');
  if (searchInput) searchInput.value = '';

  state.currentScreen = 'category';
  document.querySelectorAll('.screen').forEach(el => {
    el.classList.remove('active');
    el.style.display = 'none';
  });
  const catScreen = document.getElementById('screen-category');
  if (catScreen) {
    catScreen.classList.add('active');
    catScreen.style.display = 'block';
  }

  document.querySelectorAll('.sidebar .nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.target === `cat-${state.currentCategory}`);
  });

  const topHeader = document.querySelector('.top-header');
  if (topHeader) topHeader.classList.add('view-category');

  renderCategoryView();
}

function handleSearch(event) {
  const q = (event.target.value || '').trim();
  state.searchQuery = q;
  state.currentPage = 1;

  if (q.length > 0 && state.currentScreen !== 'category') {
    state.currentScreen = 'category';
    document.querySelectorAll('.screen').forEach(el => {
      el.classList.remove('active');
      el.style.display = 'none';
    });
    const catScreen = document.getElementById('screen-category');
    if (catScreen) {
      catScreen.classList.add('active');
      catScreen.style.display = 'block';
    }
  }
  renderCategoryView();
}

// ============================================================================
// 5. DATA HELPERS
// ============================================================================
function getAllTopicsFlat() {
  if (typeof LETTERS_DATA === 'undefined') return [];
  const all = [];
  LETTERS_DATA.forEach(cat => {
    (cat.topics || []).forEach(t => {
      all.push({
        ...t,
        catNum: cat.id,
        category_id: cat.category_id,
        categoryTitle: cat.title,
        categoryTitleVi: cat.title_vi
      });
    });
  });
  return all;
}

function findTopicById(topicId) {
  const all = getAllTopicsFlat();
  return all.find(t => t.id === topicId) || null;
}

function getCategoryData(catNum) {
  if (typeof LETTERS_DATA === 'undefined') return null;
  return LETTERS_DATA.find(c => Number(c.id) === Number(catNum)) || LETTERS_DATA[0];
}

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getTopicPromptTranslation(topic) {
  if (!topic) return '';
  if (PROMPT_TRANSLATIONS_VI[topic.id]) return PROMPT_TRANSLATIONS_VI[topic.id];
  const analysis = topic.details && topic.details.analysis ? topic.details.analysis : {};
  const reqs = (analysis.key_requirements || []).map(r => `• ${r}`).join('\n');
  return `${topic.title_vi || topic.title_en}\n\n• Người nhận: ${analysis.recipient || topic.recipient_type || 'Người nhận thư'}\n• Mục đích viết thư: ${analysis.purpose || 'Giải quyết đầy đủ các yêu cầu trong đề bài'}\n${reqs ? `\nCác nội dung cần đề cập:\n${reqs}\n` : ''}\nBạn nên viết ít nhất 120 từ. Không ghi tên hoặc địa chỉ của bạn.`;
}

// ============================================================================
// 6. DASHBOARD & CATEGORY RENDERING
// ============================================================================
function renderDashboard() {
  // Update quick stats
  const completedEl = document.getElementById('stat-completed-count');
  const draftEl = document.getElementById('stat-draft-count');
  const vocabEl = document.getElementById('stat-vocab-count');
  const avgEl = document.getElementById('stat-avg-score');

  const completedCount = state.history.length;
  const draftCount = Object.keys(state.drafts || {}).length;
  const totalVocabUsed = state.history.reduce((sum, item) => sum + (item.vocabUsedCount || 0), 0);
  const avgScore = completedCount > 0
    ? (state.history.reduce((sum, item) => sum + (Number(item.score) || 0), 0) / completedCount).toFixed(1)
    : '0.0';

  if (completedEl) completedEl.textContent = completedCount;
  if (draftEl) draftEl.textContent = draftCount;
  if (vocabEl) vocabEl.textContent = totalVocabUsed;
  if (avgEl) avgEl.textContent = avgScore;

  // Render Featured Topics (1 representative topic from first 6 categories)
  const featuredContainer = document.getElementById('featured-topics-container');
  if (featuredContainer && typeof LETTERS_DATA !== 'undefined') {
    const featured = [];
    LETTERS_DATA.forEach(cat => {
      if (cat.topics && cat.topics.length > 0 && featured.length < 6) {
        featured.push({
          ...cat.topics[0],
          catNum: cat.id,
          categoryTitleVi: cat.title_vi
        });
      }
    });

    featuredContainer.innerHTML = featured.map(t => {
      const meta = CATEGORY_META[t.catNum] || CATEGORY_META[1];
      const hasDraft = !!state.drafts[t.id];
      const isDone = state.history.some(h => h.topicId === t.id);
      const statusBadge = isDone
        ? '<span class="detail-badge">✓ Đã hoàn thành</span>'
        : (hasDraft ? '<span class="detail-badge">📝 Đang lưu nháp</span>' : '');
      return `
        <div class="topic-card" onclick="startPractice('${t.id}')">
          <div class="card-header">
            <span class="category-tag ${meta.tagClass}">${escapeHtml(t.categoryTitleVi)}</span>
            ${statusBadge}
          </div>
          <div class="card-body">
            <h4>${escapeHtml(t.title_en)}</h4>
            <div class="translation">${escapeHtml(t.title_vi)}</div>
          </div>
          <div class="card-footer">
            <span>🎯 Tối thiểu 120 từ • 20 phút</span>
            <span class="start-btn">Luyện viết &rarr;</span>
          </div>
        </div>
      `;
    }).join('');
  }

  // Render Recent Activity
  const activityList = document.getElementById('recent-activity-list');
  if (activityList) {
    if (state.history.length === 0) {
      activityList.innerHTML = `<li class="empty-state">Chưa có bài viết nào được nộp. Hãy chọn một chủ đề để bắt đầu nhé!</li>`;
    } else {
      activityList.innerHTML = state.history.slice(0, 5).map(item => `
        <li class="panel-list-item" style="cursor: pointer;" onclick="loadHistoryItem('${item.id}')">
          <div>
            <div class="item-title" title="${escapeHtml(item.topicTitle)}">${escapeHtml(item.topicTitle)}</div>
            <div class="item-meta">${escapeHtml(item.date)} • ${item.wordCount} từ</div>
          </div>
          <div class="item-stat">${Number(item.score).toFixed(1)}/10</div>
        </li>
      `).join('');
    }
  }
}

function renderCategoryView() {
  const titleEl = document.getElementById('topbar-title');
  const descEl = document.getElementById('category-description');
  const listContainer = document.getElementById('topics-list-container');
  const paginationContainer = document.getElementById('topics-pagination');

  if (!listContainer) return;

  let topics = [];
  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase();
    topics = getAllTopicsFlat().filter(t =>
      (t.title_en && t.title_en.toLowerCase().includes(q)) ||
      (t.title_vi && t.title_vi.toLowerCase().includes(q)) ||
      (t.prompt && t.prompt.toLowerCase().includes(q))
    );
    if (titleEl) titleEl.textContent = `KẾT QUẢ TÌM KIẾM: "${state.searchQuery}" (${topics.length} ĐỀ)`;
    if (descEl) descEl.textContent = `Tìm thấy ${topics.length} đề viết thư phù hợp với từ khóa của bạn trong ngân hàng 37 đề VSTEP B2.`;
  } else {
    const catData = getCategoryData(state.currentCategory);
    if (!catData) return;
    topics = (catData.topics || []).map(t => ({
      ...t,
      catNum: catData.id,
      category_id: catData.category_id,
      categoryTitle: catData.title,
      categoryTitleVi: catData.title_vi
    }));
    if (titleEl) titleEl.textContent = `${catData.title_vi.toUpperCase()} (${catData.title.toUpperCase()})`;
    if (descEl) descEl.textContent = catData.description || '';
  }

  if (topics.length === 0) {
    listContainer.innerHTML = `<div class="empty-state" style="grid-column: 1 / -1;">Không tìm thấy đề viết thư nào phù hợp với từ khóa.</div>`;
    if (paginationContainer) paginationContainer.innerHTML = '';
    return;
  }

  // Quick Jump Banner at top of category grid
  const quickBannerHtml = !state.searchQuery ? `
    <div class="updated-topics-banner">
      <h3>✨ DANH SÁCH ${topics.length} ĐỀ THI THỰC CHIẾN DẠNG ${(getCategoryData(state.currentCategory)?.title_vi || '').toUpperCase()}</h3>
      <div class="updated-topics-grid">
        ${topics.map((t, idx) => `
          <div class="updated-topic-pill" onclick="startPractice('${t.id}')">
            <span class="pill-icon">✉️</span>
            <span class="item-text">${escapeHtml(t.title_vi || `Đề ${idx + 1}: ${t.title_en}`)}</span>
          </div>
        `).join('')}
      </div>
    </div>
  ` : '';

  const totalPages = Math.ceil(topics.length / state.itemsPerPage);
  if (state.currentPage > totalPages) state.currentPage = 1;
  const startIdx = (state.currentPage - 1) * state.itemsPerPage;
  const pageTopics = topics.slice(startIdx, startIdx + state.itemsPerPage);

  const cardsHtml = pageTopics.map(t => {
    const meta = CATEGORY_META[t.catNum] || CATEGORY_META[1];
    const hasDraft = !!state.drafts[t.id];
    const isDone = state.history.some(h => h.topicId === t.id);
    return `
      <div class="topic-card" onclick="startPractice('${t.id}')">
        <div class="card-header">
          <span class="category-tag ${meta.tagClass}">${escapeHtml(t.recipient_type || t.categoryTitleVi)}</span>
          ${isDone ? '<span class="detail-badge">✓ Đã hoàn thành</span>' : hasDraft ? '<span class="detail-badge">📝 Đang lưu nháp</span>' : ''}
        </div>
        <div class="card-body">
          <h4>${escapeHtml(t.title_en)}</h4>
          <div class="translation">${escapeHtml(t.title_vi)}</div>
          <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.45; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
            ${escapeHtml((t.context || t.prompt || '').replace(/\*\*/g, ''))}
          </p>
        </div>
        <div class="card-footer">
          <span>📋 4 Bước luyện viết B2</span>
          <span class="start-btn">Bắt đầu ngay &rarr;</span>
        </div>
      </div>
    `;
  }).join('');

  listContainer.innerHTML = quickBannerHtml + cardsHtml;

  // Pagination
  if (paginationContainer) {
    if (totalPages <= 1) {
      paginationContainer.innerHTML = '';
    } else {
      let pagHtml = '';
      for (let p = 1; p <= totalPages; p++) {
        pagHtml += `<button class="page-btn ${p === state.currentPage ? 'active' : ''}" onclick="goToCategoryPage(${p})">${p}</button>`;
      }
      paginationContainer.innerHTML = pagHtml;
    }
  }
}

function goToCategoryPage(pageNum) {
  state.currentPage = pageNum;
  renderCategoryView();
}

// ============================================================================
// 7. WORKSPACE & 4-STEP STATE MACHINE (NO STEP-1 RENDER BUG!)
// ============================================================================
function startPractice(topicId) {
  const topic = findTopicById(topicId);
  if (!topic) {
    showToast('Không tìm thấy đề bài!', 'danger');
    return;
  }

  state.activeTopic = topic;
  state.currentCategory = topic.catNum || 1;
  state.isSubmitted = false;
  state.examModeActive = false;
  state.cheatStrikes = 0;

  // Ensure default B2 ideas are initialized for this topic
  ensureDefaultIdeasSelected(topic);

  // Update Workspace Header
  const titleEl = document.getElementById('workspace-topic-title');
  const catEl = document.getElementById('workspace-topic-category');
  const topTitleEl = document.getElementById('topbar-title');
  const meta = CATEGORY_META[topic.catNum] || CATEGORY_META[1];

  if (titleEl) titleEl.textContent = `${topic.title_en} — ${topic.title_vi}`;
  if (catEl) {
    catEl.className = `category-tag ${meta.tagClass}`;
    catEl.textContent = `${topic.categoryTitleVi} • ${topic.recipient_type || 'VSTEP B2'}`;
  }
  if (topTitleEl) topTitleEl.textContent = topic.title_vi || topic.title_en;

  // Reset layout from previous submission
  const wsGrid = document.getElementById('workspace-grid');
  if (wsGrid) wsGrid.classList.remove('submitted');
  const editorView = document.getElementById('step3-editor-view');
  const evalView = document.getElementById('step3-evaluation-view');
  if (editorView) editorView.style.display = 'flex';
  if (evalView) evalView.style.display = 'none';

  // Restore saved draft for this topic if any
  const savedDraft = state.drafts[topic.id];
  const textarea = document.getElementById('essay-textarea');
  if (textarea) {
    textarea.value = savedDraft && savedDraft.essayText ? savedDraft.essayText : '';
  }
  handleTextareaInput(true);

  // Reset timer to 20:00
  resetTimer();

  // Switch to workspace screen FIRST so containers have layout dimensions
  state.currentScreen = 'workspace';
  document.querySelectorAll('.screen').forEach(el => {
    el.classList.remove('active');
    el.style.display = 'none';
  });
  const wsScreen = document.getElementById('screen-workspace');
  if (wsScreen) {
    wsScreen.classList.add('active');
    wsScreen.style.display = 'block';
  }
  const topHeader = document.querySelector('.top-header');
  if (topHeader) {
    topHeader.classList.remove('view-category');
    topHeader.classList.add('view-workspace');
  }

  // Pre-render all 4 steps and activate Step 1 ('read') immediately!
  renderStep1Reading();
  renderTranslationExercises();
  renderStep4ModelEssay();
  switchStep('read');
}

// Backward-compatible alias
const openWorkspace = startPractice;

function switchStep(stepKey) {
  if (!state.activeTopic) return;

  // Guard leaving Exam Mode in Step 3 if student hasn't submitted
  if (state.examModeActive && state.activeStep === 'write' && stepKey !== 'write' && !state.isSubmitted && !state.isTeacher) {
    const ok = confirm('⚠️ Bạn đang ở Bước 3 (Phòng viết bài thi). Để xem lại đề hoặc gợi ý ở bước khác, hệ thống sẽ tạm thoát chế độ phòng thi. Bạn có muốn tiếp tục?');
    if (!ok) return;
    state.examModeActive = false;
    pauseTimer();
  }

  state.activeStep = stepKey;

  const stepMap = {
    read: { tab: 'step-tab-read', container: 'workspace-step1-container' },
    trans: { tab: 'step-tab-trans', container: 'workspace-step2-container' },
    write: { tab: 'step-tab-write', container: 'workspace-step3-container' },
    model: { tab: 'step-tab-model', container: 'workspace-step4-container' }
  };

  // Toggle Step Tabs & Containers explicitly (both class and inline display)
  Object.keys(stepMap).forEach(k => {
    const tabEl = document.getElementById(stepMap[k].tab);
    const contEl = document.getElementById(stepMap[k].container);
    const isTarget = (k === stepKey);
    if (tabEl) tabEl.classList.toggle('active', isTarget);
    if (contEl) {
      contEl.classList.toggle('active', isTarget);
      contEl.style.display = isTarget ? 'flex' : 'none';
    }
  });

  if (stepKey === 'read') {
    renderStep1Reading();
  } else if (stepKey === 'trans') {
    renderTranslationExercises();
  } else if (stepKey === 'write') {
    if (!state.isSubmitted) {
      state.examModeActive = true;
      const ev = document.getElementById('step3-editor-view');
      const qv = document.getElementById('step3-evaluation-view');
      if (ev) ev.style.display = 'flex';
      if (qv) qv.style.display = 'none';
    }
    handleTextareaInput(true);
  } else if (stepKey === 'model') {
    renderStep4ModelEssay();
  }
}

function exitExamMode() {
  state.examModeActive = false;
  pauseTimer();
  saveProgressAction(true);
  switchStep('read');
  showToast('Đã lưu nháp và quay lại Bước 1 để xem đề & gợi ý ý tưởng.', 'info');
}

// ============================================================================
// 8. STEP 1: ĐỌC HIỂU ĐỀ, CHỌN Ý TƯỞNG B2, DÀN Ý 5 BƯỚC & TỪ VỰNG
// ============================================================================
function buildDefaultTopicSelectionMap(topic) {
  const defaults = {};
  const groups = (topic && topic.details && Array.isArray(topic.details.suggested_ideas))
    ? topic.details.suggested_ideas
    : [];
  if (groups.length === 0) return defaults;

  if (groups.length <= 4) {
    // Standard 3–4 requirement topics: pick 1st option for each requirement
    groups.forEach((group, gIdx) => {
      defaults[gIdx] = (group.options && group.options.length > 0) ? [0] : [];
    });
  } else {
    // Multi-problem topics (e.g., de-20 with 13 changing room problems, or de-07/de-08/de-21 with 5–6 groups)
    groups.forEach((_, gIdx) => {
      defaults[gIdx] = [];
    });
    if (topic.id === 'de-20') {
      // Pick 3 representative problems (dirty changing room, broken lockers, slippery floor)
      [0, 1, 6].forEach(idx => {
        if (groups[idx] && groups[idx].options && groups[idx].options.length > 0) defaults[idx] = [0];
      });
    } else if (topic.id === 'de-08') {
      // Food quality, wait time, server attitude + Feelings/Disappointment
      [0, 1, 2, groups.length - 1].forEach(idx => {
        if (groups[idx] && groups[idx].options && groups[idx].options.length > 0) defaults[idx] = [0];
      });
    } else {
      // First 2 main problem groups + last Feelings/Disappointment group
      [0, 1, groups.length - 1].forEach(idx => {
        if (groups[idx] && groups[idx].options && groups[idx].options.length > 0) defaults[idx] = [0];
      });
    }
  }
  return defaults;
}

function ensureDefaultIdeasSelected(topic) {
  if (!topic || !topic.details || !Array.isArray(topic.details.suggested_ideas)) return;
  const groups = topic.details.suggested_ideas;
  const existing = state.selectedIdeasByTopic[topic.id];

  let needsReset = !existing || typeof existing !== 'object';
  if (!needsReset && groups.length > 4) {
    // Guard against legacy cached state that selected all 13 groups at once
    const selectedCount = Object.values(existing).reduce((acc, arr) => acc + (Array.isArray(arr) ? arr.length : 0), 0);
    if (selectedCount > 6 || selectedCount < 2) needsReset = true;
  }

  if (needsReset) {
    state.selectedIdeasByTopic[topic.id] = buildDefaultTopicSelectionMap(topic);
    saveSelectedIdeas();
  }
}

function resetTopicIdeasToDefault() {
  const topic = state.activeTopic;
  if (!topic) return;
  state.selectedIdeasByTopic[topic.id] = buildDefaultTopicSelectionMap(topic);
  saveSelectedIdeas();
  renderStep1Reading();
  showToast('Đã đặt lại bộ ý tưởng B2 mặc định cho đề bài này!', 'info');
}

function saveSelectedIdeas() {
  try {
    localStorage.setItem(STORAGE_KEYS.IDEAS, JSON.stringify(state.selectedIdeasByTopic));
  } catch (e) {}
}

function toggleLetterIdeaSelection(gIdx, optIdx) {
  const topic = state.activeTopic;
  if (!topic || !topic.details || !Array.isArray(topic.details.suggested_ideas)) return;
  ensureDefaultIdeasSelected(topic);

  const groups = topic.details.suggested_ideas;
  const isMultiGroupTopic = groups.length > 4;
  const topicSel = { ...(state.selectedIdeasByTopic[topic.id] || {}) };
  const currentArr = Array.isArray(topicSel[gIdx]) ? [...topicSel[gIdx]] : [];

  const totalSelected = groups.reduce((sum, _, idx) => {
    const arr = Array.isArray(topicSel[idx]) ? topicSel[idx] : [];
    return sum + arr.length;
  }, 0);

  const pos = currentArr.indexOf(optIdx);

  if (isMultiGroupTopic) {
    if (pos >= 0) {
      if (totalSelected <= 2) {
        showToast('Bức thư phàn nàn cần giữ ít nhất 2 ý tưởng để đảm bảo đủ ý và độ dài tối thiểu 120 từ!', 'warning');
        return;
      }
      currentArr.splice(pos, 1);
      topicSel[gIdx] = currentArr;
    } else {
      if (totalSelected >= 5 && currentArr.length === 0) {
        showToast('Bạn chỉ nên chọn từ 2 đến 5 vấn đề tiêu biểu để bức thư súc tích, đúng trọng tâm!', 'warning');
        return;
      }
      topicSel[gIdx] = [optIdx];
    }
  } else {
    // Standard 3–4 requirement topic: 1 chosen B2 idea per requirement (click another option in column to switch cleanly)
    if (pos >= 0) {
      if (currentArr.length === 1) {
        showToast('Mỗi yêu cầu trong đề cần có 1 ý tưởng đại diện. Hãy bấm vào phương án khác trong cùng cột nếu bạn muốn đổi ý nhé!', 'info');
        return;
      }
      currentArr.splice(pos, 1);
      topicSel[gIdx] = currentArr;
    } else {
      topicSel[gIdx] = [optIdx];
    }
  }

  state.selectedIdeasByTopic[topic.id] = topicSel;
  saveSelectedIdeas();
  renderStep1Reading();
}

function formatPromptDisplayHtml(rawPrompt) {
  if (!rawPrompt) return '';
  return rawPrompt.split('\n').map(line => {
    const trimmed = line.trim();
    if (!trimmed) return '<div style="height: 0.35rem;"></div>';

    // Rubric footer note (EN or VI)
    if (/^(You should write at least 120 words|Bạn nên viết ít nhất 120 từ)/i.test(trimmed)) {
      const safeRubric = escapeHtml(trimmed).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      return `<div class="prompt-rubric-note">${safeRubric}</div>`;
    }

    // Bullet item (- ..., • ..., * ..., o\t..., o ...)
    if (/^(?:[•\-*]|o(?=\s))\s+/i.test(trimmed)) {
      const stripped = trimmed.replace(/^(?:[•\-*]|o(?=\s))\s+/i, '').trim();
      const safeBullet = escapeHtml(stripped).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      return `<div class="prompt-bullet-item"><span>•</span><span>${safeBullet}</span></div>`;
    }

    // Quoted email excerpt ("... ...", “… …”, ... ..., … …)
    if (/^(?:["“”']\s*(?:\.\.\.|…)|(?:\.\.\.|…)\s+)/.test(trimmed)) {
      const safeQuote = escapeHtml(trimmed).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      return `<div class="prompt-quote-box">${safeQuote}</div>`;
    }

    const safeLine = escapeHtml(trimmed).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return `<div style="margin-bottom: 0.4rem;">${safeLine}</div>`;
  }).join('');
}

function toGerundPhrase(phrase) {
  if (!phrase) return '';
  const cleaned = phrase.trim().replace(/^always\s+/i, '');
  const words = cleaned.split(/\s+/);
  let v = words[0].toLowerCase();
  const rest = words.slice(1).join(' ');
  const irregulars = {
    be: 'being', have: 'having', make: 'making', take: 'taking',
    choose: 'choosing', come: 'coming', give: 'giving', write: 'writing',
    stay: 'staying', buy: 'buying', pay: 'paying', say: 'saying',
    try: 'trying', study: 'studying', fly: 'flying', put: 'putting',
    get: 'getting', run: 'running', stop: 'stopping', plan: 'planning',
    drop: 'dropping', sit: 'sitting', travel: 'traveling', pack: 'packing',
    use: 'using', practice: 'practicing', practise: 'practising',
    explore: 'exploring', taste: 'tasting', sample: 'sampling',
    participate: 'participating', compete: 'competing', organize: 'organizing',
    prepare: 'preparing', memorize: 'memorizing', wrap: 'wrapping', set: 'setting'
  };
  if (irregulars[v]) {
    v = irregulars[v];
  } else if (v.endsWith('ie')) {
    v = v.slice(0, -2) + 'ying';
  } else if (v.endsWith('e') && !v.endsWith('ee')) {
    v = v.slice(0, -1) + 'ing';
  } else if (/^[bcdfghjklmnpqrstvwxyz]+[aeiou][bcdfghjklmnprstvz]$/.test(v) && v.length <= 4) {
    v = v + v.slice(-1) + 'ing';
  } else {
    v = v + 'ing';
  }
  return rest ? `${v} ${rest}` : v;
}

function attachReasonClauseEn(baseClause, rsnEn) {
  const cleanBase = baseClause.trim();
  const isQuestion = cleanBase.endsWith('?') || /^(?:(?:First of all|Secondly|Second|Next|Besides that|On top of that|Finally|Last but not least|To begin with|In addition|Furthermore|Moreover|To make up for my mistake|To make up for this inconvenience),\s*)?(?:could|would|can|will|may|are|is|do|does|did|have|has)\s+(?:you|there|they|the|it|students|learners)\b/i.test(cleanBase);

  const finalizedBase = isQuestion
    ? cleanBase.replace(/[.?!]+$/, '') + '?'
    : (/[.?!]$/.test(cleanBase) ? cleanBase : cleanBase + '.');

  if (!rsnEn) return finalizedBase;

  const trimmedRsn = rsnEn.trim();
  if (isQuestion) {
    // Never splice a subordinate clause onto a question mark; turn "because ..." into "This is because ..."
    let followUp = trimmedRsn;
    if (/^because\b/i.test(followUp)) {
      followUp = 'This is ' + followUp.charAt(0).toLowerCase() + followUp.slice(1);
    } else if (/^so\s+that\b/i.test(followUp)) {
      // Polite modal requests like "would you kindly permit ... so that I can ..." work as a single polite question!
      if (/^(?:(?:To begin with|Secondly|Second|Next|In addition|Furthermore|Finally|First of all|To make up for my mistake|To make up for this inconvenience),\s*)?(?:would|could)\s+you\s+kindly\b/i.test(cleanBase)) {
        const bareQ = cleanBase.replace(/[.?!]+$/, '');
        const bareR = trimmedRsn.replace(/[.?!]+$/, '');
        return `${bareQ} ${bareR}?`;
      }
      followUp = 'This is ' + followUp;
    } else if (/^[a-z]/.test(followUp)) {
      followUp = followUp.charAt(0).toUpperCase() + followUp.slice(1);
    }
    if (!/[.?!]$/.test(followUp)) followUp += '.';
    return `${finalizedBase} ${followUp}`;
  }

  // Statement base
  if (/^[A-Z]/.test(trimmedRsn)) {
    const cleanRsnUpper = /[.?!]$/.test(trimmedRsn) ? trimmedRsn : trimmedRsn + '.';
    return `${finalizedBase} ${cleanRsnUpper}`;
  }

  // Lowercase subordinate reason/impact clause ("because ...", "which ...", "so ...", "in order to ...", etc.)
  const strippedBase = finalizedBase.replace(/[.?!]+$/, '');
  const cleanSub = trimmedRsn.replace(/[.?!]+$/, '');
  const needsComma = /^(which|where|meaning|[a-z]+ing)\b/i.test(cleanSub) || (/^so\b/i.test(cleanSub) && !/^so\s+(?:that|as\s+to)\b/i.test(cleanSub));
  return `${strippedBase}${needsComma ? ',' : ''} ${cleanSub}.`;
}

function attachReasonClauseVi(baseVi, rsnVi, rsnEn = '') {
  const cleanBase = baseVi.trim();
  const isQuestion = cleanBase.endsWith('?');
  const finalizedBase = isQuestion
    ? cleanBase
    : (/[.?!]$/.test(cleanBase) ? cleanBase : cleanBase + '.');

  if (!rsnVi) return finalizedBase;

  const trimmedRsn = rsnVi.trim();
  if (isQuestion) {
    let followVi = trimmedRsn;
    if (/^(bởi vì|vì)\b/i.test(followVi)) {
      followVi = 'Điều này là ' + followVi.charAt(0).toLowerCase() + followVi.slice(1);
    } else {
      followVi = followVi.charAt(0).toUpperCase() + followVi.slice(1);
    }
    if (!/[.?!]$/.test(followVi)) followVi += '.';
    return `${finalizedBase} ${followVi}`;
  }

  if (/^[A-ZÀÁẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÈÉẺẼẸÊẾỀỂỄỆÌÍỈĨỊÒÓỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÙÚỦŨỤƯỨỪỬỮỰỲÝỶỸỴĐ]/.test(trimmedRsn)) {
    const cRsn = /[.?!]$/.test(trimmedRsn) ? trimmedRsn : trimmedRsn + '.';
    return `${finalizedBase} ${cRsn}`;
  }

  const strippedBase = finalizedBase.replace(/[.?!]+$/, '');
  const cleanSubVi = trimmedRsn.replace(/[.?!]+$/, '');

  // If Vietnamese reason is an independent clause starting with a subject noun/pronoun
  if (/^(?:mình|tớ|em|tôi|chúng\s+tôi|chúng\s+mình|điều\s+này|việc\s+này|thái\s+độ|họ|chăm\s+sóc)(?=\s|$)/i.test(cleanSubVi)) {
    return `${strippedBase}. ${cleanSubVi.charAt(0).toUpperCase() + cleanSubVi.slice(1)}.`;
  }

  // If English reason starts with "because" and Vietnamese reason omits "vì/bởi vì/do/nhờ"
  if (/^because\b/i.test((rsnEn || '').trim()) && !/^(?:vì|bởi\s+vì|do|nhờ|gây\s+ra|như\s+một)(?=\s|$)/i.test(cleanSubVi)) {
    return `${strippedBase} vì ${cleanSubVi}.`;
  }

  const needsCommaVi = /^(khiến|làm|giúp|nhờ đó|đảm bảo|mang lại|tránh|nâng tầm|như một|chứng minh|nhắc nhở|duy trì|giữ cho|thể hiện|nhận được|tạo nên|góp phần|buộc|cho phép|mở ra|để lại)/i.test(cleanSubVi);
  return `${strippedBase}${needsCommaVi ? ',' : ''} ${cleanSubVi}.`;
}

// ============================================================================
// OFFICIAL B2 OUTLINE FRAMES (100% ALIGNED WITH vstepwritingtask1b2)
// ============================================================================
const B2_CATEGORY_FORMULA_HINTS = {
  advice: {
    openingFormula: 'Thanks for writing to me. How have you been lately? After reading your letter, I have a few suggestions that you may want to consider.',
    bodyFormula: 'To begin with, you could consider + V-ing... / Second, it would be a good idea to + Vo... / Next, if I were you, I would + Vo... / Finally, remember to + Vo...',
    closingFormula: 'I hope you find my suggestions helpful. Let me know how things go. Write back soon.'
  },
  request_informal: {
    openingFormula: 'How have you been lately? I hope everything is going well. I’m writing to ask for some information about [thông tin cần hỏi].',
    bodyFormula: 'To begin with, could you please let me know...? / In addition, I would like to ask whether/if... / Furthermore, I was wondering if you could provide me with details about... / Finally, would you mind letting me know...?',
    closingFormula: 'I hope to hear from you soon. Thanks a lot for your help. Take care.'
  },
  request_formal: {
    openingFormula: 'I am writing this letter to request information about [thông tin cần hỏi]. I would appreciate it if you could answer a few questions regarding this matter.',
    bodyFormula: 'To begin with, could you please let me know...? / In addition, I would like to ask whether/if... / Furthermore, I was wondering if you could provide me with details about... / Finally, I would also be grateful if you could clarify...',
    closingFormula: 'Thank you in advance for your time and assistance. I look forward to receiving your response at your earliest convenience.'
  },
  description_informal: {
    openingFormula: 'How have you been lately? I hope everything is going well. In your letter, you asked me about [đối tượng cần mô tả], so I’d like to share some information with you.',
    bodyFormula: 'To begin with, ... / In addition, ... / Furthermore, ... / Finally, ...',
    closingFormula: 'I hope this gives you a clear picture of [đối tượng]. Let me know if you want more details. Write back soon.'
  },
  description_formal: {
    openingFormula: 'I am writing to provide you with a detailed description of [đối tượng cần mô tả], as requested in your previous correspondence.',
    bodyFormula: 'To begin with, ... / In addition, ... / Furthermore, ... / Finally, ...',
    closingFormula: 'I hope the above information is useful to you. Please feel free to contact me if you require any further details.'
  },
  complaint: {
    openingFormula: 'I am writing to express my dissatisfaction with [sản phẩm/dịch vụ]. I recently used your [dịch vụ/cơ sở vật chất], and I was quite disappointed with the experience.',
    bodyFormula: 'The main issue that I would like to highlight is that... Specifically, ... / Furthermore, to make matters worse, ... In fact, ... / Given these circumstances, I expect you to + Vo.',
    closingFormula: 'I hope you will resolve this issue promptly. I look forward to receiving your prompt reply and a satisfactory solution.'
  },
  feedback: {
    openingFormula: 'I am writing to provide feedback on [vấn đề phản hồi]. I recently used your [sản phẩm/dịch vụ] and would like to share my experience.',
    bodyFormula: 'Overall, I found your [dịch vụ] quite satisfactory... One aspect I appreciated was... / However, there were also several areas that required improvement. One issue that I encountered was... / To enhance the quality of your [dịch vụ], I suggest that you + Vo.',
    closingFormula: 'I hope my feedback will be useful in improving your [dịch vụ]. Please feel free to contact me if you have any further questions.'
  },
  apology_informal: {
    openingFormula: 'I’m really sorry for [lỗi lầm - Ving/N]. I feel terrible about what happened, and I’d like to explain the situation more clearly.',
    bodyFormula: 'First of all, here is the reason for this. Unfortunately, I could not + Vo because... / Let me make it up to you by + V-ing, and I’ll make sure this does not happen again.',
    closingFormula: 'I’m really sorry once again. I truly appreciate your understanding. Write back soon.'
  },
  apology_formal: {
    openingFormula: 'I am writing to sincerely apologize for [lỗi lầm - Ving/N]. I deeply regret any inconvenience or distress that this situation may have caused you.',
    bodyFormula: 'First of all, here is the reason for this. / Unfortunately, ... / To make up for my mistake (this inconvenience), I would like to...',
    closingFormula: 'I would like to sincerely apologize once again for the inconvenience. Thank you for your understanding. I look forward to receiving your reply soon.'
  },
  application: {
    openingFormula: 'I am writing to apply for the position of [vị trí công việc], which was advertised on/in [nguồn tuyển dụng].',
    bodyFormula: 'I am particularly interested in this position because... / Regarding my previous experience, I worked part-time as... / Moreover, I believe I would be a suitable candidate for this position because...',
    closingFormula: 'I would be grateful if you could consider my application. I am available for an interview at your convenience and look forward to hearing from you soon.'
  }
};

const TOPIC_B2_OUTLINE_FRAMES = {
  // === 1. ADVICE (8 ĐỀ) ===
  'de-01': {
    salutationEn: 'Dear Helen,', salutationVi: 'Helen thân mến,',
    openingEn: 'Thanks for writing to me. How have you been lately? After reading your letter, I have a few suggestions that you may want to consider for your upcoming trip to Hanoi in June.',
    openingVi: 'Cảm ơn cậu đã viết thư cho tớ. Dạo này cậu thế nào? Sau khi đọc thư của cậu, tớ có một vài gợi ý mà cậu có thể cân nhắc cho chuyến đi sắp tới đến Hà Nội vào tháng Sáu.',
    closingEn: 'I hope you find my suggestions helpful. Let me know how things go. Write back soon.',
    closingVi: 'Tớ hy vọng cậu thấy những gợi ý của tớ hữu ích. Hãy cho tớ biết mọi chuyện diễn ra thế nào nhé. Hồi âm sớm cho tớ.',
    signoffEn: 'Best wishes,', signoffVi: 'Chúc cậu những điều tốt đẹp nhất,'
  },
  'de-02': {
    salutationEn: 'Dear David,', salutationVi: 'David thân mến,',
    openingEn: 'Thanks for writing to me. How have you been lately? After reading your letter, I have a few suggestions that you may want to consider for your six-month Vietnamese course at Hanoi University.',
    openingVi: 'Cảm ơn cậu đã viết thư cho tớ. Dạo này cậu thế nào? Sau khi đọc thư của cậu, tớ có một vài gợi ý mà cậu có thể cân nhắc cho khóa học tiếng Việt sáu tháng tại Đại học Hà Nội.',
    closingEn: 'I hope you find my suggestions helpful. Let me know how things go. Write back soon.',
    closingVi: 'Tớ hy vọng cậu thấy những gợi ý của tớ hữu ích. Hãy cho tớ biết mọi chuyện diễn ra thế nào nhé. Hồi âm sớm cho tớ.',
    signoffEn: 'Best wishes,', signoffVi: 'Chúc cậu những điều tốt đẹp nhất,'
  },
  'de-15': {
    salutationEn: 'Dear Emily,', salutationVi: 'Emily thân mến,',
    openingEn: 'Thanks for writing to me. How have you been lately? After reading your letter, I have a few suggestions that you may want to consider for your upcoming trip to Can Tho in December.',
    openingVi: 'Cảm ơn cậu đã viết thư cho tớ. Dạo này cậu thế nào? Sau khi đọc thư của cậu, tớ có một vài gợi ý mà cậu có thể cân nhắc cho chuyến đi sắp tới đến Cần Thơ vào tháng Mười Hai.',
    closingEn: 'I hope you find my suggestions helpful. Let me know how things go. Write back soon.',
    closingVi: 'Tớ hy vọng cậu thấy những gợi ý của tớ hữu ích. Hãy cho tớ biết mọi chuyện diễn ra thế nào nhé. Hồi âm sớm cho tớ.',
    signoffEn: 'Best wishes,', signoffVi: 'Chúc cậu những điều tốt đẹp nhất,'
  },
  'de-29': {
    salutationEn: 'Dear Ann,', salutationVi: 'Ann thân mến,',
    openingEn: 'Thanks for writing to me. How have you been lately? After reading your letter, I have a few suggestions that you may want to consider for your Vietnamese course in Vietnam.',
    openingVi: 'Cảm ơn cậu đã viết thư cho tớ. Dạo này cậu thế nào? Sau khi đọc thư của cậu, tớ có một vài gợi ý mà cậu có thể cân nhắc cho khóa học tiếng Việt tại Việt Nam.',
    closingEn: 'I hope you find my suggestions helpful. Let me know how things go. Write back soon.',
    closingVi: 'Tớ hy vọng cậu thấy những gợi ý của tớ hữu ích. Hãy cho tớ biết mọi chuyện diễn ra thế nào nhé. Hồi âm sớm cho tớ.',
    signoffEn: 'Best wishes,', signoffVi: 'Chúc cậu những điều tốt đẹp nhất,'
  },
  'de-30': {
    salutationEn: 'Dear Jane,', salutationVi: 'Jane thân mến,',
    openingEn: 'Thanks for writing to me. How have you been lately? After reading your letter, I’d love to update you on my new job, and I also have a few suggestions that you may want to consider for your job interview.',
    openingVi: 'Cảm ơn cậu đã viết thư cho tớ. Dạo này cậu thế nào? Sau khi đọc thư của cậu, tớ rất vui được kể về công việc mới của mình và gửi cậu vài gợi ý đáng cân nhắc cho buổi phỏng vấn xin việc.',
    closingEn: 'I hope you find my suggestions helpful. Let me know how things go. Write back soon.',
    closingVi: 'Tớ hy vọng cậu thấy những gợi ý của tớ hữu ích. Hãy cho tớ biết mọi chuyện diễn ra thế nào nhé. Hồi âm sớm cho tớ.',
    signoffEn: 'Best wishes,', signoffVi: 'Chúc cậu những điều tốt đẹp nhất,'
  },
  'de-31': {
    salutationEn: 'Dear Jane,', salutationVi: 'Jane thân mến,',
    openingEn: 'Thanks for writing to me. How have you been lately? After reading your letter, I have a few suggestions that you may want to consider for your summer holiday in Vietnam.',
    openingVi: 'Cảm ơn cậu đã viết thư cho tớ. Dạo này cậu thế nào? Sau khi đọc thư của cậu, tớ có một vài gợi ý mà cậu có thể cân nhắc cho chuyến du lịch mùa hè tới Việt Nam.',
    closingEn: 'I hope you find my suggestions helpful. Let me know how things go. Write back soon.',
    closingVi: 'Tớ hy vọng cậu thấy những gợi ý của tớ hữu ích. Hãy cho tớ biết mọi chuyện diễn ra thế nào nhé. Hồi âm sớm cho tớ.',
    signoffEn: 'Best wishes,', signoffVi: 'Chúc cậu những điều tốt đẹp nhất,'
  },
  'de-32': {
    salutationEn: 'Dear Alex,', salutationVi: 'Alex thân mến,',
    openingEn: 'Thanks for writing to me. How have you been lately? After reading your letter, I have a few suggestions that you may want to consider for your group poster project.',
    openingVi: 'Cảm ơn cậu đã viết thư cho tớ. Dạo này cậu thế nào? Sau khi đọc thư của cậu, tớ có một vài gợi ý mà cậu có thể cân nhắc cho dự án thiết kế áp phích nhóm.',
    closingEn: 'I hope you find my suggestions helpful. Let me know how things go. Write back soon.',
    closingVi: 'Tớ hy vọng cậu thấy những gợi ý của tớ hữu ích. Hãy cho tớ biết mọi chuyện diễn ra thế nào nhé. Hồi âm sớm cho tớ.',
    signoffEn: 'Best wishes,', signoffVi: 'Chúc cậu những điều tốt đẹp nhất,'
  },
  'de-35': {
    salutationEn: 'Dear Moonie,', salutationVi: 'Moonie thân mến,',
    openingEn: 'Thanks for writing to me. How have you been lately? After reading your letter, I have a few suggestions that you may want to consider for your new job at the local bookstore.',
    openingVi: 'Cảm ơn cậu đã viết thư cho tớ. Dạo này cậu thế nào? Sau khi đọc thư của cậu, tớ có một vài gợi ý mà cậu có thể cân nhắc cho công việc mới tại hiệu sách địa phương.',
    closingEn: 'I hope you find my suggestions helpful. Let me know how things go. Write back soon.',
    closingVi: 'Tớ hy vọng cậu thấy những gợi ý của tớ hữu ích. Hãy cho tớ biết mọi chuyện diễn ra thế nào nhé. Hồi âm sớm cho tớ.',
    signoffEn: 'Best wishes,', signoffVi: 'Chúc cậu những điều tốt đẹp nhất,'
  },

  // === 2. REQUEST (4 ĐỀ) ===
  'de-03': {
    salutationEn: 'Dear Sir/Madam,', salutationVi: 'Kính gửi Quý Ông/Bà,',
    openingEn: 'I am writing this letter to request information about the summer cooking course at Delight Kitchen Center. I would appreciate it if you could answer a few questions regarding this matter.',
    openingVi: 'Tôi viết bức thư này để xin thông tin về khóa học nấu ăn mùa hè tại Trung tâm Delight Kitchen. Tôi rất cảm kích nếu quý vị có thể giải đáp một vài câu hỏi liên quan đến vấn đề này.',
    closingEn: 'Thank you in advance for your time and assistance. I look forward to receiving your response at your earliest convenience.',
    closingVi: 'Xin chân thành cảm ơn trước vì thời gian và sự hỗ trợ của quý vị. Tôi rất mong sớm nhận được phản hồi từ quý vị.',
    signoffEn: 'Yours faithfully,', signoffVi: 'Trân trọng,'
  },
  'de-04': {
    salutationEn: 'Dear Linda,', salutationVi: 'Linda thân mến,',
    openingEn: 'How have you been lately? I hope everything is going well. I’m writing to ask for some information about the beginner Chinese course at New Horizon Language Center.',
    openingVi: 'Dạo này cậu thế nào? Tớ hy vọng mọi việc đều suôn sẻ. Tớ viết thư này để hỏi xin một số thông tin về khóa học tiếng Trung sơ cấp tại Trung tâm Ngoại ngữ New Horizon.',
    closingEn: 'I hope to hear from you soon. Thanks a lot for your help. Take care.',
    closingVi: 'Tớ hy vọng sớm nhận được tin từ cậu. Cảm ơn sự giúp đỡ của cậu rất nhiều nhé. Giữ gìn sức khỏe nhé.',
    signoffEn: 'Best wishes,', signoffVi: 'Chúc cậu những điều tốt đẹp nhất,'
  },
  'de-16': {
    salutationEn: 'Dear Moonie,', salutationVi: 'Moonie thân mến,',
    openingEn: 'How have you been lately? I hope everything is going well. I’m writing to ask for some information about the English course at Rainbow Language Center.',
    openingVi: 'Dạo này cậu thế nào? Tớ hy vọng mọi việc đều suôn sẻ. Tớ viết thư này để hỏi xin một số thông tin về khóa học tiếng Anh tại Trung tâm Anh ngữ Rainbow.',
    closingEn: 'I hope to hear from you soon. Thanks a lot for your help. Take care.',
    closingVi: 'Tớ hy vọng sớm nhận được tin từ cậu. Cảm ơn sự giúp đỡ của cậu rất nhiều nhé. Giữ gìn sức khỏe nhé.',
    signoffEn: 'Best wishes,', signoffVi: 'Chúc cậu những điều tốt đẹp nhất,'
  },
  'de-17': {
    salutationEn: 'Dear Linda,', salutationVi: 'Linda thân mến,',
    openingEn: 'How have you been lately? I hope everything is going well. I’m writing to ask for some information about the Chinese course at Happy Chinese Language Center.',
    openingVi: 'Dạo này cậu thế nào? Tớ hy vọng mọi việc đều suôn sẻ. Tớ viết thư này để hỏi xin một số thông tin về khóa học tiếng Trung tại Trung tâm Happy Chinese.',
    closingEn: 'I hope to hear from you soon. Thanks a lot for your help. Take care.',
    closingVi: 'Tớ hy vọng sớm nhận được tin từ cậu. Cảm ơn sự giúp đỡ của cậu rất nhiều nhé. Giữ gìn sức khỏe nhé.',
    signoffEn: 'Best wishes,', signoffVi: 'Chúc cậu những điều tốt đẹp nhất,'
  },

  // === 3. DESCRIPTION (8 ĐỀ) ===
  'de-19': {
    salutationEn: 'Dear Emily,', salutationVi: 'Emily thân mến,',
    openingEn: 'How have you been lately? I hope everything is going well. In your letter, you asked me about my friend Hoa, so I’d like to share some information with you.',
    openingVi: 'Dạo này cậu thế nào? Tớ hy vọng mọi việc đều suôn sẻ. Trong thư trước, cậu có hỏi tớ về cô bạn Hoa của tớ, nên tớ muốn chia sẻ một số thông tin với cậu.',
    closingEn: 'I hope this gives you a clear picture of Hoa. Let me know if you want more details. Write back soon.',
    closingVi: 'Tớ hy vọng những điều trên giúp cậu hình dung rõ hơn về Hoa. Hãy cho tớ biết nếu cậu cần thêm thông tin nhé. Hồi âm sớm cho tớ.',
    signoffEn: 'Best wishes,', signoffVi: 'Chúc cậu những điều tốt đẹp nhất,'
  },
  'de-05': {
    salutationEn: 'Dear John,', salutationVi: 'John thân mến,',
    openingEn: 'How have you been lately? I hope everything is going well. In your letter, you asked me about the mountain biking competition, so I’d like to share some information with you.',
    openingVi: 'Dạo này cậu thế nào? Tớ hy vọng mọi việc đều suôn sẻ. Trong thư, cậu có hỏi tớ về giải đua xe đạp địa hình vừa qua, nên tớ muốn chia sẻ một số thông tin thú vị với cậu.',
    closingEn: 'I hope this gives you a clear picture of the race and our upcoming tour. Let me know if you want more details. Write back soon.',
    closingVi: 'Tớ hy vọng những chia sẻ này giúp cậu hình dung rõ về cuộc đua và chuyến đi sắp tới. Hãy cho tớ biết nếu cậu muốn thêm thông tin nhé. Hồi âm sớm cho tớ.',
    signoffEn: 'Best wishes,', signoffVi: 'Chúc cậu những điều tốt đẹp nhất,'
  },
  'de-06': {
    salutationEn: 'Dear Helen,', salutationVi: 'Helen thân mến,',
    openingEn: 'How have you been lately? I hope everything is going well. In your letter, you asked me about my new house near the university campus, so I’d like to share some information with you.',
    openingVi: 'Dạo này cậu thế nào? Tớ hy vọng mọi việc đều suôn sẻ. Trong thư, cậu có hỏi tớ về ngôi nhà mới gần khuôn viên trường đại học, nên tớ muốn chia sẻ một số thông tin với cậu.',
    closingEn: 'I hope this gives you a clear picture of my new house. Let me know if you want more details. Write back soon.',
    closingVi: 'Tớ hy vọng những điều này giúp cậu hình dung rõ về ngôi nhà mới của tớ. Hãy cho tớ biết nếu cậu muốn biết thêm chi tiết nhé. Hồi âm sớm cho tớ.',
    signoffEn: 'Best wishes,', signoffVi: 'Chúc cậu những điều tốt đẹp nhất,'
  },
  'de-18': {
    salutationEn: 'Dear Nam,', salutationVi: 'Nam thân mến,',
    openingEn: 'How have you been lately? I hope everything is going well. In your letter, you asked me about the English course at Rainbow Language Center, so I’d like to share some information with you.',
    openingVi: 'Dạo này cậu thế nào? Tớ hy vọng mọi việc đều suôn sẻ. Trong thư, cậu có hỏi tớ về khóa học tiếng Anh tại Trung tâm Anh ngữ Rainbow, nên tớ muốn chia sẻ một số thông tin với cậu.',
    closingEn: 'I hope this gives you a clear picture of the English course. Let me know if you want more details. Write back soon.',
    closingVi: 'Tớ hy vọng những chia sẻ trên giúp cậu hình dung rõ về khóa học tiếng Anh này. Hãy báo tớ nếu cậu cần thêm thông tin nhé. Hồi âm sớm cho tớ.',
    signoffEn: 'Best wishes,', signoffVi: 'Chúc cậu những điều tốt đẹp nhất,'
  },
  'de-28': {
    salutationEn: 'Dear Moonie,', salutationVi: 'Moonie thân mến,',
    openingEn: 'How have you been lately? I hope everything is going well. In your letter, you asked me about my art project on the topic “At Home”, so I’d like to share some information with you.',
    openingVi: 'Dạo này cậu thế nào? Tớ hy vọng mọi việc đều suôn sẻ. Trong thư, cậu có hỏi tớ về dự án vẽ tranh chủ đề “Ở Nhà”, nên tớ muốn chia sẻ một số thông tin với cậu.',
    closingEn: 'I hope this gives you a clear picture of my art project. Let me know if you want more details. Write back soon.',
    closingVi: 'Tớ hy vọng những chia sẻ này giúp cậu hình dung rõ về bức tranh của tớ. Hãy cho tớ biết nếu cậu muốn biết thêm chi tiết nhé. Hồi âm sớm cho tớ.',
    signoffEn: 'Best wishes,', signoffVi: 'Chúc cậu những điều tốt đẹp nhất,'
  },
  'de-34': {
    salutationEn: 'Dear Helen,', salutationVi: 'Helen thân mến,',
    openingEn: 'How have you been lately? I hope everything is going well. In your letter, you asked me about my new puppy, so I’d like to share some information with you.',
    openingVi: 'Dạo này cậu thế nào? Tớ hy vọng mọi việc đều suôn sẻ. Trong thư, cậu có hỏi tớ về chú cún con mới nuôi, nên tớ muốn chia sẻ một số thông tin với cậu.',
    closingEn: 'I hope this gives you a clear picture of my new puppy. Let me know if you want more details. Write back soon.',
    closingVi: 'Tớ hy vọng những chia sẻ này giúp cậu hình dung rõ về chú cún mới của tớ. Hãy cho tớ biết nếu cậu muốn biết thêm chi tiết nhé. Hồi âm sớm cho tớ.',
    signoffEn: 'Best wishes,', signoffVi: 'Chúc cậu những điều tốt đẹp nhất,'
  },
  'de-36': {
    salutationEn: 'Dear Mrs. Jane,', salutationVi: 'Kính gửi Bà Jane,',
    openingEn: 'I am writing to provide you with a detailed description of our upcoming outdoor activity for Grade 4 students, as requested in your previous correspondence.',
    openingVi: 'Tôi viết thư này để cung cấp cho Bà thông tin chi tiết về hoạt động dã ngoại sắp tới dành cho học sinh khối 4, theo yêu cầu trong thư trước của Bà.',
    closingEn: 'I hope the above information is useful to you. Please feel free to contact me if you require any further details.',
    closingVi: 'Tôi hy vọng những thông tin trên hữu ích đối với Bà. Xin đừng ngần ngại liên hệ với tôi nếu Bà cần thêm bất kỳ chi tiết nào.',
    signoffEn: 'Yours sincerely,', signoffVi: 'Trân trọng,'
  },
  'de-37': {
    salutationEn: 'Dear Mrs. Lan,', salutationVi: 'Kính gửi Bà Lan,',
    openingEn: 'I am writing to provide you with a detailed description of my lost suitcase and flight itinerary, as requested in your previous correspondence.',
    openingVi: 'Tôi viết thư này để cung cấp cho Bà mô tả chi tiết về chiếc vali bị thất lạc và lịch trình chuyến bay của tôi, theo yêu cầu trong thư trước của Bà.',
    closingEn: 'I hope the above information is useful to you. Please feel free to contact me if you require any further details.',
    closingVi: 'Tôi hy vọng những thông tin trên hữu ích cho quá trình tìm kiếm của Bà. Xin vui lòng liên hệ với tôi nếu Bà cần thêm bất kỳ thông tin nào.',
    signoffEn: 'Yours sincerely,', signoffVi: 'Trân trọng,'
  },

  // === 4. COMPLAINT (4 ĐỀ) ===
  'de-20': {
    salutationEn: 'Dear Sir/Madam,', salutationVi: 'Kính gửi Quý Ông/Bà,',
    openingEn: 'I am writing to express my dissatisfaction with the condition of the changing rooms at your sports center. I recently used your facilities, and I was quite disappointed with the experience.',
    openingVi: 'Tôi viết thư này để bày tỏ sự không hài lòng về tình trạng phòng thay đồ tại trung tâm thể thao của quý vị. Gần đây tôi có sử dụng cơ sở vật chất của trung tâm và khá thất vọng với trải nghiệm này.',
    closingEn: 'I hope you will resolve this issue promptly. I look forward to receiving your prompt reply and a satisfactory solution.',
    closingVi: 'Tôi hy vọng quý vị sẽ sớm giải quyết vấn đề này. Tôi rất mong nhận được phản hồi nhanh chóng cùng hướng khắc phục thỏa đáng từ quý vị.',
    signoffEn: 'Yours faithfully,', signoffVi: 'Trân trọng,'
  },
  'de-07': {
    salutationEn: 'Dear Sir/Madam,', salutationVi: 'Kính gửi Quý Ông/Bà,',
    openingEn: 'I am writing to express my dissatisfaction with the broken workout equipment at Elite Fitness Club. I recently used your gym facilities, and I was quite disappointed with the experience.',
    openingVi: 'Tôi viết thư này để bày tỏ sự không hài lòng về tình trạng nhiều thiết bị tập luyện bị hỏng tại Elite Fitness Club. Gần đây tôi có sử dụng phòng tập của quý vị và khá thất vọng với trải nghiệm này.',
    closingEn: 'I hope you will resolve this issue promptly. I look forward to receiving your prompt reply and a satisfactory solution.',
    closingVi: 'Tôi hy vọng quý vị sẽ sớm giải quyết vấn đề này. Tôi rất mong nhận được phản hồi nhanh chóng cùng hướng khắc phục thỏa đáng từ quý vị.',
    signoffEn: 'Yours faithfully,', signoffVi: 'Trân trọng,'
  },
  'de-08': {
    salutationEn: 'Dear Sir/Madam,', salutationVi: 'Kính gửi Quý Ông/Bà,',
    openingEn: 'I am writing to express my dissatisfaction with the food quality and customer service at The Grand Bistro. I recently dined at your restaurant, and I was quite disappointed with the experience.',
    openingVi: 'Tôi viết thư này để bày tỏ sự không hài lòng về chất lượng món ăn và dịch vụ khách hàng tại nhà hàng The Grand Bistro. Gần đây tôi có dùng bữa tại nhà hàng và khá thất vọng với trải nghiệm này.',
    closingEn: 'I hope you will resolve this issue promptly. I look forward to receiving your prompt reply and a satisfactory solution.',
    closingVi: 'Tôi hy vọng quý vị sẽ sớm giải quyết vấn đề này. Tôi rất mong nhận được phản hồi nhanh chóng cùng hướng khắc phục thỏa đáng từ quý vị.',
    signoffEn: 'Yours faithfully,', signoffVi: 'Trân trọng,'
  },
  'de-21': {
    salutationEn: 'Dear Sir/Madam,', salutationVi: 'Kính gửi Quý Ông/Bà,',
    openingEn: 'I am writing to express my dissatisfaction with the condition of my guest room during my recent holiday stay. I recently used your hotel services, and I was quite disappointed with the experience.',
    openingVi: 'Tôi viết thư này để bày tỏ sự không hài lòng về tình trạng phòng nghỉ trong kỳ lưu trú vừa qua. Gần đây tôi có sử dụng dịch vụ khách sạn của quý vị và khá thất vọng với trải nghiệm này.',
    closingEn: 'I hope you will resolve this issue promptly. I look forward to receiving your prompt reply and a satisfactory solution.',
    closingVi: 'Tôi hy vọng quý vị sẽ sớm giải quyết vấn đề này. Tôi rất mong nhận được phản hồi nhanh chóng cùng hướng khắc phục thỏa đáng từ quý vị.',
    signoffEn: 'Yours faithfully,', signoffVi: 'Trân trọng,'
  },

  // === 5. FEEDBACK (4 ĐỀ) ===
  'de-09': {
    salutationEn: 'Dear Mr. Tailor,', salutationVi: 'Kính gửi Ông Tailor,',
    openingEn: 'I am writing to provide feedback on the public bus service on Route 08. I recently used your transport service and would like to share my experience.',
    openingVi: 'Tôi viết thư này để đóng góp ý kiến phản hồi về dịch vụ xe buýt công cộng tuyến số 08. Thời gian qua tôi thường xuyên sử dụng dịch vụ vận tải của quý đơn vị và muốn chia sẻ trải nghiệm của mình.',
    closingEn: 'I hope my feedback will be useful in improving your public bus service. Please feel free to contact me if you have any further questions.',
    closingVi: 'Tôi hy vọng những phản hồi của tôi sẽ hữu ích trong việc nâng cao chất lượng dịch vụ xe buýt công cộng. Xin vui lòng liên hệ với tôi nếu Ông có bất kỳ câu hỏi nào thêm.',
    signoffEn: 'Yours sincerely,', signoffVi: 'Trân trọng,'
  },
  'de-10': {
    salutationEn: 'Dear Sir/Madam,', salutationVi: 'Kính gửi Quý Ông/Bà,',
    openingEn: 'I am writing to provide feedback on the birthday party service at Golden Spoon Restaurant. I recently used your dining facilities and would like to share my experience.',
    openingVi: 'Tôi viết thư này để đóng góp ý kiến phản hồi về dịch vụ tổ chức tiệc sinh nhật tại Nhà hàng Golden Spoon. Vừa qua tôi có sử dụng dịch vụ tại nhà hàng và muốn chia sẻ trải nghiệm của mình.',
    closingEn: 'I hope my feedback will be useful in improving your restaurant service. Please feel free to contact me if you have any further questions.',
    closingVi: 'Tôi hy vọng những phản hồi của tôi sẽ hữu ích trong việc cải thiện dịch vụ của nhà hàng. Xin vui lòng liên hệ với tôi nếu quý vị có bất kỳ câu hỏi nào thêm.',
    signoffEn: 'Yours faithfully,', signoffVi: 'Trân trọng,'
  },
  'de-22': {
    salutationEn: 'Dear Sir/Madam,', salutationVi: 'Kính gửi Quý Ông/Bà,',
    openingEn: 'I am writing to provide feedback on my recent stay at your hotel. I recently used your accommodation services and would like to share my experience.',
    openingVi: 'Tôi viết thư này để đóng góp ý kiến phản hồi về kỳ lưu trú vừa qua tại khách sạn của quý vị. Gần đây tôi có sử dụng dịch vụ lưu trú tại khách sạn và muốn chia sẻ trải nghiệm của mình.',
    closingEn: 'I hope my feedback will be useful in improving your hotel services. Please feel free to contact me if you have any further questions.',
    closingVi: 'Tôi hy vọng những ý kiến phản hồi của tôi sẽ hữu ích trong việc nâng cao chất lượng dịch vụ khách sạn. Xin vui lòng liên hệ với tôi nếu quý vị có bất kỳ câu hỏi nào thêm.',
    signoffEn: 'Yours faithfully,', signoffVi: 'Trân trọng,'
  },
  'de-23': {
    salutationEn: 'Dear Sir/Madam,', salutationVi: 'Kính gửi Quý Ông/Bà,',
    openingEn: 'I am writing to provide feedback on my recent dinner at your new restaurant. I recently used your dining services and would like to share my experience.',
    openingVi: 'Tôi viết thư này để đóng góp ý kiến phản hồi về bữa tối vừa qua tại nhà hàng mới của quý vị. Gần đây tôi có sử dụng dịch vụ ẩm thực tại nhà hàng và muốn chia sẻ trải nghiệm của mình.',
    closingEn: 'I hope my feedback will be useful in improving your restaurant services. Please feel free to contact me if you have any further questions.',
    closingVi: 'Tôi hy vọng những ý kiến phản hồi của tôi sẽ hữu ích trong việc hoàn thiện dịch vụ nhà hàng. Xin vui lòng liên hệ với tôi nếu quý vị có bất kỳ câu hỏi nào thêm.',
    signoffEn: 'Yours faithfully,', signoffVi: 'Trân trọng,'
  },

  // === 6. APOLOGY (5 ĐỀ) ===
  'de-11': {
    salutationEn: 'Dear Professor Johnson,', salutationVi: 'Kính gửi Giáo sư Johnson,',
    openingEn: 'I am writing to sincerely apologize for failing to submit my term research paper on time. I deeply regret any inconvenience or distress that this situation may have caused you.',
    openingVi: 'Em viết thư này để chân thành xin lỗi vì đã không nộp bài tiểu luận nghiên cứu học kỳ đúng hạn. Em vô cùng hối tiếc về bất kỳ sự bất tiện hay phiền hà nào mà sự việc này có thể đã gây ra cho Giáo sư.',
    closingEn: 'I would like to sincerely apologize once again for the inconvenience. Thank you for your understanding. I look forward to receiving your reply soon.',
    closingVi: 'Một lần nữa em xin chân thành xin lỗi vì sự bất tiện này. Cảm ơn sự cảm thông của Giáo sư. Em rất mong sớm nhận được phản hồi từ Giáo sư.',
    signoffEn: 'Yours sincerely,', signoffVi: 'Trân trọng,'
  },
  'de-12': {
    salutationEn: 'Dear Mr. Smith,', salutationVi: 'Kính gửi Ông Smith,',
    openingEn: 'I am writing to sincerely apologize for the delayed room service you experienced during your recent stay at Pearl Palace Hotel. I deeply regret any inconvenience or distress that this situation may have caused you.',
    openingVi: 'Tôi viết thư này để chân thành xin lỗi về sự chậm trễ của dịch vụ ăn uống tại phòng mà Ông đã gặp phải trong kỳ nghỉ vừa qua tại Khách sạn Pearl Palace. Tôi vô cùng lấy làm tiếc về bất kỳ sự bất tiện nào mà tình huống này đã gây ra cho Ông.',
    closingEn: 'I would like to sincerely apologize once again for the inconvenience. Thank you for your understanding. I look forward to receiving your reply soon.',
    closingVi: 'Một lần nữa tôi xin chân thành xin lỗi vì sự bất tiện vừa qua. Cảm ơn sự thông cảm của Ông. Tôi rất mong sớm nhận được phản hồi từ Ông.',
    signoffEn: 'Yours sincerely,', signoffVi: 'Trân trọng,'
  },
  'de-24': {
    salutationEn: 'Dear Helen,', salutationVi: 'Helen thân mến,',
    openingEn: 'I’m really sorry for not returning your book on time. I feel terrible about what happened, and I’d like to explain the situation more clearly.',
    openingVi: 'Tớ thực sự rất xin lỗi vì đã không trả lại sách cho cậu đúng hẹn. Tớ cảm thấy rất áy náy về chuyện đã xảy ra và muốn giải thích rõ hơn về tình hình của mình.',
    closingEn: 'I’m really sorry once again. I truly appreciate your understanding. Write back soon.',
    closingVi: 'Một lần nữa tớ thực sự xin lỗi cậu. Tớ vô cùng trân trọng sự thông cảm của cậu. Hồi âm sớm cho tớ nhé.',
    signoffEn: 'Best wishes,', signoffVi: 'Chúc cậu những điều tốt đẹp nhất,'
  },
  'de-25': {
    salutationEn: 'Dear Professor,', salutationVi: 'Kính gửi Giáo sư,',
    openingEn: 'I am writing to sincerely apologize for failing to submit my course assignment before last Friday’s deadline. I deeply regret any inconvenience or distress that this situation may have caused you.',
    openingVi: 'Em viết thư này để chân thành xin lỗi vì đã không nộp bài tập môn học trước thời hạn thứ Sáu tuần trước. Em vô cùng hối tiếc về bất kỳ sự bất tiện nào mà tình huống này đã gây ra cho Giáo sư.',
    closingEn: 'I would like to sincerely apologize once again for the inconvenience. Thank you for your understanding. I look forward to receiving your reply soon.',
    closingVi: 'Một lần nữa em xin chân thành xin lỗi vì sự bất tiện này. Cảm ơn sự cảm thông của Giáo sư. Em rất mong sớm nhận được phản hồi từ Giáo sư.',
    signoffEn: 'Yours sincerely,', signoffVi: 'Trân trọng,'
  },
  'de-33': {
    salutationEn: 'Dear Ms. Smith,', salutationVi: 'Kính gửi Bà Smith,',
    openingEn: 'I am writing to sincerely apologize for the unsatisfactory service you experienced during your recent stay at our hotel. I deeply regret any inconvenience or distress that this situation may have caused you.',
    openingVi: 'Tôi viết thư này để chân thành xin lỗi về trải nghiệm dịch vụ chưa thỏa đáng mà Bà đã gặp phải trong kỳ lưu trú vừa qua tại khách sạn của chúng tôi. Tôi vô cùng lấy làm tiếc về mọi sự bất tiện mà sự việc này đã gây ra cho Bà.',
    closingEn: 'I would like to sincerely apologize once again for the inconvenience. Thank you for your understanding. I look forward to receiving your reply soon.',
    closingVi: 'Một lần nữa tôi xin chân thành xin lỗi vì sự bất tiện vừa qua. Cảm ơn sự thông cảm của Bà. Tôi rất mong sớm nhận được phản hồi từ Bà.',
    signoffEn: 'Yours sincerely,', signoffVi: 'Trân trọng,'
  },

  // === 7. APPLICATION (4 ĐỀ) ===
  'de-13': {
    salutationEn: 'Dear Sir/Madam,', salutationVi: 'Kính gửi Quý Ông/Bà,',
    openingEn: 'I am writing to apply for the position of part-time waiter at Sunflower Restaurant, which was advertised on your restaurant’s website.',
    openingVi: 'Tôi viết thư này để ứng tuyển vào vị trí nhân viên phục vụ bán thời gian tại Nhà hàng Sunflower, được đăng tuyển trên trang web của nhà hàng.',
    closingEn: 'I would be grateful if you could consider my application. I am available for an interview at your convenience and look forward to hearing from you soon.',
    closingVi: 'Tôi sẽ rất biết ơn nếu quý vị xem xét hồ sơ ứng tuyển của tôi. Tôi sẵn sàng tham gia phỏng vấn vào thời gian thuận tiện cho quý vị và rất mong sớm nhận được phản hồi.',
    signoffEn: 'Yours faithfully,', signoffVi: 'Trân trọng,'
  },
  'de-14': {
    salutationEn: 'Dear Sir/Madam,', salutationVi: 'Kính gửi Quý Ông/Bà,',
    openingEn: 'I am writing to apply for the position of Event Assistant for the upcoming Youth Cultural Festival, which was advertised on the university noticeboard.',
    openingVi: 'Tôi viết thư này để ứng tuyển vào vị trí Trợ lý Sự kiện cho Lễ hội Văn hóa Thanh niên sắp tới, được đăng thông báo trên bảng tin trường đại học.',
    closingEn: 'I would be grateful if you could consider my application. I am available for an interview at your convenience and look forward to hearing from you soon.',
    closingVi: 'Tôi sẽ rất biết ơn nếu quý ban tổ chức xem xét đơn ứng tuyển của tôi. Tôi sẵn sàng tham gia phỏng vấn vào bất kỳ thời điểm nào thuận tiện và rất mong sớm nhận được hồi âm.',
    signoffEn: 'Yours faithfully,', signoffVi: 'Trân trọng,'
  },
  'de-26': {
    salutationEn: 'Dear Sir/Madam,', salutationVi: 'Kính gửi Quý Ông/Bà,',
    openingEn: 'I am writing to apply for the position of Sales Assistant at your clothing store, which was advertised on your official website.',
    openingVi: 'Tôi viết thư này để ứng tuyển vào vị trí Nhân viên bán hàng tại cửa hàng thời trang của quý vị, được đăng tuyển trên trang web chính thức của cửa hàng.',
    closingEn: 'I would be grateful if you could consider my application. I am available for an interview at your convenience and look forward to hearing from you soon.',
    closingVi: 'Tôi sẽ rất biết ơn nếu quý vị xem xét hồ sơ ứng tuyển của tôi. Tôi sẵn sàng tham gia phỏng vấn vào thời gian thuận tiện và rất mong sớm nhận được phản hồi từ quý vị.',
    signoffEn: 'Yours faithfully,', signoffVi: 'Trân trọng,'
  },
  'de-27': {
    salutationEn: 'Dear Sir/Madam,', salutationVi: 'Kính gửi Quý Ông/Bà,',
    openingEn: 'I am writing to apply for the position of Receptionist at your hotel, which was advertised on your official website.',
    openingVi: 'Tôi viết thư này để ứng tuyển vào vị trí Lễ tân tại khách sạn của quý vị, được đăng tuyển trên trang web chính thức của khách sạn.',
    closingEn: 'I would be grateful if you could consider my application. I am available for an interview at your convenience and look forward to hearing from you soon.',
    closingVi: 'Tôi sẽ rất biết ơn nếu quý vị xem xét hồ sơ ứng tuyển của tôi. Tôi sẵn sàng tham gia phỏng vấn vào thời gian thuận tiện và rất mong sớm nhận được phản hồi từ quý vị.',
    signoffEn: 'Yours faithfully,', signoffVi: 'Trân trọng,'
  }
};

function lowerClauseUnlessProperEn(str) {
  const s = (str || '').trim();
  if (!s) return '';
  const keepCap = /^(?:I(?:\s|['’])|Wi-Fi\b|Hoa\b|Nam\b|Linda\b|Helen\b|Emily\b|John\b|Jane\b|Ann\b|Alex\b|Moonie\b|Lucky\b|Milo\b|Sunny\b|Hero\b|Hanoi\b|Can\s+Tho\b|Da\s+Nang\b|Ho\s+Chi\s+Minh\b|Tan\s+Son\s+Nhat\b|Noi\s+Bai\b|Vietnam\b|Vietnamese\b|English\b|Chinese\b|Mandarin\b|Monday\b|Tuesday\b|Wednesday\b|Thursday\b|Friday\b|Saturday\b|Sunday\b|Mr\.|Ms\.|Mrs\.|Professor\b|National\s+Geographic\b|BBC\b|QR\b|PDF\b|CV\b|B2\b|Elite\b|Rainbow\b|Delight\b|Pearl\b|Sunflower\b)/.test(s);
  return keepCap ? s : s.charAt(0).toLowerCase() + s.slice(1);
}

function lowerClauseUnlessProperVi(str) {
  const s = (str || '').trim();
  if (!s) return '';
  const keepCapVi = /^(?:Hoa\b|Nam\b|Linda\b|Helen\b|Emily\b|John\b|Jane\b|Ann\b|Alex\b|Moonie\b|Lucky\b|Milo\b|Hà\s+Nội\b|Cần\s+Thơ\b|Đà\s+Nẵng\b|Việt\s+Nam\b|TP\.|Tân\s+Sơn\s+Nhất\b|Nội\s+Bài\b|Wi-Fi\b)/.test(s);
  return keepCapVi ? s : s.charAt(0).toLowerCase() + s.slice(1);
}

function formatComplaintExpectedActionEn(solEn, useExpectedFormula) {
  if (!solEn) return '';
  const cleanSol = solEn.trim().replace(/[.?!]+$/, '');
  if (!useExpectedFormula) return `${cleanSol}.`;

  let m = cleanSol.match(/^I (?:would appreciate it if you could|(?:would like to )?suggest that you|strongly recommend that you|believe that (?:these )?steps should be taken to|hope that you will)\s+(.+)$/i);
  if (m) {
    return `Given these circumstances, I expect you to ${m[1]}.`;
  }
  m = cleanSol.match(/^I strongly recommend that (?:the )?(management|staff|head chef)\s+(.+)$/i);
  if (m) {
    return `Given these circumstances, I expect your ${m[1].toLowerCase()} to ${m[2]}.`;
  }
  return `Given these circumstances, ${lowerClauseUnlessProperEn(cleanSol)}.`;
}

function formatComplaintExpectedActionVi(solVi, useExpectedFormula) {
  if (!solVi) return '';
  const cleanSolVi = solVi.trim().replace(/[.?!]+$/, '');
  if (!useExpectedFormula) return `${cleanSolVi}.`;

  const stripped = cleanSolVi.replace(/^(?:Tôi rất cảm kích nếu quý vị có thể|Tôi rất mong quý vị có thể|Tôi muốn đề xuất quý vị|Tôi đề xuất quý vị|Tôi đặc biệt khuyến nghị quý vị|Tôi kiến nghị quý vị|Tôi tin rằng cần thực hiện các biện pháp để|Tôi tin rằng các biện pháp này cần được thực hiện để|Tôi hy vọng rằng quý vị sẽ|Tôi hy vọng quý vị sẽ)\s+/i, '');
  if (stripped !== cleanSolVi) {
    return `Trước những tình huống này, tôi đề nghị quý vị ${stripped}.`;
  }
  return `Trước những tình huống này, ${lowerClauseUnlessProperVi(cleanSolVi)}.`;
}

// Build a 100% grammatical B2 English sentence + Vietnamese prompt strictly following Miss Nguyet's vstepwritingtask1b2 outline
function buildB2IdeaSentencePair(topic, group, opt, seqIndex, totalSelected = 4, groupIndex = -1) {
  const catKey = topic.category_id || 'advice';
  const isInformal = /informal|thân mật|bạn bè/i.test(topic.recipient_type || topic.details?.analysis?.letter_type || '');
  const resolvedGroupIdx = groupIndex >= 0
    ? groupIndex
    : Math.max(0, (topic.details?.suggested_ideas || []).indexOf(group));
  const isLastSelected = totalSelected > 1 && seqIndex === totalSelected - 1;

  // Select category-authentic connectors from vstepwritingtask1b2
  let conn = 'To begin with,';
  let connVi = 'Đầu tiên,';

  if (catKey === 'advice') {
    if (topic.id === 'de-30') {
      const de30En = ['To begin with,', 'In addition,', 'Regarding your job interview,', 'Finally,'];
      const de30Vi = ['Đầu tiên,', 'Thêm vào đó,', 'Về buổi phỏng vấn xin việc của cậu,', 'Cuối cùng,'];
      const idx30 = isLastSelected ? 3 : Math.min(3, resolvedGroupIdx);
      conn = de30En[idx30];
      connVi = de30Vi[idx30];
    } else {
      const advEn = ['To begin with,', 'Second,', 'Next,', 'Finally,'];
      const advVi = ['Đầu tiên,', 'Thứ hai,', 'Tiếp theo,', 'Cuối cùng,'];
      const idxAdv = isLastSelected ? 3 : (seqIndex % 4);
      conn = advEn[idxAdv];
      connVi = advVi[idxAdv];
    }
  } else if (catKey === 'request' || catKey === 'description') {
    const reqEn = ['To begin with,', 'In addition,', 'Furthermore,', 'Finally,'];
    const reqVi = catKey === 'request'
      ? ['Đầu tiên,', 'Thêm vào đó,', 'Hơn nữa,', 'Cuối cùng,']
      : ['Đầu tiên,', 'Ngoài ra,', 'Hơn nữa,', 'Cuối cùng,'];
    const idxReq = isLastSelected ? 3 : (seqIndex % 4);
    conn = reqEn[idxReq];
    connVi = reqVi[idxReq];
  } else if (catKey === 'application') {
    const appEn = ['First of all,', 'In addition,', 'Regarding my previous experience,', 'Moreover,'];
    const appVi = ['Trước hết,', 'Thêm vào đó,', 'Về kinh nghiệm làm việc trước đây,', 'Hơn thế nữa,'];
    const idxApp = Math.min(3, resolvedGroupIdx >= 0 ? resolvedGroupIdx : (seqIndex % 4));
    conn = appEn[idxApp];
    connVi = appVi[idxApp];
  } else {
    const genEn = ['First of all,', 'In addition,', 'Furthermore,', 'Finally,'];
    const genVi = ['Trước hết,', 'Thêm vào đó,', 'Hơn nữa,', 'Cuối cùng,'];
    const idxGen = isLastSelected ? 3 : (seqIndex % 4);
    conn = genEn[idxGen];
    connVi = genVi[idxGen];
  }

  let actEn = (opt.action_en || opt.problem_en || '').trim().replace(/\s+/g, ' ');
  let actVi = (opt.action_vi || opt.problem_vi || '').trim().replace(/\s+/g, ' ');
  const rsnEn = (opt.reason_en || opt.impact_en || '').trim().replace(/\s+/g, ' ');
  const rsnVi = (opt.reason_vi || opt.impact_vi || '').trim().replace(/\s+/g, ' ');
  const exp1En = (opt.expansion_1_en || '').trim().replace(/\s+/g, ' ');
  const exp1Vi = (opt.expansion_1_vi || '').trim().replace(/\s+/g, ' ');
  const solEn = (opt.solution_en || '').trim().replace(/\s+/g, ' ');
  const solVi = (opt.solution_vi || '').trim().replace(/\s+/g, ' ');

  // === DẠNG 4: COMPLAINT (Exact vstepwritingtask1b2 formulas) ===
  if (catKey === 'complaint') {
    const cleanAct = actEn.replace(/[.?!]+$/, '');
    const cleanActVi = actVi.replace(/[.?!]+$/, '');
    const isFeelingSummary = /^I was particularly disappointed\b/i.test(cleanAct);

    let compEn = '';
    let compVi = '';

    if (isFeelingSummary) {
      compEn = `Furthermore, ${cleanAct}.`;
      compVi = `Hơn nữa, ${lowerClauseUnlessProperVi(cleanActVi)}.`;
      if (rsnEn) compEn += ` ${/[.?!]$/.test(rsnEn) ? rsnEn : rsnEn + '.'}`;
      if (rsnVi) compVi += ` ${/[.?!]$/.test(rsnVi) ? rsnVi : rsnVi + '.'}`;
    } else if (seqIndex === 0) {
      compEn = `The main issue that I would like to highlight is that ${lowerClauseUnlessProperEn(cleanAct)}.`;
      compVi = `Vấn đề chính mà tôi muốn nhấn mạnh là ${lowerClauseUnlessProperVi(cleanActVi)}.`;
      if (rsnEn) {
        const cleanRsn = rsnEn.replace(/[.?!]+$/, '');
        compEn += ` Specifically, ${lowerClauseUnlessProperEn(cleanRsn)}.`;
      }
      if (rsnVi) {
        const cleanRsnVi = rsnVi.replace(/[.?!]+$/, '');
        compVi += ` Cụ thể là, ${lowerClauseUnlessProperVi(cleanRsnVi)}.`;
      }
      compEn += ' This caused a great deal of inconvenience for me.';
      compVi += ' Điều này đã gây ra rất nhiều sự bất tiện cho tôi.';
    } else if (seqIndex === 1) {
      compEn = `Furthermore, to make matters worse, ${lowerClauseUnlessProperEn(cleanAct)}.`;
      compVi = `Hơn nữa, tệ hơn là ${lowerClauseUnlessProperVi(cleanActVi)}.`;
      if (rsnEn) {
        const cleanRsn = rsnEn.replace(/[.?!]+$/, '');
        compEn += ` In fact, ${lowerClauseUnlessProperEn(cleanRsn)}.`;
      }
      if (rsnVi) {
        const cleanRsnVi = rsnVi.replace(/[.?!]+$/, '');
        compVi += ` Thực tế là, ${lowerClauseUnlessProperVi(cleanRsnVi)}.`;
      }
    } else {
      compEn = `In addition, ${lowerClauseUnlessProperEn(cleanAct)}.`;
      compVi = `Thêm vào đó, ${lowerClauseUnlessProperVi(cleanActVi)}.`;
      if (rsnEn) compEn += ` ${/[.?!]$/.test(rsnEn) ? rsnEn : rsnEn + '.'}`;
      if (rsnVi) compVi += ` ${/[.?!]$/.test(rsnVi) ? rsnVi : rsnVi + '.'}`;
    }

    if (solEn) {
      compEn += ' ' + formatComplaintExpectedActionEn(solEn, isLastSelected || totalSelected === 1);
    }
    if (solVi) {
      compVi += ' ' + formatComplaintExpectedActionVi(solVi, isLastSelected || totalSelected === 1);
    }

    return {
      en: compEn.replace(/\s+/g, ' ').trim(),
      vi: compVi.replace(/\s+/g, ' ').trim()
    };
  }

  // === DẠNG 5: FEEDBACK (Exact vstepwritingtask1b2 Praise / Issue / Suggestion formulas) ===
  if (catKey === 'feedback') {
    const bareAct = actEn.replace(/[.,;:]+$/, '');
    const bareVi = actVi.replace(/[.,;:]+$/, '');
    const isBareSuggestionVerb = /^[a-z]/.test(bareAct) &&
      /^(increase|deploy|conduct|install|enforce|upgrade|synchronize|curate|train|assign|offer|hire|use|rearrange|introduce|provide|improve|repair|replace|organize|maintain)\b/i.test(bareAct);
    const isFullSuggestionClause = /^I\s+(?:suggest|recommend|would\s+suggest|would\s+recommend|believe\s+the\s+hotel\s+should)\b/i.test(bareAct);
    const isFourGroupFeedback = (topic.details?.suggested_ideas || []).length >= 4;

    let fbBaseEn = '';
    let fbBaseVi = '';

    if (isBareSuggestionVerb) {
      fbBaseEn = seqIndex % 2 === 0
        ? `To enhance the quality of your service, I suggest that you ${bareAct}.`
        : `To enhance the quality of your service, it would be better if you could ${bareAct}.`;
      fbBaseVi = seqIndex % 2 === 0
        ? `Để nâng cao chất lượng dịch vụ, tôi đề xuất quý vị ${bareVi}.`
        : `Để nâng cao chất lượng dịch vụ, sẽ tốt hơn nếu quý vị có thể ${bareVi}.`;
    } else if (isFullSuggestionClause) {
      fbBaseEn = `To enhance the quality of your service, ${bareAct}.`;
      fbBaseVi = `Để nâng cao chất lượng dịch vụ, ${lowerClauseUnlessProperVi(bareVi)}.`;
    } else if (isFourGroupFeedback) {
      if (resolvedGroupIdx === 0) {
        fbBaseEn = `Overall, I found your service quite satisfactory, although there are some aspects that could be improved. One aspect I appreciated was that ${lowerClauseUnlessProperEn(bareAct)}.`;
        fbBaseVi = `Nhìn chung, tôi thấy dịch vụ của quý vị khá thỏa đáng, mặc dù vẫn còn một vài điểm có thể cải thiện. Một khía cạnh tôi đánh giá cao là ${lowerClauseUnlessProperVi(bareVi)}.`;
      } else if (resolvedGroupIdx === 1) {
        fbBaseEn = `However, there were also several areas that required improvement. One issue that I encountered was that ${lowerClauseUnlessProperEn(bareAct)}.`;
        fbBaseVi = `Tuy nhiên, vẫn còn một số khía cạnh cần được cải thiện. Một vấn đề mà tôi gặp phải là ${lowerClauseUnlessProperVi(bareVi)}.`;
      } else {
        fbBaseEn = `Furthermore, I was disappointed that ${lowerClauseUnlessProperEn(bareAct)}.`;
        fbBaseVi = `Hơn nữa, tôi khá thất vọng khi ${lowerClauseUnlessProperVi(bareVi)}.`;
      }
    } else {
      // 3-group feedback topics (de-22, de-23): G0 = Overall, G1 = Specific praise/issue
      if (resolvedGroupIdx === 0) {
        const hasOverall = /^(Overall|On the whole|While|Unfortunately)\b/i.test(bareAct);
        fbBaseEn = hasOverall
          ? `${bareAct.charAt(0).toUpperCase() + bareAct.slice(1)}.`
          : `Overall, ${lowerClauseUnlessProperEn(bareAct)}.`;
        const hasOverallVi = /^(Nhìn chung|Tổng thể|Mặc dù|Thật không may)/i.test(bareVi);
        fbBaseVi = hasOverallVi
          ? `${bareVi.charAt(0).toUpperCase() + bareVi.slice(1)}.`
          : `Nhìn chung, ${lowerClauseUnlessProperVi(bareVi)}.`;
      } else {
        const isNegativeExp = /\b(unstable|disconnected|not very effective|inconsistent|wait nearly|gone cold|too close together)\b/i.test(bareAct);
        if (/^however\b/i.test(bareAct)) {
          fbBaseEn = `${bareAct.charAt(0).toUpperCase() + bareAct.slice(1)}.`;
          fbBaseVi = `${bareVi.charAt(0).toUpperCase() + bareVi.slice(1)}.`;
        } else if (isNegativeExp) {
          fbBaseEn = `However, one issue that I encountered was that ${lowerClauseUnlessProperEn(bareAct)}.`;
          fbBaseVi = `Tuy nhiên, một vấn đề mà tôi gặp phải là ${lowerClauseUnlessProperVi(bareVi)}.`;
        } else {
          fbBaseEn = `One aspect I appreciated was that ${lowerClauseUnlessProperEn(bareAct)}.`;
          fbBaseVi = `Một khía cạnh tôi đánh giá cao là ${lowerClauseUnlessProperVi(bareVi)}.`;
        }
      }
    }

    let fbEn = attachReasonClauseEn(fbBaseEn, rsnEn);
    let fbVi = attachReasonClauseVi(fbBaseVi, rsnVi, rsnEn);
    if (exp1En) fbEn += ` ${/[.?!]$/.test(exp1En) ? exp1En : exp1En + '.'}`;
    if (exp1Vi) fbVi += ` ${/[.?!]$/.test(exp1Vi) ? exp1Vi : exp1Vi + '.'}`;

    return {
      en: fbEn.replace(/\s+/g, ' ').trim(),
      vi: fbVi.replace(/\s+/g, ' ').trim()
    };
  }

  // === DẠNG 6: APOLOGY (Exact vstepwritingtask1b2 reason & make-up formulas) ===
  if (catKey === 'apology') {
    const cleanApol = actEn.replace(/[.?!]+$/, '');
    const cleanApolVi = actVi.replace(/[.?!]+$/, '');

    // Informal apology to Helen (de-24)
    if (topic.id === 'de-24') {
      let apolBaseEn = '';
      let apolBaseVi = '';
      if (resolvedGroupIdx === 0) {
        apolBaseEn = 'First of all, here is the reason for this. Unfortunately, I could not return your book on time.';
        apolBaseVi = 'Trước hết, đây là lý do của việc này. Thật sự không may là tớ đã không thể trả sách cho cậu đúng hẹn.';
      } else if (resolvedGroupIdx === 1) {
        apolBaseEn = `Specifically, ${lowerClauseUnlessProperEn(cleanApol)}.`;
        apolBaseVi = `Cụ thể là, ${lowerClauseUnlessProperVi(cleanApolVi)}.`;
      } else if (resolvedGroupIdx === 2) {
        if (/^To be honest\b/i.test(cleanApol)) {
          apolBaseEn = cleanApol + '.';
          apolBaseVi = cleanApolVi + '.';
        } else {
          apolBaseEn = `Regarding the book, ${lowerClauseUnlessProperEn(cleanApol)}.`;
          apolBaseVi = `Về cuốn sách của cậu, ${lowerClauseUnlessProperVi(cleanApolVi)}.`;
        }
      } else {
        const mWill = cleanApol.match(/^I will\s+(.+)$/i);
        if (mWill) {
          apolBaseEn = `Let me make it up to you by ${toGerundPhrase(mWill[1])}.`;
          const strippedWillVi = cleanApolVi.replace(/^(?:Tớ sẽ|Mình sẽ)\s+/i, '');
          apolBaseVi = `Hãy để tớ bù đắp cho cậu bằng cách ${strippedWillVi}.`;
        } else {
          apolBaseEn = `To make it up to you, ${lowerClauseUnlessProperEn(cleanApol)}.`;
          apolBaseVi = `Để bù đắp cho cậu, ${lowerClauseUnlessProperVi(cleanApolVi)}.`;
        }
      }
      let resEn = attachReasonClauseEn(apolBaseEn, rsnEn);
      let resVi = attachReasonClauseVi(apolBaseVi, rsnVi, rsnEn);
      if (exp1En) resEn += ` ${/[.?!]$/.test(exp1En) ? exp1En : exp1En + '.'}`;
      if (exp1Vi) resVi += ` ${/[.?!]$/.test(exp1Vi) ? exp1Vi : exp1Vi + '.'}`;
      return { en: resEn.replace(/\s+/g, ' ').trim(), vi: resVi.replace(/\s+/g, ' ').trim() };
    }

    // Formal / Semi-formal apologies (de-11, de-12, de-25, de-33)
    const isManagerApology = (topic.id === 'de-12' || topic.id === 'de-33');
    let formalApolAct = cleanApol.replace(/^I am writing (?:this email )?to (?:express my deepest apologies|apologize) for /i, 'I deeply regret ');
    let formalApolVi = cleanApolVi.replace(/^(?:Em|Tôi) viết (?:bức )?(?:thư|email) này để (?:bày tỏ lời xin lỗi sâu sắc nhất|chân thành xin lỗi|xin lỗi) vì /i, 'em thực sự vô cùng hối tiếc vì ');

    const hasApolLeadEn = /^(On behalf|Please accept|Thank you|Once again|First|Unfortunately|To make up)\b/i.test(formalApolAct);
    let apolLeadEn = 'First of all,';
    let apolLeadVi = 'Trước hết,';

    if (resolvedGroupIdx === 0) {
      apolLeadEn = 'First of all,';
      apolLeadVi = 'Trước hết,';
    } else if (resolvedGroupIdx === 1) {
      apolLeadEn = isManagerApology && topic.id === 'de-33' ? 'To make up for this inconvenience,' : 'Unfortunately,';
      apolLeadVi = isManagerApology && topic.id === 'de-33' ? 'Để bù đắp cho sự bất tiện này,' : 'Thật không may,';
    } else if (resolvedGroupIdx === 2) {
      apolLeadEn = isManagerApology ? 'Furthermore,' : 'To make up for my mistake,';
      apolLeadVi = isManagerApology ? 'Hơn nữa,' : 'Để khắc phục sai sót của mình,';
    } else {
      apolLeadEn = isManagerApology
        ? (topic.id === 'de-33' ? 'Finally, as a gesture of goodwill,' : 'To make up for this inconvenience,')
        : 'Finally,';
      apolLeadVi = isManagerApology
        ? (topic.id === 'de-33' ? 'Cuối cùng, như một thiện chí bù đắp,' : 'Để bù đắp cho sự bất tiện này,')
        : 'Cuối cùng,';
    }

    const apolBaseEn = hasApolLeadEn
      ? formalApolAct.charAt(0).toUpperCase() + formalApolAct.slice(1)
      : `${apolLeadEn} ${lowerClauseUnlessProperEn(formalApolAct)}`;
    const apolBaseVi = /^(Thay mặt|Xin hãy nhận|Cảm ơn|Trước hết|Thật không may|Để bù đắp)/i.test(formalApolVi)
      ? formalApolVi.charAt(0).toUpperCase() + formalApolVi.slice(1)
      : `${apolLeadVi} ${lowerClauseUnlessProperVi(formalApolVi)}`;

    let resEn = attachReasonClauseEn(apolBaseEn, rsnEn);
    let resVi = attachReasonClauseVi(apolBaseVi, rsnVi, rsnEn);
    if (exp1En) resEn += ` ${/[.?!]$/.test(exp1En) ? exp1En : exp1En + '.'}`;
    if (exp1Vi) resVi += ` ${/[.?!]$/.test(exp1Vi) ? exp1Vi : exp1Vi + '.'}`;
    return { en: resEn.replace(/\s+/g, ' ').trim(), vi: resVi.replace(/\s+/g, ' ').trim() };
  }

  // === DẠNG 7: APPLICATION (Avoid repeating "I am writing..." & upgrade to vstepwritingtask1b2 phrases) ===
  if (catKey === 'application') {
    actEn = actEn
      .replace(/^I am writing to express my enthusiastic interest in\b/i, 'I am particularly interested in')
      .replace(/^I am very interested in this position\b/i, 'I am particularly interested in this position')
      .replace(/^I really want to work at\b/i, 'I am particularly interested in working at');
    actVi = actVi
      .replace(/^tôi viết thư này để bày tỏ sự quan tâm nhiệt thành tới\b/i, 'tôi đặc biệt quan tâm đến')
      .replace(/^tôi rất muốn làm việc tại\b/i, 'tôi đặc biệt quan tâm đến việc làm việc tại');
  }

  if (isInformal && actVi) {
    actVi = actVi
      .replace(/^Xin vui lòng (?:cho tôi biết|thông báo cho tôi về)\s+/i, 'cậu có thể cho tớ biết ')
      .replace(/\bcho tôi biết\b/gi, 'cho tớ biết')
      .replace(/\bgửi cho tôi\b/gi, 'gửi cho tớ');
  }

  const alreadyHasConnectorEn = /^(First|Second|Third|Next|Finally|Last|To begin|In addition|Furthermore|Moreover|Besides|Regarding|As for|However|Overall|On the whole|On behalf|Please accept|Thank you)\b/i.test(actEn);
  const alreadyHasConnectorVi = /^(Trước hết|Đầu tiên|Thứ hai|Tiếp theo|Bên cạnh đó|Thêm vào đó|Ngoài ra|Hơn nữa|Hơn thế nữa|Cuối cùng|Nhìn chung|Tuy nhiên|Thay mặt|Xin hãy nhận|Cảm ơn|Về\s+)/i.test(actVi);

  const bareActClean = actEn.replace(/[.,;:]+$/, '');
  const bareViClean = actVi.replace(/[.,;:]+$/, '');

  const isRequestVerbStem = catKey === 'request' && /^(ask|inquire)\s+/i.test(bareActClean);
  const isAdviceBareVerb = catKey === 'advice' &&
    /^[a-z]/.test(bareActClean) &&
    /^(stay|choose|book|try|eat|visit|wear|bring|rent|opt|look|practice|practise|use|watch|keep|find|listen|join|participate|take|attend|compete|download|buy|always\s+have|always\s+greet|walk|avoid|taste|enjoy|sample|explore|put|pack|carry)\b/i.test(bareActClean);
  const adviceModalMatch = catKey === 'advice'
    ? bareActClean.match(/^you\s+(?:should|can)\s+(?!(?:never|not|also|definitely|be\b))([a-z]+\b.*)$/i)
    : null;

  let baseClauseEn = '';
  let baseClauseVi = '';

  if (isRequestVerbStem) {
    // Transform "ask about/for/if/whether/how..." -> exact vstepwritingtask1b2 Request structures
    const strippedVerb = bareActClean.replace(/^(?:ask|inquire)\s+/i, '');
    const strippedVi = bareViClean.replace(/^(?:hỏi\s+xem\s+|hỏi\s+về\s+|hỏi\s+|tìm\s+hiểu\s+xem\s+|tìm\s+hiểu\s+về\s+)/i, '');
    const isAboutOrFor = /^(?:about|for)\s+/i.test(strippedVerb);
    const nounPhrase = strippedVerb.replace(/^(?:about|for)\s+/i, '');

    const mode = seqIndex % 4;
    if (isAboutOrFor) {
      if (mode === 0) baseClauseEn = `${conn} could you please let me know more about ${nounPhrase}?`;
      else if (mode === 1) baseClauseEn = `${conn} I was wondering if you could provide me with details about ${nounPhrase}.`;
      else if (mode === 2) baseClauseEn = `${conn} could you also tell me about ${nounPhrase}?`;
      else baseClauseEn = isInformal
        ? `${conn} would you mind letting me know more about ${nounPhrase}?`
        : `${conn} I would also be grateful if you could clarify ${nounPhrase}.`;
    } else {
      if (mode === 0) baseClauseEn = `${conn} could you please let me know ${strippedVerb}?`;
      else if (mode === 1) baseClauseEn = `${conn} I would like to ask ${strippedVerb}.`;
      else if (mode === 2) baseClauseEn = `${conn} would you mind letting me know ${strippedVerb}?`;
      else baseClauseEn = isInformal
        ? `${conn} could you also tell me ${strippedVerb}?`
        : `${conn} I would also be grateful if you could clarify ${strippedVerb}.`;
    }

    const viAlreadyQuestion = /(?:\s+không|\s+chưa|\?)$/i.test(strippedVi);
    const viHasEmbeddedWh = /\b(?:bao nhiêu|mấy|nào|gì|đâu|sao|thế nào|như thế nào|hay\s+|liệu\b)/i.test(strippedVi);
    const cleanStrippedVi = strippedVi.replace(/\?+$/, '');
    const isQuestionOut = baseClauseEn.trim().endsWith('?');
    if (isQuestionOut) {
      const suffixQ = (viAlreadyQuestion || viHasEmbeddedWh) ? '?' : ' được không?';
      baseClauseVi = isInformal
        ? `${connVi} cậu có thể cho tớ biết ${cleanStrippedVi}${suffixQ}`
        : `${connVi} quý vị có thể vui lòng cho tôi biết ${cleanStrippedVi}${suffixQ}`;
    } else {
      const leadKnow = (viAlreadyQuestion || viHasEmbeddedWh) ? 'hỏi xem' : 'nhờ cung cấp thông tin chi tiết về';
      baseClauseVi = isInformal
        ? `${connVi} tớ muốn ${leadKnow} ${cleanStrippedVi}.`
        : `${connVi} tôi muốn ${leadKnow} ${cleanStrippedVi}.`;
    }
  } else if (isAdviceBareVerb || adviceModalMatch) {
    const voPhrase = adviceModalMatch ? adviceModalMatch[1].trim() : bareActClean;
    const viVoPhrase = bareViClean
      .replace(/^(?:nhóm\s+cậu|các\s+cậu|các\s+bạn|cậu|bạn)\s+(?:nhất\s+định\s+)?(?:nên|có\s+thể|cần|hãy)\s+/i, '')
      .replace(/^(?:hãy\s+luôn|luôn\s+hãy|luôn\s+luôn|hãy)\s+/i, '');
    const hasCompoundVerb = /\band\s+(?:try|bring|wear|visit|book|buy|take|stay|keep|avoid|make|use|pack|maintain|highlight)\b/i.test(voPhrase);

    if (/^always\s+/i.test(voPhrase)) {
      const cleanAlwaysVo = voPhrase.replace(/^always\s+/i, '');
      const cleanAlwaysVi = viVoPhrase.replace(/^(?:luôn|hãy\s+luôn|luôn\s+hãy)\s+/i, '');
      baseClauseEn = `${conn} remember to ${cleanAlwaysVo}.`;
      baseClauseVi = `${connVi} hãy nhớ luôn ${cleanAlwaysVi}.`;
    } else {
      const mode = seqIndex % 4;
      if (mode === 0) {
        if (hasCompoundVerb) {
          baseClauseEn = `${conn} I think you should ${voPhrase}.`;
          baseClauseVi = `${connVi} tớ nghĩ cậu nên ${viVoPhrase}.`;
        } else {
          baseClauseEn = `${conn} you could consider ${toGerundPhrase(voPhrase)}.`;
          baseClauseVi = `${connVi} cậu có thể cân nhắc việc ${viVoPhrase}.`;
        }
      } else if (mode === 1) {
        baseClauseEn = `${conn} it would be a good idea to ${voPhrase}.`;
        baseClauseVi = `${connVi} sẽ là một ý kiến hay nếu cậu ${viVoPhrase}.`;
      } else if (mode === 2) {
        baseClauseEn = `${conn} if I were you, I would ${voPhrase}.`;
        baseClauseVi = `${connVi} nếu tớ là cậu, tớ sẽ ${viVoPhrase}.`;
      } else {
        const isPrepVerb = /^(pack|bring|wear|carry|buy|keep|arrive|proofread|install|download|book|put)\b/i.test(voPhrase);
        if (isPrepVerb) {
          baseClauseEn = `${conn} remember to ${voPhrase}.`;
          baseClauseVi = `${connVi} hãy nhớ ${viVoPhrase}.`;
        } else {
          baseClauseEn = `${conn} you may want to ${voPhrase}.`;
          baseClauseVi = `${connVi} cậu có thể cân nhắc ${viVoPhrase}.`;
        }
      }
    }
  } else {
    // Full clause/sentence
    if (alreadyHasConnectorEn) {
      baseClauseEn = actEn.charAt(0).toUpperCase() + actEn.slice(1);
    } else {
      baseClauseEn = `${conn} ${lowerClauseUnlessProperEn(actEn)}`;
    }

    if (alreadyHasConnectorVi) {
      baseClauseVi = actVi.charAt(0).toUpperCase() + actVi.slice(1);
    } else if (actVi) {
      baseClauseVi = `${connVi} ${lowerClauseUnlessProperVi(actVi)}`;
    }
  }

  let mainSentenceEn = attachReasonClauseEn(baseClauseEn, rsnEn);
  let mainSentenceVi = attachReasonClauseVi(baseClauseVi, rsnVi, rsnEn);

  if (exp1En) {
    const cleanExtraEn = /[.?!]$/.test(exp1En) ? exp1En : exp1En + '.';
    mainSentenceEn = `${mainSentenceEn} ${cleanExtraEn}`;
  }
  if (exp1Vi) {
    const cleanExtraVi = /[.?!]$/.test(exp1Vi) ? exp1Vi : exp1Vi + '.';
    mainSentenceVi = `${mainSentenceVi} ${cleanExtraVi}`;
  }

  return {
    en: mainSentenceEn.replace(/\s+/g, ' ').trim(),
    vi: mainSentenceVi.replace(/\s+/g, ' ').trim()
  };
}

// Build non-spoiler vocabulary & structure hints (2–6 word chunks + skeletal B2 patterns, NEVER full answer sentences)
const B2_OPENING_CHUNK_HINTS = {
  advice: [
    { en: 'thanks for + V-ing (writing to sb)', vi: 'cảm ơn vì đã viết thư cho ai' },
    { en: 'lately', vi: 'dạo này, gần đây (How have you been ...?)' },
    { en: 'after + V-ing (reading your letter)', vi: 'sau khi đọc thư của cậu' },
    { en: 'have a few suggestions + (that sb may want to consider)', vi: 'có một vài gợi ý (mà ai đó có thể muốn cân nhắc)' }
  ],
  request_informal: [
    { en: 'lately', vi: 'dạo này, gần đây (How have you been ...?)' },
    { en: 'go well', vi: 'diễn ra suôn sẻ (I hope everything is ...)' },
    { en: 'write to ask for some information about + [N]', vi: 'viết thư để hỏi xin một số thông tin về... (I’m writing to ...)' }
  ],
  request_formal: [
    { en: 'request information about + [N]', vi: 'xin thông tin về... (I am writing this letter to ...)' },
    { en: 'I would appreciate it if you could + Vo', vi: 'Cấu trúc B2: Tôi rất cảm kích nếu quý vị có thể...' },
    { en: 'answer a few questions regarding + [N]', vi: 'giải đáp một vài câu hỏi liên quan đến... (this matter)' }
  ],
  description_informal: [
    { en: 'lately', vi: 'dạo này, gần đây (How have you been ...?)' },
    { en: 'go well', vi: 'diễn ra suôn sẻ (I hope everything is ...)' },
    { en: 'ask sb about + [N]', vi: 'hỏi ai về điều gì (In your letter, you ...)' },
    { en: 'would like to + Vo', vi: 'muốn làm gì (so I’d like to ...)' },
    { en: 'share some information with sb', vi: 'chia sẻ một số thông tin với ai' }
  ],
  description_formal: [
    { en: 'provide sb with a detailed description of + [N]', vi: 'cung cấp cho ai mô tả/thông tin chi tiết về... (I am writing to ...)' },
    { en: 'as requested', vi: 'theo như yêu cầu' },
    { en: 'previous correspondence', vi: 'thư từ trao đổi trước đó (in your ...)' }
  ],
  complaint: [
    { en: 'express one’s dissatisfaction with + [N]', vi: 'bày tỏ sự không hài lòng về... (I am writing to ...)' },
    { en: 'recently use / dine at + [N]', vi: 'gần đây có sử dụng / dùng bữa tại...' },
    { en: 'be quite disappointed with + [N]', vi: 'khá thất vọng với... (the experience)' }
  ],
  feedback: [
    { en: 'provide feedback on + [N]', vi: 'đóng góp ý kiến phản hồi về... (I am writing to ...)' },
    { en: 'recently use + [N]', vi: 'gần đây có sử dụng...' },
    { en: 'would like to + Vo (share one’s experience)', vi: 'muốn chia sẻ trải nghiệm của mình' }
  ],
  apology_informal: [
    { en: 'be really sorry for + (not) V-ing', vi: 'thực sự rất xin lỗi vì đã (không)...' },
    { en: 'feel terrible about what happened', vi: 'cảm thấy rất áy náy về chuyện đã xảy ra' },
    { en: 'explain the situation more clearly', vi: 'giải thích tình hình rõ ràng hơn (I’d like to ...)' }
  ],
  apology_formal: [
    { en: 'sincerely apologize for + V-ing / [N]', vi: 'chân thành xin lỗi về... (I am writing to ...)' },
    { en: 'deeply regret + [N]', vi: 'vô cùng hối tiếc / lấy làm tiếc về...' },
    { en: 'inconvenience or distress', vi: 'sự bất tiện hay phiền hà (any ... that this situation may have caused you)' }
  ],
  application: [
    { en: 'apply for the position of + [Vị trí]', vi: 'ứng tuyển vào vị trí... (I am writing to ...)' },
    { en: 'which was advertised on/in + [N]', vi: 'Mệnh đề quan hệ bị động B2: được đăng tuyển trên...' }
  ]
};

const B2_CLOSING_CHUNK_HINTS = {
  advice: [
    { en: 'find + [N] + adj (helpful)', vi: 'thấy điều gì hữu ích (I hope you find my suggestions ...)' },
    { en: 'let sb know how things go', vi: 'cho ai biết mọi chuyện diễn ra thế nào' },
    { en: 'write back soon', vi: 'hồi âm sớm nhé' }
  ],
  request_informal: [
    { en: 'hear from sb soon', vi: 'sớm nhận được tin từ ai (I hope to ...)' },
    { en: 'thank sb for + [N]', vi: 'cảm ơn ai vì điều gì (Thanks a lot for your help)' },
    { en: 'take care', vi: 'giữ gìn sức khỏe / bảo trọng nhé' }
  ],
  request_formal: [
    { en: 'thank sb in advance for + [N]', vi: 'cảm ơn trước vì... (your time and assistance)' },
    { en: 'look forward to + V-ing (receiving your response)', vi: 'rất mong nhận được phản hồi của quý vị' },
    { en: 'at one’s earliest convenience', vi: 'vào thời gian sớm nhất thuận tiện (at your ...)' }
  ],
  description_informal: [
    { en: 'give sb a clear picture of + [N]', vi: 'giúp ai hình dung rõ về... (I hope this gives you ...)' },
    { en: 'let sb know if + S + V', vi: 'cho ai biết nếu... (you want more details)' },
    { en: 'write back soon', vi: 'hồi âm sớm nhé' }
  ],
  description_formal: [
    { en: 'the above information / be useful to sb', vi: 'những thông tin trên / hữu ích đối với ai' },
    { en: 'feel free to + Vo (contact sb)', vi: 'đừng ngần ngại / vui lòng liên hệ với ai' },
    { en: 'require any further details', vi: 'cần thêm bất kỳ thông tin chi tiết nào (if you ...)' }
  ],
  complaint: [
    { en: 'resolve this issue promptly', vi: 'giải quyết vấn đề này một cách nhanh chóng (I hope you will ...)' },
    { en: 'look forward to + V-ing (receiving a prompt reply)', vi: 'rất mong nhận được phản hồi nhanh chóng' },
    { en: 'a satisfactory solution', vi: 'một hướng khắc phục / giải pháp thỏa đáng' }
  ],
  feedback: [
    { en: 'be useful in + V-ing (improving + [N])', vi: 'hữu ích trong việc nâng cao/cải thiện...' },
    { en: 'feel free to + Vo (contact sb)', vi: 'vui lòng liên hệ với ai' },
    { en: 'have any further questions', vi: 'có bất kỳ câu hỏi nào thêm (if you ...)' }
  ],
  apology_informal: [
    { en: 'once again', vi: 'một lần nữa (I’m really sorry ...)' },
    { en: 'truly appreciate + [N]', vi: 'vô cùng trân trọng... (your understanding)' },
    { en: 'write back soon', vi: 'hồi âm sớm nhé' }
  ],
  apology_formal: [
    { en: 'sincerely apologize once again for + [N]', vi: 'chân thành xin lỗi một lần nữa vì... (the inconvenience)' },
    { en: 'thank sb for + [N] (your understanding)', vi: 'cảm ơn vì sự cảm thông của Ông/Bà/Giáo sư' },
    { en: 'look forward to + V-ing (receiving your reply soon)', vi: 'rất mong sớm nhận được phản hồi' }
  ],
  application: [
    { en: 'I would be grateful if you could + Vo', vi: 'Cấu trúc B2: Tôi sẽ rất biết ơn nếu quý vị có thể... (consider my application)' },
    { en: 'be available for an interview at one’s convenience', vi: 'sẵn sàng tham gia phỏng vấn vào thời gian thuận tiện' },
    { en: 'look forward to + V-ing (hearing from sb soon)', vi: 'rất mong sớm nhận được phản hồi từ ai' }
  ]
};

const TOPIC_OPENING_KEY_CHUNKS = {
  'de-01': { en: 'upcoming trip to Hanoi', vi: 'chuyến đi sắp tới đến Hà Nội' },
  'de-02': { en: 'six-month Vietnamese course', vi: 'khóa học tiếng Việt sáu tháng' },
  'de-15': { en: 'upcoming trip to Can Tho', vi: 'chuyến đi sắp tới đến Cần Thơ' },
  'de-29': { en: 'Vietnamese course in Vietnam', vi: 'khóa học tiếng Việt tại Việt Nam' },
  'de-30': { en: 'update sb on + [N] / job interview', vi: 'cập nhật cho ai về... / buổi phỏng vấn xin việc' },
  'de-31': { en: 'summer holiday in Vietnam', vi: 'chuyến du lịch mùa hè tới Việt Nam' },
  'de-32': { en: 'group poster project', vi: 'dự án thiết kế áp phích nhóm' },
  'de-35': { en: 'new job at the local bookstore', vi: 'công việc mới tại hiệu sách địa phương' },
  'de-03': { en: 'summer cooking course', vi: 'khóa học nấu ăn mùa hè' },
  'de-04': { en: 'beginner Chinese course', vi: 'khóa học tiếng Trung sơ cấp' },
  'de-16': { en: 'English course at Rainbow Language Center', vi: 'khóa học tiếng Anh tại Trung tâm Anh ngữ Rainbow' },
  'de-17': { en: 'Chinese course at Happy Chinese Language Center', vi: 'khóa học tiếng Trung tại Trung tâm Happy Chinese' },
  'de-19': { en: 'my friend Hoa', vi: 'cô bạn Hoa của tớ' },
  'de-05': { en: 'mountain biking competition', vi: 'giải đua xe đạp địa hình' },
  'de-06': { en: 'new house near the university campus', vi: 'ngôi nhà mới gần khuôn viên trường đại học' },
  'de-18': { en: 'English course at Rainbow Language Center', vi: 'khóa học tiếng Anh tại Trung tâm Anh ngữ Rainbow' },
  'de-28': { en: 'art project on the topic “At Home”', vi: 'dự án vẽ tranh chủ đề “Ở Nhà”' },
  'de-34': { en: 'new puppy', vi: 'chú cún con mới nuôi' },
  'de-36': { en: 'upcoming outdoor activity for Grade 4 students', vi: 'hoạt động dã ngoại sắp tới cho học sinh khối 4' },
  'de-37': { en: 'lost suitcase and flight itinerary', vi: 'chiếc vali bị thất lạc và lịch trình chuyến bay' },
  'de-20': { en: 'condition of the changing rooms', vi: 'tình trạng phòng thay đồ' },
  'de-07': { en: 'broken workout equipment', vi: 'thiết bị tập luyện bị hỏng' },
  'de-08': { en: 'food quality and customer service', vi: 'chất lượng món ăn và dịch vụ khách hàng' },
  'de-21': { en: 'condition of the guest room', vi: 'tình trạng phòng nghỉ' },
  'de-09': { en: 'public bus service on Route 08', vi: 'dịch vụ xe buýt công cộng tuyến số 08' },
  'de-10': { en: 'birthday party service', vi: 'dịch vụ tổ chức tiệc sinh nhật' },
  'de-22': { en: 'recent stay at your hotel', vi: 'kỳ lưu trú vừa qua tại khách sạn' },
  'de-23': { en: 'recent dinner at your new restaurant', vi: 'bữa tối vừa qua tại nhà hàng mới' },
  'de-11': { en: 'fail to submit + [N] + on time (term research paper)', vi: 'không nộp bài tiểu luận nghiên cứu học kỳ đúng hạn' },
  'de-12': { en: 'delayed room service', vi: 'sự chậm trễ của dịch vụ ăn uống tại phòng' },
  'de-24': { en: 'return a book on time', vi: 'trả lại sách đúng hẹn' },
  'de-25': { en: 'fail to submit + [N] + before the deadline', vi: 'không nộp bài tập môn học trước thời hạn' },
  'de-33': { en: 'unsatisfactory service during one’s recent stay', vi: 'trải nghiệm dịch vụ chưa thỏa đáng trong kỳ lưu trú vừa qua' },
  'de-13': { en: 'part-time waiter / restaurant’s website', vi: 'nhân viên phục vụ bán thời gian / trang web của nhà hàng' },
  'de-14': { en: 'Event Assistant / university noticeboard', vi: 'Trợ lý Sự kiện / bảng tin trường đại học' },
  'de-26': { en: 'Sales Assistant / official website', vi: 'Nhân viên bán hàng / trang web chính thức' },
  'de-27': { en: 'Receptionist / official website', vi: 'Lễ tân / trang web chính thức' }
};

function toBaseVerbForHint(v) {
  const lower = (v || '').toLowerCase();
  const map = {
    is: 'be', are: 'be', was: 'be', were: 'be',
    has: 'have', had: 'have', does: 'do', did: 'do', goes: 'go', went: 'go',
    gets: 'get', got: 'get', makes: 'make', made: 'make', takes: 'take', took: 'take',
    gives: 'give', gave: 'give', comes: 'come', came: 'come', keeps: 'keep', kept: 'keep',
    brings: 'bring', brought: 'bring', buys: 'buy', bought: 'buy', teaches: 'teach', taught: 'teach',
    studies: 'study', studied: 'study', tries: 'try', tried: 'try', carries: 'carry', carried: 'carry',
    worries: 'worry', worried: 'worry', flies: 'fly', flew: 'fly',
    helps: 'help', works: 'work', lives: 'live', loves: 'love', enjoys: 'enjoy',
    needs: 'need', wants: 'want', likes: 'like', uses: 'use', provides: 'provide',
    offers: 'offer', includes: 'include', requires: 'require', allows: 'allow', enables: 'enable',
    causes: 'cause', creates: 'create', builds: 'build', maintains: 'maintain',
    operates: 'operate', arrives: 'arrive', leaves: 'leave', starts: 'start', ends: 'end',
    opens: 'open', closes: 'close', costs: 'cost', lasts: 'last',
    looks: 'look', seems: 'seem', feels: 'feel', smells: 'smell', tastes: 'taste', sounds: 'sound',
    reveals: 'reveal', trains: 'train', ensures: 'ensure', prevents: 'prevent', reduces: 'reduce',
    increases: 'increase', improves: 'improve', enhances: 'enhance', boosts: 'boost',
    failing: 'fail', submitting: 'submit', majoring: 'major',
    chatting: 'chat', pausing: 'pause', categorizing: 'categorize', singing: 'sing',
    participating: 'participate', molding: 'mold', walking: 'walk', living: 'live',
    studying: 'study', working: 'work', joining: 'join', practicing: 'practice',
    booking: 'book', choosing: 'choose', using: 'use', taking: 'take', wearing: 'wear',
    bringing: 'bring', packing: 'pack', visiting: 'visit', renting: 'rent', staying: 'stay',
    eating: 'eat', cooking: 'cook', shopping: 'shop', traveling: 'travel', commuting: 'commute',
    maintaining: 'maintain', building: 'build', creating: 'create', developing: 'develop'
  };
  if (map[lower]) return map[lower];
  if (/ies$/i.test(lower)) return lower.replace(/ies$/i, 'y');
  if (/(?:ches|shes|xes|zes|sses)$/i.test(lower)) return lower.replace(/es$/i, '');
  if (/s$/i.test(lower) && !/(?:ss|us|is|as|os)$/i.test(lower)) return lower.replace(/s$/i, '');
  return lower;
}

function extractCompactCollocationPair(rawEn, rawVi) {
  let en = (rawEn || '').trim().replace(/[.?!]+$/, '').trim();
  let vi = (rawVi || '').trim().replace(/[.?!]+$/, '').trim();
  if (!en) return null;

  const commaTrailEn = /,\s+(?:so|which|where|when|while|whereas|although|though|giving|allowing|enabling|making|helping|ensuring|creating|bringing|causing|leaving|forcing|resulting|meaning|saving|preventing|reducing)\b/i;
  if (commaTrailEn.test(en)) {
    en = en.split(commaTrailEn)[0].trim();
    const commaTrailVi = /,\s+(?:vì vậy|do đó|nhờ đó|nên|giúp|mang lại|tạo|đảm bảo|khiến|làm|tránh|tiết kiệm|giảm|gây|để lại|buộc|đồng nghĩa|trong khi|mặc dù|dù)/i;
    if (commaTrailVi.test(vi)) {
      vi = vi.split(commaTrailVi)[0].trim();
    }
  }

  const leadEn = [
    /^(?:First of all|Secondly|Second|Next|Besides that|On top of that|Finally|To begin with|In addition|Furthermore|Moreover|However|Therefore|As a result|Consequently|Specifically|In fact|For example|For instance|Overall|Unfortunately|Additionally|Meanwhile|Otherwise),?\s*/i,
    /^(?:Could you please|Would you mind|Could you also|I would like to|I was wondering if you could|I would appreciate it if you could|I would be grateful if you could|Please let me know|Could you|Please)\s+(?:inform me of|tell me about|let me know about|provide me with details about|clarify whether|clarify if|clarify|confirm whether|confirm if|confirm|share|explain|advise me on|let me know|tell me)\s+/i,
    /^(?:Could you please|Would you mind|Could you also|I would like to|I was wondering if you could|I would appreciate it if you could|I would be grateful if you could|Please)\s+/i,
    /^(?:ask|inquire)\s+(?:about|for|whether|if)\s+/i,
    /^(?:there\s+(?:is|are|was|were|will\s+be)\s+(?:any\s+|many\s+|plenty\s+of\s+|numerous\s+|several\s+)?)/i,
    /^(?:whether|if)\s+there\s+(?:is|are|was|were|will\s+be)\s+(?:any\s+)?/i,
    /^(?:whether|if)\s+(?:you|they|we|I|the\s+\w+|it)\s+(?:can|could|will|would|have|has|need\s+to|should|offer|provide|include)s?\s+/i,
    /^(?:This is because|Because of this,|Because|Since|As|So that)\s+/i,
    /^(?:I am writing to|I would like to|I want to|Let me)\s+(?:express my deepest apologies for|sincerely apologize for|apologize for|provide feedback on|apply for|highlight that|mention that|explain that|inform you that)\s+/i,
    /^(?:I\s+(?:fully|truly|deeply|completely|really)?\s*(?:understand|recognize|realize|believe|think|know|hope|feel|suggest|recommend|expect)\s+(?:that\s+)?)/i,
    /^(?:You|I|We|They|He|She)\s+(?:will|can|could|may|might)?\s*(?:also\s+)?(?:have|find|get|receive|gain|enjoy)\s+(?:countless|many|numerous|plenty\s+of|a\s+lot\s+of|great|good|more)\s+(?:chances|opportunities)\s+to\s+/i,
    /^(?:This|It)\s+(?:will|can|would|could|may|might)?\s*(?:also\s+)?(?:give|gives|offer|offers|provide|provides|bring|brings)\s+(?:me|you|him|her|us|them|[a-z]+\s+[a-z]+)\s+(?:a\s+chance|an\s+opportunity|the\s+chance|the\s+opportunity|enough\s+time|more\s+time)\s+to\s+/i,
    /^(?:This|It)\s+(?:will|can|would|could|may|might)?\s*(?:also\s+)?(?:help|helps|allow|allows|enable|enables)\s+(?:me|you|him|her|us|them)\s+(?:to\s+)?/i,
    /^.*?\b(?:allowing|enabling|helping|which allows|which enables|which helps|allow|allows|enable|enables|help|helps|train|trains|encourage|encourages|force|forces|require|requires)\s+(?:[a-z]+\s+){1,5}?to\s+/i,
    /^.*?\b(?:is|are|was|were)\s+(?:essential|important|crucial|vital|necessary|helpful|useful|beneficial)\s+(?:to|for)\s+/i,
    /^(?:I\s+am\s+currently\s+a\s+[a-z0-9-]+\s+student\s+)/i,
    /^(?:(?:He|She)\s+is\s+currently\s+a\s+university\s+student,\s*)/i,
    /^(?:You|I|We|They|He|She|It|Hoa|Nam|Linda|Helen|Emily|John|Jane|Ann|Alex|Moonie|Lucky|Milo)\s+(?:can|could|should|will|would|may|might|need to|have to|must|ought to|would like to|am\s+able\s+to|is\s+able\s+to|are\s+able\s+to|always|often|usually|currently|really|truly|also|easily|quickly|simply)+\s*(?:not\s+)?(?:also|easily|quickly|simply|always|often|definitely|certainly)?\s*/i,
    /^(?:You|I|We|They|He|She|It|Hoa|Nam|Linda|Helen|Emily|John|Jane|Ann|Alex|Moonie|Lucky|Milo)\s+(?:is|are|was|were)\s+(?:a\s+|an\s+)?(?:very\s+|quite\s+|extremely\s+|remarkably\s+|truly\s+)?/i,
    /^(?:You|I|We|They|He|She|Hoa|Nam|Linda|Helen|Emily|John|Jane|Ann|Alex|Moonie|Lucky|Milo)\s+(?=[a-z]{3,}\s+)/i
  ];

  const leadVi = [
    /^(?:Trước hết|Đầu tiên|Thứ hai|Tiếp theo|Bên cạnh đó|Ngoài ra|Hơn nữa|Cuối cùng|Tuy nhiên|Vì vậy|Do đó|Nhờ đó|Chính vì vậy|Cụ thể là|Thực tế là|Nhìn chung),?\s*/i,
    /^(?:Xin vui lòng|Vui lòng|Cậu có thể|Bạn có thể|Quý vị có thể|Tôi sẽ rất cảm kích nếu quý vị có thể|Tôi rất mong quý vị có thể|Tôi muốn|Tớ muốn|Em muốn)\s+(?:thông báo cho tôi về|cho tôi biết về|cho tớ biết về|cho biết thêm về|làm rõ liệu|làm rõ xem|xác nhận xem|chia sẻ|giải thích|cho tôi biết|cho tớ biết)?\s*/i,
    /^(?:hỏi xem|hỏi về|tìm hiểu xem|tìm hiểu về|có chương trình|liệu có)\s+/i,
    /^(?:Điều này là vì|Bởi vì|Vì|Do|Nhờ)\s+/i,
    /^(?:em|tôi|tớ|mình)\s+viết\s+thư\s+này\s+để\s+(?:bày tỏ lời xin lỗi sâu sắc nhất vì đã|chân thành xin lỗi vì đã|xin lỗi vì đã)\s+/i,
    /^(?:Em|Tôi|Tớ|Mình|Cô ấy|Anh ấy|Cậu|Bạn|Họ|Chúng tôi|Chúng tớ)\s+(?:hiểu sâu sắc rằng|hiểu rằng|nhận thấy rằng|tin rằng|nghĩ rằng|hy vọng rằng)\s+/i,
    /^(?:Bạn|Cậu|Tôi|Tớ|Em|Chúng ta|Họ)\s+(?:sẽ|có thể|cũng sẽ)?\s*có\s+(?:vô số|nhiều|rất nhiều|thêm)\s+cơ\s+hội\s+(?:để\s+)?/i,
    /^(?:Điều này|Việc này)\s+(?:sẽ\s+|cũng\s+sẽ\s+)?(?:cho|mang\s+lại\s+cho|giúp)\s+(?:cô\s+ấy|anh\s+ấy|bạn|cậu|tôi|tớ|em|chúng\s+tôi|họ)\s+(?:có\s+)?(?:cơ\s+hội|đủ\s+thời\s+gian|thêm\s+thời\s+gian)\s+(?:để\s+)?/i,
    /^(?:Điều này|Việc này)\s+(?:sẽ\s+)?(?:giúp|cho\s+phép)\s+(?:các\s+thành\s+viên\s+khác(?:\s+trong\s+gia\s+đình)?|bạn|cậu|tôi|tớ|em|mọi\s+người|khách\s+hàng|hành\s+khách|sinh\s+viên)\s+/i,
    /^.*?\b(?:giúp|cho phép|tạo điều kiện cho|rèn luyện)\s+(?:những\s+|đôi\s+tai\s+của\s+)?(?:hành khách|sinh viên|học viên|học sinh|thực khách|khách hàng|người học|mọi người|dân công sở|tôi|tớ|em|bạn|cậu|chúng tôi)(?:\s+và\s+(?:học sinh|sinh viên|du khách))?(?:\s+đi lại hàng ngày)?(?:\s+như\s+(?:tôi|tớ|em))?\s+(?:có thể\s+)?/i,
    /^.*?\b(?:là\s+điều\s+cốt\s+yếu|là\s+rất\s+quan\s+trọng|là\s+cần\s+thiết)\s+để\s+/i,
    /^(?:hiện\s+tại\s+|hiện\s+)?(?:cô\s+ấy|anh\s+ấy|tôi|tớ|em)\s+(?:đang\s+)?là\s+sinh\s+viên\s+(?:đại\s+học,?\s*|năm\s+(?:thứ\s+)?(?:nhất|hai|ba|tư|cuối)\s*)/i,
    /^(?:Hoa|Nam|Cô ấy|Anh ấy|Nó)\s+là\s+(?:một\s+người\s+)?(?:rất\s+|khá\s+)?/i,
    /^(?:Cô ấy|Anh ấy|Cậu|Bạn|Tôi|Tớ|Em|Họ|Chúng ta|Nó|Hoa|Nam)\s+(?:luôn|thường|cũng|có thể|nên|cần|phải|sẽ|đã|đang)?\s*(?:dễ dàng|nhanh chóng|luôn|thường)?\s*/i
  ];

  for (let pass = 0; pass < 4; pass++) {
    for (const p of leadEn) en = en.replace(p, '').trim();
    for (const p of leadVi) vi = vi.replace(p, '').trim();
  }

  const gerundPredEn = en.match(/^([A-Z][a-z]+ing\s+.+?)\s+(makes|helps|brings|creates|reveals|ensures|prevents|reduces|improves|enhances|boosts|builds|gives|offers|provides|requires|causes|is|are)\s+(.+)$/);
  if (gerundPredEn) {
    const verbPart = toBaseVerbForHint(gerundPredEn[2]);
    const objPart = gerundPredEn[3].trim();
    en = `${verbPart} ${objPart}`;
    const viPredMatch = vi.match(/^.+?\s+(giúp|mang lại|tạo nên|tạo ra|hé lộ|đảm bảo|ngăn ngừa|giảm thiểu|cải thiện|nâng cao|xây dựng|cung cấp|đòi hỏi|gây ra)\s+(.+)$/i);
    if (viPredMatch) {
      vi = `${viPredMatch[1]} ${viPredMatch[2]}`.trim();
    }
  }

  const compoundVpEn = /\s+and\s+(?:practice|find|try|enjoy|visit|explore|learn|meet|make|keep|save|avoid|get|have|use|take|join|participate|experiment|speak|listen|write|read|ask|check|request|prepare|bring|pack|wear|buy|book)\s+/i;
  if (en.split(/\s+/).length > 6 && compoundVpEn.test(en)) {
    const firstHalfEn = en.split(compoundVpEn)[0].trim();
    if (firstHalfEn.split(/\s+/).length >= 2) {
      en = firstHalfEn;
      if (/\s+và\s+/i.test(vi)) {
        const firstHalfVi = vi.split(/\s+và\s+/i)[0].trim();
        if (firstHalfVi.split(/\s+/).length >= 2) vi = firstHalfVi;
      }
    }
  }

  const passiveMatch = en.match(/^(?:[A-Za-z0-9-]+\s+){1,5}?(?:is|are|was|were|has\s+been|have\s+been)\s+(.+)$/i);
  if (passiveMatch && passiveMatch[1].split(/\s+/).length >= 2) {
    const comp = passiveMatch[1].trim();
    en = /^(?:a|an|the)\s+/i.test(comp) ? comp : 'be ' + comp;
  }

  const subjVerbMatch = en.match(/^(?:The|My|Our|His|Her|Your|This|These|Campus|Local|Public|Daily|Regular|Frequent)\s+(?:[a-z0-9-]+\s+){1,4}?(operate|operates|run|runs|work|works|provide|provides|offer|offers|create|creates|cause|causes|make|makes|help|helps|allow|allows|require|requires|lack|lacks|smell|smells|look|looks|sound|sounds|taste|tastes|cost|costs|last|lasts)\s+(.+)$/i);
  if (subjVerbMatch) {
    en = toBaseVerbForHint(subjVerbMatch[1]) + ' ' + subjVerbMatch[2].trim();
  }

  const firstWordMatch = en.match(/^([A-Za-z]+)\s+(.+)$/);
  if (firstWordMatch) {
    const w1 = firstWordMatch[1];
    const rest = firstWordMatch[2];
    if (/^(?:gets|makes|takes|gives|keeps|brings|helps|works|lives|loves|enjoys|needs|wants|uses|provides|offers|includes|requires|causes|creates|builds|maintains|operates|arrives|leaves|starts|ends|opens|closes|costs|lasts|looks|seems|feels|smells|tastes|sounds|knows|treats|fits|failing|submitting|majoring|maintaining)$/i.test(w1)) {
      en = toBaseVerbForHint(w1) + ' ' + rest;
    }
  }

  en = en.replace(/\s+(?:while|when|before|after|because|since|so\s+that|which|where|during|throughout|according\s+to|in\s+order\s+to)\s+.+$/i, '').trim();
  vi = vi.replace(/\s+(?:trong\s+khi|khi\s+mà|trước\s+khi|sau\s+khi|bởi\s+vì|vì\s+(?:cô|anh|nó|họ|tôi|tớ|em|bạn|cậu)|nhằm\s+để|theo\s+lịch\s+trình|mà\s+không\s+bị)\s+.+$/i, '').trim();

  if (en.split(/\s+/).length > 5 && /\s+such\s+as\s+/i.test(en)) {
    en = en.split(/\s+such\s+as\s+/i)[0].trim();
    if (/\s+như\s+/i.test(vi)) {
      vi = vi.split(/\s+như\s+/i)[0].trim();
    }
  }

  if (en.split(/\s+/).length > 7) {
    const finiteVerbRegex = /^(?:[A-Za-z0-9,-]+\s+){1,6}?\b(made|make|makes|had|have|has|felt|feel|feels|left|leave|leaves|forced|force|forces|caused|cause|causes|corrupted|corrupt|corrupts|ruined|ruin|ruins|sets|set|boasts|boast|verify|verifies|informs|inform|brake|brakes|answered|answer|gave|give|gives|upgrade|upgrades|solve|solves|would\s+solve|can\s+explain|will\s+help|helps|help|allow|allows|enable|enables|encourage|encourages|provide|provides|offer|offers|serve|serves|function|functions|operate|operates|smelled|smell|smells|looked|look|looks|was|were|is|are)\s+(.+)$/i;
    const fvMatch = en.match(finiteVerbRegex);
    if (fvMatch && fvMatch[2].split(/\s+/).length >= 2) {
      const vRaw = fvMatch[1].replace(/^(?:would|can|will)\s+/i, '');
      const vBase = toBaseVerbForHint(vRaw);
      const tail = fvMatch[2].trim();
      en = vBase === 'be' ? (/^(?:a|an|the)\s+/i.test(tail) ? tail : `be ${tail}`) : `${vBase} ${tail}`;
    }
  }

  if (en.split(/\s+/).length > 7 && /\s+and\s+/i.test(en)) {
    const parts = en.split(/\s+and\s+/i);
    if (parts[0].trim().split(/\s+/).length >= 3 && !/^[a-z]+\s+[a-z]+s\b/i.test(parts[1].trim())) {
      en = parts[0].trim().replace(/,+$/, '');
      if (/\s+và\s+/i.test(vi)) {
        const vParts = vi.split(/\s+và\s+/i);
        if (vParts[0].trim().split(/\s+/).length >= 2) vi = vParts[0].trim();
      }
    }
  }

  if (en.split(/\s+/).length > 6) {
    const strippedPrepEn = en.replace(/^((?:[A-Za-z0-9,-]+\s+){2,6}?)(?:near|at|in\s+(?:the|a|an|my|your|our|their|his|her|this|these|[A-Z])|on|with|for|from|as\s+part\s+of|during|throughout|around|across|against|between|among|under|over|through|without|within|along|alongside|inside|like|such\s+as|including|beside|behind|beyond|by|every\s+day|every|several|this\s+summer|right\s+on)\s+.+$/i, '$1').trim();
    if (strippedPrepEn.split(/\s+/).length >= 2 && strippedPrepEn.split(/\s+/).length <= 7) {
      en = strippedPrepEn;
      const strippedPrepVi = vi.replace(/^((?:[^\s]+\s+){2,7}?)(?:gần|tại|ở|trong|trên|với|cùng|cho|từ|như\s+một\s+phần|suốt|quanh|khắp|giữa|dưới|qua|theo|mỗi\s+ngày|hằng\s+ngày|hàng\s+ngày|ngay\s+trước|khi\s+đăng\s+ký|của\s+khóa\s+học)\s+.+$/i, '$1').trim();
      if (strippedPrepVi.split(/\s+/).length >= 2) {
        vi = strippedPrepVi;
      }
    }
  }

  if (en.split(/\s+/).length > 7) {
    en = en.split(/\s+/).slice(0, 7).join(' ');
  }
  while (/\s+(?:the|a|an|to|of|in|on|at|for|with|and|or|by|from|both|either|whether|if|that|which|who|my|your|our|their|his|her|its|very|quite|too|so|more|most|this|these|those|be|is|are|was|were|such|as)$/i.test(en)) {
    en = en.replace(/\s+(?:the|a|an|to|of|in|on|at|for|with|and|or|by|from|both|either|whether|if|that|which|who|my|your|our|their|his|her|its|very|quite|too|so|more|most|this|these|those|be|is|are|was|were|such|as)$/i, '').trim();
  }
  en = en.replace(/[,;]+$/, '').trim();

  return { en, vi };
}

function getBodySentencePatternHint(topic, sentenceEn) {
  const s = (sentenceEn || '').trim();
  if (/^To begin with,\s+you could consider\s+/i.test(s)) {
    return { en: 'To begin with, you could consider + V-ing ... because + [Mệnh đề].', vi: 'Khung cấu trúc B2 mở ý khuyên thứ nhất kèm lý do' };
  }
  if (/^To begin with,\s+I think you should\s+/i.test(s)) {
    return { en: 'To begin with, I think you should + Vo ... because + [Mệnh đề].', vi: 'Khung cấu trúc B2 mở ý khuyên thứ nhất kèm lý do' };
  }
  if (/^Second,\s+it would be a good idea to\s+/i.test(s)) {
    return { en: 'Second, it would be a good idea to + Vo ...', vi: 'Khung cấu trúc B2 nêu lời khuyên thứ hai' };
  }
  if (/^Next,\s+if I were you,\s+I would\s+/i.test(s)) {
    return { en: 'Next, if I were you, I would + Vo ...', vi: 'Khung cấu trúc câu điều kiện loại 2 khuyên nhủ chuẩn B2' };
  }
  if (/^(?:Finally|Next|Second|To begin with),\s+remember to\s+/i.test(s)) {
    const conn = s.split(',')[0];
    return { en: `${conn}, remember to + Vo ...`, vi: 'Khung cấu trúc B2 nhắc nhở thực hiện lời khuyên' };
  }
  if (/^Finally,\s+you may want to\s+/i.test(s)) {
    return { en: 'Finally, you may want to + Vo ...', vi: 'Khung cấu trúc B2 chốt lời khuyên cuối cùng' };
  }
  if (/^To begin with,\s+could you please let me know/i.test(s)) {
    return { en: 'To begin with, could you please let me know + (more about [N] / Wh- + S + V)?', vi: 'Khung câu hỏi gián tiếp lịch sự mở đầu thân thư B2' };
  }
  if (/^In addition,\s+I was wondering if you could provide me with details about/i.test(s)) {
    return { en: 'In addition, I was wondering if you could provide me with details about + [N].', vi: 'Khung cấu trúc B2 hỏi xin thông tin chi tiết thứ hai' };
  }
  if (/^In addition,\s+I would like to ask/i.test(s)) {
    return { en: 'In addition, I would like to ask + (whether/if / Wh- + S + V).', vi: 'Khung cấu trúc B2 đặt câu hỏi gián tiếp thứ hai' };
  }
  if (/^(?:Furthermore|Finally),\s+could you also tell me/i.test(s)) {
    const conn = s.split(',')[0];
    return { en: `${conn}, could you also tell me + (about [N] / Wh- + S + V)?`, vi: 'Khung cấu trúc B2 hỏi thêm thông tin' };
  }
  if (/^(?:Furthermore|Finally),\s+would you mind letting me know/i.test(s)) {
    const conn = s.split(',')[0];
    return { en: `${conn}, would you mind letting me know + (more about [N] / Wh- + S + V)?`, vi: 'Khung cấu trúc B2 hỏi thông tin lịch sự' };
  }
  if (/^Finally,\s+I would also be grateful if you could clarify/i.test(s)) {
    return { en: 'Finally, I would also be grateful if you could clarify + (whether/if / [N]).', vi: 'Khung cấu trúc trang trọng B2 chốt câu hỏi cuối thân thư' };
  }
  if (/^The main issue that I would like to highlight is that/i.test(s)) {
    return { en: 'The main issue that I would like to highlight is that + [Mệnh đề]. Specifically, ...', vi: 'Khung cấu trúc B2 nhấn mạnh sự cố chính và tác động cụ thể' };
  }
  if (/^Furthermore,\s+to make matters worse,/i.test(s)) {
    return { en: 'Furthermore, to make matters worse, + [Mệnh đề]. In fact, ...', vi: 'Khung cấu trúc B2 bổ sung sự cố thứ hai nghiêm trọng hơn' };
  }
  if (/Given these circumstances,\s+I expect you to/i.test(s)) {
    return { en: 'Given these circumstances, ... I expect you to + Vo.', vi: 'Khung cấu trúc B2 yêu cầu đơn vị cung cấp giải quyết thỏa đáng' };
  }
  if (/^Overall,\s+I found your/i.test(s)) {
    return { en: 'Overall, I found your + [dịch vụ] + quite satisfactory. One aspect I appreciated was that + [Mệnh đề].', vi: 'Khung cấu trúc B2 đánh giá tích cực mở đầu thư phản hồi' };
  }
  if (/^Moreover,\s+another positive point was that/i.test(s)) {
    return { en: 'Moreover, another positive point was that + [Mệnh đề].', vi: 'Khung cấu trúc B2 bổ sung điểm cộng thứ hai' };
  }
  if (/^However,\s+there were also several areas that required improvement\./i.test(s)) {
    return { en: 'However, there were also several areas that required improvement. One issue that I encountered was that ... To enhance the quality of ..., I suggest that you + Vo.', vi: 'Khung cấu trúc B2 chuyển ý nêu điểm hạn chế và đề xuất cải thiện' };
  }
  if (/^First of all,\s+here is the reason for this\./i.test(s)) {
    return { en: 'First of all, here is the reason for this. Unfortunately, + [Mệnh đề] + because ...', vi: 'Khung cấu trúc B2 trình bày nguyên nhân sự việc trong thư xin lỗi' };
  }
  if (/Let me make it up to you by/i.test(s)) {
    return { en: 'Let me make it up to you by + V-ing ..., and I’ll make sure this does not happen again.', vi: 'Khung cấu trúc B2 đề xuất hướng bù đắp trong thư xin lỗi thân mật' };
  }
  if (/To make up for this inconvenience,\s+I would like to/i.test(s)) {
    return { en: 'To make up for this inconvenience, I would like to + Vo ...', vi: 'Khung cấu trúc B2 đề xuất hướng khắc phục trong thư xin lỗi trang trọng' };
  }
  if (/^I am particularly interested in this position because/i.test(s)) {
    return { en: 'I am particularly interested in this position because + [Mệnh đề].', vi: 'Khung cấu trúc B2 nêu lý do ứng tuyển' };
  }
  if (/^Regarding my previous experience,/i.test(s)) {
    return { en: 'Regarding my previous experience, + [Mệnh đề kinh nghiệm/chuyên môn].', vi: 'Khung cấu trúc B2 trình bày kinh nghiệm và nền tảng chuyên môn' };
  }
  if (/^Moreover,\s+I believe I would be a suitable candidate for this position because/i.test(s)) {
    return { en: 'Moreover, I believe I would be a suitable candidate for this position because + [Mệnh đề].', vi: 'Khung cấu trúc B2 khẳng định sự phù hợp với vị trí ứng tuyển' };
  }

  const connMatch = s.match(/^(To begin with|First of all|In addition|Furthermore|Moreover|Finally|Secondly|Second|Next|Besides that|On top of that|However|Additionally),/i);
  const conn = connMatch ? connMatch[1] : 'To begin with';
  if (/\.\s+Therefore,/i.test(s)) {
    return { en: `${conn}, + [Mệnh đề chính]. Therefore, + [Mệnh đề hệ quả].`, vi: 'Khung từ nối mở ý và nêu hệ quả chuẩn B2' };
  }
  if (/\.\s+This is because\b/i.test(s)) {
    return { en: `${conn}, + [Mệnh đề chính]. This is because + [Mệnh đề lý do].`, vi: 'Khung từ nối mở ý và giải thích lý do chuẩn B2' };
  }
  return { en: `${conn}, + [Mệnh đề chính] + because + [Lý do / Chi tiết mở rộng].`, vi: 'Khung từ nối chuyển ý và mở rộng câu chuẩn B2' };
}

function buildBodyItemVocabAndStructureHints(topic, opt, pairEn, pairVi) {
  const hints = [];
  const seenEn = new Set();

  const pushUniqueHint = (enVal, viVal) => {
    const cleanEn = (enVal || '').trim();
    const cleanVi = (viVal || '').trim();
    if (!cleanEn || !cleanVi) return;
    if (cleanEn.toLowerCase() === (pairEn || '').trim().toLowerCase()) return;
    const key = cleanEn.toLowerCase();
    if (seenEn.has(key)) return;
    const isSubOrSuper = [...seenEn].some(existing => existing.includes(key) || key.includes(existing));
    if (isSubOrSuper && hints.length > 1) return;
    seenEn.add(key);
    hints.push({ en: cleanEn, vi: cleanVi });
  };

  // 1. Skeletal B2 connector & sentence-starter pattern
  const patternHint = getBodySentencePatternHint(topic, pairEn);
  pushUniqueHint(patternHint.en, patternHint.vi);

  // 2. Match relevant short collocations from topic.details.vocab
  const topicVocab = topic?.details?.vocab || [];
  const lowerSentEn = (pairEn || '').toLowerCase();
  const lowerSentVi = (pairVi || '').toLowerCase();
  topicVocab.forEach(v => {
    if (!v || !v.en || !v.vi) return;
    const vEnLower = v.en.toLowerCase().trim();
    const vViLower = v.vi.toLowerCase().trim();
    const significantWords = vEnLower.split(/\s+/).filter(w => w.length > 3 && !['with', 'from', 'that', 'this', 'your', 'have', 'been'].includes(w));
    const directMatch = lowerSentEn.includes(vEnLower) || (vViLower.length > 4 && lowerSentVi.includes(vViLower));
    const keywordMatch = significantWords.length >= 2 && significantWords.every(w => lowerSentEn.includes(w.replace(/s$/, '')));
    if (directMatch || keywordMatch) {
      pushUniqueHint(v.en, v.vi);
    }
  });

  // 3. Extract compact 2–6 word collocation chunks from opt's 3 parts
  const rawPairs = [
    [opt.action_en || opt.problem_en, opt.action_vi || opt.problem_vi],
    [opt.reason_en || opt.impact_en, opt.reason_vi || opt.impact_vi],
    [opt.expansion_1_en || opt.solution_en, opt.expansion_1_vi || opt.solution_vi]
  ];
  rawPairs.forEach(([rEn, rVi]) => {
    if (!rEn) return;
    const compact = extractCompactCollocationPair(rEn, rVi);
    if (compact && compact.en && compact.vi) {
      pushUniqueHint(compact.en, compact.vi);
    }
  });

  return {
    patternHint,
    hints: hints.slice(0, 6)
  };
}

// Build complete 5-part B2 writing frame (Salutation, Opening, Body items, Closing, Sign-off) for any topic
function buildTopicB2FivePartFrame(topic) {
  if (!topic) return null;
  ensureDefaultIdeasSelected(topic);

  const catKey = topic.category_id || 'advice';
  const regText = topic.recipient_type || topic.details?.analysis?.letter_type || '';
  const isInformal = /informal|thân mật|bạn bè/i.test(regText);
  const isSemiFormal = /semi-formal|bán trang trọng/i.test(regText);
  const isFormal = !isInformal;

  let hintBucketKey = catKey;
  if (catKey === 'request') hintBucketKey = isInformal ? 'request_informal' : 'request_formal';
  else if (catKey === 'description') hintBucketKey = isInformal ? 'description_informal' : 'description_formal';
  else if (catKey === 'apology') hintBucketKey = isInformal ? 'apology_informal' : 'apology_formal';

  const formulaHints = B2_CATEGORY_FORMULA_HINTS[hintBucketKey] || B2_CATEGORY_FORMULA_HINTS.advice;
  const preset = TOPIC_B2_OUTLINE_FRAMES[topic.id];

  const salutationEn = preset?.salutationEn || (isSemiFormal ? 'Dear Mr./Ms.,' : (isFormal ? 'Dear Sir/Madam,' : 'Dear Friend,'));
  const salutationVi = preset?.salutationVi || (isFormal ? 'Kính gửi Quý Ông/Bà,' : 'Bạn thân mến,');
  const openingEn = preset?.openingEn || formulaHints.openingFormula;
  const openingVi = preset?.openingVi || 'Mở thư theo đúng cấu trúc dàn ý chuẩn B2.';
  const closingEn = preset?.closingEn || formulaHints.closingFormula;
  const closingVi = preset?.closingVi || 'Kết thư theo đúng cấu trúc dàn ý chuẩn B2.';
  const signoffEn = preset?.signoffEn || (isSemiFormal ? 'Yours sincerely,' : (isFormal ? 'Yours faithfully,' : 'Best wishes,'));
  const signoffVi = preset?.signoffVi || (isFormal ? 'Trân trọng,' : 'Chúc những điều tốt đẹp nhất,');

  const salutationFormulaEn = isInformal
    ? 'Dear + [Tên người nhận],'
    : (/^Dear\s+Sir\/Madam/i.test(salutationEn)
      ? 'Dear + [Sir/Madam],'
      : 'Dear + [Mr. / Ms. / Mrs. / Professor + Tên/Họ],');

  const signoffFormulaEn = isInformal
    ? 'Best wishes, / Warm regards,'
    : (/^Dear\s+Sir\/Madam/i.test(salutationEn)
      ? 'Yours faithfully, (dùng khi chào Dear Sir/Madam,)'
      : 'Yours sincerely, (dùng khi chào tên riêng Dear Mr./Ms./Professor...,)');

  const openingHints = [...(B2_OPENING_CHUNK_HINTS[hintBucketKey] || B2_OPENING_CHUNK_HINTS.advice)];
  if (TOPIC_OPENING_KEY_CHUNKS[topic.id]) {
    openingHints.push(TOPIC_OPENING_KEY_CHUNKS[topic.id]);
  }
  const closingHints = [...(B2_CLOSING_CHUNK_HINTS[hintBucketKey] || B2_CLOSING_CHUNK_HINTS.advice)];

  const suggestedIdeas = topic.details?.suggested_ideas || [];
  const topicSel = state.selectedIdeasByTopic[topic.id] || {};
  const selectedRawList = [];

  suggestedIdeas.forEach((group, gIdx) => {
    const selArr = Array.isArray(topicSel[gIdx]) ? topicSel[gIdx] : [];
    selArr.forEach(optIdx => {
      const opt = (group.options || [])[optIdx];
      if (opt) selectedRawList.push({ group, gIdx, opt });
    });
  });

  const totalSelected = selectedRawList.length;
  const bodyItems = selectedRawList.map((entry, seqIdx) => {
    const pair = buildB2IdeaSentencePair(topic, entry.group, entry.opt, seqIdx, totalSelected, entry.gIdx);
    const builtHints = buildBodyItemVocabAndStructureHints(topic, entry.opt, pair.en, pair.vi);

    return {
      seqIdx,
      gIdx: entry.gIdx,
      reqTitle: entry.group.title_vi || entry.group.title_en || `Yêu cầu ${entry.gIdx + 1}`,
      en: pair.en,
      vi: pair.vi,
      patternHint: builtHints.patternHint,
      hints: builtHints.hints
    };
  });

  return {
    salutationEn,
    salutationVi,
    salutationFormulaEn,
    openingEn,
    openingVi,
    openingHints,
    closingEn,
    closingVi,
    closingHints,
    signoffEn,
    signoffVi,
    signoffFormulaEn,
    formulaHints,
    bodyItems
  };
}

function resolveOutlineText(rawVal, isFormal, isSemiFormal) {
  if (!rawVal) return '';
  if (typeof rawVal === 'string') return rawVal;
  if (typeof rawVal === 'object') {
    if (rawVal.request_action && rawVal.await_reply) {
      return `${rawVal.request_action} ${rawVal.await_reply}`;
    }
    if (isSemiFormal) {
      return rawVal.semi_formal || rawVal.formal || rawVal.formal_unknown || rawVal.info_formal || rawVal.describe_formal || '';
    }
    if (isFormal) {
      return rawVal.formal || rawVal.formal_unknown || rawVal.info_formal || rawVal.describe_formal || rawVal.semi_formal || '';
    }
    return rawVal.informal || rawVal.info_informal || rawVal.describe_informal || Object.values(rawVal).find(v => typeof v === 'string') || '';
  }
  return '';
}

function getOutlineHtmlForTopic(topic) {
  const catKey = topic?.category_id || CATEGORY_META[state.currentCategory]?.key || 'advice';
  const catTheory = (typeof B2_CATEGORY_THEORY !== 'undefined' && B2_CATEGORY_THEORY[catKey]) ? B2_CATEGORY_THEORY[catKey] : null;
  const catData = getCategoryData(topic?.catNum || state.currentCategory);
  const mo = catData?.master_outline || {};
  const topicOutline = topic?.details?.outline || {};

  const regText = topic?.details?.analysis?.letter_type || topic?.recipient_type || '';
  const isSemiFormal = /semi-formal|bán trang trọng/i.test(regText);
  const isFormal = (/formal/i.test(regText) && !/informal/i.test(regText)) || isSemiFormal;

  // Also check sample_b2 salutation & sign-off so every topic shows the exact salutation if available
  const sampleEn = topic?.details?.sample_b2?.letter_en || topic?.sample_b2?.text || '';
  const sampleParas = sampleEn.replace(/\*\*\*|\*\*_/g, '').replace(/_\*\*/g, '').split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
  const sampleSalutation = (sampleParas[0] && /^Dear\b/i.test(sampleParas[0])) ? sampleParas[0] : '';
  const sampleSignoff = (sampleParas.length >= 3 && sampleParas[sampleParas.length - 1].length < 40) ? sampleParas[sampleParas.length - 1] : '';

  const salutationText = resolveOutlineText(topicOutline.salutation, isFormal, isSemiFormal)
    || sampleSalutation
    || resolveOutlineText(mo.step1_salutation, isFormal, isSemiFormal)
    || (isFormal ? 'Dear Sir or Madam, / Dear Mr./Ms. [Họ],' : 'Dear [Tên bạn],');

  const openingText = resolveOutlineText(topicOutline.opening, isFormal, isSemiFormal)
    || resolveOutlineText(mo.step2_opening, isFormal, isSemiFormal)
    || (isFormal
      ? 'I am writing this letter regarding... / I am writing to formally...'
      : 'Thanks for your letter. How have you been lately? I am writing to...');

  const closingText = resolveOutlineText(topicOutline.closing, isFormal, isSemiFormal)
    || resolveOutlineText(mo.step4_closing, isFormal, isSemiFormal)
    || (isFormal
      ? 'Thank you very much for your time and consideration. I look forward to hearing from you soon.'
      : 'I hope you find my thoughts helpful. Let me know how things go, and write back soon!');

  const signoffText = resolveOutlineText(topicOutline.sign_off || topicOutline.signoff, isFormal, isSemiFormal)
    || sampleSignoff
    || resolveOutlineText(mo.step5_signoff, isFormal, isSemiFormal)
    || (isFormal
      ? 'Yours faithfully, (nếu chào Dear Sir/Madam) / Yours sincerely, (nếu chào tên riêng)'
      : 'Best wishes, / Warm regards,');

  const connectorsHint = catTheory?.connectors_hint || mo.step3_body?.connectors || (isFormal
    ? 'To begin with, … → In addition, … → Furthermore, … → Finally, …'
    : 'First of all, … → Secondly, … → Besides that, … → Finally, …');

  const powerStructures = Array.isArray(catTheory?.b2_power_structures) ? catTheory.b2_power_structures : [];
  const powerGridHtml = powerStructures.length > 0 ? `
    <div style="margin-top: 0.85rem;">
      <div style="font-weight: 700; font-size: 0.88rem; color: var(--accent-primary); margin-bottom: 0.45rem;">
        ✨ BỘ CẤU TRÚC CÂU "ĂN ĐIỂM" BAND B2 ĐẶC TRƯNG (${escapeHtml(catTheory.title_vi || '')}):
      </div>
      <div class="b2-power-grid">
        ${powerStructures.map(ps => `
          <div class="b2-power-item">
            <div class="b2-power-pattern no-uppercase">🔹 ${escapeHtml(ps.pattern)}</div>
            <div style="color: var(--text-secondary); font-size: 0.84rem; margin-top: 0.2rem;">🇻🇳 ${escapeHtml(ps.meaning)}</div>
            ${ps.example ? `<div style="color: var(--text-primary); font-size: 0.84rem; margin-top: 0.25rem; font-style: italic;">💡 VD: "${escapeHtml(ps.example)}"</div>` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  ` : '';

  return `
    <div class="b2-five-step-list">
      <div class="b2-step-row step-1">
        <div class="b2-step-head">
          <span class="b2-step-badge">PHẦN 1</span>
          <span>LỜI CHÀO MỞ ĐẦU (SALUTATION)</span>
        </div>
        <div class="b2-step-formula">
          Mẫu áp dụng cho đề này: <code>${escapeHtml(salutationText)}</code>
          <span style="color: var(--text-secondary); font-size: 0.86rem;"> — Luôn có dấu phẩy (<code>,</code>) cuối dòng lời chào và xuống dòng cách 1 dòng trống.</span>
        </div>
      </div>

      <div class="b2-step-row step-2">
        <div class="b2-step-head">
          <span class="b2-step-badge" style="background: #0ea5e9;">PHẦN 2</span>
          <span>MỞ THƯ (OPENING — HỎI THĂM &amp; NÊU RÕ MỤC ĐÍCH VIẾT THƯ)</span>
        </div>
        <div class="b2-step-formula">
          <code>${escapeHtml(openingText)}</code>
        </div>
      </div>

      <div class="b2-step-row step-3">
        <div class="b2-step-head">
          <span class="b2-step-badge" style="background: #8b5cf6;">PHẦN 3</span>
          <span>THÂN THƯ (BODY PARAGRAPHS — GIẢI QUYẾT ĐẦY ĐỦ CÁC YÊU CẦU TRONG ĐỀ)</span>
        </div>
        <div class="b2-step-formula">
          Trả lời lần lượt từng yêu cầu của đề bài (từ 2 – 3 đoạn thân thư rõ ràng). Mỗi ý cần tuân thủ công thức chuẩn B2: <strong>Ý chính (Action/Point) + Giải thích lý do/tác động (Reason/Impact) + Câu mở rộng chi tiết (Expansion/Solution)</strong>.
        </div>
        <div class="b2-connector-bar">
          <strong>🔗 Chuỗi từ nối chuyển ý mạch lạc chuẩn B2:</strong> ${escapeHtml(connectorsHint)}
        </div>
        ${powerGridHtml}
      </div>

      <div class="b2-step-row step-4">
        <div class="b2-step-head">
          <span class="b2-step-badge" style="background: #f59e0b;">PHẦN 4</span>
          <span>KẾT THƯ (CLOSING SENTENCE)</span>
        </div>
        <div class="b2-step-formula">
          <code>${escapeHtml(closingText)}</code>
        </div>
      </div>

      <div class="b2-step-row step-5">
        <div class="b2-step-head">
          <span class="b2-step-badge" style="background: #10b981;">PHẦN 5</span>
          <span>LỜI CHÀO KẾT THÚC (SIGN-OFF — LƯU Ý QUY TẮC PHÒNG THI)</span>
        </div>
        <div class="b2-step-formula">
          <code>${escapeHtml(signoffText)}</code>
          <span style="color: var(--danger); font-weight: 700; font-size: 0.86rem;"> — ⚠️ Tuyệt đối KHÔNG viết tên thật hoặc địa chỉ cá nhân bên dưới để tránh vi phạm quy chế đánh dấu bài thi VSTEP!</span>
        </div>
      </div>
    </div>
  `;
}

function renderStep1Reading() {
  const container = document.getElementById('ws-step1-reading-content');
  const topic = state.activeTopic;
  if (!container || !topic) return;

  ensureDefaultIdeasSelected(topic);
  const details = topic.details || {};
  const analysis = details.analysis || {};
  const suggestedIdeas = details.suggested_ideas || [];
  const vocabList = details.vocab || [];
  const topicSel = state.selectedIdeasByTopic[topic.id] || {};
  const isMultiGroupTopic = suggestedIdeas.length > 4;
  const b2Frame = buildTopicB2FivePartFrame(topic);

  // Group vocabulary by category
  const vocabByGroup = {};
  vocabList.forEach(v => {
    const g = v.category || 'Từ vựng & Cụm từ trọng tâm B2 theo chủ đề';
    if (!vocabByGroup[g]) vocabByGroup[g] = [];
    vocabByGroup[g].push(v);
  });

  // Build Interactive Idea Selection HTML + Complete 5-Part B2 Writing Suggestion Frame
  let ideaSelectorHtml = '';
  if (suggestedIdeas.length > 0 && b2Frame) {
    const groupsHtml = suggestedIdeas.map((group, gIdx) => {
      const selArr = Array.isArray(topicSel[gIdx]) ? topicSel[gIdx] : [];
      const optionsHtml = (group.options || []).map((opt, optIdx) => {
        const isSelected = selArr.includes(optIdx);
        const actEn = opt.action_en || opt.problem_en || '';
        const actVi = opt.action_vi || opt.problem_vi || '';
        const rsnEn = opt.reason_en || opt.impact_en || '';
        const rsnVi = opt.reason_vi || opt.impact_vi || '';
        const expEn = opt.expansion_1_en || opt.solution_en || '';
        const expVi = opt.expansion_1_vi || opt.solution_vi || '';

        const shortKwList = [
          extractCompactCollocationPair(actEn, actVi)?.en,
          extractCompactCollocationPair(rsnEn, rsnVi)?.en,
          extractCompactCollocationPair(expEn, expVi)?.en
        ].filter(Boolean);

        return `
          <div class="idea-checkbox-card ${isSelected ? 'is-selected' : ''}" onclick="toggleLetterIdeaSelection(${gIdx}, ${optIdx})">
            <div class="idea-checkbox-custom">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <div class="idea-card-content">
              <div class="idea-card-title">Phương án ${optIdx + 1}: ${escapeHtml(actVi || actEn)}</div>
              ${rsnVi ? `<div class="idea-card-point" style="margin-top: 0.2rem;"><strong style="color: var(--warning);">↳ Lý do / Hệ quả:</strong> ${escapeHtml(rsnVi)}</div>` : ''}
              ${expVi ? `<div class="idea-card-point" style="margin-top: 0.2rem;"><strong style="color: var(--success);">✨ Mở rộng / Giải pháp B2:</strong> ${escapeHtml(expVi)}</div>` : ''}
              ${shortKwList.length > 0 ? `<div class="idea-card-point" style="margin-top: 0.28rem; font-size: 0.82rem; color: var(--accent-primary); font-style: italic;">🔑 Cụm từ B2 gợi ý: ${escapeHtml(shortKwList.join(' • '))}</div>` : ''}
            </div>
          </div>
        `;
      }).join('');

      return `
        <div class="idea-group-col">
          <div class="idea-group-title-row">
            <div class="idea-group-title">📌 ${escapeHtml(group.title_vi || group.title_en || `Yêu cầu ${gIdx + 1}`)}</div>
            <span class="idea-group-badge">${selArr.length > 0 ? `✓ Đã chọn PA ${(selArr[0] || 0) + 1}` : 'Chưa chọn'}</span>
          </div>
          ${optionsHtml}
        </div>
      `;
    }).join('');

    const summaryHtml = `
      <div style="margin-top: 1.45rem; padding: 1.25rem; background: var(--bg-primary); border: 1.5px solid var(--accent-primary); border-radius: var(--radius-md);">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.9rem;">
          <div style="font-weight: 800; color: var(--accent-primary); font-size: 0.98rem;">
            📝 KHUNG GỢI Ý VIẾT BÀI THƯ CHUẨN DÀN Ý B2 (ĐỒNG BỘ SANG BƯỚC 02)
          </div>
        </div>

        <div class="b2-five-step-list">
          <div class="b2-step-row step-1">
            <div class="b2-step-head">
              <span class="b2-step-badge">PHẦN 1</span>
              <span>LỜI CHÀO MỞ ĐẦU (SALUTATION)</span>
            </div>
            <div class="b2-step-formula">
              <div style="color: var(--text-primary); font-size: 0.93rem; font-weight: 600;">🇻🇳 ${escapeHtml(b2Frame.salutationVi)}</div>
              <div style="font-size: 0.84rem; color: var(--accent-primary); margin-top: 0.2rem;">🔑 Cấu trúc B2 gợi ý: <code>${escapeHtml(b2Frame.salutationFormulaEn)}</code></div>
            </div>
          </div>

          <div class="b2-step-row step-2">
            <div class="b2-step-head">
              <span class="b2-step-badge" style="background: #0ea5e9;">PHẦN 2</span>
              <span>MỞ THƯ (OPENING — NÊU LÝ DO &amp; MỤC ĐÍCH VIẾT THƯ)</span>
            </div>
            <div class="b2-step-formula">
              <div style="color: var(--text-primary); font-size: 0.93rem; font-weight: 600; line-height: 1.55;">🇻🇳 ${escapeHtml(b2Frame.openingVi)}</div>
              <div style="font-size: 0.84rem; color: var(--accent-primary); margin-top: 0.25rem; line-height: 1.5;">🔑 Cụm từ &amp; cấu trúc B2 gợi ý: <code>${escapeHtml(b2Frame.openingHints.map(h => h.en).join(' • '))}</code></div>
            </div>
          </div>

          <div class="b2-step-row step-3">
            <div class="b2-step-head">
              <span class="b2-step-badge" style="background: #8b5cf6;">PHẦN 3</span>
              <span>THÂN THƯ (BODY PARAGRAPHS — ${b2Frame.bodyItems.length} Ý B2 BẠN ĐÃ CHỌN)</span>
            </div>
            <div class="b2-step-formula">
              <ul class="outline-summary-list" style="margin: 0;">
                ${b2Frame.bodyItems.map((item, idx) => `
                  <li>
                    <strong>Ý thân thư ${idx + 1} — ${escapeHtml(item.reqTitle)}:</strong>
                    <div style="color: var(--text-primary); font-size: 0.93rem; margin-top: 0.2rem; line-height: 1.55;">🇻🇳 ${escapeHtml(item.vi)}</div>
                    <div style="font-size: 0.83rem; color: var(--accent-primary); margin-top: 0.22rem; line-height: 1.5;">🔑 Cấu trúc &amp; cụm từ B2 gợi ý: <code>${escapeHtml(item.hints.map(h => h.en).join(' • '))}</code></div>
                  </li>
                `).join('')}
              </ul>
            </div>
          </div>

          <div class="b2-step-row step-4">
            <div class="b2-step-head">
              <span class="b2-step-badge" style="background: #f59e0b;">PHẦN 4</span>
              <span>KẾT THƯ (CLOSING SENTENCE)</span>
            </div>
            <div class="b2-step-formula">
              <div style="color: var(--text-primary); font-size: 0.93rem; font-weight: 600; line-height: 1.55;">🇻🇳 ${escapeHtml(b2Frame.closingVi)}</div>
              <div style="font-size: 0.84rem; color: var(--accent-primary); margin-top: 0.25rem; line-height: 1.5;">🔑 Cụm từ &amp; cấu trúc B2 gợi ý: <code>${escapeHtml(b2Frame.closingHints.map(h => h.en).join(' • '))}</code></div>
            </div>
          </div>

          <div class="b2-step-row step-5">
            <div class="b2-step-head">
              <span class="b2-step-badge" style="background: #10b981;">PHẦN 5</span>
              <span>LỜI CHÀO KẾT THÚC (SIGN-OFF — KHÔNG KÝ TÊN THẬT)</span>
            </div>
            <div class="b2-step-formula">
              <div style="color: var(--text-primary); font-size: 0.93rem; font-weight: 600;">🇻🇳 ${escapeHtml(b2Frame.signoffVi)} <span style="color: var(--danger); font-weight: 700;">— ⚠️ Lưu ý: Đề thi VSTEP yêu cầu KHÔNG viết tên riêng bên dưới!</span></div>
              <div style="font-size: 0.84rem; color: var(--accent-primary); margin-top: 0.2rem;">🔑 Cấu trúc B2 gợi ý: <code>${escapeHtml(b2Frame.signoffFormulaEn)}</code></div>
            </div>
          </div>
        </div>
      </div>
    `;

    const helperNote = isMultiGroupTopic
      ? 'Đề thư phàn nàn này cung cấp nhiều nhóm sự cố gợi ý. Hệ thống đã chọn sẵn các ý tiêu biểu nhất — bạn có thể <strong>bấm vào ô đang chọn để bỏ chọn</strong> hoặc chọn sang nhóm sự cố khác (nên giữ từ <strong>3 – 4 ý</strong> để bức thư mạch lạc 140–180 từ).'
      : 'Mỗi cột tương ứng với <strong>1 yêu cầu bắt buộc trong đề thi</strong>. Hãy nhấn chọn 1 phương án tâm đắc nhất cho từng cột — hệ thống sẽ tự động ghép vào <strong>Khung gợi ý viết 5 phần chuẩn dàn ý B2</strong> bên dưới và đồng bộ sang <strong>Bước 2: Tập diễn đạt ý tưởng</strong>!';

    ideaSelectorHtml = `
      <div class="reading-section-card idea-selection-card">
        <div class="idea-selection-header">
          <div style="flex: 1; min-width: 260px;">
            <h3 style="margin-bottom: 0.35rem; border: none; padding: 0;">🎯 3. CHỌN Ý TƯỞNG &amp; KHUNG GỢI Ý VIẾT BÀI THƯ CHUẨN DÀN Ý B2</h3>
            <p style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.55;">
              ${helperNote}
            </p>
          </div>
          <button type="button" class="btn btn-secondary" onclick="resetTopicIdeasToDefault()" style="font-size: 0.82rem; padding: 0.4rem 0.85rem; flex-shrink: 0;">
            ↺ Đặt lại mặc định
          </button>
        </div>
        <div class="idea-selection-grid">
          ${groupsHtml}
        </div>
        ${summaryHtml}

        <div style="margin-top: 1.5rem; display: flex; justify-content: flex-end;">
          <button class="btn btn-primary" onclick="switchStep('trans')" style="padding: 0.8rem 1.65rem; font-size: 0.96rem; font-weight: 700;">
            TIẾP THEO: BƯỚC 02 - TẬP DIỄN ĐẠT Ý TƯỞNG B2 &rarr;
          </button>
        </div>
      </div>
    `;
  }

  const reqsList = analysis.key_requirements || [];
  const taskExtractions = details.task_extractions || [];
  const regLabel = analysis.letter_type || topic.recipient_type || 'Informal / Formal';
  const isFormalLetter = /formal/i.test(regLabel) && !/informal/i.test(regLabel);

  container.innerHTML = `
    <!-- CARD 1: ĐỌC HIỂU ĐỀ BÀI SONG NGỮ & PHÂN TÍCH 4 YẾU TỐ CỐT LÕI -->
    <div class="reading-section-card">
      <h3>📖 1. ĐỌC HIỂU &amp; PHÂN TÍCH ĐỀ BÀI (VSTEP TASK 1 - B2)</h3>
      <div class="essay-comparison-grid" style="margin-bottom: 1.25rem;">
        <div class="essay-col" style="background: var(--bg-primary);">
          <h4>🇬🇧 ĐỀ BÀI TIẾNG ANH (EXAM PROMPT)</h4>
          <div style="font-size: 0.97rem; line-height: 1.68; color: var(--text-primary);">
            ${formatPromptDisplayHtml(topic.prompt || topic.context)}
          </div>
        </div>
        <div class="essay-col" style="background: var(--bg-primary);">
          <h4>🇻🇳 BẢN DỊCH ĐỀ BÀI TIẾNG VIỆT</h4>
          <div style="font-size: 0.97rem; line-height: 1.68; color: var(--text-primary);">
            ${formatPromptDisplayHtml(getTopicPromptTranslation(topic))}
          </div>
        </div>
      </div>

      <div class="task-analysis-grid-4">
        <div class="task-analysis-box">
          <div class="task-analysis-label">👤 1. Người nhận thư (Recipient)</div>
          <div style="font-weight: 600; color: var(--text-primary);">${escapeHtml(analysis.recipient || topic.recipient_type || 'Người nhận trong đề bài')}</div>
        </div>
        <div class="task-analysis-box">
          <div class="task-analysis-label">🎭 2. Văn phong bắt buộc (Register)</div>
          <div>
            <strong style="color: var(--accent-primary);">${escapeHtml(regLabel)}</strong>
            <div style="font-size: 0.86rem; color: var(--text-secondary); margin-top: 0.15rem;">
              ${isFormalLetter
                ? '⚠️ Lưu ý: Dùng từ ngữ lịch sự, trang trọng; <strong>tuyệt đối KHÔNG viết tắt</strong> (I\'m, don\'t, can\'t)!'
                : '💡 Lưu ý: Dùng giọng văn tự nhiên, gần gũi, thân thiện như đang trò chuyện với bạn bè.'}
            </div>
          </div>
        </div>
        <div class="task-analysis-box span-full">
          <div class="task-analysis-label">🎯 3. Mục đích viết thư (Communicative Purpose)</div>
          <div style="color: var(--text-primary);">${escapeHtml(analysis.purpose || topic.title_vi)}</div>
        </div>
        <div class="task-analysis-box span-full">
          <div class="task-analysis-label">📌 4. Các yêu cầu trọng tâm bắt buộc giải quyết đủ trong Thân thư</div>
          <div class="task-req-chips">
            ${taskExtractions.length > 0
              ? taskExtractions.map((te, i) => `<div class="task-req-chip"><strong>(${i + 1}) ${escapeHtml(te.task_title)}:</strong> ${escapeHtml(te.task_goal)}</div>`).join('')
              : reqsList.map((r, i) => `<div class="task-req-chip"><strong>(${i + 1})</strong> ${escapeHtml(r)}</div>`).join('')
            }
          </div>
        </div>
      </div>
    </div>

    <!-- CARD 2: TỪ VỰNG & CỤM TỪ CHỦ ĐỀ GHI ĐIỂM B2 -->
    <div class="reading-section-card">
      <h3>💎 2. TỪ VỰNG &amp; COLLOCATIONS CHỦ ĐỀ GHI ĐIỂM B2 (${vocabList.length} CỤM TỪ)</h3>
      ${Object.keys(vocabByGroup).length > 0 ? Object.keys(vocabByGroup).map(gName => `
        <div style="margin-bottom: 1rem;">
          <div style="font-weight: 700; font-size: 0.9rem; color: var(--warning); margin-bottom: 0.5rem;">🔸 ${escapeHtml(gName)}</div>
          <ul class="vocab-notes-list">
            ${vocabByGroup[gName].map(v => `
              <li>
                <strong style="color: var(--accent-primary);">${escapeHtml(v.en)}</strong>
                <div style="color: var(--text-secondary); font-size: 0.86rem; margin-top: 0.15rem;">${escapeHtml(v.vi)}</div>
              </li>
            `).join('')}
          </ul>
        </div>
      `).join('') : '<div class="empty-state">Từ vựng đã được tích hợp trực tiếp trong phần gợi ý ý tưởng và bài mẫu B2.</div>'}
    </div>

    <!-- CARD 3: CHỌN Ý TƯỞNG B2 & KHUNG GỢI Ý VIẾT 5 PHẦN CHUẨN DÀN Ý B2 -->
    ${ideaSelectorHtml || `
      <div style="display: flex; justify-content: flex-end;">
        <button class="btn btn-primary" onclick="switchStep('trans')" style="padding: 0.8rem 1.65rem; font-size: 0.96rem; font-weight: 700;">
          TIẾP THEO: BƯỚC 02 - TẬP DIỄN ĐẠT Ý TƯỞNG B2 &rarr;
        </button>
      </div>
    `}
  `;
}

function toggleStep1MasterOutline() {
  const box = document.getElementById('step1-master-outline-box');
  if (!box) return;
  box.style.display = box.style.display === 'none' ? 'block' : 'none';
}

// ============================================================================
// 9. STEP 2: TẬP DIỄN ĐẠT Ý TƯỞNG B2 (5-PART LETTER PRACTICE)
// ============================================================================
function buildExercisesForActiveTopic(topic) {
  if (!topic) return [];
  const b2Frame = buildTopicB2FivePartFrame(topic);
  if (!b2Frame) return [];

  const bodyExercises = b2Frame.bodyItems.map((item, idx) => ({
    role: 'body',
    partTitle: `PHẦN 3.${idx + 1}: THÂN THƯ — ${item.reqTitle.toUpperCase()}`,
    vi: item.vi,
    en: item.en,
    hints: item.hints
  }));

  return [
    {
      role: 'salutation',
      partTitle: 'PHẦN 1: LỜI CHÀO MỞ ĐẦU (SALUTATION)',
      vi: b2Frame.salutationVi,
      en: b2Frame.salutationEn,
      hints: [
        { en: b2Frame.salutationFormulaEn, vi: 'Cấu trúc chào mở đầu chuẩn văn phong kèm dấu phẩy cuối dòng' }
      ]
    },
    {
      role: 'opening',
      partTitle: 'PHẦN 2: MỞ THƯ (OPENING — NÊU LÝ DO & MỤC ĐÍCH VIẾT THƯ)',
      vi: b2Frame.openingVi,
      en: b2Frame.openingEn,
      hints: b2Frame.openingHints
    },
    ...bodyExercises,
    {
      role: 'closing',
      partTitle: 'PHẦN 4: KẾT THƯ (CLOSING SENTENCE)',
      vi: b2Frame.closingVi,
      en: b2Frame.closingEn,
      hints: b2Frame.closingHints
    },
    {
      role: 'signoff',
      partTitle: 'PHẦN 5: LỜI CHÀO KẾT THÚC (SIGN-OFF — KHÔNG KÝ TÊN THẬT)',
      vi: b2Frame.signoffVi,
      en: b2Frame.signoffEn,
      hints: [
        { en: b2Frame.signoffFormulaEn, vi: 'Lưu ý: Đề thi VSTEP yêu cầu KHÔNG ghi tên thật của bạn bên dưới!' }
      ]
    }
  ];
}

function renderTranslationExercises() {
  const listEl = document.getElementById('ws-translation-list');
  const topic = state.activeTopic;
  if (!listEl || !topic) return;

  const exercises = buildExercisesForActiveTopic(topic);
  state.currentExercises = exercises;

  const savedDraft = state.drafts[topic.id] || {};
  const savedTrans = savedDraft.translations || {};

  const bannerHtml = `
    <div class="trans-selected-banner">
      <div>
        <strong style="color: var(--accent-primary);">💡 Lộ trình 5 phần chuẩn VSTEP B2:</strong>
        <span style="font-size: 0.9rem; color: var(--text-secondary); margin-left: 0.35rem;">
          Các câu thân thư bên dưới được tạo trực tiếp từ những ý tưởng B2 bạn đã chọn ở Bước 1. Sau khi tự gõ và kiểm tra lỗi từng câu tiếng Anh, hãy chuyển sang Bước 3 để tự đánh máy lại bức thư hoàn chỉnh!
        </span>
      </div>
      <button class="btn btn-secondary" onclick="switchStep('read')" style="font-size: 0.8rem; padding: 0.35rem 0.75rem;">
        &larr; Đổi ý tưởng ở Bước 1
      </button>
    </div>
  `;

  const cardsHtml = exercises.map((ex, idx) => {
    const prevVal = savedTrans[idx] || '';
    const isShortLine = (ex.role === 'salutation' || ex.role === 'signoff');
    const hintsHtml = (ex.hints || []).map(h => `<li><strong>${escapeHtml(h.en)}</strong>: ${escapeHtml(h.vi)}</li>`).join('');

    return `
      <div class="translation-card" id="trans-card-${idx}">
        <div class="trans-card-header">
          <span class="part-title">${escapeHtml(ex.partTitle)}</span>
          <span>Câu ${idx + 1} / ${exercises.length}</span>
        </div>

        <div class="trans-vi-prompt">🇻🇳 ${escapeHtml(ex.vi)}</div>

        ${hintsHtml ? `
          <div class="trans-vocab-toggle-wrapper">
            <button type="button" class="vocab-toggle-btn" onclick="toggleVocabHint(${idx})">
              💡 Xem gợi ý từ vựng & cấu trúc B2
            </button>
            <div class="trans-vocab-hints" id="trans-hints-${idx}" style="display: none; margin-top: 0.5rem;">
              <ul class="vocab-hints-list">${hintsHtml}</ul>
            </div>
          </div>
        ` : ''}

        <textarea
          class="trans-input-area"
          id="trans-input-${idx}"
          style="height: ${isShortLine ? '52px' : '88px'};"
          placeholder="Nhập câu tiếng Anh của bạn tại đây..."
          oninput="handleTranslationDraftInput(${idx})"
          onpaste="handleEditorPaste(event)"
          oncopy="handleEditorCopyCut(event)"
          oncut="handleEditorCopyCut(event)"
          ondrop="handleEditorDrop(event)"
          oncontextmenu="handleEditorContextMenu(event)"
        >${escapeHtml(prevVal)}</textarea>

        <div class="trans-actions">
          <button type="button" class="btn btn-primary" onclick="checkTranslationAnswer(${idx})">
            ✓ Kiểm tra & Xem đáp án B2
          </button>
        </div>

        <div class="trans-answer-box" id="trans-answer-${idx}"></div>
      </div>
    `;
  }).join('');

  const bottomActionHtml = `
    <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 0.5rem; padding-bottom: 1rem;">
      <button class="btn btn-primary" onclick="switchStep('write')" style="padding: 0.75rem 1.4rem; font-size: 0.95rem;">
        CHUYỂN SANG BƯỚC 3: VIẾT BÀI THƯ &rarr;
      </button>
    </div>
  `;

  listEl.innerHTML = bannerHtml + cardsHtml + bottomActionHtml;
}

function toggleVocabHint(idx) {
  const box = document.getElementById(`trans-hints-${idx}`);
  if (!box) return;
  box.style.display = box.style.display === 'none' ? 'block' : 'none';
}

function handleTranslationDraftInput(idx) {
  if (!state.activeTopic) return;
  const topicId = state.activeTopic.id;
  const inputEl = document.getElementById(`trans-input-${idx}`);
  if (!inputEl) return;

  if (!state.drafts[topicId]) {
    state.drafts[topicId] = {
      topicId,
      topicTitle: state.activeTopic.title_vi || state.activeTopic.title_en,
      catNum: state.activeTopic.catNum || 1,
      categoryTitleVi: state.activeTopic.categoryTitleVi || '',
      translations: {},
      essayText: '',
      updatedAt: new Date().toLocaleString('vi-VN')
    };
  }
  if (!state.drafts[topicId].translations) state.drafts[topicId].translations = {};
  state.drafts[topicId].translations[idx] = inputEl.value;
  state.drafts[topicId].updatedAt = new Date().toLocaleString('vi-VN');
  persistDrafts();
}

function checkTranslationAnswer(idx) {
  const ex = state.currentExercises[idx];
  const inputEl = document.getElementById(`trans-input-${idx}`);
  const ansBox = document.getElementById(`trans-answer-${idx}`);
  if (!ex || !inputEl || !ansBox) return;

  const userText = inputEl.value.trim();
  if (!userText) {
    showToast('Bạn hãy thử tự viết câu tiếng Anh trước khi bấm Kiểm tra nhé!', 'warning');
    inputEl.focus();
    return;
  }

  const evalRes = evaluateSentenceTranslation(userText, ex, idx);

  ansBox.classList.add('active');
  ansBox.style.borderColor = evalRes.color;
  ansBox.style.backgroundColor = 'var(--bg-secondary)';
  ansBox.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.75rem; padding-bottom: 0.6rem; border-bottom: 1px solid var(--panel-border);">
      <div class="trans-answer-title no-uppercase" style="color: ${evalRes.color}; margin: 0; font-size: 0.92rem; font-weight: 800;">${evalRes.badge}</div>
      <div style="display: flex; align-items: center; gap: 0.65rem; flex-wrap: wrap;">
        ${evalRes.errorCount > 0
          ? `<span class="sent-stat-pill pill-danger">Phát hiện ${evalRes.errorCount} lỗi cần sửa</span>`
          : `<span class="sent-stat-pill pill-success">✓ Đúng ngữ pháp & chính tả</span>`
        }
        <span class="sent-stat-pill" style="color: ${evalRes.color}; border-color: ${evalRes.color};">Độ khớp ý B2: ${evalRes.percent}%</span>
      </div>
    </div>

    <div style="font-size: 0.9rem; color: var(--text-primary); margin-bottom: 0.85rem; line-height: 1.55;">
      ${evalRes.feedbackHtml}
    </div>

    <div class="sent-ref-answer-box">
      <div class="trans-answer-title" style="color: var(--accent-primary); margin-bottom: 0.3rem;">✨ ĐÁP ÁN MẪU CHUẨN B2 THAM KHẢO:</div>
      <div class="trans-answer-text">${escapeHtml(ex.en)}</div>
    </div>
  `;
}

// --- Levenshtein Distance & Comprehensive VSTEP B2 Sentence Error Detector ---
function getLevenshteinDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

const COMMON_VSTEP_TYPOS = {
  'firstlt': 'firstly',
  'firtly': 'firstly',
  'fisrtly': 'firstly',
  'firsty': 'firstly',
  'firsly': 'firstly',
  'fisrt': 'first',
  'firt': 'first',
  'secound': 'second',
  'sencond': 'second',
  'secondlt': 'secondly',
  'thrid': 'third',
  'thridly': 'thirdly',
  'finaly': 'finally',
  'finnaly': 'finally',
  'finnally': 'finally',
  'begining': 'beginning',
  'convinient': 'convenient',
  'convienient': 'convenient',
  'conveniant': 'convenient',
  'convinent': 'convenient',
  'inconvinient': 'inconvenient',
  'inconvienient': 'inconvenient',
  'convinience': 'convenience',
  'inconvinience': 'inconvenience',
  'accomodation': 'accommodation',
  'acommodation': 'accommodation',
  'acomodation': 'accommodation',
  'accomodations': 'accommodations',
  'recomend': 'recommend',
  'reccommend': 'recommend',
  'recommed': 'recommend',
  'recomendation': 'recommendation',
  'recomendations': 'recommendations',
  'recieve': 'receive',
  'recevie': 'receive',
  'recieved': 'received',
  'recieving': 'receiving',
  'beleive': 'believe',
  'acheive': 'achieve',
  'resturant': 'restaurant',
  'restaurent': 'restaurant',
  'restarant': 'restaurant',
  'resturants': 'restaurants',
  'restaurents': 'restaurants',
  'restarants': 'restaurants',
  'definately': 'definitely',
  'definitly': 'definitely',
  'seperate': 'separate',
  'neccessary': 'necessary',
  'necesary': 'necessary',
  'enviroment': 'environment',
  'environtment': 'environment',
  'goverment': 'government',
  'oppurtunity': 'opportunity',
  'oportunity': 'opportunity',
  'expereince': 'experience',
  'experiance': 'experience',
  'infomation': 'information',
  'informatoin': 'information',
  'infromation': 'information',
  'suprise': 'surprise',
  'surpise': 'surprise',
  'tommorow': 'tomorrow',
  'tomorow': 'tomorrow',
  'weahter': 'weather',
  'futher': 'further',
  'futhermore': 'furthermore',
  'furthurmore': 'furthermore',
  'additionly': 'additionally',
  'addtionally': 'additionally',
  'sincerly': 'sincerely',
  'sincerelly': 'sincerely',
  'faithfull': 'faithfully',
  'faithfuly': 'faithfully',
  'forwad': 'forward',
  'foward': 'forward',
  'collegue': 'colleague',
  'coleague': 'colleague',
  'collegues': 'colleagues',
  'schedual': 'schedule',
  'shedule': 'schedule',
  'beautifull': 'beautiful',
  'beatiful': 'beautiful',
  'wonderfull': 'wonderful',
  'carefull': 'careful',
  'helpfull': 'helpful',
  'usefull': 'useful',
  'successfull': 'successful',
  'peacefull': 'peaceful',
  'gratefull': 'grateful',
  'untill': 'until',
  'allways': 'always',
  'usally': 'usually',
  'usualy': 'usually',
  'especally': 'especially',
  'especialy': 'especially',
  'particulary': 'particularly',
  'diffrent': 'different',
  'diferent': 'different',
  'intresting': 'interesting',
  'intersting': 'interesting',
  'importan': 'important',
  'improtant': 'important',
  'probem': 'problem',
  'prolem': 'problem',
  'travle': 'travel',
  'considder': 'consider',
  'cosider': 'consider',
  'attration': 'attraction',
  'attrations': 'attractions',
  'hopital': 'hospital',
  'hosptial': 'hospital',
  'musuem': 'museum',
  'exibition': 'exhibition',
  'certifcate': 'certificate',
  'understant': 'understand',
  'knowlege': 'knowledge',
  'maintainance': 'maintenance',
  'questionaire': 'questionnaire',
  'embarass': 'embarrass',
  'embarassing': 'embarrassing',
  'occassion': 'occasion',
  'acess': 'access',
  'adress': 'address',
  'commitee': 'committee',
  'disapointed': 'disappointed',
  'dissappointed': 'disappointed',
  'dissatisfed': 'dissatisfied',
  'apologisee': 'apologize',
  'appologize': 'apologize',
  'appologise': 'apologise',
  'apolozige': 'apologize',
  'haveing': 'having',
  'makeing': 'making',
  'takeing': 'taking',
  'giveing': 'giving',
  'liveing': 'living',
  'useing': 'using',
  'chooseing': 'choosing',
  'moveing': 'moving',
  'shareing': 'sharing',
  'comming': 'coming',
  'writting': 'writing',
  'studing': 'studying',
  'stayin': 'staying',
  'planing': 'planning',
  'stoping': 'stopping',
  'shoping': 'shopping',
  'droping': 'dropping',
  'swiming': 'swimming',
  'runing': 'running',
  'practiceing': 'practicing',
  'prepareing': 'preparing',
  'organizeing': 'organizing',
  'inviteing': 'inviting'
};

const CORE_ENGLISH_VOCAB = [
  'a', 'an', 'the', 'and', 'or', 'but', 'so', 'because', 'since', 'as', 'if', 'when', 'while', 'although', 'though',
  'unless', 'until', 'till', 'before', 'after', 'once', 'whether', 'where', 'wherever', 'whenever', 'whereas', 'that',
  'which', 'who', 'whom', 'whose', 'what', 'whatever', 'whichever', 'how', 'however', 'why', 'than', 'then',
  'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'its', 'our', 'their',
  'mine', 'yours', 'hers', 'ours', 'theirs', 'myself', 'yourself', 'yourselves', 'himself', 'herself', 'itself', 'ourselves', 'themselves',
  'this', 'these', 'those', 'some', 'any', 'no', 'none', 'all', 'both', 'each', 'every', 'either', 'neither', 'another', 'other', 'others',
  'many', 'much', 'more', 'most', 'few', 'fewer', 'fewest', 'little', 'less', 'least', 'several', 'enough', 'plenty', 'lot', 'lots',
  'one', 'ones', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'first', 'second', 'third', 'fourth', 'fifth', 'last',
  'firstly', 'secondly', 'thirdly', 'lastly', 'finally', 'next', 'besides', 'moreover', 'furthermore', 'additionally', 'therefore', 'thus', 'hence',
  'nevertheless', 'nonetheless', 'meanwhile', 'otherwise', 'instead', 'indeed', 'actually', 'fact', 'personally', 'fortunately', 'unfortunately',
  'especially', 'particularly', 'specifically', 'generally', 'usually', 'normally', 'often', 'frequently', 'sometimes', 'occasionally', 'rarely', 'seldom', 'always', 'never', 'ever',
  'already', 'yet', 'still', 'just', 'only', 'even', 'also', 'too', 'very', 'quite', 'rather', 'pretty', 'fairly', 'really', 'truly', 'extremely', 'highly', 'completely', 'totally', 'absolutely',
  'almost', 'nearly', 'hardly', 'barely', 'scarcely', 'well', 'badly', 'fast', 'hard', 'late', 'lately', 'early', 'soon', 'recently', 'currently', 'now', 'today', 'tonight', 'tomorrow', 'yesterday',
  'here', 'there', 'everywhere', 'anywhere', 'somewhere', 'nowhere', 'home', 'abroad', 'away', 'back', 'together', 'alone', 'apart', 'ahead', 'around', 'nearby', 'inside', 'outside', 'upstairs', 'downstairs',
  'in', 'on', 'at', 'to', 'for', 'from', 'with', 'without', 'by', 'about', 'of', 'off', 'out', 'up', 'down', 'into', 'onto', 'upon', 'over', 'under', 'above', 'below', 'Beneath',
  'between', 'among', 'through', 'throughout', 'across', 'along', 'against', 'toward', 'towards', 'behind', 'beside', 'near', 'beyond', 'during', 'within', 'despite', 'via', 'per', 'including', 'regarding', 'concerning',
  'be', 'am', 'is', 'are', 'was', 'were', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'done', 'doing',
  'can', 'could', 'cannot', 'will', 'would', 'shall', 'should', 'may', 'might', 'must', 'ought', 'need', 'needs', 'needed', 'needing', 'dare', 'used',
  'dear', 'sir', 'madam', 'mr', 'mrs', 'ms', 'miss', 'dr', 'professor', 'manager', 'director', 'organizer', 'organizers', 'host', 'family', 'friend', 'friends', 'colleague', 'colleagues',
  'john', 'mary', 'peter', 'david', 'sarah', 'alex', 'helen', 'emma', 'jack', 'linda', 'tom', 'jane', 'ann', 'anna', 'ben', 'lisa', 'mark', 'paul', 'kevin', 'rachel', 'laura', 'lucy', 'nick', 'mike', 'sam', 'hoa', 'lan', 'minh', 'nam', 'linh', 'ha',
  'vietnam', 'vietnamese', 'hanoi', 'sapa', 'halong', 'danang', 'hoian', 'hue', 'dalat', 'nhatrang', 'phuquoc', 'saigon', 'london', 'paris', 'english',
  'stay', 'stays', 'stayed', 'staying', 'visit', 'visits', 'visited', 'visiting', 'go', 'goes', 'went', 'gone', 'going', 'come', 'comes', 'came', 'coming',
  'take', 'takes', 'took', 'taken', 'taking', 'make', 'makes', 'made', 'making', 'get', 'gets', 'got', 'gotten', 'getting', 'give', 'gives', 'gave', 'given', 'giving',
  'bring', 'brings', 'brought', 'bringing', 'buy', 'buys', 'bought', 'buying', 'rent', 'rents', 'rented', 'renting', 'book', 'books', 'booked', 'booking',
  'choose', 'chooses', 'chose', 'chosen', 'choosing', 'use', 'uses', 'used', 'using', 'try', 'tries', 'tried', 'trying', 'eat', 'eats', 'ate', 'eaten', 'eating',
  'drink', 'drinks', 'drank', 'drunk', 'drinking', 'play', 'plays', 'played', 'playing', 'work', 'works', 'worked', 'working', 'study', 'studies', 'studied', 'studying',
  'learn', 'learns', 'learned', 'learnt', 'learning', 'live', 'lives', 'lived', 'living', 'move', 'moves', 'moved', 'moving', 'travel', 'travels', 'traveled', 'travelled', 'traveling', 'travelling',
  'walk', 'walks', 'walked', 'walking', 'run', 'runs', 'ran', 'running', 'swim', 'swims', 'swam', 'swimming', 'drive', 'drives', 'drove', 'driven', 'driving',
  'ride', 'rides', 'rode', 'ridden', 'riding', 'fly', 'flies', 'flew', 'flown', 'flying', 'see', 'sees', 'saw', 'seen', 'seeing', 'watch', 'watches', 'watched', 'watching',
  'look', 'looks', 'looked', 'looking', 'hear', 'hears', 'heard', 'hearing', 'listen', 'listens', 'listened', 'listening', 'speak', 'speaks', 'spoke', 'spoken', 'speaking',
  'talk', 'talks', 'talked', 'talking', 'say', 'says', 'said', 'saying', 'tell', 'tells', 'told', 'telling', 'ask', 'asks', 'asked', 'asking', 'answer', 'answers', 'answered', 'answering',
  'reply', 'replies', 'replied', 'replying', 'respond', 'responds', 'responded', 'responding', 'write', 'writes', 'wrote', 'written', 'writing', 'read', 'reads', 'reading',
  'send', 'sends', 'sent', 'sending', 'receive', 'receives', 'received', 'receiving', 'keep', 'keeps', 'kept', 'keeping', 'hold', 'holds', 'held', 'holding',
  'put', 'puts', 'putting', 'set', 'sets', 'setting', 'leave', 'leaves', 'left', 'leaving', 'start', 'starts', 'started', 'starting', 'begin', 'begins', 'began', 'begun', 'beginning',
  'stop', 'stops', 'stopped', 'stopping', 'finish', 'finishes', 'finished', 'finishing', 'continue', 'continues', 'continued', 'continuing', 'change', 'changes', 'changed', 'changing',
  'meet', 'meets', 'met', 'meeting', 'join', 'joins', 'joined', 'joining', 'attend', 'attends', 'attended', 'attending', 'participate', 'participates', 'participated', 'participating',
  'organize', 'organizes', 'organized', 'organizing', 'organise', 'organises', 'organised', 'organising', 'prepare', 'prepares', 'prepared', 'preparing',
  'plan', 'plans', 'planned', 'planning', 'arrange', 'arranges', 'arranged', 'arranging', 'invite', 'invites', 'invited', 'inviting', 'welcome', 'welcomes', 'welcomed', 'welcoming',
  'help', 'helps', 'helped', 'helping', 'support', 'supports', 'supported', 'supporting', 'assist', 'assists', 'assisted', 'assisting', 'advise', 'advises', 'advised', 'advising',
  'recommend', 'recommends', 'recommended', 'recommending', 'suggest', 'suggests', 'suggested', 'suggesting', 'consider', 'considers', 'considered', 'considering',
  'think', 'thinks', 'thought', 'thinking', 'believe', 'believes', 'believed', 'believing', 'know', 'knows', 'knew', 'known', 'knowing', 'understand', 'understands', 'understood', 'understanding',
  'remember', 'remembers', 'remembered', 'remembering', 'forget', 'forgets', 'forgot', 'forgotten', 'forgetting', 'hope', 'hopes', 'hoped', 'hoping', 'wish', 'wishes', 'wished', 'wishing',
  'want', 'wants', 'wanted', 'wanting', 'like', 'likes', 'liked', 'liking', 'love', 'loves', 'loved', 'loving', 'enjoy', 'enjoys', 'enjoyed', 'enjoying', 'prefer', 'prefers', 'preferred', 'preferring',
  'avoid', 'avoids', 'avoided', 'avoiding', 'mind', 'minds', 'minded', 'minding', 'spend', 'spends', 'spent', 'spending', 'save', 'saves', 'saved', 'saving', 'waste', 'wastes', 'wasted', 'wasting',
  'pay', 'pays', 'paid', 'paying', 'cost', 'costs', 'costing', 'afford', 'affords', 'afforded', 'BORROW', 'borrow', 'borrows', 'borrowed', 'borrowing', 'lend', 'lends', 'lent', 'lending',
  'return', 'returns', 'returned', 'returning', 'exchange', 'exchanges', 'exchanged', 'exchanging', 'replace', 'replaces', 'replaced', 'replacing', 'refund', 'refunds', 'refunded',
  'repair', 'repairs', 'repaired', 'repairing', 'fix', 'fixes', 'fixed', 'fixing', 'check', 'checks', 'checked', 'checking', 'solve', 'solves', 'solved', 'solving', 'resolve', 'resolves', 'resolved',
  'apologize', 'apologizes', 'apologized', 'apologizing', 'apologise', 'apologises', 'apologised', 'apologising', 'forgive', 'forgives', 'forgave', 'forgiven', 'excuse', 'excuses',
  'explain', 'explains', 'explained', 'explaining', 'describe', 'describes', 'described', 'describing', 'share', 'shares', 'shared', 'sharing', 'introduce', 'introduces', 'introduced', 'introducing',
  'mention', 'mentions', 'mentioned', 'mentioning', 'inform', 'informs', 'informed', 'informing', 'contact', 'contacts', 'contacted', 'contacting', 'call', 'calls', 'called', 'calling',
  'explore', 'explores', 'explored', 'exploring', 'discover', 'discovers', 'discovered', 'discovering', 'experience', 'experiences', 'experienced', 'experiencing',
  'relax', 'relaxes', 'relaxed', 'relaxing', 'rest', 'rests', 'rested', 'resting', 'wear', 'wears', 'wore', 'worn', 'wearing', 'pack', 'packs', 'packed', 'packing',
  'clean', 'cleans', 'cleaned', 'cleaning', 'cook', 'cooks', 'cooked', 'cooking', 'order', 'orders', 'ordered', 'ordering', 'serve', 'serves', 'served', 'serving',
  'treat', 'treats', 'treated', 'treating', 'celebrate', 'celebrates', 'celebrated', 'celebrating', 'apply', 'applies', 'applied', 'applying', 'register', 'registers', 'registered', 'registering',
  'improve', 'improves', 'improved', 'improving', 'develop', 'develops', 'developed', 'developing', 'practice', 'practices', 'practiced', 'practicing', 'practise', 'practises', 'practised', 'practising',
  'accept', 'accepts', 'accepted', 'accepting', 'refuse', 'refuses', 'refused', 'refusing', 'agree', 'agrees', 'agreed', 'agreeing', 'complain', 'complains', 'complained', 'complaining',
  'request', 'requests', 'requested', 'requesting', 'require', 'requires', 'required', 'requiring', 'expect', 'expects', 'expected', 'expecting', 'wait', 'waits', 'waited', 'waiting',
  'appreciate', 'appreciates', 'appreciated', 'appreciating', 'enquire', 'enquires', 'enquired', 'inquire', 'inquires', 'inquired', 'let', 'lets', 'letting', 'allow', 'allows', 'allowed', 'allowing',
  'hotel', 'hotels', 'homestay', 'homestays', 'guesthouse', 'guesthouses', 'hostel', 'hostels', 'resort', 'resorts', 'apartment', 'apartments', 'room', 'rooms', 'accommodation', 'accommodations',
  'city', 'cities', 'center', 'centre', 'central', 'downtown', 'countryside', 'village', 'town', 'street', 'streets', 'road', 'roads', 'park', 'parks', 'beach', 'beaches', 'mountain', 'mountains',
  'lake', 'river', 'sea', 'island', 'place', 'places', 'spot', 'spots', 'area', 'areas', 'location', 'locations', 'destination', 'destinations', 'attraction', 'attractions', 'sightseeing',
  'restaurant', 'restaurants', 'cafe', 'cafes', 'shop', 'shops', 'store', 'stores', 'market', 'markets', 'supermarket', 'mall', 'museum', 'museums', 'pagoda', 'pagodas', 'temple', 'temples',
  'gallery', 'galleries', 'theater', 'theatre', 'cinema', 'hospital', 'clinic', 'school', 'university', 'college', 'library', 'gym', 'station', 'airport', 'bus', 'buses', 'train', 'trains',
  'taxi', 'taxis', 'motorbike', 'motorbikes', 'bicycle', 'bike', 'bikes', 'car', 'cars', 'boat', 'flight', 'traffic', 'transport', 'transportation',
  'food', 'foods', 'dish', 'dishes', 'meal', 'meals', 'breakfast', 'lunch', 'dinner', 'seafood', 'cuisine', 'specialty', 'specialties', 'speciality', 'specialities', 'fruit', 'fruits', 'vegetable', 'vegetables', 'coffee', 'tea', 'drink', 'water',
  'weather', 'climate', 'season', 'seasons', 'spring', 'summer', 'autumn', 'fall', 'winter', 'sun', 'sunny', 'rain', 'rainy', 'wind', 'windy', 'cloud', 'cloudy', 'warm', 'hot', 'cool', 'cold', 'dry', 'wet', 'humid', 'pleasant', 'mild',
  'clothes', 'clothing', 'jacket', 'coat', 'sweater', 'shirt', 't-shirt', 'trousers', 'jeans', 'dress', 'skirt', 'shoes', 'sneakers', 'boots', 'sandals', 'umbrella', 'raincoat', 'hat', 'sunglasses', 'sunscreen', 'luggage', 'suitcase', 'backpack',
  'time', 'times', 'day', 'days', 'week', 'weeks', 'weekend', 'weekends', 'month', 'months', 'year', 'years', 'morning', 'afternoon', 'evening', 'night', 'hour', 'hours', 'minute', 'minutes', 'moment',
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december',
  'convenient', 'inconvenient', 'convenience', 'inconvenience', 'easy', 'easier', 'easiest', 'easily', 'difficult', 'difficulty', 'hard', 'cheap', 'cheaper', 'cheapest', 'expensive', 'affordable', 'reasonable',
  'good', 'better', 'best', 'bad', 'worse', 'worst', 'great', 'wonderful', 'fantastic', 'amazing', 'excellent', 'perfect', 'nice', 'lovely', 'beautiful', 'pretty', 'attractive', 'famous', 'popular', 'well-known',
  'traditional', 'modern', 'local', 'foreign', 'international', 'public', 'private', 'personal', 'special', 'different', 'various', 'similar', 'same', 'new', 'old', 'young', 'big', 'small', 'large', 'long', 'short', 'high', 'low',
  'free', 'busy', 'available', 'crowded', 'quiet', 'peaceful', 'noisy', 'safe', 'dangerous', 'clean', 'dirty', 'fresh', 'delicious', 'tasty', 'healthy', 'useful', 'helpful', 'important', 'necessary', 'suitable', 'comfortable', 'uncomfortable',
  'friendly', 'kind', 'polite', 'generous', 'hospitality', 'hospitable', 'outgoing', 'sociable', 'hardworking', 'intelligent', 'smart', 'talented', 'experienced', 'qualified', 'fluent', 'enthusiastic', 'passionate',
  'happy', 'glad', 'pleased', 'delighted', 'excited', 'thrilled', 'grateful', 'thankful', 'proud', 'sorry', 'afraid', 'worried', 'sad', 'upset', 'disappointed', 'dissatisfied', 'frustrated', 'unhappy',
  'broken', 'damaged', 'defective', 'faulty', 'wrong', 'late', 'delayed', 'missing', 'lost', 'unacceptable', 'sincere', 'sincerely', 'faithfully', 'regards', 'warm', 'wishes', 'love', 'care', 'forward',
  'letter', 'email', 'message', 'reply', 'response', 'question', 'questions', 'information', 'advice', 'suggestion', 'suggestions', 'recommendation', 'recommendations', 'idea', 'ideas', 'tip', 'tips', 'opinion',
  'problem', 'problems', 'issue', 'issues', 'situation', 'reason', 'reasons', 'detail', 'details', 'fact', 'example', 'experience', 'opportunity', 'chance', 'choice', 'option', 'options',
  'job', 'work', 'career', 'company', 'office', 'position', 'salary', 'interview', 'application', 'cv', 'resume', 'skill', 'skills', 'knowledge', 'certificate', 'degree', 'course', 'courses', 'class', 'classes', 'lesson', 'lessons', 'teacher', 'student', 'students',
  'party', 'wedding', 'birthday', 'festival', 'holiday', 'vacation', 'trip', 'tour', 'journey', 'event', 'activity', 'activities', 'game', 'games', 'sport', 'sports', 'music', 'song', 'songs', 'movie', 'movies', 'film', 'book', 'books',
  'money', 'price', 'prices', 'cost', 'costs', 'fee', 'fees', 'ticket', 'tickets', 'bill', 'receipt', 'invoice', 'discount', 'refund', 'compensation', 'service', 'services', 'quality', 'product', 'item', 'package',
  'tourist', 'tourists', 'visitor', 'visitors', 'guest', 'guests', 'customer', 'customers', 'passenger', 'passengers', 'people', 'person', 'child', 'children', 'kid', 'kids', 'parent', 'parents', 'mother', 'father', 'brother', 'sister', 'husband', 'wife', 'neighbor', 'neighbour'
];

let LETTER_SPELL_DICT = null;
function getLetterSpellcheckDictionary() {
  if (LETTER_SPELL_DICT) return LETTER_SPELL_DICT;
  const dict = new Set(CORE_ENGLISH_VOCAB);
  const addWordsFromText = (str) => {
    if (!str || typeof str !== 'string') return;
    const tokens = str.toLowerCase().replace(/[^a-z']/g, ' ').split(/\s+/).filter(Boolean);
    tokens.forEach(t => {
      const clean = t.replace(/^'+|'+$/g, '');
      if (clean.length >= 2 && !COMMON_VSTEP_TYPOS[clean]) {
        dict.add(clean);
        dict.add(clean.replace(/'/g, ''));
      }
    });
  };

  if (typeof LETTERS_DATA !== 'undefined' && Array.isArray(LETTERS_DATA)) {
    LETTERS_DATA.forEach(topic => {
      addWordsFromText(topic.title_en);
      addWordsFromText(topic.prompt);
      if (topic.details) {
        addWordsFromText(topic.details.sample_b1);
        addWordsFromText(topic.details.sample_b2);
        if (Array.isArray(topic.details.vocab)) {
          topic.details.vocab.forEach(v => addWordsFromText(v.en));
        }
        ['ideas_b1', 'ideas_b2'].forEach(k => {
          const ideas = topic.details[k];
          if (ideas && typeof ideas === 'object') {
            Object.values(ideas).forEach(arr => {
              if (Array.isArray(arr)) {
                arr.forEach(item => {
                  addWordsFromText(item.point_en);
                  addWordsFromText(item.evidence_en);
                  if (Array.isArray(item.collocations)) {
                    item.collocations.forEach(c => addWordsFromText(c.en));
                  }
                });
              }
            });
          }
        });
      }
    });
  }

  if (typeof B2_CURATED_IDEAS !== 'undefined' && B2_CURATED_IDEAS) {
    Object.values(B2_CURATED_IDEAS).forEach(topicIdeas => {
      if (Array.isArray(topicIdeas)) {
        topicIdeas.forEach(group => {
          addWordsFromText(group.groupTitleEn);
          if (Array.isArray(group.options)) {
            group.options.forEach(opt => {
              addWordsFromText(opt.en);
              addWordsFromText(opt.point_en);
              addWordsFromText(opt.evidence_en);
            });
          }
        });
      }
    });
  }

  LETTER_SPELL_DICT = dict;
  return dict;
}

const GERUND_TARGET_VERBS = new Set([
  'stay', 'visit', 'go', 'come', 'take', 'make', 'do', 'have', 'get', 'buy', 'rent', 'book', 'choose', 'use', 'try',
  'eat', 'drink', 'play', 'learn', 'live', 'move', 'travel', 'walk', 'run', 'swim', 'drive', 'ride', 'fly', 'see',
  'watch', 'look', 'hear', 'listen', 'speak', 'talk', 'say', 'tell', 'ask', 'write', 'read', 'send', 'receive',
  'give', 'bring', 'spend', 'save', 'pay', 'borrow', 'lend', 'return', 'exchange', 'replace', 'apply', 'register',
  'join', 'attend', 'participate', 'organize', 'organise', 'prepare', 'invite', 'explore', 'discover', 'relax',
  'wear', 'pack', 'clean', 'cook', 'order', 'celebrate', 'improve', 'find', 'meet', 'call', 'contact', 'work', 'study',
  'help', 'share', 'apologize', 'apologise', 'complain', 'explain', 'discuss', 'solve', 'fix', 'repair', 'check', 'wait'
]);

function toGerundForm(verb) {
  const v = (verb || '').toLowerCase().trim();
  const special = {
    'be': 'being', 'have': 'having', 'do': 'doing', 'go': 'going', 'see': 'seeing', 'agree': 'agreeing',
    'free': 'freeing', 'die': 'dying', 'lie': 'lying', 'tie': 'tying', 'run': 'running', 'swim': 'swimming',
    'sit': 'sitting', 'get': 'getting', 'put': 'putting', 'cut': 'cutting', 'set': 'setting', 'let': 'letting',
    'plan': 'planning', 'stop': 'stopping', 'shop': 'shopping', 'drop': 'dropping', 'chat': 'chatting',
    'fit': 'fitting', 'win': 'winning', 'begin': 'beginning', 'prefer': 'preferring', 'refer': 'referring',
    'regret': 'regretting', 'permit': 'permitting', 'admit': 'admitting', 'submit': 'submitting', 'forget': 'forgetting'
  };
  if (special[v]) return special[v];
  if (v.endsWith('ie')) return v.slice(0, -2) + 'ying';
  if (v.endsWith('e') && !v.endsWith('ee') && !v.endsWith('oe') && !v.endsWith('ye')) {
    return v.slice(0, -1) + 'ing';
  }
  return v + 'ing';
}

function toBaseVerbForm(word) {
  const w = (word || '').toLowerCase().trim();
  const irregular = {
    'went': 'go', 'gone': 'go', 'going': 'go', 'goes': 'go',
    'took': 'take', 'taken': 'take', 'taking': 'take', 'takes': 'take',
    'made': 'make', 'making': 'make', 'makes': 'make',
    'had': 'have', 'having': 'have', 'has': 'have',
    'did': 'do', 'done': 'do', 'doing': 'do', 'does': 'do',
    'got': 'get', 'gotten': 'get', 'getting': 'get', 'gets': 'get',
    'saw': 'see', 'seen': 'see', 'seeing': 'see', 'sees': 'see',
    'came': 'come', 'coming': 'come', 'comes': 'come',
    'gave': 'give', 'given': 'give', 'giving': 'give', 'gives': 'give',
    'wrote': 'write', 'written': 'write', 'writing': 'write', 'writes': 'write',
    'sent': 'send', 'sending': 'send', 'sends': 'send',
    'spent': 'spend', 'spending': 'spend', 'spends': 'spend',
    'left': 'leave', 'leaving': 'leave', 'leaves': 'leave',
    'met': 'meet', 'meeting': 'meet', 'meets': 'meet',
    'paid': 'pay', 'paying': 'pay', 'pays': 'pay',
    'said': 'say', 'saying': 'say', 'says': 'say',
    'told': 'tell', 'telling': 'tell', 'tells': 'tell',
    'thought': 'think', 'thinking': 'think', 'thinks': 'think',
    'brought': 'bring', 'bringing': 'bring', 'brings': 'bring',
    'kept': 'keep', 'keeping': 'keep', 'keeps': 'keep',
    'found': 'find', 'finding': 'find', 'finds': 'find',
    'chose': 'choose', 'chosen': 'choose', 'choosing': 'choose', 'chooses': 'choose',
    'spoke': 'speak', 'spoken': 'speak', 'speaking': 'speak', 'speaks': 'speak',
    'wore': 'wear', 'worn': 'wear', 'wearing': 'wear', 'wears': 'wear',
    'ate': 'eat', 'eaten': 'eat', 'eating': 'eat', 'eats': 'eat',
    'drank': 'drink', 'drunk': 'drink', 'drinking': 'drink', 'drinks': 'drink',
    'bought': 'buy', 'buying': 'buy', 'buys': 'buy',
    'running': 'run', 'ran': 'run', 'runs': 'run',
    'swimming': 'swim', 'swam': 'swim', 'swims': 'swim',
    'sitting': 'sit', 'sat': 'sit', 'sits': 'sit',
    'stopping': 'stop', 'stopped': 'stop', 'stops': 'stop',
    'planning': 'plan', 'planned': 'plan', 'plans': 'plan',
    'shopping': 'shop', 'shopped': 'shop', 'shops': 'shop',
    'beginning': 'begin', 'began': 'begin', 'begins': 'begin',
    'studying': 'study', 'studied': 'study', 'studies': 'study',
    'trying': 'try', 'tried': 'try', 'tries': 'try',
    'applying': 'apply', 'applied': 'apply', 'applies': 'apply',
    'replying': 'reply', 'replied': 'reply', 'replies': 'reply',
    'living': 'live', 'lived': 'live', 'lives': 'live',
    'moving': 'move', 'moved': 'move', 'moves': 'move',
    'using': 'use', 'used': 'use', 'uses': 'use',
    'sharing': 'share', 'shared': 'share', 'shares': 'share',
    'inviting': 'invite', 'invited': 'invite', 'invites': 'invite',
    'preparing': 'prepare', 'prepared': 'prepare', 'prepares': 'prepare',
    'organizing': 'organize', 'organized': 'organize', 'organizes': 'organize',
    'exploring': 'explore', 'explored': 'explore', 'explores': 'explore',
    'apologizing': 'apologize', 'apologized': 'apologize', 'apologizes': 'apologize',
    'practicing': 'practice', 'practiced': 'practice', 'practices': 'practice'
  };
  if (irregular[w]) return irregular[w];
  if (w.endsWith('ing') && w.length > 4) {
    const stem = w.slice(0, -3);
    if (GERUND_TARGET_VERBS.has(stem)) return stem;
    if (GERUND_TARGET_VERBS.has(stem + 'e')) return stem + 'e';
  }
  if (w.endsWith('ed') && w.length > 4) {
    const stem = w.slice(0, -2);
    if (GERUND_TARGET_VERBS.has(stem)) return stem;
    if (GERUND_TARGET_VERBS.has(w.slice(0, -1))) return w.slice(0, -1);
  }
  if (w.endsWith('es') && w.length > 4) {
    const stem = w.slice(0, -2);
    if (GERUND_TARGET_VERBS.has(stem)) return stem;
  }
  if (w.endsWith('s') && !w.endsWith('ss') && w.length > 3) {
    const stem = w.slice(0, -1);
    if (GERUND_TARGET_VERBS.has(stem)) return stem;
  }
  return w;
}

function buildInlineWordDiffHtml(originalStr, correctedStr) {
  const tokenize = (s) => (s || '').trim().match(/[a-zA-Z0-9']+|[^\s\w']/g) || [];
  const origTokens = tokenize(originalStr);
  const corrTokens = tokenize(correctedStr);

  const m = origTokens.length;
  const n = corrTokens.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      if (origTokens[i] === corrTokens[j]) {
        dp[i][j] = 1 + dp[i + 1][j + 1];
      } else {
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
  }

  const parts = [];
  let i = 0;
  let j = 0;
  while (i < m && j < n) {
    if (origTokens[i] === corrTokens[j]) {
      parts.push({ type: 'same', text: origTokens[i] });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      parts.push({ type: 'del', text: origTokens[i] });
      i++;
    } else {
      parts.push({ type: 'ins', text: corrTokens[j] });
      j++;
    }
  }
  while (i < m) {
    parts.push({ type: 'del', text: origTokens[i++] });
  }
  while (j < n) {
    parts.push({ type: 'ins', text: corrTokens[j++] });
  }

  const joinTokensSmart = (tokens) => {
    let out = '';
    tokens.forEach((tok, idx) => {
      if (idx === 0) {
        out += tok;
      } else if (/^[,.;:!?]$/.test(tok)) {
        out += tok;
      } else {
        out += ' ' + tok;
      }
    });
    return out;
  };

  // Merge adjacent tokens of the same type
  const merged = [];
  for (const p of parts) {
    const last = merged[merged.length - 1];
    if (last && last.type === p.type) {
      last.tokens.push(p.text);
    } else {
      merged.push({ type: p.type, tokens: [p.text] });
    }
  }

  let html = '';
  merged.forEach((seg, idx) => {
    const text = joinTokensSmart(seg.tokens);
    const isPunctOnly = seg.tokens.length === 1 && /^[,.;:!?]$/.test(seg.tokens[0]);
    const needSpaceBefore = idx > 0 && !(seg.type === 'same' && isPunctOnly);
    if (needSpaceBefore) html += ' ';
    if (seg.type === 'del') {
      html += `<del class="sent-err-del">${escapeHtml(text)}</del>`;
    } else if (seg.type === 'ins') {
      html += `<ins class="sent-err-ins">${escapeHtml(text)}</ins>`;
    } else {
      html += escapeHtml(text);
    }
  });

  return html;
}

function evaluateSentenceTranslation(userText, ex, idx = 0) {
  const trimmed = (userText || '').trim().replace(/\s+/g, ' ');
  let corrected = trimmed;
  const structuredErrors = [];
  const b2Upgrades = [];

  const topic = state.activeTopic || {};
  const isFormal = /formal/i.test(topic.recipient_type || topic.details?.analysis?.letter_type || '') &&
                   !/informal/i.test(topic.recipient_type || topic.details?.analysis?.letter_type || '');

  const addError = (category, wrongText, rightText, explanation) => {
    if (!wrongText || wrongText === rightText) return;
    if (structuredErrors.some(e => e.wrongText.toLowerCase() === wrongText.toLowerCase() && e.category === category)) return;
    structuredErrors.push({ category, wrongText, rightText, explanation });
  };

  // Build context vocabulary from ex.en & ex.hints for priority spellcheck matching
  const contextWords = new Set();
  const collectContextWords = (str) => {
    if (!str) return;
    str.toLowerCase().replace(/[^a-z']/g, ' ').split(/\s+/).filter(Boolean).forEach(w => {
      const clean = w.replace(/^'+|'+$/g, '');
      if (clean.length >= 2) contextWords.add(clean);
    });
  };
  collectContextWords(ex.en);
  (ex.hints || []).forEach(h => collectContextWords(h.en));
  ['firstly', 'secondly', 'thirdly', 'finally', 'furthermore', 'moreover', 'additionally', 'however', 'therefore', 'sincerely', 'faithfully'].forEach(w => contextWords.add(w));

  const validDict = getLetterSpellcheckDictionary();

  // ---------------------------------------------------------------------------
  // 1. SPELLING & TYPO CHECK (Kiểm tra lỗi chính tả từng từ)
  // ---------------------------------------------------------------------------
  const rawTokens = corrected.split(/\s+/);
  const spellFixedTokens = rawTokens.map((token, tIdx) => {
    const leadMatch = token.match(/^([^a-zA-Z0-9']*)/);
    const trailMatch = token.match(/([^a-zA-Z0-9']*)$/);
    const lead = leadMatch ? leadMatch[1] : '';
    const trail = trailMatch ? trailMatch[1] : '';
    const core = token.slice(lead.length, token.length - trail.length);
    if (!core || /[0-9]/.test(core)) return token;

    const lowerCore = core.toLowerCase();
    const pureAlpha = lowerCore.replace(/[^a-z]/g, '');
    if (pureAlpha.length <= 1) return token;

    // Skip contractions like I'm, don't, I'd, it's, you're, we've, etc.
    if (/^(i'm|i'd|i'll|i've|you're|you'd|you'll|you've|he's|she's|it's|we're|we've|we'll|they're|they've|they'll|don't|doesn't|didn't|can't|couldn't|won't|wouldn't|shouldn't|isn't|aren't|wasn't|weren't|haven't|hasn't|hadn't|let's|that's|there's|who's|what's)$/i.test(lowerCore)) {
      return token;
    }

    // Check explicit typo dictionary first
    if (COMMON_VSTEP_TYPOS[lowerCore] || COMMON_VSTEP_TYPOS[pureAlpha]) {
      let target = COMMON_VSTEP_TYPOS[lowerCore] || COMMON_VSTEP_TYPOS[pureAlpha];
      if (/^[A-Z]/.test(core)) {
        target = target.charAt(0).toUpperCase() + target.slice(1);
      }
      addError(
        'Lỗi chính tả (Spelling)',
        core,
        target,
        `Từ "${core}" bị gõ sai chính tả. Bạn hãy sửa thành "${target}".`
      );
      return lead + target + trail;
    }

    // If word is already valid in dictionary or context words, keep it
    if (validDict.has(lowerCore) || validDict.has(pureAlpha) || contextWords.has(lowerCore) || contextWords.has(pureAlpha)) {
      return token;
    }

    // Find closest spelling suggestion via Levenshtein distance (prefer contextWords first)
    let bestWord = '';
    let bestScore = 999;

    const evaluateCandidate = (cand, isContext) => {
      if (Math.abs(cand.length - pureAlpha.length) > 2) return;
      const dist = getLevenshteinDistance(pureAlpha, cand);
      if (dist > 2) return;
      // Compute weighted score: prefer distance 1, same first char, same first 2 chars, and context words
      let score = dist * 10;
      if (cand[0] !== pureAlpha[0]) score += 6;
      if (cand.slice(0, 2) === pureAlpha.slice(0, 2)) score -= 3;
      if (cand.slice(-2) === pureAlpha.slice(-2)) score -= 2;
      if (isContext) score -= 4;
      if (score < bestScore) {
        bestScore = score;
        bestWord = cand;
      }
    };

    contextWords.forEach(cw => evaluateCandidate(cw, true));
    if (bestScore > 8) {
      validDict.forEach(dw => evaluateCandidate(dw, false));
    }

    if (bestWord && bestScore <= 18) {
      let target = bestWord;
      if (/^[A-Z]/.test(core)) {
        target = target.charAt(0).toUpperCase() + target.slice(1);
      }
      addError(
        'Lỗi chính tả (Spelling)',
        core,
        target,
        `Từ "${core}" không đúng chính tả tiếng Anh. Đề xuất sửa thành "${target}".`
      );
      return lead + target + trail;
    }

    return token;
  });

  corrected = spellFixedTokens.join(' ');

  // ---------------------------------------------------------------------------
  // 2. GRAMMAR, VERB PATTERNS & COLLOCATION CHECKS
  // ---------------------------------------------------------------------------

  // 2.1. "consider / enjoy / avoid / mind / finish / practice / keep / postpone / delay + (to)? + V0" -> V-ing
  corrected = corrected.replace(
    /\b(consider|considers|considered|considering|enjoy|enjoys|enjoyed|enjoying|avoid|avoids|avoided|avoiding|mind|minds|finish|finishes|finished|practice|practices|practise|practises|keep|keeps|kept|postpone|delay)\s+(to\s+)?([a-z]+)\b/gi,
    (match, v1, toPart, v2) => {
      const lowerV1 = v1.toLowerCase();
      const lowerV2 = v2.toLowerCase();
      if (lowerV2.endsWith('ing')) {
        if (toPart) {
          const right = `${v1} ${v2}`;
          addError(
            'Lỗi cấu trúc động từ (Verb Pattern)',
            match,
            right,
            `Sau động từ "${lowerV1}" dùng trực tiếp danh động từ V-ing ("${right}"), không dùng giới từ "to".`
          );
          return right;
        }
        return match;
      }
      // Avoid flagging valid nouns after enjoy/finish/keep like "enjoy music", "finish work" unless "to" is present
      const nounExceptions = new Set(['work', 'study', 'food', 'drinks', 'travel', 'help', 'support', 'visit', 'stay']);
      if (!toPart && ['enjoy', 'enjoys', 'enjoyed', 'finish', 'finishes', 'finished', 'keep', 'keeps', 'kept'].includes(lowerV1) && nounExceptions.has(lowerV2)) {
        return match;
      }
      if (GERUND_TARGET_VERBS.has(lowerV2)) {
        const gerund = toGerundForm(lowerV2);
        const right = `${v1} ${gerund}`;
        addError(
          'Lỗi cấu trúc động từ (Verb Pattern)',
          match,
          right,
          `Sau động từ "${lowerV1}" bắt buộc dùng danh động từ V-ing (${lowerV1} + V-ing), không dùng "${toPart ? 'to ' + v2 : v2}". Đề xuất sửa thành "${right}".`
        );
        return right;
      }
      return match;
    }
  );

  // 2.2. "suggest / recommend + somebody + to V0" (e.g. "suggest you to stay")
  corrected = corrected.replace(
    /\b(suggest|suggests|suggested|recommend|recommends|recommended)\s+(you|me|him|her|us|them)\s+to\s+([a-z]+)\b/gi,
    (match, v1, pron, v2) => {
      const lowerV1 = v1.toLowerCase();
      const baseV2 = toBaseVerbForm(v2);
      const right = `${v1} that ${pron} should ${baseV2}`;
      addError(
        'Lỗi cấu trúc câu khuyên (Advice Structure)',
        match,
        right,
        `Động từ "${lowerV1}" không đi với cấu trúc "${lowerV1} + somebody + to V". Hãy sửa thành "${right}" hoặc "${v1} ${toGerundForm(baseV2)}".`
      );
      return right;
    }
  );

  // 2.3. "suggest / recommend + (to)? + V0" -> V-ing
  corrected = corrected.replace(
    /\b(suggest|suggests|suggested|recommend|recommends|recommended)\s+(to\s+)?([a-z]+)\b/gi,
    (match, v1, toPart, v2) => {
      const lowerV2 = v2.toLowerCase();
      if (lowerV2 === 'that' || lowerV2 === 'you' || lowerV2 === 'a' || lowerV2 === 'an' || lowerV2 === 'the' || lowerV2 === 'some' || lowerV2 === 'this' || lowerV2 === 'these' || lowerV2.endsWith('ing')) {
        if (toPart && lowerV2.endsWith('ing')) {
          const right = `${v1} ${v2}`;
          addError('Lỗi cấu trúc động từ (Verb Pattern)', match, right, `Sau "${v1.toLowerCase()}" đi trực tiếp với V-ing, không có "to".`);
          return right;
        }
        return match;
      }
      if (GERUND_TARGET_VERBS.has(lowerV2)) {
        const gerund = toGerundForm(lowerV2);
        const right = `${v1} ${gerund}`;
        addError(
          'Lỗi cấu trúc động từ (Verb Pattern)',
          match,
          right,
          `Sau động từ "${v1.toLowerCase()}" cần dùng danh động từ V-ing ("${right}") hoặc mệnh đề "${v1.toLowerCase()} that you (should) + V0".`
        );
        return right;
      }
      return match;
    }
  );

  // 2.4. "look forward to + V0" -> "look forward to + V-ing"
  corrected = corrected.replace(
    /\b(look|looks|looked|looking)\s+forward\s+to\s+([a-z]+)\b/gi,
    (match, lookForm, v2) => {
      const lowerV2 = v2.toLowerCase();
      const nonVerbs = new Set(['your', 'the', 'a', 'an', 'this', 'that', 'it', 'our', 'my', 'his', 'her', 'their', 'you']);
      if (lowerV2.endsWith('ing') || nonVerbs.has(lowerV2)) return match;
      if (GERUND_TARGET_VERBS.has(lowerV2) || ['hear', 'receive', 'see', 'meet', 'reply', 'welcome', 'work', 'have', 'get', 'attend', 'join', 'visit'].includes(lowerV2)) {
        const gerund = toGerundForm(lowerV2);
        const right = `${lookForm} forward to ${gerund}`;
        addError(
          'Lỗi cấu trúc B2 (Look forward to + V-ing)',
          match,
          right,
          `Trong cụm "look forward to" (mong đợi điều gì), từ "to" là giới từ nên động từ theo sau bắt buộc ở dạng V-ing. Hãy sửa thành "${right}".`
        );
        return right;
      }
      return match;
    }
  );

  // 2.5. Prepositions (for / in / on / of / about / by / without / instead of / after / before) + (not)? + bare verb -> V-ing
  corrected = corrected.replace(
    /\b(apologize\s+for|apologise\s+for|sorry\s+for|thank\s+you\s+for|thanks\s+for|grateful\s+for|interested\s+in|keen\s+on|fond\s+of|excited\s+about|worried\s+about|thinking\s+about|thinking\s+of|instead\s+of|without|make\s+it\s+up\s+to\s+you\s+by)\s+(not\s+)?([a-z]+)\b/gi,
    (match, prepPhrase, notPart, v2) => {
      const lowerV2 = v2.toLowerCase();
      const nonVerbs = new Set(['a', 'an', 'the', 'my', 'your', 'his', 'her', 'its', 'our', 'their', 'this', 'that', 'these', 'those', 'some', 'any', 'all', 'many', 'much', 'you', 'me', 'him', 'us', 'them', 'it', 'what', 'which', 'how']);
      if (lowerV2.endsWith('ing') || nonVerbs.has(lowerV2)) return match;
      if (GERUND_TARGET_VERBS.has(lowerV2)) {
        const gerund = toGerundForm(lowerV2);
        const right = `${prepPhrase} ${notPart || ''}${gerund}`;
        addError(
          'Lỗi ngữ pháp (Giới từ + V-ing)',
          match,
          right,
          `Sau giới từ ("${prepPhrase}") động từ phải chia ở dạng danh động từ V-ing. Hãy sửa "${v2}" thành "${gerund}".`
        );
        return right;
      }
      return match;
    }
  );

  // 2.6. Modal verbs (can, could, should, would, will, must, may, might) + "to V" or "V-ing" or "V-s/V-ed"
  corrected = corrected.replace(
    /\b(can|cannot|can't|could|couldn't|should|shouldn't|would|wouldn't|will|won't|must|mustn't|may|might)\s+(?:(easily|also|really|definitely|certainly|always|never|not)\s+)?(to\s+)?([a-z]+)\b/gi,
    (match, modal, adv, toPart, verbWord) => {
      const lowerVerb = verbWord.toLowerCase();
      const lowerModal = modal.toLowerCase();
      // Skip "would like", "would rather", "would prefer", "would appreciate", "can be", "will be", etc. if already valid
      if (!toPart && ['be', 'have', 'do', 'like', 'love', 'prefer', 'rather', 'appreciate', 'recommend', 'suggest', 'consider', 'easily', 'also', 'not', 'never', 'always', 'definitely', 'certainly', 'really', 'you', 'i', 'we', 'they', 'he', 'she', 'it', 'there'].includes(lowerVerb)) {
        return match;
      }
      const advStr = adv ? `${adv} ` : '';
      if (toPart && GERUND_TARGET_VERBS.has(toBaseVerbForm(lowerVerb))) {
        const base = toBaseVerbForm(lowerVerb);
        const right = `${modal} ${advStr}${base}`;
        addError(
          'Lỗi động từ khuyết thiếu (Modal Verb)',
          match,
          right,
          `Sau động từ khuyết thiếu "${lowerModal}" dùng trực tiếp động từ nguyên mẫu (V0), không có "to". Hãy sửa thành "${right}".`
        );
        return right;
      }
      if (lowerVerb.endsWith('ing') && GERUND_TARGET_VERBS.has(toBaseVerbForm(lowerVerb))) {
        const base = toBaseVerbForm(lowerVerb);
        const right = `${modal} ${advStr}${base}`;
        addError(
          'Lỗi động từ khuyết thiếu (Modal Verb)',
          match,
          right,
          `Sau động từ khuyết thiếu "${lowerModal}" phải là động từ nguyên mẫu (V0), không dùng V-ing ("${verbWord}"). Hãy sửa thành "${right}".`
        );
        return right;
      }
      if ((lowerVerb.endsWith('s') || lowerVerb.endsWith('ed') || ['went', 'took', 'made', 'had', 'bought', 'saw', 'came', 'gave', 'wrote', 'sent', 'spent', 'left', 'met'].includes(lowerVerb)) &&
          !GERUND_TARGET_VERBS.has(lowerVerb) && GERUND_TARGET_VERBS.has(toBaseVerbForm(lowerVerb))) {
        const base = toBaseVerbForm(lowerVerb);
        if (base !== lowerVerb) {
          const right = `${modal} ${advStr}${base}`;
          addError(
            'Lỗi động từ khuyết thiếu (Modal Verb)',
            match,
            right,
            `Sau động từ khuyết thiếu "${lowerModal}" động từ phải ở dạng nguyên mẫu (V0), không chia thêm "-s/-es" hay quá khứ. Hãy sửa thành "${right}".`
          );
          return right;
        }
      }
      return match;
    }
  );

  // 2.7. "would like / 'd like / want / need / plan / decide / promise / offer + bare verb or V-ing" -> "to + V0"
  corrected = corrected.replace(
    /\b(would\s+like|'d\s+like|want|wants|wanted|need|needs|needed|plan|plans|planned|decide|decided|promise|promised)\s+([a-z]+)\b/gi,
    (match, v1, v2) => {
      const lowerV2 = v2.toLowerCase();
      if (lowerV2 === 'to' || lowerV2 === 'you' || lowerV2 === 'a' || lowerV2 === 'an' || lowerV2 === 'the' || lowerV2 === 'some' || lowerV2 === 'more' || lowerV2 === 'my' || lowerV2 === 'your' || lowerV2 === 'this' || lowerV2 === 'that' || lowerV2 === 'it') {
        return match;
      }
      const base = toBaseVerbForm(lowerV2);
      if (GERUND_TARGET_VERBS.has(lowerV2) || (lowerV2.endsWith('ing') && GERUND_TARGET_VERBS.has(base))) {
        const right = `${v1} to ${base}`;
        addError(
          'Lỗi cấu trúc To-Infinitive (to + V0)',
          match,
          right,
          `Sau "${v1}" cần dùng "to + động từ nguyên mẫu (V0)". Hãy sửa thành "${right}".`
        );
        return right;
      }
      return match;
    }
  );

  // 2.8. "I am writing (this letter/email) for + V0/V-ing" -> "to + V0"
  corrected = corrected.replace(
    /\b(writing(?:\s+this\s+letter|\s+this\s+email)?)\s+for\s+([a-z]+)\b/gi,
    (match, prefix, verbWord) => {
      const base = toBaseVerbForm(verbWord);
      if (GERUND_TARGET_VERBS.has(base)) {
        const right = `${prefix} to ${base}`;
        addError(
          'Lỗi cấu trúc chỉ mục đích (Purpose Infinitive)',
          match,
          right,
          `Để diễn tả mục đích viết thư ("để làm gì"), hãy dùng "to + V0" ("${right}") thay vì "for + ${verbWord}".`
        );
        return right;
      }
      return match;
    }
  );

  // 2.9. Missing verb "to be" before adjectives ("because it convenient", "the weather hot", "it very cheap")
  corrected = corrected.replace(
    /\b(because\s+it|since\s+it|as\s+it|and\s+it|but\s+it|so\s+it|^it|the\s+weather|the\s+food|the\s+hotel|the\s+price|the\s+room|the\s+service|everything)\s+(very\s+|really\s+|quite\s+|so\s+|too\s+|extremely\s+|usually\s+|always\s+|often\s+)?(convenient|inconvenient|cheap|expensive|affordable|reasonable|delicious|tasty|crowded|noisy|quiet|peaceful|friendly|helpful|kind|nice|good|great|wonderful|amazing|beautiful|hot|cold|warm|cool|sunny|rainy|suitable|important|necessary|easy|difficult|hard|safe|dangerous|comfortable|uncomfortable|broken|damaged|defective|busy|free|available)\b/gi,
    (match, subj, adv, adj) => {
      const right = `${subj} is ${adv || ''}${adj}`;
      addError(
        'Lỗi thiếu động từ "to be" (Missing Copula)',
        match,
        right,
        `Trong tiếng Anh, tính từ "${adj.toLowerCase()}" đứng sau chủ ngữ "${subj}" cần có động từ liên kết "is". Hãy sửa thành "${right}".`
      );
      return right;
    }
  );

  // 2.10. Adjective + bare verb or "to + V-ing" ("convenient travel", "convenient to traveling", "easy to visiting")
  corrected = corrected.replace(
    /\b(convenient|inconvenient|easy|difficult|hard|important|necessary|advisable|helpful|useful|great|wonderful)\s+to\s+([a-z]+ing)\b/gi,
    (match, adj, ving) => {
      const base = toBaseVerbForm(ving);
      if (GERUND_TARGET_VERBS.has(base)) {
        const right = `${adj} to ${base}`;
        addError(
          'Lỗi cấu trúc "Tính từ + to V0"',
          match,
          right,
          `Sau cấu trúc "It is + ${adj.toLowerCase()} + to..." cần dùng động từ nguyên mẫu (V0), không dùng V-ing. Hãy sửa thành "${right}".`
        );
        return right;
      }
      return match;
    }
  );

  corrected = corrected.replace(
    /\b(is\s+(?:very\s+|really\s+|quite\s+)?(?:convenient|inconvenient|easy|difficult|hard|important|necessary|advisable))\s+(travel|visit|go|move|stay|get|find|buy|learn|use|communicate|explore)\b/gi,
    (match, adjPart, v0) => {
      const right = `${adjPart} to ${v0}`;
      addError(
        'Lỗi thiếu "to" trước động từ (Missing Infinitive "to")',
        match,
        right,
        `Sau tính từ trong cấu trúc "${adjPart}" cần có "to + V0" ("${right}").`
      );
      return right;
    }
  );

  // 2.11. Word Form: Adjective used instead of Adverb before action verb ("can easy visit", "can convenient travel")
  const adjToAdvMap = {
    'easy': 'easily',
    'quick': 'quickly',
    'convenient': 'conveniently',
    'comfortable': 'comfortably',
    'direct': 'directly',
    'regular': 'regularly',
    'careful': 'carefully',
    'fluent': 'fluently',
    'safe': 'safely',
    'simple': 'simply',
    'clear': 'clearly'
  };
  corrected = corrected.replace(
    /\b(can|could|should|would|will|to)\s+(easy|quick|convenient|comfortable|direct|regular|careful|fluent|safe|simple|clear)\s+([a-z]+)\b/gi,
    (match, aux, adj, verbWord) => {
      const lowerVerb = verbWord.toLowerCase();
      if (GERUND_TARGET_VERBS.has(lowerVerb)) {
        const adv = adjToAdvMap[adj.toLowerCase()];
        const right = `${aux} ${adv} ${verbWord}`;
        addError(
          'Lỗi từ loại (Word Form: Tính từ vs Trạng từ)',
          match,
          right,
          `Trước động từ thường "${lowerVerb}", bạn cần dùng trạng từ "${adv}" (thay vì tính từ "${adj}") để bổ nghĩa cho hành động.`
        );
        return right;
      }
      return match;
    }
  );

  // 2.12. Prepositions, Articles & VSTEP Letter Collocations
  // "stay hotel" / "staying hotel" -> "stay at a hotel" / "staying at a hotel"
  corrected = corrected.replace(
    /\b(stay|stays|stayed|staying)\s+hotel\b/gi,
    (match, stayForm) => {
      const right = `${stayForm} at a hotel`;
      addError(
        'Lỗi thiếu giới từ & mạo từ (Preposition & Article)',
        match,
        right,
        `Cụm chuẩn tiếng Anh là "stay at a hotel" (ở tại một khách sạn) — cần có giới từ "at" và mạo từ "a" trước danh từ đếm được số ít "hotel".`
      );
      return right;
    }
  );

  // "stay at hotel" / "stay in hotel" -> "stay at a hotel"
  corrected = corrected.replace(
    /\b(stay|stays|stayed|staying)\s+(at|in)\s+hotel\b/gi,
    (match, stayForm) => {
      const right = `${stayForm} at a hotel`;
      addError(
        'Lỗi thiếu mạo từ (Missing Article)',
        match,
        right,
        `Danh từ "hotel" là danh từ đếm được số ít nên cần mạo từ "a" phía trước ("${right}").`
      );
      return right;
    }
  );

  // "in city center" / "in city centre" / "at city center" -> "in the city center"
  corrected = corrected.replace(
    /\b(in|at)\s+(city\s+cent(?:er|re))\b/gi,
    (match, prep, centerPart) => {
      const right = `in the ${centerPart}`;
      addError(
        'Lỗi giới từ & mạo từ (Preposition & Article)',
        match,
        right,
        `Cụm chỉ vị trí "tại trung tâm thành phố" chuẩn xác là "${right}" (dùng giới từ "in" và mạo từ xác định "the").`
      );
      return right;
    }
  );

  // "travel around city" -> "travel around the city"
  corrected = corrected.replace(
    /\b(around)\s+city\b/gi,
    (match, aroundWord) => {
      const right = `${aroundWord} the city`;
      addError(
        'Lỗi thiếu mạo từ (Missing Article)',
        match,
        right,
        `Cần có mạo từ xác định "the" trước danh từ "city" ("${right}").`
      );
      return right;
    }
  );

  // "in your letter, you ask me" -> "in your letter, you asked me"
  corrected = corrected.replace(
    /\b(in\s+your\s+(?:last\s+)?(?:letter|email)\s*,?\s*you)\s+ask\b/gi,
    (match, prefix) => {
      const right = `${prefix} asked`;
      addError(
        'Lỗi thì của động từ (Verb Tense)',
        match,
        right,
        `Việc người nhận hỏi bạn trong bức thư trước đã xảy ra trong quá khứ, nên động từ "ask" phải chia ở thì Quá khứ đơn là "asked".`
      );
      return right;
    }
  );

  // "If I were you, I will / can" or "If I am you" -> "If I were you, I would"
  corrected = corrected.replace(
    /\bif\s+i\s+(?:were|was|am)\s+you\s*,?\s*i\s+(will|can|may|shall)\b/gi,
    (match) => {
      const right = 'If I were you, I would';
      addError(
        'Lỗi câu điều kiện loại 2 (Conditional Type 2)',
        match,
        right,
        `Khi dùng cấu trúc giả định "If I were you" để đưa ra lời khuyên B2, mệnh đề chính phải dùng "I would + V0" (không dùng "will/can").`
      );
      return right;
    }
  );

  // "I would appreciate if you" -> "I would appreciate it if you"
  corrected = corrected.replace(
    /\b(would\s+appreciate)\s+if\s+you\b/gi,
    (match, appPart) => {
      const right = `${appPart} it if you`;
      addError(
        'Lỗi cấu trúc B2 (appreciate it if...)',
        match,
        right,
        `Trong cấu trúc đề nghị lịch sự B2, sau "would appreciate" bắt buộc có đại từ tân ngữ giả "it" trước "if you" ("I would appreciate it if you could...").`
      );
      return right;
    }
  );

  // Common VSTEP Preposition Collocation errors
  const collocationFixes = [
    { regex: /\bdiscuss\s+about\b/gi, right: 'discuss', cat: 'Lỗi thừa giới từ (Redundant Preposition)', exp: 'Động từ "discuss" là ngoại động từ đi trực tiếp với tân ngữ, không dùng giới từ "about" theo sau.' },
    { regex: /\bexplain\s+(me|you|him|her|us|them)\b/gi, rightFn: (m, p) => `explain to ${p}`, cat: 'Lỗi thiếu giới từ (Missing Preposition)', exp: 'Cấu trúc đúng của động từ "explain" là "explain (something) to somebody" — phải có giới từ "to" trước tân ngữ chỉ người.' },
    { regex: /\bmarried\s+with\b/gi, right: 'married to', cat: 'Lỗi giới từ (Preposition)', exp: 'Cấu trúc "kết hôn với ai" trong tiếng Anh dùng giới từ "to" ("married to"), không dùng "with".' },
    { regex: /\bdepend\s+(in|of|at)\b/gi, right: 'depend on', cat: 'Lỗi giới từ (Preposition)', exp: 'Động từ "depend" luôn đi với giới từ "on" ("depend on": phụ thuộc vào).' },
    { regex: /\binterested\s+(on|at)\b/gi, right: 'interested in', cat: 'Lỗi giới từ (Preposition)', exp: 'Tính từ "interested" đi với giới từ "in" ("be interested in": quan tâm/thích thú với).' },
    { regex: /\bdifferent\s+(with|than)\b/gi, right: 'different from', cat: 'Lỗi giới từ (Preposition)', exp: 'Tính từ "different" chuẩn văn viết đi với giới từ "from" ("different from": khác với).' },
    { regex: /\barrive\s+to\b/gi, right: 'arrive in', cat: 'Lỗi giới từ (Preposition)', exp: 'Động từ "arrive" đi với giới từ "in" (thành phố/quốc gia) hoặc "at" (địa điểm cụ thể), không đi với "to".' },
    { regex: /\byour\s+sincerely\b/gi, right: 'Yours sincerely', cat: 'Lỗi lời chào kết thư (Sign-off)', exp: 'Cụm chào kết thư trang trọng phải dùng đại từ sở hữu có "-s" là "Yours sincerely," (không phải "Your").' },
    { regex: /\byour\s+faithfully\b/gi, right: 'Yours faithfully', cat: 'Lỗi lời chào kết thư (Sign-off)', exp: 'Cụm chào kết thư trang trọng phải dùng đại từ sở hữu có "-s" là "Yours faithfully," (không phải "Your").' },
    { regex: /\bbest\s+wish\b/gi, right: 'Best wishes', cat: 'Lỗi lời chào kết thư (Sign-off)', exp: 'Cụm lời chúc kết thư thân mật luôn ở dạng số nhiều là "Best wishes,".' },
    { regex: /\bwarm\s+regard\b/gi, right: 'Warm regards', cat: 'Lỗi lời chào kết thư (Sign-off)', exp: 'Cụm chào kết thư luôn ở dạng số nhiều là "Warm regards,".' },
    { regex: /\b(this)\s+(suggestions|questions|problems|places|activities|restaurants|shops|attractions|ideas|tips)\b/gi, rightFn: (m, d, n) => `these ${n}`, cat: 'Lỗi hòa hợp từ hạn định (Determiner Agreement)', exp: 'Trước danh từ số nhiều cần dùng "these" (thay vì số ít "this").' },
    { regex: /\b(these|those|many|several|various|different)\s+(suggestion|question|problem|place|restaurant|shop|attraction|idea|tip)\b/gi, rightFn: (m, d, n) => `${d} ${n}s`, cat: 'Lỗi danh từ số ít / số nhiều (Singular/Plural)', exp: 'Sau từ chỉ số lượng nhiều ("these, many, several, various, different...") danh từ đếm được phải thêm "-s/-es" ở dạng số nhiều.' }
  ];

  collocationFixes.forEach(rule => {
    corrected = corrected.replace(rule.regex, (...args) => {
      const match = args[0];
      const right = rule.rightFn ? rule.rightFn(...args) : rule.right;
      addError(rule.cat, match, right, rule.exp);
      return right;
    });
  });

  // 2.13. Uncountable nouns wrongly pluralized
  const uncountableMap = {
    'advices': 'advice',
    'informations': 'information',
    'equipments': 'equipment',
    'furnitures': 'furniture',
    'luggages': 'luggage',
    'baggages': 'baggage',
    'homeworks': 'homework',
    'knowledges': 'knowledge',
    'sceneries': 'scenery',
    'traffics': 'traffic',
    'weathers': 'weather'
  };
  corrected = corrected.replace(
    /\b(advices|informations|equipments|furnitures|luggages|baggages|homeworks|knowledges|sceneries|traffics|weathers)\b/gi,
    (match) => {
      const right = uncountableMap[match.toLowerCase()];
      addError(
        'Lỗi danh từ không đếm được (Uncountable Noun)',
        match,
        right,
        `"${right}" là danh từ không đếm được trong tiếng Anh nên tuyệt đối không thêm "-s/-es". Hãy sửa thành "${right}".`
      );
      return right;
    }
  );

  // 2.13b. Countable nouns in general plural context (matching ex.en plural nouns when no singular determiner is used)
  const countableSingToPlur = {
    'restaurant': 'restaurants',
    'shop': 'shops',
    'attraction': 'attractions',
    'museum': 'museums',
    'pagoda': 'pagodas',
    'temple': 'temples',
    'park': 'parks',
    'place': 'places',
    'activity': 'activities',
    'dish': 'dishes',
    'question': 'questions',
    'suggestion': 'suggestions',
    'souvenir': 'souvenirs',
    'friend': 'friends'
  };
  const refLowerWordsSet = new Set((ex.en || '').toLowerCase().replace(/[^a-z\s]/g, ' ').split(/\s+/).filter(Boolean));
  Object.entries(countableSingToPlur).forEach(([sing, plur]) => {
    if (!refLowerWordsSet.has(plur) || refLowerWordsSet.has(sing)) return;
    const regex = new RegExp(`\\b(${sing})\\b`, 'gi');
    corrected = corrected.replace(regex, (match, word, offset, fullStr) => {
      const before = fullStr.slice(Math.max(0, offset - 20), offset).toLowerCase();
      if (/\b(a|an|the|this|that|one|each|every|another|my|your|his|her|our|their|favourite|favorite)\s+(?:[a-z]+\s+)?$/.test(before)) {
        return match;
      }
      const right = /^[A-Z]/.test(word) ? plur.charAt(0).toUpperCase() + plur.slice(1) : plur;
      addError(
        'Lỗi danh từ số ít / số nhiều (Singular/Plural)',
        match,
        right,
        `Khi nhắc đến các danh từ đếm được nói chung không có mạo từ "a/an/the" phía trước, bạn cần dùng dạng số nhiều "${right}" (thay vì số ít "${match}").`
      );
      return right;
    });
  });

  // 2.14. Subject-Verb Agreement with singular subjects (it / he / she / the hotel / the weather / everything)
  const svSingularMap = {
    'have': 'has', 'help': 'helps', 'make': 'makes', 'give': 'gives', 'take': 'takes',
    'bring': 'brings', 'offer': 'offers', 'provide': 'provides', 'allow': 'allows',
    'need': 'needs', 'want': 'wants', 'seem': 'seems', 'look': 'looks', 'work': 'works',
    'live': 'lives', 'like': 'likes', 'love': 'loves', 'cost': 'costs', 'include': 'includes'
  };
  corrected = corrected.replace(
    /\b(it|he|she|everything|everyone|everybody)\s+(always\s+|usually\s+|often\s+|really\s+|also\s+)?(have|help|make|give|take|bring|offer|provide|allow|need|want|seem|look|work|live|like|love|cost|include)\b/gi,
    (match, subj, adv, verbWord, offset, fullStr) => {
      // Do not trigger if preceded by modal/auxiliary like "can it help", "make it work", "let he/it..."
      const before = fullStr.slice(Math.max(0, offset - 18), offset).toLowerCase();
      if (/\b(can|could|should|would|will|must|may|might|did|didn't|does|doesn't|let|make|makes|made|help|helps|helped)\s+$/.test(before)) {
        return match;
      }
      const singVerb = svSingularMap[verbWord.toLowerCase()];
      const right = `${subj} ${adv || ''}${singVerb}`;
      addError(
        'Lỗi hòa hợp chủ ngữ - động từ (Subject-Verb Agreement)',
        match,
        right,
        `Chủ ngữ "${subj}" là ngôi thứ 3 số ít nên động từ ở thì Hiện tại đơn phải chia số ít ("${singVerb}" thay vì "${verbWord}").`
      );
      return right;
    }
  );

  // 2.15. Salutation & Sign-off specific checks
  if (ex.role === 'salutation') {
    if (/^dear\s+my\s+([a-z]+)/i.test(corrected)) {
      const m = corrected.match(/^dear\s+my\s+([a-z]+)/i);
      const targetSal = ex.en || 'Dear Friend,';
      addError(
        'Lỗi cấu trúc lời chào mở thư (Salutation)',
        m[0],
        targetSal.replace(/,$/, ''),
        `Trong tiếng Anh không dùng "Dear my...". Bạn hãy gọi trực tiếp tên người nhận (ví dụ: "${targetSal}") hoặc "Dear Sir or Madam,".`
      );
      corrected = targetSal;
    }
  }

  if (ex.role === 'signoff') {
    // Check if student signed their real name after sign-off
    const signMatch = corrected.match(/^(best wishes|warm regards|all the best|yours sincerely|yours faithfully|sincerely|regards|love|take care)\s*,?\s+([a-zA-Z].*)$/i);
    if (signMatch) {
      const cleanSignoff = signMatch[1].charAt(0).toUpperCase() + signMatch[1].slice(1) + ',';
      addError(
        'Lỗi quy chế thi VSTEP (Không ký tên thật)',
         corrected,
        cleanSignoff,
        `Đề thi VSTEP quy định tuyệt đối KHÔNG ghi tên thật của bạn ở cuối thư (để bảo mật bài thi). Hãy xóa phần tên "${signMatch[2]}" và chỉ giữ lại "${cleanSignoff}".`
      );
      corrected = cleanSignoff;
    }
  }

  // 2.16. Formal Register Contractions Check
  if (isFormal) {
    const formalContractionMap = {
      "i'm": "I am", "i'd": "I would", "i'll": "I will", "i've": "I have",
      "don't": "do not", "doesn't": "does not", "didn't": "did not",
      "can't": "cannot", "couldn't": "could not", "won't": "will not",
      "wouldn't": "would not", "shouldn't": "should not",
      "isn't": "is not", "aren't": "are not", "wasn't": "was not", "weren't": "were not",
      "haven't": "have not", "hasn't": "has not", "it's": "it is", "that's": "that is"
    };
    corrected = corrected.replace(
      /\b(i'm|i'd|i'll|i've|don't|doesn't|didn't|can't|couldn't|won't|wouldn't|shouldn't|isn't|aren't|wasn't|weren't|haven't|hasn't|it's|that's)\b/gi,
      (match) => {
        const full = formalContractionMap[match.toLowerCase()] || match;
        addError(
          'Lỗi văn phong Trang trọng (Formal Register)',
          match,
          full,
          `Đây là bức thư Trang trọng (Formal Letter), bạn không nên viết tắt ("${match}"). Hãy viết đầy đủ thành "${full}".`
        );
        return full;
      }
    );
  }

  // ---------------------------------------------------------------------------
  // 3. PUNCTUATION & CAPITALIZATION CHECKS
  // ---------------------------------------------------------------------------

  // 3.1. Missing comma after introductory connector at start of sentence
  corrected = corrected.replace(
    /^(Firstly|Second|Secondly|Thirdly|Finally|Lastly|To begin with|First of all|In addition|Furthermore|Moreover|Besides|On top of that|However|Therefore|Nevertheless|Meanwhile|Personally|Fortunately|Unfortunately)\s+([a-zA-Z])/i,
    (match, conn, nextChar) => {
      const capConn = conn.charAt(0).toUpperCase() + conn.slice(1);
      const right = `${capConn}, ${nextChar}`;
      addError(
        'Lỗi dấu câu (Thiếu dấu phẩy sau từ nối)',
        `${conn} ${nextChar}`,
        right,
        `Sau từ/cụm từ nối mở đầu câu ("${capConn}") cần có dấu phẩy (,) để tách biệt với mệnh đề chính.`
      );
      return right;
    }
  );

  // 3.2. Lowercase pronoun "i"
  corrected = corrected.replace(/\bi\b/g, (match) => {
    addError('Lỗi viết hoa (Capitalization)', 'i', 'I', 'Đại từ nhân xưng ngôi thứ nhất "I" trong tiếng Anh luôn luôn phải viết hoa.');
    return 'I';
  });

  // 3.3. First character of sentence must be capitalized
  if (corrected.length > 0 && /^[a-z]/.test(corrected)) {
    const firstWord = corrected.split(/\s+/)[0];
    const capFirstWord = firstWord.charAt(0).toUpperCase() + firstWord.slice(1);
    addError(
      'Lỗi viết hoa đầu câu (Capitalization)',
      firstWord,
      capFirstWord,
      `Chữ cái đầu tiên của câu ("${firstWord}") bắt buộc phải viết hoa ("${capFirstWord}").`
    );
    corrected = corrected.charAt(0).toUpperCase() + corrected.slice(1);
  }

  // 3.4. Ending punctuation according to role
  if (ex.role === 'salutation' || ex.role === 'signoff') {
    if (!corrected.endsWith(',')) {
      const stripped = corrected.replace(/[.!?]+$/, '');
      const right = stripped + ',';
      addError(
        'Lỗi dấu câu (Punctuation)',
        corrected,
        right,
        ex.role === 'salutation'
          ? 'Cuối dòng lời chào mở đầu thư (Dear ...,) bắt buộc phải có dấu phẩy (,).'
          : 'Cuối dòng lời chào kết thúc thư (Best wishes, / Yours sincerely,) bắt buộc phải có dấu phẩy (,).'
      );
      corrected = right;
    }
  } else {
    // Check if first clause is a direct question ending with a period instead of question mark
    if (/^(How have you been(?:\s+lately|\s+recently)?|How are you(?:\s+doing)?|How is everything(?:\s+going)?)\s*\./i.test(corrected)) {
      corrected = corrected.replace(/^(How have you been(?:\s+lately|\s+recently)?|How are you(?:\s+doing)?|How is everything(?:\s+going)?)\s*\./i, (m, qPart) => {
        const right = `${qPart}?`;
        addError('Lỗi dấu câu hỏi (Question Mark)', m, right, `Câu hỏi thăm trực tiếp "${qPart}" cần kết thúc bằng dấu chấm hỏi (?) thay vì dấu chấm (.).`);
        return right;
      });
    }
    if (!/[.!?]$/.test(corrected)) {
      const isDirectQuestion = /^(How|What|Where|When|Why|Who|Which|Could you|Would you|Can you|Will you|Do you|Have you|Are you)\b/i.test(corrected) && !/\bI\s+(?:hope|am|would|want)\b/i.test(corrected);
      const endPunct = isDirectQuestion ? '?' : '.';
      const lastWord = corrected.split(/\s+/).pop();
      addError(
        'Lỗi dấu câu kết thúc (Ending Punctuation)',
        lastWord,
        lastWord + endPunct,
        `Cuối câu văn tiếng Anh cần có dấu kết thúc câu (${endPunct === '?' ? 'dấu chấm hỏi "?"' : 'dấu chấm "."'}).`
      );
      corrected = corrected + endPunct;
    }
  }

  // ---------------------------------------------------------------------------
  // 4. B2 EXPRESSION UPGRADE SUGGESTIONS (Gợi ý nâng cấp từ B1 lên B2)
  // ---------------------------------------------------------------------------
  if (/\bfirstly,\s+you\s+can\b/i.test(corrected) && /\bto begin with,\s+you\s+could\b/i.test(ex.en)) {
    b2Upgrades.push('Thay <code>"Firstly, you can..."</code> bằng <strong><code>"To begin with, you could..."</code></strong> để lời khuyên nghe mềm mại, lịch sự và ăn điểm cấu trúc B2 hơn.');
  } else if (/\byou\s+can\s+consider\b/i.test(corrected) && /\byou\s+could\s+consider\b/i.test(ex.en)) {
    b2Upgrades.push('Dùng trợ động từ tình thái <strong><code>"you could consider..."</code></strong> (thay cho <code>"you can consider..."</code>) giúp giọng văn đưa lời khuyên lịch sự và chuẩn B2 hơn.');
  }
  if (/\bsecond(?:ly)?,\s+you\s+can\b/i.test(corrected) && /\b(in addition|furthermore|moreover)\b/i.test(ex.en)) {
    b2Upgrades.push('Thay <code>"Second/Secondly, you can..."</code> bằng <strong><code>"In addition, ..."</code></strong> hoặc <strong><code>"Furthermore, ..."</code></strong> để tăng điểm liên kết câu (Coherence & Cohesion) ở bậc B2.');
  }
  if (/\bi\s+want\s+to\s+(share|tell|ask|invite|apologize|complain)\b/i.test(corrected)) {
    b2Upgrades.push('Thay <code>"I want to..."</code> (mức A2/B1) bằng <strong><code>"I would like to..."</code></strong> hoặc <strong><code>"I am writing to..."</code></strong> để câu văn trang nhã, lịch sự chuẩn B2.');
  }

  // ---------------------------------------------------------------------------
  // 5. IDEA & COLLOCATION COMPLETENESS CHECK AGAINST VIETNAMESE PROMPT
  // ---------------------------------------------------------------------------
  const normalizeText = (s) => (s || '').toLowerCase()
    .replace(/\bcentre\b/g, 'center')
    .replace(/\btravelling\b/g, 'traveling')
    .replace(/\btravelled\b/g, 'traveled')
    .replace(/\bapologise\b/g, 'apologize')
    .replace(/\bapologising\b/g, 'apologizing')
    .replace(/\borganise\b/g, 'organize')
    .replace(/\borganising\b/g, 'organizing')
    .replace(/[^a-z0-9\s']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const normUser = normalizeText(corrected);
  const normUserWords = normUser.split(/\s+/).filter(Boolean);
  const normUserStems = new Set(normUserWords.map(w => toBaseVerbForm(w)));
  normUserWords.forEach(w => normUserStems.add(w));

  const stopWords = new Set(['the', 'a', 'an', 'to', 'of', 'in', 'on', 'at', 'for', 'and', 'or', 'is', 'are', 'am', 'be', 'it', 'this', 'that', 'with', 'you', 'your', 'my', 'i']);
  const normRefWords = normalizeText(ex.en).split(/\s+/).filter(w => w && !stopWords.has(w));

  let matchedRefCount = 0;
  normRefWords.forEach(rw => {
    const rwStem = toBaseVerbForm(rw);
    if (normUserStems.has(rw) || normUserStems.has(rwStem)) {
      matchedRefCount++;
    }
  });
  const ratio = normRefWords.length > 0 ? Math.min(100, Math.round((matchedRefCount / normRefWords.length) * 100)) : 85;

  // Check each non-formula vocab/collocation hint in ex.hints
  const matchedHints = [];
  const missingHints = [];
  if (ex.role !== 'salutation' && ex.role !== 'signoff' && Array.isArray(ex.hints)) {
    ex.hints.forEach(h => {
      if (!h || !h.en) return;
      // Skip formula hints containing brackets or meta labels
      if (/\[|\]|\bV-ing\b|\bV0\b|Công thức|Khung cấu trúc|Lưu ý/i.test(h.en + ' ' + (h.vi || ''))) return;
      const hintWords = normalizeText(h.en).split(/\s+/).filter(w => w.length > 2 && !stopWords.has(w));
      if (hintWords.length === 0) return;
      const hitCount = hintWords.filter(hw => normUserStems.has(hw) || normUserStems.has(toBaseVerbForm(hw))).length;
      if (hitCount >= Math.ceil(hintWords.length * 0.6)) {
        matchedHints.push(h);
      } else {
        missingHints.push(h);
      }
    });
  }

  // Save corrected sentence for 1-click apply
  if (!state.lastCorrectedSentences) state.lastCorrectedSentences = {};
  state.lastCorrectedSentences[idx] = corrected;

  // ---------------------------------------------------------------------------
  // 6. BUILD RICH, CLEAR FEEDBACK HTML
  // ---------------------------------------------------------------------------
  const blocksHtml = [];

  if (structuredErrors.length > 0) {
    const errorCardsHtml = structuredErrors.map((err, i) => `
      <div class="sent-error-item">
        <div class="sent-error-item-head">
          <span class="sent-error-num">LỖI ${i + 1}</span>
          <span class="sent-error-cat">${escapeHtml(err.category)}</span>
        </div>
        <div class="sent-error-change">
          <span>Trong câu của bạn: <del class="sent-err-del">${escapeHtml(err.wrongText)}</del></span>
          <span style="color: var(--text-muted); font-weight: 700;">&rarr;</span>
          <span>Đề xuất sửa thành: <ins class="sent-err-ins">${escapeHtml(err.rightText)}</ins></span>
        </div>
        <div class="sent-error-exp">💡 <strong>Giải thích:</strong> ${escapeHtml(err.explanation)}</div>
      </div>
    `).join('');

    const inlineDiffHtml = buildInlineWordDiffHtml(trimmed, corrected);

    blocksHtml.push(`
      <div class="sent-feedback-section">
        <div class="sent-section-label" style="color: var(--danger);">🔍 1. NHẬN DIỆN LỖI & ĐỀ XUẤT CHỈNH SỬA TRÊN CÂU CỦA BẠN:</div>
        <div class="sent-error-list">${errorCardsHtml}</div>
      </div>

      <div class="sent-feedback-section">
        <div class="sent-section-label" style="color: var(--success);">✍️ 2. CÂU CỦA BẠN SAU KHI SỬA LỖI NGỮ PHÁP & CHÍNH TẢ:</div>
        <div class="sent-diff-preview">
          <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.25rem; font-weight: 600;">Vết chỉnh sửa trực tiếp trên câu bạn viết:</div>
          <div style="font-size: 0.94rem; line-height: 1.6;">${inlineDiffHtml}</div>
        </div>
        <div class="sent-corrected-clean">
          <div style="flex: 1; min-width: 0;">
            <div style="font-size: 0.78rem; color: var(--success); font-weight: 700; margin-bottom: 0.2rem;">✓ Gợi ý câu của bạn sau khi hoàn thiện ngữ pháp & chính tả (hãy tự gõ lại để ghi nhớ nhé):</div>
            <div style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); line-height: 1.5;">${escapeHtml(corrected)}</div>
          </div>
        </div>
      </div>
    `);
  } else {
    blocksHtml.push(`
      <div class="sent-feedback-section">
        <div class="sent-grammar-ok-box">
          ✅ <strong>Ngữ pháp & Chính tả:</strong> Câu bạn viết (<code>"${escapeHtml(trimmed)}"</code>) hoàn toàn <strong>đúng ngữ pháp và chính tả</strong>!
        </div>
      </div>
    `);
  }

  if (b2Upgrades.length > 0) {
    blocksHtml.push(`
      <div class="sent-feedback-section">
        <div class="sent-b2-upgrade-box">
          <div style="font-weight: 700; color: var(--accent-primary); margin-bottom: 0.25rem;">💎 GỢI Ý NÂNG CẤP DIỄN ĐẠT LÊN CHUẨN B2:</div>
          <ul style="margin: 0; padding-left: 1.2rem; display: flex; flex-direction: column; gap: 0.25rem;">
            ${b2Upgrades.map(u => `<li>${u}</li>`).join('')}
          </ul>
        </div>
      </div>
    `);
  }

  if (ex.role !== 'salutation' && ex.role !== 'signoff' && (matchedHints.length > 0 || missingHints.length > 0)) {
    const stepNum = structuredErrors.length > 0 ? 3 : 2;
    blocksHtml.push(`
      <div class="sent-feedback-section">
        <div class="sent-section-label" style="color: var(--accent-primary);">📌 ${stepNum}. ĐỐI CHIẾU ĐỘ ĐẦY ĐỦ Ý VỚI CÂU ĐỀ BÀI TIẾNG VIỆT:</div>
        <div class="sent-completeness-box">
          ${matchedHints.length > 0 ? `
            <div style="margin-bottom: ${missingHints.length > 0 ? '0.55rem' : '0'};">
              <div style="font-size: 0.82rem; font-weight: 700; color: var(--success); margin-bottom: 0.3rem;">✅ Ý bạn đã diễn đạt được trong câu:</div>
              <div class="sent-hint-Wait-tags">
                ${matchedHints.map(h => `<span class="sent-idea-chip chip-matched">✓ <strong>${escapeHtml(h.en)}</strong> <em>(${escapeHtml(h.vi)})</em></span>`).join('')}
              </div>
            </div>
          ` : ''}
          ${missingHints.length > 0 ? `
            <div>
              <div style="font-size: 0.82rem; font-weight: 700; color: var(--warning); margin-bottom: 0.3rem;">➕ Các ý trong câu tiếng Việt bạn chưa đề cập (hãy viết nối tiếp để hoàn chỉnh câu):</div>
              <div class="sent-hint-Wait-tags">
                ${missingHints.map(h => `<span class="sent-idea-chip chip-missing">+ <strong>${escapeHtml(h.en)}</strong>: ${escapeHtml(h.vi)}</span>`).join('')}
              </div>
            </div>
          ` : `
            <div style="font-size: 0.86rem; color: var(--success); font-weight: 600;">
              🎉 Tuyệt vời! Câu của bạn đã bao phủ đầy đủ các cụm ý chính của câu đề bài tiếng Việt.
            </div>
          `}
        </div>
      </div>
    `);
  }

  const hasErrors = structuredErrors.length > 0;
  let color = 'var(--success)';
  let badge = '🌟 RẤT TỐT — ĐÚNG NGỮ PHÁP & ĐẦY ĐỦ Ý B2';

  if (hasErrors) {
    color = 'var(--danger)';
    badge = `🔍 PHẢN HỒI CHI TIẾT: CẦN CHỈNH SỬA ${structuredErrors.length} LỖI TRONG CÂU CỦA BẠN`;
  } else if (missingHints.length > 0 || ratio < 65) {
    color = 'var(--warning)';
    badge = '✅ ĐÚNG NGỮ PHÁP — HÃY BỔ SUNG THÊM Ý ĐỂ HOÀN CHỈNH CÂU';
  }

  return {
    percent: ratio,
    errorCount: structuredErrors.length,
    color,
    badge,
    feedbackHtml: blocksHtml.join('')
  };
}

// ============================================================================
// 10. STEP 3: TIMER, ANTI-CHEAT, DRAFT SAVING & VSTEP B2 EVALUATION
// ============================================================================
function toggleTimer() {
  if (state.timerRunning) {
    pauseTimer();
  } else {
    startTimer();
  }
}

function startTimer() {
  if (state.timerRunning) return;
  state.timerRunning = true;
  const btn = document.getElementById('timer-toggle-btn');
  if (btn) {
    btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`;
  }
  if (state.timerInterval) clearInterval(state.timerInterval);
  state.timerInterval = setInterval(() => {
    if (state.timerSeconds > 0) {
      state.timerSeconds--;
      updateTimerUI();
    } else {
      pauseTimer();
      showToast('⏰ Đã hết 20 phút làm bài VSTEP Task 1! Bạn hãy kiểm tra lại và nộp bài nhé.', 'warning');
    }
  }, 1000);
}

function pauseTimer() {
  state.timerRunning = false;
  if (state.timerInterval) clearInterval(state.timerInterval);
  const btn = document.getElementById('timer-toggle-btn');
  if (btn) {
    btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
  }
}

function resetTimer() {
  pauseTimer();
  state.timerSeconds = 1200; // 20 minutes
  updateTimerUI();
}

function updateTimerUI() {
  const disp = document.getElementById('timer-display');
  if (!disp) return;
  const mins = Math.floor(state.timerSeconds / 60);
  const secs = state.timerSeconds % 60;
  disp.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  disp.style.color = state.timerSeconds <= 180 ? 'var(--danger)' : 'var(--warning)';
}

function countWords(text) {
  const trimmed = (text || '').trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).filter(Boolean).length;
}

function handleTextareaInput(skipDraftSave = false) {
  const textarea = document.getElementById('essay-textarea');
  const wordsEl = document.getElementById('words-typed');
  const barEl = document.getElementById('word-progress-bar');
  const charEl = document.getElementById('char-count');
  if (!textarea) return;

  const text = textarea.value;
  const words = countWords(text);
  const chars = text.length;

  if (wordsEl) {
    wordsEl.textContent = words;
    wordsEl.style.color = words >= 120 ? 'var(--success)' : (words >= 90 ? 'var(--warning)' : 'var(--text-primary)');
  }
  if (barEl) {
    const pct = Math.min(100, Math.round((words / 120) * 100));
    barEl.style.width = `${pct}%`;
    barEl.classList.toggle('target-met', words >= 120);
  }
  if (charEl) {
    charEl.textContent = `${chars} ký tự`;
  }

  if (!skipDraftSave && state.activeTopic) {
    const topicId = state.activeTopic.id;
    if (!state.drafts[topicId]) {
      state.drafts[topicId] = {
        topicId,
        topicTitle: state.activeTopic.title_vi || state.activeTopic.title_en,
        catNum: state.activeTopic.catNum || 1,
        categoryTitleVi: state.activeTopic.categoryTitleVi || '',
        translations: {},
        essayText: '',
        updatedAt: ''
      };
    }
    state.drafts[topicId].essayText = text;
    state.drafts[topicId].updatedAt = new Date().toLocaleString('vi-VN');
    persistDrafts();
  }
}

function persistDrafts() {
  try {
    localStorage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(state.drafts));
  } catch (e) {}
}

function saveProgressAction(silent = false) {
  if (!state.activeTopic) return;
  handleTextareaInput(false);
  if (!silent) {
    showToast('💾 Đã sao lưu toàn bộ tiến độ dịch câu và bài viết vào Bản nháp!', 'success');
  }
}

function clearProgressAction() {
  if (!state.activeTopic) return;
  if (!confirm('Bạn có chắc chắn muốn xóa toàn bộ bản nháp và các câu đang gõ của đề này để làm lại từ đầu?')) return;

  const topicId = state.activeTopic.id;
  delete state.drafts[topicId];
  persistDrafts();

  const textarea = document.getElementById('essay-textarea');
  if (textarea) textarea.value = '';
  handleTextareaInput(true);
  renderTranslationExercises();
  showToast('Đã xóa bản nháp của chủ đề hiện tại.', 'info');
}

function copyEssay() {
  const textarea = document.getElementById('essay-textarea');
  if (!textarea || !textarea.value.trim()) {
    showToast('Chưa có nội dung bài viết để sao chép!', 'warning');
    return;
  }
  navigator.clipboard.writeText(textarea.value).then(() => {
    showToast('📋 Đã sao chép bài viết vào bộ nhớ tạm!', 'success');
  }).catch(() => {});
}

// --- Anti-Cheat Handlers (Strictly Block Copy/Cut/Paste/Drop in Writing Boxes) ---
function handleEditorPaste(event) {
  event.preventDefault();
  showToast('🚫 Không cho phép Dán (Paste) văn bản! Bạn vui lòng tự đánh máy lại để rèn phản xạ viết bài nhé.', 'danger');
}

function handleEditorCopyCut(event) {
  event.preventDefault();
  showToast('🚫 Không thể Sao chép / Cắt (Copy / Cut) trực tiếp trong khung viết bài.', 'warning');
}

function handleEditorDrop(event) {
  event.preventDefault();
}

function handleEditorContextMenu(event) {
  event.preventDefault();
}

function setupAntiCheatVisibilityWatcher() {
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) return;
    if (state.isTeacher) return;
    if (state.currentScreen !== 'workspace' || state.activeStep !== 'write' || !state.examModeActive || state.isSubmitted) return;

    const textarea = document.getElementById('essay-textarea');
    if (!textarea || countWords(textarea.value) < 5) return;

    state.cheatStrikes++;
    const modal = document.getElementById('cheat-warning-modal');
    const strikeEl = document.getElementById('cheat-strike-count');
    const msgEl = document.getElementById('cheat-modal-message');

    if (state.cheatStrikes > 2) {
      textarea.value = '';
      handleTextareaInput();
      state.cheatStrikes = 0;
      if (msgEl) msgEl.textContent = 'Bạn đã rời khỏi màn hình làm bài quá 2 lần quy định. Bài viết hiện tại đã bị xóa trắng để đảm bảo tính nghiêm túc của phòng thi!';
    } else {
      if (msgEl) msgEl.textContent = 'Hệ thống phát hiện bạn vừa chuyển tab hoặc rời khỏi màn hình khi đang làm bài ở Bước 3.';
    }
    if (strikeEl) strikeEl.textContent = state.cheatStrikes;
    if (modal) modal.style.display = 'flex';
  });
}

function acknowledgeCheatWarning() {
  const modal = document.getElementById('cheat-warning-modal');
  if (modal) modal.style.display = 'none';
}

// --- VSTEP Task 1 B2 Evaluation Engine ---
function detectPromptCopying(text, topic) {
  if (!text || !topic || !topic.prompt) return false;
  const cleanSub = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  const cleanPrompt = topic.prompt.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  if (cleanSub.length > 40 && cleanPrompt.includes(cleanSub.substring(0, 55))) return true;
  if (/you should write at least 120 words|do not include your name/i.test(text)) return true;
  return false;
}

function evaluateLetterB2(text, topic) {
  const words = countWords(text);
  const lower = text.toLowerCase();
  const paras = text.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
  const lines = text.split(/\n/).map(l => l.trim()).filter(Boolean);
  const isFormal = /formal/i.test(topic.recipient_type || topic.details?.analysis?.letter_type || '') && !/informal/i.test(topic.recipient_type || topic.details?.analysis?.letter_type || '');

  // Check Salutation & Sign-off
  const hasSalutation = /^dear\s+[a-z]/i.test(lines[0] || '');
  const lastLine = lines[lines.length - 1] || '';
  const hasSignoff = /^(best wishes|warm regards|all the best|yours sincerely|yours faithfully|sincerely|regards|love|take care)/i.test(lastLine) ||
    (lines.length >= 2 && /^(best wishes|warm regards|all the best|yours sincerely|yours faithfully|sincerely|regards)/i.test(lines[lines.length - 2]));

  // Check Contractions in Formal Letter
  const contractionsFound = [];
  if (isFormal) {
    const m = text.match(/\b(I'm|I’m|don't|don’t|can't|can’t|won't|won’t|didn't|didn’t|isn't|isn’t|aren't|aren’t|I'd|I’d|I'll|I’ll)\b/gi);
    if (m) contractionsFound.push(...new Set(m));
  }

  // Check Connectors
  const connectorPatterns = ['first of all', 'firstly', 'to begin with', 'second,', 'secondly', 'next,', 'in addition', 'furthermore', 'moreover', 'besides', 'on top of that', 'finally', 'last but not least', 'however', 'therefore', 'overall,', 'in particular', 'specifically', 'in fact', 'given these circumstances', 'to make up for', 'to enhance', 'regarding', 'as for'];
  const usedConnectors = connectorPatterns.filter(c => lower.includes(c));

  // Check Topic Vocabulary Matches
  const topicVocab = topic.details?.vocab || [];
  const matchedVocab = [];
  const unmatchedVocab = [];
  topicVocab.forEach(v => {
    const coreWords = v.en.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 3);
    const hit = lower.includes(v.en.toLowerCase()) || (coreWords.length > 0 && coreWords.filter(cw => lower.includes(cw)).length >= Math.ceil(coreWords.length * 0.65));
    if (hit) matchedVocab.push(v);
    else unmatchedVocab.push(v);
  });

  // Grammar & Mechanics Diagnostics
  const grammarIssues = [];
  let m;
  const modalIng = /\b(should|can|could|would|will|must|may|might)\s+([a-z]+ing)\b/gi;
  while ((m = modalIng.exec(text)) !== null) {
    grammarIssues.push(`Lỗi chia động từ sau Modal Verb: "${m[0]}" ➔ Sau "${m[1]}" cần dùng động từ nguyên mẫu (V0).`);
  }
  const lookForwardErr = /\blook\s+forward\s+to\s+(hear|receive|see|meet|reply)\b/gi;
  while ((m = lookForwardErr.exec(text)) !== null) {
    grammarIssues.push(`Lỗi cấu trúc B2: "${m[0]}" ➔ Sau "look forward to" bắt buộc dùng V-ing (ví dụ: look forward to ${m[1]}ing).`);
  }
  if (/\badvices\b|\binformations\b|\bequipments\b|\bfurnitures\b|\bluggages\b/i.test(text)) {
    grammarIssues.push('Lỗi danh từ không đếm được: Không thêm "-s" vào các từ advice, information, equipment, furniture, luggage.');
  }
  if (contractionsFound.length > 0) {
    grammarIssues.push(`Lỗi văn phong Trang trọng (Formal): Không dùng dạng viết tắt (${contractionsFound.join(', ')}) trong thư gửi quản lý/tổ chức/giáo sư.`);
  }

  // Complex B2 structures check
  const hasComplex = /\b(because|since|although|while|which|who|where|that|if i were you|would appreciate it if|strongly recommend|particularly)\b/i.test(lower);

  // Compute 4 Criterion Scores (0 - 10 scale)
  let tfScore = 6.5;
  if (words < 50) tfScore = 2.0;
  else if (words < 80) tfScore = 4.0;
  else if (words < 100) tfScore = 5.0;
  else if (words < 120) tfScore = 6.0;
  else if (words >= 140) tfScore = 8.0;
  else tfScore = 7.5;
  if (!hasSalutation || !hasSignoff) tfScore = Math.max(2.0, tfScore - 0.5);

  let orgScore = 6.5;
  if (words < 60) orgScore = 3.0;
  else {
    orgScore = (paras.length >= 4 ? 7.5 : 6.0) + (usedConnectors.length >= 3 ? 0.5 : 0);
    if (!hasSalutation || !hasSignoff) orgScore -= 1.0;
  }
  orgScore = Math.min(9.0, Math.max(2.0, orgScore));

  let lexScore = 6.5;
  if (words < 60) lexScore = 3.0;
  else {
    lexScore = 6.0 + Math.min(2.0, matchedVocab.length * 0.4);
    if (contractionsFound.length > 0) lexScore -= 1.0;
  }
  lexScore = Math.min(9.0, Math.max(2.0, lexScore));

  let graScore = 6.5;
  if (words < 60) graScore = 3.0;
  else {
    graScore = (hasComplex ? 7.5 : 6.0) - Math.min(2.5, grammarIssues.length * 0.5);
  }
  graScore = Math.min(9.0, Math.max(2.0, graScore));

  const overall = Number(((tfScore + orgScore + lexScore + graScore) / 4).toFixed(1));

  return {
    overall,
    words,
    parasCount: paras.length,
    hasSalutation,
    hasSignoff,
    isFormal,
    contractionsFound,
    usedConnectors,
    matchedVocab,
    unmatchedVocab,
    grammarIssues,
    tfScore: Number(tfScore.toFixed(1)),
    orgScore: Number(orgScore.toFixed(1)),
    lexScore: Number(lexScore.toFixed(1)),
    graScore: Number(graScore.toFixed(1))
  };
}

function submitEssay() {
  const textarea = document.getElementById('essay-textarea');
  const topic = state.activeTopic;
  if (!textarea || !topic) return;

  const content = textarea.value.trim();
  const words = countWords(content);

  if (words < 15) {
    showToast('Bài viết quá ngắn! Hãy viết bức thư tối thiểu 120 từ trước khi nộp chấm điểm nhé.', 'warning');
    return;
  }

  if (detectPromptCopying(content, topic)) {
    alert('🚫 PHÁT HIỆN SAO CHÉP ĐỀ BÀI!\n\nNội dung trong ô làm bài đang chứa nguyên văn đề bài tiếng Anh. Bạn vui lòng tự viết bức thư phản hồi bằng lời văn của mình nhé!');
    return;
  }

  pauseTimer();
  state.isSubmitted = true;
  state.examModeActive = false;

  const ev = evaluateLetterB2(content, topic);
  const submissionRecord = {
    id: 'sub_' + Date.now(),
    topicId: topic.id,
    topicTitle: topic.title_vi || topic.title_en,
    categoryTitle: topic.categoryTitleVi || CATEGORY_META[topic.catNum]?.titleVi || 'VSTEP Task 1',
    date: new Date().toLocaleString('vi-VN'),
    wordCount: words,
    score: ev.overall,
    vocabUsedCount: ev.matchedVocab.length,
    content,
    evaluation: ev
  };

  state.lastSubmission = submissionRecord;
  state.history.unshift(submissionRecord);
  try {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(state.history));
  } catch (e) {}

  renderSubmissionEvaluationUI(submissionRecord, topic);
  showToast(`🎉 Đã chấm điểm hoàn tất! Điểm dự kiến VSTEP B2: ${ev.overall}/10`, 'success');
}

function renderSubmissionEvaluationUI(sub, topic) {
  const ev = sub.evaluation;
  const wsGrid = document.getElementById('workspace-grid');
  if (wsGrid) wsGrid.classList.add('submitted');

  // 1. Render Detailed Report inside #step3-evaluation-view
  const editorView = document.getElementById('step3-editor-view');
  const evalView = document.getElementById('step3-evaluation-view');
  if (editorView) editorView.style.display = 'none';
  if (evalView) {
    evalView.style.display = 'block';
    const bandLabel = ev.overall >= 7.0 ? '🌟 ĐẠT CHUẨN MỤC TIÊU VSTEP B2!' : ev.overall >= 6.0 ? '👍 TIỆM CẬN B2 (B1+ VỮNG)' : '💪 CẦN BỔ SUNG ĐỘ DÀI & CẤU TRÚC B2';

    evalView.innerHTML = `
      <div class="reading-section-card" style="margin-bottom: 1.5rem; border-color: var(--accent-primary);">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.25rem; border-bottom: 1px solid var(--panel-border); padding-bottom: 1rem;">
          <div>
            <h2 style="font-size: 1.35rem; color: var(--accent-primary); margin-bottom: 0.25rem;">📊 BÁO CÁO CHẤM ĐIỂM VSTEP WRITING TASK 1 (B2)</h2>
            <div style="font-size: 0.9rem; color: var(--text-secondary);">Học viên: <strong>${escapeHtml(state.studentName || 'Học viên B2')}</strong> • Độ dài: <strong>${sub.wordCount} từ</strong> (Chuẩn: 120+ từ)</div>
          </div>
          <div style="display: flex; gap: 0.6rem; flex-wrap: wrap;">
            <button class="btn btn-secondary" onclick="reopenEditorForRevision()">✏️ Chỉnh sửa lại bài viết</button>
            <button class="btn btn-success" onclick="downloadEvaluatedDoc()">📥 Tải Phiếu Chấm (.doc)</button>
            <button class="btn btn-primary" onclick="switchStep('model')">📖 Xem Bài Thư Mẫu B2 &rarr;</button>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 2rem; flex-wrap: wrap; padding: 1rem 1.25rem; background: var(--bg-primary); border-radius: var(--radius-md); border: 1px solid var(--panel-border); margin-bottom: 1.25rem;">
          <div class="score-circle" style="flex-shrink: 0;">
            <span class="score-num">${ev.overall.toFixed(1)}</span>
            <span class="score-scale">Thang 10</span>
          </div>
          <div>
            <div style="font-size: 1.15rem; font-weight: 800; color: var(--accent-primary); margin-bottom: 0.35rem;">${bandLabel}</div>
            <p style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.55;">
              Bài thư của bạn gồm <strong>${ev.words} từ</strong> chia làm <strong>${ev.parasCount} đoạn</strong>, sử dụng <strong>${ev.usedConnectors.length} từ nối</strong> và <strong>${ev.matchedVocab.length} cụm từ vựng chủ đề B2</strong>.
            </p>
          </div>
        </div>

        <div class="essay-comparison-grid" style="margin-bottom: 1.25rem;">
          <div class="essay-col" style="background: var(--bg-primary);">
            <h4>1. TASK FULFILLMENT (${ev.tfScore}/10)</h4>
            <p style="font-size: 0.9rem; line-height: 1.55; color: var(--text-secondary);">
              ${ev.words >= 120 ? `✅ Đạt yêu cầu độ dài tối thiểu (${ev.words}/120 từ).` : `⚠️ Bài viết mới đạt ${ev.words}/120 từ, cần mở rộng thêm lý do và câu bổ trợ B2.`}
              <br>${ev.hasSalutation ? '✅ Có lời chào mở đầu thư chuẩn.' : '❌ Thiếu lời chào mở đầu (Dear ...,).'}
              <br>${ev.hasSignoff ? '✅ Có lời chào kết thúc thư chuẩn.' : '❌ Thiếu lời chào kết thúc (Best wishes, / Yours faithfully,).'}
            </p>
          </div>
          <div class="essay-col" style="background: var(--bg-primary);">
            <h4>2. ORGANIZATION (${ev.orgScore}/10)</h4>
            <p style="font-size: 0.9rem; line-height: 1.55; color: var(--text-secondary);">
              ${ev.parasCount >= 4 ? `✅ Bố cục tách đoạn rõ ràng (${ev.parasCount} phần).` : `⚠️ Nên tách thành 5 phần rõ rệt (Lời chào, Mở thư, Thân thư, Kết thư, Ký tên) bằng dòng trống.`}
              <br>${ev.usedConnectors.length >= 2 ? `✅ Sử dụng tốt các từ nối: <strong>${escapeHtml(ev.usedConnectors.join(', '))}</strong>.` : '⚠️ Cần bổ sung các liên từ chuyển ý B2 (First of all, In addition, Furthermore, Finally).'}
            </p>
          </div>
          <div class="essay-col" style="background: var(--bg-primary);">
            <h4>3. VOCABULARY & REGISTER (${ev.lexScore}/10)</h4>
            <p style="font-size: 0.9rem; line-height: 1.55; color: var(--text-secondary);">
              🎭 Văn phong: <strong>${ev.isFormal ? 'Trang trọng (Formal)' : 'Thân mật (Informal)'}</strong>.
              <br>${ev.contractionsFound.length === 0 ? '✅ Tuân thủ tốt quy tắc văn phong của bức thư.' : `❌ Phát hiện từ viết tắt trong thư trang trọng: <strong>${escapeHtml(ev.contractionsFound.join(', '))}</strong>.`}
              <br>💎 Đã áp dụng <strong>${ev.matchedVocab.length}</strong> cụm từ vựng mục tiêu của đề.
            </p>
          </div>
          <div class="essay-col" style="background: var(--bg-primary);">
            <h4>4. GRAMMAR & ACCURACY (${ev.graScore}/10)</h4>
            <div style="font-size: 0.9rem; line-height: 1.55; color: var(--text-secondary);">
              ${ev.grammarIssues.length === 0
                ? '✅ Không phát hiện lỗi ngữ pháp nghiêm trọng. Hãy tiếp tục duy trì các cấu trúc câu phức B2!'
                : ev.grammarIssues.map(iss => `<div style="color: var(--danger); margin-bottom: 0.3rem;">• ${escapeHtml(iss)}</div>`).join('')
              }
            </div>
          </div>
        </div>

        <div class="essay-col" style="background: var(--bg-primary);">
          <h4>📝 NGUYÊN VĂN BỨC THƯ BẠN ĐÃ NỘP</h4>
          <div class="essay-text-content">${escapeHtml(sub.content)}</div>
        </div>
      </div>
    `;
  }

  // 2. Populate Right Analysis Pane
  const scoreEl = document.getElementById('eval-score');
  const titleEl = document.getElementById('eval-title');
  const detailsList = document.getElementById('eval-details-list');
  const vocabMatchesEl = document.getElementById('eval-vocab-matches');
  const sampleTextEl = document.getElementById('ws-sample-text');

  if (scoreEl) scoreEl.textContent = ev.overall.toFixed(1);
  if (titleEl) titleEl.textContent = ev.overall >= 7.0 ? 'Đạt chuẩn B2!' : ev.overall >= 6.0 ? 'Tiệm cận B2' : 'Cần cải thiện thêm';

  if (detailsList) {
    detailsList.innerHTML = `
      <div class="grade-detail-card ${ev.words >= 120 ? 'success-card' : 'warning-card'}">
        <div>
          <div class="grade-detail-title">Task Fulfillment: ${ev.tfScore}/10</div>
          <div class="grade-detail-desc">Số từ: ${ev.words} từ (Yêu cầu tối thiểu 120 từ).</div>
        </div>
      </div>
      <div class="grade-detail-card ${ev.parasCount >= 4 ? 'success-card' : 'warning-card'}">
        <div>
          <div class="grade-detail-title">Organization: ${ev.orgScore}/10</div>
          <div class="grade-detail-desc">Chia ${ev.parasCount} đoạn • ${ev.usedConnectors.length} từ nối chuyển ý.</div>
        </div>
      </div>
      <div class="grade-detail-card ${ev.contractionsFound.length === 0 ? 'success-card' : 'danger-card'}">
        <div>
          <div class="grade-detail-title">Vocabulary & Register: ${ev.lexScore}/10</div>
          <div class="grade-detail-desc">Dùng ${ev.matchedVocab.length} từ vựng chủ đề B2.</div>
        </div>
      </div>
      <div class="grade-detail-card ${ev.grammarIssues.length === 0 ? 'success-card' : 'warning-card'}">
        <div>
          <div class="grade-detail-title">Grammar & Accuracy: ${ev.graScore}/10</div>
          <div class="grade-detail-desc">${ev.grammarIssues.length === 0 ? 'Kiểm soát cấu trúc tốt.' : `Phát hiện ${ev.grammarIssues.length} điểm cần lưu ý.`}</div>
        </div>
      </div>
    `;
  }

  if (vocabMatchesEl) {
    const allV = [
      ...ev.matchedVocab.map(v => ({ ...v, matched: true })),
      ...ev.unmatchedVocab.slice(0, 8).map(v => ({ ...v, matched: false }))
    ];
    vocabMatchesEl.innerHTML = allV.map(v => `
      <div class="vocab-match-item ${v.matched ? 'matched' : 'unmatched'}">
        <span><strong>${escapeHtml(v.en)}</strong> (${escapeHtml(v.vi)})</span>
        <span class="match-status">${v.matched ? '✓ Đã dùng' : 'Gợi ý'}</span>
      </div>
    `).join('');
  }

  const sampleB2 = topic.details?.sample_b2 || topic.sample_b2 || {};
  const rawSampleEn = (sampleB2.letter_en || sampleB2.text || '').replace(/\*\*\*|\*\*_/g, '').replace(/_\*\*/g, '');
  if (sampleTextEl) sampleTextEl.textContent = rawSampleEn;
}

function reopenEditorForRevision() {
  state.isSubmitted = false;
  state.examModeActive = true;
  const wsGrid = document.getElementById('workspace-grid');
  if (wsGrid) wsGrid.classList.remove('submitted');
  const editorView = document.getElementById('step3-editor-view');
  const evalView = document.getElementById('step3-evaluation-view');
  if (editorView) editorView.style.display = 'flex';
  if (evalView) evalView.style.display = 'none';
}

function switchAnalysisTab(tab) {
  document.querySelectorAll('.analysis-tab-btn').forEach((btn, idx) => {
    btn.classList.toggle('active', (tab === 'score' && idx === 0) || (tab === 'sample' && idx === 1));
  });
  const s1 = document.getElementById('ans-score');
  const s2 = document.getElementById('ans-sample');
  if (s1) s1.classList.toggle('active', tab === 'score');
  if (s2) s2.classList.toggle('active', tab === 'sample');
}

// ============================================================================
// 11. WORD (.DOC) EXPORT FOR DRAFTS & SUBMISSIONS
// ============================================================================
function downloadCurrentEssayAction() {
  const textarea = document.getElementById('essay-textarea');
  const topic = state.activeTopic;
  if (!textarea || !topic || !textarea.value.trim()) {
    showToast('Chưa có nội dung bài viết để tải về!', 'warning');
    return;
  }
  const content = textarea.value.trim();
  const words = countWords(content);
  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
    <head><meta charset="utf-8"><title>Bài Viết Thư VSTEP B2</title></head>
    <body style="font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.6;">
      <h2 style="color: #1e3a8a; text-align: center;">BÀI LUYỆN VIẾT THƯ VSTEP TASK 1 - B2 LEVEL</h2>
      <p><strong>Học viên:</strong> ${escapeHtml(state.studentName || 'Học viên')} &nbsp;|&nbsp; <strong>Lớp:</strong> ${escapeHtml(state.studentClass || 'B2')}</p>
      <p><strong>Chủ đề:</strong> ${escapeHtml(topic.title_vi || topic.title_en)}</p>
      <p><strong>Số từ:</strong> ${words} từ</p>
      <hr>
      <h3>ĐỀ BÀI (PROMPT):</h3>
      <p>${escapeHtml(topic.prompt || '').replace(/\n/g, '<br>')}</p>
      <h3>BÀI LÀM CỦA HỌC VIÊN:</h3>
      <div style="border: 1px solid #cbd5e1; padding: 12pt; background: #f8fafc;">
        ${escapeHtml(content).replace(/\n/g, '<br>')}
      </div>
    </body></html>
  `;
  triggerDocDownload(html, `VSTEP_B2_Task1_${topic.id}_${state.studentName || 'BaiViet'}.doc`);
}

function downloadEvaluatedDoc() {
  if (!state.lastSubmission || !state.activeTopic) {
    downloadCurrentEssayAction();
    return;
  }
  const sub = state.lastSubmission;
  const ev = sub.evaluation;
  const topic = state.activeTopic;
  const sampleB2 = topic.details?.sample_b2 || topic.sample_b2 || {};
  const sampleEn = (sampleB2.letter_en || sampleB2.text || '').replace(/\*\*\*|\*\*_/g, '').replace(/_\*\*/g, '');

  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
    <head><meta charset="utf-8"><title>Phiếu Chấm VSTEP Task 1 B2</title></head>
    <body style="font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.6;">
      <h2 style="color: #1e3a8a; text-align: center; margin-bottom: 4pt;">ENGLISH WITH MISS NGUYET</h2>
      <h3 style="text-align: center; margin-top: 0;">PHIẾU ĐÁNH GIÁ BÀI VIẾT THƯ VSTEP TASK 1 (B2 LEVEL)</h3>
      <p><strong>Học viên:</strong> ${escapeHtml(state.studentName || 'Học viên')} &nbsp;|&nbsp; <strong>Lớp:</strong> ${escapeHtml(state.studentClass || 'B2')} &nbsp;|&nbsp; <strong>Ngày nộp:</strong> ${escapeHtml(sub.date)}</p>
      <p><strong>Chủ đề:</strong> ${escapeHtml(sub.topicTitle)}</p>
      <p><strong>Điểm tổng quan:</strong> <strong style="color: #1e40af; font-size: 14pt;">${ev.overall.toFixed(1)} / 10</strong> (TF: ${ev.tfScore} | OR: ${ev.orgScore} | LR: ${ev.lexScore} | GRA: ${ev.graScore}) — <strong>Số từ:</strong> ${sub.wordCount} từ</p>
      <hr>
      <h3>I. BÀI VIẾT CỦA HỌC VIÊN:</h3>
      <div style="border: 1px solid #94a3b8; padding: 10pt;">${escapeHtml(sub.content).replace(/\n/g, '<br>')}</div>
      <h3>II. BÀI THƯ MẪU CHUẨN B2 ĐỐI CHIẾU:</h3>
      <div style="border: 1px solid #16a34a; padding: 10pt;">${escapeHtml(sampleEn).replace(/\n/g, '<br>')}</div>
    </body></html>
  `;
  triggerDocDownload(html, `PhieuCham_VSTEP_B2_${topic.id}_${state.studentName || 'HocVien'}.doc`);
}

function triggerDocDownload(htmlContent, filename) {
  const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.replace(/\s+/g, '_');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('📥 Đã tải file Word (.doc) về máy thành công!', 'success');
}

// ============================================================================
// 12. STEP 4: BÀI THƯ MẪU B2 SONG NGỮ & SO SÁNH BÀI VIẾT
// ============================================================================
function highlightSampleLetterB2(rawText) {
  if (!rawText) return '';
  let html = escapeHtml(rawText);
  html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong class="hl-key-idea">$1</strong>');
  html = html.replace(/\*\*_(.*?)_\*\*/g, '<strong class="hl-key-idea">$1</strong>');

  const connectorRegex = /\b(First of all,|Firstly,|To begin with,|Second,|Secondly,|Next,|In addition,|Furthermore,\s*to make matters worse,|Furthermore,|Moreover,|Besides that,|On top of that,|However,|Therefore,|Overall,|In particular,|Specifically,|In fact,|Given these circumstances,|To make up for my mistake,|To make up for this inconvenience,|To enhance the quality of your service,|Finally,|Last but not least,|Regarding\s+my\s+previous\s+experience,|Regarding\s+[A-Za-z]+|As for\b)/g;
  html = html.replace(connectorRegex, m => `<span class="hl-mark-connector" title="Từ nối mạch lạc B2">${m}</span>`);

  const structRegex = /\b(I am writing to formally complain about|I am writing to sincerely apologize for|I am writing to apply for the position of|I am writing to provide feedback on|I am writing to ask for some detailed information about|I am writing to|I’m writing to|I'm writing to|After reading your letter,\s*I have a few suggestions that you may want to consider|The main issue that I would like to highlight is|One aspect I appreciated was|One issue that I encountered was|First of all,\s*here is the reason for this|Let me make it up to you by|I am particularly interested in|I believe I would be a suitable candidate|I would appreciate it if you could|I strongly recommend|It would be a good idea to|If I were you,\s*I would|You could consider|You may want to|I look forward to hearing from you|I look forward to receiving your response|I look forward to receiving your reply|I would be grateful if you could|Please accept my sincere apologies|To make up for)\b/gi;
  html = html.replace(structRegex, m => `<span class="hl-mark-structure" title="Cấu trúc ăn điểm B2">${m}</span>`);

  return html;
}

function renderStep4ModelEssay() {
  const container = document.getElementById('ws-model-step-view');
  const topic = state.activeTopic;
  if (!container || !topic) return;

  const sampleB2 = topic.details?.sample_b2 || topic.sample_b2 || {};
  const rawEn = sampleB2.letter_en || sampleB2.text || '';
  const rawVi = (sampleB2.letter_vi || sampleB2.translation || '').replace(/\*\*\*|\*\*_/g, '').replace(/_\*\*/g, '');
  const cleanEnPlain = rawEn.replace(/\*\*\*|\*\*_/g, '').replace(/_\*\*/g, '');
  const words = sampleB2.word_count || countWords(cleanEnPlain);
  const keyStructures = sampleB2.key_structures || [];
  const vocabList = topic.details?.vocab || [];

  container.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; padding: 0.85rem 1.25rem; background: var(--bg-secondary); border: 1px solid var(--panel-border); border-radius: var(--radius-md);">
      <div style="font-size: 0.9rem; color: var(--text-secondary);">
        <strong style="color: var(--accent-primary);">Ghi chú tô sáng:</strong>
        <span class="hl-mark-connector" style="margin-left: 0.5rem;">Từ nối chuyển ý</span>
        <span class="hl-mark-structure" style="margin-left: 0.5rem;">Cấu trúc câu chuẩn B2</span>
        <strong class="hl-key-idea" style="margin-left: 0.5rem;">Ý trọng tâm trả lời đề</strong>
      </div>
      <span class="detail-badge">Độ dài bài mẫu: ${words} từ (Band B2+)</span>
    </div>

    <div class="essay-comparison-grid">
      <div class="essay-col">
        <h4>🇬🇧 BÀI THƯ MẪU TIẾNG ANH (VSTEP B2 LEVEL)</h4>
        <div class="essay-text-content">${highlightSampleLetterB2(rawEn)}</div>
      </div>
      <div class="essay-col">
        <h4>🇻🇳 BẢN DỊCH TIẾNG VIỆT ĐỐI CHIẾU</h4>
        <div class="essay-text-content" style="color: var(--text-secondary);">${escapeHtml(rawVi)}</div>
      </div>
    </div>

    <div class="vocab-notes-card">
      <h4>💡 CÁC CẤU TRÚC & CỤM TỪ VỰNG GHI ĐIỂM B2 CẦN LƯU Ý TRONG BÀI</h4>
      <ul class="vocab-notes-list">
        ${keyStructures.map(ks => `
          <li>
            <strong style="color: var(--success);">${escapeHtml(ks.en)}</strong>
            <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.2rem;">${escapeHtml(ks.vi)}</div>
          </li>
        `).join('')}
        ${vocabList.slice(0, 8).map(v => `
          <li>
            <strong style="color: var(--accent-primary);">${escapeHtml(v.en)}</strong>
            <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.2rem;">${escapeHtml(v.vi)}</div>
          </li>
        `).join('')}
      </ul>
    </div>
  `;
}

function openComparisonModal() {
  const modal = document.getElementById('comparison-modal');
  const userTextEl = document.getElementById('comp-user-text');
  const userWordsEl = document.getElementById('comp-user-words');
  const sampleTextEl = document.getElementById('comp-sample-text');
  const textarea = document.getElementById('essay-textarea');
  const topic = state.activeTopic;

  if (!modal || !topic) return;
  const userVal = textarea ? textarea.value.trim() : '';
  const sampleB2 = topic.details?.sample_b2 || topic.sample_b2 || {};
  const cleanSample = (sampleB2.letter_en || sampleB2.text || '').replace(/\*\*\*|\*\*_/g, '').replace(/_\*\*/g, '');

  if (userWordsEl) userWordsEl.textContent = countWords(userVal);
  if (userTextEl) userTextEl.textContent = userVal || '(Bạn chưa nhập nội dung bài viết ở Bước 3.)';
  if (sampleTextEl) sampleTextEl.textContent = cleanSample;

  modal.classList.add('active');
}

function closeComparisonModal() {
  const modal = document.getElementById('comparison-modal');
  if (modal) modal.classList.remove('active');
}

// ============================================================================
// 13. HISTORY & SAVED DRAFTS TABLES
// ============================================================================
function renderHistoryTable() {
  const tbody = document.getElementById('history-table-body');
  if (!tbody) return;

  if (state.history.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="empty-state">Chưa có bài viết thư nào được nộp chấm điểm.</td></tr>`;
    return;
  }

  tbody.innerHTML = state.history.map(item => `
    <tr>
      <td>${escapeHtml(item.date)}</td>
      <td><strong>${escapeHtml(item.topicTitle)}</strong></td>
      <td>${escapeHtml(item.categoryTitle)}</td>
      <td>${item.wordCount} từ</td>
      <td><strong style="color: var(--accent-primary);">${Number(item.score).toFixed(1)} / 10</strong></td>
      <td>
        <button class="history-action-btn" onclick="loadHistoryItem('${item.id}')">Xem lại</button>
        &nbsp;|&nbsp;
        <button class="history-action-btn" style="color: var(--danger);" onclick="deleteHistoryItem('${item.id}')">Xóa</button>
      </td>
    </tr>
  `).join('');
}

function loadHistoryItem(subId) {
  const item = state.history.find(h => h.id === subId);
  if (!item) return;
  startPractice(item.topicId);
  const textarea = document.getElementById('essay-textarea');
  if (textarea) {
    textarea.value = item.content || '';
    handleTextareaInput(true);
  }
  state.lastSubmission = item;
  state.isSubmitted = true;
  state.examModeActive = false;
  switchStep('write');
  renderSubmissionEvaluationUI(item, state.activeTopic);
}

function deleteHistoryItem(subId) {
  if (!confirm('Bạn có muốn xóa bài viết này khỏi lịch sử?')) return;
  state.history = state.history.filter(h => h.id !== subId);
  try {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(state.history));
  } catch (e) {}
  renderHistoryTable();
}

function renderDraftsTable() {
  const tbody = document.getElementById('drafts-table-body');
  if (!tbody) return;

  const draftEntries = Object.values(state.drafts || {}).filter(d => {
    const hasEssay = d.essayText && d.essayText.trim().length > 0;
    const hasTrans = d.translations && Object.values(d.translations).some(v => v && v.trim().length > 0);
    return hasEssay || hasTrans;
  });

  if (draftEntries.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="empty-state">Hiện chưa có bản nháp nào đang lưu.</td></tr>`;
    return;
  }

  tbody.innerHTML = draftEntries.map(d => {
    const words = countWords(d.essayText || '');
    const transCount = d.translations ? Object.values(d.translations).filter(v => v && v.trim()).length : 0;
    return `
      <tr>
        <td>${escapeHtml(d.updatedAt || '')}</td>
        <td><strong>${escapeHtml(d.topicTitle || d.topicId)}</strong></td>
        <td>${escapeHtml(d.categoryTitleVi || 'VSTEP B2')}</td>
        <td>${words > 0 ? `${words} từ ở Bước 3` : ''}${words > 0 && transCount > 0 ? ' • ' : ''}${transCount > 0 ? `${transCount} câu ở Bước 2` : ''}</td>
        <td>
          <button class="history-action-btn" onclick="resumeDraftItem('${d.topicId}')">Tiếp tục làm bài &rarr;</button>
          &nbsp;|&nbsp;
          <button class="history-action-btn" style="color: var(--danger);" onclick="deleteDraftItem('${d.topicId}')">Xóa</button>
        </td>
      </tr>
    `;
  }).join('');
}

function resumeDraftItem(topicId) {
  const d = state.drafts[topicId];
  startPractice(topicId);
  if (d && d.essayText && d.essayText.trim().length > 0) {
    switchStep('write');
  } else {
    switchStep('trans');
  }
}

function deleteDraftItem(topicId) {
  if (!confirm('Xóa bản nháp này?')) return;
  delete state.drafts[topicId];
  persistDrafts();
  renderDraftsTable();
}

// ============================================================================
// 14. TOAST NOTIFICATION
// ============================================================================
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  const typeClass = type === 'success' ? 'toast-success' : type === 'warning' ? 'toast-warning' : type === 'danger' ? 'toast-danger' : '';
  toast.className = `toast ${typeClass}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 3200);
}
