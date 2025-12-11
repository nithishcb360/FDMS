'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import AddNoteModal from '@/components/AddNoteModal';
import { caseNotesApi, CaseNoteData } from '@/lib/api/case-notes';
import { casesApi, CaseData } from '@/lib/api/cases';

export default function CaseNotesPage() {
  const [notes, setNotes] = useState<CaseNoteData[]>([]);
  const [cases, setCases] = useState<CaseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [noteTypeFilter, setNoteTypeFilter] = useState('All Types');
  const [caseFilter, setCaseFilter] = useState('All Cases');
  const [followUpFilter, setFollowUpFilter] = useState('All Notes');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetchNotes();
    fetchCases();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const data = await caseNotesApi.getAll();
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCases = async () => {
    try {
      const data = await casesApi.getAll();
      setCases(data);
    } catch (error) {
      console.error('Error fetching cases:', error);
    }
  };

  const handleDeleteNote = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await caseNotesApi.delete(id);
        await fetchNotes();
      } catch (error) {
        console.error('Error deleting note:', error);
        alert('Failed to delete note');
      }
    }
  };

  // Filter logic
  const filteredNotes = notes.filter(note => {
    const matchesSearch = searchQuery === '' ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.created_by.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesNoteType = noteTypeFilter === 'All Types' ||
      note.note_type === noteTypeFilter;

    const matchesCase = caseFilter === 'All Cases' ||
      note.case_number === caseFilter;

    const matchesFollowUp = followUpFilter === 'All Notes' ||
      (followUpFilter === 'Follow-up Required' && note.requires_follow_up);

    return matchesSearch && matchesNoteType && matchesCase && matchesFollowUp;
  });

  const totalNotes = notes.length;
  const followUpRequired = notes.filter(n => n.requires_follow_up).length;
  const importantNotes = notes.filter(n => n.note_type === 'Important').length;
  const issueNotes = notes.filter(n => n.note_type === 'Issue/Problem').length;

  const getNoteTypeColor = (type: string) => {
    switch (type) {
      case 'General Note':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'Important':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'Issue/Problem':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'Follow-up Required':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Issue Resolved':
        return 'bg-green-100 text-green-700 border-green-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) +
      ' ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <DashboardHeader />

        <main className="flex-1 p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">📝</span>
              <h1 className="text-2xl font-bold text-gray-900">Case Notes</h1>
            </div>
            <p className="text-gray-600 text-sm">Manage internal case notes and updates</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📋</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Notes</p>
                  <p className="text-2xl font-bold text-gray-900">{totalNotes}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">⚠️</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Follow-up Required</p>
                  <p className="text-2xl font-bold text-gray-900">{followUpRequired}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">❗</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Important</p>
                  <p className="text-2xl font-bold text-gray-900">{importantNotes}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🚨</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Issue/Problem</p>
                  <p className="text-2xl font-bold text-gray-900">{issueNotes}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <input
                  type="text"
                  placeholder="Note content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Note Type</label>
                <select
                  value={noteTypeFilter}
                  onChange={(e) => setNoteTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                >
                  <option>All Types</option>
                  <option>General Note</option>
                  <option>Important</option>
                  <option>Issue/Problem</option>
                  <option>Follow-up Required</option>
                  <option>Issue Resolved</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Case</label>
                <select
                  value={caseFilter}
                  onChange={(e) => setCaseFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                >
                  <option>All Cases</option>
                  {cases.map((caseItem) => (
                    <option key={caseItem.id} value={caseItem.case_number}>
                      {caseItem.case_number}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Require Follow-up</label>
                <select
                  value={followUpFilter}
                  onChange={(e) => setFollowUpFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                >
                  <option>All Notes</option>
                  <option>Follow-up Required</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setNoteTypeFilter('All Types');
                    setCaseFilter('All Cases');
                    setFollowUpFilter('All Notes');
                  }}
                  className="w-full px-4 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-900 text-sm font-medium flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <p className="text-sm text-gray-600">
                {filteredNotes.length > 0
                  ? `Showing ${filteredNotes.length} of ${notes.length} notes`
                  : notes.length > 0
                  ? 'No notes match the current filters'
                  : 'No notes added yet'}
              </p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium flex items-center gap-2"
              >
                <span>+</span>
                Add Note
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Note Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Case</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Content</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Created By</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Follow-up</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Private</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                        Loading notes...
                      </td>
                    </tr>
                  ) : filteredNotes.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                        {notes.length > 0
                          ? 'No notes match the current filters.'
                          : 'No notes added yet. Click "Add Note" to create one.'}
                      </td>
                    </tr>
                  ) : (
                    filteredNotes.map((note) => (
                      <tr key={note.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getNoteTypeColor(note.note_type)}`}>
                            {note.note_type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{note.case_number}</span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-900 line-clamp-2 max-w-md">{note.content}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{note.created_by}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-600">{formatDate(note.created_at!)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {note.requires_follow_up && (
                            <span className="inline-flex items-center px-3 py-1 rounded bg-yellow-500 text-white text-xs font-medium">
                              Required
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {note.is_private && (
                            <span className="text-gray-500">🔒</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              title="Edit"
                              className="p-1.5 border border-blue-500 text-blue-500 rounded hover:bg-blue-50 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteNote(note.id!)}
                              title="Delete"
                              className="p-1.5 border border-red-500 text-red-500 rounded hover:bg-red-50 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Add Note Modal */}
      <AddNoteModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={fetchNotes}
      />
    </div>
  );
}
