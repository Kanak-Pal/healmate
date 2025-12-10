import React, { useState } from 'react';
import { Users, Heart, MessageCircle, Share2, Send, Filter } from 'lucide-react';

interface Post {
  id: string;
  author: string;
  initials: string;
  content: string;
  topic: string;
  likes: number;
  comments: number;
  time: string;
  color: string;
}

export const Community: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('General');

  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: 'Sarah M.',
      initials: 'SM',
      content: "Just finished my first 5k after knee surgery! It's been a long 6 months of rehab, but I'm finally feeling like myself again. Don't give up!",
      topic: 'Recovery',
      likes: 24,
      comments: 5,
      time: '2h ago',
      color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300'
    },
    {
      id: '2',
      author: 'David K.',
      initials: 'DK',
      content: "Has anyone tried the new low-sodium diet plan for hypertension? Looking for some tasty recipe recommendations that don't taste bland.",
      topic: 'Nutrition',
      likes: 12,
      comments: 8,
      time: '4h ago',
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
    },
    {
      id: '3',
      author: 'Anonymous',
      initials: 'AN',
      content: "Feeling a bit overwhelmed with anxiety today. Remember to take deep breaths everyone. We got this.",
      topic: 'Mental Health',
      likes: 45,
      comments: 12,
      time: '5h ago',
      color: 'bg-rose-100 text-rose-600 dark:bg-rose-900 dark:text-rose-300'
    }
  ]);

  const filters = ['All', 'Recovery', 'Mental Health', 'Nutrition', 'Chronic Care', 'General'];

  const handlePost = () => {
    if (!newPostContent.trim()) return;

    const newPost: Post = {
      id: Date.now().toString(),
      author: 'You',
      initials: 'ME',
      content: newPostContent,
      topic: selectedTopic,
      likes: 0,
      comments: 0,
      time: 'Just now',
      color: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
  };

  const toggleLike = (id: string) => {
    setPosts(posts.map(post => 
      post.id === id ? { ...post, likes: post.likes + 1 } : post
    ));
  };

  const filteredPosts = activeFilter === 'All' 
    ? posts 
    : posts.filter(post => post.topic === activeFilter);

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Users className="text-blue-600" /> Community Support
        </h2>
        <p className="text-slate-500 dark:text-slate-400">Connect, share experiences, and find support from others on similar journeys.</p>
      </div>

      {/* Create Post */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-8 transition-colors">
        <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Share your experience</h3>
        <textarea
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="What's on your mind? Share a milestone, ask a question, or vent..."
          className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white dark:placeholder-slate-500 min-h-[100px] mb-4"
        />
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
            <span className="text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">Topic:</span>
            <select 
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
            >
              {filters.filter(f => f !== 'All').map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
          <button 
            onClick={handlePost}
            disabled={!newPostContent.trim()}
            className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 font-medium flex items-center justify-center gap-2 transition-colors"
          >
            Post <Send size={16} />
          </button>
        </div>
      </div>

      {/* Feed Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
        <Filter size={16} className="text-slate-400 flex-shrink-0" />
        {filters.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeFilter === filter 
                ? 'bg-slate-800 dark:bg-slate-700 text-white shadow-md' 
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Feed */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12 text-slate-400 dark:text-slate-500">
            <p>No posts found for this topic. Be the first to share!</p>
          </div>
        ) : (
          filteredPosts.map(post => (
            <div key={post.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${post.color}`}>
                    {post.initials}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-white">{post.author}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{post.time} • {post.topic}</p>
                  </div>
                </div>
              </div>
              
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">{post.content}</p>
              
              <div className="flex items-center gap-6 pt-4 border-t border-slate-50 dark:border-slate-800">
                <button 
                  onClick={() => toggleLike(post.id)}
                  className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors group"
                >
                  <Heart size={18} className="group-hover:fill-current" />
                  <span className="text-sm">{post.likes}</span>
                </button>
                <button className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <MessageCircle size={18} />
                  <span className="text-sm">{post.comments}</span>
                </button>
                <button className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ml-auto">
                  <Share2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};