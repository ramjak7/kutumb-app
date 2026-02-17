import React, { useState } from 'react';
import { useLanguage } from '@/modules/language/LanguageProvider';

// Placeholder for content blocks and translations
const contentBlocks = [
  { key: 'public.home.tagline', en: 'A community festival for all generations', hi: 'सभी पीढ़ियों के लिए एक सामुदायिक उत्सव' },
  { key: 'public.program.heading', en: 'Program Schedule', hi: 'कार्यक्रम अनुसूची' },
  // ...add more as needed
];

export default function AdminContentTranslation() {
  const { lang, t } = useLanguage();
  const [blocks, setBlocks] = useState(contentBlocks);
  const [editing, setEditing] = useState<string | null>(null);
  const [editEn, setEditEn] = useState('');
  const [editHi, setEditHi] = useState('');

  function startEdit(key: string, en: string, hi: string) {
    setEditing(key);
    setEditEn(en);
    setEditHi(hi);
  }

  function saveEdit(key: string) {
    setBlocks(blocks.map(b => b.key === key ? { ...b, en: editEn, hi: editHi } : b));
    setEditing(null);
    // TODO: Persist to DB
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-orange-700 mb-4">Content Translation Manager</h1>
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr>
            <th className="py-2 px-4 text-orange-600">Key</th>
            <th className="py-2 px-4 text-orange-600">English</th>
            <th className="py-2 px-4 text-orange-600">Hindi</th>
            <th className="py-2 px-4 text-orange-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {blocks.map(block => (
            <tr key={block.key} className="border-b last:border-b-0">
              <td className="py-2 px-4 font-mono text-xs">{block.key}</td>
              <td className="py-2 px-4">
                {editing === block.key ? (
                  <input value={editEn} onChange={e => setEditEn(e.target.value)} className="border rounded px-2 py-1 w-full" />
                ) : (
                  block.en
                )}
              </td>
              <td className="py-2 px-4">
                {editing === block.key ? (
                  <input value={editHi} onChange={e => setEditHi(e.target.value)} className="border rounded px-2 py-1 w-full" />
                ) : (
                  block.hi
                )}
              </td>
              <td className="py-2 px-4">
                {editing === block.key ? (
                  <button onClick={() => saveEdit(block.key)} className="px-3 py-1 bg-orange-500 text-white rounded mr-2">Save</button>
                ) : (
                  <button onClick={() => startEdit(block.key, block.en, block.hi)} className="px-3 py-1 bg-orange-100 text-orange-700 rounded">Edit</button>
                )}
                {editing === block.key && (
                  <button onClick={() => setEditing(null)} className="px-3 py-1 bg-gray-200 text-gray-700 rounded ml-2">Cancel</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
