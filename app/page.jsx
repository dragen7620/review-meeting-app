'use client';

import React, { useState, useEffect } from 'react';

// 已帶入您的專屬 GAS Web App 網址
const GAS_API_URL = "https://script.google.com/macros/s/AKfycbz12K5cJwuNMUnhF_DWlE6STZ39wNbldq7TUWv7zEjjeTfiHK3qpsoA7RwVfHVfEeHP/exec";

export default function Home() {
  const [config, setConfig] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resultLinks, setResultLinks] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(GAS_API_URL);
      const data = await res.json();
      setConfig(data.config);
      setProjects(data.projects);
    } catch (e) {
      alert("載入試算表資料失敗，請確認 Apps Script 權限是否設為「所有人」！");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTrigger = async (action) => {
    setLoading(true);
    try {
      const res = await fetch(GAS_API_URL, {
        method: 'POST',
        body: JSON.stringify({ action })
      });
      const data = await res.json();
      setResultLinks(data);
      alert('自動生成成功！請查看下方產出連結。');
    } catch (e) {
      alert('產生失敗，請稍候再試');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <header style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>審查會議資料自動化系統</h1>
        <p style={{ color: '#666' }}>Single Source of Truth 雲端全自動化工作站</p>
      </header>

      {config && (
        <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 10px 0' }}>{config.title}</h2>
          <p style={{ margin: '4px 0', color: '#4b5563' }}>📅 日期：{config.date} ｜ ⏰ 時間：{config.startTime} ｜ 📍 地點：{config.location}</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        <button 
          onClick={() => handleTrigger('GENERATE_AGENDA')} 
          disabled={loading}
          style={{ padding: '15px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
          📄 1. 一鍵生成會議議程 (Docs)
        </button>

        <button 
          onClick={() => handleTrigger('GENERATE_ATTENDANCE_FORM')} 
          disabled={loading}
          style={{ padding: '15px', background: '#059669', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
          📋 2. 一鍵生成出席名單表 (Forms)
        </button>

        <button 
          onClick={() => handleTrigger('GENERATE_REVIEW_SHEETS')} 
          disabled={loading}
          style={{ padding: '15px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
          📊 3. 裂變委員專屬審查表 (Sheets)
        </button>
      </div>

      {loading && <p style={{ color: '#2563eb', fontWeight: 'bold' }}>系統處理中，請稍候數秒...</p>}

      {resultLinks && (
        <div style={{ background: '#fef3c7', padding: '16px', borderRadius: '8px', border: '1px solid #fde68a', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#92400e' }}>🎉 產出結果：</h3>
          {resultLinks.url && <p><a href={resultLinks.url} target="_blank" rel="noreferrer" style={{ color: '#2563eb', fontWeight: 'bold' }}>👉 點此開啟已產出的 Docs 議程文件</a></p>}
          {resultLinks.formUrl && <p><a href={resultLinks.formUrl} target="_blank" rel="noreferrer" style={{ color: '#059669', fontWeight: 'bold' }}>👉 點此開啟受審單位填報表單</a></p>}
          {resultLinks.sheets && resultLinks.sheets.map((s, i) => (
            <p key={i}><a href={s.url} target="_blank" rel="noreferrer" style={{ color: '#4f46e5' }}>👉 {s.reviewer} 專屬審查表</a></p>
          ))}
        </div>
      )}

      <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
        <h3 style={{ margin: '0 0 12px 0' }}>當前排程案件清單（即時同步試算表）</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
              <th style={{ padding: '8px' }}>編號</th>
              <th style={{ padding: '8px' }}>總計畫</th>
              <th style={{ padding: '8px' }}>細部計畫</th>
              <th style={{ padding: '8px' }}>單位</th>
              <th style={{ padding: '8px' }}>經費(千元)</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '8px' }}>{p.caseId}</td>
                <td style={{ padding: '8px' }}>{p.mainTitle}</td>
                <td style={{ padding: '8px' }}>{p.subTitle}</td>
                <td style={{ padding: '8px' }}>{p.unit}</td>
                <td style={{ padding: '8px' }}>{p.budget}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
