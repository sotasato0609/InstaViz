import { useState, useMemo } from 'react';
import Layout from '../components/Layout';
import PostCard from '../components/PostCard';
import { mockPosts } from '../mocks/data';
import type { PostSortKey, SortOrder, MediaType } from '../types';

/** ソートオプション */
const SORT_OPTIONS: Array<{ key: PostSortKey; label: string }> = [
  { key: 'postedAt', label: '投稿日順' },
  { key: 'engagementRate', label: 'ER順' },
  { key: 'likes', label: 'いいね順' },
  { key: 'reach', label: 'リーチ順' },
];

/** メディアタイプフィルター */
const MEDIA_FILTERS: Array<{ value: MediaType | 'ALL'; label: string }> = [
  { value: 'ALL', label: 'すべて' },
  { value: 'IMAGE', label: '画像' },
  { value: 'VIDEO', label: '動画' },
  { value: 'CAROUSEL_ALBUM', label: 'カルーセル' },
  { value: 'REEL', label: 'リール' },
];

/**
 * 投稿一覧ページ
 * ソート・フィルター対応のグリッド表示
 */
const PostsPage = () => {
  const [sortKey, setSortKey] = useState<PostSortKey>('postedAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [mediaFilter, setMediaFilter] = useState<MediaType | 'ALL'>('ALL');

  // フィルター・ソート適用
  const filteredPosts = useMemo(() => {
    let posts = [...mockPosts];

    // メディアタイプフィルター
    if (mediaFilter !== 'ALL') {
      posts = posts.filter((p) => p.mediaType === mediaFilter);
    }

    // ソート
    posts.sort((a, b) => {
      let valA: number;
      let valB: number;

      switch (sortKey) {
        case 'postedAt':
          valA = new Date(a.postedAt).getTime();
          valB = new Date(b.postedAt).getTime();
          break;
        case 'engagementRate':
          valA = a.metrics.engagementRate;
          valB = b.metrics.engagementRate;
          break;
        case 'likes':
          valA = a.metrics.likes;
          valB = b.metrics.likes;
          break;
        case 'reach':
          valA = a.metrics.reach;
          valB = b.metrics.reach;
          break;
        default:
          return 0;
      }

      return sortOrder === 'desc' ? valB - valA : valA - valB;
    });

    return posts;
  }, [sortKey, sortOrder, mediaFilter]);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'));
  };

  return (
    <Layout title="投稿一覧">
      {/* コントロールバー */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        {/* メディアタイプフィルター */}
        <div className="flex gap-1 bg-[#F5F6F9] rounded-lg p-1 overflow-x-auto">
          {MEDIA_FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setMediaFilter(filter.value)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                mediaFilter === filter.value
                  ? 'bg-white text-[#1B2860] shadow-sm'
                  : 'text-[#6B7080] hover:text-[#111111]'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* ソートコントロール */}
        <div className="flex items-center gap-2">
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as PostSortKey)}
            className="text-sm border border-[#DDE1EC] rounded-md px-3 py-1.5 text-[#111111] bg-white focus:outline-none focus:ring-2 focus:ring-[#CC0022]/20 focus:border-[#CC0022]"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.key} value={opt.key}>
                {opt.label}
              </option>
            ))}
          </select>
          <button
            onClick={toggleSortOrder}
            className="p-1.5 border border-[#DDE1EC] rounded-md hover:bg-[#F5F6F9] transition-colors cursor-pointer"
            title={sortOrder === 'desc' ? '降順' : '昇順'}
          >
            <svg
              className={`w-4 h-4 text-[#6B7080] transition-transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* 結果件数 */}
      <p className="text-sm text-[#6B7080] mb-4">
        {filteredPosts.length} 件の投稿
      </p>

      {/* 投稿グリッド */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-[#DDE1EC] p-12 text-center">
          <p className="text-[#6B7080]">該当する投稿がありません</p>
        </div>
      )}
    </Layout>
  );
};

export default PostsPage;
