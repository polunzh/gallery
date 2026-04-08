#!/bin/bash
# Upload tianmimi album images to R2 one by one

set -e

SOURCE_DIR="/Users/zhenqiang/Pictures/甜蜜蜜"
BUCKET="gallery-assets"
ALBUM_ID="tianmimi"

# Array of files and their target names
declare -a FILES=(
  "真正的相遇.png:01-true-meeting.jpg"
  "第一次见面.png:02-first-meeting.jpg"
  "初遇后复杂的心情.png:03-complex-feeling.jpg"
  "第一次见面-不熟练的粤语.png:04-cantonese.jpg"
  "第一次私下交谈.png:05-first-chat.jpg"
  "姑姑的照顾.png:06-aunt-care.jpg"
  "初来乍到-雨中用自行车送货.png:07-rain-delivery.jpg"
  "上英语课.png:08-english-class.jpg"
  "学习英文.png:09-study-english.jpg"
  "查银行卡余额.png:10-check-balance.jpg"
  "第一次骑自行车.png:11-bike-ride.jpg"
  "第一次骑自行车-唱歌.png:12-singing.jpg"
  "美好.png:13-beautiful.jpg"
  "日常相处.png:14-daily-life.jpg"
  "吃惊黎小军的单纯.png:15-surprised.jpg"
  "傻笑.png:16-silly-smile.jpg"
  "买金手镯-惊讶黎小军同时想着小婷.png:17-bracelet.jpg"
  "安慰李翘.png:18-comfort.jpg"
  "爱李翘的豹哥去世了.png:19-paoge-dead.jpg"
  "第一次重逢-五味杂陈.png:20-reunion1-mixed.jpg"
  "第一次重逢-直面真心.png:21-reunion1-truth.jpg"
  "第二次重逢-看见黎小军的背影.png:22-reunion2-see.jpg"
  "第二次重逢-追逐骑车的黎小军.png:23-reunion2-chase.jpg"
  "第二次重逢-最终没有追上黎小军.png:24-reunion2-miss.jpg"
  "在美国的普通生活.png:25-us-life.jpg"
  "最终的重逢-观看邓丽君去世的消息.png:26-teresa-dead.jpg"
  "最终的重逢-认出了黎小军.png:27-final-recognize-him.jpg"
  "最终的重逢-黎小军认出了李翘.png:28-final-recognize-her.jpg"
  "最终的重逢-李翘开心的笑了.png:29-final-smile-her.jpg"
  "最终的重逢-黎开心的笑了.png:30-final-smile-him.jpg"
)

TOTAL=${#FILES[@]}
SUCCESS=0
FAILED=0

echo "Uploading $TOTAL images for album '$ALBUM_ID' to R2 bucket '$BUCKET'..."
echo ""

for ITEM in "${FILES[@]}"; do
  IFS=':' read -r ORIGINAL TARGET <<< "$ITEM"
  LOCAL_PATH="$SOURCE_DIR/$ORIGINAL"
  R2_KEY="$ALBUM_ID/$TARGET"

  echo "[$((SUCCESS + FAILED + 1))/$TOTAL] $ORIGINAL → $R2_KEY"

  if [ ! -f "$LOCAL_PATH" ]; then
    echo "  ✗ Failed: File not found: $LOCAL_PATH"
    FAILED=$((FAILED + 1))
    continue
  fi

  if NODE_OPTIONS="--dns-result-order=ipv6first" env -u CLOUDFLARE_API_TOKEN npx wrangler r2 object put "$BUCKET/$R2_KEY" --file="$LOCAL_PATH" --remote 2>&1; then
    echo "  ✓ Success"
    SUCCESS=$((SUCCESS + 1))
  else
    echo "  ✗ Failed"
    FAILED=$((FAILED + 1))
  fi
done

echo ""
echo "Done: $SUCCESS uploaded, $FAILED failed"

if [ $FAILED -gt 0 ]; then
  exit 1
fi
