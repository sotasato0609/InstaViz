import type { Post } from '../types';

interface PostCardProps {
  post: Post;
}

/** メディアタイプのバッジラベル */
const MEDIA_TYPE_LABELS: Record<string, { label: string; color: string }> = {
  IMAGE: { label: '画像', color: 'bg-blue-100 text-blue-700' },
  VIDEO: { label: '動画', color: 'bg-purple-100 text-purple-700' },
  CAROUSEL_ALBUM: { label: 'カルーセル', color: 'bg-emerald-100 text-emerald-700' },
  REEL: { label: 'リール', color: 'bg-rose-100 text-rose-700' },
};

/**
 * 投稿カード
 * サムネイル + メトリクス表示
 */
const PostCard = ({ post }: PostCardProps) => {
  const mediaType = MEDIA_TYPE_LABELS[post.mediaType] || { label: post.mediaType, color: 'bg-gray-100 text-gray-700' };
  const postedDate = new Date(post.postedAt);
  const dateStr = `${postedDate.getFullYear()}/${postedDate.getMonth() + 1}/${postedDate.getDate()}`;

  return (
    <div className="bg-white rounded-lg border border-[#DDE1EC] overflow-hidden hover:shadow-md transition-shadow">
      {/* サムネイル */}
      <div className="relative aspect-square bg-gray-100">
        <img
          src={post.thumbnailUrl}
          alt={post.caption.slice(0, 30)}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* メディアタイプバッジ */}
        <span className={`absolute top-2 left-2 text-xs font-medium px-2 py-0.5 rounded ${mediaType.color}`}>
          {mediaType.label}
        </span>
      </div>

      {/* コンテンツ */}
      <div className="p-4">
        {/* 日付 */}
        <p className="text-xs text-[#6B7080] mb-2">{dateStr}</p>

        {/* キャプション（2行まで） */}
        <p className="text-sm text-[#111111] line-clamp-2 mb-3 min-h-[2.5rem]">
          {post.caption}
        </p>

        {/* メトリクス */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <MetricItem label="いいね" value={post.metrics.likes} />
          <MetricItem label="コメント" value={post.metrics.comments} />
          <MetricItem label="保存" value={post.metrics.saves} />
        </div>

        <div className="border-t border-[#DDE1EC] mt-3 pt-3 grid grid-cols-3 gap-2 text-center">
          <MetricItem label="リーチ" value={post.metrics.reach} />
          <MetricItem label="IMP" value={post.metrics.impressions} />
          <MetricItem label="ER" value={post.metrics.engagementRate} suffix="%" />
        </div>
      </div>
    </div>
  );
};

/** メトリクス表示用小コンポーネント */
const MetricItem = ({
  label,
  value,
  suffix = '',
}: {
  label: string;
  value: number;
  suffix?: string;
}) => (
  <div>
    <p className="text-xs text-[#6B7080]">{label}</p>
    <p className="text-sm font-semibold text-[#111111]">
      {value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}
      {suffix}
    </p>
  </div>
);

export default PostCard;
