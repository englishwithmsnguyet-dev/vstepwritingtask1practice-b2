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
  IDEAS: 'vstep_letters_b2_selected_ideas'
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
// 2. VIETNAMESE PROMPT TRANSLATIONS
// ============================================================================
const PROMPT_TRANSLATIONS_VI = {
  'de-01': `Bạn vừa nhận được một bức thư từ người bạn người Anh, Helen. Bạn ấy sắp đến thăm Hà Nội vào tháng Sáu. Hãy viết một bức thư để đưa ra cho bạn ấy một vài gợi ý. Trong thư, bạn nên nói cho bạn ấy biết:
• Nơi ở (Where to stay)
• Món ăn nên thử (What dishes to try)
• Điểm tham quan nên đến (Which places to visit)
• Trang phục nên mặc khi đến Hà Nội (What to wear when visiting Hanoi)

Bạn nên viết ít nhất 120 từ. Không ghi tên của bạn. Bài viết sẽ được đánh giá dựa trên 4 tiêu chí: Hoàn thành nhiệm vụ (Task Fulfillment), Bố cục (Organization), Từ vựng (Vocabulary) và Ngữ pháp (Grammar).`,

  'de-02': `Bạn vừa nhận được một email từ một người bạn người Anh đang dự định học tiếng Việt trong 6 tháng tại Đại học Hà Nội. Bạn ấy xin lời khuyên của bạn về các lựa chọn chỗ ở, chi phí sinh hoạt hàng tháng, các cách thực tế để luyện nói tiếng Việt với người bản xứ và mẹo thích nghi văn hóa.
Hãy viết một bức thư để đưa ra cho bạn ấy một vài gợi ý (tối thiểu 120 từ, không ghi tên hoặc địa chỉ của bạn).`,

  'de-03': `Bạn nhìn thấy một mẩu quảng cáo về khóa học nấu ăn mùa hè tại trung tâm Delight Kitchen và rất quan tâm đến việc tham gia khóa học. Hãy viết một email gửi cho người quản lý tuyển sinh để hỏi thông tin về học phí khóa học, lịch học, trình độ của giáo viên giảng dạy và liệu nguyên liệu nấu ăn có được cung cấp sẵn hay không (tối thiểu 120 từ).`,

  'de-04': `Người bạn Linda của bạn gần đây vừa hoàn thành một khóa học tiếng Trung sơ cấp tại Trung tâm Ngoại ngữ New Horizon. Bạn muốn học tiếng Trung vào mùa hè này. Hãy viết một email gửi cho Linda để hỏi về địa điểm trung tâm, học phí, chất lượng giáo viên và cơ hội luyện nói thực tế (tối thiểu 120 từ).`,

  'de-05': `Bạn vừa nhận được một email từ người bạn của bạn, John:
"... Tớ nghe nói gần đây cậu đã tham gia một cuộc thi đua xe đạp địa hình. Trải nghiệm đó thế nào? Đường đua ra sao? Cậu có giành được giải thưởng nào không? Tớ cũng đang tính thử sức với bộ môn xe đạp leo núi. Sắp tới cậu có dự định chuyến đi đạp xe nào không? ..."
Hãy viết email hồi âm cho John miêu tả trải nghiệm cuộc đua của bạn và mời bạn ấy cùng tham gia một chuyến đi sắp tới (tối thiểu 120 từ).`,

  'de-06': `Bạn vừa nhận được một email từ người bạn Helen muốn biết về ngôi nhà mới chuyển của bạn gần khuôn viên trường đại học. Hãy viết email cho Helen miêu tả vị trí ngôi nhà, cách bố trí các phòng, khu dân cư xung quanh và mời bạn ấy đến thăm (tối thiểu 120 từ).`,

  'de-07': `Bạn là hội viên tại Câu lạc bộ Thể thao Elite Fitness Club. Gần đây, một vài máy tập gym đã bị hỏng và vẫn chưa được sửa chữa. Hãy viết email gửi người quản lý phòng gym để phàn nàn: miêu tả các thiết bị hỏng và vấn đề phát sinh, giải thích điều này ảnh hưởng thế nào đến buổi tập của bạn, và đề xuất ban quản lý nên làm gì (tối thiểu 120 từ).`,

  'de-08': `Bạn đã dùng bữa tối tại nhà hàng The Grand Bistro tối qua để kỷ niệm sự kiện gia đình. Chất lượng món ăn rất tệ, thời gian chờ quá lâu và nhân viên phục vụ thiếu nhiệt tình. Hãy viết thư khiếu nại gửi quản lý nhà hàng miêu tả các vấn đề, giải thích sự thất vọng của bạn và yêu cầu biện pháp giải quyết thích đáng (tối thiểu 120 từ).`,

  'de-09': `Bạn là hành khách thường xuyên đi tuyến xe buýt công cộng số 08. Hãy viết email gửi ông Tailor, giám đốc dịch vụ vận tải, để đóng góp ý kiến phản hồi về dịch vụ xe buýt: đề cập những mặt tích cực bạn hài lòng, chỉ ra các vấn đề tồn tại (chậm giờ và máy bán vé hỏng) và đề xuất giải pháp cải thiện thực tế (tối thiểu 120 từ).`,

  'de-10': `Bạn đã tổ chức bữa tiệc sinh nhật cùng bạn bè tại nhà hàng Golden Spoon vào thứ Bảy tuần trước. Hãy viết email gửi người quản lý nhà hàng để đưa ra phản hồi: khen ngợi những điểm làm tốt (hương vị món ăn và trang trí bàn tiệc), chỉ ra những điểm cần cải thiện (tiếng rè mic và món tráng miệng ra chậm) và đưa ra gợi ý cho tương lai (tối thiểu 120 từ).`,

  'de-11': `Bạn là sinh viên đại học đã không thể nộp bài nghiên cứu học phần đúng hạn. Hãy viết email gửi giảng viên hướng dẫn môn học, Giáo sư Johnson, xin lỗi vì nộp muộn: chân thành xin lỗi, giải thích nguyên nhân cụ thể ở thì quá khứ đơn, đính kèm bài làm đã hoàn thành và cam kết tuân thủ các hạn nộp trong tương lai (tối thiểu 120 từ).`,

  'de-12': `Bạn là Trưởng bộ phận Chăm sóc Khách hàng tại Khách sạn Pearl Palace. Một vị khách, ông Smith, đã có trải nghiệm lưu trú không hài lòng do dịch vụ phòng chậm và đồ ăn bị nguội. Hãy viết email xin lỗi ông Smith: chân thành xin lỗi, giải thích sự cố nhà bếp ngoài ý muốn, đề xuất bồi thường và cam kết nâng cao chất lượng dịch vụ (tối thiểu 120 từ).`,

  'de-13': `Bạn nhìn thấy quảng cáo tuyển dụng nhân viên phục vụ bàn bán thời gian tại Nhà hàng Sunflower. Hãy viết thư ứng tuyển gửi trưởng phòng tuyển dụng: giới thiệu trình độ học vấn, giải thích lý do muốn công việc này, miêu tả kinh nghiệm làm việc liên quan và khẳng định tại sao bạn là ứng viên phù hợp (tối thiểu 120 từ).`,

  'de-14': `Bạn nhìn thấy thông báo tuyển dụng vị trí Trợ lý Sự kiện tại Lễ hội Văn hóa Thanh niên sắp tới. Hãy viết thư ứng tuyển gửi Ban Tổ chức: giới thiệu bản thân và quá trình học đại học, nêu động lực ứng tuyển, phác thảo kinh nghiệm tổ chức sự kiện/tình nguyện và giải thích tại sao bạn là ứng viên sáng giá (tối thiểu 120 từ).`,

  'de-15': `Bạn vừa nhận được thư từ người bạn Emily. Bạn ấy sắp đến thăm Cần Thơ vào tháng Mười Hai. Hãy viết thư đưa ra một vài gợi ý về:
• Nơi ở (Where to stay)
• Món ăn nên thử (What dishes to try)
• Điểm du lịch nên tham quan (Which tourist attractions to visit)
• Trang phục nên mặc (What to wear)
Bạn nên viết ít nhất 120 từ. Không ghi tên của bạn.`,

  'de-16': `Bạn của bạn vừa hoàn thành một khóa học tiếng Anh tại Trung tâm Ngoại ngữ Rainbow và có trải nghiệm rất tuyệt vời. Bạn cũng đang dự định học tiếng Anh và muốn hỏi thêm thông tin về:
• Địa chỉ của trung tâm (The address of the center)
• Học phí (The tuition fee)
• Đội ngũ giáo viên (The teachers)
• Chương trình đào tạo (The training program)
Bạn nên viết ít nhất 120 từ. Không ghi tên của bạn.`,

  'de-17': `Người bạn Linda vừa hoàn thành một khóa học tiếng Trung tại Trung tâm Happy Chinese và rất thích khóa học đó. Bạn cũng đang lên kế hoạch học tiếng Trung. Hãy viết thư cho Linda hỏi về:
• Học phí (the tuition fee)
• Thời lượng khóa học (the course duration)
• Đội ngũ giáo viên (the teachers)
• Lịch học (the class schedule)
Bạn nên viết ít nhất 120 từ. Không ghi tên hoặc địa chỉ của bạn.`,

  'de-18': `Bạn vừa nhận được thư từ người bạn Nam hỏi thông tin về khóa học tiếng Anh tại Trung tâm Ngoại ngữ Rainbow mà bạn vừa hoàn thành. Hãy viết thư hồi âm cho Nam cung cấp thông tin về:
• Địa chỉ của trung tâm (the address of the center)
• Học phí (the tuition fee)
• Đội ngũ giáo viên (the teachers)
• Chương trình đào tạo (the training program)
Bạn nên viết ít nhất 120 từ. Không ghi tên hoặc địa chỉ của bạn.`,

  'de-19': `Người bạn người Anh Emily viết thư hỏi bạn về Hoa — người bạn muốn xin ở nhờ nhà gia đình Emily tại London trong thời gian đầu tham gia khóa học cho đến khi tìm được căn hộ. Hãy viết thư hồi âm cho Emily miêu tả tính cách, sở thích, công việc hoặc việc học tập hiện tại của Hoa để Emily biết liệu Hoa có hòa hợp với gia đình mình hay không (tối thiểu 120 từ).`,

  'de-20': `Bạn là hội viên của một trung tâm thể thao địa phương. Gần đây bạn sử dụng phòng thay đồ và không hài lòng với tình trạng của phòng. Hãy viết email gửi người quản lý trung tâm thể thao:
• Miêu tả các vấn đề bạn phát hiện trong phòng thay đồ
• Giải thích tình huống đó khiến bạn cảm thấy thế nào
• Đề xuất những việc nên làm để cải thiện cơ sở vật chất
Bạn nên viết ít nhất 120 từ. Không ghi tên của bạn.`,

  'de-21': `Gần đây bạn đã ở tại một khách sạn trong kỳ nghỉ nhưng không hài lòng với căn phòng của mình. Hãy viết thư gửi người quản lý khách sạn để phàn nàn:
• Miêu tả các vấn đề của căn phòng
• Giải thích bạn cảm thấy thế nào về trải nghiệm này
• Đề xuất một số biện pháp cải thiện
Bạn nên viết ít nhất 120 từ. Không ghi tên của bạn.`,

  'de-22': `Gần đây bạn đã ở tại một khách sạn và nhận được email từ người quản lý xin ý kiến phản hồi về kỳ nghỉ của bạn. Hãy viết email đưa ra ý kiến:
• Nêu rõ bạn hài lòng hay không hài lòng với dịch vụ
• Miêu tả trải nghiệm của bạn
• Gợi ý các cách khách sạn có thể cải thiện dịch vụ
Bạn nên viết ít nhất 120 từ. Không ghi tên của bạn.`,

  'de-23': `Gần đây bạn đã dùng bữa tối tại một nhà hàng mới cùng gia đình. Vài ngày sau, người quản lý gửi email xin ý kiến phản hồi. Hãy viết email phản hồi:
• Nêu rõ bạn hài lòng hay không hài lòng với nhà hàng
• Miêu tả trải nghiệm của bạn
• Gợi ý các cách nhà hàng có thể cải thiện dịch vụ
Bạn nên viết ít nhất 120 từ. Không ghi tên của bạn.`,

  'de-24': `Bạn đã mượn một cuốn sách từ người bạn Helen nhưng quên trả lại. Hãy viết thư hồi âm cho Helen:
• Xin lỗi vì đã không trả cuốn sách đúng hẹn
• Giải thích hoàn cảnh hiện tại của bạn và nêu rõ bạn đã đọc xong sách hay chưa
• Nói rõ khi nào và bằng cách nào bạn sẽ trả lại cuốn sách
Bạn nên viết ít nhất 120 từ. Không ghi tên của bạn.`,

  'de-25': `Bạn vừa nhận được email từ giáo sư nhắc nhở về việc chưa nộp bài tập đúng hạn thứ Sáu tuần trước. Hãy viết thư hồi âm cho giáo sư:
• Xin lỗi vì đã nộp bài tập muộn
• Giải thích lý do tại sao bạn không thể nộp bài đúng hạn
• Nói rõ khi nào và bằng cách nào bạn sẽ nộp bài tập
Bạn nên viết ít nhất 120 từ. Không ghi tên của bạn.`,

  'de-26': `Bạn nhìn thấy quảng cáo tuyển dụng nhân viên bán hàng tại một cửa hàng quần áo trong thành phố. Hãy viết email ứng tuyển:
• Giới thiệu bản thân và hoàn cảnh hiện tại của bạn
• Nói rõ tại sao bạn quan tâm đến vị trí này
• Đề cập đến kinh nghiệm làm việc với khách hàng
Bạn nên viết ít nhất 120 từ. Không ghi tên của bạn.`,

  'de-27': `Bạn nhìn thấy quảng cáo tuyển dụng vị trí nhân viên lễ tân tại một khách sạn nhỏ trong thành phố. Hãy viết email ứng tuyển:
• Giới thiệu bản thân và hoàn cảnh hiện tại của bạn
• Nói rõ tại sao bạn quan tâm đến vị trí này
• Đề cập kinh nghiệm làm việc với khách hàng hoặc khách lưu trú
• Giải thích tại sao bạn là ứng cử viên phù hợp cho công việc
Bạn nên viết ít nhất 120 từ. Không ghi tên của bạn.`
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
  showToast('Đã lưu nháp và quay lại Bước 1 để xem đề & dàn ý.', 'info');
}

// ============================================================================
// 8. STEP 1: ĐỌC HIỂU ĐỀ, CHỌN Ý TƯỞNG B2, DÀN Ý 5 BƯỚC & TỪ VỰNG
// ============================================================================
function ensureDefaultIdeasSelected(topic) {
  if (!topic || !topic.details || !Array.isArray(topic.details.suggested_ideas)) return;
  if (!state.selectedIdeasByTopic[topic.id]) {
    const defaults = {};
    topic.details.suggested_ideas.forEach((group, gIdx) => {
      if (group.options && group.options.length > 0) {
        defaults[gIdx] = [0]; // Select first B2 option of each requirement by default
      }
    });
    state.selectedIdeasByTopic[topic.id] = defaults;
    saveSelectedIdeas();
  }
}

function saveSelectedIdeas() {
  try {
    localStorage.setItem(STORAGE_KEYS.IDEAS, JSON.stringify(state.selectedIdeasByTopic));
  } catch (e) {}
}

function toggleLetterIdeaSelection(gIdx, optIdx) {
  const topic = state.activeTopic;
  if (!topic) return;
  ensureDefaultIdeasSelected(topic);

  const topicSel = state.selectedIdeasByTopic[topic.id] || {};
  const currentArr = Array.isArray(topicSel[gIdx]) ? [...topicSel[gIdx]] : [];

  const pos = currentArr.indexOf(optIdx);
  if (pos >= 0) {
    if (currentArr.length === 1) {
      showToast('Mỗi yêu cầu của đề bài cần giữ ít nhất 1 ý tưởng để bài thư đủ ý!', 'warning');
      return;
    }
    currentArr.splice(pos, 1);
  } else {
    // Replace single selection or allow up to 2 ideas per requirement
    if (currentArr.length >= 2) {
      currentArr.shift();
    }
    currentArr.push(optIdx);
  }

  topicSel[gIdx] = currentArr;
  state.selectedIdeasByTopic[topic.id] = topicSel;
  saveSelectedIdeas();

  renderStep1Reading();
}

function formatPromptDisplayHtml(rawPrompt) {
  if (!rawPrompt) return '';
  return rawPrompt.split('\n').map(line => {
    const trimmed = line.trim();
    if (!trimmed) return '<div style="height: 0.4rem;"></div>';
    let safe = escapeHtml(trimmed).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    if (/^[•\-o]\s+/.test(trimmed)) {
      return `<div style="padding: 0.4rem 0.75rem; margin: 0.25rem 0; background: rgba(99, 102, 241, 0.08); border-left: 3px solid var(--accent-primary); border-radius: 4px; font-weight: 600;">${safe}</div>`;
    }
    return `<div style="margin-bottom: 0.35rem;">${safe}</div>`;
  }).join('');
}

// Build a natural B2 English sentence + Vietnamese prompt from a suggested_ideas option
function buildB2IdeaSentencePair(topic, group, opt, seqIndex) {
  const catKey = topic.category_id || 'advice';
  const isInformal = /informal|thân mật|bạn bè/i.test(topic.recipient_type || topic.details?.analysis?.letter_type || '');

  const connectorsInformal = ['First of all,', 'Secondly,', 'Besides that,', 'Finally,', 'Last but not least,'];
  const connectorsFormal = ['To begin with,', 'Secondly,', 'In addition,', 'Furthermore,', 'Finally,'];
  const conn = (isInformal ? connectorsInformal : connectorsFormal)[seqIndex % 5];

  const connectorsVi = ['Trước hết,', 'Thứ hai,', 'Bên cạnh đó,', 'Ngoài ra,', 'Cuối cùng,'];
  const connVi = connectorsVi[seqIndex % 5];

  let actEn = (opt.action_en || opt.problem_en || '').trim();
  let actVi = (opt.action_vi || opt.problem_vi || '').trim();
  let rsnEn = (opt.reason_en || opt.impact_en || '').trim();
  let rsnVi = (opt.reason_vi || opt.impact_vi || '').trim();
  let exp1En = (opt.expansion_1_en || '').trim();
  let exp1Vi = (opt.expansion_1_vi || '').trim();
  let solEn = (opt.solution_en || '').trim();
  let solVi = (opt.solution_vi || '').trim();

  let mainSentenceEn = '';
  let mainSentenceVi = '';

  const startsWithUpper = /^[A-Z]/.test(actEn);
  const alreadyHasConnector = /^(First|Second|Third|Next|Finally|Last|To begin|In addition|Furthermore|Moreover|Besides|Regarding|As for|However)\b/i.test(actEn);

  if (!startsWithUpper) {
    // Bare verb phrase (e.g., "stay at a hotel in the Old Quarter") -> Wrap in B2 advice/suggestion frame
    const framesEn = [
      `it would be a great idea to ${actEn}`,
      `I would strongly recommend that you ${actEn}`,
      `if I were you, I would ${actEn}`,
      `you should definitely ${actEn}`
    ];
    const framesVi = [
      `sẽ là một ý tưởng tuyệt vời nếu bạn ${actVi}`,
      `tớ đặc biệt khuyên bạn nên ${actVi}`,
      `nếu tớ là bạn, tớ sẽ ${actVi}`,
      `bạn nhất định nên ${actVi}`
    ];
    const fEn = framesEn[seqIndex % framesEn.length];
    const fVi = framesVi[seqIndex % framesVi.length];

    if (rsnEn) {
      const cleanRsn = rsnEn.endsWith('.') ? rsnEn : rsnEn + '.';
      mainSentenceEn = `${conn} ${fEn} ${cleanRsn}`;
    } else {
      mainSentenceEn = `${conn} ${fEn}.`;
    }

    if (rsnVi) {
      const cleanRsnVi = rsnVi.endsWith('.') ? rsnVi : rsnVi + '.';
      mainSentenceVi = `${connVi} ${fVi} ${cleanRsnVi}`;
    } else {
      mainSentenceVi = `${connVi} ${fVi}.`;
    }
  } else {
    // Already a full clause/sentence
    let adjustedActEn = actEn;
    if (!alreadyHasConnector) {
      const startsWithPronounI = /^I(\s|['’])/.test(actEn);
      const loweredFirst = startsWithPronounI ? actEn : actEn.charAt(0).toLowerCase() + actEn.slice(1);
      adjustedActEn = `${conn} ${loweredFirst}`;
    }

    if (rsnEn) {
      if (/^[a-z]/.test(rsnEn)) {
        // Subordinate clause like "because ..."
        const strippedAct = adjustedActEn.replace(/[.?!]+$/, '');
        const endPunct = adjustedActEn.trim().endsWith('?') ? '?' : '.';
        const cleanRsn = rsnEn.replace(/[.?!]+$/, '') + endPunct;
        mainSentenceEn = `${strippedAct} ${cleanRsn}`;
      } else {
        const cleanAct = /[.?!]$/.test(adjustedActEn) ? adjustedActEn : adjustedActEn + '.';
        const cleanRsn = /[.?!]$/.test(rsnEn) ? rsnEn : rsnEn + '.';
        mainSentenceEn = `${cleanAct} ${cleanRsn}`;
      }
    } else {
      mainSentenceEn = /[.?!]$/.test(adjustedActEn) ? adjustedActEn : adjustedActEn + '.';
    }

    let adjustedActVi = alreadyHasConnector ? actVi : `${connVi} ${actVi.charAt(0).toLowerCase() + actVi.slice(1)}`;
    if (rsnVi) {
      if (/^[a-zàáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]/.test(rsnVi)) {
        mainSentenceVi = `${adjustedActVi.replace(/[.?!]+$/, '')} ${rsnVi.endsWith('.') ? rsnVi : rsnVi + '.'}`;
      } else {
        const cActVi = /[.?!]$/.test(adjustedActVi) ? adjustedActVi : adjustedActVi + '.';
        const cRsnVi = /[.?!]$/.test(rsnVi) ? rsnVi : rsnVi + '.';
        mainSentenceVi = `${cActVi} ${cRsnVi}`;
      }
    } else {
      mainSentenceVi = /[.?!]$/.test(adjustedActVi) ? adjustedActVi : adjustedActVi + '.';
    }
  }

  // Append B2 Expansion 1 (or Solution for complaint) to make a rich B2 paragraph point!
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

  return { en: mainSentenceEn.trim(), vi: mainSentenceVi.trim() };
}

function getOutlineHtmlForTopic(topic) {
  const catKey = topic?.category_id || CATEGORY_META[state.currentCategory]?.key || 'advice';
  if (typeof B2_DETAILED_OUTLINES !== 'undefined' && B2_DETAILED_OUTLINES[catKey]) {
    return `<div class="b2-detailed-outline-wrapper">${B2_DETAILED_OUTLINES[catKey]}</div>`;
  }
  const catData = getCategoryData(topic?.catNum || state.currentCategory);
  if (catData && catData.master_outline) {
    const mo = catData.master_outline;
    return `
      <ul class="outline-summary-list">
        <li><strong>1. Lời chào mở đầu (Salutation):</strong> ${escapeHtml(mo.step1_salutation || 'Dear ...,')}</li>
        <li><strong>2. Mở thư (Opening):</strong> ${escapeHtml(mo.step2_opening || '')}</li>
        <li><strong>3. Thân thư (Body Paragraphs):</strong> ${escapeHtml(mo.step3_body?.intro || '')} (${escapeHtml(mo.step3_body?.connectors || '')})</li>
        <li><strong>4. Kết thư (Closing):</strong> ${escapeHtml(mo.step4_closing || '')}</li>
        <li><strong>5. Ký tên / Kết thúc (Sign-off):</strong> ${escapeHtml(mo.step5_signoff || '')}</li>
      </ul>
    `;
  }
  return '';
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

  // Group vocabulary by category
  const vocabByGroup = {};
  vocabList.forEach(v => {
    const g = v.category || 'Từ vựng trọng tâm B2';
    if (!vocabByGroup[g]) vocabByGroup[g] = [];
    vocabByGroup[g].push(v);
  });

  // Build Interactive Idea Selection HTML
  let ideaSelectorHtml = '';
  if (suggestedIdeas.length > 0) {
    let selectedSummaryItems = [];
    let seqCounter = 0;

    const groupsHtml = suggestedIdeas.map((group, gIdx) => {
      const selArr = topicSel[gIdx] || [0];
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
              ${rsnEn ? `<div class="idea-card-point" style="margin-top: 0.2rem;"><strong style="color: var(--warning);">↳ Lý do/Chi tiết:</strong> ${escapeHtml(rsnEn)}</div>` : ''}
              ${expEn ? `<div class="idea-card-point" style="margin-top: 0.2rem;"><strong style="color: var(--success);">✨ Mở rộng B2:</strong> ${escapeHtml(expEn)}</div>` : ''}
            </div>
          </div>
        `;
      }).join('');

      return `
        <div class="idea-group-col">
          <div class="idea-group-title-row">
            <div class="idea-group-title">📌 ${escapeHtml(group.title_vi || group.title_en || `Yêu cầu ${gIdx + 1}`)}</div>
            <span class="idea-group-badge">Đã chọn ${selArr.length} ý</span>
          </div>
          ${optionsHtml}
        </div>
      `;
    }).join('');

    const summaryHtml = selectedSummaryItems.length > 0 ? `
      <div style="margin-top: 1.25rem; padding: 1rem 1.25rem; background: var(--bg-primary); border: 1px solid var(--accent-primary); border-radius: var(--radius-md);">
        <div style="font-weight: 700; color: var(--accent-primary); margin-bottom: 0.65rem; font-size: 0.92rem;">
          ✅ DÀN Ý CÁC CÂU THÂN THƯ B2 BẠN ĐÃ CHỌN (SẼ CHUYỂN SANG BƯỚC 2 ĐỂ TẬP DIỄN ĐẠT):
        </div>
        <ul class="outline-summary-list">
          ${selectedSummaryItems.map((item, idx) => `
            <li>
              <strong>Đoạn thân ${idx + 1} (${escapeHtml(item.reqTitle)}):</strong><br>
              <span style="color: var(--text-primary); font-weight: 600;">${escapeHtml(item.en)}</span><br>
              <span style="color: var(--text-secondary); font-size: 0.86rem; font-style: italic;">(${escapeHtml(item.vi)})</span>
            </li>
          `).join('')}
        </ul>
      </div>
    ` : '';

    ideaSelectorHtml = `
      <div class="reading-section-card idea-selection-card">
        <div class="idea-selection-header">
          <div>
            <h3 style="margin-bottom: 0.35rem; border: none; padding: 0;">🎯 BƯỚC CHỌN Ý TƯỞNG & CÂU MỞ RỘNG B2 CHO BỨC THƯ</h3>
            <p style="font-size: 0.9rem; color: var(--text-secondary);">
              Nhấn vào các ô bên dưới để chọn ý tưởng bạn muốn viết cho từng câu hỏi của đề bài. Các ý được chọn sẽ tự động đồng bộ sang <strong>Bước 2: Tập diễn đạt ý tưởng</strong>!
            </p>
          </div>
        </div>
        <div class="idea-selection-grid">
          ${groupsHtml}
        </div>
        ${summaryHtml}
      </div>
    `;
  }

  const reqsList = analysis.key_requirements || [];
  const taskExtractions = details.task_extractions || [];

  container.innerHTML = `
    <!-- CARD 1: ĐỀ BÀI SONG NGỮ & PHÂN TÍCH 4 YẾU TỐ CỐT LÕI -->
    <div class="reading-section-card">
      <h3>📖 1. ĐỌC HIỂU & PHÂN TÍCH ĐỀ BÀI (VSTEP TASK 1 - B2)</h3>
      <div class="essay-comparison-grid" style="margin-bottom: 1.25rem;">
        <div class="essay-col" style="background: var(--bg-primary);">
          <h4>🇬🇧 ĐỀ BÀI TIẾNG ANH (EXAM PROMPT)</h4>
          <div style="font-size: 0.98rem; line-height: 1.65; color: var(--text-primary);">
            ${formatPromptDisplayHtml(topic.prompt || topic.context)}
          </div>
        </div>
        <div class="essay-col" style="background: var(--bg-primary);">
          <h4>🇻🇳 BẢN DỊCH TIẾNG VIỆT</h4>
          <div style="font-size: 0.96rem; line-height: 1.65; color: var(--text-secondary); white-space: pre-line;">
            ${escapeHtml(getTopicPromptTranslation(topic))}
          </div>
        </div>
      </div>

      <ul class="paraphrase-list">
        <li><strong>👤 Người nhận thư (Recipient):</strong> ${escapeHtml(analysis.recipient || topic.recipient_type || 'Người nhận trong đề bài')}</li>
        <li><strong>🎭 Văn phong bắt buộc (Register):</strong> <span style="color: var(--accent-primary); font-weight: 700;">${escapeHtml(analysis.letter_type || topic.recipient_type || 'Informal / Formal')}</span> ${/formal/i.test(analysis.letter_type || topic.recipient_type || '') && !/informal/i.test(analysis.letter_type || topic.recipient_type || '') ? '— <em>Lưu ý: Tuyệt đối KHÔNG viết tắt (I\'m, don\'t, can\'t)!</em>' : '— <em>Lưu ý: Dùng giọng điệu thân thiện, tự nhiên với bạn bè.</em>'}</li>
        <li><strong>🎯 Mục đích viết thư (Purpose):</strong> ${escapeHtml(analysis.purpose || topic.title_vi)}</li>
        <li>
          <strong>📌 Các yêu cầu bắt buộc cần trả lời đủ trong Thân thư:</strong>
          <div style="margin-top: 0.5rem; display: flex; flex-direction: column; gap: 0.35rem;">
            ${taskExtractions.length > 0
              ? taskExtractions.map((te, i) => `<div><strong>(${i + 1}) ${escapeHtml(te.task_title)}:</strong> ${escapeHtml(te.task_goal)}</div>`).join('')
              : reqsList.map((r, i) => `<div><strong>(${i + 1})</strong> ${escapeHtml(r)}</div>`).join('')
            }
          </div>
        </li>
      </ul>
    </div>

    <!-- CARD 2: CHỌN Ý TƯỞNG B2 -->
    ${ideaSelectorHtml}

    <!-- CARD 3: KHUNG DÀN Ý 5 PHẦN CHUẨN B2 & TỪ VỰNG CHỦ ĐỀ -->
    <div class="reading-section-card">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem; border-bottom: 1px solid var(--panel-border); padding-bottom: 0.5rem;">
        <h3 style="margin: 0; border: none; padding: 0;">📐 2. KHUNG DÀN Ý 5 PHẦN CHUẨN B2 (${escapeHtml((topic.categoryTitleVi || '').toUpperCase())})</h3>
        <button class="btn btn-secondary" onclick="toggleStep1MasterOutline()" id="btn-toggle-step1-outline" style="font-size: 0.8rem; padding: 0.35rem 0.75rem;">
          Thu gọn / Mở rộng dàn ý
        </button>
      </div>
      <div id="step1-master-outline-box" style="display: block;">
        ${getOutlineHtmlForTopic(topic)}
      </div>
    </div>

    <!-- CARD 4: TỪ VỰNG & CỤM TỪ ĂN ĐIỂM B2 THEO CHỦ ĐỀ -->
    <div class="reading-section-card">
      <h3>💎 3. TỪ VỰNG & CỤM TỪ CHỦ ĐỀ GHI ĐIỂM B2 (${vocabList.length} CỤM TỪ)</h3>
      ${Object.keys(vocabByGroup).length > 0 ? Object.keys(vocabByGroup).map(gName => `
        <div style="margin-bottom: 1rem;">
          <div style="font-weight: 700; font-size: 0.9rem; color: var(--warning); margin-bottom: 0.5rem;">🔸 ${escapeHtml(gName)}</div>
          <ul class="vocab-notes-list">
            ${vocabByGroup[gName].map(v => `
              <li>
                <strong style="color: var(--accent-primary);">${escapeHtml(v.en)}</strong>
                <div style="color: var(--text-secondary); font-size: 0.85rem; margin-top: 0.15rem;">${escapeHtml(v.vi)}</div>
              </li>
            `).join('')}
          </ul>
        </div>
      `).join('') : '<div class="empty-state">Từ vựng đã được tích hợp trực tiếp trong phần gợi ý ý tưởng và bài mẫu B2.</div>'}

      <div style="margin-top: 1.5rem; display: flex; justify-content: flex-end;">
        <button class="btn btn-primary" onclick="switchStep('trans')" style="padding: 0.75rem 1.5rem; font-size: 0.95rem;">
          TIẾP THEO: BƯỚC 02 - TẬP DIỄN ĐẠT Ý TƯỞNG B2 &rarr;
        </button>
      </div>
    </div>
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
      const selArr = topicSel[gIdx] || [0];
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
