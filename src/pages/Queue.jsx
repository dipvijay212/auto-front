import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  Search,
  Check,
  X,
  AlertCircle,
  Filter,
  RefreshCw
} from 'lucide-react';
import {
  useTopics,
  useAddTopic,
  useUpdateTopic,
  useDeleteTopic,
  useGenerateAITopics
} from '../services/topic.service';

export default function Queue() {
  const { data: topics = [], isLoading, isError, refetch } = useTopics();
  const addTopicMutation = useAddTopic();
  const updateTopicMutation = useUpdateTopic();
  const deleteTopicMutation = useDeleteTopic();
  const generateAIMutation = useGenerateAITopics();

  // Local state for AI generation
  const [niche, setNiche] = useState('');
  
  // Local state for manual addition
  const [manualTitle, setManualTitle] = useState('');
  const [manualNiche, setManualNiche] = useState('');
  const [manualPriority, setManualPriority] = useState('Medium');
  const [manualStatus, setManualStatus] = useState('Pending');

  // Search/filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Editing state
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editNiche, setEditNiche] = useState('');
  const [editPriority, setEditPriority] = useState('Medium');
  const [editStatus, setEditStatus] = useState('Pending');

  // Trigger AI Generate
  const handleAIGenerate = async (e) => {
    e.preventDefault();
    if (!niche.trim()) return;
    try {
      await generateAIMutation.mutateAsync(niche.trim());
      setNiche('');
    } catch (err) {
      console.error(err);
    }
  };

  // Trigger Manual Add
  const handleManualAdd = async (e) => {
    e.preventDefault();
    if (!manualTitle.trim()) return;
    try {
      await addTopicMutation.mutateAsync({
        title: manualTitle.trim(),
        niche: manualNiche.trim() || 'General',
        priority: manualPriority,
        status: manualStatus
      });
      setManualTitle('');
      setManualNiche('');
      setManualPriority('Medium');
      setManualStatus('Pending');
    } catch (err) {
      console.error(err);
    }
  };

  // Start Inline Editing
  const startEdit = (topic) => {
    setEditingId(topic._id);
    setEditTitle(topic.title);
    setEditNiche(topic.niche || 'General');
    setEditPriority(topic.priority || 'Medium');
    setEditStatus(topic.status || 'Pending');
  };

  // Save Inline Editing
  const saveEdit = async (id) => {
    if (!editTitle.trim()) return;
    try {
      await updateTopicMutation.mutateAsync({
        id,
        title: editTitle.trim(),
        niche: editNiche.trim() || 'General',
        priority: editPriority,
        status: editStatus
      });
      setEditingId(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Delete topic
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this topic?')) {
      try {
        await deleteTopicMutation.mutateAsync(id);
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Filter logic
  const filteredTopics = topics.filter(topic => {
    const titleMatch = (topic.title || topic.text || '').toLowerCase().includes(searchQuery.toLowerCase());
    const nicheMatch = (topic.niche || '').toLowerCase().includes(searchQuery.toLowerCase());
    const queryMatch = titleMatch || nicheMatch;

    const priorityMatch = filterPriority === 'All' || topic.priority === filterPriority;
    const statusMatch = filterStatus === 'All' || topic.status === filterStatus;

    return queryMatch && priorityMatch && statusMatch;
  });

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-500/10 text-red-500 border border-red-500/20';
      case 'Medium':
        return 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20';
      case 'Low':
        return 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
      default:
        return 'bg-slate-500/10 text-slate-500 border border-slate-500/20';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-slate-500/10 text-slate-500 border border-slate-500/20';
      case 'Processing':
        return 'bg-purple-500/10 text-purple-500 border border-purple-500/20';
      case 'Completed':
        return 'bg-green-500/10 text-green-500 border border-green-500/20';
      case 'Failed':
        return 'bg-red-500/10 text-red-500 border border-red-500/20';
      case 'Published':
        return 'bg-teal-500/10 text-teal-500 border border-teal-500/20';
      default:
        // Try fallback for lowercase statuses
        if (status === 'pending') return 'bg-slate-500/10 text-slate-500 border border-slate-500/20';
        if (status === 'processing') return 'bg-purple-500/10 text-purple-500 border border-purple-500/20';
        if (status === 'completed') return 'bg-green-500/10 text-green-500 border border-green-500/20';
        if (status === 'failed') return 'bg-red-500/10 text-red-500 border border-red-500/20';
        return 'bg-slate-500/10 text-slate-500 border border-slate-500/20';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 shadow-sm transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-500" />
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Topic Manager</span>
          </div>
          <button 
            onClick={() => refetch()}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            title="Refresh list"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        <h2 className="text-2xl font-bold mt-1">Topic Bank & Queue</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Store, schedule, and generate creative contents for your social channels. Start by generating 20 custom topics.
        </p>
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* AI Generator Panel */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 shadow-sm transition-colors duration-300">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <h3 className="font-semibold text-slate-800 dark:text-slate-200">AI Niche Topic Generator</h3>
          </div>
          <form onSubmit={handleAIGenerate} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                Enter Niche / Industry
              </label>
              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="e.g. React Programming, Fitness Tips, SaaS Marketing"
                className="w-full px-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              />
            </div>
            <button
              type="submit"
              disabled={generateAIMutation.isPending}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-750 text-white text-sm font-semibold py-2.5 rounded-xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {generateAIMutation.isPending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating 20 Topics...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate 20 Topics
                </>
              )}
            </button>
          </form>
        </div>

        {/* Manual Add Panel */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 shadow-sm transition-colors duration-300">
          <div className="flex items-center gap-2 mb-4">
            <Plus className="w-4 h-4 text-emerald-500" />
            <h3 className="font-semibold text-slate-800 dark:text-slate-200">Add Topic Manually</h3>
          </div>
          <form onSubmit={handleManualAdd} className="space-y-3">
            <div>
              <input
                type="text"
                value={manualTitle}
                onChange={(e) => setManualTitle(e.target.value)}
                placeholder="Topic Title / Content Idea..."
                className="w-full px-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <input
                  type="text"
                  value={manualNiche}
                  onChange={(e) => setManualNiche(e.target.value)}
                  placeholder="Niche (e.g. Code)"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <select
                  value={manualPriority}
                  onChange={(e) => setManualPriority(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div>
                <select
                  value={manualStatus}
                  onChange={(e) => setManualStatus(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Completed">Completed</option>
                  <option value="Failed">Failed</option>
                  <option value="Published">Published</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              disabled={addTopicMutation.isPending}
              className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-sm font-semibold py-2.5 rounded-xl disabled:opacity-50 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Idea to Queue
            </button>
          </form>
        </div>

      </div>

      {/* Filters & Content Bank List */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 shadow-sm transition-colors duration-300">
        
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/60 mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <h3 className="font-semibold text-slate-800 dark:text-slate-200">Content List</h3>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search niche or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Filter Priority */}
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            >
              <option value="All">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>

            {/* Filter Status */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Completed">Completed</option>
              <option value="Failed">Failed</option>
              <option value="Published">Published</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        {isLoading ? (
          <div className="text-center py-8">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-indigo-500" />
            <p className="text-xs text-slate-400 mt-2">Loading Topics...</p>
          </div>
        ) : isError ? (
          <div className="text-center py-8 text-red-500 flex flex-col items-center gap-2">
            <AlertCircle className="w-8 h-8" />
            <p className="text-xs">Failed to load topics. Check connection.</p>
          </div>
        ) : filteredTopics.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Layers className="w-12 h-12 mx-auto mb-2 text-slate-300 dark:text-slate-800" />
            <p className="text-sm">No topics found matching current filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800/60 text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4 w-40">Niche</th>
                  <th className="py-3 px-4 w-28">Priority</th>
                  <th className="py-3 px-4 w-28">Status</th>
                  <th className="py-3 px-4 w-24">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTopics.map((topic) => {
                  const isEditing = editingId === topic._id;
                  const displayTitle = topic.title || topic.text || '';
                  
                  return (
                    <tr 
                      key={topic._id} 
                      className="border-b border-slate-50 dark:border-slate-900/40 text-sm hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-all"
                    >
                      {/* Title column */}
                      <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-200">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                          />
                        ) : (
                          displayTitle
                        )}
                      </td>
                      
                      {/* Niche column */}
                      <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editNiche}
                            onChange={(e) => setEditNiche(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                          />
                        ) : (
                          topic.niche || 'General'
                        )}
                      </td>
                      
                      {/* Priority column */}
                      <td className="py-3.5 px-4">
                        {isEditing ? (
                          <select
                            value={editPriority}
                            onChange={(e) => setEditPriority(e.target.value)}
                            className="px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                          >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                          </select>
                        ) : (
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityBadgeClass(topic.priority)}`}>
                            {topic.priority || 'Medium'}
                          </span>
                        )}
                      </td>
                      
                      {/* Status column */}
                      <td className="py-3.5 px-4">
                        {isEditing ? (
                          <select
                            value={editStatus}
                            onChange={(e) => setEditStatus(e.target.value)}
                            className="px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Completed">Completed</option>
                            <option value="Failed">Failed</option>
                            <option value="Published">Published</option>
                          </select>
                        ) : (
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusBadgeClass(topic.status)}`}>
                            {topic.status || 'Pending'}
                          </span>
                        )}
                      </td>
                      
                      {/* Actions column */}
                      <td className="py-3.5 px-4 text-xs">
                        <div className="flex items-center gap-2">
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => saveEdit(topic._id)}
                                className="p-1 text-emerald-500 hover:bg-emerald-500/10 rounded transition-all"
                                title="Save changes"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="p-1 text-red-500 hover:bg-red-500/10 rounded transition-all"
                                title="Cancel"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => startEdit(topic)}
                                className="p-1 text-blue-500 hover:bg-blue-500/10 rounded transition-all"
                                title="Edit Topic"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(topic._id)}
                                className="p-1 text-red-500 hover:bg-red-500/10 rounded transition-all"
                                title="Delete Topic"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
}
