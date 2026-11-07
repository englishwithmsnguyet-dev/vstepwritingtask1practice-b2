/**
 * PHÒNG VIẾT THƯ - B2 LEVEL (VSTEP WRITING TASK 01)
 * English with Miss Nguyet - 4-Step Guided Writing Architecture
 */

// ============================================================================
// 1. GLOBAL STATE & CONFIGURATION
// ============================================================================
const CATEGORY_META = {
  1: { id: 1, key: 'advice', title: 'Letter of Advice', titleVi: '1. Thư Cho Lời Khuyên', tagClass: 'tag-adv' },
  2: { id: 2, key: 'request', title: 'Letter of Request', titleVi: '2. Thư Yêu Cầu Thông Tin', tagClass: 'tag-cause' },
  3: { id: 3, key: 'description', title: 'Letter of Description', titleVi: '3. Thư Miêu Tả & Kể Chuyện', tagClass: 'tag-discussion' },
  4: { id: 4, key: 'complaint', title: 'Letter of Complaint', titleVi: '4. Thư Phàn Nàn', tagClass: 'tag-opinion' },
  5: { id: 5, key: 'feedback', title: 'Letter of Feedback', titleVi: '5. Thư Phản Hồi Đánh Giá', tagClass: 'tag-adv' },
  6: { id: 6, key: 'apology', title: 'Letter of Apology', titleVi: '6. Thư Xin Lỗi', tagClass: 'tag-cause' },
  7: { id: 7, key: 'application', title: 'Letter of Application', titleVi: '7. Thư Ứng Tuyển Công Việc', tagClass: 'tag-discussion' }
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
  }

  const titleEl = document.getElementById('topbar-title');
  if (screenName === 'dashboard') {
    if (titleEl) titleEl.textContent = 'PHÒNG VIẾT THƯ - B2 LEVEL';
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
      return `
        <div class="topic-card" onclick="startPractice('${t.id}')">
          <div class="card-header">
            <span class="category-tag ${meta.tagClass}">${escapeHtml(t.categoryTitleVi)}</span>
            <span class="detail-badge">★ Chuẩn B2</span>
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
          <span class="detail-badge">${isDone ? '✓ Đã hoàn thành' : hasDraft ? '📝 Đang lưu nháp' : '★ Hướng dẫn B2'}</span>
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
  const badgeEl = document.getElementById('workspace-enrichment-badge');
  const topTitleEl = document.getElementById('topbar-title');
  const meta = CATEGORY_META[topic.catNum] || CATEGORY_META[1];

  if (titleEl) titleEl.textContent = `${topic.title_en} — ${topic.title_vi}`;
  if (catEl) {
    catEl.className = `category-tag ${meta.tagClass}`;
    catEl.textContent = `${topic.categoryTitleVi} • ${topic.recipient_type || 'VSTEP B2'}`;
  }
  if (badgeEl) badgeEl.textContent = '★ Có hướng dẫn B2 chi tiết';
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
  if (topHeader) topHeader.classList.remove('view-category');

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
  const isQuestion = cleanBase.endsWith('?') || /^(?:(?:First of all|Secondly|Besides that|On top of that|Finally|Last but not least|To begin with|In addition|Furthermore|Moreover),\s*)?(?:could|would|can|will|may|are|is|do|does|did|have|has)\s+(?:you|there|they|the|it|students|learners)\b/i.test(cleanBase);

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
      if (/^(?:(?:To begin with|Secondly|In addition|Furthermore|Finally|First of all),\s*)?(?:would|could)\s+you\s+kindly\b/i.test(cleanBase)) {
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

function attachReasonClauseVi(baseVi, rsnVi) {
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
  const needsCommaVi = /^(khiến|làm|giúp|nhờ đó|đảm bảo|mang lại|tránh|nâng tầm|như một|chứng minh|nhắc nhở|duy trì)/i.test(cleanSubVi);
  return `${strippedBase}${needsCommaVi ? ',' : ''} ${cleanSubVi}.`;
}

// Build a 100% grammatical B2 English sentence + Vietnamese prompt from any suggested_ideas option
function buildB2IdeaSentencePair(topic, group, opt, seqIndex) {
  const catKey = topic.category_id || 'advice';
  const isInformal = /informal|thân mật|bạn bè/i.test(topic.recipient_type || topic.details?.analysis?.letter_type || '');

  const connectorsInformal = ['First of all,', 'Secondly,', 'Besides that,', 'On top of that,', 'Finally,'];
  const connectorsFormal = ['To begin with,', 'Secondly,', 'In addition,', 'Furthermore,', 'Finally,'];
  const conn = (isInformal ? connectorsInformal : connectorsFormal)[seqIndex % 5];

  const connectorsVi = ['Trước hết,', 'Thứ hai,', 'Bên cạnh đó,', 'Ngoài ra,', 'Cuối cùng,'];
  const connVi = connectorsVi[seqIndex % 5];

  const actEn = (opt.action_en || opt.problem_en || '').trim().replace(/\s+/g, ' ');
  const actVi = (opt.action_vi || opt.problem_vi || '').trim().replace(/\s+/g, ' ');
  const rsnEn = (opt.reason_en || opt.impact_en || '').trim().replace(/\s+/g, ' ');
  const rsnVi = (opt.reason_vi || opt.impact_vi || '').trim().replace(/\s+/g, ' ');
  const exp1En = (opt.expansion_1_en || '').trim().replace(/\s+/g, ' ');
  const exp1Vi = (opt.expansion_1_vi || '').trim().replace(/\s+/g, ' ');
  const solEn = (opt.solution_en || '').trim().replace(/\s+/g, ' ');
  const solVi = (opt.solution_vi || '').trim().replace(/\s+/g, ' ');

  const alreadyHasConnectorEn = /^(First|Second|Third|Next|Finally|Last|To begin|In addition|Furthermore|Moreover|Besides|Regarding|As for|However|Overall|On the whole|On behalf|Please accept|Thank you)\b/i.test(actEn);
  const alreadyHasConnectorVi = /^(Trước hết|Đầu tiên|Thứ hai|Bên cạnh đó|Ngoài ra|Hơn nữa|Cuối cùng|Nhìn chung|Tuy nhiên|Thay mặt|Xin hãy nhận|Cảm ơn)\b/i.test(actVi);

  // Detect true bare verb phrases (imperative/infinitive stems without a subject)
  const bareActClean = actEn.replace(/[.,;:]+$/, '');
  const bareViClean = actVi.replace(/[.,;:]+$/, '');

  const isRequestVerbStem = catKey === 'request' && /^(ask|inquire)\s+/i.test(bareActClean);
  const isFeedbackSuggestionVerb = catKey === 'feedback' &&
    /^[a-z]/.test(bareActClean) &&
    /^(increase|deploy|conduct|install|enforce|upgrade|synchronize|curate|train|assign|offer|hire|use|rearrange|introduce|provide|improve|repair|replace|organize|maintain)\b/i.test(bareActClean);
  const isAdviceBareVerb = catKey === 'advice' &&
    /^[a-z]/.test(bareActClean) &&
    /^(stay|choose|book|try|eat|visit|wear|bring|rent|opt|look|practice|practise|use|watch|keep|find|listen|join|participate|take|attend|compete|download|buy|always\s+have|always\s+greet|walk|avoid|taste|enjoy|sample|explore|put|pack|carry)\b/i.test(bareActClean);

  let baseClauseEn = '';
  let baseClauseVi = '';

  if (isRequestVerbStem) {
    // Transform "ask about/for/if/whether/how..." -> natural B2 inquiry sentence/question
    const strippedVerb = bareActClean.replace(/^(?:ask|inquire)\s+/i, '');
    const strippedVi = bareViClean.replace(/^(?:hỏi\s+xem\s+|hỏi\s+về\s+|hỏi\s+|tìm\s+hiểu\s+xem\s+|tìm\s+hiểu\s+về\s+)/i, '');
    const isAboutOrFor = /^(?:about|for)\s+/i.test(strippedVerb);
    const nounPhrase = strippedVerb.replace(/^(?:about|for)\s+/i, '');

    const mode = seqIndex % 4;
    if (isAboutOrFor) {
      if (mode === 0) baseClauseEn = `${conn} could you tell me more about ${nounPhrase}?`;
      else if (mode === 1) baseClauseEn = `${conn} I would like to know more about ${nounPhrase}.`;
      else if (mode === 2) baseClauseEn = `${conn} could you give me some details about ${nounPhrase}?`;
      else baseClauseEn = `${conn} I was wondering if you could share some information about ${nounPhrase}.`;
    } else {
      if (mode === 0) baseClauseEn = `${conn} could you let me know ${strippedVerb}?`;
      else if (mode === 1) baseClauseEn = `${conn} I would like to know ${strippedVerb}.`;
      else if (mode === 2) baseClauseEn = `${conn} could you tell me ${strippedVerb}?`;
      else baseClauseEn = `${conn} I was also wondering ${strippedVerb}.`;
    }

    const viAlreadyQuestion = /(?:\s+không|\s+chưa|\?)$/i.test(strippedVi);
    const cleanStrippedVi = strippedVi.replace(/\?+$/, '');
    if (mode === 0 || mode === 2) {
      const suffixQ = viAlreadyQuestion ? '?' : ' được không?';
      baseClauseVi = isInformal
        ? `${connVi} cậu có thể cho tớ biết ${cleanStrippedVi}${suffixQ}`
        : `${connVi} quý vị có thể cho tôi biết ${cleanStrippedVi}${suffixQ}`;
    } else {
      const leadKnow = viAlreadyQuestion ? 'biết liệu' : 'tìm hiểu thêm về';
      baseClauseVi = isInformal
        ? `${connVi} tớ muốn ${leadKnow} ${cleanStrippedVi}.`
        : `${connVi} tôi muốn ${leadKnow} ${cleanStrippedVi}.`;
    }
  } else if (isFeedbackSuggestionVerb) {
    const sugLeadEn = seqIndex % 2 === 0
      ? `To further improve your service quality, I suggest that you ${bareActClean}`
      : `Furthermore, it would be much better if you could ${bareActClean}`;
    const sugLeadVi = seqIndex % 2 === 0
      ? `Để nâng cao hơn nữa chất lượng dịch vụ, tôi đề xuất quý vị nên ${bareViClean}`
      : `Hơn thế nữa, sẽ tốt hơn rất nhiều nếu quý vị có thể ${bareViClean}`;
    baseClauseEn = `${sugLeadEn}.`;
    baseClauseVi = `${sugLeadVi}.`;
  } else if (isAdviceBareVerb) {
    if (/^always\s+/i.test(bareActClean)) {
      baseClauseEn = `${conn} you should ${bareActClean}.`;
      baseClauseVi = `${connVi} cậu nên ${bareViClean}.`;
    } else {
      const mode = seqIndex % 4;
      if (mode === 0) {
        baseClauseEn = `${conn} it would be a great idea to ${bareActClean}.`;
        baseClauseVi = `${connVi} sẽ là một ý tưởng tuyệt vời nếu cậu ${bareViClean}.`;
      } else if (mode === 1) {
        baseClauseEn = `${conn} you could consider ${toGerundPhrase(bareActClean)}.`;
        baseClauseVi = `${connVi} cậu có thể cân nhắc việc ${bareViClean}.`;
      } else if (mode === 2) {
        baseClauseEn = `${conn} if I were you, I would ${bareActClean}.`;
        baseClauseVi = `${connVi} nếu tớ là cậu, tớ sẽ ${bareViClean}.`;
      } else {
        baseClauseEn = `${conn} I would strongly recommend ${toGerundPhrase(bareActClean)}.`;
        baseClauseVi = `${connVi} tớ đặc biệt khuyên cậu nên ${bareViClean}.`;
      }
    }
  } else {
    // Full clause/sentence (either uppercase or lowercase subject-verb clause)
    if (alreadyHasConnectorEn) {
      baseClauseEn = actEn.charAt(0).toUpperCase() + actEn.slice(1);
    } else {
      const keepCapEn = /^(?:I(?:\s|['’])|Hoa\b|Nam\b|Linda\b|Helen\b|Emily\b|John\b|Jane\b|Ann\b|Alex\b|Lucky\b|Milo\b|Sunny\b|Hero\b|Hanoi\b|Can\s+Tho\b|Da\s+Nang\b|Vietnam\b|Vietnamese\b|English\b|Chinese\b|Mr\.|Ms\.|Mrs\.|Professor\b)/.test(actEn);
      const loweredOrKept = keepCapEn ? actEn : actEn.charAt(0).toLowerCase() + actEn.slice(1);
      baseClauseEn = `${conn} ${loweredOrKept}`;
    }

    if (alreadyHasConnectorVi) {
      baseClauseVi = actVi.charAt(0).toUpperCase() + actVi.slice(1);
    } else if (actVi) {
      const keepCapVi = /^(?:Hoa\b|Nam\b|Linda\b|Helen\b|Emily\b|John\b|Jane\b|Ann\b|Alex\b|Hà\s+Nội\b|Cần\s+Thơ\b|Đà\s+Nẵng\b|Việt\s+Nam\b)/.test(actVi);
      const loweredVi = keepCapVi ? actVi : actVi.charAt(0).toLowerCase() + actVi.slice(1);
      baseClauseVi = `${connVi} ${loweredVi}`;
    }
  }

  let mainSentenceEn = attachReasonClauseEn(baseClauseEn, rsnEn);
  let mainSentenceVi = attachReasonClauseVi(baseClauseVi, rsnVi);

  // Append B2 Expansion 1 (or Solution for complaint) for authentic B2 paragraph depth
  const extraEn = exp1En || (catKey === 'complaint' ? solEn : '');
  const extraVi = exp1Vi || (catKey === 'complaint' ? solVi : '');

  if (extraEn) {
    const cleanExtraEn = /[.?!]$/.test(extraEn) ? extraEn : extraEn + '.';
    mainSentenceEn = `${mainSentenceEn} ${cleanExtraEn}`;
  }
  if (extraVi) {
    const cleanExtraVi = /[.?!]$/.test(extraVi) ? extraVi : extraVi + '.';
    mainSentenceVi = `${mainSentenceVi} ${cleanExtraVi}`;
  }

  return {
    en: mainSentenceEn.replace(/\s+/g, ' ').trim(),
    vi: mainSentenceVi.replace(/\s+/g, ' ').trim()
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

  // Group vocabulary by category
  const vocabByGroup = {};
  vocabList.forEach(v => {
    const g = v.category || 'Từ vựng & Cụm từ trọng tâm B2 theo chủ đề';
    if (!vocabByGroup[g]) vocabByGroup[g] = [];
    vocabByGroup[g].push(v);
  });

  // Build Interactive Idea Selection HTML (Card 4 — right before transitioning to Step 2)
  let ideaSelectorHtml = '';
  if (suggestedIdeas.length > 0) {
    const selectedSummaryItems = [];
    let seqCounter = 0;

    const groupsHtml = suggestedIdeas.map((group, gIdx) => {
      const selArr = Array.isArray(topicSel[gIdx]) ? topicSel[gIdx] : [];
      const optionsHtml = (group.options || []).map((opt, optIdx) => {
        const isSelected = selArr.includes(optIdx);
        const actEn = opt.action_en || opt.problem_en || '';
        const actVi = opt.action_vi || opt.problem_vi || '';
        const rsnEn = opt.reason_en || opt.impact_en || '';
        const expEn = opt.expansion_1_en || opt.solution_en || '';

        if (isSelected) {
          const built = buildB2IdeaSentencePair(topic, group, opt, seqCounter++);
          selectedSummaryItems.push({
            reqTitle: group.title_vi || group.title_en || `Yêu cầu ${gIdx + 1}`,
            en: built.en,
            vi: built.vi
          });
        }

        return `
          <div class="idea-checkbox-card ${isSelected ? 'is-selected' : ''}" onclick="toggleLetterIdeaSelection(${gIdx}, ${optIdx})">
            <div class="idea-checkbox-custom">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <div class="idea-card-content">
              <div class="idea-card-title">Phương án ${optIdx + 1}: ${escapeHtml(actEn)}</div>
              ${actVi ? `<div class="idea-card-point" style="font-style: italic;">🇻🇳 ${escapeHtml(actVi)}</div>` : ''}
              ${rsnEn ? `<div class="idea-card-point" style="margin-top: 0.2rem;"><strong style="color: var(--warning);">↳ Lý do / Hệ quả:</strong> ${escapeHtml(rsnEn)}</div>` : ''}
              ${expEn ? `<div class="idea-card-point" style="margin-top: 0.2rem;"><strong style="color: var(--success);">✨ Mở rộng / Giải pháp B2:</strong> ${escapeHtml(expEn)}</div>` : ''}
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

    const summaryHtml = selectedSummaryItems.length > 0 ? `
      <div style="margin-top: 1.35rem; padding: 1.1rem 1.25rem; background: var(--bg-primary); border: 1.5px solid var(--accent-primary); border-radius: var(--radius-md);">
        <div style="font-weight: 700; color: var(--accent-primary); margin-bottom: 0.7rem; font-size: 0.94rem;">
          ✅ TÓM TẮT DÀN Ý ${selectedSummaryItems.length} ĐOẠN/Ý THÂN THƯ B2 BẠN ĐÃ CHỌN (ĐỒNG BỘ SANG BƯỚC 2):
        </div>
        <ul class="outline-summary-list">
          ${selectedSummaryItems.map((item, idx) => `
            <li>
              <strong>Ý thân thư ${idx + 1} — ${escapeHtml(item.reqTitle)}:</strong>
              <div style="color: var(--text-primary); font-weight: 600; margin-top: 0.25rem; line-height: 1.55;">🇬🇧 ${escapeHtml(item.en)}</div>
              <div style="color: var(--text-secondary); font-size: 0.88rem; font-style: italic; margin-top: 0.2rem; line-height: 1.5;">🇻🇳 ${escapeHtml(item.vi)}</div>
            </li>
          `).join('')}
        </ul>
      </div>
    ` : '';

    const helperNote = isMultiGroupTopic
      ? 'Đề thư phàn nàn này cung cấp nhiều nhóm sự cố gợi ý. Hệ thống đã chọn sẵn các ý tiêu biểu nhất — bạn có thể <strong>bấm vào ô đang chọn để bỏ chọn</strong> hoặc chọn sang nhóm sự cố khác (nên giữ từ <strong>3 – 4 ý</strong> để bức thư mạch lạc 140–180 từ).'
      : 'Mỗi cột tương ứng với <strong>1 yêu cầu bắt buộc trong đề thi</strong>. Hãy nhấn chọn 1 phương án tâm đắc nhất cho từng cột — hệ thống sẽ tự động ghép thành câu chuẩn B2 và chuyển sang <strong>Bước 2: Tập diễn đạt ý tưởng</strong>!';

    ideaSelectorHtml = `
      <div class="reading-section-card idea-selection-card">
        <div class="idea-selection-header">
          <div style="flex: 1; min-width: 260px;">
            <h3 style="margin-bottom: 0.35rem; border: none; padding: 0;">🎯 3. CHỌN Ý TƯỞNG &amp; CÂU MỞ RỘNG B2 CHO THÂN THƯ</h3>
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

    <!-- CARD 3: CHỌN Ý TƯỞNG B2 & TÓM TẮT CÂU THÂN THƯ -->
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
  ensureDefaultIdeasSelected(topic);

  const sampleB2 = topic.details?.sample_b2 || topic.sample_b2 || {};
  const enParas = (sampleB2.letter_en || sampleB2.text || '').replace(/\*\*\*|\*\*_/g, '').replace(/_\*\*/g, '').split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
  const viParas = (sampleB2.letter_vi || sampleB2.translation || '').replace(/\*\*\*|\*\*_/g, '').replace(/_\*\*/g, '').split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
  const b1List = topic.details?.sentence_practice_b1 || [];
  const vocabList = topic.details?.vocab || [];

  const isFormal = /formal/i.test(topic.recipient_type || topic.details?.analysis?.letter_type || '') && !/informal/i.test(topic.recipient_type || topic.details?.analysis?.letter_type || '');

  // 1. Salutation
  const salutationEn = (enParas[0] && /^Dear\b/i.test(enParas[0])) ? enParas[0] : (isFormal ? 'Dear Sir or Madam,' : 'Dear Friend,');
  const salutationVi = (viParas[0] && viParas[0].length < 50) ? viParas[0] : (isFormal ? 'Kính gửi Ông/Bà,' : 'Bạn thân mến,');

  // 2. Opening
  const openingEn = enParas[1] || (b1List[0] ? b1List[0].en : 'I am writing this letter regarding your request.');
  const openingVi = viParas[1] || (b1List[0] ? b1List[0].vi : 'Tôi viết bức thư này để phản hồi các nội dung bạn quan tâm.');
  const openingHints = (b1List[0] && b1List[0].vocab_hints) ? b1List[0].vocab_hints : [
    { en: isFormal ? 'I am writing to...' : 'Thanks for your letter. How have you been lately?', vi: isFormal ? 'Tôi viết thư này để...' : 'Cảm ơn thư của bạn. Dạo này bạn thế nào?' }
  ];

  // 3. Body paragraphs based on Student's Selected B2 Ideas in Step 1!
  const suggestedIdeas = topic.details?.suggested_ideas || [];
  const topicSel = state.selectedIdeasByTopic[topic.id] || {};
  const bodyExercises = [];
  let seqIdx = 0;

  if (suggestedIdeas.length > 0) {
    suggestedIdeas.forEach((group, gIdx) => {
      const selArr = Array.isArray(topicSel[gIdx]) ? topicSel[gIdx] : [];
      selArr.forEach(optIdx => {
        const opt = (group.options || [])[optIdx];
        if (!opt) return;
        const pair = buildB2IdeaSentencePair(topic, group, opt, seqIdx);
        const hints = [];
        if (opt.action_en) hints.push({ en: opt.action_en, vi: opt.action_vi || 'Ý chính' });
        if (opt.reason_en) hints.push({ en: opt.reason_en, vi: opt.reason_vi || 'Lý do / Giải thích' });
        if (opt.expansion_1_en) hints.push({ en: opt.expansion_1_en, vi: opt.expansion_1_vi || 'Câu mở rộng B2' });
        else if (opt.solution_en) hints.push({ en: opt.solution_en, vi: opt.solution_vi || 'Hướng giải quyết B2' });

        bodyExercises.push({
          role: 'body',
          partTitle: `PHẦN 3.${seqIdx + 1}: THÂN THƯ — ${(group.title_vi || group.title_en || `YÊU CẦU ${gIdx + 1}`).toUpperCase()}`,
          vi: pair.vi,
          en: pair.en,
          hints
        });
        seqIdx++;
      });
    });
  } else if (enParas.length > 4) {
    for (let i = 2; i < enParas.length - 2; i++) {
      bodyExercises.push({
        role: 'body',
        partTitle: `PHẦN 3.${i - 1}: THÂN THƯ — ĐOẠN ${i - 1}`,
        vi: viParas[i] || 'Hãy diễn đạt đoạn thân thư này sang tiếng Anh chuẩn B2.',
        en: enParas[i],
        hints: vocabList.slice((i - 2) * 2, (i - 2) * 2 + 3)
      });
    }
  }

  // 4. Closing sentence (second to last paragraph in sample_b2)
  const closingEn = enParas.length >= 4
    ? enParas[enParas.length - 2]
    : (isFormal ? 'Thank you for your time and consideration. I look forward to hearing from you soon.' : 'I hope you find my suggestions helpful. Write back soon.');
  const closingVi = viParas.length >= 4
    ? viParas[viParas.length - 2]
    : (isFormal ? 'Cảm ơn thời gian và sự quan tâm của quý vị. Tôi rất mong sớm nhận được phản hồi từ quý vị.' : 'Tớ hy vọng những chia sẻ của tớ sẽ hữu ích cho cậu. Viết thư lại cho tớ sớm nhé.');

  // 5. Sign-off (last paragraph in sample_b2)
  const signoffEn = enParas.length >= 3
    ? enParas[enParas.length - 1]
    : (isFormal ? 'Yours faithfully,' : 'Best wishes,');
  const signoffVi = viParas.length >= 3
    ? viParas[viParas.length - 1]
    : (isFormal ? 'Trân trọng,' : 'Thân mến,');

  return [
    {
      role: 'salutation',
      partTitle: 'PHẦN 1: LỜI CHÀO MỞ ĐẦU (SALUTATION)',
      vi: salutationVi,
      en: salutationEn,
      hints: [{ en: salutationEn, vi: 'Lời chào mở đầu chuẩn văn phong kèm dấu phẩy cuối dòng' }]
    },
    {
      role: 'opening',
      partTitle: 'PHẦN 2: MỞ THƯ (OPENING — CHÀO HỎI & NÊU MỤC ĐÍCH VIẾT THƯ)',
      vi: openingVi,
      en: openingEn,
      hints: openingHints
    },
    ...bodyExercises,
    {
      role: 'closing',
      partTitle: 'PHẦN 4: KẾT THƯ (CLOSING SENTENCE)',
      vi: closingVi,
      en: closingEn,
      hints: [
        {
          en: isFormal ? 'I look forward to hearing from you soon.' : 'Let me know how things go. Write back soon.',
          vi: isFormal ? 'Tôi rất mong sớm nhận được hồi âm từ quý vị.' : 'Cho tớ biết mọi chuyện diễn ra thế nào nhé. Hồi âm sớm nhé.'
        }
      ]
    },
    {
      role: 'signoff',
      partTitle: 'PHẦN 5: LỜI CHÀO KẾT THÚC (SIGN-OFF — KHÔNG KÝ TÊN THẬT)',
      vi: signoffVi,
      en: signoffEn,
      hints: [{ en: signoffEn, vi: 'Lưu ý: Đề thi VSTEP yêu cầu KHÔNG ghi tên thật của bạn bên dưới!' }]
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
          Các câu thân thư bên dưới được tạo trực tiếp từ những ý tưởng B2 bạn đã chọn ở Bước 1. Sau khi tự gõ câu tiếng Anh, hãy nhấn <strong>✨ GHÉP BÀI SANG BƯỚC 3</strong> để chuyển thành bức thư hoàn chỉnh!
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
      <button class="btn btn-success" onclick="assembleSentencesToStep3()" style="padding: 0.75rem 1.4rem; font-size: 0.95rem;">
        ✨ GHÉP CÁC CÂU ĐÃ VIẾT SANG BƯỚC 3 &rsaquo;
      </button>
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

  const evalRes = evaluateSentenceTranslation(userText, ex);

  ansBox.classList.add('active');
  ansBox.style.borderColor = evalRes.color;
  ansBox.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.5rem;">
      <div class="trans-answer-title" style="color: ${evalRes.color}; margin: 0;">${evalRes.badge}</div>
      <span style="font-size: 0.82rem; font-weight: 700; color: ${evalRes.color};">Độ khớp ý & cấu trúc: ${evalRes.percent}%</span>
    </div>
    <div style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 0.65rem; line-height: 1.5;">
      ${evalRes.feedbackHtml}
    </div>
    <div class="trans-answer-title">✨ ĐÁP ÁN MẪU CHUẨN B2 THAM KHẢO:</div>
    <div class="trans-answer-text">${escapeHtml(ex.en)}</div>
  `;
}

function evaluateSentenceTranslation(userText, ex) {
  const cleanUser = userText.toLowerCase().replace(/[^a-z0-9\s']/g, ' ').split(/\s+/).filter(Boolean);
  const stopWords = new Set(['the', 'a', 'an', 'to', 'of', 'in', 'on', 'at', 'for', 'and', 'or', 'is', 'are', 'am', 'be', 'it', 'this', 'that']);
  const refWords = ex.en.toLowerCase().replace(/[^a-z0-9\s']/g, ' ').split(/\s+/).filter(w => w && !stopWords.has(w));

  let matched = 0;
  refWords.forEach(rw => {
    if (cleanUser.includes(rw)) matched++;
  });

  const ratio = refWords.length > 0 ? Math.min(100, Math.round((matched / refWords.length) * 100)) : 80;
  const notes = [];

  if (ex.role === 'salutation' && !userText.trim().endsWith(',')) {
    notes.push('⚠️ Cuối dòng lời chào mở đầu (<em>Dear ...,</em>) cần có dấu phẩy (<code>,</code>).');
  }
  if (ex.role === 'signoff' && !userText.trim().endsWith(',')) {
    notes.push('⚠️ Cuối lời chào kết thúc (<em>Best wishes, / Yours faithfully,</em>) cần có dấu phẩy (<code>,</code>).');
  }
  if (!/^[A-Z]/.test(userText.trim())) {
    notes.push('⚠️ Chữ cái đầu câu cần viết hoa.');
  }
  if (ex.role !== 'salutation' && ex.role !== 'signoff' && !/[.?!]$/.test(userText.trim())) {
    notes.push('⚠️ Cuối câu văn cần có dấu chấm (<code>.</code>) hoặc dấu hỏi (<code>?</code>).');
  }

  // Check grammar quick rules
  if (/\b(should|can|could|would|will|must|may|might)\s+[a-z]+ing\b/i.test(userText)) {
    notes.push('❌ Lỗi ngữ pháp: Sau động từ khuyết thiếu (<em>should, could, would, can...</em>) phải là động từ nguyên mẫu <code>V0</code>, không dùng <code>V-ing</code>.');
  }
  if (/\blook\s+forward\s+to\s+(hear|receive|see|meet)\b/i.test(userText)) {
    notes.push('❌ Lỗi cấu trúc B2: Sau <code>look forward to</code> phải dùng <code>V-ing</code> (ví dụ: <em>look forward to hearing from you</em>).');
  }

  if (notes.length === 0) {
    if (ratio >= 65) {
      notes.push('✅ Câu viết rất tốt, đúng ngữ pháp và truyền tải sát các từ khóa B2!');
    } else {
      notes.push('💡 Câu của bạn có cách diễn đạt riêng. Hãy đối chiếu thêm với câu mẫu B2 bên dưới để trau chuốt các cụm collocations nhé!');
    }
  }

  const color = ratio >= 65 && !notes.some(n => n.startsWith('❌')) ? 'var(--success)' : ratio >= 35 ? 'var(--warning)' : 'var(--danger)';
  const badge = ratio >= 65 && !notes.some(n => n.startsWith('❌')) ? '🌟 RẤT TỐT (CHUẨN HƯỚNG B2)' : '📝 GỢI Ý CẢI THIỆN CÂU';

  return {
    percent: ratio,
    color,
    badge,
    feedbackHtml: notes.join('<br>')
  };
}

function assembleSentencesToStep3() {
  if (!state.activeTopic || !state.currentExercises.length) return;

  const salutationParts = [];
  const openingParts = [];
  const bodyParts = [];
  const closingParts = [];
  const signoffParts = [];

  let typedCount = 0;
  state.currentExercises.forEach((ex, idx) => {
    const el = document.getElementById(`trans-input-${idx}`);
    const val = el ? el.value.trim() : '';
    if (!val) return;
    typedCount++;
    if (ex.role === 'salutation') salutationParts.push(val);
    else if (ex.role === 'opening') openingParts.push(val);
    else if (ex.role === 'body') bodyParts.push(val);
    else if (ex.role === 'closing') closingParts.push(val);
    else if (ex.role === 'signoff') signoffParts.push(val);
  });

  if (typedCount === 0) {
    showToast('Bạn hãy tự gõ các câu tiếng Anh ở Bước 2 trước khi ghép bài sang Bước 3 nhé!', 'warning');
    return;
  }

  const blocks = [];
  if (salutationParts.length) blocks.push(salutationParts.join(' '));
  if (openingParts.length) blocks.push(openingParts.join(' '));
  if (bodyParts.length) {
    // Group body sentences neatly into 1 or 2 cohesive body paragraphs or separate clear paragraphs
    blocks.push(bodyParts.join('\n\n'));
  }
  if (closingParts.length) blocks.push(closingParts.join(' '));
  if (signoffParts.length) blocks.push(signoffParts.join(' '));

  const assembled = blocks.join('\n\n');
  const textarea = document.getElementById('essay-textarea');
  if (textarea) {
    textarea.value = assembled;
    handleTextareaInput();
  }

  switchStep('write');
  showToast(`✨ Đã ghép ${typedCount} phần bạn vừa viết sang Bước 3! Hãy đọc rà soát và bổ sung hoàn thiện bức thư nhé!`, 'success');
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

// --- Anti-Cheat Handlers (Active in Step 3 for Students; Bypassed for Teacher GV) ---
function handleEditorPaste(event) {
  if (state.isTeacher) return;
  event.preventDefault();
  showToast('🚫 Chế độ Phòng thi Bước 3 không cho phép Dán (Paste) văn bản từ bên ngoài! Bạn hãy tự gõ hoặc dùng nút Ghép bài từ Bước 2 nhé.', 'danger');
}

function handleEditorCopyCut(event) {
  if (state.isTeacher) return;
  event.preventDefault();
  showToast('🚫 Không thể Copy / Cut trực tiếp trong ô làm bài thi Bước 3.', 'warning');
}

function handleEditorDrop(event) {
  if (state.isTeacher) return;
  event.preventDefault();
}

function handleEditorContextMenu(event) {
  if (state.isTeacher) return;
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
  const connectorPatterns = ['first of all', 'firstly', 'to begin with', 'secondly', 'in addition', 'furthermore', 'moreover', 'besides', 'on top of that', 'finally', 'last but not least', 'however', 'therefore', 'regarding', 'as for'];
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

  const connectorRegex = /\b(First of all,|Firstly,|To begin with,|Secondly,|In addition,|Furthermore,|Moreover,|Besides that,|On top of that,|However,|Therefore,|Finally,|Last but not least,|Regarding\s+[A-Za-z]+|As for\b)/g;
  html = html.replace(connectorRegex, m => `<span class="hl-mark-connector" title="Từ nối mạch lạc B2">${m}</span>`);

  const structRegex = /\b(I am writing to|I’m writing to|I'm writing to|I would appreciate it if you could|I strongly recommend|It would be a good idea to|If I were you,\s*I would|You could consider|I look forward to hearing from you|I look forward to receiving your reply|I would be grateful if you could|Please accept my sincere apologies|To make up for)\b/gi;
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
