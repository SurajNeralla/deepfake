import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { HistoryItem } from '../types';

export const History: React.FC = () => {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const [mediaFilter, setMediaFilter] = useState<string>('all');
  const [classFilter, setClassFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchHistory = () => {
    setLoading(true);
    api.getHistory(mediaFilter, classFilter, 50, 0)
      .then((data) => {
        setItems(data.items);
        setTotal(data.total);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchHistory();
  }, [mediaFilter, classFilter]);

  const filteredItems = items.filter((item) =>
    searchQuery === '' ? true : item.original_filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-white mb-1">Analysis Audit History</h1>
          <p className="font-body text-sm text-[#bbc9cf]">
            Comprehensive ledger of historical forensic inspections and manipulation scores.
          </p>
        </div>

        <Link to="/analyze" className="btn-primary px-4 py-2.5 rounded font-mono text-xs font-bold uppercase flex items-center gap-1.5">
          <span className="material-symbols-outlined text-base">add</span>
          New Scan
        </Link>
      </div>

      {/* Filter Controls Bar */}
      <div className="glass-card p-4 rounded-xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Search Field */}
          <div className="relative flex-1 sm:w-64">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#bbc9cf] text-base">search</span>
            <input
              type="text"
              placeholder="Search filename..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#121318] border border-white/10 rounded pl-9 pr-3 py-2 text-white focus:outline-none focus:border-[#00d1ff]"
            />
          </div>

          {/* Media Type Filter */}
          <select
            value={mediaFilter}
            onChange={(e) => setMediaFilter(e.target.value)}
            className="bg-[#121318] border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-[#00d1ff]"
          >
            <option value="all">All Media Types</option>
            <option value="image">Image Only</option>
            <option value="video">Video Only</option>
            <option value="audio">Audio Only</option>
          </select>

          {/* Classification Filter */}
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="bg-[#121318] border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-[#00d1ff]"
          >
            <option value="all">All Classifications</option>
            <option value="REAL">REAL</option>
            <option value="LIKELY REAL">LIKELY REAL</option>
            <option value="SUSPICIOUS">SUSPICIOUS</option>
            <option value="LIKELY FAKE">LIKELY FAKE</option>
          </select>
        </div>

        <span className="text-[#bbc9cf]">Total Records: {total}</span>
      </div>

      {/* History Table */}
      <div className="glass-card rounded-xl border border-white/10 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center font-mono text-xs text-[#bbc9cf]">Loading forensic audit history...</div>
        ) : filteredItems.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center gap-3">
            <span className="material-symbols-outlined text-4xl text-[#bbc9cf]/40">search_off</span>
            <p className="font-mono text-xs text-[#bbc9cf]">No forensic records matching your current filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-body text-sm">
              <thead className="bg-[#1a1b21] font-mono text-xs text-[#bbc9cf] uppercase border-b border-white/10">
                <tr>
                  <th className="p-4">Asset Name</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Classification</th>
                  <th className="p-4">Confidence</th>
                  <th className="p-4">Mode</th>
                  <th className="p-4">Execution Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredItems.map((item) => {
                  const badgeBg =
                    item.classification === 'REAL' || item.classification === 'LIKELY REAL'
                      ? 'bg-[#00fc92]/10 text-[#00fc92] border-[#00fc92]/30'
                      : 'bg-[#ffb4ab]/10 text-[#ffb4ab] border-[#ffb4ab]/30';

                  return (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-mono text-xs font-bold text-white max-w-[220px] truncate">
                        {item.original_filename}
                      </td>
                      <td className="p-4 font-mono text-xs text-[#bbc9cf] uppercase">{item.media_type}</td>
                      <td className="p-4">
                        <span className={`inline-block px-2.5 py-1 rounded border font-mono text-[10px] font-bold uppercase ${badgeBg}`}>
                          {item.classification}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-xs font-bold text-white">
                        {Math.round(item.confidence * 100)}%
                      </td>
                      <td className="p-4 font-mono text-[11px] text-[#bbc9cf]">
                        {item.is_demo_fallback ? 'Demo Heuristic' : 'AI Model'}
                      </td>
                      <td className="p-4 font-mono text-xs text-[#bbc9cf]">{item.created_at}</td>
                      <td className="p-4 text-right flex items-center justify-end gap-3">
                        <Link
                          to={`/results/${item.id}`}
                          className="font-mono text-xs text-[#00d1ff] hover:underline font-bold uppercase"
                        >
                          View
                        </Link>
                        <a
                          href={api.getReportExportUrl(item.id, 'pdf')}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono text-xs text-[#bbc9cf] hover:text-white hover:underline uppercase"
                        >
                          PDF
                        </a>
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
};
