#!/bin/bash
# ==========================================================================
# SCRIPT ĐẨY THAY ĐỔI LÊN GITHUB & ĐỒNG BỘ THƯ MỤC MIRROR
# ==========================================================================

TARGET_DIR="/Users/nguyetpham/Desktop/WEBSITE/WRITING LETTERS - PRACTICE - B2 LEVEL"
MIRROR_DIR="/Users/nguyetpham/Desktop/WEBSITE/WRITING TASK 01 - B2 NÂNG CAO"

cd "$TARGET_DIR" || exit 1

MSG="${1:-feat: rebuild Phòng Viết Thư B2 Level chuẩn 4 bước như Phòng Viết Luận}"
NOW=$(date "+%Y-%m-%d %H:%M:%S")

echo "============================================================"
echo "🚀 ĐANG TIẾN HÀNH CẬP NHẬT GITHUB ($NOW)"
echo "🌐 Repo chính: https://github.com/englishwithmsnguyet-dev/vstepwritingtask1practice-b2.git"
echo "🌐 Repo phụ:   https://github.com/englishwithmsnguyet-dev/writingtask1practice-b2nangcao.git"
echo "============================================================"

# 1. Đồng bộ sang Mirror
if [ -d "$MIRROR_DIR" ]; then
  cp -R "$TARGET_DIR/app.js" "$MIRROR_DIR/"
  cp -R "$TARGET_DIR/index.html" "$MIRROR_DIR/"
  cp -R "$TARGET_DIR/styles.css" "$MIRROR_DIR/"
  cp -R "$TARGET_DIR/letters_db.js" "$MIRROR_DIR/"
  cp -R "$TARGET_DIR/theory_data.js" "$MIRROR_DIR/"
  echo "✅ Đã đồng bộ sang mirror thành công!"
fi

# 2. Git add, commit, push
git add .
git commit -m "$MSG" || echo "ℹ️ Không có thay đổi mới để commit."

git push -u origin main
git push -u b2nangcao main
echo "🎉 HOÀN TẤT CẬP NHẬT LÊN GITHUB!"
